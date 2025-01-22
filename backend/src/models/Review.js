// src/models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Por favor, forneça uma avaliação'],
    min: [1, 'A avaliação deve ser pelo menos 1'],
    max: [5, 'A avaliação não pode ser maior que 5']
  },
  comment: {
    type: String,
    required: [true, 'Por favor, forneça um comentário'],
    trim: true,
    maxlength: [500, 'Comentário não pode ter mais que 500 caracteres']
  },
  exchangeCompleted: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Impedir usuários de fazer mais de uma review para a mesma troca
reviewSchema.index({ reviewer: 1, reviewed: 1, skill: 1 }, { unique: true });

// Método estático para calcular a média de avaliações de um usuário
reviewSchema.statics.calculateAverageRating = async function(userId) {
  const stats = await this.aggregate([
    {
      $match: { reviewed: mongoose.Types.ObjectId(userId) }
    },
    {
      $group: {
        _id: '$reviewed',
        averageRating: { $avg: '$rating' },
        numReviews: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model('User').findByIdAndUpdate(userId, {
      rating: Math.round(stats[0].averageRating * 10) / 10
    });
  }
};

// Chamar calculateAverageRating após salvar
reviewSchema.post('save', function() {
  this.constructor.calculateAverageRating(this.reviewed);
});

// Chamar calculateAverageRating antes de remover
reviewSchema.pre('remove', function() {
  this.constructor.calculateAverageRating(this.reviewed);
});

module.exports = mongoose.model('Review', reviewSchema);