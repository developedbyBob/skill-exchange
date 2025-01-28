import React from 'react';
import { Card, Badge, Button } from '../ui/Button';
import { Star, MapPin, MessageCircle, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SkillCard = ({ skill, onProposeTrade }) => {
  const navigate = useNavigate();

  const handleChat = () => {
    navigate('/chat', { 
      state: { 
        userId: skill.user._id,
        skillId: skill._id 
      }
    });
  };

  return (
    <Card className="h-full">
      <div className="p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <Badge variant="primary">{skill.category}</Badge>
          <Badge 
            variant={skill.available ? 'success' : 'warning'}
          >
            {skill.available ? 'Disponível' : 'Indisponível'}
          </Badge>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-lg font-medium mb-2">{skill.name}</h3>
          <p className="text-gray-600 text-sm mb-4">
            {skill.description}
          </p>

          {/* User Info */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex-shrink-0">
              {skill.user.avatar ? (
                <img
                  src={skill.user.avatar}
                  alt={skill.user.name}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <User size={20} className="text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <p className="font-medium">{skill.user.name}</p>
              <div className="flex items-center text-sm text-gray-500">
                <MapPin size={14} className="mr-1" />
                {skill.user.location}
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < skill.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              ({skill.reviewsCount} avaliações)
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3 mt-4">
          <Button
            variant="outline"
            onClick={handleChat}
            className="flex-1"
          >
            <MessageCircle size={18} className="mr-2" />
            Conversar
          </Button>
          <Button
            variant="primary"
            onClick={() => onProposeTrade(skill)}
            className="flex-1"
            disabled={!skill.available}
          >
            Propor Troca
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SkillCard;