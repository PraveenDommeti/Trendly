
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, ShoppingCart, Check, Heart } from "lucide-react";
import { useTrendly } from "../context/TrendlyContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart, cart, addToWishlist, isInWishlist } = useTrendly();
  const [addedAnimation, setAddedAnimation] = useState(false);
  
  const product = products.find(p => p.id === id);
  const itemInCart = cart.find(item => item.id === id);
  const isWishlisted = product ? isInWishlist(product.id) : false;
  
  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p>Product not found</p>
        <Button onClick={() => navigate("/shop")} className="mt-4">
          Back to Shop
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1000);
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleToggleWishlist = () => {
    addToWishlist(product);
    
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: isWishlisted 
        ? `${product.name} has been removed from your wishlist.` 
        : `${product.name} has been added to your wishlist.`,
    });
  };

  return (
    <div>
      <div className="sticky top-0 z-10 bg-background border-b p-4 flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="mr-4">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Product</h1>
        </div>
        <div className="flex items-center space-x-4">
          <motion.button 
            className="relative cursor-pointer"
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleWishlist}
          >
            <Heart size={24} className={isWishlisted ? "text-red-500 fill-red-500" : ""} />
          </motion.button>
          <motion.div whileTap={{ scale: 0.9 }} onClick={() => navigate("/checkout")}>
            <div className="relative cursor-pointer">
              <ShoppingCart size={24} />
              {cart.length > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                  {cart.reduce((acc, item) => acc + item.quantity, 0)}
                </Badge>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="relative">
        <motion.img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-80 object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <motion.h2 
            className="text-2xl font-bold"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {product.name}
          </motion.h2>
          <div className="flex items-center bg-gray-100 px-2 py-1 rounded-md">
            <Star size={16} className="text-yellow-500 fill-yellow-500 mr-1" />
            <span>{product.rating}</span>
          </div>
        </div>
        
        <motion.p 
          className="text-xl font-bold text-trendly-primary mt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          ₹{product.price}
        </motion.p>
        
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-gray-600">
            This stylish {product.name.toLowerCase()} is perfect for any occasion. 
            Made with high-quality materials for comfort and durability, this {product.category.toLowerCase()} 
            will elevate your wardrobe with its contemporary design and premium finish.
          </p>
        </motion.div>
        
        <motion.div 
          className="mt-6 flex space-x-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <motion.div 
            whileTap={{ scale: 0.95 }}
            className="flex-1"
          >
            <Button 
              onClick={handleAddToCart}
              className={`flex-1 w-full ${addedAnimation ? 'bg-green-600' : 'bg-trendly-primary'} hover:bg-trendly-dark`}
            >
              {addedAnimation ? (
                <>
                  <Check size={18} className="mr-1" /> Added
                </>
              ) : (
                <>
                  Add to Cart {itemInCart && `(${itemInCart.quantity})`}
                </>
              )}
            </Button>
          </motion.div>
          <motion.div 
            whileTap={{ scale: 0.95 }}
            className="flex-1"
          >
            <Button 
              onClick={() => navigate("/checkout")}
              className="flex-1 w-full bg-black hover:bg-gray-800"
            >
              Buy Now
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
