import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Home, MessageSquare } from 'lucide-react';

export const SuccessMessage: React.FC = () => {
  return (
    <div className="mt-8 p-6 bg-green-50 rounded-xl border border-green-200 text-center">
      <Check className="mx-auto h-12 w-12 text-green-500 mb-4" />
      <h3 className="text-lg font-bold text-gray-900 mb-4 font-georgia">
        Merci pour votre demande !
      </h3>
      <p className="text-gray-600 mb-6 font-merriweather">
        Nous avons bien reçu votre demande et nous vous contacterons bientôt.
      </p>
      <div className="flex justify-center space-x-4">
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
        >
          <Home className="mr-2 h-4 w-4" />
          Accueil
        </Link>
        <Link
          to="/contact"
          className="inline-flex items-center px-4 py-2 border border-red-600 rounded-md shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-red-50"
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Contact
        </Link>
      </div>
    </div>
  );
};
