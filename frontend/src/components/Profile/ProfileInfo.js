// src/components/Profile/ProfileInfo.js
import { useState } from 'react';
import {
  VStack,
  // Remova as importações não utilizadas
  // FormControl,
  // FormLabel,
  Input,
  Button,
  // useToast,
  Avatar,
  Center,
  Text,
  HStack,
  IconButton,
  Textarea,
  Box
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const ProfileInfo = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Remova o uso de useToast
  // const toast = useToast();

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    location: user.location,
    bio: user.bio || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.put('/users/profile', formData);
      updateUser(response.data.data);
      setIsEditing(false);
      
      // Substitua o uso de toast por console.log ou outra alternativa
      console.log('Perfil atualizado');
      // toast({
      //   title: 'Perfil atualizado',
      //   status: 'success',
      //   duration: 3000,
      // });
    } catch (error) {
      // Substitua o uso de toast por console.log ou outra alternativa
      console.error('Erro ao atualizar perfil', error.message);
      // toast({
      //   title: 'Erro ao atualizar perfil',
      //   description: error.message,
      //   status: 'error',
      //   duration: 3000,
      // });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack spacing={8} align="stretch" p={4}>
      <Center>
        <VStack spacing={4}>
          <Avatar
            size="2xl"
            name={user.name}
            src={user.avatar}
            bg="blue.500"
          />
          <HStack>
            <Text fontSize="2xl" fontWeight="bold">
              {user.name}
            </Text>
            <IconButton
              icon={<EditIcon />}
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              aria-label="Editar perfil"
            />
          </HStack>
          <Text color="gray.500">{user.email}</Text>
        </VStack>
      </Center>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} width="100%" maxW="md" mx="auto">
            {/* Substitua FormControl e FormLabel por Box e Text */}
            <Box id="name">
              <Text>Nome</Text>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Box>

            <Box id="location">
              <Text>Localização</Text>
              <Input
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </Box>

            <Box id="bio">
              <Text>Biografia</Text>
              <Textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Conte um pouco sobre você..."
                rows={4}
              />
            </Box>

            <HStack spacing={4} width="100%">
              <Button
                type="button"
                onClick={() => setIsEditing(false)}
                variant="outline"
                width="50%"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                colorScheme="blue"
                width="50%"
                isLoading={isLoading}
              >
                Salvar
              </Button>
            </HStack>
          </VStack>
        </form>
      ) : (
        <VStack spacing={4} width="100%" maxW="md" mx="auto" align="start">
          <Box>
            <Text fontWeight="bold">Localização</Text>
            <Text>{formData.location}</Text>
          </Box>
          {formData.bio && (
            <Box>
              <Text fontWeight="bold">Biografia</Text>
              <Text>{formData.bio}</Text>
            </Box>
          )}
        </VStack>
      )}
    </VStack>
  );
};

export default ProfileInfo;