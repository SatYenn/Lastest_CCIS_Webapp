import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './button';

interface ServiceCTAProps {
  title: string;
  description: string;
}

export function ServiceCTA({ title, description }: ServiceCTAProps) {
  return (
    <div className="bg-red-700 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-georgia">
            {title}
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-red-100 font-merriweather">
            {description}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-red-700"
              asChild
            >
              <Link to="/assistance-paiement">
                Réserver un Service
              </Link>
            </Button>
            <Button
              size="lg"
              className="bg-white text-red-700 hover:bg-red-50"
              asChild
            >
              <Link to="/evaluation">
                Évaluer mon profil
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}