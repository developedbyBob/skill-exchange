import React, { useState } from 'react';
import { Button, Select, Card } from '../ui/Button';
import { X, MessageSquare } from 'lucide-react';

const ExchangeProposalModal = ({ skill, onClose, onSubmit, userSkills = [] }) => {
  const [selectedSkill, setSelectedSkill] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      skillOffered: selectedSkill,
      message
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
        >
          <X size={20} />
        </button>

        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Propor Troca</h2>
          
          {/* Skill Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="font-medium">Você está interessado em:</p>
            <p className="text-gray-600">{skill.name}</p>
            <p className="text-sm text-gray-500 mt-1">
              Oferecido por {skill.user.name}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Select
              label="Escolha uma habilidade para oferecer"
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              options={userSkills.map(skill => ({
                value: skill._id,
                label: skill.name
              }))}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mensagem (opcional)
              </label>
              <div className="relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Explique o que você gostaria de aprender/trocar..."
                />
                <MessageSquare 
                  size={20} 
                  className="absolute right-3 top-3 text-gray-400" 
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                fullWidth
              >
                Enviar Proposta
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default ExchangeProposalModal;