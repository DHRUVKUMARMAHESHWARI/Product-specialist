import axios from 'axios';
import { ChatMessage, UserProfile } from '../types';

const API_URL = process.env.VITE_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Data Fetching ---
export const fetchUser = async (): Promise<UserProfile> => {
  const res = await api.get('/user');
  return res.data;
};

export const fetchModules = async () => {
  const res = await api.get('/modules');
  return res.data;
};

export const fetchScenarios = async () => {
  const res = await api.get('/scenarios');
  return res.data;
};

export const fetchResources = async () => {
  const res = await api.get('/resources');
  return res.data;
};

// --- AI Services ---
export const generateAIResponse = async (
  message: string,
  history: ChatMessage[],
  context: string = ""
): Promise<string> => {
  try {
    const res = await api.post('/ai/chat', { message, history, context });
    return res.data.text;
  } catch (error) {
    console.error("AI Chat Error", error);
    return "Connection to ProductSense Brain lost. Please ensure backend is running.";
  }
};

export const evaluateSubmission = async (
  type: string,
  input: string,
  context: string
): Promise<any> => {
  try {
    const res = await api.post('/ai/evaluate', { type, input, context });
    return res.data;
  } catch (error) {
    console.error("Eval Error", error);
    return { score: 0, feedback: "Evaluation system offline.", strengths: [], improvements: [], tips: [] };
  }
};

export const generateContent = async (
  promptType: 'LEARNING_GUIDE' | 'RESEARCH_HELP' | 'INTEL',
  topic: string,
  context: string
): Promise<string> => {
  try {
    const res = await api.post('/ai/generate', { promptType, topic, context });
    return res.data.text;
  } catch (error) {
    console.error("Gen Error", error);
    return "Content generation failed.";
  }
};