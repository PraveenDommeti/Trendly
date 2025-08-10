
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MessageSquare, Share2, Bookmark, ShoppingBag, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSupabaseTrendly } from "../context/SupabaseTrendlyContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

// Legacy Post interface for backwards compatibility
interface LegacyUser {
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

interface LegacyProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  isExternal?: boolean;
  url?: string;
}

interface LegacyPost {
  id: string;
  user: LegacyUser;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  products: LegacyProduct[];
  createdAt: string;
}

interface PostCardProps {
  post: LegacyPost;
}

const PostCard = ({ post }: PostCardProps) => {
  const navigate = useNavigate();
  const { addToCart, addToWishlist, isInWishlist } = useSupabaseTrendly();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [animateLike, setAnimateLike] = useState(false);
  const [animateSave, setAnimateSave] = useState(false);
  const [animateShare, setAnimateShare] = useState(false);
  const [animateComment, setAnimateComment] = useState(false);

  // Function to parse hashtags from caption
  const parseHashtags = (text: string) => {
    const parts = text.split(/(#\w+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('#')) {
        return (
          <span key={index} className="text-blue-600 font-medium cursor-pointer hover:underline">
            {part}
          </span>
        );
      }
      return part;
    });
  };
  
  const handleCommentClick = () => {
    setAnimateComment(true);
    setTimeout(() => setAnimateComment(false), 500);
    toast({
      title: "Comments",
      description: "Comments feature coming soon!",
    });
  };
  
  const handleShareClick = () => {
    setAnimateShare(true);
    setTimeout(() => setAnimateShare(false), 500);
    
    const shareText = `Check out this amazing outfit by ${post.user.username}!`;
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: 'Trendly Post',
        text: shareText,
        url: shareUrl,
      }).catch((error) => {
        console.log('Error sharing', error);
        toast({
          title: "Copied to clipboard",
          description: "Post link copied to clipboard!",
        });
      });
    } else {
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`).then(() => {
        toast({
          title: "Copied to clipboard",
          description: "Post link copied to clipboard!",
        });
      });
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    if (!liked) {
      setAnimateLike(true);
      setTimeout(() => setAnimateLike(false), 500);
    }
  };

  const handleSave = () => {
    setSaved(!saved);
    if (!saved) {
      setAnimateSave(true);
      setTimeout(() => setAnimateSave(false), 500);
      
      post.products.forEach(product => {
        if (!product.isExternal) {
          const supabaseProduct = {
            id: product.id,
            name: product.name,
            price: product.price,
            image_url: product.image,
            category: product.category,
            description: null,
            brand: null,
            affiliate_link: null,
            is_internal: true,
            commission_rate: 0.1,
            stock_quantity: 100,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          if (!isInWishlist(product.id)) {
            addToWishlist(supabaseProduct);
          }
        }
      });
      
      toast({
        title: "Saved to wishlist",
        description: "Available products in this post have been saved to your wishlist.",
      });
    } else {
      toast({
        title: "Post unsaved",
        description: "This post has been unsaved.",
      });
    }
  };

  const handleAddToCart = async (productId: string) => {
    const product = post.products.find(p => p.id === productId);
    if (product && !product.isExternal) {
      const supabaseProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image,
        category: product.category,
        description: null,
        brand: null,
        affiliate_link: null,
        is_internal: true,
        commission_rate: 0.1,
        stock_quantity: 100,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      await addToCart(supabaseProduct);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    }
  };

  const handleAddToWishlist = (productId: string) => {
    const product = post.products.find(p => p.id === productId);
    if (product && !product.isExternal) {
      const supabaseProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image,
        category: product.category,
        description: null,
        brand: null,
        affiliate_link: null,
        is_internal: true,
        commission_rate: 0.1,
        stock_quantity: 100,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      addToWishlist(supabaseProduct);
      const isProductInWishlist = isInWishlist(product.id);
      
      toast({
        title: isProductInWishlist ? "Removed from wishlist" : "Added to wishlist",
        description: isProductInWishlist 
          ? `${product.name} has been removed from your wishlist.` 
          : `${product.name} has been added to your wishlist.`,
      });
    }
  };

  const handleExternalLink = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <motion.div 
      className="post-card bg-white shadow rounded-md mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Post Header */}
      <div className="flex items-center p-3">
        <motion.img 
          src={post.user.avatar} 
          alt={post.user.username} 
          className="w-8 h-8 rounded-full object-cover"
          whileHover={{ scale: 1.1 }}
        />
        <div className="ml-2">
          <p className="text-sm font-medium">{post.user.name}</p>
          <p className="text-xs text-gray-500">{post.createdAt}</p>
        </div>
      </div>
      
      {/* Post Image */}
      <div className="relative">
        <img 
          src={post.image} 
          alt="Post" 
          className="w-full aspect-square object-cover"
        />
        
        <div 
          className="absolute inset-0" 
          onDoubleClick={() => {
            if (!liked) {
              setLiked(true);
              setAnimateLike(true);
              setTimeout(() => setAnimateLike(false), 800);
            }
          }}
        >
          <AnimatePresence>
            {animateLike && (
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1.2 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Heart size={80} className="text-white fill-white drop-shadow-lg" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Post Actions */}
      <div className="flex justify-between p-3">
        <div className="flex space-x-4">
          <button onClick={handleLike} className="focus:outline-none relative">
            <motion.div
              animate={animateLike ? { scale: [1, 1.5, 1] } : {}}
              transition={{ duration: 0.3 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart 
                size={22} 
                className={cn(
                  "transition-colors", 
                  liked ? "fill-red-500 text-red-500" : "text-gray-700"
                )} 
              />
            </motion.div>
          </button>
          <button 
            className="focus:outline-none"
            onClick={handleCommentClick}
          >
            <motion.div
              animate={animateComment ? { scale: [1, 1.5, 1] } : {}}
              transition={{ duration: 0.3 }}
              whileTap={{ scale: 0.9 }}
            >
              <MessageSquare size={22} className="text-gray-700" />
            </motion.div>
          </button>
          <button 
            className="focus:outline-none"
            onClick={handleShareClick}
          >
            <motion.div
              animate={animateShare ? { scale: [1, 1.5, 1], rotate: [0, 15, 0] } : {}}
              transition={{ duration: 0.3 }}
              whileTap={{ scale: 0.9 }}
            >
              <Share2 size={22} className="text-gray-700" />
            </motion.div>
          </button>
        </div>
        <button onClick={handleSave} className="focus:outline-none relative">
          <motion.div
            animate={animateSave ? { scale: [1, 1.5, 1] } : {}}
            transition={{ duration: 0.3 }}
            whileTap={{ scale: 0.9 }}
          >
            <Bookmark 
              size={22} 
              className={cn(
                "transition-colors", 
                saved ? "fill-trendly-primary text-trendly-primary" : "text-gray-700"
              )} 
            />
          </motion.div>
        </button>
      </div>
      
      {/* Post Likes */}
      <div className="px-3 pb-2">
        <p className="text-sm font-medium">{liked ? post.likes + 1 : post.likes} likes</p>
      </div>
      
      {/* Post Caption - Updated with better color */}
      <div className="px-3 pb-3">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 shadow-sm">
          <p className="text-sm leading-relaxed">
            <span className="font-semibold text-gray-900 mr-2">{post.user.username}</span>
            <span className="text-gray-700">{parseHashtags(post.caption)}</span>
          </p>
        </div>
      </div>
      
      {/* Comments */}
      <div className="px-3 py-2">
        <p className="text-sm text-gray-500 cursor-pointer" onClick={handleCommentClick}>
          View all {post.comments} comments
        </p>
      </div>

      {/* Shop This Look Button - Now supports external links */}
      {post.products && post.products.length > 0 && (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button 
              className="mx-3 mb-3 w-[calc(100%-24px)] bg-trendly-primary hover:bg-trendly-dark"
            >
              <ShoppingBag size={16} className="mr-2" />
              Shop This Look ({post.products.length} {post.products.length === 1 ? 'item' : 'items'})
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Shop This Look</DialogTitle>
              <DialogDescription>Add products to your cart or visit external links.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 mt-2 overflow-y-auto">
              {post.products.map((product) => (
                <motion.div 
                  key={product.id} 
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center flex-1">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div className="ml-3 flex-1">
                      <p className="font-medium text-sm">{product.name}</p>
                      {product.isExternal ? (
                        <div className="flex items-center">
                          <ExternalLink size={12} className="mr-1 text-blue-500" />
                          <p className="text-sm text-blue-500">External Link</p>
                        </div>
                      ) : (
                        <p className="text-lg font-bold text-trendly-primary">₹{product.price}</p>
                      )}
                      {product.category && (
                        <p className="text-xs text-gray-500 capitalize">{product.category}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 ml-2">
                    {product.isExternal ? (
                      <motion.div whileTap={{ scale: 0.95 }}>
                        <Button 
                          size="sm" 
                          onClick={() => handleExternalLink(product.url || '#')}
                          className="bg-blue-500 hover:bg-blue-600 text-xs px-2 py-1"
                        >
                          <ExternalLink size={12} className="mr-1" />
                          Visit
                        </Button>
                      </motion.div>
                    ) : (
                      <>
                        <motion.button 
                          whileTap={{ scale: 0.9 }}
                          className="focus:outline-none"
                          onClick={() => handleAddToWishlist(product.id)}
                        >
                          <Heart 
                            size={18} 
                            className={isInWishlist(product.id) ? "text-red-500 fill-red-500" : "text-gray-400"} 
                          />
                        </motion.button>
                        <motion.div whileTap={{ scale: 0.95 }}>
                          <Button 
                            size="sm" 
                            onClick={() => handleAddToCart(product.id)}
                            className="bg-trendly-primary hover:bg-trendly-dark text-xs px-2 py-1"
                          >
                            Add to Cart
                          </Button>
                        </motion.div>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  );
};

export default PostCard;
