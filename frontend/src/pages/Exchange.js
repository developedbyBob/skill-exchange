import React from 'react';
import { Card, Tabs } from '../components/ui';
import ProposalCard from '../components/Exchange/ProposalCard';
import ActiveExchanges from '../components/Exchange/ActiveExchanges';
import CompletedExchanges from '../components/Exchange/CompletedExchanges';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../services/api';

const ExchangeProposals = () => {
  const queryClient = useQueryClient();

  const { data: proposals, isLoading } = useQuery(
    'exchangeProposals',
    async () => {
      const response = await api.get('/exchanges/proposals');
      return response.data.data;
    }
  );

  const acceptMutation = useMutation(
    async (proposalId) => {
      await api.put(`/exchanges/proposals/${proposalId}/accept`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('exchangeProposals');
        queryClient.invalidateQueries('activeExchanges');
      }
    }
  );

  const declineMutation = useMutation(
    async (proposalId) => {
      await api.put(`/exchanges/proposals/${proposalId}/decline`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('exchangeProposals');
      }
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
                <div className="h-12 bg-gray-200 rounded" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!proposals?.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhuma proposta pendente
        </h3>
        <p className="text-gray-500">
          Novas propostas de troca aparecerão aqui
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {proposals.map((proposal) => (
        <ProposalCard
          key={proposal._id}
          proposal={proposal}
          onAccept={() => acceptMutation.mutate(proposal._id)}
          onDecline={() => declineMutation.mutate(proposal._id)}
        />
      ))}
    </div>
  );
};

const Exchange = () => {
  const tabs = [
    {
      label: 'Propostas',
      content: <ExchangeProposals />
    },
    {
      label: 'Trocas Ativas',
      content: <ActiveExchanges />
    },
    {
      label: 'Trocas Concluídas',
      content: <CompletedExchanges />
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Card>
        <Tabs tabs={tabs} />
      </Card>
    </div>
  );
};

export default Exchange;