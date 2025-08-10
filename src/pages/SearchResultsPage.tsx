
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useSupabaseTrendly } from "@/context/SupabaseTrendlyContext";
import ProductCardAdapter from "@/components/ProductCardAdapter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { products } = useSupabaseTrendly();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [filteredProducts, setFilteredProducts] = useState(products);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  useEffect(() => {
    if (searchQuery) {
      const results = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(results);
    } else {
      setFilteredProducts([]);
    }
  }, [searchQuery, products]);

  return (
    <div>
      <div className="sticky top-0 z-10 bg-background border-b p-4 flex flex-col gap-3">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="mr-4">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Search</h1>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">Search</Button>
        </form>
      </div>

      <div className="p-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No products found</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {filteredProducts.map((product) => (
              <ProductCardAdapter key={product.id} product={product} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
