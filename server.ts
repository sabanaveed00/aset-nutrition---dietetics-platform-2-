import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "Nutrium Nutrition API" });
});

// AI Meal Plan Generator
app.post("/api/gemini/generate-meal-plan", async (req, res) => {
  try {
    const { clientGoal, calories, macroSplit, allergies, preferences, daysCount = 3 } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        fallback: true,
        message: "Gemini API key not configured, using smart nutritional template.",
      });
    }

    const prompt = `You are a certified clinical dietitian and nutrition software expert for Nutrium.
Generate a structured, evidence-based meal plan with the following specifications:
- Goal: ${clientGoal || "Balanced healthy eating and weight management"}
- Target Energy: ${calories || 2000} kcal/day
- Target Macronutrient Distribution: Carbs ${macroSplit?.carbs || 45}%, Protein ${macroSplit?.protein || 25}%, Fat ${macroSplit?.fat || 30}%
- Allergies/Restrictions: ${allergies?.length ? allergies.join(", ") : "None"}
- Dietary Preferences: ${preferences || "Omnivore, Mediterranean style"}
- Number of Days: ${daysCount}

Respond ONLY with a valid JSON object matching this structure:
{
  "summary": "Brief dietitian clinical overview of the meal plan",
  "dailyTargetCalories": ${calories || 2000},
  "days": [
    {
      "dayName": "Day 1 - Monday",
      "meals": [
        {
          "type": "Breakfast",
          "time": "08:00",
          "name": "Meal name",
          "calories": 450,
          "carbs": 50,
          "protein": 25,
          "fat": 15,
          "fiber": 8,
          "items": [
            { "name": "Item name", "portion": "80g", "calories": 200 }
          ],
          "instructions": "Simple prep tip"
        },
        {
          "type": "Morning Snack",
          "time": "10:30",
          "name": "Snack name",
          "calories": 180,
          "carbs": 20,
          "protein": 8,
          "fat": 6,
          "fiber": 4,
          "items": [{ "name": "Item name", "portion": "1 serving", "calories": 180 }],
          "instructions": "Tip"
        },
        {
          "type": "Lunch",
          "time": "13:00",
          "name": "Lunch name",
          "calories": 600,
          "carbs": 65,
          "protein": 40,
          "fat": 18,
          "fiber": 10,
          "items": [{ "name": "Item name", "portion": "1 plate", "calories": 600 }],
          "instructions": "Tip"
        },
        {
          "type": "Afternoon Snack",
          "time": "16:30",
          "name": "Snack name",
          "calories": 220,
          "carbs": 25,
          "protein": 12,
          "fat": 8,
          "fiber": 3,
          "items": [{ "name": "Item name", "portion": "1 cup", "calories": 220 }],
          "instructions": "Tip"
        },
        {
          "type": "Dinner",
          "time": "19:30",
          "name": "Dinner name",
          "calories": 550,
          "carbs": 45,
          "protein": 45,
          "fat": 16,
          "fiber": 9,
          "items": [{ "name": "Item name", "portion": "1 bowl", "calories": 550 }],
          "instructions": "Tip"
        }
      ]
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ success: true, plan: parsed });
  } catch (error: any) {
    console.error("Meal plan generation error:", error);
    res.status(500).json({ error: error.message || "Failed to generate meal plan" });
  }
});

// AI Food Swap and Substitution Recommender
app.post("/api/gemini/food-swap", async (req, res) => {
  try {
    const { foodName, portion, currentCalories, currentMacros, reason } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        fallback: true,
        message: "Gemini API key not configured, returning local alternatives.",
      });
    }

    const prompt = `You are a nutrition expert for Nutrium.
The user wants healthy, equivalent substitutions for: "${foodName}" (Portion: ${portion || "100g"}, Calories: ${currentCalories || "approx"}, Macros: Carbs ${currentMacros?.carbs || 0}g, Protein ${currentMacros?.protein || 0}g, Fat ${currentMacros?.fat || 0}g).
User reason/preference: ${reason || "variety, lower glycemic index, or allergy alternatives"}.

Provide 3 dietitian-approved alternatives in valid JSON format:
{
  "originalFood": "${foodName}",
  "alternatives": [
    {
      "name": "Food alternative name",
      "portion": "Equivalent portion (e.g., 120g / 1 cup)",
      "calories": 180,
      "carbs": 25,
      "protein": 15,
      "fat": 4,
      "fiber": 6,
      "benefits": "Why this is a great swap (e.g. higher fiber, prebiotic, dairy-free)",
      "culinaryTip": "How to prepare or replace in recipe"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("Food swap error:", error);
    res.status(500).json({ error: error.message || "Failed to find food swap" });
  }
});

// AI Dietitian Clinical Assistant / Chat
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { message, clientContext, history = [] } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        reply: "Hello! I am your Nutrium AI Clinical Assistant. You can ask me anything about nutrition science, meal plans, macro calculations, or client dietary strategies!",
      });
    }

    const systemPrompt = `You are the intelligent clinical nutrition co-pilot inside Nutrium, the premier software for dietitians and nutritionists.
You speak with professional, compassionate, evidence-based dietetics knowledge (referencing DRI, EFSA, USDA, ADA guidelines).
Client Context:
- Client Name: ${clientContext?.name || "Sarah"}
- Goal: ${clientContext?.goal || "Weight management and body recomposition"}
- Target Calories: ${clientContext?.targetCalories || 1950} kcal
- Current Weight: ${clientContext?.weight || 68} kg, Height: ${clientContext?.height || 168} cm, BMI: ${clientContext?.bmi || 24.1}
- Allergies / Restrictions: ${clientContext?.allergies?.join(", ") || "None"}

Provide concise, highly actionable, formatted markdown answers with clear advice, portion guides, or dietary adjustments.`;

    const chat = ai.chats.create({
      model: "gemini-3.7-flash",
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.6,
      },
    });

    // If previous messages exist
    for (const h of history.slice(-4)) {
      if (h.sender === "user") {
        await chat.sendMessage({ message: h.text });
      }
    }

    const response = await chat.sendMessage({ message });
    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Nutrium AI Chat error:", error);
    res.status(500).json({ error: error.message || "Failed to process chat" });
  }
});

// Start Express and integrate Vite
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Nutrium server running on http://localhost:${PORT}`);
  });
}

startServer();
