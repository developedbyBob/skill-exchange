import React from 'react';
import { Tabs } from '../components/ui';
import ProfileInfo from '../components/Profile/ProfileInfo';
import UserSkills from '../components/Profile/UserSkills';
import ReviewsList from '../components/Profile/ReviewsList';

const Profile = () => {
  const tabs = [
    {
      label: 'Informações Pessoais',
      content: <ProfileInfo />
    },
    {
      label: 'Minhas Habilidades',
      content: <UserSkills />
    },
    {
      label: 'Avaliações',
      content: <ReviewsList />
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow">
        <Tabs tabs={tabs} />
      </div>
    </div>
  );
};

export default Profile;