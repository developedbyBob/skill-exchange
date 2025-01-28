import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Button, Card, Badge } from '../ui/Button';
import SkillForm from './SkillForm';
import api from '../../services/api';

const UserSkills = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const queryClient = useQueryClient();

  // Buscar skills do usuário
  const { data: skills, isLoading } = useQuery('userSkills', async () => {
    const response = await api.get('/users/skills');
    return response.data.data;
  });

  // Mutation para adicionar skill
  const addSkillMutation = useMutation(
    async (skillData) => {
      const response = await api.post('/skills', skillData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('userSkills');
        setShowForm(false);
      }
    }
  );

  // Mutation para atualizar skill
  const updateSkillMutation = useMutation(
    async ({ id, data }) => {
      const response = await api.put(`/skills/${id}`, data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('userSkills');
        setShowForm(false);
        setEditingSkill(null);
      }
    }
  );

  // Mutation para deletar skill
  const deleteSkillMutation = useMutation(
    async (id) => {
      await api.delete(`/skills/${id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('userSkills');
      }
    }
  );

  const handleSubmit = async (data) => {
    if (editingSkill) {
      await updateSkillMutation.mutateAsync({
        id: editingSkill._id,
        data
      });
    } else {
      await addSkillMutation.mutateAsync(data);
    }
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta habilidade?')) {
      await deleteSkillMutation.mutateAsync(id);
    }
  };

  if (showForm) {
    return (
      <SkillForm
        onSubmit={handleSubmit}
        onClose={() => {
          setShowForm(false);
          setEditingSkill(null);
        }}
        initialData={editingSkill}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Minhas Habilidades</h2>
        <Button
          variant="primary"
          onClick={() => setShowForm(true)}
        >
          <Plus size={20} className="mr-2" />
          Nova Habilidade
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-full" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills?.map((skill) => (
            <Card key={skill._id} className="relative group">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="primary">{skill.category}</Badge>
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(skill)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(skill._id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-medium mb-2">{skill.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{skill.description}</p>

                <div className="flex items-center justify-between text-sm">
                  <Badge variant="secondary">{skill.level}</Badge>
                  <Badge
                    variant={skill.available ? 'success' : 'warning'}
                  >
                    {skill.available ? 'Disponível' : 'Indisponível'}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSkills;