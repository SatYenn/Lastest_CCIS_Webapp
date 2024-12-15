import { ArrowRight, FileText, RefreshCcw, AlertTriangle, FileCheck, Clock, Check, Globe } from 'lucide-react';

const documentTypes = [
  {
    title: 'Carte de Résident Permanent',
    description: "Renouvellement ou remplacement de votre carte de résident permanent",
    icon: FileText,
    features: ['Validité de 5 ans', 'Document officiel', 'Preuve de statut']
  },
  {
    title: 'Permis de Travail',
    description: "Renouvellement de votre autorisation de travail au Canada",
    icon: RefreshCcw,
    features: ['Continuité d\'emploi', 'Statut légal', 'Accès aux services']
  },
  {
    title: 'Documents Perdus/Volés',
    description: "Remplacement de documents d'immigration perdus ou volés",
    icon: AlertTriangle,
    features: ['Procédure d\'urgence', 'Assistance complète', 'Suivi prioritaire']
  }
];

const requirements = [
  {
    title: 'Documents Requis',
    items: [
      'Formulaire de demande approprié',
      'Photos conformes aux normes',
      'Preuve d\'identité valide',
      'Justificatifs de statut actuel'
    ]
  },
  {
    title: 'Conditions Générales',
    items: [
      'Document original ou déclaration de perte',
      'Preuves de résidence au Canada',
      'Frais de traitement',
      'Délais respectés'
    ]
  }
];

const processSteps = [
  {
    title: "Évaluation Initiale",
    description: "Analyse de votre situation et des documents à renouveler",
    icon: FileCheck
  },
  {
    title: "Préparation du Dossier",
    description: "Rassemblement et vérification des documents",
    icon: Globe
  },
  {
    title: "Soumission et Suivi",
    description: "Dépôt de la demande et monitoring",
    icon: Clock
  }
];

export const DocumentRenewal = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-16 sm:pt-20 lg:pt-24">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-700 to-red-900 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white font-georgia">
              Renouvellement & Remplacement de Documents
            </h1>
            <p className="mt-3 max-w-md mx-auto text-lg sm:text-xl md:text-2xl text-red-100 sm:mt-5 md:max-w-3xl font-merriweather">
              Maintenez vos documents d'immigration à jour avec notre assistance experte
            </p>
            <div className="mt-8 sm:mt-10 flex justify-center">
              <a
                href="/evaluation"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-red-700 bg-white hover:bg-red-50 transition duration-150"
              >
                Évaluer mon cas
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Types de Documents */}
      <div className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-georgia">
              Types de Documents
            </h2>
            <p className="mt-4 text-lg sm:text-xl text-gray-600 font-merriweather">
              Découvrez nos services de renouvellement et remplacement
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {documentTypes.map((type) => (
              <div
                key={type.title}
                className="relative bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:border-red-500 transition-colors duration-200"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 font-georgia">
                    {type.title}
                  </h3>
                  <type.icon className="h-8 w-8 text-red-600" />
                </div>
                <p className="text-gray-600 mb-6 font-merriweather">{type.description}</p>
                <ul className="space-y-3">
                  {type.features.map((feature) => (
                    <li key={feature} className="flex items-center text-gray-600 font-merriweather">
                      <Check className="h-5 w-5 text-red-500 mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Exigences */}
      <div className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-georgia">
              Documents et Conditions
            </h2>
            <p className="mt-4 text-lg sm:text-xl text-gray-600 font-merriweather">
              Les éléments nécessaires pour votre demande
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {requirements.map((req) => (
              <div key={req.title} className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 font-georgia">
                  {req.title}
                </h3>
                <ul className="space-y-4">
                  {req.items.map((item) => (
                    <li key={item} className="flex items-start font-merriweather">
                      <Check className="h-5 w-5 text-red-500 mr-3 mt-1 flex-shrink-0" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Processus */}
      <div className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-georgia">
              Notre Processus
            </h2>
            <p className="mt-4 text-lg sm:text-xl text-gray-600 font-merriweather">
              Un accompagnement étape par étape
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {processSteps.map((step, index) => (
              <div key={step.title} className="relative">
                <div className="bg-white rounded-lg shadow-lg p-8 h-full">
                  <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mb-6">
                    <step.icon className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 font-georgia">{step.title}</h3>
                  <p className="text-gray-600 font-merriweather">{step.description}</p>
                </div>
                {index < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-red-700 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-georgia">
              Besoin de Renouveler vos Documents?
            </h2>
            <p className="mt-4 text-lg sm:text-xl text-red-100 font-merriweather">
              Nos experts sont là pour vous accompagner dans vos démarches
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-base font-medium rounded-full text-white hover:bg-white hover:text-red-700 transition duration-150 font-merriweather"
              >
                Nous Contacter
              </a>
              <a
                href="/evaluation"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-red-700 bg-white hover:bg-red-50 transition duration-150 font-merriweather"
              >
                Évaluer mon cas
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};