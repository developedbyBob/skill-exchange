import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { MessageCircle, Star } from 'lucide-react';
import { Button, Card, Badge } from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const ExchangeCard = ({ exchange }) => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const completeMutation = useMutation(
    async ({ exchangeId, reviewData }) => {
      const response = await api.post(`/exchanges/${exchangeId}/complete`, reviewData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('activeExchanges');
        setShowReviewModal(false);
      }
    }
  );

  const handleChat = () => {
    navigate('/chat', { state: { exchangeId: exchange._id } });
  };

  return (
    <Card>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              {exchange.partner.avatar ? (
                <img
                  src={exchange.partner.avatar}
                  alt={exchange.partner.name}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <span className="text-xl font-medium text-gray-600">
                  {exchange.partner.name.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{exchange.partner.name}</h3>
              <p className="text-sm text-gray-500">
                Iniciado em {new Date(exchange.startDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <Badge variant="success">Em Andamento</Badge>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Progresso da Troca</h4>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${exchange.progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">{exchange.progress}% concluído</p>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={handleChat}
            className="flex items-center"
          >
            <MessageCircle size={18} className="mr-2" />
            Chat
          </Button>
          <Button
            variant="primary"
            onClick={() => setShowReviewModal(true)}
            className="flex items-center"
          >
            <Star size={18} className="mr-2" />
            Concluir Troca
          </Button>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">Avaliar e Concluir Troca</h3>
              {/* Add review form here */}
            </div>
          </Card>
        </div>
      )}
    </Card>
  );
};

const ActiveExchanges = () => {
  const { data: exchanges, isLoading } = useQuery(
    'activeExchanges',
    async () => {
      const response = await api.get('/exchanges/active');
      return response.data.data;
    }
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-48" />
                  <div className="h-3 bg-gray-200 rounded w-32" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-2 bg-gray-200 rounded-full" />
                <div className="h-8 bg-gray-200 rounded" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!exchanges?.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhuma troca ativa
        </h3>
        <p className="text-gray-500">
          Suas trocas em andamento aparecerão aqui
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {exchanges.map((exchange) => (
        <ExchangeCard key={exchange._id} exchange={exchange} />
      ))}
    </div>
  );
};

export default ActiveExchanges;