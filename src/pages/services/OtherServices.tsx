import React from 'react';
import { ArrowRight, FileText, GraduationCap, Globe, Plane, Check, Clock, Book, Award, FileSearch } from 'lucide-react';

const services = [
  {
    title: 'CV Format Canadien',
    description: "Adaptation professionnelle de votre CV aux normes canadiennes",
    icon: FileText,
    features: [
      'Structure adaptée',
      'Mise en valeur des compétences',
      'Optimisation du contenu'
    ]
  },
  {
    title: 'Inscription TCF/TEF',
    description: "Assistance pour les tests de français TCF et TEF au Cameroun",
    icon: Book,
    features: [
      'Choix du centre d\'examen',
      'Préparation du dossier',
      'Suivi d\'inscription'
    ]
  },
  {
    title: 'Équivalence de Diplôme',
    description: "Support pour la reconnaissance de vos qualifications",
    icon: GraduationCap,
    features: [
      'Constitution du dossier',
      'Traduction des documents',
      'Suivi de la demande'
    ]
  },
  {
    title: 'Réservation de Vols',
    description: "Recherche et réservation de vols pour le Canada",
    icon: Plane,
    features: [
      'Recherche des meilleures offres',
      'Planification du voyage',
      'Assistance réservation'
    ]
  }
];

const processSteps = [
  {
    title: "Évaluation des Besoins",
    description: "Analyse de vos besoins spécifiques",
    icon: FileSearch
  },
  {
    title: "Préparation",
    description: "Constitution des dossiers nécessaires",
    icon: Globe
  },
  {
    title: "Suivi Personnalisé",
    description: "Accompagnement jusqu'à l'aboutissement",
    icon: Clock
  }
];

export function OtherServices() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16 sm:pt-20 lg:pt-24">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-700 to-red-900 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white font-georgia">
              Services Supplémentaires
            </h1>
            <p className="mt-3 max-w-md mx-auto text-lg sm:text-xl md:text-2xl text-red-100 sm:mt-5 md:max-w-3xl font-merriweather">
              Des services complémentaires pour faciliter votre immigration
            </p>
            <div className="mt-8 sm:mt-10 flex justify-center">
              <a
                href="/evaluation"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-red-700 bg-white hover:bg-red-50 transition duration-150"
              >
                Découvrir nos services
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-georgia">
              Nos Services Complémentaires
            </h2>
            <p className="mt-4 text-lg sm:text-xl text-gray-600 font-merriweather">
              Des solutions adaptées pour chaque aspect de votre projet
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {services.map((service) => (
              <div
                key={service.title}
                className="relative bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:border-red-500 transition-colors duration-200"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 font-georgia">
                    {service.title}
                  </h3>
                  <service.icon className="h-8 w-8 text-red-600" />
                </div>
                <p className="text-gray-600 mb-6 font-merriweather">{service.description}</p>
                <ul className="space-y-3">
                  {service.features.map((feature) => (
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

      {/* Process */}
      <div className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-georgia">
              Notre Processus
            </h2>
            <p className="mt-4 text-lg sm:text-xl text-gray-600 font-merriweather">
              Un accompagnement personnalisé à chaque étape
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
              Besoin d'Assistance Supplémentaire?
            </h2>
            <p className="mt-4 text-lg sm:text-xl text-red-100 font-merriweather">
              Nos experts sont là pour vous accompagner dans toutes vos démarches
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
                Évaluer mes besoins
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}