// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import SkillExchange from './pages/SkillExchange';
import Trocas from './pages/Trocas';  // Importar a página de Trocas

// Components
import PrivateRoute from './components/Auth/PrivateRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SocketProvider>
            <Router>
              <Routes>
                {/* Rotas públicas */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Rotas protegidas */}
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute>
                        <Profile />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/chat"
                    element={
                      <PrivateRoute>
                        <Chat />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/skill-exchange"
                    element={
                      <PrivateRoute>
                        <SkillExchange />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/trocas"
                    element={
                      <PrivateRoute>
                        <Trocas />
                      </PrivateRoute>
                    }
                  />
                </Route>
              </Routes>
            </Router>
          </SocketProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;