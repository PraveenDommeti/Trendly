
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useSupabaseTrendly } from "@/context/SupabaseTrendlyContext";

const SearchBar = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { products } = useSupabaseTrendly();

  const handleSearch = (productId: string) => {
    setOpen(false);
    setQuery("");
    navigate(`/product/${productId}`);
  };

  const filteredProducts = query
    ? products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="text-sm text-muted-foreground w-full justify-start pl-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
        onClick={() => setOpen(true)}
      >
        <Search size={16} className="mr-2" />
        Search products...
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search products..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>No products found</CommandEmpty>
          <CommandGroup heading="Products">
            {filteredProducts.map((product) => (
              <CommandItem
                key={product.id}
                onSelect={() => handleSearch(product.id)}
                className="flex items-center"
              >
                <div className="h-8 w-8 mr-2 overflow-hidden rounded-sm">
                  <img
                    src={product.image_url || '/placeholder.svg'}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span>{product.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  ₹{product.price}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default SearchBar;
