// src/controllers/reviewController.js
const Review = require('../models/Review');
const User = require('../models/User');

// Criar uma nova review
exports.createReview = async (req, res) => {
  try {
    const { reviewed, skill, rating, comment } = req.body;

    // Verificar se o usuário está avaliando a si mesmo
    if (req.user.id === reviewed) {
      return res.status(400).json({
        success: false,
        error: 'Você não pode avaliar a si mesmo'
      });
    }

    // Criar a review
    const review = await Review.create({
      reviewer: req.user.id,
      reviewed,
      skill,
      rating,
      comment
    });

    await review.populate([
      { path: 'reviewer', select: 'name email' },
      { path: 'reviewed', select: 'name email' },
      { path: 'skill', select: 'name description' }
    ]);

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    // Verificar se é um erro de duplicata
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Você já avaliou esta troca de habilidades'
      });
    }

    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Obter todas as reviews de um usuário
exports.getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewed: req.params.userId })
      .populate('reviewer', 'name email')
      .populate('skill', 'name description')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Obter reviews feitas por um usuário
exports.getReviewsByUser = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewer: req.params.userId })
      .populate('reviewed', 'name email')
      .populate('skill', 'name description')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Atualizar uma review
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review não encontrada'
      });
    }

    // Verificar se o usuário é o autor da review
    if (review.reviewer.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Não autorizado a atualizar esta review'
      });
    }

    // Atualizar apenas rating e comment
    review.rating = req.body.rating || review.rating;
    review.comment = req.body.comment || review.comment;
    await review.save();

    await review.populate([
      { path: 'reviewer', select: 'name email' },
      { path: 'reviewed', select: 'name email' },
      { path: 'skill', select: 'name description' }
    ]);

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Deletar uma review
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review não encontrada'
      });
    }

    // Verificar se o usuário é o autor da review
    if (review.reviewer.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Não autorizado a deletar esta review'
      });
    }

    await review.remove();

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