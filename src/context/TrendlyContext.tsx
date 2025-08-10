import { createContext, useContext, useState, ReactNode } from "react";

// Types
export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  streak: number;
  points: number;
  bio: string;
  followers: number;
  following: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
}

export interface Post {
  id: string;
  user: User;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  products: Product[];
  createdAt: string;
}

export interface CartItem extends Product {
  quantity: number;
}

interface TrendlyContextType {
  currentUser: User | null;
  cart: CartItem[];
  wishlist: Product[];
  posts: Post[];
  products: Product[];
  leaderboard: User[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const TrendlyContext = createContext<TrendlyContextType | undefined>(undefined);

export const useTrendly = () => {
  const context = useContext(TrendlyContext);
  if (!context) {
    throw new Error("useTrendly must be used within a TrendlyProvider");
  }
  return context;
};

export const TrendlyProvider = ({ children }: { children: ReactNode }) => {
  // Mock current user
  const [currentUser] = useState<User>({
    id: "1",
    name: "Sophia",
    username: "sophia_style",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=256&auto=format&fit=crop",
    streak: 2,
    points: 10,
    bio: "Aspiring fashionista",
    followers: 230,
    following: 185,
  });

  // Mock products
  const [products] = useState<Product[]>([
    {
      id: "1",
      name: "Casual Blazer",
      price: 2450,
      image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=150&auto=format&fit=crop",
      category: "Tops",
      rating: 4.5,
    },
    {
      id: "2",
      name: "Tank Top",
      price: 799,
      image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=150&auto=format&fit=crop",
      category: "Tops",
      rating: 4.2,
    },
    {
      id: "3",
      name: "Wide Leg Pants",
      price: 1899,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=150&auto=format&fit=crop",
      category: "Bottoms",
      rating: 4.7,
    },
    {
      id: "4",
      name: "Canvas Sneakers",
      price: 1499,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=150&auto=format&fit=crop",
      category: "Footwear",
      rating: 4.3,
    },
    {
      id: "5",
      name: "Statement Earrings",
      price: 599,
      image: "https://images.unsplash.com/photo-1610694955371-d4a34a34e54c?q=80&w=150&auto=format&fit=crop",
      category: "Accessories",
      rating: 4.8,
    },
  ]);

  // Mock users for leaderboard
  const [leaderboard] = useState<User[]>([
    {
      id: "2",
      name: "Olivia",
      username: "olivia_trendy",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop",
      streak: 7,
      points: 8920,
      bio: "Fashion blogger",
      followers: 5600,
      following: 890,
    },
    {
      id: "3",
      name: "Noah",
      username: "noah_styles",
      avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=256&auto=format&fit=crop",
      streak: 5,
      points: 7530,
      bio: "Streetwear enthusiast",
      followers: 4300,
      following: 750,
    },
    {
      id: "4",
      name: "Ethan",
      username: "ethan_fashion",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=256&auto=format&fit=crop",
      streak: 4,
      points: 7230,
      bio: "Casual streetwear",
      followers: 3900,
      following: 650,
    },
  ]);

  // Posts data
  const [posts] = useState<Post[]>([
    {
      id: "1",
      user: {
        id: "3",
        name: "Noah",
        username: "noah_styles",
        avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=256&auto=format&fit=crop",
        streak: 5,
        points: 7530,
        bio: "Streetwear enthusiast",
        followers: 4300,
        following: 750,
      },
      image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=600&auto=format&fit=crop",
      caption: "Today's minimal fit 🔥 #mensfashion #streetwear",
      likes: 126,
      comments: 24,
      products: [products[0], products[2], products[3]],
      createdAt: "2h ago",
    },
    {
      id: "2",
      user: {
        id: "4",
        name: "Ethan",
        username: "ethan_fashion",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=256&auto=format&fit=crop",
        streak: 4,
        points: 7230,
        bio: "Casual streetwear",
        followers: 3900,
        following: 650,
      },
      image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600&auto=format&fit=crop",
      caption: "Streetwear vibes for the weekend #urbanstyle",
      likes: 98,
      comments: 14,
      products: [products[1], products[3]],
      createdAt: "5h ago",
    },
    {
      id: "3",
      user: {
        id: "2",
        name: "Olivia",
        username: "olivia_trendy",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop",
        streak: 7,
        points: 8920,
        bio: "Fashion blogger",
        followers: 5600,
        following: 890,
      },
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
      caption: "Summer outfit of the day! ☀️ #summerstyle #ootd",
      likes: 212,
      comments: 35,
      products: [products[1], products[4]],
      createdAt: "8h ago",
    }
  ]);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Wishlist state
  const [wishlist, setWishlist] = useState<Product[]>([]);

  // Cart functions
  const addToCart = (product: Product) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === product.id);
      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist functions
  const addToWishlist = (product: Product) => {
    setWishlist((currentWishlist) => {
      const isProductInWishlist = currentWishlist.some(item => item.id === product.id);
      if (isProductInWishlist) {
        return currentWishlist.filter(item => item.id !== product.id);
      }
      return [...currentWishlist, product];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((currentWishlist) => currentWishlist.filter(item => item.id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.id === productId);
  };

  return (
    <TrendlyContext.Provider
      value={{
        currentUser,
        cart,
        wishlist,
        posts,
        products,
        leaderboard,
        addToCart,
        removeFromCart,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </TrendlyContext.Provider>
  );
};
