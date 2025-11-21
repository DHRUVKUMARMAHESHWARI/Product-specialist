import { GoogleGenAI, GenerativeModel } from "@google/genai";
import { ChatMessage } from '../types';

let client: GoogleGenAI | null = null;

const getClient = () => {
  if (!client) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API_KEY is missing in process.env");
      throw new Error("API Key missing");
    }
    client = new GoogleGenAI({ apiKey });
  }
  return client;
};

export const generateAIResponse = async (
  message: string,
  history: ChatMessage[],
  context: string = ""
): Promise<string> => {
  try {
    const ai = getClient();
    const model = ai.models;

    const systemInstruction = `You are ProductSense AI, the ultimate personal mastery partner for aspiring Product Specialists.
    
    YOUR MISSION:
    - Guide the user from beginner to expert with patience and clarity.
    - Assume NO prior knowledge unless demonstrated.
    - Always focus on the "Why this matters" in the real world.
    
    INTERACTION MODES:
    1. ELI5 (Explain Like I'm 5): Use extremely simple language. Metaphors like lemonade stands, building blocks, or organizing a party. No jargon.
    2. ANALOGIES: Create vivid, memorable comparisons (e.g., "APIs are like waiters in a restaurant").
    3. QUIZ MODE: When asked to quiz, provide ONE single-choice or open-ended question based on the context. Wait for the user to answer before providing feedback.
    4. CRITIC: When reviewing work, be constructive but specific. Point out risks.
    
    TONE:
    - Encouraging but not childish.
    - Professional yet bold in insights.
    - Concise. Use bullet points for readability.
    
    Current Context: ${context}
    `;

    const fullPrompt = `
    ${systemInstruction}
    
    Conversation History:
    ${history.map(h => `${h.role.toUpperCase()}: ${h.text}`).join('\n')}
    
    USER: ${message}
    MODEL:
    `;

    const response = await model.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });

    return response.text || "I'm having trouble thinking of a response right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I seem to be having connection issues. Please check your API key configuration.";
  }
};

export const evaluateScenarioSubmission = async (
  scenarioContext: string,
  userSubmission: string
): Promise<{ score: number; feedback: string; strengths: string[]; improvements: string[] }> => {
  try {
    const ai = getClient();
    
    const prompt = `
    Act as a Senior Product Leader evaluating a junior product specialist's work.
    
    Scenario Context: ${scenarioContext}
    
    User Submission: ${userSubmission}
    
    Evaluate this submission on a scale of 0-100. Provide constructive feedback, list 2 strengths, and 2 areas for improvement.
    Return ONLY a JSON object with this structure:
    {
      "score": number,
      "feedback": "string",
      "strengths": ["string", "string"],
      "improvements": ["string", "string"]
    }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.error("Evaluation Error:", error);
    return {
      score: 0,
      feedback: "Error evaluating submission.",
      strengths: [],
      improvements: []
    };
  }
};

export const generateLearningContent = async (topic: string, context: string): Promise<string> => {
  try {
    const ai = getClient();
    const prompt = `
    Write a comprehensive, structured learning guide about: "${topic}".
    Context/Description: ${context}
    
    Target Audience: Aspiring Product Specialist/Manager.
    Structure:
    1. **Definition**: What is it? (Simple & Academic definition)
    2. **The "Why"**: Why does a PM care about this?
    3. **Core Mechanics**: How it works / Key Components.
    4. **Real World Example**: A concrete scenario (e.g., Spotify, Uber, or Airbnb example).
    5. **Pro Tips**: What distinguishes a junior from a senior in this area.
    
    Format: Markdown. Use bolding, bullet points, and clear headings.
    Tone: Educational, encouraging, and professional.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Content generation failed.";
  } catch (error) {
    console.error("Content Generation Error:", error);
    return "## Error\nUnable to generate content at this time. Please check your connection.";
  }
};

export const generateContentIntel = async (content: string, type: 'TAKEAWAYS' | 'QUIZ' | 'ELI5'): Promise<string> => {
  try {
    const ai = getClient();
    let prompt = "";

    if (type === 'TAKEAWAYS') {
      prompt = `Analyze the following text and extract 3-5 critical "Key Takeaways" for a Product Specialist. Return them as a bulleted markdown list. \n\nTEXT: ${content.substring(0, 5000)}`;
    } else if (type === 'QUIZ') {
      prompt = `Create a single multiple-choice question based on the following text to test comprehension. Include the correct answer at the end. \n\nTEXT: ${content.substring(0, 5000)}`;
    } else if (type === 'ELI5') {
      prompt = `Summarize the core concept of the following text as if explaining it to a 5-year-old. Use an analogy. \n\nTEXT: ${content.substring(0, 5000)}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate insight.";
  } catch (error) {
    return "Analysis failed.";
  }
};

export const generateResearchHelp = async (
  type: 'EXAMPLES' | 'TRANSCRIPT' | 'SCENARIO',
  context: string
): Promise<string> => {
  try {
    const ai = getClient();
    let prompt = "";

    if (type === 'EXAMPLES') {
        prompt = `Generate 3 specific, high-quality example research questions for a '${context}' method. 
        Include 1 bad example (labeled BAD) and 1 good example (labeled GOOD) for comparison to explain the 'why'.
        Format: Markdown, keep it concise.`;
    } else if (type === 'TRANSCRIPT') {
        prompt = `Generate a realistic, raw user interview transcript snippet (approx 150 words) regarding: ${context}.
        The user should express a hidden pain point or motivation that isn't immediately obvious from surface level complaints.
        Format: "Interviewer: ... User: ..."`;
    } else if (type === 'SCENARIO') {
        prompt = `Generate a short, specific product scenario for a User Researcher to practice writing interview questions.
        Example: "We are designing a new feature for a music app to help people discover local artists."
        Output just the scenario text.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Generation failed.";
  } catch (e) {
    return "Could not generate content.";
  }
};

export const evaluatePracticeExercise = async (
  type: 'USER_STORY' | 'PRD_SECTION' | 'METRICS' | 'RESEARCH_PLAN' | 'PRD_ANALYSIS' | 'RESEARCH_SCRIPT' | 'RESEARCH_SYNTHESIS' | 'RESEARCH_BIAS',
  input: string,
  context?: string
): Promise<{ score: number; feedback: string; tips: string[] }> => {
  try {
    const ai = getClient();
    let prompt = "";

    if (type === 'USER_STORY') {
      prompt = `
        Evaluate this User Story based on the INVEST criteria (Independent, Negotiable, Valuable, Estimable, Small, Testable).
        User Story: "${input}"
        
        Return JSON:
        {
          "score": number (0-100),
          "feedback": "string (critique on structure and clarity)",
          "tips": ["string", "string"] (specific ways to improve it)
        }
      `;
    } else if (type === 'METRICS') {
      prompt = `
        Evaluate these proposed metrics for the following scenario.
        Scenario: ${context}
        Proposed Metrics: "${input}"
        
        Are they actionable? Are they vanity metrics?
        Return JSON:
        {
          "score": number (0-100),
          "feedback": "string (analysis of metric quality)",
          "tips": ["string", "string"] (better metric suggestions)
        }
      `;
    } else if (type === 'PRD_SECTION') {
      prompt = `
        Evaluate this section of a Product Requirements Document (PRD).
        Section Type: ${context}
        Content: "${input}"
        
        Check for: Ambiguity, Clarity, Engineering feasibility, and completeness.
        Return JSON:
        {
          "score": number (0-100),
          "feedback": "string (constructive critique)",
          "tips": ["string", "string"] (what is missing or unclear)
        }
      `;
    } else if (type === 'RESEARCH_PLAN') {
      prompt = `
        Evaluate this User Research Plan.
        Goal/Mystery: ${context}
        User Plan: "${input}"
        
        Check for: 
        - Is the chosen method (Survey, Interview, Data) appropriate for the goal?
        - Are the questions leading or biased?
        - Is the sample size or target audience valid?
        
        Return JSON:
        {
          "score": number (0-100),
          "feedback": "string (critique on methodology and bias)",
          "tips": ["string", "string"] (how to fix the plan)
        }
      `;
    } else if (type === 'PRD_ANALYSIS') {
      prompt = `
        Perform a "Stress Test" analysis on this Product Requirements Document (PRD).
        Perspective to simulate: ${context} (e.g., Engineer, QA, Stakeholder).
        PRD Content: "${input}"
        
        As this persona, find holes, risks, ambiguity, or business flaws.
        
        Return JSON:
        {
          "score": number (0-100) (100 = perfect PRD, 0 = full of holes),
          "feedback": "string (Write as the persona, e.g., 'As an engineer, I have no idea how...')",
          "tips": ["string", "string"] (Specific questions that need answering)
        }
      `;
    } else if (type === 'RESEARCH_SCRIPT') {
       prompt = `
          Evaluate these User Interview Questions.
          Goal/Context: ${context}
          Questions: "${input}"
          
          Check for: 
          - Leading questions (Bad: "Do you like X?", Good: "Tell me about X")
          - Yes/No questions (Bad)
          - Double-barreled questions
          - Bias
          
          Return JSON:
          {
            "score": number (0-100),
            "feedback": "string (critique on question quality and bias)",
            "tips": ["string", "string"] (rewrite suggestions)
          }
       `;
    } else if (type === 'RESEARCH_SYNTHESIS') {
       prompt = `
          Evaluate this User Insight based on the provided Transcript.
          Transcript: "${context}"
          User Identified Insight: "${input}"
          
          Check for: 
          - Accuracy (Does the text actually support this insight?)
          - Depth (Is it just a summary or an actual insight about needs/motivations?)
          
          Return JSON:
          {
            "score": number (0-100),
            "feedback": "string (critique on the insight quality)",
            "tips": ["string", "string"] (what was missed or how to go deeper)
          }
       `;
    } else if (type === 'RESEARCH_BIAS') {
        prompt = `
           Evaluate this Rewrite of a Biased Question.
           Original Biased Question: "${context}"
           User's Neutral Rewrite: "${input}"
           
           Check for:
           - Is it open-ended?
           - Did they remove the bias/leading nature?
           - Is it neutral?
           
           Return JSON:
           {
             "score": number (0-100),
             "feedback": "string",
             "tips": ["string", "string"]
           }
        `;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    return JSON.parse(response.text || '{"score": 0, "feedback": "Error", "tips": []}');
  } catch (error) {
    console.error("Practice Eval Error:", error);
    return { score: 0, feedback: "Evaluation failed. Please try again.", tips: [] };
  }
};