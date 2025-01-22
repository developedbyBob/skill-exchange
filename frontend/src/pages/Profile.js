// src/pages/Profile.js
import { useState } from 'react';
import {
  Container,
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
} from '@chakra-ui/react';
import ProfileInfo from '../components/Profile/ProfileInfo';
import UserSkills from '../components/Profile/UserSkills';
import ReviewsList from '../components/Profile/ReviewsList';

const Profile = () => {
  const [activeTab, setActiveTab] = useState(0);
  const toast = useToast();

  return (
    <Container maxW="container.xl" py={8}>
      <Box bg="white" borderRadius="lg" boxShadow="sm" overflow="hidden">
        <Tabs index={activeTab} onChange={setActiveTab} isLazy>
          <TabList px={4} borderBottomWidth="1px">
            <Tab>Informações Pessoais</Tab>
            <Tab>Minhas Habilidades</Tab>
            <Tab>Avaliações</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <ProfileInfo />
            </TabPanel>
            <TabPanel>
              <UserSkills />
            </TabPanel>
            <TabPanel>
              <ReviewsList />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Profile;