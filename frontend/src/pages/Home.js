// src/pages/Home.js
import { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Text,
  VStack,
  HStack,
  Button,
  useToast,
  Spinner,
  Center
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import api from '../services/api';
import SearchBar from '../components/Search/SearchBar';
import SearchFilters from '../components/Search/SearchFilters';
import SkillCard from '../components/Skill/SkillCard';

const Home = () => {
  const toast = useToast();
  const [searchParams, setSearchParams] = useState({
    query: '',
    category: '',
    level: '',
    minRating: 0,
    available: false,
    page: 1
  });

  // Buscar skills usando react-query
  const { data, isLoading, error } = useQuery(
    ['skills', searchParams],
    async () => {
      const params = new URLSearchParams();
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await api.get(`/search/skills?${params.toString()}`);
      return response.data;
    },
    {
      keepPreviousData: true,
      onError: (err) => {
        toast({
          title: 'Erro ao buscar skills',
          description: err.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      },
    }
  );

  const handleSearch = (query) => {
    setSearchParams(prev => ({ ...prev, query, page: 1 }));
  };

  const handleFilterChange = (newFilters) => {
    setSearchParams(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const loadMore = () => {
    setSearchParams(prev => ({ ...prev, page: prev.page + 1 }));
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Área de Busca */}
        <Box bg="blue.50" p={8} borderRadius="lg">
          <VStack spacing={4}>
            <Text fontSize="2xl" fontWeight="bold" textAlign="center">
              Encontre e Compartilhe Habilidades
            </Text>
            <SearchBar onSearch={handleSearch} />
          </VStack>
        </Box>

        {/* Conteúdo Principal */}
        <HStack align="start" spacing={8}>
          {/* Filtros */}
          <Box w="250px" display={{ base: 'none', md: 'block' }}>
            <SearchFilters
              filters={searchParams}
              onFilterChange={handleFilterChange}
            />
          </Box>

          {/* Lista de Skills */}
          <VStack flex={1} align="stretch" spacing={6}>
            {isLoading ? (
              <Center py={8}>
                <Spinner size="xl" />
              </Center>
            ) : error ? (
              <Text color="red.500" textAlign="center">
                Erro ao carregar skills
              </Text>
            ) : (
              <>
                <Grid
                  templateColumns={{
                    base: '1fr',
                    md: 'repeat(2, 1fr)',
                    lg: 'repeat(3, 1fr)'
                  }}
                  gap={6}
                >
                  {data?.data.skills.map((skill) => (
                    <SkillCard key={skill._id} skill={skill} />
                  ))}
                </Grid>

                {data?.data.pagination.page < data?.data.pagination.totalPages && (
                  <Button
                    onClick={loadMore}
                    colorScheme="blue"
                    variant="outline"
                    width="200px"
                    alignSelf="center"
                  >
                    Carregar Mais
                  </Button>
                )}
              </>
            )}
          </VStack>
        </HStack>
      </VStack>
    </Container>
  );
};

export default Home;