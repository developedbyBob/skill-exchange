// src/pages/SkillExchange.js
import { useState } from 'react';
import {
  Container,
  Grid,
  Box,
  Text,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import ExchangeProposals from '../components/Exchange/ExchangeProposals';
import ActiveExchanges from '../components/Exchange/ActiveExchanges';
import CompletedExchanges from '../components/Exchange/CompletedExchanges';

const SkillExchange = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const toast = useToast();

  return (
    <Container maxW="container.xl" py={8}>
      <Box bg="white" borderRadius="lg" boxShadow="sm" overflow="hidden">
        <Tabs index={tabIndex} onChange={setTabIndex} isLazy>
          <TabList px={4} borderBottomWidth="1px">
            <Tab>Propostas</Tab>
            <Tab>Trocas Ativas</Tab>
            <Tab>Trocas Concluídas</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <ExchangeProposals />
            </TabPanel>
            <TabPanel>
              <ActiveExchanges />
            </TabPanel>
            <TabPanel>
              <CompletedExchanges />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default SkillExchange;