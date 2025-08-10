
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSupabaseTrendly } from "../context/SupabaseTrendlyContext";
import ProductCard from "../components/ProductCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart, BadgeAlert, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const ShoppingPage = () => {
  const { products, cart, wishlist } = useSupabaseTrendly();
  const [activeCategory, setActiveCategory] = useState("all");
  const navigate = useNavigate();

  const categories = ["all", "tops", "bottoms", "footwear", "accessories"];
  
  const filteredProducts = activeCategory === "all" 
    ? products 
    : products.filter(product => product.category === activeCategory);

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="flex flex-col h-screen">
      <div className="sticky top-0 z-10 bg-background border-b p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Shopping</h1>
        <div className="flex space-x-4">
          <motion.div whileTap={{ scale: 0.9 }} onClick={() => navigate("/wishlist")}>
            <div className="relative cursor-pointer">
              <Heart size={24} className={wishlist.length > 0 ? "text-red-500" : ""} />
              {wishlist.length > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                  {wishlist.length}
                </Badge>
              )}
            </div>
          </motion.div>
          <motion.div whileTap={{ scale: 0.9 }} onClick={() => navigate("/checkout")}>
            <div className="relative cursor-pointer">
              <ShoppingCart size={24} />
              {cartItemsCount > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                  {cartItemsCount}
                </Badge>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <Tabs defaultValue="all" className="flex flex-col flex-1 overflow-hidden">
        <div className="border-b overflow-x-auto flex-shrink-0">
          <TabsList className="w-full justify-start">
            {categories.map((category) => (
              <TabsTrigger 
                key={category} 
                value={category}
                onClick={() => setActiveCategory(category)}
                className="px-4 capitalize"
              >
                {category === "all" ? "All" : category}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-4 grid grid-cols-2 gap-4 pb-20">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default ShoppingPage;
