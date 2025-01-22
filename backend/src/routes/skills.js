// src/routes/skills.js
const express = require('express');
const {
  getSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill
} = require('../controllers/skillController');
const protect = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(getSkills)
  .post(protect, createSkill);

router
  .route('/:id')
  .get(getSkill)
  .put(protect, updateSkill)
  .delete(protect, deleteSkill);

module.exports = router;