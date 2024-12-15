import React from 'react';
import { Progress } from '../ui/progress';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  currentStep: 'personal' | 'education' | 'professional' | 'immigration';
}

export function ProgressBar({ currentStep }: ProgressBarProps) {
  const steps = [
    { id: 'personal', label: 'Informations personnelles' },
    { id: 'education', label: 'Éducation' },
    { id: 'professional', label: 'Expérience professionnelle' },
    { id: 'immigration', label: 'Immigration' },
  ];

  const currentIndex = steps.findIndex(step => step.id === currentStep);
  const progress = ((currentIndex + 1) / steps.length) * 100;

  return (
    <div className="mb-8">
      <div className="relative">
        <Progress value={progress} className="mb-6" />
        <div className="flex justify-between text-sm text-gray-600">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`text-center flex-1 ${
                index <= currentIndex ? 'text-red-600 font-medium' : ''
              }`}
            >
              <div className="relative">
                <div
                  className={`absolute -top-3 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full ${
                    index <= currentIndex ? 'bg-red-600' : 'bg-gray-300'
                  }`}
                />
                <div className="pt-4">{step.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}