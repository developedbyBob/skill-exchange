// src/components/Skill/SkillCard.js
import { useState, useEffect } from 'react';
import {
  Box,
  Badge,
  Text,
  Stack,
  Avatar,
  HStack,
  Button,
  useToast,
  useColorModeValue,
  Tooltip,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const SkillCard = ({ skill }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user, loading } = useAuth();
  const bgColor = useColorModeValue('white', 'gray.700');
  const [hasProposal, setHasProposal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Verificar se já existe uma proposta
  useEffect(() => {
    if (!skill) return; // Evita erros caso skill seja undefined
    const checkExistingProposal = async () => {
      try {
        const response = await api.get('/exchanges/proposals');
        const existingProposal = response.data.data.find(
          proposal => proposal.skillRequested._id === skill._id && 
                     proposal.status === 'pending'
        );
        setHasProposal(!!existingProposal);
      } catch (error) {
        console.error('Erro ao verificar propostas existentes:', error);
      }
    };

    checkExistingProposal();
  }, [skill]);

  // Verificar se o card pertence ao próprio usuário
  const isOwnSkill = user?.id === skill?.user?._id;

  // Retornos condicionais após os hooks
  if (loading || !skill || isOwnSkill) {
    return null;
  }

  const handleProposeTrade = async () => {
    if (hasProposal) {
      toast({
        title: 'Proposta já enviada',
        description: 'Já existe uma proposta pendente para esta skill',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const proposalData = {
        receiverId: skill.user._id,
        skillOffered: null,
        skillRequested: skill._id,
      };

      const response = await api.post('/exchanges/proposals', proposalData);

      if (response.data.data.chat) {
        navigate('/chat', { 
          state: { 
            chatId: response.data.data.chat._id,
            skillId: skill._id,
          },
        });
        
        toast({
          title: 'Proposta enviada',
          description: 'Uma conversa foi iniciada com o usuário',
          status: 'success',
          duration: 3000,
        });
        setHasProposal(true);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Ocorreu um erro ao propor a troca';
      
      toast({
        title: 'Erro ao propor troca',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg={bgColor}
      boxShadow="sm"
      _hover={{ boxShadow: 'md' }}
      transition="all 0.2s"
    >
      <Box p={6}>
        <Stack spacing={3}>
          <HStack justify="space-between" align="start">
            <Badge colorScheme="blue" borderRadius="full" px={2}>
              {skill.category}
            </Badge>
            <Badge 
              colorScheme={skill.available ? 'green' : 'red'}
              borderRadius="full" 
              px={2}
            >
              {skill.available ? 'Disponível' : 'Indisponível'}
            </Badge>
          </HStack>

          <Text fontSize="xl" fontWeight="semibold">
            {skill.name}
          </Text>

          <Text color="gray.600" noOfLines={3}>
            {skill.description}
          </Text>

          <HStack spacing={4} mt={2}>
            <Avatar 
              size="sm" 
              name={skill.user.name} 
              src={skill.user.avatar}
            />
            <Box>
              <Text fontWeight="medium">{skill.user.name}</Text>
              <Text fontSize="sm" color="gray.500">
                {skill.user.location}
              </Text>
            </Box>
          </HStack>

          {skill.available && !isOwnSkill && (
            <Button
              colorScheme="blue"
              width="full"
              mt={2}
              onClick={handleProposeTrade}
              isLoading={isLoading}
              isDisabled={hasProposal}
            >
              {hasProposal ? 'Proposta Enviada' : 'Propor Troca'}
            </Button>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default SkillCard;


