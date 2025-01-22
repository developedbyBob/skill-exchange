// src/routes/reviews.js
const express = require('express');
const {
  createReview,
  getUserReviews,
  getReviewsByUser,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const protect = require('../middleware/auth');

const router = express.Router();

// Rotas que necessitam de autenticação
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

// Rotas públicas
router.get('/user/:userId', getUserReviews);
router.get('/by-user/:userId', getReviewsByUser);

module.exports = router;