import { ChatMessage } from '../types';
import { generateAIResponse as apiChat, evaluateSubmission as apiEval, generateContent as apiGen } from './api';

export const generateAIResponse = async (
  message: string,
  history: ChatMessage[],
  context: string = ""
): Promise<string> => {
  return await apiChat(message, history, context);
};

export const evaluateScenarioSubmission = async (
  scenarioContext: string,
  userSubmission: string
): Promise<{ score: number; feedback: string; strengths: string[]; improvements: string[] }> => {
  return await apiEval('SCENARIO', userSubmission, scenarioContext);
};

export const generateLearningContent = async (topic: string, context: string): Promise<string> => {
  return await apiGen('LEARNING_GUIDE', topic, context);
};

export const generateContentIntel = async (content: string, type: 'TAKEAWAYS' | 'QUIZ' | 'ELI5'): Promise<string> => {
  return await apiGen('INTEL', type, content);
};

export const generateResearchHelp = async (
  type: 'EXAMPLES' | 'TRANSCRIPT' | 'SCENARIO',
  context: string
): Promise<string> => {
  return await apiGen('RESEARCH_HELP', type, context);
};

export const evaluatePracticeExercise = async (
  type: 'USER_STORY' | 'PRD_SECTION' | 'METRICS' | 'RESEARCH_PLAN' | 'PRD_ANALYSIS' | 'RESEARCH_SCRIPT' | 'RESEARCH_SYNTHESIS',
  input: string,
  context?: string
): Promise<{ score: number; feedback: string; tips: string[] }> => {
  return await apiEval(type, input, context || '');
};