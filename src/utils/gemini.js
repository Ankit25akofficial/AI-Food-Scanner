const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

// Function to clean markdown wrappers from JSON responses
function cleanJsonString(str) {
  let cleaned = str.trim();
  // Remove markdown code block wrappers if present
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/i, "");
    cleaned = cleaned.replace(/\n?```$/i, "");
  }
  return cleaned.trim();
}

// Function to extract base64 data from DataURL
function getBase64FromDataUrl(dataUrl) {
  const parts = dataUrl.split(',');
  if (parts.length > 1) {
    return parts[1];
  }
  return dataUrl;
}

// Function to extract mime type from DataURL
function getMimeTypeFromDataUrl(dataUrl) {
  const match = dataUrl.match(/^data:([^;]+);/);
  if (match) {
    return match[1];
  }
  return "image/jpeg";
}

/**
 * Analyzes a food image using the Gemini 1.5 Flash API
 * @param {string} base64DataUrl - The image as a base64 DataURL
 * @returns {Promise<object>} The nutritional breakdown
 */
export async function analyzeFoodImage(base64DataUrl) {
  try {
    const base64Data = getBase64FromDataUrl(base64DataUrl);
    const mimeType = getMimeTypeFromDataUrl(base64DataUrl);

    const prompt = `Identify the food in this image. Calculate its estimated nutritional facts. Return ONLY a valid JSON object matching this structure, with no extra characters or markdown formatting:
{
  "name": "Food Name",
  "calories": number,
  "protein": number,
  "carbs": number,
  "fats": number,
  "sugar": number,
  "vitamins": "Comma-separated list of prominent vitamins and minerals",
  "confidence": number (between 50 and 100 representing detection confidence)
}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: mimeType,
                  data: base64Data
                }
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No response candidates returned by Gemini");
    }
    
    const textResult = data.candidates[0].content.parts[0].text;
    const parsed = JSON.parse(cleanJsonString(textResult));
    
    return {
      name: parsed.name || "Unknown Dish",
      calories: Math.round(Number(parsed.calories) || 0),
      protein: Math.round(Number(parsed.protein) || 0),
      carbs: Math.round(Number(parsed.carbs) || 0),
      fats: Math.round(Number(parsed.fats) || 0),
      sugar: Math.round(Number(parsed.sugar) || 0),
      vitamins: parsed.vitamins || "None detected",
      confidence: Math.round(Number(parsed.confidence) || 90),
      source: "Gemini 1.5 Vision"
    };
  } catch (error) {
    console.error("Gemini Image Analysis failed:", error);
    throw error;
  }
}

/**
 * Analyzes a text food description using the Gemini 1.5 Flash API
 * @param {string} textDescription - The user typed description of the meal
 * @returns {Promise<object>} The nutritional breakdown
 */
export async function analyzeFoodText(textDescription) {
  try {
    const prompt = `You are a nutrition expert AI. Analyze this meal description: "${textDescription}". Estimate the serving sizes and calculate the nutritional facts. Return ONLY a valid JSON object matching this structure, with no extra characters or markdown formatting:
{
  "name": "Brief summary of the meal",
  "calories": number,
  "protein": number,
  "carbs": number,
  "fats": number,
  "sugar": number,
  "vitamins": "Vitamins and minerals",
  "confidence": number (between 50 and 100)
}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No response candidates returned by Gemini");
    }
    
    const textResult = data.candidates[0].content.parts[0].text;
    const parsed = JSON.parse(cleanJsonString(textResult));
    
    return {
      name: parsed.name || textDescription,
      calories: Math.round(Number(parsed.calories) || 0),
      protein: Math.round(Number(parsed.protein) || 0),
      carbs: Math.round(Number(parsed.carbs) || 0),
      fats: Math.round(Number(parsed.fats) || 0),
      sugar: Math.round(Number(parsed.sugar) || 0),
      vitamins: parsed.vitamins || "None listed",
      confidence: Math.round(Number(parsed.confidence) || 90),
      source: "Gemini 1.5 NLP"
    };
  } catch (error) {
    console.error("Gemini Text Analysis failed:", error);
    throw error;
  }
}
