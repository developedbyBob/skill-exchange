// src/routes/users.js
const express = require('express');
const { getUserSkills, updateProfile } = require('../controllers/userController');
const protect = require('../middleware/auth');

const router = express.Router();

// Proteger todas as rotas
router.use(protect);

router.get('/skills', getUserSkills);
router.put('/profile', updateProfile);

module.exports = router;