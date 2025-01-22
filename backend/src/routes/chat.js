// src/routes/chat.js
const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const {
  initiateChat,
  getOrCreateChat,
  getUserChats,
  getChatMessages,
  sendMessage,
  archiveChat,
  deleteChat
} = require('../controllers/chatController');

// Proteger todas as rotas
router.use(protect);

// Rotas
router.post('/initiate', initiateChat);        // Para iniciar chat a partir de uma troca
router.post('/create', getOrCreateChat);       // Para criar chat diretamente
router.get('/user-chats', getUserChats);       // Listar chats do usuário
router.get('/:chatId/messages', getChatMessages); // Buscar mensagens de um chat
router.post('/send-message', sendMessage);     // Enviar mensagem via REST
router.put('/:chatId/archive', archiveChat);   // Arquivar chat
router.delete('/:chatId', protect, deleteChat);


module.exports = router;