import React from 'react';
import { ArrowRight, Briefcase, Building2, GraduationCap, FileCheck, Clock, Check, Globe } from 'lucide-react';

const permitTypes = [
  {
    title: 'Permis de Travail Fermé',
    description: "Lié à un employeur spécifique, ce permis vous permet de travailler uniquement pour cet employeur.",
    icon: Building2,
  },
  {
    title: 'Permis de Travail Ouvert',
    description: "Permet de travailler pour n'importe quel employeur, sans restriction.",
    icon: Briefcase,
  },
  {
    title: 'Permis de Travail pour Étudiants',
    description: "Permet aux étudiants étrangers de travailler pendant ou après leurs études.",
    icon: GraduationCap,
  }
];

const processSteps = [
  {
    title: "Vérification d'Éligibilité",
    items: [
      "Offre d'emploi valide au Canada",
      'Qualifications requises',
      'Vérification des antécédents',
      'Examen médical si nécessaire'
    ]
  },
  {
    title: 'Documents Requis',
    items: [
      'Passeport valide',
      'Formulaire IMM 1295',
      "Lettre d'offre d'emploi",
      'CV et diplômes',
      "Preuves d'expérience"
    ]
  },
  {
    title: 'Soumission',
    items: [
      'Création du compte IRCC',
      'Paiement des frais',
      'Données biométriques',
      'Suivi de la demande'
    ]
  }
];

export function WorkPermit() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16 sm:pt-20 lg:pt-24">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-700 to-red-900 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white font-georgia">
              Permis de Travail pour le Canada
            </h1>
            <p className="mt-3 max-w-md mx-auto text-lg sm:text-xl md:text-2xl text-red-100 sm:mt-5 md:max-w-3xl font-merriweather">
              Guide complet pour obtenir votre permis de travail canadien
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

      {/* Types de Permis */}
      <div className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-georgia">
              Types de Permis de Travail
            </h2>
            <p className="mt-4 text-lg sm:text-xl text-gray-600 font-merriweather">
              Découvrez les différents types de permis de travail disponibles
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {permitTypes.map((type) => (
              <div
                key={type.title}
                className="relative bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hover:border-red-500 transition-colors duration-200"
              >
                <div className="absolute top-6 right-6">
                  <type.icon className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 font-georgia">
                  {type.title}
                </h3>
                <p className="text-gray-600 font-merriweather">{type.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services Offerts */}
      <div className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-georgia">
              Nos Services pour le Permis de Travail
            </h2>
            <p className="mt-4 text-lg sm:text-xl text-gray-600 font-merriweather">
              Un accompagnement complet pour votre demande
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mb-4">
                <FileCheck className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 font-georgia">Évaluation initiale</h3>
              <p className="text-gray-600 font-merriweather">Analyse complète de votre profil et de vos options d'immigration</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mb-4">
                <Globe className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 font-georgia">Préparation du dossier</h3>
              <p className="text-gray-600 font-merriweather">Assistance pour la collecte et la préparation de tous les documents requis</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mb-4">
                <Clock className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 font-georgia">Suivi continu</h3>
              <p className="text-gray-600 font-merriweather">Support tout au long du processus et mise à jour régulière sur l'avancement</p>
            </div>
          </div>
        </div>
      </div>

      {/* Processus de Demande */}
      <div className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-georgia">
              Processus de Demande
            </h2>
            <p className="mt-4 text-lg sm:text-xl text-gray-600 font-merriweather">
              Les étapes clés pour obtenir votre permis de travail
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {processSteps.map((step, index) => (
              <div key={step.title} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 font-georgia">{step.title}</h3>
                    <span className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full text-red-600 font-bold">
                      {index + 1}
                    </span>
                  </div>
                  <ul className="space-y-3">
                    {step.items.map((item) => (
                      <li key={item} className="flex items-start font-merriweather">
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
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-georgia">
              Prêt à Commencer?
            </h2>
            <p className="mt-4 text-lg sm:text-xl text-red-100 font-merriweather">
              Nos experts sont là pour vous accompagner dans votre demande de permis de travail
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