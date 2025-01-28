import React from 'react';
import { useQuery } from 'react-query';
import { Star, User } from 'lucide-react';
import { Card, Badge, Tabs } from '../ui';
import api from '../../services/api';

const ReviewCard = ({ review }) => {
  return (
    <Card className="overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              {review.reviewer.avatar ? (
                <img
                  src={review.reviewer.avatar}
                  alt={review.reviewer.name}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <User size={20} className="text-gray-400" />
              )}
            </div>
            <div>
              <h3 className="font-medium">{review.reviewer.name}</h3>
              <p className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
              />
            ))}
          </div>
        </div>

        <div className="mt-4">
          <Badge variant="primary" className="mb-2">
            {review.skill.name}
          </Badge>
          <p className="text-gray-600">{review.comment}</p>
        </div>
      </div>
    </Card>
  );
};

const ReviewsList = () => {
  // Buscar avaliações recebidas
  const { data: receivedReviews, isLoading: loadingReceived } = useQuery(
    ['reviews', 'received'],
    async () => {
      const response = await api.get('/reviews/received');
      return response.data.data;
    }
  );

  // Buscar avaliações realizadas
  const { data: givenReviews, isLoading: loadingGiven } = useQuery(
    ['reviews', 'given'],
    async () => {
      const response = await api.get('/reviews/given');
      return response.data.data;
    }
  );

  const tabs = [
    {
      label: 'Avaliações Recebidas',
      content: (
        <div className="space-y-4">
          {loadingReceived ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                      <div className="h-3 bg-gray-200 rounded w-1/4 mt-2" />
                    </div>
                  </div>
                  <div className="mt-4 h-16 bg-gray-200 rounded" />
                </Card>
              ))}
            </div>
          ) : receivedReviews?.length > 0 ? (
            receivedReviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              Você ainda não recebeu nenhuma avaliação
            </div>
          )}
        </div>
      )
    },
    {
      label: 'Avaliações Realizadas',
      content: (
        <div className="space-y-4">
          {loadingGiven ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                      <div className="h-3 bg-gray-200 rounded w-1/4 mt-2" />
                    </div>
                  </div>
                  <div className="mt-4 h-16 bg-gray-200 rounded" />
                </Card>
              ))}
            </div>
          ) : givenReviews?.length > 0 ? (
            givenReviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              Você ainda não realizou nenhuma avaliação
            </div>
          )}
        </div>
      )
    }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Avaliações</h2>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default ReviewsList;