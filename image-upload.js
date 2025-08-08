import express from "express";
import multer from "multer";
import { AIAnalysisService } from "./services/aiAnalysisService.ts";

const app = express();
const upload = multer();
const aiAnalysisService = new AIAnalysisService();

app.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No image uploaded.");
  }

  try {
    const analysisResult = await aiAnalysisService.analyzeOutfitImage(req.file);
    const productMatches = await aiAnalysisService.findMatchingProducts(analysisResult);
    
    res.json({
      analysis: analysisResult,
      matches: productMatches,
    });
  } catch (error) {
    console.error("AI processing error:", error);
    res.status(500).send("Error processing image with AI.");
  }
});

app.listen(3000, () => {
  console.log("AI-powered image analysis server listening on port 3000");
});
