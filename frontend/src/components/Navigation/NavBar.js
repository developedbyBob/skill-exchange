// src/components/Navigation/Navbar.js
import {
  Box,
  Flex,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Container,
  Avatar,
  Text,
  Link,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box bg="white" borderBottom="1px" borderColor="gray.200">
      <Container maxW="container.xl">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          {/* Logo */}
          <Link 
            as={RouterLink} 
            to="/"
            fontSize="xl"
            fontWeight="bold"
            color="blue.500"
            _hover={{ textDecoration: 'none' }}
          >
            Skills Exchange
          </Link>

          {/* Menu Links */}
          <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
            <Link as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
              <Text fontWeight="medium">Início</Text>
            </Link>
            
            <Link as={RouterLink} to="/trocas" _hover={{ textDecoration: 'none' }}>
              <Text fontWeight="medium">Trocas</Text>
            </Link>

            <Link as={RouterLink} to="/chat" _hover={{ textDecoration: 'none' }}>
              <Text fontWeight="medium">Chat</Text>
            </Link>
          </HStack>

          {/* User Menu */}
          <Menu>
            <MenuButton
              as={Button}
              variant="ghost"
              size="sm"
            >
              <Avatar
                size="sm"
                name={user?.name}
                src={user?.avatar}
              />
            </MenuButton>
            <MenuList>
              <MenuItem as={RouterLink} to="/profile">
                Meu Perfil
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                Sair
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Container>
    </Box>
  );
};

export default Navbar;