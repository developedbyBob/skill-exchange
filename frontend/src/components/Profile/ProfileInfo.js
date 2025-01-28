import React, { useState } from 'react';
import { User, MapPin, Mail, Edit2 } from 'lucide-react';
import { Button, Input, Card } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

const ProfileInfo = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    location: user?.location || '',
    bio: user?.bio || ''
  });
  const [isLoading, setIsLoading] = useState(false);

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
      await updateUser(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-semibold">Informações Pessoais</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit2 size={18} className="mr-2" />
            {isEditing ? 'Cancelar' : 'Editar'}
          </Button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Nome"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled
            />

            <Input
              label="Localização"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Biografia
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Conte um pouco sobre você..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
              >
                Salvar
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-16 h-16 rounded-full"
                  />
                ) : (
                  <User size={32} className="text-primary-600" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-medium">{user?.name}</h3>
                <p className="text-gray-500 flex items-center mt-1">
                  <MapPin size={16} className="mr-1" />
                  {user?.location}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 flex items-center">
                <Mail size={16} className="mr-1" />
                {user?.email}
              </p>
            </div>

            {user?.bio && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">
                  Sobre mim
                </h4>
                <p className="text-gray-600">{user.bio}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProfileInfo;