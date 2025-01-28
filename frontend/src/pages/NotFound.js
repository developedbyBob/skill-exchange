import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-9xl font-bold text-primary-600">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mt-4">Página não encontrada</h2>
      <p className="text-gray-600 mt-2">
        Desculpe, a página que você está procurando não existe ou foi movida.
      </p>
      <Link
        to="/"
        className="mt-6 px-6 py-3 bg-primary-600 text-white rounded-lg shadow hover:bg-primary-700 transition"
      >
        Voltar para a Página Inicial
      </Link>
    </div>
  );
};

export default NotFound;