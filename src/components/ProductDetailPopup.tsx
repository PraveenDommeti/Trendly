
import { useState } from "react";
import { X, Star, Minus, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSupabaseTrendly, Product } from "../context/SupabaseTrendlyContext";
import { toast } from "@/components/ui/use-toast";

interface ProductDetailPopupProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailPopup = ({ product, isOpen, onClose }: ProductDetailPopupProps) => {
  const { addToCart, addToWishlist, isInWishlist } = useSupabaseTrendly();
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast({
        title: "Please select a size",
        description: "You need to select a size before adding to cart.",
        variant: "destructive",
      });
      return;
    }

    setIsAddingToCart(true);
    try {
      for (let i = 0; i < quantity; i++) {
        await addToCart(product);
      }
      
      toast({
        title: "Added to cart",
        description: `${product.name} (Size: ${selectedSize}) has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
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

  const handleBuyNow = async () => {
    if (!selectedSize) {
      toast({
        title: "Please select a size",
        description: "You need to select a size before purchasing.",
        variant: "destructive",
      });
      return;
    }

    await handleAddToCart();
    // Navigate to checkout would go here
    toast({
      title: "Redirecting to checkout",
      description: "Taking you to complete your purchase...",
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b p-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Product Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <X size={20} />
            </button>
          </div>

          {/* Product Image */}
          <div className="relative">
            <img
              src={product.image_url || '/placeholder.svg'}
              alt={product.name}
              className="w-full h-80 object-cover"
            />
            <button
              onClick={handleToggleWishlist}
              className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full shadow-md"
            >
              <Star
                size={20}
                className={isWishlisted ? "text-red-500 fill-red-500" : "text-gray-600"}
              />
            </button>
          </div>

          {/* Product Info */}
          <div className="p-4 space-y-4">
            {/* Title & Price */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {product.name}
              </h3>
              <div className="flex items-center justify-between mt-2">
                <p className="text-2xl font-bold text-trendly-primary">
                  ₹{product.price}
                </p>
                <Badge variant="secondary">{product.brand}</Badge>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <span className="ml-1 text-sm">4.5</span>
              </div>
              <span className="text-sm text-gray-500">({product.stock_quantity} in stock)</span>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Size Selection */}
            <div>
              <h4 className="font-semibold mb-3">Size</h4>
              <div className="grid grid-cols-6 gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 px-3 border rounded-md text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? "border-trendly-primary bg-trendly-primary text-white"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selection */}
            <div>
              <h4 className="font-semibold mb-3">Quantity</h4>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-2 border rounded-md min-w-[60px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <Button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="w-full bg-trendly-primary hover:bg-trendly-dark"
              >
                {isAddingToCart ? "Adding..." : "Add to Cart"}
              </Button>
              <Button
                onClick={handleBuyNow}
                variant="outline"
                className="w-full border-trendly-primary text-trendly-primary hover:bg-trendly-primary hover:text-white"
              >
                Buy Now
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductDetailPopup;
