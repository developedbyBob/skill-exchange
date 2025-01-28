import React from 'react';
import { useQuery } from 'react-query';
import { Star, User, ArrowRight } from 'lucide-react';
import { Card, Badge } from '../ui/Button';
import api from '../../services/api';

const ReviewSection = ({ review }) => {
  if (!review) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className={i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
            />
          ))}
        </div>
        <span className="text-sm text-gray-500">
          {review.rating.toFixed(1)}
        </span>
      </div>
      <p className="text-sm text-gray-600">{review.comment}</p>
    </div>
  );
};

const ExchangeCard = ({ exchange }) => {
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
                <User size={24} className="text-gray-400" />
              )}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{exchange.partner.name}</h3>
              <p className="text-sm text-gray-500">
                Concluído em {new Date(exchange.completedDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <Badge variant="secondary">Concluído</Badge>
        </div>

        {/* Skills Exchange */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">Habilidade Oferecida</p>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900">{exchange.offeredSkill.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{exchange.offeredSkill.description}</p>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowRight className="text-gray-400" size={24} />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">Habilidade Recebida</p>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900">{exchange.requestedSkill.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{exchange.requestedSkill.description}</p>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="border-t pt-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Avaliação Recebida</h4>
              <ReviewSection review={exchange.receivedReview} />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Sua Avaliação</h4>
              <ReviewSection review={exchange.givenReview} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

const CompletedExchanges = () => {
  const { data: exchanges, isLoading } = useQuery(
    'completedExchanges',
    async () => {
      const response = await api.get('/exchanges/completed');
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
              <div className="space-y-4">
                <div className="h-24 bg-gray-200 rounded" />
                <div className="h-24 bg-gray-200 rounded" />
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
          Nenhuma troca concluída
        </h3>
        <p className="text-gray-500">
          Suas trocas finalizadas aparecerão aqui
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

export default CompletedExchanges;