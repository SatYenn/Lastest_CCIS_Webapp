export const services = [
    {
      id: 'consultation',
      name: 'Consultation initiale',
      price: '25 000 FCFA',
      description: 'Une consultation de 30 minutes pour discuter de vos besoins en matière d\'immigration',
    },
    {
      id: 'tcf-tef',
      name: 'Assistance à l\'inscription au TCF/TEF',
      price: '50 000 FCFA',
      description: 'Aide à l\'inscription aux tests de langue TCF ou TEF',
    },
    {
      id: 'equivalence',
      name: 'Assistance à l\'application de l\'équivalence de diplôme',
      price: '50 000 FCFA + frais',
      description: 'Assistance pour la demande d\'équivalence de diplôme',
    },
    {
      id: 'revision-fixed',
      name: 'Révision des documents (forfait fixe)',
      price: '250 000 FCFA',
      description: 'Service complet de révision des documents d\'immigration',
    },
    {
      id: 'revision-hourly',
      name: 'Révision des documents (horaire)',
      price: '25 000 FCFA/heure',
      description: 'Révision horaire des documents avec conseils personnalisés',
    },
    {
      id: 'flight',
      name: 'Réservation de vol',
      price: 'À partir de 100 000 FCFA',
      description: 'Assistance pour la réservation de votre vol',
    },
    {
      id: 'visa',
      name: 'Demande de Visa du Cameroun',
      price: '200 000 FCFA',
      description: 'Assistance complète pour la demande de visa',
    },
  ];
  
  export interface Service {
    id: string;
    name: string;
    price: string;
    description: string;
  }