import { useRef, useEffect, useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  Input,
  IconButton,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import { SendIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Message = ({ message, isOwnMessage }) => {
  const bgColor = useColorModeValue(
    isOwnMessage ? 'blue.500' : 'gray.100',
    isOwnMessage ? 'blue.400' : 'gray.700'
  );
  const textColor = isOwnMessage ? 'white' : 'gray.800';

  // Verificar se a data é válida
  const messageDate = message.createdAt ? new Date(message.createdAt) : new Date();
  const timeString = isNaN(messageDate) ? '' : messageDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Flex justify={isOwnMessage ? 'flex-end' : 'flex-start'} w="100%">
      <Box
        maxW="70%"
        bg={bgColor}
        color={textColor}
        px={4}
        py={2}
        borderRadius="lg"
        position="relative"
      >
        <Text>{message.content}</Text>
        <Text
          fontSize="xs"
          color={isOwnMessage ? 'whiteAlpha.700' : 'gray.500'}
          textAlign="right"
          mt={1}
        >
          {timeString}
        </Text>
      </Box>
    </Flex>
  );
};

const ChatHeader = ({ participant }) => {
  return (
    <HStack
      p={4}
      borderBottomWidth="1px"
      bg="white"
      spacing={4}
      position="sticky"
      top={0}
      zIndex={1}
    >
      <Avatar size="sm" name={participant?.name} src={participant?.avatar} />
      <Box>
        <Text fontWeight="bold">{participant?.name}</Text>
        {participant?.isOnline && (
          <Text fontSize="sm" color="green.500">
            Online
          </Text>
        )}
      </Box>
    </HStack>
  );
};

const ChatWindow = ({ chat, messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !chat) return;

    await onSendMessage(newMessage);
    setNewMessage('');
  };

  if (!chat) {
    return (
      <Flex
        height="100%"
        align="center"
        justify="center"
        bg="white"
        borderWidth="1px"
        borderRadius="lg"
      >
        <Text color="gray.500">
          Selecione uma conversa para começar
        </Text>
      </Flex>
    );
  }

  const participant = chat.participants.find(p => p._id !== user.id);

  return (
    <Box
      height="100%"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg="gray.50"
      display="flex"
      flexDirection="column"
    >
      <ChatHeader participant={participant} />

      <VStack
        flex={1}
        spacing={4}
        p={4}
        overflowY="auto"
        css={{
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#cbd5e0',
            borderRadius: '24px',
          },
        }}
      >
        {messages.map((message, index) => (
          <Message
            key={message._id || index}
            message={message}
            isOwnMessage={message.sender._id === user.id || message.sender === user.id}
          />
        ))}
        <div ref={messagesEndRef} />
      </VStack>

      <Box p={4} bg="white" as="form" onSubmit={handleSendMessage}>
        <HStack spacing={2}>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            size="md"
          />
          <IconButton
            type="submit"
            colorScheme="blue"
            aria-label="Enviar mensagem"
            icon={<SendIcon size={20} />}
            isDisabled={!newMessage.trim()}
          />
        </HStack>
      </Box>
    </Box>
  );
};

export default ChatWindow;