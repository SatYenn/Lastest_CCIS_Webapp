import React from 'react';
import { Phone, AlertCircle } from 'lucide-react';

export const PaymentInstructions: React.FC = () => {
  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-4 font-georgia">
        Instructions de Paiement
      </h3>
      <div className="space-y-4 font-merriweather">
        <div className="flex items-start">
          <Phone className="h-5 w-5 text-red-500 mt-1 mr-3" />
          <div>
            <p className="font-medium">Orange Money:</p>
            <p>Composez *150#, sélectionnez 'Envoyer de l'argent'</p>
            <p className="font-medium">Numéro: +237 6 87 56 62 98</p>
          </div>
        </div>
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mt-1 mr-3" />
          <p>
            SVP, après le paiement, veuillez télécharger la capture d'écran de votre confirmation ci-dessous.
          </p>
        </div>
      </div>
    </div>
  );
};
