// src/routes/exchanges.js
const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');

// Controllers
const {
  createProposal,
  getProposals,
  acceptProposal,
  declineProposal,
  getActiveExchanges,
  completeExchange,
  getCompletedExchanges
} = require('../controllers/exchangeController');

// Rotas protegidas
router.use(protect);

// Propostas
router.post('/proposals', createProposal);
router.get('/proposals', getProposals);
router.put('/proposals/:id/accept', acceptProposal);
router.put('/proposals/:id/decline', declineProposal);

// Trocas
router.get('/active', getActiveExchanges);
router.put('/:id/complete', completeExchange);
router.get('/completed', getCompletedExchanges);

module.exports = router;