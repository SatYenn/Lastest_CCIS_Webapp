import React from 'react';
import { UseFormRegister, Control, FieldErrors } from 'react-hook-form';
import { Input } from '../ui/input';
import type { EvaluationFormData } from '../../types/evaluation';

interface ProfessionalStepProps {
  register: UseFormRegister<EvaluationFormData>;
  control: Control<EvaluationFormData>;
  errors: FieldErrors<EvaluationFormData>;
}

export function ProfessionalStep({ register, errors }: ProfessionalStepProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Profession actuelle *
          </label>
          <Input
            {...register('workExperience.currentOccupation')}
            error={errors.workExperience?.currentOccupation?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Années d'expérience *
          </label>
          <Input
            type="number"
            min="0"
            step="1"
            {...register('workExperience.yearsOfExperience', {
              valueAsNumber: true,
              setValueAs: (value: string) => parseInt(value, 10) || 0
            })}
            error={errors.workExperience?.yearsOfExperience?.message}
          />
          <p className="mt-1 text-xs text-gray-500">
            Nombre entier d'années d'expérience professionnelle
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Statut d'emploi *
          </label>
          <select
            {...register('workExperience.employmentStatus')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
          >
            <option value="">Sélectionnez votre statut</option>
            <option value="employed">Employé(e)</option>
            <option value="self-employed">Travailleur autonome</option>
            <option value="unemployed">Sans emploi</option>
            <option value="student">Étudiant(e)</option>
          </select>
          {errors.workExperience?.employmentStatus && (
            <p className="mt-1 text-sm text-red-600">
              {errors.workExperience.employmentStatus.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Expérience canadienne *
          </label>
          <div className="mt-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                {...register('workExperience.canadianExperience')}
                className="rounded border-gray-300 text-red-600 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
              <span className="ml-2 text-sm text-gray-600">
                J'ai déjà travaillé au Canada
              </span>
            </label>
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Profession souhaitée au Canada *
          </label>
          <Input
            {...register('workExperience.desiredOccupation')}
            error={errors.workExperience?.desiredOccupation?.message}
          />
        </div>
      </div>
    </div>
  );
}