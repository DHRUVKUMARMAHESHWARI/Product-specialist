const { Module, Scenario, Resource } = require('../models');

exports.getModules = async (req, res) => {
  try {
    const modules = await Module.find().sort({ category: 1 });
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
    const moduleCount = await Module.countDocuments();
    if (moduleCount === 0) {
        await Module.insertMany([
          { id: 'm1', title: 'What is a Product?', description: 'Physical vs Digital, B2B vs B2C basics.', difficulty: 'BEGINNER', category: 'Foundation', duration: '10m', locked: false },
          { id: 'm2', title: 'The Product Specialist Role', description: 'Day in the life and core responsibilities.', difficulty: 'BEGINNER', category: 'Foundation', duration: '15m', locked: false },
          { id: 'm3', title: 'Business Model Basics', description: 'How products actually make money.', difficulty: 'BEGINNER', category: 'Foundation', duration: '20m', locked: false },
          { id: 'm4', title: 'Tech for Non-Techies', description: 'APIs, Databases, and Frontends explained.', difficulty: 'BEGINNER', category: 'Foundation', duration: '25m', locked: false },
          { id: 'm5', title: 'User Research 101', description: 'Running interviews without bias.', difficulty: 'INTERMEDIATE', category: 'Core', duration: '30m', locked: true },
          { id: 'm6', title: 'Writing User Stories', description: 'The "As a... I want to... So that..." format.', difficulty: 'INTERMEDIATE', category: 'Core', duration: '20m', locked: true },
          { id: 'm7', title: 'Prioritization Frameworks', description: 'RICE, MoSCoW, and saying No.', difficulty: 'INTERMEDIATE', category: 'Core', duration: '35m', locked: true },
          { id: 'm8', title: 'Product Strategy', description: 'Vision vs. Strategy vs. Roadmap.', difficulty: 'ADVANCED', category: 'Advanced', duration: '45m', locked: true },
          { id: 'm9', title: 'Growth Mechanics', description: 'Loops, funnels, and viral coefficients.', difficulty: 'ADVANCED', category: 'Advanced', duration: '40m', locked: true },
        ]);
    }

    const scenarioCount = await Scenario.countDocuments();
    if (scenarioCount === 0) {
        await Scenario.insertMany([
            { id: 's1', title: 'The Angry Stakeholder', description: 'Sales VP demands a feature needed "yesterday".', difficulty: 'BEGINNER', context: 'You are a junior PS at a B2B SaaS co. The VP of Sales interrupts your lunch.', task: 'Draft a response that acknowledges their urgency but protects the roadmap.' },
            { id: 's2', title: 'Metric Mystery', description: 'Retention dropped 15% overnight.', difficulty: 'INTERMEDIATE', context: 'Monday morning. The dashboard shows a sharp decline in Daily Active Users (DAU) after the Friday release.', task: 'Outline your investigation plan. Who do you talk to? What data do you check?' },
            { id: 's3', title: 'Technical Debt Trade-off', description: 'Engineering wants to refactor. Product wants features.', difficulty: 'ADVANCED', context: 'The Lead Engineer says the login system is "held together by duct tape". Marketing wants a new social login feature.', task: 'Write a proposal for how to balance these conflicting needs for the Q3 roadmap.' }
        ]);
    }

    const resourceCount = await Resource.countDocuments();
    if (resourceCount === 0) {
        await Resource.insertMany([
            { id: 'r1', title: 'Product Management 101', description: 'Start here. What is this job and why does it exist?', type: 'GUIDE', difficulty: 'BEGINNER', category: 'Foundation', duration: '15 min', tags: ['Basics'], content: '# Product Management 101\n\n## What is a Product Manager?\nResponsible for the success of a product.' },
            { id: 'r3', title: 'The Art of the User Interview', description: 'How to talk to users without biasing them.', type: 'GUIDE', difficulty: 'INTERMEDIATE', category: 'Core', duration: '20 min', tags: ['Research'], content: '# User Interviews\n\nDon\'t ask leading questions.' },
            { id: 'r_prd_1', title: 'The Perfect PRD Structure', description: 'How to write specs that engineers actually read.', type: 'GUIDE', difficulty: 'INTERMEDIATE', category: 'Core', duration: '30 min', tags: ['PRD'], content: '# The PRD\n\nProblem, Solution, Scope.' }
        ]);
    }
    
    res.json({ message: "Database seeded successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};