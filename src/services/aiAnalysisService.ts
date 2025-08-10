import { additionalProducts } from '@/data/additionalProducts';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export interface DetectedItem {
  category: string;
  description: string;
  color: string;
  style: string;
  confidence: number;
  attributes: string[];
}

export interface AnalysisResult {
  detectedItems: DetectedItem[];
  outfitContext: {
    occasion: string;
    style: string;
    season: string;
  };
  modelContext: {
    bodyType?: string;
    skinTone?: string;
    stylePreference?: string;
  };
}

export interface Product {
  id: string;
  name: string;
  price?: number;
  brand?: string;
  category: string;
  image_url?: string;
  description: string;
  isExternal?: boolean;
  url?: string;
}

export interface ProductMatch {
  product: Product;
  confidence: number;
  matchReason: string;
  similarity: {
    category: number;
    color: number;
    style: number;
    overall: number;
  };
}

// Simple Logger implementation
class Logger {
  info(message: string) {
    console.info(`[INFO] ${message}`);
  }
  error(message: string, error?: unknown) {
    if (error) {
      console.error(`[ERROR] ${message}`, error);
    } else {
      console.error(`[ERROR] ${message}`);
    }
  }
}

export interface ProductMatcher {
  findMatches(analysisResult: AnalysisResult): Promise<ProductMatch[]>;
}

/**
 * Service for analyzing outfit images using AI and finding matching products.
 */
export class AIAnalysisService {
  private model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  private logger = new Logger();
  private config = {
    internalMatchThreshold: 0.4,
    externalMatchThreshold: 0.2
  };

  private matchers: ProductMatcher[] = [];

  /**
   * Initializes the AIAnalysisService and registers default product matchers.
   */
  constructor() {
    // Register default matchers
    this.matchers.push({
      findMatches: async (analysisResult: AnalysisResult) => {
        return this.findInternalMatches(analysisResult);
      }
    });
    this.matchers.push({
      findMatches: async (analysisResult: AnalysisResult) => {
        return this.findExternalMatches(analysisResult);
      }
    });
  }

  /**
   * Analyzes an outfit image file and returns detailed analysis results.
   * @param imageFile The image file to analyze.
   * @returns A promise resolving to the analysis result.
   */
  async analyzeOutfitImage(imageFile: File): Promise<AnalysisResult> {
    const startTime = Date.now();
    try {
      // Convert file to base64
      const imageBase64 = await this.fileToBase64(imageFile);
      
      const prompt = `
        Analyze this fashion outfit image and provide detailed information in JSON format:
        
        1. Identify all clothing items and accessories visible
        2. Determine the outfit context (occasion, style, season)
        3. Analyze the model's characteristics if visible
        4. Pay special attention to COLORS - be very specific about color names
        
        IMPORTANT COLOR GUIDELINES:
        - Use specific color names: white, black, blue, red, green, yellow, pink, purple, brown, gray, orange, teal
        - For variations, use: navy blue, light blue, dark blue, royal blue, sky blue
        - For white variations: white, ivory, cream, off-white
        - For black variations: black, charcoal, dark
        - Be precise and consistent with color naming
        
        Return a JSON object with this structure:
        {
          "detectedItems": [
            {
              "category": "tops|bottoms|footwear|accessories|outerwear",
              "description": "detailed description of the item including color and style",
              "color": "specific primary color (be very precise)",
              "style": "style description (casual, formal, bohemian, etc.)",
              "confidence": 0.0-1.0,
              "attributes": ["attribute1", "attribute2", "..."]
            }
          ],
          "outfitContext": {
            "occasion": "casual|formal|party|business|athletic|etc",
            "style": "overall style description",
            "season": "spring|summer|fall|winter|all-season"
          },
          "modelContext": {
            "bodyType": "if visible",
            "skinTone": "if visible", 
            "stylePreference": "inferred style preference"
          }
        }
        
        Focus on fashion-relevant details that would help match products from a catalog.
        Be extremely precise with color detection and naming.
      `;

      try {
        const result = await this.model.generateContent([
          prompt,
          {
            inlineData: {
              data: imageBase64,
              mimeType: imageFile.type
            }
          }
        ]);

        const response = await result.response;
        const text = response.text();
        
        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('No valid JSON found in AI response');
        }

        const analysisResult: AnalysisResult = JSON.parse(jsonMatch[0]);
        this.logger.info(`AI analysis completed in ${Date.now() - startTime} ms`);
        return analysisResult;
      } catch (aiError) {
        this.logger.error('AI Model Error:', aiError);
        throw aiError;
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        this.logger.error('Parsing Error:', error);
      } else if (error.message && error.message.includes('network')) {
        this.logger.error('Network Error:', error);
      } else {
        this.logger.error('Unknown Error:', error);
      }
      return this.getFallbackAnalysis();
    }
  }

  /**
   * Finds matching products based on the analysis result using registered matchers.
   * @param analysisResult The analysis result from the outfit image.
   * @returns A promise resolving to an array of product matches.
   */
  async findMatchingProducts(analysisResult: AnalysisResult): Promise<ProductMatch[]> {
    const startTime = Date.now();
    const allMatchesArrays = await Promise.all(
      this.matchers.map(matcher => matcher.findMatches(analysisResult))
    );

    const allMatches = allMatchesArrays.flat();

    this.logger.info(`Found ${allMatches.length} matches in ${Date.now() - startTime} ms`);

    // Sort by confidence and return top matches
    return allMatches
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 20); // Limit to top 20 matches
  }

  private findInternalMatches(analysisResult: AnalysisResult): ProductMatch[] {
    const matches: ProductMatch[] = [];
    // Only include available and active products
    const allProducts: Product[] = [...additionalProducts].filter((product: any) => {
      // If stock_quantity or is_active is missing, assume available for backward compatibility
      return (typeof product.stock_quantity === 'undefined' || product.stock_quantity > 0) &&
             (typeof product.is_active === 'undefined' || product.is_active !== false);
    });

    for (const detectedItem of analysisResult.detectedItems) {
      const categoryMatches = allProducts.filter(product =>
        this.matchesCategory(product.category, detectedItem.category)
      );

      let foundExact = false;
      for (const product of categoryMatches) {
        const similarity = this.calculateSimilarity(product, detectedItem, analysisResult);
        if (similarity.overall > this.config.internalMatchThreshold) {
          // If perfect match, mark as found
          if (similarity.overall > 0.95) foundExact = true;
          matches.push({
            product,
            confidence: similarity.overall,
            matchReason: this.generateMatchReason(similarity, detectedItem),
            similarity
          });
        }
      }
      // If no exact match found, add a substitution suggestion (best available alternative)
      if (!foundExact && categoryMatches.length > 0) {
        // Find the best available alternative
        const bestAlt = categoryMatches
          .map(product => ({
            product,
            similarity: this.calculateSimilarity(product, detectedItem, analysisResult)
          }))
          .sort((a, b) => b.similarity.overall - a.similarity.overall)[0];
        if (bestAlt && bestAlt.similarity.overall > 0.4) {
          matches.push({
            product: bestAlt.product,
            confidence: bestAlt.similarity.overall,
            matchReason: 'Substitution: original item unavailable, best alternative suggested',
            similarity: bestAlt.similarity
          });
        }
      }
    }
    return matches;
  }

  private findExternalMatches(analysisResult: AnalysisResult): ProductMatch[] {
    // In a real-world scenario, this would involve calling an external API or a web scraper.
    // For this example, we'll simulate finding external products.
    const externalProducts: Product[] = [
      {
        id: 'ext-1',
        name: 'Classic White Tee',
        category: 'tops',
        description: 'A classic white t-shirt from an external store.',
        isExternal: true,
        url: 'https://example.com/white-tee'
      },
      {
        id: 'ext-2',
        name: 'Blue Denim Jeans',
        category: 'bottoms',
        description: 'Stylish blue denim jeans from another retailer.',
        isExternal: true,
        url: 'https://example.com/blue-jeans'
      }
    ];

    const matches: ProductMatch[] = [];
    for (const detectedItem of analysisResult.detectedItems) {
      const categoryMatches = externalProducts.filter(product =>
        this.matchesCategory(product.category, detectedItem.category)
      );

      for (const product of categoryMatches) {
        const similarity = this.calculateSimilarity(product, detectedItem, analysisResult);
        if (similarity.overall > this.config.externalMatchThreshold) { // Use configurable threshold
          matches.push({
            product,
            confidence: similarity.overall,
            matchReason: "Similar item found on an external site.",
            similarity
          });
        }
      }
    }
    return matches;
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private matchesCategory(productCategory: string, detectedCategory: string): boolean {
    const categoryMap: { [key: string]: string[] } = {
      'tops': ['tops', 'shirt', 'blouse', 'sweater', 'hoodie', 'jacket', 'blazer', 'tee', 't-shirt', 'polo'],
      'bottoms': ['bottoms', 'pants', 'jeans', 'skirt', 'shorts', 'leggings'],
      'footwear': ['footwear', 'shoes', 'boots', 'sneakers', 'sandals', 'heels'],
      'accessories': ['accessories', 'bag', 'jewelry', 'hat', 'scarf', 'belt', 'watch'],
      'ethnic_wear': ['ethnic_wear', 'lehenga', 'sari', 'kurta', 'salwar', 'traditional']
    };

    const productCategories = categoryMap[productCategory] || [productCategory];
    return productCategories.some(cat => 
      cat.toLowerCase().includes(detectedCategory.toLowerCase()) ||
      detectedCategory.toLowerCase().includes(cat.toLowerCase())
    );
  }

  private calculateSimilarity(product: any, detectedItem: DetectedItem, context: AnalysisResult): {
    category: number;
    color: number;
    style: number;
    overall: number;
  } {
    // Category similarity
    const categoryScore = this.matchesCategory(product.category, detectedItem.category) ? 1.0 : 0.0;
    
    // Color similarity (enhanced matching)
    const colorScore = this.calculateColorSimilarity(product, detectedItem);
    
    // Style similarity
    const styleScore = this.calculateStyleSimilarity(product, detectedItem, context);
    
    // Product type similarity (additional check for exact matches)
    const productTypeScore = this.calculateProductTypeSimilarity(product, detectedItem);
    
    // Calculate overall score with improved weights
    const overall = (categoryScore * 0.35) + (colorScore * 0.35) + (styleScore * 0.2) + (productTypeScore * 0.1);
    
    return {
      category: categoryScore,
      color: colorScore,
      style: styleScore,
      overall: Math.min(overall, 1.0)
    };
  }

  private calculateColorSimilarity(product: any, detectedItem: DetectedItem): number {
    const productText = `${product.name} ${product.description}`.toLowerCase();
    const detectedColor = detectedItem.color.toLowerCase();

    // Comprehensive color mapping for better matching
    const colorMap: { [key: string]: string[] } = {
      'white': ['white', 'ivory', 'cream', 'off-white', 'pure white', 'snow white', 'pearl white', 'bone', 'chalk'],
      'black': ['black', 'charcoal', 'dark', 'jet black', 'onyx', 'ebony', 'midnight'],
      'blue': ['blue', 'navy', 'denim', 'cobalt', 'royal blue', 'sky blue', 'light blue', 'dark blue', 'navy blue', 'azure', 'sapphire', 'teal', 'turquoise', 'aqua', 'cerulean', 'indigo'],
      'red': ['red', 'crimson', 'scarlet', 'burgundy', 'cherry red', 'fire red', 'ruby', 'maroon', 'vermilion'],
      'green': ['green', 'emerald', 'forest green', 'olive green', 'sage green', 'mint green', 'kelly green', 'hunter green', 'lime', 'chartreuse', 'jade'],
      'yellow': ['yellow', 'gold', 'mustard', 'lemon', 'canary', 'amber', 'saffron'],
      'pink': ['pink', 'rose', 'blush', 'salmon', 'fuchsia', 'magenta', 'hot pink', 'coral', 'peach'],
      'purple': ['purple', 'violet', 'lavender', 'plum', 'amethyst', 'indigo', 'mauve', 'lilac'],
      'brown': ['brown', 'tan', 'beige', 'khaki', 'chocolate', 'caramel', 'mocha', 'taupe', 'sepia', 'umber'],
      'gray': ['gray', 'grey', 'silver', 'charcoal', 'slate', 'smoke', 'pewter', 'ash', 'greige'],
      'orange': ['orange', 'coral', 'peach', 'apricot', 'tangerine', 'rust', 'terra cotta']
    };

    // Normalize detected color to a primary color if it's a variation
    let normalizedDetectedColor = detectedColor;
    for (const primaryColor in colorMap) {
      if (colorMap[primaryColor].includes(detectedColor)) {
        normalizedDetectedColor = primaryColor;
        break;
      }
    }

    // Check for direct match or synonym match
    if (productText.includes(detectedColor) || (colorMap[normalizedDetectedColor] && colorMap[normalizedDetectedColor].some(syn => productText.includes(syn)))) {
      return 1.0; // Perfect match or strong synonym match
    }

    // Check for partial matches or variations
    const detectedColorParts = detectedColor.split(' ');
    let score = 0;
    let matchedParts = 0;

    for (const part of detectedColorParts) {
      if (productText.includes(part)) {
        matchedParts++;
      }
    }

    if (detectedColorParts.length > 0) {
      score = matchedParts / detectedColorParts.length;
    }

    // If a primary color from the detected color is found in the product text, boost the score
    if (colorMap[normalizedDetectedColor] && productText.includes(normalizedDetectedColor)) {
      score = Math.max(score, 0.8); // Boost for primary color match
    }

    // If no strong match, but a general color category matches, give a lower score
    if (score === 0 && colorMap[normalizedDetectedColor]) {
      for (const primaryColor in colorMap) {
        if (productText.includes(primaryColor) && colorMap[primaryColor].includes(normalizedDetectedColor)) {
          score = 0.6; // General category match
          break;
        }
      }
    }
    
    return score > 0 ? Math.max(score, 0.52) : 0.1; // Ensure a minimum score for any relevant match
  }

  private calculateStyleSimilarity(product: any, detectedItem: DetectedItem, context: AnalysisResult): number {
    const productText = `${product.name} ${product.description}`.toLowerCase();
    const styleKeywords = [
      detectedItem.style,
      context.outfitContext.style,
      context.outfitContext.occasion,
      ...detectedItem.attributes
    ].filter(Boolean);
    
    let matches = 0;
    for (const keyword of styleKeywords) {
      if (productText.includes(keyword.toLowerCase())) {
        matches++;
      }
    }
    
    return styleKeywords.length > 0 ? matches / styleKeywords.length : 0.5;
  }

  private calculateProductTypeSimilarity(product: any, detectedItem: DetectedItem): number {
    const productText = `${product.name} ${product.description}`.toLowerCase();
    const detectedText = `${detectedItem.description}`.toLowerCase();
    
    // Product type keywords for better matching
    const productTypes = {
      't-shirt': ['t-shirt', 'tee', 'tshirt', 'tank', 'crew neck', 'v-neck'],
      'shirt': ['shirt', 'button-up', 'oxford', 'polo', 'henley'],
      'hoodie': ['hoodie', 'hooded', 'sweatshirt'],
      'sweater': ['sweater', 'jumper', 'pullover'],
      'blouse': ['blouse', 'top', 'tunic'],
      'jacket': ['jacket', 'blazer', 'coat']
    };
    
    // Check for exact product type matches
    for (const [type, keywords] of Object.entries(productTypes)) {
      const hasProductType = keywords.some(keyword => productText.includes(keyword));
      const hasDetectedType = keywords.some(keyword => detectedText.includes(keyword));
      
      if (hasProductType && hasDetectedType) {
        return 1.0;
      }
    }
    
    // Check for general similarity
    const commonWords = productText.split(' ').filter(word => word.length > 3);
    const detectedWords = detectedText.split(' ').filter(word => word.length > 3);
    
    const commonMatches = commonWords.filter(word => detectedWords.includes(word));
    
    return commonMatches.length > 0 ? Math.min(commonMatches.length / Math.max(commonWords.length, detectedWords.length), 0.8) : 0.3;
  }

  private generateMatchReason(similarity: any, detectedItem: DetectedItem): string {
    const reasons = [];
    
    if (similarity.category > 0.8) {
      reasons.push('Perfect category match');
    } else if (similarity.category > 0.5) {
      reasons.push('Good category match');
    }
    
    if (similarity.color > 0.8) {
      reasons.push('Exact color match');
    } else if (similarity.color > 0.6) {
      reasons.push('Similar color');
    }
    
    if (similarity.style > 0.8) {
      reasons.push('Perfect style match');
    } else if (similarity.style > 0.5) {
      reasons.push('Similar style');
    }
    
    // Add specific product type matching
    if (similarity.overall > 0.8) {
      reasons.push('Highly similar product type');
    } else if (similarity.overall > 0.6) {
      reasons.push('Good alternative option');
    }
    
    return reasons.length > 0 ? reasons.join(', ') : 'Similar item found';
  }

  private getFallbackAnalysis(): AnalysisResult {
    return {
      detectedItems: [
        {
          category: 'tops',
          description: 'Clothing item detected',
          color: 'neutral',
          style: 'casual',
          confidence: 0.5,
          attributes: ['basic']
        }
      ],
      outfitContext: {
        occasion: 'casual',
        style: 'everyday',
        season: 'all-season'
      },
      modelContext: {}
    };
  }
}

export const aiAnalysisService = new AIAnalysisService();