import React from 'react';

export function MissionStatement() {
  return (
    <div className="relative bg-white py-16 sm:py-24">
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-red-50"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-12 sm:px-12 sm:py-16 lg:py-20 xl:px-20">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-700">
                Déclaration de Mission
              </h2>
              <div className="mt-6 max-w-3xl mx-auto">
                <p className="text-xl leading-relaxed text-gray-600">
                  Chez Cam-Can Immigration Solutions, notre mission est simple : rendre votre parcours d'immigration au Canada aussi fluide et sans stress que possible. Nous nous engageons à vous fournir des conseils d'experts, des services complets et un soutien bienveillant, pour vous aider à concrétiser votre rêve de vivre au Canada.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}