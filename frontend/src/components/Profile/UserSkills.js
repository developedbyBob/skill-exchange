// src/components/Profile/UserSkills.js
import { useState } from 'react';
import {
  VStack,
  Grid,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  useToast,
  Box,
} from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { AddIcon } from '@chakra-ui/icons';
import api from '../../services/api';
import SkillCard from '../Skill/SkillCard';

const UserSkills = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newSkill, setNewSkill] = useState({
    name: '',
    description: '',
    category: '',
    level: '',
    exchangePreferences: '',
  });
  const toast = useToast();
  const queryClient = useQueryClient();

  // Buscar skills do usuário
  const { data: skills, isLoading } = useQuery('userSkills', async () => {
    const response = await api.get('/users/skills');
    return response.data.data;
  });

  // Mutation para adicionar nova skill
  const addSkillMutation = useMutation(
    async (skillData) => {
      const response = await api.post('/skills', skillData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('userSkills');
        onClose();
        toast({
          title: 'Habilidade adicionada com sucesso',
          status: 'success',
          duration: 3000,
        });
        setNewSkill({
          name: '',
          description: '',
          category: '',
          level: '',
          exchangePreferences: '',
        });
      },
      onError: (error) => {
        toast({
          title: 'Erro ao adicionar habilidade',
          description: error.message,
          status: 'error',
          duration: 3000,
        });
      },
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSkill(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addSkillMutation.mutate(newSkill);
  };

  return (
    <Box p={4}>
      <Button
        leftIcon={<AddIcon />}
        colorScheme="blue"
        mb={6}
        onClick={onOpen}
      >
        Adicionar Nova Habilidade
      </Button>

      {/* Lista de Skills */}
      <Grid
        templateColumns={{
          base: '1fr',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)'
        }}
        gap={6}
      >
        {skills?.map((skill) => (
          <SkillCard
            key={skill._id}
            skill={skill}
            isOwner={true}
          />
        ))}
      </Grid>

      {/* Modal de Nova Skill */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader>Adicionar Nova Habilidade</ModalHeader>
            <ModalCloseButton />
            
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Nome da Habilidade</FormLabel>
                  <Input
                    name="name"
                    value={newSkill.name}
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Descrição</FormLabel>
                  <Textarea
                    name="description"
                    value={newSkill.description}
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    name="category"
                    value={newSkill.category}
                    onChange={handleChange}
                    placeholder="Selecione uma categoria"
                  >
                    <option value="Programação">Programação</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Idiomas">Idiomas</option>
                    <option value="Música">Música</option>
                    <option value="Outros">Outros</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Nível</FormLabel>
                  <Select
                    name="level"
                    value={newSkill.level}
                    onChange={handleChange}
                    placeholder="Selecione um nível"
                  >
                    <option value="Iniciante">Iniciante</option>
                    <option value="Intermediário">Intermediário</option>
                    <option value="Avançado">Avançado</option>
                    <option value="Especialista">Especialista</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Preferências de Troca</FormLabel>
                  <Input
                    name="exchangePreferences"
                    value={newSkill.exchangePreferences}
                    onChange={handleChange}
                    placeholder="Ex: Design UI/UX, Marketing Digital"
                  />
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancelar
              </Button>
              <Button
                type="submit"
                colorScheme="blue"
                isLoading={addSkillMutation.isLoading}
              >
                Adicionar
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default UserSkills;