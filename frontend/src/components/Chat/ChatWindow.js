import React, { useState, useRef, useEffect } from 'react';
import { Send, User, MessageSquare } from 'lucide-react';
import { Button } from '../ui/Button';
import ChatMessage from './ChatMessage';
import { useAuth } from '../../context/AuthContext';

const ChatWindow = ({ chat, messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    onSendMessage(newMessage);
    setNewMessage('');
  };

  if (!chat) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg border">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            Suas mensagens
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Selecione uma conversa para começar
          </p>
        </div>
      </div>
    );
  }

  const participant = chat.participants.find(p => p._id !== user.id);

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border">
      {/* Header */}
      <div className="px-6 py-4 border-b flex items-center space-x-3">
        <div className="flex-shrink-0">
          {participant?.avatar ? (
            <img
              src={participant.avatar}
              alt={participant.name}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <User size={20} className="text-gray-400" />
            </div>
          )}
        </div>
        <div>
          <h3 className="font-medium">{participant?.name}</h3>
          {participant?.isOnline && (
            <p className="text-sm text-green-500">Online</p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message, index) => (
          <ChatMessage
            key={message._id || index}
            message={message}
            isOwnMessage={message.sender._id === user.id}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <Button
            type="submit"
            variant="primary"
            className="rounded-full"
            disabled={!newMessage.trim()}
          >
            <Send size={20} />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;