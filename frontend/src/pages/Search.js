import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Search as SearchIcon, Filter } from 'lucide-react';
import { Button, Input } from '../components/ui';
import SearchFilters from '../components/Search/SearchFilters';
import SkillCard from '../components/Search/SkillCard';
import ExchangeProposalModal from '../components/Exchange/ExchangeProposalModal';
import api from '../services/api';

const Search = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [searchParams, setSearchParams] = useState({
    query: '',
    category: '',
    level: '',
    minRating: 0,
    available: false,
    exchangeable: false,
    relatedSkills: '',
    page: 1
  });

  // Fetch skills
  const { data, isLoading } = useQuery(
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
      keepPreviousData: true
    }
  );

  // Fetch user skills (for exchange proposals)
  const { data: userSkills } = useQuery('userSkills', async () => {
    const response = await api.get('/users/skills');
    return response.data.data;
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams(prev => ({ ...prev, page: 1 }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          Encontre Habilidades para Trocar
        </h1>
        
        <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <Input
                type="search"
                placeholder="Buscar habilidades..."
                value={searchParams.query}
                onChange={(e) => setSearchParams(prev => ({ 
                  ...prev, 
                  query: e.target.value 
                }))}
                className="pl-10"
              />
              <SearchIcon
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={20} className="mr-2" />
              Filtros
            </Button>
          </div>
        </form>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters (Desktop) */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <div className="sticky top-8">
            <SearchFilters
              filters={searchParams}
              onChange={setSearchParams}
              onClose={() => setShowFilters(false)}
            />
          </div>
        </div>

        {/* Skills Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white rounded-lg p-6 h-[400px]">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded" />
                      <div className="h-4 bg-gray-200 rounded" />
                      <div className="h-4 bg-gray-200 rounded w-5/6" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : !data?.data.skills.length ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma habilidade encontrada
              </h3>
              <p className="text-gray-500">
                Tente ajustar seus filtros ou fazer uma nova busca
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.data.skills.map((skill) => (
                  <SkillCard
                    key={skill._id}
                    skill={skill}
                    onProposeTrade={setSelectedSkill}
                  />
                ))}
              </div>

              {data.data.pagination.page < data.data.pagination.totalPages && (
                <div className="mt-8 text-center">
                  <Button
                    variant="outline"
                    onClick={() => setSearchParams(prev => ({
                      ...prev,
                      page: prev.page + 1
                    }))}
                  >
                    Carregar Mais
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Filters */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute inset-x-0 bottom-0 transform">
            <div className="bg-white rounded-t-xl p-4">
              <SearchFilters
                filters={searchParams}
                onChange={setSearchParams}
                onClose={() => setShowFilters(false)}
              />
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowFilters(false)}
                className="mt-4"
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Exchange Proposal Modal */}
      {selectedSkill && (
        <ExchangeProposalModal
          skill={selectedSkill}
          userSkills={userSkills || []}
          onClose={() => setSelectedSkill(null)}
          onSubmit={(proposalData) => {
            // Handle proposal submission
            console.log(proposalData);
            setSelectedSkill(null);
          }}
        />
      )}
    </div>
  );
};

export default Search;