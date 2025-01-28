import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button, Input, Select } from '../ui/Button';

const SkillForm = ({ onSubmit, onClose, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    level: initialData?.level || '',
    exchangePreferences: initialData?.exchangePreferences || ''
  });

  const categories = [
    { value: 'desenvolvimento', label: 'Desenvolvimento' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'idiomas', label: 'Idiomas' },
    { value: 'outros', label: 'Outros' }
  ];

  const levels = [
    { value: 'iniciante', label: 'Iniciante' },
    { value: 'intermediario', label: 'Intermediário' },
    { value: 'avancado', label: 'Avançado' },
    { value: 'expert', label: 'Expert' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">
          {initialData ? 'Editar Habilidade' : 'Nova Habilidade'}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Nome da Habilidade"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Ex: Desenvolvimento React"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Descreva sua experiência com esta habilidade..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Categoria"
            name="category"
            value={formData.category}
            onChange={handleChange}
            options={categories}
            required
          />

          <Select
            label="Nível"
            name="level"
            value={formData.level}
            onChange={handleChange}
            options={levels}
            required
          />
        </div>

        <Input
          label="Preferências de Troca"
          name="exchangePreferences"
          value={formData.exchangePreferences}
          onChange={handleChange}
          placeholder="Ex: Design UI/UX, Marketing Digital"
        />

        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
          >
            {initialData ? 'Atualizar' : 'Adicionar'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SkillForm;