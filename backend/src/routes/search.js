// src/routes/search.js
const express = require('express');
const { 
  searchSkills, 
  getSkillSuggestions 
} = require('../controllers/searchController');

const router = express.Router();

router.get('/skills', searchSkills);
router.get('/suggestions', getSkillSuggestions);

module.exports = router;