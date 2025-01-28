import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import ChatList from '../components/Chat/ChatList';
import ChatWindow from '../components/Chat/ChatWindow';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const { socket } = useSocket();
  const { user } = useAuth();
  const location = useLocation();
  const queryClient = useQueryClient();

  // Buscar lista de chats
  const { data: chats = [], isLoading } = useQuery(
    'chats',
    async () => {
      const response = await api.get('/chat/user-chats');
      return response.data.data;
    },
    {
      onSuccess: (data) => {
        // Se houver um chatId no state da navegação, seleciona ele
        if (location.state?.chatId) {
          const chat = data.find(c => c._id === location.state.chatId);
          if (chat) {
            setSelectedChat(chat);
          }
        }
      }
    }
  );

  // Buscar mensagens do chat selecionado
  const fetchMessages = useCallback(async () => {
    if (!selectedChat) return;

    try {
      const response = await api.get(`/chat/${selectedChat._id}/messages`);
      setMessages(response.data.data.messages);
      socket?.emit('join chat', selectedChat._id);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
    }
  }, [selectedChat, socket]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Mutation para deletar chat
  const deleteChatMutation = useMutation(
    async (chatId) => {
      await api.delete(`/chat/${chatId}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('chats');
        if (selectedChat) {
          setSelectedChat(null);
          setMessages([]);
        }
      }
    }
  );

  // Socket.IO listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      if (selectedChat?._id === newMessage.chatId) {
        setMessages(prev => {
          const filtered = prev.filter(msg => 
            msg._id !== newMessage._id && 
            !(msg.temp && msg.content === newMessage.content)
          );
          return [...filtered, newMessage];
        });
      }

      // Atualizar preview do chat na lista
      queryClient.setQueryData('chats', (oldChats = []) => {
        return oldChats.map(chat => {
          if (chat._id === newMessage.chatId) {
            return {
              ...chat,
              lastMessage: newMessage.content,
              updatedAt: newMessage.createdAt
            };
          }
          return chat;
        });
      });
    };

    socket.on('message received', handleNewMessage);

    return () => {
      socket.off('message received', handleNewMessage);
    };
  }, [socket, selectedChat, queryClient]);

  const handleSendMessage = async (content) => {
    if (!selectedChat || !content.trim()) return;

    const tempMessage = {
      _id: `temp-${Date.now()}`,
      chatId: selectedChat._id,
      content: content.trim(),
      sender: {
        _id: user.id,
        name: user.name
      },
      createdAt: new Date().toISOString(),
      temp: true
    };

    setMessages(prev => [...prev, tempMessage]);

    try {
      socket?.emit('new message', {
        chatId: selectedChat._id,
        content: content.trim()
      });
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setMessages(prev => prev.filter(msg => msg._id !== tempMessage._id));
    }
  };

  const handleDeleteChat = async (chatId) => {
    if (window.confirm('Tem certeza que deseja excluir esta conversa?')) {
      await deleteChatMutation.mutateAsync(chatId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
        {/* Lista de Chats */}
        <div className="md:col-span-1">
          <ChatList
            chats={chats}
            selectedChat={selectedChat}
            onSelectChat={setSelectedChat}
            onDeleteChat={handleDeleteChat}
          />
        </div>

        {/* Janela de Chat */}
        <div className="md:col-span-2 lg:col-span-3">
          <ChatWindow
            chat={selectedChat}
            messages={messages}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;