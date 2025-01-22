// src/components/Exchange/ActiveExchanges.js
import { useState } from 'react';
import {
  VStack,
  Box,
  Text,
  Button,
  HStack,
  Avatar,
  Badge,
  Progress,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ChatIcon, StarIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const ExchangeCard = ({ exchange }) => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [review, setReview] = useState({
    rating: 5,
    comment: '',
  });

  const completeMutation = useMutation(
    async ({ exchangeId, reviewData }) => {
      const response = await api.post(`/exchanges/${exchangeId}/complete`, reviewData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('activeExchanges');
        toast({
          title: 'Troca concluída com sucesso',
          status: 'success',
          duration: 3000,
        });
        onClose();
      },
      onError: (error) => {
        toast({
          title: 'Erro ao concluir troca',
          description: error.message,
          status: 'error',
          duration: 3000,
        });
      },
    }
  );

  const handleComplete = () => {
    completeMutation.mutate({
      exchangeId: exchange._id,
      reviewData: review,
    });
  };

  const handleChat = () => {
    navigate(`/chat`, { state: { exchangeId: exchange._id } });
  };

  return (
    <Box
      p={5}
      borderWidth="1px"
      borderRadius="lg"
      bg="white"
      boxShadow="sm"
    >
      <HStack spacing={4} mb={4}>
        <Avatar
          size="md"
          name={exchange.partner.name}
          src={exchange.partner.avatar}
        />
        <Box flex={1}>
          <Text fontWeight="bold">{exchange.partner.name}</Text>
          <Text fontSize="sm" color="gray.500">
            Iniciado em {new Date(exchange.startDate).toLocaleDateString()}
          </Text>
        </Box>
        <Badge colorScheme="green">Em Andamento</Badge>
      </HStack>

      <Box mb={4}>
        <Text fontWeight="bold">Progresso da Troca</Text>
        <Progress value={exchange.progress} colorScheme="blue" mt={2} />
      </Box>

      <HStack spacing={4} justify="flex-end">
        <Button
          leftIcon={<ChatIcon />}
          colorScheme="blue"
          variant="outline"
          onClick={handleChat}
        >
          Chat
        </Button>
        <Button
          leftIcon={<StarIcon />}
          colorScheme="green"
          onClick={onOpen}
        >
          Concluir Troca
        </Button>
      </HStack>

      {/* Modal de Conclusão e Avaliação */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Concluir Troca e Avaliar</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Avaliação</FormLabel>
                <NumberInput
                  max={5}
                  min={1}
                  value={review.rating}
                  onChange={(value) => setReview(prev => ({ ...prev, rating: Number(value) }))}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              <FormControl>
                <FormLabel>Comentário</FormLabel>
                <Textarea
                  value={review.comment}
                  onChange={(e) => setReview(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Como foi sua experiência?"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button
              colorScheme="green"
              onClick={handleComplete}
              isLoading={completeMutation.isLoading}
            >
              Concluir e Avaliar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
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

  return (
    <VStack spacing={4} align="stretch" p={4}>
      {isLoading ? (
        <Text>Carregando trocas ativas...</Text>
      ) : exchanges?.length > 0 ? (
        exchanges.map((exchange) => (
          <ExchangeCard key={exchange._id} exchange={exchange} />
        ))
      ) : (
        <Text textAlign="center" color="gray.500">
          Nenhuma troca ativa no momento
        </Text>
      )}
    </VStack>
  );
};

export default ActiveExchanges;