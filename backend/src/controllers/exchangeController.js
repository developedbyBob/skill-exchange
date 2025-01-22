// src/controllers/exchangeController.js
const Exchange = require('../models/Exchange');
const Chat = require('../models/Chat');
const User = require('../models/User');
const Skill = require('../models/Skill');

// Criar proposta de troca
exports.createProposal = async (req, res) => {
  try {
    console.log('Headers:', req.headers);
    console.log('Dados recebidos:', req.body);
    console.log('Usuário atual:', req.user);

    const { receiverId, skillOffered, skillRequested } = req.body;

    // Validações básicas
    if (!receiverId) {
      console.log('Erro: receiverId não fornecido');
      return res.status(400).json({
        success: false,
        error: 'ID do receptor é obrigatório'
      });
    }

    if (!skillRequested) {
      console.log('Erro: skillRequested não fornecido');
      return res.status(400).json({
        success: false,
        error: 'ID da skill solicitada é obrigatório'
      });
    }

    if (receiverId === req.user.id) {
      console.log('Erro: tentativa de proposta para si mesmo');
      return res.status(400).json({
        success: false,
        error: 'Não é possível propor troca para si mesmo'
      });
    }

    // Verificar se o receptor existe
    const receiver = await User.findById(receiverId);
    console.log('Receptor encontrado:', receiver);
    
    if (!receiver) {
      return res.status(404).json({
        success: false,
        error: 'Usuário receptor não encontrado'
      });
    }

    // Verificar se a skill existe e pertence ao receptor
    const skill = await Skill.findOne({
      _id: skillRequested,
      user: receiverId,
      available: true
    });
    console.log('Skill encontrada:', skill);
    
    if (!skill) {
      return res.status(404).json({
        success: false,
        error: 'Skill solicitada não encontrada ou não pertence ao usuário selecionado'
      });
    }

    // Verificar proposta existente
    const existingProposal = await Exchange.findOne({
      sender: req.user.id,
      receiver: receiverId,
      skillRequested,
      status: 'pending'
    });
    console.log('Proposta existente:', existingProposal);

    if (existingProposal) {
      return res.status(400).json({
        success: false,
        error: 'Já existe uma proposta pendente para esta skill'
      });
    }

    // Criar chat com mensagem inicial
    const initialMessage = {
      sender: req.user.id,
      content: `Olá! Gostaria de trocar conhecimentos sobre ${skill.name}. Podemos conversar sobre isso?`,
      read: false,
      createdAt: new Date()
    };

    const chat = await Chat.create({
      participants: [req.user.id, receiverId],
      skillOffered,
      skillRequested,
      messages: [initialMessage],
      lastMessage: new Date()
    });
    console.log('Chat criado:', chat);

    // Criar a proposta
    const proposal = await Exchange.create({
      sender: req.user.id,
      receiver: receiverId,
      skillOffered,
      skillRequested,
      status: 'pending',
      chatId: chat._id
    });
    console.log('Proposta criada:', proposal);

    await chat.populate('participants', 'name email');
    await proposal.populate([
      { path: 'sender', select: 'name email' },
      { path: 'receiver', select: 'name email' },
      { path: 'skillRequested', select: 'name description' }
    ]);

    // Emitir mensagem via Socket.IO se disponível
    if (req.app.get('io')) {
      req.app.get('io').to(chat._id.toString()).emit('message received', {
        chatId: chat._id,
        sender: req.user.id,
        content: initialMessage.content,
        createdAt: initialMessage.createdAt,
        read: false
      });
    }

    res.status(201).json({
      success: true,
      data: {
        proposal,
        chat
      }
    });
  } catch (error) {
    console.error('Erro detalhado:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Erro ao criar proposta de troca'
    });
  }
};

// Obter propostas
exports.getProposals = async (req, res) => {
  try {
    const proposals = await Exchange.find({
      $or: [
        { sender: req.user.id },
        { receiver: req.user.id }
      ],
      status: 'pending'
    })
    .populate('sender', 'name email')
    .populate('receiver', 'name email')
    .populate('skillOffered', 'name description')
    .populate('skillRequested', 'name description');

    res.status(200).json({
      success: true,
      data: proposals
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Aceitar proposta
exports.acceptProposal = async (req, res) => {
  try {
    const proposal = await Exchange.findById(req.params.id);
    
    if (!proposal) {
      return res.status(404).json({
        success: false,
        error: 'Proposta não encontrada'
      });
    }

    if (proposal.receiver.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Não autorizado'
      });
    }

    proposal.status = 'active';
    await proposal.save();

    res.status(200).json({
      success: true,
      data: proposal
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Recusar proposta
exports.declineProposal = async (req, res) => {
  try {
    const proposal = await Exchange.findById(req.params.id);
    
    if (!proposal) {
      return res.status(404).json({
        success: false,
        error: 'Proposta não encontrada'
      });
    }

    if (proposal.receiver.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Não autorizado'
      });
    }

    proposal.status = 'declined';
    await proposal.save();

    res.status(200).json({
      success: true,
      data: proposal
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Obter trocas ativas
exports.getActiveExchanges = async (req, res) => {
  try {
    const exchanges = await Exchange.find({
      $or: [
        { sender: req.user.id },
        { receiver: req.user.id }
      ],
      status: 'active'
    })
    .populate('sender', 'name email')
    .populate('receiver', 'name email')
    .populate('skillOffered', 'name description')
    .populate('skillRequested', 'name description');

    res.status(200).json({
      success: true,
      data: exchanges
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Completar troca
exports.completeExchange = async (req, res) => {
  try {
    const exchange = await Exchange.findById(req.params.id);
    
    if (!exchange) {
      return res.status(404).json({
        success: false,
        error: 'Troca não encontrada'
      });
    }

    if (![exchange.sender.toString(), exchange.receiver.toString()].includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        error: 'Não autorizado'
      });
    }

    exchange.status = 'completed';
    await exchange.save();

    res.status(200).json({
      success: true,
      data: exchange
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Obter trocas completadas
exports.getCompletedExchanges = async (req, res) => {
  try {
    const exchanges = await Exchange.find({
      $or: [
        { sender: req.user.id },
        { receiver: req.user.id }
      ],
      status: 'completed'
    })
    .populate('sender', 'name email')
    .populate('receiver', 'name email')
    .populate('skillOffered', 'name description')
    .populate('skillRequested', 'name description');

    res.status(200).json({
      success: true,
      data: exchanges
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};