import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

export default function ClientDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Bienvenue, {user?.firstName} !
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Grid items for different sections */}
            <DashboardItem
              title="Mes Évaluations"
              link="/client/evaluations"
              buttonText="Voir mes évaluations"
            />
            <DashboardItem
              title="Mes Documents"
              link="/client/documents"
              buttonText="Gérer mes documents"
            />
            <DashboardItem
              title="Messages"
              link="/client/messages"
              buttonText="Voir mes messages"
            />
            <DashboardItem
              title="Paiements"
              link="/client/payments"
              buttonText="Historique des paiements"
            />
            <DashboardItem
              title="Statut des Demandes"
              link="/client/applications"
              buttonText="Voir mes demandes"
            />
            <DashboardItem
              title="Nouvelle Évaluation"
              link="/evaluation"
              buttonText="Commencer une évaluation"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface DashboardItemProps {
  title: string;
  link: string;
  buttonText: string;
}

const DashboardItem: React.FC<DashboardItemProps> = ({ title, link, buttonText }) => (
  <div className="bg-gray-50 p-6 rounded-lg">
    <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
    <Link to={link}>
      <Button className="w-full">{buttonText}</Button>
    </Link>
  </div>
);
