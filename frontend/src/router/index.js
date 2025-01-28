import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import PrivateRoute from '../components/Auth/PrivateRoute';

// Pages
import Home from '../pages/Home';
import Search from '../pages/Search';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import Exchange from '../pages/Exchange';
import Chat from '../pages/Chat';
import NotFound from '../pages/NotFound';

export const router = createBrowserRouter([
  // Public Routes (Auth)
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/register',
        element: <Register />
      }
    ]
  },

  // Protected Routes
  {
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/search',
        element: <Search />
      },
      {
        path: '/profile',
        element: <Profile />
      },
      {
        path: '/exchange',
        element: <Exchange />
      },
      {
        path: '/chat',
        element: <Chat />
      }
    ]
  },

  // 404 Route
  {
    path: '*',
    element: <NotFound />
  }
]);

export default router;