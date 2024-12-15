import React from 'react';
import { Facebook, Twitter, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-600">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <img
              src="/cam-can-logo.png"
              alt="CAM-CAN Immigration Solutions"
              className="h-20 w-auto"
            />
            <p className="mt-4 text-gray-600 max-w-md">
              Votre partenaire de confiance pour l'immigration au Canada. Des solutions personnalisées pour réaliser vos rêves canadiens.
            </p>
            <div className="mt-8 flex space-x-6">
              <a href="https://www.facebook.com/Cam-Can Immigration Solutions" className="text-gray-500 hover:text-red-600 transition-colors duration-200">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="https://x.com/ImmCamCan" className="text-gray-500 hover:text-red-600 transition-colors duration-200">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="mailto:camcanimmsol@gmail.com" className="text-gray-500 hover:text-red-600 transition-colors duration-200">
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Services
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="/services/permis-travail" className="text-gray-600 hover:text-red-600 transition-colors duration-200">
                  Permis de Travail
                </a>
              </li>
              <li>
                <a href="/services/etudes" className="text-gray-600 hover:text-red-600 transition-colors duration-200">
                  Études au Canada
                </a>
              </li>
              <li>
                <a href="/services/residence-permanente" className="text-gray-600 hover:text-red-600 transition-colors duration-200">
                  Résidence Permanente
                </a>
              </li>
              <li>
                <a href="/services/installation" className="text-gray-600 hover:text-red-600 transition-colors duration-200">
                  Services d'Installation
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-red-500 mt-1 mr-3" />
                <span className="text-gray-600">Douala, Cameroon & Calgary, Canada</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-red-500 mr-3" />
                <span className="text-gray-600">+237 687 566 298</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-red-500 mr-3" />
                <a href="mailto:camcanimmsol@gmail.com" className="text-gray-600 hover:text-red-600 transition-colors duration-200">
                  camcanimmsol@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500">
            © 2024 CAM-CAN Immigration Solutions. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}