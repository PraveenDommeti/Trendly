
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trash } from "lucide-react";
import { useTrendly } from "../context/TrendlyContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, addToCart } = useTrendly();
  const navigate = useNavigate();

  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId);
    toast({
      title: "Removed from wishlist",
      description: "Product has been removed from your wishlist.",
    });
  };

  const handleAddToCart = (productId: string) => {
    const product = wishlist.find(item => item.id === productId);
    if (product) {
      addToCart(product);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    }
  };

  return (
    <div>
      <div className="sticky top-0 z-10 bg-background border-b p-4 flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="mr-4">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Wishlist</h1>
        </div>
      </div>

      <div className="p-4">
        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <h2 className="text-lg font-medium mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6 text-center">Save items you love to your wishlist and find them here later</p>
            <Button 
              onClick={() => navigate("/shop")} 
              className="bg-trendly-primary hover:bg-trendly-dark"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {wishlist.map((product) => (
              <motion.div
                key={product.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 flex"
                layout
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded"
                  onClick={() => navigate(`/product/${product.id}`)}
                />
                <div className="flex-1 ml-3 flex flex-col justify-between">
                  <div>
                    <h3 
                      className="font-medium cursor-pointer"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      {product.name}
                    </h3>
                    <p className="text-trendly-primary font-semibold">₹{product.price}</p>
                  </div>
                  <div className="flex space-x-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleRemoveFromWishlist(product.id)}
                    >
                      <Trash size={16} className="mr-1" /> Remove
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-trendly-primary hover:bg-trendly-dark"
                      onClick={() => handleAddToCart(product.id)}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
