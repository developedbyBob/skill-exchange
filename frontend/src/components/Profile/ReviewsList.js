// src/components/Profile/ReviewsList.js
import { useEffect } from 'react';
import {
  VStack,
  Box,
  Text,
  Flex,
  Avatar,
  Badge,
  Divider,
  Stack,
  Icon,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  HStack,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { useQuery } from 'react-query';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const ReviewCard = ({ review }) => {
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
            name={review.reviewer.name}
            src={review.reviewer.avatar}
          />
          <Box>
            <Text fontWeight="bold">{review.reviewer.name}</Text>
            <Text fontSize="sm" color="gray.500">
              {new Date(review.createdAt).toLocaleDateString()}
            </Text>
          </Box>
        </HStack>
        <HStack>
          {[...Array(5)].map((_, i) => (
            <Icon
              key={i}
              as={StarIcon}
              color={i < review.rating ? "yellow.400" : "gray.300"}
            />
          ))}
        </HStack>
      </Flex>

      <Divider my={4} />

      <Stack spacing={3}>
        <Box>
          <Badge colorScheme="blue" mb={2}>
            Habilidade: {review.skill.name}
          </Badge>
          <Text>{review.comment}</Text>
        </Box>
      </Stack>
    </Box>
  );
};

const ReviewsList = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      console.error('Usuário não autenticado');
    }
  }, [user]);

  // Buscar avaliações recebidas
  const { data: receivedReviews, isLoading: loadingReceived } = useQuery(
    ['reviews', 'received'],
    async () => {
      if (!user?.id) {
        throw new Error('ID do usuário não encontrado');
      }
      const response = await api.get(`/reviews/user/${user.id}`);
      return response.data.data;
    },
    {
      enabled: !!user?.id,
    }
  );

  // Buscar avaliações feitas
  const { data: givenReviews, isLoading: loadingGiven } = useQuery(
    ['reviews', 'given'],
    async () => {
      if (!user?.id) {
        throw new Error('ID do usuário não encontrado');
      }
      const response = await api.get(`/reviews/by-user/${user.id}`);
      return response.data.data;
    },
    {
      enabled: !!user?.id,
    }
  );

  return (
    <Box p={4}>
      <Tabs variant="enclosed">
        <TabList>
          <Tab>Avaliações Recebidas</Tab>
          <Tab>Avaliações Realizadas</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <VStack spacing={4} align="stretch">
              {loadingReceived ? (
                <Text>Carregando avaliações...</Text>
              ) : receivedReviews?.length > 0 ? (
                receivedReviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))
              ) : (
                <Text textAlign="center" color="gray.500">
                  Nenhuma avaliação recebida ainda
                </Text>
              )}
            </VStack>
          </TabPanel>

          <TabPanel>
            <VStack spacing={4} align="stretch">
              {loadingGiven ? (
                <Text>Carregando avaliações...</Text>
              ) : givenReviews?.length > 0 ? (
                givenReviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))
              ) : (
                <Text textAlign="center" color="gray.500">
                  Você ainda não realizou nenhuma avaliação
                </Text>
              )}
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ReviewsList;