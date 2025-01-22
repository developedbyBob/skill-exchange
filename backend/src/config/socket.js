const socketIO = require('socket.io');
const mongoose = require('mongoose');
const Chat = require('../models/Chat');
const User = require('../models/User');
const { verifyToken } = require('./jwt');

const initializeSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = verifyToken(token.replace('Bearer ', ''));
      if (!decoded) {
        return next(new Error('Invalid token'));
      }

      socket.userId = decoded.id;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.userId);

    socket.on('join chat', (chatId) => {
      socket.join(chatId);
      console.log('User joined chat:', chatId);
    });

    socket.on('new message', async (data) => {
      try {
        console.log('===== INÍCIO SALVAMENTO DE MENSAGEM =====');
        console.log('Dados recebidos:', data);
        console.log('ID do usuário no socket:', socket.userId);
    
        const { chatId, content } = data;
    
        // Verificar se todos os dados necessários estão presentes
        if (!chatId || !content) {
          console.error('Dados de mensagem inválidos:', { chatId, content });
          throw new Error('Dados de mensagem inválidos');
        }
    
        // Buscar usuário
        const user = await User.findById(socket.userId);
        if (!user) {
          console.error('Usuário não encontrado:', socket.userId);
          throw new Error('Usuário não encontrado');
        }
    
        // Verificar se o chat existe
        const chat = await Chat.findById(chatId);
        if (!chat) {
          console.error('Chat não encontrado:', chatId);
          throw new Error('Chat não encontrado');
        }
    
        // Log detalhado dos participantes do chat
        console.log('Participantes do chat:', chat.participants);
        console.log('Usuário atual:', socket.userId);
    
        // Verificar se o usuário é um participante do chat
        const isParticipant = chat.participants.some(
          participant => participant.toString() === socket.userId.toString()
        );
    
        if (!isParticipant) {
          console.error('Usuário não é participante do chat');
          throw new Error('Usuário não autorizado a enviar mensagens neste chat');
        }
    
        // Criar nova mensagem
        const newMessage = {
          sender: socket.userId,
          content,
          read: false
        };
    
        // Adicionar mensagem ao chat
        chat.messages.push(newMessage);
        
        // Atualizar último momento de mensagem
        chat.lastMessage = new Date();
    
        // Salvar chat com nova mensagem
        const updatedChat = await chat.save();
        console.log('Chat atualizado:', updatedChat);
    
        // Popular detalhes do remetente
        await updatedChat.populate({
          path: 'messages.sender',
          select: 'name email _id'
        });
    
        // Pegar a última mensagem adicionada
        const savedMessage = updatedChat.messages[updatedChat.messages.length - 1];
        console.log('Mensagem salva:', savedMessage);
    
        const messageToSend = {
          _id: savedMessage._id,
          chatId,
          content: savedMessage.content,
          sender: {
            _id: savedMessage.sender._id,
            name: savedMessage.sender.name,
            email: savedMessage.sender.email
          },
          createdAt: savedMessage.createdAt,
          read: savedMessage.read
        };
    
        console.log('Mensagem para enviar:', messageToSend);
        console.log('===== FIM SALVAMENTO DE MENSAGEM =====');
    
        // Emitir mensagem para todos no chat
        io.to(chatId).emit('message received', messageToSend);
    
      } catch (error) {
        console.error('===== ERRO AO SALVAR MENSAGEM =====');
        console.error('Erro detalhado:', error);
        
        socket.emit('error', {
          message: 'Erro ao salvar mensagem',
          details: error.message
        });
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.userId);
    });
  });

  return io;
};

module.exports = initializeSocket;