// src/pages/Trocas.js
import { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Avatar,
  Button,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ProposalCard = ({ proposal, onAccept, onDecline }) => {
  const { user } = useAuth();
  const isReceived = proposal.receiver._id === user?.id;

  return (
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      bg="white"
      boxShadow="sm"
    >
      <HStack spacing={4} mb={4}>
        <Avatar
          size="md"
          name={isReceived ? proposal.sender.name : proposal.receiver.name}
          src={isReceived ? proposal.sender.avatar : proposal.receiver.avatar}
        />
        <Box flex={1}>
          <Text fontWeight="bold">
            {isReceived ? proposal.sender.name : proposal.receiver.name}
          </Text>
          <Badge colorScheme={proposal.status === 'pending' ? 'yellow' : 'green'}>
            {proposal.status === 'pending' ? 'Pendente' : 'Aceita'}
          </Badge>
        </Box>
      </HStack>

      <VStack align="stretch" spacing={3}>
        <Box>
          <Text fontWeight="bold">Habilidade Solicitada:</Text>
          <Text>{proposal.skillRequested.name}</Text>
          <Text fontSize="sm" color="gray.600">
            {proposal.skillRequested.description}
          </Text>
        </Box>

        {proposal.skillOffered && (
          <Box>
            <Text fontWeight="bold">Habilidade Oferecida:</Text>
            <Text>{proposal.skillOffered.name}</Text>
            <Text fontSize="sm" color="gray.600">
              {proposal.skillOffered.description}
            </Text>
          </Box>
        )}

        {isReceived && proposal.status === 'pending' && (
          <HStack spacing={4} mt={2}>
            <Button
              colorScheme="red"
              variant="outline"
              onClick={() => onDecline(proposal._id)}
            >
              Recusar
            </Button>
            <Button
              colorScheme="green"
              onClick={() => onAccept(proposal._id)}
            >
              Aceitar
            </Button>
          </HStack>
        )}
      </VStack>
    </Box>
  );
};

const Trocas = () => {
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const { user } = useAuth();

  const loadProposals = useCallback(async () => {
    try {
      const response = await api.get('/exchanges/proposals');
      setProposals(response.data.data);
    } catch (error) {
      toast({
        title: 'Erro ao carregar propostas',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadProposals();
  }, [loadProposals]);

  const handleAccept = async (proposalId) => {
    try {
      await api.put(`/exchanges/proposals/${proposalId}/accept`);
      loadProposals();
      toast({
        title: 'Proposta aceita com sucesso',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Erro ao aceitar proposta',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleDecline = async (proposalId) => {
    try {
      await api.put(`/exchanges/proposals/${proposalId}/decline`);
      loadProposals();
      toast({
        title: 'Proposta recusada',
        status: 'info',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Erro ao recusar proposta',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Container maxW="container.lg" py={8}>
      <Tabs>
        <TabList>
          <Tab>Propostas Enviadas</Tab>
          <Tab>Propostas Recebidas</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <VStack spacing={4} align="stretch">
              {isLoading ? (
                <Spinner />
              ) : proposals.filter(p => p.sender._id === user?.id).length > 0 ? (
                proposals
                  .filter(p => p.sender._id === user?.id)
                  .map(proposal => (
                    <ProposalCard
                      key={proposal._id}
                      proposal={proposal}
                    />
                  ))
              ) : (
                <Text textAlign="center" color="gray.500">
                  Você não enviou nenhuma proposta ainda
                </Text>
              )}
            </VStack>
          </TabPanel>

          <TabPanel>
            <VStack spacing={4} align="stretch">
              {isLoading ? (
                <Spinner />
              ) : proposals.filter(p => p.receiver._id === user?.id).length > 0 ? (
                proposals
                  .filter(p => p.receiver._id === user?.id)
                  .map(proposal => (
                    <ProposalCard
                      key={proposal._id}
                      proposal={proposal}
                      onAccept={handleAccept}
                      onDecline={handleDecline}
                    />
                  ))
              ) : (
                <Text textAlign="center" color="gray.500">
                  Você não recebeu nenhuma proposta ainda
                </Text>
              )}
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default Trocas;