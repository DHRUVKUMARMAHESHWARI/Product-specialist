const { GoogleGenAI } = require('@google/genai');

// Initialize client lazily to ensure env vars are loaded
const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

exports.chat = async (req, res) => {
  try {
    const { message, history, context } = req.body;
    const client = getAiClient();
    
    const systemInstruction = `You are ProductSense AI, the ultimate personal mastery partner for aspiring Product Specialists.
    YOUR MISSION: Guide the user from beginner to expert.
    INTERACTION MODES: ELI5, ANALOGIES, QUIZ MODE, CRITIC.
    Current Context: ${context || 'General Mentorship'}
    `;

    // Basic history formatting for context - in a real app, use proper multi-turn chat structure
    const contextPrompt = `
    ${systemInstruction}
    Previous conversation summary: ${JSON.stringify(history.slice(-5))}
    USER: ${message}
    MODEL:
    `;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contextPrompt,
    });
    
    res.json({ text: response.text });
  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ error: "AI Service Unavailable" });
  }
};

exports.evaluate = async (req, res) => {
  try {
    const { type, input, context } = req.body;
    const client = getAiClient();
    
    let prompt = "";
    if (type === 'SCENARIO') {
      prompt = `Act as a Senior Product Leader. 
      Scenario Context: ${context}. 
      User Submission: ${input}. 
      Evaluate on scale 0-100. Provide constructive feedback, 2 strengths, 2 areas for improvement.
      Return JSON: { "score": number, "feedback": "string", "strengths": [], "improvements": [] }`;
    } else {
      prompt = `Evaluate this ${type} exercise.
      Context: ${context}.
      User Input: ${input}.
      Return JSON: { "score": number, "feedback": "string", "tips": [] }`;
    }

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    res.json(JSON.parse(response.text));
  } catch (error) {
    console.error("AI Eval Error:", error);
    res.status(500).json({ error: "Evaluation Failed" });
  }
};

exports.generate = async (req, res) => {
  try {
    const { promptType, topic, context } = req.body;
    const client = getAiClient();
    
    let finalPrompt = "";
    if (promptType === 'LEARNING_GUIDE') {
      finalPrompt = `Write a comprehensive learning guide about: "${topic}". 
      Context: ${context}. 
      Structure: Definition, The Why, Core Mechanics, Real World Example, Pro Tips.
      Format: Markdown.`;
    } else if (promptType === 'RESEARCH_HELP') {
      finalPrompt = `Generate specific user research content. Type: ${topic}. Context: ${context}.`;
    } else if (promptType === 'INTEL') {
      finalPrompt = `Analyze the following text. Task: ${topic} (TAKEAWAYS/QUIZ/ELI5). Text: ${context.substring(0, 5000)}`;
    }

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: finalPrompt,
    });

    res.json({ text: response.text });
  } catch (error) {
    console.error("AI Gen Error:", error);
    res.status(500).json({ error: "Generation Failed" });
  }
};