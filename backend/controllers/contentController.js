const { Module, Scenario, Resource } = require('../models');

exports.getModules = async (req, res) => {
  try {
    const modules = await Module.find().sort({ id: 1 });
    res.json(modules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getScenarios = async (req, res) => {
  try {
    const scenarios = await Scenario.find();
    res.json(scenarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getResources = async (req, res) => {
  try {
    const resources = await Resource.find();
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.seedData = async (req, res) => {
  try {
    console.log("Seeding Database with Expanded Tri-Track Curriculum...");

    // --- MODULES (CURRICULUM) ---
    // Tracks: DISCOVERY (Research/UX), DELIVERY (Tech/Execution), STRATEGY (Business/Growth)
    const modules = [
        // --- GALAXY 1: FOUNDATION (The Explorer) ---
        { id: 'f_d1', title: 'User Empathy 101', description: 'Understanding pain vs. solution.', difficulty: 'BEGINNER', category: 'Foundation', track: 'DISCOVERY', duration: '10m', locked: false },
        { id: 'f_d2', title: 'The Double Diamond', description: 'Divergent vs Convergent thinking.', difficulty: 'BEGINNER', category: 'Foundation', track: 'DISCOVERY', duration: '15m', locked: false },
        
        { id: 'f_t1', title: 'How the Internet Works', description: 'Clients, Servers, and the Cloud.', difficulty: 'BEGINNER', category: 'Foundation', track: 'DELIVERY', duration: '20m', locked: false },
        { id: 'f_t2', title: 'Frontend vs Backend', description: 'Who builds what? HTML/CSS vs Node/Python.', difficulty: 'BEGINNER', category: 'Foundation', track: 'DELIVERY', duration: '15m', locked: false },
        
        { id: 'f_s1', title: 'Product vs Project', description: 'Outcomes over Outputs.', difficulty: 'BEGINNER', category: 'Foundation', track: 'STRATEGY', duration: '10m', locked: false },
        { id: 'f_s2', title: 'Business Models', description: 'SaaS, Marketplace, Ad-tech basics.', difficulty: 'BEGINNER', category: 'Foundation', track: 'STRATEGY', duration: '25m', locked: false },

        // --- GALAXY 2: CORE (The Builder) ---
        // Discovery
        { id: 'c_d1', title: 'User Interviews', description: 'The Mom Test. Asking good questions.', difficulty: 'INTERMEDIATE', category: 'Core', track: 'DISCOVERY', duration: '30m', locked: true },
        { id: 'c_d2', title: 'Usability Testing', description: 'Watching users fail at using your app.', difficulty: 'INTERMEDIATE', category: 'Core', track: 'DISCOVERY', duration: '25m', locked: true },
        { id: 'c_d3', title: 'Figma for PMs', description: 'Reading files, leaving comments, basic wireframing.', difficulty: 'INTERMEDIATE', category: 'Core', track: 'DISCOVERY', duration: '35m', locked: true },
        
        // Delivery
        { id: 'c_t1', title: 'Agile Rituals', description: 'Standups, Sprint Planning, Retros.', difficulty: 'INTERMEDIATE', category: 'Core', track: 'DELIVERY', duration: '20m', locked: true },
        { id: 'c_t2', title: 'Writing Tickets', description: 'User Stories, Acceptance Criteria, Gherkin.', difficulty: 'INTERMEDIATE', category: 'Core', track: 'DELIVERY', duration: '40m', locked: true },
        { id: 'c_t3', title: 'APIs for PMs', description: 'Requests, Responses, JSON, and Webhooks.', difficulty: 'INTERMEDIATE', category: 'Core', track: 'DELIVERY', duration: '45m', locked: true },
        { id: 'c_t4', title: 'SQL Basics', description: 'Select * From Users. Getting your own data.', difficulty: 'INTERMEDIATE', category: 'Core', track: 'DELIVERY', duration: '60m', locked: true },

        // Strategy
        { id: 'c_s1', title: 'North Star Metrics', description: 'Defining the one metric that matters.', difficulty: 'INTERMEDIATE', category: 'Core', track: 'STRATEGY', duration: '30m', locked: true },
        { id: 'c_s2', title: 'Prioritization (RICE)', description: 'Scoring features to say no.', difficulty: 'INTERMEDIATE', category: 'Core', track: 'STRATEGY', duration: '25m', locked: true },
        { id: 'c_s3', title: 'Stakeholder Management', description: 'Managing Up and Across.', difficulty: 'INTERMEDIATE', category: 'Core', track: 'STRATEGY', duration: '35m', locked: true },

        // --- GALAXY 3: ADVANCED (The Strategist) ---
        // Discovery
        { id: 'a_d1', title: 'Jobs To Be Done (JTBD)', description: 'The "Milkshake" theory of product.', difficulty: 'ADVANCED', category: 'Advanced', track: 'DISCOVERY', duration: '40m', locked: true },
        { id: 'a_d2', title: 'Behavioral Psychology', description: 'Hooks, Triggers, and variable rewards.', difficulty: 'ADVANCED', category: 'Advanced', track: 'DISCOVERY', duration: '45m', locked: true },
        { id: 'a_d3', title: 'Continuous Discovery', description: 'Weekly customer touchpoints.', difficulty: 'ADVANCED', category: 'Advanced', track: 'DISCOVERY', duration: '30m', locked: true },

        // Delivery
        { id: 'a_t1', title: 'System Architecture', description: 'Monoliths vs Microservices. Scaling.', difficulty: 'ADVANCED', category: 'Advanced', track: 'DELIVERY', duration: '50m', locked: true },
        { id: 'a_t2', title: 'Tech Debt Management', description: 'Balancing speed vs stability.', difficulty: 'ADVANCED', category: 'Advanced', track: 'DELIVERY', duration: '35m', locked: true },
        { id: 'a_t3', title: '3rd Party Integrations', description: 'Build vs Buy decisions.', difficulty: 'ADVANCED', category: 'Advanced', track: 'DELIVERY', duration: '30m', locked: true },

        // Strategy
        { id: 'a_s1', title: 'Growth Loops', description: 'Acquisition -> Activation -> Referral.', difficulty: 'ADVANCED', category: 'Advanced', track: 'STRATEGY', duration: '55m', locked: true },
        { id: 'a_s2', title: 'Pricing Strategy', description: 'Freemium, Tiered, Dynamic pricing.', difficulty: 'ADVANCED', category: 'Advanced', track: 'STRATEGY', duration: '45m', locked: true },
        { id: 'a_s3', title: 'Product Vision', description: 'Writing the press release for 3 years out.', difficulty: 'ADVANCED', category: 'Advanced', track: 'STRATEGY', duration: '40m', locked: true },

        // --- GALAXY 4: EXPERT (The Leader) ---
        // Discovery
        { id: 'e_d1', title: 'Managing Research Teams', description: 'Scaling insights across the org.', difficulty: 'EXPERT', category: 'Expert', track: 'DISCOVERY', duration: '40m', locked: true },
        // Delivery
        { id: 'e_t1', title: 'Platform Engineering', description: 'Building internal developer platforms.', difficulty: 'EXPERT', category: 'Expert', track: 'DELIVERY', duration: '50m', locked: true },
        { id: 'e_t2', title: 'AI & LLM Integration', description: 'Prompt engineering & RAG for PMs.', difficulty: 'EXPERT', category: 'Expert', track: 'DELIVERY', duration: '60m', locked: true },
        // Strategy
        { id: 'e_s1', title: 'M&A Integration', description: 'Merging products and tech stacks.', difficulty: 'EXPERT', category: 'Expert', track: 'STRATEGY', duration: '50m', locked: true },
        { id: 'e_s2', title: 'Org Design', description: 'Conway\'s Law. Structuring teams.', difficulty: 'EXPERT', category: 'Expert', track: 'STRATEGY', duration: '45m', locked: true },
    ];

    for (const m of modules) {
        await Module.findOneAndUpdate({ id: m.id }, m, { upsert: true, new: true });
    }

    // --- SCENARIOS ---
    const scenarios = [
        { id: 's1', title: 'The Angry Stakeholder', description: 'Sales VP demands a feature needed "yesterday".', difficulty: 'BEGINNER', context: 'You are a junior PS at a B2B SaaS co. The VP of Sales interrupts your lunch.', task: 'Draft a response that acknowledges their urgency but protects the roadmap.' },
        { id: 's2', title: 'Metric Mystery', description: 'Retention dropped 15% overnight.', difficulty: 'INTERMEDIATE', context: 'Monday morning. The dashboard shows a sharp decline in Daily Active Users (DAU) after the Friday release.', task: 'Outline your investigation plan. Who do you talk to? What data do you check?' },
        { id: 's3', title: 'Technical Debt Trade-off', description: 'Engineering wants to refactor. Product wants features.', difficulty: 'ADVANCED', context: 'The Lead Engineer says the login system is "held together by duct tape". Marketing wants a new social login feature.', task: 'Write a proposal for how to balance these conflicting needs for the Q3 roadmap.' }
    ];

    for (const s of scenarios) {
        await Scenario.findOneAndUpdate({ id: s.id }, s, { upsert: true, new: true });
    }

    // --- RESOURCES (KNOWLEDGE HUB) ---
    const resources = [
        { 
            id: 'r1', 
            title: 'Product Management 101', 
            description: 'The absolute basics. What is this job and why does it exist?', 
            type: 'GUIDE', 
            difficulty: 'BEGINNER', 
            category: 'Foundation', 
            duration: '15 min', 
            tags: ['Basics', 'Role'], 
            content: '# Product Management 101\n\n## What is a Product Manager?\nA Product Manager (PM) is responsible for the success of a product. You are the intersection between:\n1. **Business**: Maximizing value and ROI.\n2. **Technology**: Understanding what is feasible.\n3. **UX (User Experience)**: Advocating for the user.\n\n## The "Mini-CEO" Myth\nYou might hear people say a PM is the "CEO of the product."\n- **True**: You are responsible for the outcome.\n- **False**: You have zero direct authority. You must lead through influence.' 
        },
        {
            id: 'r2',
            title: 'Agile Ceremonies Explained',
            description: 'Standups, Retros, and Sprint Planning. What happens when?',
            type: 'ARTICLE',
            difficulty: 'BEGINNER',
            category: 'Foundation',
            duration: '10 min',
            tags: ['Agile', 'Process'],
            content: '# Agile Ceremonies\n\n## 1. Daily Standup\n15 mins max. What did you do yesterday? What will you do today? Are you blocked?\n\n## 2. Sprint Planning\nDefining what gets built in the next 2 weeks. Based on velocity.\n\n## 3. Retro (Retrospective)\nThe most important meeting. Discussing what went wrong and how to fix the process.'
        },
         {
            id: 'r_sdlc',
            title: 'The Software Development Lifecycle (SDLC)',
            description: 'How code goes from an idea to a live feature.',
            type: 'ARTICLE',
            difficulty: 'BEGINNER',
            category: 'Foundation',
            duration: '12 min',
            tags: ['Technical', 'Process'],
            content: '# The SDLC\n\n1. **Planning**: Requirements gathering.\n2. **Design**: UI/UX and System Architecture.\n3. **Implementation**: Coding.\n4. **Testing**: QA and UAT.\n5. **Deployment**: Releasing to Prod.\n6. **Maintenance**: Bug fixes.'
        },
        { 
            id: 'r3', 
            title: 'The Art of the User Interview', 
            description: 'How to talk to users without biasing them. The Mom Test principles.', 
            type: 'GUIDE', 
            difficulty: 'INTERMEDIATE', 
            category: 'Core', 
            duration: '20 min', 
            tags: ['Research', 'Discovery'], 
            content: '# User Interviews\n\n## The Golden Rule\nNever ask "Would you use this?". People lie to be nice.\n\n## Ask About the Past\nAsk "When was the last time you encountered this problem?" and "How did you solve it?". Past behavior predicts future behavior.' 
        },
        {
            id: 'r_prd_1',
            title: 'The Perfect PRD Structure',
            description: 'How to write specs that engineers actually read.',
            type: 'GUIDE', 
            difficulty: 'INTERMEDIATE', 
            category: 'Core', 
            duration: '30 min', 
            tags: ['PRD', 'Documentation'], 
            content: '# The Product Requirements Document (PRD)\n\n## Core Sections\n1. **Problem Statement**: Why are we doing this?\n2. **Success Metrics**: How do we know we won?\n3. **User Stories**: Functional requirements.\n4. **Out of Scope**: What we are NOT building.\n5. **Risks**: What could go wrong?'
        },
        {
            id: 'r_prioritization',
            title: 'RICE vs MoSCoW',
            description: 'Prioritization frameworks to decide what to build next.',
            type: 'GUIDE',
            difficulty: 'INTERMEDIATE',
            category: 'Core',
            duration: '18 min',
            tags: ['Strategy', 'Prioritization'],
            content: '# Prioritization Frameworks\n\n## RICE Score\n(Reach * Impact * Confidence) / Effort.\n\n## MoSCoW\n- **M**ust Have\n- **S**hould Have\n- **C**ould Have\n- **W**on\'t Have'
        }
    ];
    
    for (const r of resources) {
        await Resource.findOneAndUpdate({ id: r.id }, r, { upsert: true, new: true });
    }

    if (res) {
        res.json({ message: "Database seeded successfully with Tri-Track curriculum." });
    } else {
        console.log("Database seeded successfully with Tri-Track curriculum.");
    }
  } catch (error) {
    if (res) {
        res.status(500).json({ error: error.message });
    } else {
        console.error("Seeding Error:", error);
    }
  }
};