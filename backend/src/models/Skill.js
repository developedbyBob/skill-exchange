// src/models/Skill.js
const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome da habilidade é obrigatório'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Descrição da habilidade é obrigatória'],
    maxlength: [500, 'Descrição não pode ter mais que 500 caracteres']
  },
  category: {
    type: String,
    required: [true, 'Categoria é obrigatória'],
    enum: ['Programação', 'Design', 'Marketing', 'Idiomas', 'Música', 'Outros']
  },
  level: {
    type: String,
    required: [true, 'Nível é obrigatório'],
    enum: ['Iniciante', 'Intermediário', 'Avançado', 'Especialista']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  available: {
    type: Boolean,
    default: true
  },
  exchangePreferences: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Skill', skillSchema);