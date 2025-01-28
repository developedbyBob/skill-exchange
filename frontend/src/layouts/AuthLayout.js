import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Logo Area */}
      <div className="flex justify-center pt-8 sm:pt-12">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary-600">
            TrocaFavor
          </span>
        </Link>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Auth Content (Login/Register forms) */}
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <Outlet />
          </div>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <div className="space-x-4">
              <Link 
                to="/terms" 
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Termos de Uso
              </Link>
              <span className="text-gray-400">•</span>
              <Link 
                to="/privacy" 
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Política de Privacidade
              </Link>
            </div>
            <p className="mt-4 text-xs text-gray-500">
              © {new Date().getFullYear()} TrocaFavor. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;