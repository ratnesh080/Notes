const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeNote = async (content) => {
  try {
    // UPDATED MODEL: Use Gemini 3 Flash (Fastest and free for testing)
    // Alternative: "gemini-2.5-flash"
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `Analyze this note and return ONLY a JSON object with a 1-sentence "summary" and an array of 3 "tags".
    Note content: ${content}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean JSON from potential markdown ticks
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("JSON not found");
    
    return JSON.parse(jsonMatch[0]);

  } catch (error) {
    console.error("Gemini Error:", error.message);
    
    // If you STILL get a 404, your region might only support the latest version:
    if (error.message.includes("404")) {
       return { summary: "Please check your model name in aiHelper.js. Try 'gemini-3-flash-preview'.", tags: ["error"] };
    }
    
    return { summary: "AI currently busy.", tags: [] };
  }
};

module.exports = analyzeNote;