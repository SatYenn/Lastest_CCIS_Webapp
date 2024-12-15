import React from 'react';
import { EvaluationForm } from '../components/evaluation/EvaluationForm';

const Evaluation: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Évaluation de Votre Profil
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Complétez ce questionnaire pour recevoir une évaluation personnalisée de vos options d'immigration au Canada.
            </p>
          </div>
        </div>
      </div>
      <EvaluationForm />
    </div>
  );
};

export default Evaluation;