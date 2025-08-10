import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnalysisResult, Product, ProductMatch } from "@/services/aiAnalysisService";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ExternalLink, ShoppingBag, Sparkles, Star, Zap } from "lucide-react";
import { useEffect, useState } from "react";

interface SmartTaggingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean, newOccasion?: string) => void;
  analysisResult: AnalysisResult | null;
  productMatches: ProductMatch[];
  onSelectProduct: (product: Product) => void;
  selectedProducts: Product[];
  isAnalyzing: boolean;
}

const SmartTaggingDialog = ({
  open,
  onOpenChange,
  analysisResult,
  productMatches,
  onSelectProduct,
  selectedProducts,
  isAnalyzing
}: SmartTaggingDialogProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedOccasion, setSelectedOccasion] = useState<string>("");

  useEffect(() => {
    if (analysisResult?.outfitContext.occasion) {
      setSelectedOccasion(analysisResult.outfitContext.occasion);
    }
  }, [analysisResult]);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600";
    if (confidence >= 0.6) return "text-yellow-600";
    return "text-orange-600";
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return "High Match";
    if (confidence >= 0.6) return "Good Match";
    return "Possible Match";
  };

  const filteredMatches = selectedCategory 
    ? productMatches.filter(match => match.product.category === selectedCategory)
    : productMatches;

  const categories = [...new Set(productMatches.map(match => match.product.category))];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] min-h-[600px] overflow-hidden flex flex-col h-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            AI Smart Tagging
          </DialogTitle>
          <DialogDescription>
            AI-powered analysis of your outfit with smart product matching
          </DialogDescription>
        </DialogHeader>

        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="mb-4"
            >
              <Zap className="h-8 w-8 text-purple-500" />
            </motion.div>
            <p className="text-lg font-medium mb-2">Analyzing your outfit...</p>
            <p className="text-sm text-gray-500 mb-4">This may take a few seconds</p>
            <Progress value={75} className="w-48" />
          </div>
        ) : (
          <div className="flex-1 overflow-hidden flex flex-col">
            {analysisResult && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  Outfit Analysis
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs font-medium text-blue-700 mb-1">Occasion</p>
                    <Select value={selectedOccasion} onValueChange={setSelectedOccasion}>
                      <SelectTrigger className="w-full h-8 text-sm capitalize">
                        <SelectValue placeholder="Select Occasion" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="formal">Formal</SelectItem>
                        <SelectItem value="party">Party</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="athletic">Athletic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-xs font-medium text-green-700 mb-1">Style</p>
                    <p className="text-sm capitalize">{analysisResult.outfitContext.style}</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-xs font-medium text-purple-700 mb-1">Season</p>
                    <p className="text-sm capitalize">{analysisResult.outfitContext.season}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Detected Items:</p>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.detectedItems.map((item, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {item.category}: {item.color} {item.style}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {productMatches.length > 0 && (
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-trendly-primary" />
                    Matching Products ({productMatches.length})
                  </h3>
                  {productMatches.length > 3 && (
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <span>Scroll to see more</span>
                      <motion.div
                        animate={{ y: [0, 2, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-1 h-1 bg-gray-400 rounded-full"
                      />
                    </div>
                  )}
                </div>

                {categories.length > 1 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Button
                      variant={selectedCategory === null ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(null)}
                      className="text-xs"
                    >
                      All
                    </Button>
                    {categories.map(category => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className="text-xs capitalize"
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                )}

                <ScrollArea className="flex-1 min-h-0 dialog-scroll-area">
                  <div className="space-y-3 pr-4">
                    <AnimatePresence>
                      {filteredMatches.map((match, index) => {
                        const isSelected = selectedProducts.some(p => p.id === match.product.id);
                        return (
                          <motion.div
                            key={match.product.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ delay: index * 0.05 }}
                            className={`border rounded-lg p-3 hover:shadow-md transition-all ${
                              isSelected ? 'border-trendly-primary bg-trendly-primary/5' : 'border-gray-200'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <img
                                src={match.product.image_url || "/placeholder.svg"}
                                alt={match.product.name}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h4 className="font-medium text-sm truncate flex items-center gap-1">
                                      {match.product.name}
                                      {match.product.isExternal && (
                                        <ExternalLink className="h-3 w-3 text-gray-500" />
                                      )}
                                    </h4>
                                    <p className="text-xs text-gray-500 mb-1">
                                      {match.product.isExternal
                                        ? "External Link"
                                        : `₹${match.product.price} • ${match.product.brand}`}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2 ml-2">
                                    <div className="text-right">
                                      <p className={`text-xs font-medium ${getConfidenceColor(match.confidence)}`}>
                                        {Math.round(match.confidence * 100)}%
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {getConfidenceLabel(match.confidence)}
                                      </p>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant={isSelected ? "secondary" : "default"}
                                      onClick={() => onSelectProduct(match.product)}
                                      className="h-8 w-8 p-0"
                                    >
                                      {isSelected ? (
                                        <Check className="h-4 w-4" />
                                      ) : (
                                        <ShoppingBag className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </div>
                                </div>
                                <p className="text-xs text-gray-600 mb-2">
                                  {match.matchReason}
                                </p>
                                <div className="flex gap-1">
                                  <Badge variant="outline" className="text-xs px-1 py-0">
                                    Category: {Math.round(match.similarity.category * 100)}%
                                  </Badge>
                                  <Badge variant="outline" className="text-xs px-1 py-0">
                                    Style: {Math.round(match.similarity.style * 100)}%
                                  </Badge>
                                  <Badge variant="outline" className="text-xs px-1 py-0">
                                    Color: {Math.round(match.similarity.color * 100)}%
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </ScrollArea>
              </div>
            )}

            {!isAnalyzing && productMatches.length === 0 && (
              <div className="text-center py-8">
                <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No matching products found</p>
                <p className="text-sm text-gray-400">Try uploading a different image</p>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false, analysisResult?.outfitContext.occasion)}>
            Close
          </Button>
          {selectedProducts.length > 0 && (
            <Button 
              onClick={() => onOpenChange(false, selectedOccasion)}
              className="bg-trendly-primary hover:bg-trendly-dark"
            >
              Done ({selectedProducts.length} selected)
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SmartTaggingDialog;
