// src/controllers/skillController.js
const Skill = require('../models/Skill');

// Criar uma nova skill
exports.createSkill = async (req, res) => {
  try {
    const { name, description, category, level, exchangePreferences } = req.body;
    
    const skill = await Skill.create({
      name,
      description,
      category,
      level,
      exchangePreferences,
      user: req.user.id
    });

    res.status(201).json({
      success: true,
      data: skill
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Listar todas as skills (com filtros)
exports.getSkills = async (req, res) => {
  try {
    let query = {};

    // Filtros
    if (req.query.category) query.category = req.query.category;
    if (req.query.level) query.level = req.query.level;
    if (req.query.available) query.available = req.query.available === 'true';

    const skills = await Skill.find(query)
      .populate('user', 'name email location')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: skills.length,
      data: skills
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Obter uma skill específica
exports.getSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id)
      .populate('user', 'name email location rating');

    if (!skill) {
      return res.status(404).json({
        success: false,
        error: 'Skill não encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: skill
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Atualizar uma skill
exports.updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        error: 'Skill não encontrada'
      });
    }

    // Verificar se o usuário é dono da skill
    if (skill.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Usuário não autorizado a atualizar esta skill'
      });
    }

    const updatedSkill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: updatedSkill
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Deletar uma skill
exports.deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        error: 'Skill não encontrada'
      });
    }

    // Verificar se o usuário é dono da skill
    if (skill.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Usuário não autorizado a deletar esta skill'
      });
    }

    await skill.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};