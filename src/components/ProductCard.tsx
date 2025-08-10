
import { useState } from "react";
import { Star, Heart } from "lucide-react";
import { useSupabaseTrendly, Product } from "../context/SupabaseTrendlyContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import ProductDetailPopup from "./ProductDetailPopup";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, addToWishlist, isInWishlist } = useSupabaseTrendly();
  const [showPopup, setShowPopup] = useState(false);
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await addToCart(product);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToWishlist(product);
    
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: isWishlisted 
        ? `${product.name} has been removed from your wishlist.` 
        : `${product.name} has been added to your wishlist.`,
    });
  };

  const handleCardClick = () => {
    setShowPopup(true);
  };

  return (
    <>
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-700/20 overflow-hidden cursor-pointer"
        onClick={handleCardClick}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
      >
        <div className="relative">
          <img 
            src={product.image_url || '/placeholder.svg'} 
            alt={product.name} 
            className="w-full h-40 object-cover"
          />
          <div className="absolute top-2 right-2">
            <motion.button 
              className="bg-white dark:bg-gray-800 p-1.5 rounded-full shadow-md"
              onClick={handleToggleWishlist}
              whileTap={{ scale: 0.8 }}
            >
              <Heart 
                size={18} 
                className={isWishlisted ? "text-red-500 fill-red-500" : "text-gray-500"} 
              />
            </motion.button>
          </div>
          <div className="absolute bottom-2 right-2 bg-white dark:bg-gray-800 px-2 py-1 rounded-full flex items-center text-xs">
            <Star size={12} className="text-yellow-500 mr-1 fill-yellow-500" />
            <span>4.5</span>
          </div>
        </div>
        <div className="p-3">
          <h3 className="font-medium text-sm truncate dark:text-gray-100">{product.name}</h3>
          <p className="text-trendly-primary font-semibold mt-1">₹{product.price}</p>
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button 
              onClick={handleAddToCart}
              className="w-full mt-2 bg-trendly-primary hover:bg-trendly-dark text-white text-sm h-8"
            >
              Add to Cart
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <ProductDetailPopup
        product={product}
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
      />
    </>
  );
};

export default ProductCard;
