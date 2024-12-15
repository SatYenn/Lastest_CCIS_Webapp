import React from 'react';
import { services, type Service } from './AssServices';

interface ServicesListProps {
  selectedService: string;
  onServiceSelect: (serviceId: string) => void;
}

export const ServicesList: React.FC<ServicesListProps> = ({ 
  selectedService, 
  onServiceSelect 
}) => {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 font-georgia">
        Sélectionnez votre service *
      </label>
      <div className="grid gap-4">
        {services.map((service: Service) => (
          <label
            key={service.id}
            className={`relative flex items-start p-4 rounded-lg border ${
              selectedService === service.id
                ? 'border-red-500 bg-red-50'
                : 'border-gray-200 hover:border-red-300'
            } cursor-pointer transition-colors duration-200`}
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-sm font-medium text-gray-900 font-georgia">
                    {service.name}
                  </span>
                  <span className="block text-sm text-gray-500 font-merriweather mt-1">
                    {service.description}
                  </span>
                </div>
                <span className="block text-sm font-medium text-red-600 ml-4">
                  {service.price}
                </span>
              </div>
            </div>
            <input
              type="radio"
              name="service"
              value={service.id}
              checked={selectedService === service.id}
              onChange={(e) => onServiceSelect(e.target.value)}
              className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500 ml-4 mt-1"
            />
          </label>
        ))}
      </div>
    </div>
  );
};
