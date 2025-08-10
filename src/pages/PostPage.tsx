
import SmartTaggingDialog from "@/components/SmartTaggingDialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { aiAnalysisService, AnalysisResult, Product, ProductMatch } from "@/services/aiAnalysisService";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Search, ShoppingBag, Sparkles, Tag, Upload, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSupabaseTrendly } from "../context/SupabaseTrendlyContext";

const PostPage = () => {
  const navigate = useNavigate();
  const { products, createPost } = useSupabaseTrendly();
  const [caption, setCaption] = useState("");
  const [occasion, setOccasion] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [taggedProducts, setTaggedProducts] = useState<Product[]>([]);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [showExternalDialog, setShowExternalDialog] = useState(false);
  const [externalProducts, setExternalProducts] = useState<Array<any>>([]);
  const [showSmartTagDialog, setShowSmartTagDialog] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [productMatches, setProductMatches] = useState<ProductMatch[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAiAnalysis = async () => {
    if (!imageFile) {
      toast({
        title: "Image Required",
        description: "Please upload an image to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setShowSmartTagDialog(true);

    try {
      const analysis = await aiAnalysisService.analyzeOutfitImage(imageFile);
      setAnalysisResult(analysis);

      const matches = await aiAnalysisService.findMatchingProducts(analysis);
      setProductMatches(matches);
    } catch (error) {
      console.error("AI Analysis failed:", error);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddProduct = (product: any) => {
    if (!taggedProducts.some(p => p.id === product.id)) {
      setTaggedProducts([...taggedProducts, product]);
      toast({
        title: "Product Tagged",
        description: `${product.name} added to your post.`,
      });
    } else {
      handleRemoveProduct(product.id);
      toast({
        title: "Product Untagged",
        description: `${product.name} removed from your post.`,
        variant: "destructive",
      });
    }
    // Do not close the dialog here to allow multiple selections
    // setShowProductDialog(false); 
  };

  const handleRemoveProduct = (productId: string) => {
    setTaggedProducts(taggedProducts.filter(p => p.id !== productId));
  };

  const handleAddExternalProduct = () => {
    if (externalLink.trim() === "") {
      toast({
        title: "Link Required",
        description: "Please enter a valid product URL.",
        variant: "destructive",
      });
      return;
    }

    // Create a simple external product object
    const newExternalProduct: Product = {
      id: `ext-${Date.now()}`,
      name: "External Product",
      url: externalLink,
      isExternal: true,
      category: "external",
      description: externalLink,
    };

    setExternalProducts([...externalProducts, newExternalProduct]);
    setTaggedProducts([...taggedProducts, newExternalProduct]);
    setExternalLink("");
    setShowExternalDialog(false);

    toast({
      title: "External Link Added",
      description: "External product link has been added to your post.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!image) {
      toast({
        title: "Image Required",
        description: "Please upload an image of your outfit",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Extract only internal product IDs for the createPost function
      const internalProductIds = taggedProducts
        .filter(product => !product.isExternal)
        .map(product => product.id);
      
      await createPost(image, caption, internalProductIds, occasion);
      
      toast({
        title: "Post Uploaded",
        description: "Your outfit has been posted successfully!",
      });
      
      // Navigate back to home
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredProducts = searchTerm 
    ? products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products;

  return (
    <div className="pb-20">
      <div className="sticky top-0 z-10 bg-background border-b p-4 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Post Outfit</h1>
      </div>

      <form onSubmit={handleSubmit} className="p-4">
        <div className="mb-6">
          <label 
            htmlFor="image" 
            className={`block w-full rounded-md border-2 border-dashed cursor-pointer ${
              image ? 'border-none p-0' : 'border-gray-300 p-6'
            }`}
          >
            {image ? (
              <AspectRatio ratio={1/1} className="bg-muted overflow-hidden rounded-md">
                <img 
                  src={image} 
                  alt="Preview" 
                  className="w-full h-full object-cover rounded-md"
                />
              </AspectRatio>
            ) : (
              <motion.div 
                className="flex flex-col items-center justify-center py-12"
                whileHover={{ scale: 1.02 }}
              >
                <Upload size={48} className="text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Tap to upload your outfit</p>
              </motion.div>
            )}
          </label>
          <Input 
            type="file" 
            id="image" 
            accept="image/*" 
            onChange={handleImageChange} 
            className="hidden"
          />
        </div>

        <div className="mb-6">
          <Textarea
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="resize-none"
            rows={3}
          />
        </div>

        {(taggedProducts.length > 0) && (
          <div className="mb-6">
            <h3 className="font-medium mb-2 flex items-center">
              <ShoppingBag size={16} className="mr-2" />
              Tagged Products
            </h3>
            <ScrollArea className="h-[140px] rounded-md border p-3">
              <AnimatePresence>
                {taggedProducts.map(product => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex items-center justify-between mb-3 last:mb-0 bg-gray-50 p-2 rounded"
                  >
                    {product.isExternal ? (
                      <div className="flex-1 overflow-hidden">
                        <p className="font-medium truncate">{product.url}</p>
                        <p className="text-xs text-gray-500">External Link</p>
                      </div>
                    ) : (
                      <>
                        <img 
                          src={product.image_url || "/placeholder.svg"} 
                          alt={product.name} 
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div className="flex-1 px-3 overflow-hidden">
                          <p className="font-medium truncate">{product.name}</p>
                          <p className="text-xs text-gray-500">₹{product.price} · {product.category}</p>
                        </div>
                      </>
                    )}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveProduct(product.id)}
                      className="p-1"
                    >
                      <X size={16} className="text-gray-500" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </ScrollArea>
          </div>
        )}

        <div className="flex gap-3 mb-6">
          <Button 
            type="button" 
            variant="outline" 
            className="flex-1 border-trendly-primary text-trendly-primary flex items-center justify-center"
            onClick={() => setShowProductDialog(true)}
          >
            <Tag size={16} className="mr-2" />
            Internal Products
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            className="flex-1 border-trendly-primary text-trendly-primary flex items-center justify-center"
            onClick={() => setShowExternalDialog(true)}
          >
            <Tag size={16} className="mr-2" />
            External Link
          </Button>
        </div>

        <div className="mb-6">
          <Button
            type="button"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center"
            onClick={handleAiAnalysis}
            disabled={!image || isAnalyzing}
          >
            <Sparkles size={16} className="mr-2" />
            {isAnalyzing ? "Analyzing..." : "AI Analyze & Tag"}
          </Button>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-trendly-primary hover:bg-trendly-dark"
        >
          Post
        </Button>
      </form>

      {/* Internal Products Dialog */}
      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Tag Products</DialogTitle>
            <DialogDescription>Add products from our store to your post.</DialogDescription>
          </DialogHeader>
          
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <Input 
              placeholder="Search products..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <ScrollArea className="flex-1">
            <div className="grid gap-4 pr-2">
              {filteredProducts.length === 0 ? (
                <p className="text-center py-8 text-gray-500">No products found</p>
              ) : (
                filteredProducts.map((product, index) => (
                  <motion.div 
                    key={`${product.id}-${index}`} 
                    className="flex items-center justify-between hover:bg-gray-50 p-2 rounded"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center">
                      <img 
                        src={product.image_url || "/placeholder.svg"} 
                        alt={product.name} 
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="ml-3">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">₹{product.price} · {product.category}</p>
                      </div>
                    </div>
                    <motion.div 
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        size="sm" 
                        onClick={() => handleAddProduct(product)}
                        variant={taggedProducts.some(p => p.id === product.id) ? "secondary" : "default"}
                        className={taggedProducts.some(p => p.id === product.id) ? "bg-gray-200" : "bg-trendly-primary hover:bg-trendly-dark"}
                        disabled={taggedProducts.some(p => p.id === product.id)}
                      >
                        {taggedProducts.some(p => p.id === product.id) ? "Added" : "Add"}
                      </Button>
                    </motion.div>
                  </motion.div>
                ))
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      
      {/* External Link Dialog */}
      <Dialog open={showExternalDialog} onOpenChange={setShowExternalDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add External Product</DialogTitle>
            <DialogDescription>Add a link to an external product.</DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Input 
              placeholder="Paste product URL here..."
              value={externalLink}
              onChange={(e) => setExternalLink(e.target.value)}
            />
          </div>
          
          <Button 
            onClick={handleAddExternalProduct}
            className="w-full bg-trendly-primary hover:bg-trendly-dark"
          >
            Add External Link
          </Button>
        </DialogContent>
      </Dialog>

      <SmartTaggingDialog
        open={showSmartTagDialog}
        onOpenChange={(open, newOccasion) => {
          setShowSmartTagDialog(open);
          if (!open && newOccasion) {
            setOccasion(newOccasion);
          }
        }}
        analysisResult={analysisResult}
        productMatches={productMatches}
        onSelectProduct={handleAddProduct}
        selectedProducts={taggedProducts}
        isAnalyzing={isAnalyzing}
      />
    </div>
  );
};

export default PostPage;
