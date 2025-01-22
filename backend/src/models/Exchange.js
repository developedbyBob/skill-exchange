// src/models/Exchange.js
const mongoose = require('mongoose');

const exchangeSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skillOffered: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: false // Mudado para false pois pode ser null inicialmente
  },
  skillRequested: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'declined'],
    default: 'pending'
  },
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Exchange', exchangeSchema);