const { User } = require('../models');

exports.getUser = async (req, res) => {
  try {
    // For this single-user demo, we fetch the first user or create one
    let user = await User.findOne();
    if (!user) {
      user = await User.create({
        name: "New Specialist",
        level: "Apprentice",
        xp: 0,
        streak: 1,
        confidence: { research: 10, strategy: 10, technical: 10, communication: 10 }
      });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    // Updates the first found user for now
    const user = await User.findOneAndUpdate({}, req.body, { new: true });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};