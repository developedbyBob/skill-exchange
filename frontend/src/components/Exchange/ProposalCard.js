import React from 'react';
import { ArrowRight, Check, X } from 'lucide-react';
import { Button, Badge, Card } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

const ProposalCard = ({ proposal, onAccept, onDecline }) => {
  const { user } = useAuth();
  const isReceived = proposal.receiver._id === user?.id;
  const otherUser = isReceived ? proposal.sender : proposal.receiver;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              {otherUser.avatar ? (
                <img
                  src={otherUser.avatar}
                  alt={otherUser.name}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-medium text-gray-600">
                    {otherUser.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{otherUser.name}</h3>
              <p className="text-sm text-gray-500">
                {formatDate(proposal.createdAt)}
              </p>
            </div>
          </div>
          <Badge
            variant={proposal.status === 'pending' ? 'warning' : 'success'}
          >
            {proposal.status === 'pending' ? 'Pendente' : 'Aceita'}
          </Badge>
        </div>

        {/* Skills Exchange */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">Habilidade Solicitada</p>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900">{proposal.skillRequested.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{proposal.skillRequested.description}</p>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowRight className="text-gray-400" size={24} />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">Habilidade Oferecida</p>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900">{proposal.skillOffered.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{proposal.skillOffered.description}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        {isReceived && proposal.status === 'pending' && (
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => onDecline(proposal._id)}
              className="flex items-center"
            >
              <X size={18} className="mr-2" />
              Recusar
            </Button>
            <Button
              variant="primary"
              onClick={() => onAccept(proposal._id)}
              className="flex items-center"
            >
              <Check size={18} className="mr-2" />
              Aceitar
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProposalCard;