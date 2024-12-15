import React from 'react';
import { ArrowRight, Briefcase, GraduationCap, Users, Home, Scale, Globe, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    title: 'Permis de Travail',
    description: 'Assistance complète pour l\'obtention de votre permis de travail canadien',
    icon: Briefcase,
    href: '/services/permis-de-travail'
  },
  {
    title: 'Permis d\'Études',
    description: 'Accompagnement pour les étudiants internationaux',
    icon: GraduationCap,
    href: '/services/permis-etudes'
  },
  {
    title: 'Super Visa & Regroupement Familial',
    description: 'Solutions pour réunir votre famille au Canada',
    icon: Users,
    href: '/services/super-visa-regroupement-familial'
  },
  {
    title: 'Résidence Permanente',
    description: 'Guidance pour l\'obtention de la résidence permanente',
    icon: Home,
    href: '/services/residence-permanente'
  },
  {
    title: 'Naturalisation & Citoyenneté',
    description: 'Accompagnement vers la citoyenneté canadienne',
    icon: Globe,
    href: '/services/naturalisation'
  },
  {
    title: 'Parrainage d\'un Proche',
    description: 'Assistance pour le parrainage familial',
    icon: Users,
    href: '/services/parrainage'
  },
  {
    title: 'Renouvellement Documents',
    description: 'Services de renouvellement et remplacement',
    icon: Scale,
    href: '/services/renouvellement-documents'
  },
  {
    title: 'Aide à la Relocalisation',
    description: 'Support pour votre installation au Canada',
    icon: Home,
    href: '/services/relocation'
  },
  {
    title: 'Services Juridiques',
    description: 'Conseils et accompagnement juridique',
    icon: Scale,
    href: '/services/juridique'
  },
  {
    title: 'Autres Services',
    description: 'CV canadien, tests de langue, équivalence de diplômes et plus',
    icon: MoreHorizontal,
    href: '/services/autres'
  }
];

export function Services() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 font-georgia">Nos Services</h2>
          <p className="mt-4 text-lg text-gray-600 font-merriweather">
            Des solutions complètes pour votre immigration au Canada
          </p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service.title}
                to={service.href}
                className="group"
              >
                <div className="pt-6">
                  <div className="flow-root bg-white rounded-lg px-6 pb-8 h-full transition-all duration-200 transform hover:scale-105 hover:shadow-xl">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-red-600 to-red-700 rounded-md shadow-lg group-hover:from-red-700 group-hover:to-red-800 transition-all duration-200">
                          <service.icon className="h-6 w-6 text-white" aria-hidden="true" />
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight font-georgia">
                        {service.title}
                      </h3>
                      <p className="mt-5 text-base text-gray-500 font-merriweather">
                        {service.description}
                      </p>
                      <div className="mt-6">
                        <div className="inline-flex items-center text-red-600 group-hover:text-red-700 font-merriweather">
                          En savoir plus
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}