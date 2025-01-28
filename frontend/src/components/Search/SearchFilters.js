import React from 'react';
import { Card, Select, Input } from '../ui/Button';
import { Star, Sliders } from 'lucide-react';

const SearchFilters = ({ filters, onChange }) => {
  const categories = [
    { value: 'development', label: 'Desenvolvimento' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'languages', label: 'Idiomas' },
    { value: 'music', label: 'Música' },
    { value: 'others', label: 'Outros' }
  ];

  const levels = [
    { value: 'beginner', label: 'Iniciante' },
    { value: 'intermediate', label: 'Intermediário' },
    { value: 'advanced', label: 'Avançado' },
    { value: 'expert', label: 'Expert' }
  ];

  const handleFilterChange = (field, value) => {
    onChange({ ...filters, [field]: value });
  };

  return (
    <Card>
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-2">
          <Sliders size={20} className="text-gray-400" />
          <h3 className="text-lg font-medium">Filtros</h3>
        </div>

        <div className="space-y-4">
          <Select
            label="Categoria"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            options={categories}
          />

          <Select
            label="Nível"
            value={filters.level}
            onChange={(e) => handleFilterChange('level', e.target.value)}
            options={levels}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Avaliação Mínima
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={filters.minRating}
                onChange={(e) => handleFilterChange('minRating', e.target.value)}
                className="flex-1"
              />
              <div className="flex items-center space-x-1 min-w-[60px]">
                <Star size={16} className="text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600">{filters.minRating}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.available}
                onChange={(e) => handleFilterChange('available', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Apenas disponíveis</span>
            </label>
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.exchangeable}
                onChange={(e) => handleFilterChange('exchangeable', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Aceita trocas</span>
            </label>
          </div>

          {filters.category && (
            <div>
              <Input
                label="Habilidades relacionadas"
                placeholder="Ex: React, Node.js"
                value={filters.relatedSkills}
                onChange={(e) => handleFilterChange('relatedSkills', e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default SearchFilters;