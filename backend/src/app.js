// src/app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIO = require('socket.io');
const connectDB = require('./config/database');
const { verifyToken } = require('./config/jwt');
const debugMiddleware = require('./middleware/debug');
const Chat = require('./models/Chat');



// Importar rotas
const authRoutes = require('./routes/auth');
const skillRoutes = require('./routes/skills');
const chatRoutes = require('./routes/chat');
const reviewRoutes = require('./routes/reviews');
const exchangeRoutes = require('./routes/exchanges');
const searchRoutes = require('./routes/search');
const userRoutes = require('./routes/users');
const { Socket } = require('dgram');

// Carrega variáveis de ambiente
dotenv.config();

// Inicializa o app
const app = express();
const server = http.createServer(app);

// Configuração do Socket.IO
const io = socketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  },
  path: '/socket.io/'
});

// Tornar o io disponível para os controllers
app.set('io', io);

// Middleware do Socket.IO
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Token não fornecido'));
    }

    // Remover 'Bearer ' do token se existir
    const actualToken = token.replace('Bearer ', '');
    
    // Verificar o token usando a função que já existe
    const decoded = verifyToken(actualToken);
    if (!decoded) {
      return next(new Error('Token inválido'));
    }

    // Adicionar o userId ao socket para uso posterior
    socket.userId = decoded.id;
    
    next();
  } catch (error) {
    next(new Error('Erro de autenticação'));
  }
});

// Socket.IO event handlers
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
  
      // Buscar o chat
      const chat = await Chat.findById(chatId);
      if (!chat) {
        console.error('Chat não encontrado:', chatId);
        throw new Error('Chat não encontrado');
      }
  
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

// Conecta ao banco de dados
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(debugMiddleware);


// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/exchanges', exchangeRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/users', userRoutes);

// Rota básica
app.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à API do Skills Exchange' });
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo deu errado!' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = { app, io };