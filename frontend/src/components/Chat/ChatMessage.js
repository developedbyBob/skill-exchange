import React from 'react';
import { User } from 'lucide-react';

const ChatMessage = ({ message, isOwnMessage }) => {
  const messageDate = new Date(message.createdAt);
  const timeString = messageDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className={`flex items-end space-x-2 ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
      <div className="flex-shrink-0">
        {message.sender.avatar ? (
          <img
            src={message.sender.avatar}
            alt={message.sender.name}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <User size={16} className="text-gray-400" />
          </div>
        )}
      </div>

      <div className={`max-w-[70%] group relative ${isOwnMessage ? 'items-end' : ''}`}>
        <div
          className={`
            px-4 py-2 rounded-2xl
            ${isOwnMessage
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-900'
            }
          `}
        >
          <p>{message.content}</p>
          <span 
            className={`
              text-xs mt-1 hidden group-hover:block absolute bottom-0 
              ${isOwnMessage 
                ? 'right-0 -mb-5 text-gray-500' 
                : 'left-0 -mb-5 text-gray-500'
              }
            `}
          >
            {timeString}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;