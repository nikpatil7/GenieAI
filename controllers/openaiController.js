const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


// Simple in-memory cache
const summaryCache = new Map();
const MAX_CHARS = 25000;  // Match frontend limit

const summaryController = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Please provide text to summarize" });
    }

    if (text.length > MAX_CHARS) {
      return res.status(400).json({ 
        error: `Text is too long. Maximum ${MAX_CHARS} characters allowed.` 
      });
    }

    // Check cache first
    const cacheKey = text.trim();
    if (summaryCache.has(cacheKey)) {
      return res.status(200).json(summaryCache.get(cacheKey));
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_NONE",
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_NONE",
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_NONE",
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_NONE",
        },
      ],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 800,
        topP: 0.8,
        topK: 40,
      }
    });
    
    const prompt = `Summarize the following text into a concise and meaningful format. Capture the key points and provide an overall understanding of the content. Ensure the summary is directly related to the input, avoids unnecessary details, and highlights the most critical aspects of the text.

    MAIN POINTS:
    1. [Key Topic]
        • Core Concept: [Brief explanation]
        • Main Insight: [Key understanding]

    2. [Important Details]
        • Primary Point: [Main aspect]
        • Secondary Point: [Supporting detail]

    KEY POINTS:
    • [Critical point 1]
    • [Critical point 2]
    • [Critical point 3]

    ADDITIONAL INSIGHTS:
    • [Important finding]
    • [Significant implication]

    Note: Keep each point brief and clear. Prioritize clarity over completeness.

    Text to analyze: ${text}`;

    // Shorter timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), 10000)
    );

    const result = await Promise.race([
      model.generateContent(prompt),
      timeoutPromise
    ]);

    const response = await result.response;
    const summary = response.text()
      // Ensure consistent bullet points
      .replace(/[•*-]\s+/g, '• ')
      // Ensure proper spacing for numbered points
      .replace(/(\d+\.)\s+/g, '\n$1 ')
      // Ensure consistent spacing between sections
      .replace(/\n{3,}/g, '\n\n')
      // Ensure proper indentation for bullet points
      .replace(/\n•/g, '\n   •')
      // Clean up any extra whitespace
      .trim();

    if (summary) {
      // Store in cache with expiry (24 hours)
      summaryCache.set(cacheKey, summary);
      setTimeout(() => summaryCache.delete(cacheKey), 24 * 60 * 60 * 1000);
      
      // Keep cache size manageable
      if (summaryCache.size > 100) {
        const firstKey = summaryCache.keys().next().value;
        summaryCache.delete(firstKey);
      }

      return res.status(200).json(summary);
    }

    res.status(404).json({ message: "No summary generated" });
  } catch (err) {
    console.error("Error in summary generation:", err);
    
    // Better error messages
    if (err.message?.includes('SAFETY')) {
      return res.status(400).json({ 
        error: "Content flagged for safety. Please modify your text and try again." 
      });
    }
    
    res.status(500).json({ 
      error: "Error in generating summary. Please try again later." 
    });
  }
};

const paragraphController = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Text prompt is required." });
    }

    // Using Google Generative AI API for text generation
    const response = await genAI.generateText({
      model: "gemini-pro", // Use the correct model
      prompt: `Write a detailed paragraph about: \n${text}`,
      maxOutputTokens: 500, // max_tokens equivalent
      temperature: 0.5,
    });

    if (response?.candidates?.[0]?.output) {
      return res.status(200).json({ generatedText: response.candidates[0].output });
    } else {
      return res.status(500).json({ message: "Failed to generate text. No output received." });
    }
  } catch (err) {
    console.error("Error in paragraphController:", err.message);
    return res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

module.exports = { summaryController, paragraphController }; 