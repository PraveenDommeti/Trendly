# Trendly AI-Powered Smart Tagging & Catalog Matching MCP Server

## Overview

This MCP (Model Context Protocol) server specification defines a comprehensive AI-powered system for analyzing outfit photos and matching them with products from Trendly's internal catalog. The server leverages visual AI analysis to provide precise product recommendations based on detected clothing items, user style profiles, and outfit context.

## Key Features

### 🎯 **Core Capabilities**
- **AI-Powered Outfit Analysis**: Analyzes uploaded outfit photos to detect clothing items, accessories, and style context
- **Smart Product Matching**: Finds precise or highly similar products from Trendly's internal catalog
- **Personalized Recommendations**: Leverages user style profiles for tailored suggestions
- **Context-Aware Matching**: Considers outfit occasion, season, and style preferences
- **Multi-Modal Analysis**: Combines visual analysis with user preferences and catalog data

### 🔧 **Available Tools**

#### 1. `analyze_outfit_image`
Analyzes an outfit photo using AI to detect:
- Clothing items and accessories
- Colors, styles, and attributes
- Outfit context (occasion, season)
- Model characteristics (body type, skin tone)

**Input**: Image data (base64 or URL) + optional user context
**Output**: Detailed analysis with detected items, confidence scores, and AI-generated tags

#### 2. `find_product_matches`
Finds matching products based on AI analysis:
- Searches internal catalog for exact/similar matches
- Considers user style profile for personalization
- Provides confidence scores and match reasoning
- Supports filtering by price, category, and preferences

#### 3. `get_user_style_profile`
Retrieves user's style preferences:
- Preferred styles, colors, and brands
- Body type and size preferences
- Price range and avoided styles
- Historical preference data

#### 4. `update_style_profile`
Updates user's style profile based on:
- Outfit analysis results
- User feedback and preferences
- Purchase history and interactions

#### 5. `create_outfit_post`
Creates posts with AI-generated content:
- Automatic tagging with detected items
- Product recommendations
- Engagement predictions
- Style suggestions

#### 6. `get_trending_products`
Provides trending product recommendations:
- Based on current fashion trends
- Personalized for user preferences
- Category-specific suggestions

#### 7. `generate_style_recommendations`
Generates personalized style advice:
- Complete outfit suggestions
- Accessory recommendations
- Alternative styling options
- Seasonal recommendations

## Technical Architecture

### AI Model Configuration
- **Provider**: Google Gemini AI
- **Model**: gemini-1.5-flash
- **Capabilities**: Visual analysis, text generation, context understanding
- **Optimization**: Fine-tuned for fashion and style analysis

### Data Flow
1. **Image Upload** → User uploads outfit photo
2. **AI Analysis** → Gemini AI analyzes image for clothing items and context
3. **Catalog Search** → System searches internal product database
4. **Personalization** → Applies user style profile and preferences
5. **Ranking** → Ranks matches by confidence and personalization score
6. **Recommendation** → Returns top matches with explanations

### Matching Algorithm
The system uses a weighted scoring approach:

```javascript
overall_score = (category_similarity * 0.4) + 
                (color_similarity * 0.3) + 
                (style_similarity * 0.3)
```

**Factors Considered**:
- **Category Matching**: Exact or related product categories
- **Color Analysis**: Primary and secondary color matching
- **Style Compatibility**: Style attributes and aesthetic preferences
- **Personalization**: User's style profile and historical preferences
- **Context Awareness**: Occasion, season, and outfit context

## Implementation Guide

### 1. Environment Setup
```bash
# Required environment variables
GEMINI_API_KEY=your_gemini_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
TRENDLY_API_KEY=your_trendly_api_key
```

### 2. Server Configuration
```json
{
  "mcpServers": {
    "trendly-ai-catalog-matcher": {
      "command": "node",
      "args": ["dist/mcp-server.js"],
      "env": {
        "GEMINI_API_KEY": "${GEMINI_API_KEY}",
        "SUPABASE_URL": "${SUPABASE_URL}",
        "SUPABASE_ANON_KEY": "${SUPABASE_ANON_KEY}",
        "TRENDLY_API_KEY": "${TRENDLY_API_KEY}"
      }
    }
  }
}
```

### 3. Integration with Existing Codebase

The MCP server integrates seamlessly with your existing Trendly codebase:

- **Leverages existing AI analysis service** (`src/services/aiAnalysisService.ts`)
- **Uses current product catalog structure** (`src/data/additionalProducts.ts`)
- **Integrates with Supabase database** (`src/integrations/supabase/`)
- **Compatible with existing UI components** (`src/components/SmartTaggingDialog.tsx`)

### 4. API Endpoints

The server exposes RESTful endpoints that can be called from your React frontend:

```typescript
// Example usage in your React components
const analyzeOutfit = async (imageFile: File) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  const response = await fetch('/api/analyze-outfit', {
    method: 'POST',
    body: formData
  });
  
  return response.json();
};
```

## Response Examples

### Outfit Analysis Response
```json
{
  "success": true,
  "analysis": {
    "detected_items": [
      {
        "category": "tops",
        "description": "White cotton t-shirt with graphic print",
        "color": "white",
        "style": "casual",
        "confidence": 0.95,
        "attributes": ["graphic", "cotton", "relaxed-fit"]
      }
    ],
    "outfit_context": {
      "occasion": "casual",
      "style": "streetwear",
      "season": "all-season"
    },
    "ai_generated_tags": ["streetwear", "graphic-tee", "casual-style"]
  },
  "processing_time": 1250
}
```

### Product Matches Response
```json
{
  "success": true,
  "matches": [
    {
      "product": {
        "id": "550e8400-e29b-41d4-a716-446655440007",
        "name": "Street Style Graphic Tee",
        "price": 1299,
        "brand": "StreetStyle",
        "category": "tops"
      },
      "confidence": 0.92,
      "match_reason": "Exact style match with similar graphic design",
      "similarity": {
        "category": 1.0,
        "color": 0.9,
        "style": 0.95,
        "overall": 0.92
      },
      "personalization_score": 0.88
    }
  ],
  "total_matches": 15,
  "match_summary": {
    "exact_matches": 3,
    "similar_matches": 8,
    "recommended_alternatives": 4
  }
}
```

## Error Handling

The server provides comprehensive error handling:

```json
{
  "error": "AI_ANALYSIS_FAILED",
  "message": "Failed to analyze image due to poor quality",
  "details": {
    "image_quality": "low",
    "suggested_action": "upload_higher_resolution_image"
  }
}
```

## Performance & Monitoring

### Rate Limits
- **60 requests per minute** per user
- **1000 requests per hour** per user
- **5 concurrent analyses** maximum

### Metrics Tracked
- Analysis accuracy and precision
- Matching success rates
- User satisfaction scores
- Processing time optimization
- Error rates and types

### Webhooks
- `outfit_analysis_complete`: Triggered when analysis finishes
- `product_match_found`: Triggered for high-confidence matches

## Security Considerations

- **Image validation**: File type and size restrictions
- **Rate limiting**: Prevents abuse and ensures fair usage
- **User authentication**: Required for personalized features
- **Data privacy**: Secure handling of user images and preferences
- **API key management**: Secure storage and rotation of API keys

## Future Enhancements

### Planned Features
- **Multi-language support** for international markets
- **Advanced body type detection** for better fitting recommendations
- **Seasonal trend analysis** for timely suggestions
- **Social proof integration** with user reviews and ratings
- **AR try-on integration** for virtual fitting experiences

### Scalability
- **Microservices architecture** for horizontal scaling
- **Caching layer** for frequently accessed data
- **CDN integration** for global image delivery
- **Database optimization** for large catalog support

## Support & Documentation

For implementation support and technical questions:
- Review the existing codebase integration points
- Check the API documentation for detailed endpoint specifications
- Monitor performance metrics and user feedback
- Stay updated with AI model improvements and new features

---

This MCP server specification provides a robust foundation for Trendly's AI-powered fashion recommendation system, enabling precise product matching and personalized user experiences. 