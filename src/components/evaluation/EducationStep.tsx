import React from 'react';
import { UseFormRegister, Control, FieldErrors } from 'react-hook-form';
import { Input } from '../ui/input';
import type { EvaluationFormData } from '../../types/evaluation';

interface EducationStepProps {
  register: UseFormRegister<EvaluationFormData>;
  control: Control<EvaluationFormData>;
  errors: FieldErrors<EvaluationFormData>;
}

export function EducationStep({ register, errors }: EducationStepProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Plus haut niveau d'études *
          </label>
          <Input
            {...register('education.highestDegree')}
            error={errors.education?.highestDegree?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Domaine d'études *
          </label>
          <Input
            {...register('education.fieldOfStudy')}
            error={errors.education?.fieldOfStudy?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Institution *
          </label>
          <Input
            {...register('education.institution')}
            error={errors.education?.institution?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Année d'obtention *
          </label>
          <Input
            type="number"
            min="1950"
            max={new Date().getFullYear()}
            {...register('education.graduationYear')}
            error={errors.education?.graduationYear?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Test de langue *
          </label>
          <select
            {...register('education.languageTests.type')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
          >
            <option value="none">Aucun</option>
            <option value="TCF">TCF</option>
            <option value="TEF">TEF</option>
            <option value="IELTS">IELTS</option>
            <option value="CELPIP">CELPIP</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Score (si applicable)
          </label>
          <Input
            {...register('education.languageTests.score')}
            error={errors.education?.languageTests?.score?.message}
          />
        </div>
      </div>
    </div>
  );
}