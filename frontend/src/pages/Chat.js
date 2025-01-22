// src/pages/Chat.js
import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Container,
  Grid,
  Box,
  useToast,
  Text,
  Center,
  Spinner
} from '@chakra-ui/react';
import ChatList from '../components/Chat/ChatList';
import ChatWindow from '../components/Chat/ChatWindow';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { socket } = useSocket();
  const { user } = useAuth();
  const toast = useToast();
  const location = useLocation();

  // Função para buscar chats
  const fetchChats = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/chat/user-chats');
      const chatsData = response.data.data || [];
      setChats(chatsData);

      // Se houver um chatId no state da navegação, seleciona ele
      if (location.state?.chatId) {
        const chat = chatsData.find(c => c._id === location.state.chatId);
        if (chat) {
          setSelectedChat(chat);
        }
      }
    } catch (error) {
      setError(error.message);
      toast({
        title: 'Erro ao carregar chats',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [location.state?.chatId, toast]);

  // Carregar lista de chats
  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user, fetchChats]);

  // Carregar mensagens quando um chat é selecionado
  const fetchMessages = useCallback(async () => {
  if (!selectedChat) return;

  try {
    console.log('Buscando mensagens para o chat:', selectedChat._id);
    console.log('Usuário atual:', user);
    
    const response = await api.get(`/chat/${selectedChat._id}/messages`);
    
    console.log('Resposta da API de mensagens:', response.data);

    // Definir as mensagens diretamente da API
    setMessages(response.data.data.messages);

    // Entrar na sala do Socket.IO
    socket?.emit('join chat', selectedChat._id);
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    toast({
      title: 'Erro ao carregar mensagens',
      description: error.response?.data?.error || error.message,
      status: 'error',
      duration: 3000,
    });
  }
}, [selectedChat, socket, toast, user]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages, selectedChat]);

  // Escutar novas mensagens via Socket.IO
  useEffect(() => {
    if (!socket) {
      console.log('Socket not available');
      return;
    }
  
    console.log('Setting up socket listeners');
  
    const handleMessageReceived = (newMessage) => {
      console.log('Message received:', newMessage);
  
      if (selectedChat?._id === newMessage.chatId) {
        console.log('Message is for current chat');
        setMessages((prev) => {
          // Remover mensagem temporária se existir e adicionar a nova
          const filtered = prev.filter(msg => 
            msg._id !== newMessage._id && 
            !(msg.temp && msg.content === newMessage.content)
          );
          return [...filtered, newMessage];
        });
      }
    
      // Atualizar lista de chats
      setChats((prevChats) => {
        return prevChats.map((chat) => {
          if (chat._id === newMessage.chatId) {
            return {
              ...chat,
              lastMessage: newMessage.content,
              updatedAt: newMessage.createdAt
            };
          }
          return chat;
        }).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      });
    };
  
    socket.on('message received', handleMessageReceived);
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  
    return () => {
      console.log('Cleaning up socket listeners');
      socket.off('message received', handleMessageReceived);
      socket.off('error');
    };
  }, [socket, selectedChat, user.id]);
  
  // No handleSendMessage
  const handleSendMessage = async (content) => {
    if (!selectedChat || !content.trim()) {
      console.log('Mensagem inválida ou nenhum chat selecionado');
      return;
    }
  
    console.log('Preparando para enviar mensagem');
    
    const tempMessage = {
      _id: `temp-${Date.now()}`,
      chatId: selectedChat._id,
      content: content.trim(),
      sender: {
        _id: user.id,
        name: user.name,
        email: user.email
      },
      createdAt: new Date().toISOString(),
      temp: true
    };
    
    try {
      // Adicionar mensagem temporária imediatamente
      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages, tempMessage];
        return updatedMessages.sort((a, b) => 
          new Date(a.createdAt) - new Date(b.createdAt)
        );
      });
      
      // Preparar dados para envio
      const messageData = {
        chatId: selectedChat._id,
        content: content.trim()
      };
  
      // Verificar disponibilidade do socket
      if (!socket) {
        console.error('Socket não disponível para enviar mensagem');
        throw new Error('Conexão de socket não disponível');
      }
    
      // Adicionar callback de confirmação
      socket.emit('new message', messageData, (response) => {
        console.log('Resposta do servidor ao enviar mensagem:', response);
        
        if (response && response.error) {
          // Se houver erro no servidor
          throw new Error(response.error);
        }
      });
  
      console.log('Mensagem enviada com sucesso');
  
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast({
        title: 'Erro ao enviar mensagem',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
  
      // Remover mensagem temporária em caso de erro
      setMessages(prevMessages => 
        prevMessages.filter(msg => msg._id !== tempMessage._id)
      );
    }
  };

  const handleDeleteChat = useCallback(async (chatId) => {
    if (!chatId) {
      toast({
        title: 'Erro ao remover chat',
        description: 'ID do chat inválido',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    console.log(`Tentando remover o chat com ID: ${chatId}`);

    try {
      const response = await api.delete(`/chat/${chatId}`);
      console.log('Resposta da API:', response);

      toast({
        title: 'Chat removido com sucesso',
        status: 'success',
        duration: 3000,
      });
      
      if (selectedChat?._id === chatId) {
        setSelectedChat(null);
        setMessages([]);
      }
      
      fetchChats();
    } catch (error) {
      console.error('Erro ao remover chat:', error.response || error.message);
      console.log('Detalhes do erro:', error.response?.data);
      toast({
        title: 'Erro ao remover chat',
        description: error.response?.data?.error || 'Ocorreu um erro ao remover o chat',
        status: 'error',
        duration: 3000,
      });
    }
  }, [selectedChat, toast, fetchChats]);

  if (isLoading) {
    return (
      <Center height="calc(100vh - 200px)">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center height="calc(100vh - 200px)">
        <Text color="red.500">Erro ao carregar chats: {error}</Text>
      </Center>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Grid
        templateColumns={{ base: '1fr', md: '300px 1fr' }}
        gap={6}
        height="calc(100vh - 200px)"
      >
        <ChatList
          chats={chats}
          selectedChat={selectedChat}
          onSelectChat={setSelectedChat}
          onDeleteChat={handleDeleteChat}
        />
        <Box
          display={{ base: selectedChat ? 'block' : 'none', md: 'block' }}
          height="100%"
        >
          <ChatWindow
            chat={selectedChat}
            messages={messages}
            onSendMessage={handleSendMessage}
          />
        </Box>
      </Grid>
    </Container>
  );
};

export default Chat;