// src/components/Exchange/ExchangeProposals.js
import { useState } from 'react';
import {
  VStack,
  HStack,
  Box,
  Text,
  Button,
  useToast,
  Avatar,
  Badge,
  Flex,
  Divider,
  Icon,
  Grid,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { CheckIcon, CloseIcon, TimeIcon } from '@chakra-ui/icons';
import api from '../../services/api';

const ProposalCard = ({ proposal, onAccept, onDecline }) => {
  const isReceived = proposal.receiverId === proposal.currentUserId;

  return (
    <Box
      p={5}
      borderWidth="1px"
      borderRadius="lg"
      bg="white"
      boxShadow="sm"
      _hover={{ boxShadow: 'md' }}
      transition="all 0.2s"
    >
      <Flex justify="space-between" align="start">
        <HStack spacing={4}>
          <Avatar
            size="md"
            name={isReceived ? proposal.sender.name : proposal.receiver.name}
            src={isReceived ? proposal.sender.avatar : proposal.receiver.avatar}
          />
          <Box>
            <Text fontWeight="bold">
              {isReceived ? proposal.sender.name : proposal.receiver.name}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {new Date(proposal.createdAt).toLocaleDateString()}
            </Text>
          </Box>
        </HStack>
        <Badge colorScheme={proposal.status === 'pending' ? 'yellow' : 'green'}>
          {proposal.status === 'pending' ? 'Pendente' : 'Aceita'}
        </Badge>
      </Flex>

      <Divider my={4} />

      <Grid templateColumns="1fr auto 1fr" gap={4} alignItems="center">
        <Box>
          <Text fontWeight="bold">{proposal.offeredSkill.name}</Text>
          <Text fontSize="sm" color="gray.600">
            {proposal.offeredSkill.description}
          </Text>
        </Box>
        <Icon as={TimeIcon} color="gray.400" />
        <Box>
          <Text fontWeight="bold">{proposal.requestedSkill.name}</Text>
          <Text fontSize="sm" color="gray.600">
            {proposal.requestedSkill.description}
          </Text>
        </Box>
      </Grid>

      {proposal.status === 'pending' && isReceived && (
        <HStack mt={4} spacing={4} justify="flex-end">
          <Button
            leftIcon={<CloseIcon />}
            colorScheme="red"
            variant="outline"
            size="sm"
            onClick={() => onDecline(proposal._id)}
          >
            Recusar
          </Button>
          <Button
            leftIcon={<CheckIcon />}
            colorScheme="green"
            size="sm"
            onClick={() => onAccept(proposal._id)}
          >
            Aceitar
          </Button>
        </HStack>
      )}
    </Box>
  );
};

const ExchangeProposals = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  // Buscar propostas
  const { data: proposals, isLoading } = useQuery(
    'exchangeProposals',
    async () => {
      const response = await api.get('/exchanges/proposals');
      return response.data.data;
    }
  );

  // Aceitar proposta
  const acceptMutation = useMutation(
    async (proposalId) => {
      const response = await api.put(`/exchanges/proposals/${proposalId}/accept`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('exchangeProposals');
        toast({
          title: 'Proposta aceita com sucesso',
          status: 'success',
          duration: 3000,
        });
      },
      onError: (error) => {
        toast({
          title: 'Erro ao aceitar proposta',
          description: error.message,
          status: 'error',
          duration: 3000,
        });
      },
    }
  );

  // Recusar proposta
  const declineMutation = useMutation(
    async (proposalId) => {
      const response = await api.put(`/exchanges/proposals/${proposalId}/decline`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('exchangeProposals');
        toast({
          title: 'Proposta recusada',
          status: 'info',
          duration: 3000,
        });
      },
      onError: (error) => {
        toast({
          title: 'Erro ao recusar proposta',
          description: error.message,
          status: 'error',
          duration: 3000,
        });
      },
    }
  );

  return (
    <VStack spacing={4} align="stretch" p={4}>
      {isLoading ? (
        <Text>Carregando propostas...</Text>
      ) : proposals?.length > 0 ? (
        proposals.map((proposal) => (
          <ProposalCard
            key={proposal._id}
            proposal={proposal}
            onAccept={acceptMutation.mutate}
            onDecline={declineMutation.mutate}
          />
        ))
      ) : (
        <Text textAlign="center" color="gray.500">
          Nenhuma proposta de troca pendente
        </Text>
      )}
    </VStack>
  );
};

export default ExchangeProposals;