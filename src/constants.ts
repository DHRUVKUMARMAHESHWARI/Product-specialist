import { Module, Difficulty, Scenario, LearningResource } from './types';
import { Layout, BookOpen, Target, Zap, MessageSquare, Layers, Library } from 'lucide-react';

export const MOCK_USER = {
  name: "Alex",
  level: "Apprentice",
  xp: 1250,
  streak: 4,
  completedModules: ['f_d1', 'f_t1', 'f_s1'],
  confidence: {
    research: 30,
    strategy: 10,
    technical: 45,
    communication: 60,
  },
  learningStyle: 'mixed' as const
};

// --- THE TRI-TRACK CURRICULUM ---
export const MODULES: Module[] = [
  // --- GALAXY 1: FOUNDATION (The Explorer) ---
  { id: 'f_d1', title: 'User Empathy', description: 'Understanding pain vs. solution.', difficulty: Difficulty.BEGINNER, category: 'Foundation', track: 'DISCOVERY', duration: '10m', locked: false },
  { id: 'f_d2', title: 'Double Diamond', description: 'Divergent vs Convergent thinking.', difficulty: Difficulty.BEGINNER, category: 'Foundation', track: 'DISCOVERY', duration: '15m', locked: false },
  
  { id: 'f_t1', title: 'How the Internet Works', description: 'Clients, Servers, and the Cloud.', difficulty: Difficulty.BEGINNER, category: 'Foundation', track: 'DELIVERY', duration: '20m', locked: false },
  { id: 'f_t2', title: 'Frontend vs Backend', description: 'HTML/CSS vs Node/Python.', difficulty: Difficulty.BEGINNER, category: 'Foundation', track: 'DELIVERY', duration: '15m', locked: false },
  
  { id: 'f_s1', title: 'Output vs Outcome', description: 'Why shipping isn\'t success.', difficulty: Difficulty.BEGINNER, category: 'Foundation', track: 'STRATEGY', duration: '10m', locked: false },
  { id: 'f_s2', title: 'Business Models 101', description: 'SaaS, Marketplace, Ad-tech.', difficulty: Difficulty.BEGINNER, category: 'Foundation', track: 'STRATEGY', duration: '25m', locked: false },

  // --- GALAXY 2: CORE (The Builder) ---
  // Discovery
  { id: 'c_d1', title: 'The Mom Test', description: 'Asking unbiased questions.', difficulty: Difficulty.INTERMEDIATE, category: 'Core', track: 'DISCOVERY', duration: '30m', locked: true },
  { id: 'c_d2', title: 'Usability Testing', description: 'Watching users fail.', difficulty: Difficulty.INTERMEDIATE, category: 'Core', track: 'DISCOVERY', duration: '25m', locked: true },
  { id: 'c_d3', title: 'Figma Basics', description: 'Navigating design files.', difficulty: Difficulty.INTERMEDIATE, category: 'Core', track: 'DISCOVERY', duration: '35m', locked: true },
  
  // Delivery
  { id: 'c_t1', title: 'Agile Rituals', description: 'Standups & Retros that work.', difficulty: Difficulty.INTERMEDIATE, category: 'Core', track: 'DELIVERY', duration: '20m', locked: true },
  { id: 'c_t2', title: 'Writing Tickets', description: 'Gherkin syntax & Acceptance Criteria.', difficulty: Difficulty.INTERMEDIATE, category: 'Core', track: 'DELIVERY', duration: '40m', locked: true },
  { id: 'c_t3', title: 'API Fundamentals', description: 'REST, JSON, and Webhooks.', difficulty: Difficulty.INTERMEDIATE, category: 'Core', track: 'DELIVERY', duration: '45m', locked: true },
  { id: 'c_t4', title: 'SQL for PMs', description: 'Select * From Users.', difficulty: Difficulty.INTERMEDIATE, category: 'Core', track: 'DELIVERY', duration: '60m', locked: true },

  // Strategy
  { id: 'c_s1', title: 'North Star Metrics', description: 'The one metric that matters.', difficulty: Difficulty.INTERMEDIATE, category: 'Core', track: 'STRATEGY', duration: '30m', locked: true },
  { id: 'c_s2', title: 'RICE Scoring', description: 'Prioritization math.', difficulty: Difficulty.INTERMEDIATE, category: 'Core', track: 'STRATEGY', duration: '25m', locked: true },
  { id: 'c_s3', title: 'Stakeholder Maps', description: 'Managing up and across.', difficulty: Difficulty.INTERMEDIATE, category: 'Core', track: 'STRATEGY', duration: '35m', locked: true },

  // --- GALAXY 3: ADVANCED (The Strategist) ---
  // Discovery
  { id: 'a_d1', title: 'Jobs To Be Done', description: 'The "Milkshake" theory.', difficulty: Difficulty.ADVANCED, category: 'Advanced', track: 'DISCOVERY', duration: '40m', locked: true },
  { id: 'a_d2', title: 'Behavioral Psych', description: 'Hooks & variable rewards.', difficulty: Difficulty.ADVANCED, category: 'Advanced', track: 'DISCOVERY', duration: '45m', locked: true },
  { id: 'a_d3', title: 'Opportunity Trees', description: 'Visualizing outcomes.', difficulty: Difficulty.ADVANCED, category: 'Advanced', track: 'DISCOVERY', duration: '30m', locked: true },

  // Delivery
  { id: 'a_t1', title: 'System Architecture', description: 'Monoliths vs Microservices.', difficulty: Difficulty.ADVANCED, category: 'Advanced', track: 'DELIVERY', duration: '50m', locked: true },
  { id: 'a_t2', title: 'Tech Debt Mgmt', description: 'Balancing speed vs stability.', difficulty: Difficulty.ADVANCED, category: 'Advanced', track: 'DELIVERY', duration: '35m', locked: true },
  { id: 'a_t3', title: 'Buy vs Build', description: 'Vendor selection strategy.', difficulty: Difficulty.ADVANCED, category: 'Advanced', track: 'DELIVERY', duration: '30m', locked: true },

  // Strategy
  { id: 'a_s1', title: 'Growth Loops', description: 'Acquisition -> Activation.', difficulty: Difficulty.ADVANCED, category: 'Advanced', track: 'STRATEGY', duration: '55m', locked: true },
  { id: 'a_s2', title: 'Pricing Strategy', description: 'Freemium & Tiered models.', difficulty: Difficulty.ADVANCED, category: 'Advanced', track: 'STRATEGY', duration: '45m', locked: true },
  { id: 'a_s3', title: 'Product Vision', description: 'Writing the Press Release.', difficulty: Difficulty.ADVANCED, category: 'Advanced', track: 'STRATEGY', duration: '40m', locked: true },

  // --- GALAXY 4: EXPERT (The Leader) ---
  // Discovery
  { id: 'e_d1', title: 'Research Ops', description: 'Scaling insights teams.', difficulty: Difficulty.EXPERT, category: 'Expert', track: 'DISCOVERY', duration: '40m', locked: true },
  // Delivery
  { id: 'e_t1', title: 'Platform Eng', description: 'Internal developer platforms.', difficulty: Difficulty.EXPERT, category: 'Expert', track: 'DELIVERY', duration: '50m', locked: true },
  { id: 'e_t2', title: 'AI Integration', description: 'RAG & LLM Strategy.', difficulty: Difficulty.EXPERT, category: 'Expert', track: 'DELIVERY', duration: '60m', locked: true },
  // Strategy
  { id: 'e_s1', title: 'M&A Integration', description: 'Merging product stacks.', difficulty: Difficulty.EXPERT, category: 'Expert', track: 'STRATEGY', duration: '50m', locked: true },
  { id: 'e_s2', title: 'Org Design', description: 'Conway\'s Law applied.', difficulty: Difficulty.EXPERT, category: 'Expert', track: 'STRATEGY', duration: '45m', locked: true },
];

export const SCENARIOS: Scenario[] = [
  {
    id: 's1',
    title: 'The Angry Stakeholder',
    description: 'Sales VP demands a feature needed "yesterday".',
    difficulty: Difficulty.BEGINNER,
    context: 'You are a junior PS at a B2B SaaS co. The VP of Sales interrupts your lunch.',
    task: 'Draft a response that acknowledges their urgency but protects the roadmap.'
  },
  {
    id: 's2',
    title: 'Metric Mystery',
    description: 'Retention dropped 15% overnight.',
    difficulty: Difficulty.INTERMEDIATE,
    context: 'Monday morning. The dashboard shows a sharp decline in Daily Active Users (DAU) after the Friday release.',
    task: 'Outline your investigation plan. Who do you talk to? What data do you check?'
  },
  {
    id: 's3',
    title: 'Technical Debt Trade-off',
    description: 'Engineering wants to refactor. Product wants features.',
    difficulty: Difficulty.ADVANCED,
    context: 'The Lead Engineer says the login system is "held together by duct tape". Marketing wants a new social login feature.',
    task: 'Write a proposal for how to balance these conflicting needs for the Q3 roadmap.'
  }
];

export const NAV_ITEMS = [
  { id: 'DASHBOARD', label: 'Dashboard', icon: Layout },
  { id: 'LEARNING_MAP', label: 'Universe Map', icon: Layers },
  { id: 'KNOWLEDGE_HUB', label: 'Knowledge Hub', icon: Library },
  { id: 'PRACTICE', label: 'Training Ground', icon: Target },
  { id: 'SCENARIO', label: 'Simulator', icon: Zap },
  { id: 'AI_COMPANION', label: 'ProductSense AI', icon: MessageSquare },
];

export const LEARNING_RESOURCES: LearningResource[] = [
  // Foundation
  {
    id: 'r1',
    title: 'Product Management 101: The Absolute Basics',
    description: 'Start here. What is this job and why does it exist?',
    type: 'GUIDE',
    difficulty: Difficulty.BEGINNER,
    category: 'Foundation',
    duration: '15 min',
    tags: ['Basics', 'Career', 'Role'],
    content: `
# Product Management 101

## What is a Product Manager?
At its core, a Product Manager (PM) is responsible for the success of a product. You are the intersection between:
1. **Business**: Maximizing value and ROI.
2. **Technology**: Understanding what is feasible and how it's built.
3. **UX (User Experience)**: Advocating for the user's needs.

## The "Mini-CEO" Myth
You might hear people say a PM is the "CEO of the product." This is only half true.
- **True**: You are responsible for the outcome.
- **False**: You have zero direct authority. You cannot tell engineers what to do. You must lead through influence, data, and persuasion.

## Core Responsibilities
1. **Discovery**: Figuring out what to build (Research, Data).
2. **Delivery**: Helping the team build it right (Specs, Testing).
3. **Go-to-Market**: Helping launch and sell it (Marketing support).
    `
  },
  {
    id: 'r2',
    title: 'Understanding the Software Development Lifecycle (SDLC)',
    description: 'How code goes from an idea to a live feature.',
    type: 'ARTICLE',
    difficulty: Difficulty.BEGINNER,
    category: 'Foundation',
    duration: '10 min',
    tags: ['Technical', 'Process', 'Agile'],
    content: `
# The Software Development Lifecycle (SDLC)

## 1. Planning
This is where you live. You define the *what* and the *why*.
Output: PRDs, User Stories.

## 2. Design
Designers create wireframes and high-fidelity mockups.
Your role: Review and ensure it solves the user problem.

## 3. Implementation (Coding)
Engineers write the code.
Your role: Unblock them, answer questions, avoid scope creep.

## 4. Testing (QA)
Checking for bugs.
Your role: Acceptance Testing (UAT) - does it do what you asked?

## 5. Deployment
Releasing to users.
    `
  },
  
  // Core
  {
    id: 'r3',
    title: 'The Art of the User Interview',
    description: 'How to talk to users without biasing them.',
    type: 'GUIDE',
    difficulty: Difficulty.INTERMEDIATE,
    category: 'Core',
    duration: '20 min',
    tags: ['Research', 'Discovery'],
  },
  {
    id: 'r_res_1',
    title: 'Research Methods: Qual vs Quant',
    description: 'When to talk to humans vs when to look at dashboards.',
    type: 'GUIDE',
    difficulty: Difficulty.INTERMEDIATE,
    category: 'Core',
    duration: '25 min',
    tags: ['Research', 'Data'],
    content: `
# Qualitative vs Quantitative Research

## The Two Wings of Discovery
To fly, you need both wings.
- **Quantitative (Quant)** tells you **WHAT** is happening. (Analytics, A/B Tests, Surveys)
- **Qualitative (Qual)** tells you **WHY** it is happening. (Interviews, Usability Tests, Session Recordings)

## When to use Quant
- "How many people drop off at checkout?"
- "Which button color converts better?"
- "Is retention trending up or down?"

## When to use Qual
- "Why are people dropping off at checkout?"
- "Do users understand what our product does?"
- "What are the user's pain points with the current solution?"

## The Trap
Data without context is dangerous. You might see low usage on a feature and delete it (Quant), not realizing it's the *most* important feature for your highest-paying enterprise customer (Qual).
    `
  },
  {
    id: 'r4',
    title: 'Writing Killer User Stories',
    description: 'The "Invest" framework and acceptance criteria.',
    type: 'ARTICLE',
    difficulty: Difficulty.INTERMEDIATE,
    category: 'Core',
    duration: '12 min',
    tags: ['Execution', 'Documentation'],
  },
  {
    id: 'r_prd_1',
    title: 'The Perfect PRD Structure',
    description: 'How to write specs that engineers actually read.',
    type: 'GUIDE',
    difficulty: Difficulty.INTERMEDIATE,
    category: 'Core',
    duration: '30 min',
    tags: ['Documentation', 'PRD', 'Execution'],
    content: `
# The Product Requirements Document (PRD)

## Purpose
The PRD is the single source of truth. It aligns the team on **Problem**, **Solution**, and **Scope**.

## Core Sections
1. **Problem Statement**: What are we solving and why? Use data.
2. **Goals & Success Metrics**: How do we know if we won?
3. **User Persona**: Who is this for?
4. **User Stories / Functional Requirements**: The specific capabilities.
5. **UX/Design**: Links to Figma/Wireframes.
6. **Out of Scope**: Explicitly state what we are NOT doing. This saves you from "scope creep".

## The "Comment" Rule
A good PRD is a living document. If engineers aren't commenting on it, they aren't reading it, or it's too vague to question.
    `
  },
  {
    id: 'r5',
    title: 'Prioritization: RICE vs MoSCoW',
    description: 'Frameworks to decide what to build next.',
    type: 'ARTICLE',
    difficulty: Difficulty.INTERMEDIATE,
    category: 'Core',
    duration: '15 min',
    tags: ['Strategy', 'Decision Making'],
  },

  // Advanced
  {
    id: 'r6',
    title: 'Product Strategy vs. Product Vision',
    description: 'Structuring your long-term thinking.',
    type: 'ARTICLE',
    difficulty: Difficulty.ADVANCED,
    category: 'Advanced',
    duration: '25 min',
    tags: ['Strategy', 'Leadership'],
  },
  {
    id: 'r7',
    title: 'Market Sizing and Entry',
    description: 'TAM, SAM, SOM and how to calculate them.',
    type: 'GUIDE',
    difficulty: Difficulty.ADVANCED,
    category: 'Advanced',
    duration: '30 min',
    tags: ['Business', 'Strategy'],
  },
  
  // Expert
  {
    id: 'r8',
    title: 'Leading Without Authority',
    description: 'Advanced stakeholder management techniques.',
    type: 'GUIDE',
    difficulty: Difficulty.EXPERT,
    category: 'Expert',
    duration: '20 min',
    tags: ['Leadership', 'Soft Skills'],
  }
];