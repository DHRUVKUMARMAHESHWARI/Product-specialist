const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const contentController = require('../controllers/contentController');
const aiController = require('../controllers/aiController');

// User Routes
router.get('/user', userController.getUser);
router.put('/user', userController.updateUser);

// Content Routes
router.get('/modules', contentController.getModules);
router.get('/scenarios', contentController.getScenarios);
router.get('/resources', contentController.getResources);
router.post('/seed', contentController.seedData);

// AI Routes
router.post('/ai/chat', aiController.chat);
router.post('/ai/evaluate', aiController.evaluate);
router.post('/ai/generate', aiController.generate);

module.exports = router;