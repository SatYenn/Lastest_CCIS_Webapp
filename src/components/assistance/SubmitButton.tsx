import React from 'react';
import { ArrowRight } from 'lucide-react';

interface SubmitButtonProps {
  isLoading: boolean;
  showPaymentInstructions: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ 
  isLoading, 
  showPaymentInstructions 
}) => {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-base font-medium text-white ${
        isLoading ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'
      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 font-merriweather mt-6`}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Traitement en cours...
        </>
      ) : (
        <>
          {showPaymentInstructions ? 'Envoyer' : 'Continuer'}
          <ArrowRight className="ml-2 h-5 w-5" />
        </>
      )}
    </button>
  );
};
