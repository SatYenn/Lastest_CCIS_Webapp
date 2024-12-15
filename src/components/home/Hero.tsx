import React, { useEffect, useState } from 'react';
import { ArrowRight, MapPin, GraduationCap, Briefcase } from 'lucide-react';

const highlights = [
  {
    icon: MapPin,
    text: "Plus de 1000+ clients accompagnés"
  },
  {
    icon: GraduationCap,
    text: "98% de taux de réussite"
  },
  {
    icon: Briefcase,
    text: "Expertise reconnue depuis 10 ans"
  }
];

export function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative min-h-[90vh] bg-gradient-to-br from-red-900 via-red-800 to-red-900 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className={`pt-20 pb-16 text-center lg:pt-32 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex justify-center mb-8">
            <img 
              src="/cam-can-logo.png" 
              alt="CAM-CAN Logo" 
              className="h-32 w-auto animate-float"
            />
          </div>
          
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl font-georgia">
            <span className="block">C.C.I.S</span>
            <span className="block text-3xl sm:text-4xl md:text-5xl mt-3 text-red-100 font-merriweather">
              Cam-Can Immigration Solutions
            </span>
          </h1>
          
          <p className="mt-6 max-w-lg mx-auto text-xl text-red-50 sm:max-w-3xl font-merriweather">
            Votre partenaire de confiance pour naviguer dans le processus d'immigration au Canada. 
            Des solutions personnalisées pour les individus, familles et entreprises.
          </p>

          <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center gap-4">
            <a
              href="/evaluation"
              className="group w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-full text-red-700 bg-white hover:bg-red-50 transition-all duration-200 transform hover:scale-105"
            >
              Commencer votre voyage
              <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="/contact"
              className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-full text-white border-2 border-white hover:bg-white hover:text-red-700 transition-all duration-200"
            >
              Nous contacter
            </a>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3 max-w-5xl mx-auto">
            {highlights.map((item, index) => (
              <div 
                key={index}
                className={`bg-white/10 backdrop-blur-md rounded-xl p-6 transform transition-all duration-500 hover:scale-105 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="flex items-center justify-center space-x-4">
                  <item.icon className="h-6 w-6 text-red-100" />
                  <span className="text-lg font-medium text-white">{item.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-24 fill-current text-white" viewBox="0 0 1440 74" preserveAspectRatio="none">
          <path d="M456.464 0.0433865C277.158 -1.70575 0 50.0141 0 50.0141V74H1440V50.0141C1440 50.0141 1320.4 31.1925 1243.09 27.0276C1099.33 19.2816 1019.08 53.1981 875.138 50.0141C710.527 46.3727 621.108 1.64949 456.464 0.0433865Z"></path>
        </svg>
      </div>
    </div>
  );
}