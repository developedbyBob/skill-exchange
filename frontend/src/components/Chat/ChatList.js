import React, { useState } from 'react';
import { Search, User, MoreVertical, Trash2 } from 'lucide-react';
import { Input } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

const ChatPreview = ({ chat, isSelected, onClick, onDelete, currentUserId }) => {
  const [showMenu, setShowMenu] = useState(false);
  const otherUser = chat.participants.find(p => p._id !== currentUserId);

  if (!otherUser) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }
    
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    }
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div
      className={`
        relative px-4 py-3 cursor-pointer transition-colors
        ${isSelected ? 'bg-primary-50' : 'hover:bg-gray-50'}
      `}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          {otherUser.avatar ? (
            <img
              src={otherUser.avatar}
              alt={otherUser.name}
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <User size={24} className="text-gray-400" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {otherUser.name}
            </h3>
            <span className="text-xs text-gray-500">
              {formatDate(chat.updatedAt || chat.createdAt)}
            </span>
          </div>
          {chat.lastMessage && (
            <p className="text-sm text-gray-500 truncate">
              {chat.lastMessage}
            </p>
          )}
        </div>

        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <MoreVertical size={16} className="text-gray-400" />
          </button>

          {showMenu && (
            <div 
              className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(chat._id);
                  setShowMenu(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 size={16} className="mr-2" />
                Excluir conversa
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ChatList = ({ chats = [], selectedChat, onSelectChat, onDeleteChat }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  const filteredChats = chats.filter(chat => {
    const otherUser = chat.participants?.find(p => p._id !== user?.id);
    if (!otherUser) return false;
    return otherUser.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex flex-col h-full bg-white border rounded-lg overflow-hidden">
      {/* Search */}
      <div className="p-4 border-b">
        <Input
          placeholder="Buscar conversas..."
          icon={<Search size={20} />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto divide-y">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <ChatPreview
              key={chat._id}
              chat={chat}
              isSelected={selectedChat?._id === chat._id}
              onClick={() => onSelectChat(chat)}
              onDelete={onDeleteChat}
              currentUserId={user?.id}
            />
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            {searchQuery
              ? 'Nenhuma conversa encontrada'
              : 'Nenhuma conversa iniciada'}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;