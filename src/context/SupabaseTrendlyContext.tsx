import LoadingOverlay from "@/components/LoadingOverlay";
import { toast } from "@/components/ui/use-toast";
import { additionalProducts } from "@/data/additionalProducts";
import { samplePosts } from "@/data/samplePosts";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

// Types based on Supabase tables
export interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  followers_count: number;
  following_count: number;
  streak_count: number;
  total_points: number;
  commission_earned: number;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string;
  brand: string | null;
  affiliate_link: string | null;
  is_internal: boolean;
  commission_rate: number;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  image_url: string;
  description: string | null;
  occasion: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  profiles: Profile;
  post_products: Array<{
    products: Product;
  }>;
}

export interface CartItem extends Product {
  quantity: number;
}

interface SupabaseTrendlyContextType {
  currentUser: Profile | null;
  posts: Post[];
  products: Product[];
  cart: CartItem[];
  wishlist: Product[];
  loading: boolean;
  refreshPosts: () => Promise<void>;
  refreshProducts: () => Promise<void>;
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateCartQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  likePost: (postId: string) => Promise<void>;
  createPost: (imageUrl: string, description: string, productIds: string[], occasion: string) => Promise<void>;
}

const SupabaseTrendlyContext = createContext<SupabaseTrendlyContextType | undefined>(undefined);

export const useSupabaseTrendly = () => {
  const context = useContext(SupabaseTrendlyContext);
  if (!context) {
    throw new Error("useSupabaseTrendly must be used within a SupabaseTrendlyProvider");
  }
  return context;
};

export const SupabaseTrendlyProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [networkLoading, setNetworkLoading] = useState(false);

  // Fetch current user profile
  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchCart();
    } else {
      setCurrentUser(null);
      setCart([]);
    }
  }, [user]);

  // Initial data fetch
  useEffect(() => {
    refreshPosts();
    refreshProducts();
  }, []);

  const fetchUserProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
    } else {
      setCurrentUser(data);
    }
  };

  const refreshPosts = async () => {
    setNetworkLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles (
          id,
          username,
          full_name,
          bio,
          avatar_url,
          followers_count,
          following_count,
          streak_count,
          total_points,
          commission_earned
        ),
        post_products (
          products (*)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      // Use sample posts if database fetch fails
      setPosts(samplePosts as Post[]);
    } else {
      const formattedPosts = (data || []).map(post => ({
        ...post,
        profiles: {
          ...post.profiles,
          bio: post.profiles.bio || null
        }
      }));
      
      // Combine database posts with sample posts
      const allPosts = [...formattedPosts, ...samplePosts as Post[]];
      setPosts(allPosts);
    }
    setLoading(false);
    setNetworkLoading(false);
  };

  const refreshProducts = async () => {
    setNetworkLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      // Extract products from sample posts and add additional products
      const sampleProducts = samplePosts.flatMap(post => 
        post.post_products.map(pp => pp.products)
      );
      setProducts([...sampleProducts as Product[], ...additionalProducts]);
    } else {
      // Combine database products with sample products and additional products
      const sampleProducts = samplePosts.flatMap(post => 
        post.post_products.map(pp => pp.products)
      );
      setProducts([...(data || []), ...sampleProducts as Product[], ...additionalProducts]);
    }
    setNetworkLoading(false);
  };

  const fetchCart = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        products (*)
      `)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching cart:', error);
    } else {
      const cartItems = data?.map(item => ({
        ...item.products,
        quantity: item.quantity
      })) || [];
      setCart(cartItems);
    }
  };

  const addToCart = async (product: Product) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to add items to cart.",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('cart_items')
      .upsert({
        user_id: user.id,
        product_id: product.id,
        quantity: 1
      }, {
        onConflict: 'user_id,product_id'
      });

    if (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart.",
        variant: "destructive",
      });
    } else {
      await fetchCart();
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (error) {
      console.error('Error removing from cart:', error);
    } else {
      await fetchCart();
    }
  };

  const updateCartQuantity = async (productId: string, quantity: number) => {
    if (!user) return;

    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (error) {
      console.error('Error updating cart quantity:', error);
    } else {
      await fetchCart();
    }
  };

  const clearCart = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      console.error('Error clearing cart:', error);
    } else {
      setCart([]);
    }
  };

  const addToWishlist = (product: Product) => {
    setWishlist(currentWishlist => {
      const isProductInWishlist = currentWishlist.some(item => item.id === product.id);
      if (isProductInWishlist) {
        return currentWishlist.filter(item => item.id !== product.id);
      }
      return [...currentWishlist, product];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(currentWishlist => currentWishlist.filter(item => item.id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.id === productId);
  };

  const likePost = async (postId: string) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to like posts.",
        variant: "destructive",
      });
      return;
    }

    setNetworkLoading(true);

    // Check if already liked
    const { data: existingLike } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', user.id)
      .eq('post_id', postId)
      .single();

    if (existingLike) {
      // Unlike
      await supabase
        .from('likes')
        .delete()
        .eq('user_id', user.id)
        .eq('post_id', postId);
      
      // Update likes count manually
      const { data: post } = await supabase
        .from('posts')
        .select('likes_count')
        .eq('id', postId)
        .single();
        
      if (post) {
        await supabase
          .from('posts')
          .update({ likes_count: Math.max(0, (post.likes_count || 0) - 1) })
          .eq('id', postId);
      }
    } else {
      // Like
      await supabase
        .from('likes')
        .insert({
          user_id: user.id,
          post_id: postId
        });
      
      // Update likes count manually
      const { data: post } = await supabase
        .from('posts')
        .select('likes_count')
        .eq('id', postId)
        .single();
        
      if (post) {
        await supabase
          .from('posts')
          .update({ likes_count: (post.likes_count || 0) + 1 })
          .eq('id', postId);
      }
    }

    await refreshPosts();
    setNetworkLoading(false);
  };

  const createPost = async (imageUrl: string, description: string, productIds: string[], occasion: string) => {
    if (!user) return;

    setNetworkLoading(true);

    const { data: newPost, error } = await supabase
      .from('posts')
      .insert({
        user_id: user.id,
        image_url: imageUrl,
        description,
        occasion
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating post:', error);
      setNetworkLoading(false);
      throw error;
    }

    // Tag products
    if (productIds.length > 0) {
      const productTags = productIds.map(productId => ({
        post_id: newPost.id,
        product_id: productId
      }));

      const { error: productError } = await supabase
        .from('post_products')
        .insert(productTags);
        
      if (productError) {
        console.error('Error tagging products:', productError);
      }
    }

    await refreshPosts();
    setNetworkLoading(false);
  };

  return (
    <>
      <SupabaseTrendlyContext.Provider
        value={{
          currentUser,
          posts,
          products,
          cart,
          wishlist,
          loading,
          refreshPosts,
          refreshProducts,
          addToCart,
          removeFromCart,
          updateCartQuantity,
          clearCart,
          addToWishlist,
          removeFromWishlist,
          isInWishlist,
          likePost,
          createPost,
        }}
      >
        {children}
      </SupabaseTrendlyContext.Provider>
      
      {/* Network loading overlay */}
      <LoadingOverlay 
        isVisible={networkLoading} 
        message="Processing..." 
      />
    </>
  );
};
