const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: String, default: "Apprentice" },
  xp: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  completedModules: [{ type: String }],
  confidence: {
    research: { type: Number, default: 0 },
    strategy: { type: Number, default: 0 },
    technical: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
  },
  learningStyle: { type: String, default: 'mixed' }
});

const ModuleSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: String,
  description: String,
  difficulty: String,
  category: String,
  track: { type: String, default: 'GENERAL' }, // 'DISCOVERY', 'DELIVERY', 'STRATEGY'
  duration: String,
  locked: { type: Boolean, default: true }
});

const ScenarioSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: String,
  description: String,
  difficulty: String,
  context: String,
  task: String
});

const ResourceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: String,
  description: String,
  type: String,
  difficulty: String,
  category: String,
  duration: String,
  tags: [String],
  content: String
});

module.exports = {
  User: mongoose.model('User', UserSchema),
  Module: mongoose.model('Module', ModuleSchema),
  Scenario: mongoose.model('Scenario', ScenarioSchema),
  Resource: mongoose.model('Resource', ResourceSchema)
};