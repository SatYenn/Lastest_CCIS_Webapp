import React from 'react';
import { ArrowRight } from 'lucide-react';

export function CallToAction() {
  return (
    <div className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-800 overflow-hidden">
      <div className="absolute inset-0">
        <svg className="absolute right-0 top-0 transform translate-x-1/2 -translate-y-1/2 opacity-20" width="404" height="404" fill="none" viewBox="0 0 404 404">
          <defs>
            <pattern id="85737c0e-0916-41d7-917f-596dc7edfa27" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="4" height="4" className="text-white" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="404" height="404" fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)" />
        </svg>
      </div>
      <div className="relative max-w-3xl mx-auto text-center px-4 py-16 sm:py-20 lg:py-24">
        <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          <span className="block">Prêt à commencer votre aventure?</span>
          <span className="block mt-2">Commencez dès aujourd'hui.</span>
        </h2>
        <p className="mt-6 text-xl leading-relaxed text-red-100">
          Laissez-nous vous aider à réaliser votre rêve canadien. Prenez rendez-vous pour une évaluation gratuite de votre profil.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <a
            href="/evaluation"
            className="inline-flex items-center px-8 py-4 border-2 border-transparent text-lg font-medium rounded-full text-red-700 bg-white hover:bg-red-50 transition-all duration-200 transform hover:scale-105"
          >
            Évaluer mon profil
            <ArrowRight className="ml-2 h-5 w-5" />
          </a>
          <a
            href="/contact"
            className="inline-flex items-center px-8 py-4 border-2 border-white text-lg font-medium rounded-full text-white hover:bg-white hover:text-red-700 transition-all duration-200"
          >
            Nous contacter
          </a>
        </div>
      </div>
    </div>
  );
}