import { ArrowRight, Check, Plane, Calendar, Users, FileText } from 'lucide-react';

// Add the missing constants
const visaTypes = [
  {
    title: 'Visa Touristique',
    description: 'Pour les voyages de loisirs et visites familiales',
    icon: Plane
  },
  {
    title: 'Visa Court Séjour',
    description: 'Pour les séjours de moins de 6 mois',
    icon: Calendar
  },
  {
    title: 'Visa Multiple Entrées',
    description: 'Pour des entrées multiples sur plusieurs années',
    icon: Users
  }
];

const steps = [
  {
    title: 'Documents Requis',
    items: [
      'Passeport valide',
      'Formulaires remplis',
      'Photos conformes',
      'Justificatifs financiers'
    ]
  },
  {
    title: 'Conditions',
    items: [
      'Intention de retour',
      'Moyens financiers suffisants',
      'Pas de casier judiciaire',
      'Bonne santé'
    ]
  },
  {
    title: 'Processus',
    items: [
      'Soumission en ligne',
      'Paiement des frais',
      'Biométrie si requis',
      'Suivi de demande'
    ]
  }
];

export function VisitorVisa() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16 sm:pt-20 lg:pt-24">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-700 to-red-900 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white">
              Visa de Visiteur pour le Canada
            </h1>
            <p className="mt-3 max-w-md mx-auto text-lg sm:text-xl md:text-2xl text-red-100 sm:mt-5 md:max-w-3xl">
              Guide complet pour préparer votre demande de visa visiteur
            </p>
            <div className="mt-8 sm:mt-10 flex justify-center">
              <a
                href="/evaluation"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-red-700 bg-white hover:bg-red-50 transition duration-150"
              >
                Évaluer mon profil
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Types de Visa */}
      <div className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Types de Visa de Visiteur
            </h2>
            <p className="mt-4 text-lg sm:text-xl text-gray-600">
              Choisissez le type de visa qui correspond le mieux à vos besoins
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {visaTypes.map((type) => (
              <div
                key={type.title}
                className="relative bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hover:border-red-500 transition-colors duration-200"
              >
                <div className="absolute top-6 right-6">
                  <type.icon className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                  {type.title}
                </h3>
                <p className="text-gray-600">{type.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Étapes du Processus */}
      <div className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Processus de Demande
            </h2>
            <p className="mt-4 text-lg sm:text-xl text-gray-600">
              Suivez ces étapes pour préparer votre demande de visa
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
                    <span className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full text-red-600 font-bold">
                      {index + 1}
                    </span>
                  </div>
                  <ul className="space-y-3">
                    {step.items.map((item) => (
                      <li key={item} className="flex items-start">
                        <Check className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-red-700 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Besoin d'Aide ?
            </h2>
            <p className="mt-4 text-lg sm:text-xl text-red-100">
              Nos experts sont là pour vous accompagner dans votre demande de visa
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-base font-medium rounded-full text-white hover:bg-white hover:text-red-700 transition duration-150"
              >
                Nous Contacter
              </a>
              <a
                href="/evaluation"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-red-700 bg-white hover:bg-red-50 transition duration-150"
              >
                Évaluer mon profil
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}