import React from 'react';

interface ContactFormProps {
  formData: {
    email: string;
    name: string;
    phone: string;
    details: string;
  };
  onChange: (field: string, value: string) => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ formData, onChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 font-georgia">
          Adresse e-mail *
        </label>
        <input
          type="email"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          value={formData.email}
          onChange={(e) => onChange('email', e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 font-georgia">
          Nom et prénom *
        </label>
        <input
          type="text"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 font-georgia">
          Numéro de téléphone *
        </label>
        <input
          type="tel"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          value={formData.phone}
          onChange={(e) => onChange('phone', e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 font-georgia">
          Détails supplémentaires
        </label>
        <textarea
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          value={formData.details}
          onChange={(e) => onChange('details', e.target.value)}
        />
      </div>
    </div>
  );
};
