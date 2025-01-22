// src/components/Chat/ChatList.js
import {
  VStack,
  Box,
  Text,
  Avatar,
  HStack,
  Badge,
  Input,
  InputGroup,
  InputLeftElement,
  IconButton,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  Icon,
} from '@chakra-ui/react';
import { SearchIcon, DeleteIcon } from '@chakra-ui/icons';
import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Se for hoje, mostra apenas a hora
  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }
  
  // Se for ontem, mostra "Ontem"
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Ontem';
  }
  
  // Para outras datas, mostra dd/mm/yyyy
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Ícone customizado de três pontos verticais
const ThreeDotsIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
    />
  </Icon>
);

const DeleteChatAlert = ({ isOpen, onClose, onConfirm }) => {
  const cancelRef = useRef();

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Apagar Chat
          </AlertDialogHeader>

          <AlertDialogBody>
            Tem certeza que deseja apagar este chat? Esta ação não pode ser desfeita.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="red" onClick={onConfirm} ml={3}>
              Apagar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

const ChatPreview = ({ chat, isSelected, onClick, onDelete, currentUserId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const otherUser = chat.participants.find(p => p._id !== currentUserId);
  
  if (!otherUser) return null;

  const handleDelete = async () => {
    await onDelete(chat._id);
    onClose();
  };

  return (
    <Box
      p={4}
      bg={isSelected ? 'blue.50' : 'white'}
      _hover={{ bg: isSelected ? 'blue.50' : 'gray.50' }}
      cursor="pointer"
      borderRadius="md"
      position="relative"
    >
      <HStack spacing={3} onClick={onClick}>
        <Avatar 
          size="md" 
          name={otherUser.name}
          src={otherUser.avatar}
          bg="pink.200"
        />
        <Box flex={1}>
          <Text fontWeight="bold">
            {otherUser.name}
          </Text>
          <Text 
            fontSize="sm" 
            color="gray.500"
          >
            {formatDate(chat.updatedAt || chat.lastMessage || chat.createdAt)}
          </Text>
        </Box>
        
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<ThreeDotsIcon />}
            variant="ghost"
            size="sm"
            onClick={(e) => e.stopPropagation()}
          />
          <MenuList onClick={(e) => e.stopPropagation()}>
            <MenuItem
              icon={<DeleteIcon />}
              color="red.500"
              onClick={onOpen}
            >
              Apagar Chat
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>

      <DeleteChatAlert
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleDelete}
      />
    </Box>
  );
};

const ChatList = ({ chats = [], selectedChat, onSelectChat, onDeleteChat }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const toast = useToast();

  const handleDeleteChat = async (chatId) => {
    console.log(`Tentando deletar o chat com ID: ${chatId}`);
    try {
      await onDeleteChat(chatId);
    } catch (error) {
      console.error('Erro ao remover chat:', error.response || error.message);
      toast({
        title: 'Erro ao remover chat',
        description: error.response?.data?.error || 'Ocorreu um erro ao remover o chat',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const filteredChats = chats.filter(chat => {
    const otherUser = chat.participants?.find(p => p._id !== user?.id);
    if (!otherUser) return false;
    return otherUser.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg="white"
      height="100%"
    >
      <Box p={4} borderBottomWidth="1px">
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Buscar conversas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>
      </Box>

      <VStack
        spacing={0}
        align="stretch"
        overflowY="auto"
        height="calc(100% - 80px)"
        divider={<Box borderBottomWidth="1px" borderColor="gray.100" />}
      >
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <ChatPreview
              key={chat._id}
              chat={chat}
              isSelected={selectedChat?._id === chat._id}
              onClick={() => onSelectChat(chat)}
              onDelete={handleDeleteChat}
              currentUserId={user?.id}
            />
          ))
        ) : (
          <Box p={4}>
            <Text color="gray.500" textAlign="center">
              {searchQuery
                ? 'Nenhuma conversa encontrada'
                : 'Nenhuma conversa iniciada'}
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default ChatList;