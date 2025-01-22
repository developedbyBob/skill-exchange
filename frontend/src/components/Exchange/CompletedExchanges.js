// src/components/Exchange/CompletedExchanges.js
import {
    VStack,
    Box,
    Text,
    HStack,
    Avatar,
    Badge,
    Flex,
    Icon,
    Grid,
    Divider,
  } from '@chakra-ui/react';
  import { StarIcon } from '@chakra-ui/icons';
  import { useQuery } from 'react-query';
  import api from '../../services/api';
  
  const ExchangeCard = ({ exchange }) => {
    return (
      <Box
        p={5}
        borderWidth="1px"
        borderRadius="lg"
        bg="white"
        boxShadow="sm"
      >
        <Flex justify="space-between" align="start" mb={4}>
          <HStack spacing={4}>
            <Avatar
              size="md"
              name={exchange.partner.name}
              src={exchange.partner.avatar}
            />
            <Box>
              <Text fontWeight="bold">{exchange.partner.name}</Text>
              <Text fontSize="sm" color="gray.500">
                Concluído em {new Date(exchange.completedDate).toLocaleDateString()}
              </Text>
            </Box>
          </HStack>
          <Badge colorScheme="purple">Concluído</Badge>
        </Flex>
  
        <Grid templateColumns="1fr auto 1fr" gap={4} mb={4}>
          <Box>
            <Text fontWeight="bold">Habilidade Oferecida</Text>
            <Text color="gray.600">{exchange.offeredSkill.name}</Text>
          </Box>
          <Icon as={StarIcon} color="blue.500" w={6} h={6} />
          <Box>
            <Text fontWeight="bold">Habilidade Recebida</Text>
            <Text color="gray.600">{exchange.requestedSkill.name}</Text>
          </Box>
        </Grid>
  
        <Divider my={4} />
  
        <Box>
          <Text fontWeight="bold" mb={2}>Avaliações</Text>
          
          {/* Avaliação Recebida */}
          <Box bg="gray.50" p={3} borderRadius="md" mb={3}>
            <Flex justify="space-between" align="center" mb={2}>
              <Text fontSize="sm" fontWeight="medium">Avaliação Recebida</Text>
              <HStack spacing={1}>
                {[...Array(5)].map((_, i) => (
                  <Icon
                    key={i}
                    as={StarIcon}
                    color={i < exchange.receivedReview?.rating ? "yellow.400" : "gray.300"}
                    w={4}
                    h={4}
                  />
                ))}
              </HStack>
            </Flex>
            <Text fontSize="sm" color="gray.600">
              {exchange.receivedReview?.comment || "Sem comentários"}
            </Text>
          </Box>
  
          {/* Avaliação Dada */}
          <Box bg="gray.50" p={3} borderRadius="md">
            <Flex justify="space-between" align="center" mb={2}>
              <Text fontSize="sm" fontWeight="medium">Sua Avaliação</Text>
              <HStack spacing={1}>
                {[...Array(5)].map((_, i) => (
                  <Icon
                    key={i}
                    as={StarIcon}
                    color={i < exchange.givenReview?.rating ? "yellow.400" : "gray.300"}
                    w={4}
                    h={4}
                  />
                ))}
              </HStack>
            </Flex>
            <Text fontSize="sm" color="gray.600">
              {exchange.givenReview?.comment || "Sem comentários"}
            </Text>
          </Box>
        </Box>
      </Box>
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
  
    return (
      <VStack spacing={4} align="stretch" p={4}>
        {isLoading ? (
          <Text>Carregando trocas concluídas...</Text>
        ) : exchanges?.length > 0 ? (
          exchanges.map((exchange) => (
            <ExchangeCard key={exchange._id} exchange={exchange} />
          ))
        ) : (
          <Text textAlign="center" color="gray.500">
            Nenhuma troca concluída ainda
          </Text>
        )}
      </VStack>
    );
  };
  
  export default CompletedExchanges;