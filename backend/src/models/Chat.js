// src/models/Chat.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Mensagem não pode estar vazia']
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const chatSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  messages: [messageSchema],
  lastMessage: {
    type: Date,
    default: Date.now
  },
  skillOffered: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill'
  },
  skillRequested: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill'
  },
  status: {
    type: String,
    enum: ['active', 'archived'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Adicione índices para melhorar performance
chatSchema.index({ 'participants': 1 });
chatSchema.index({ 'lastMessage': -1 });

module.exports = mongoose.model('Chat', chatSchema);