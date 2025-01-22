// src/controllers/userController.js
const User = require('../models/User');
const Skill = require('../models/Skill');

// Get user skills
exports.getUserSkills = async (req, res) => {
  try {
    const skills = await Skill.find({ user: req.user.id })
      .populate('user', 'name email');

    res.status(200).json({
      success: true,
      data: skills
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar skills do usuário'
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, location, bio } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, location, bio },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};