import React, { useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import { Search, MapPin, Filter } from 'lucide-react';
import { Button, Input, Card, Badge } from '../components/ui/Button';
import SearchFilters from '../components/Search/SearchFilters';
import ExchangeProposalModal from '../components/Exchange/ExchangeProposalModal';
import api from '../services/api';

const Home = () => {
  const [searchParams, setSearchParams] = useState({
    query: '',
    category: '',
    level: '',
    minRating: 0,
    available: false,
    page: 1
  });

  const [showFilters, setShowFilters] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);

  // Buscar skills
  const { data, isLoading } = useQuery(['skills', searchParams], async () => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    const response = await api.get(`/search/skills?${params.toString()}`);
    return response.data;
  }, {
    keepPreviousData: true
  });

  // Buscar skills do usuário para troca
  const { data: userSkills } = useQuery('userSkills', async () => {
    const response = await api.get('/users/skills');
    return response.data.data;
  });

  // Mutation para proposta de troca
  const proposalMutation = useMutation(async (proposalData) => {
    const response = await api.post('/exchanges/proposals', proposalData);
    return response.data;
  });

  const handleProposal = async (proposalData) => {
    try {
      await proposalMutation.mutateAsync({
        receiverId: selectedSkill.user._id,
        skillOffered: proposalData.skillOffered,
        skillRequested: selectedSkill._id,
        message: proposalData.message
      });

      setSelectedSkill(null);
      // Mostrar notificação de sucesso
    } catch (error) {
      // Mostrar notificação de erro
    }
  };

  const categories = [
    { id: 'dev', name: 'Desenvolvimento', color: 'bg-blue-100 text-blue-800' },
    { id: 'design', name: 'Design', color: 'bg-purple-100 text-purple-800' },
    { id: 'marketing', name: 'Marketing', color: 'bg-green-100 text-green-800' },
    { id: 'business', name: 'Negócios', color: 'bg-yellow-100 text-yellow-800' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Encontre e Compartilhe Habilidades
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Conecte-se com pessoas, troque conhecimentos e cresça junto
            </p>
          </div>

          {/* Search Bar */}
          <div className="mt-10 max-w-xl mx-auto">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  value={searchParams.query}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, query: e.target.value }))}
                  placeholder="Buscar habilidades..."
                  className="pl-10"
                />
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              </div>
              <Button
                variant="primary"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Grid Layout com Sidebar de Filtros */}
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Sidebar de Filtros (Desktop) */}
          <div className="hidden lg:block">
            <SearchFilters
              filters={searchParams}
              onChange={setSearchParams}
            />
          </div>

          {/* Lista de Skills */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                [...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-32 bg-gray-200 rounded-t-lg" />
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                  </Card>
                ))
              ) : data?.data.skills.map(skill => (
                <Card key={skill._id} className="overflow-hidden">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <Badge variant="primary">{skill.category}</Badge>
                      <Badge 
                        variant={skill.available ? 'success' : 'danger'}
                      >
                        {skill.available ? 'Disponível' : 'Indisponível'}
                      </Badge>
                    </div>

                    <h3 className="text-lg font-semibold mb-2">{skill.name}</h3>
                    <p className="text-gray-600 mb-4">{skill.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          {skill.user.avatar ? (
                            <img
                              src={skill.user.avatar}
                              alt={skill.user.name}
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <span className="text-sm font-medium">
                              {skill.user.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{skill.user.name}</p>
                          <p className="text-xs text-gray-500 flex items-center">
                            <MapPin size={12} className="mr-1" />
                            {skill.user.location}
                          </p>
                        </div>
                      </div>

                      <Button 
                        variant="primary"
                        size="sm"
                        disabled={!skill.available}
                        onClick={() => setSelectedSkill(skill)}
                      >
                        Propor Troca
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Filtros (Mobile) */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowFilters(false)} />
          <div className="absolute inset-x-0 bottom-0 transform">
            <SearchFilters
              filters={searchParams}
              onChange={setSearchParams}
              onClose={() => setShowFilters(false)}
            />
          </div>
        </div>
      )}

      {/* Modal de Proposta */}
      {selectedSkill && (
        <ExchangeProposalModal
          skill={selectedSkill}
          userSkills={userSkills || []}
          onClose={() => setSelectedSkill(null)}
          onSubmit={handleProposal}
        />
      )}
    </div>
  );
};

export default Home;