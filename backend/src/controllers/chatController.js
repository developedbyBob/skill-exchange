// src/controllers/chatController.js
const Chat = require('../models/Chat');
const User = require('../models/User');
const mongoose = require('mongoose');

// Iniciar chat a partir de uma troca de skills
exports.initiateChat = async (req, res) => {
  try {
    const { receiverId, skillOffered, skillRequested } = req.body;
    
    // Verifica se já existe um chat entre estes usuários com estas skills
    let chat = await Chat.findOne({
      participants: { 
        $all: [req.user.id, receiverId] 
      },
      skillOffered,
      skillRequested,
      status: 'active'
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [req.user.id, receiverId],
        skillOffered,
        skillRequested
      });
    }

    await chat.populate('participants', 'name email');

    res.status(200).json({
      success: true,
      data: chat
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Criar ou buscar chat direto
exports.getOrCreateChat = async (req, res) => {
  try {
    const { partnerId } = req.body;
    
    let chat = await Chat.findOne({
      participants: { 
        $all: [req.user.id, partnerId] 
      },
      status: 'active'
    }).populate('participants', 'name email');

    if (!chat) {
      chat = await Chat.create({
        participants: [req.user.id, partnerId]
      });
      await chat.populate('participants', 'name email');
    }

    res.status(200).json({
      success: true,
      data: chat
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Listar chats do usuário
exports.getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user.id,
      status: 'active'
    })
    .populate('participants', 'name email')
    .sort('-lastMessage')
    // Adicionar distinct por _id
    .distinct('_id');

    // Buscar os chats completos após distinct
    const fullChats = await Chat.find({
      _id: { $in: chats }
    }).populate('participants', 'name email');

    res.status(200).json({
      success: true,
      data: fullChats
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Buscar mensagens de um chat
// Buscar mensagens de um chat
exports.getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    console.log('Buscando mensagens para o chat:', chatId);
    console.log('Usuário solicitando:', req.user._id);

    // Buscar o chat com todas as mensagens
    const chat = await Chat.findById(chatId)
      .populate({
        path: 'messages.sender',
        select: 'name email _id'
      })
      .lean(); // Usar .lean() para melhor performance
    
    if (!chat) {
      console.log('Chat não encontrado');
      return res.status(404).json({
        success: false,
        error: 'Chat não encontrado'
      });
    }

    // Verificação de acesso
    const hasAccess = chat.participants.some(
      participant => participant.toString() === req.user._id.toString()
    );

    if (!hasAccess) {
      console.log('Acesso não autorizado');
      return res.status(403).json({
        success: false,
        error: 'Acesso não autorizado a este chat'
      });
    }

    // Preparar mensagens, garantindo ordenação por data de criação
    const messages = (chat.messages || [])
      .map(message => ({
        _id: message._id,
        chatId: chat._id,
        content: message.content,
        sender: {
          _id: message.sender._id,
          name: message.sender.name,
          email: message.sender.email
        },
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
        read: message.read
      }))
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    console.log(`Retornando ${messages.length} mensagens`);

    res.status(200).json({
      success: true,
      data: { messages }
    });

  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      details: error.message
    });
  }
};

// Enviar mensagem (via REST)
exports.sendMessage = async (req, res) => {
  try {
    const { chatId, content } = req.body;
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        error: 'Chat não encontrado'
      });
    }

    if (!chat.participants.includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        error: 'Não autorizado a enviar mensagens neste chat'
      });
    }

    const message = {
      _id: new mongoose.Types.ObjectId(),
      sender: req.user.id,
      content,
      read: false,
      createdAt: new Date()
    };

    chat.messages.push(message);
    chat.lastMessage = new Date();
    await chat.save();

    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Arquivar chat
exports.archiveChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        error: 'Chat não encontrado'
      });
    }

    if (!chat.participants.includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        error: 'Acesso não autorizado a este chat'
      });
    }

    chat.status = 'archived';
    await chat.save();

    res.status(200).json({
      success: true,
      data: chat
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

exports.deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);
    
    if (!chat) {
      return res.status(404).json({
        success: false,
        error: 'Chat não encontrado'
      });
    }

    // Verificar se o usuário é participante do chat
    if (!chat.participants.includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        error: 'Não autorizado'
      });
    }

    await chat.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Chat removido com sucesso'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};