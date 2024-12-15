import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { LoadingSpinner } from '../ui/loading-spinner';
import { Link } from 'react-router-dom';
import { EvaluationStatus } from '../../types/evaluation';

interface DashboardStats {
  totalClients: number;
  pendingDocuments: number;
  activeEvaluations: number;
  unreadMessages: number;
  pendingPayments: number;
  recentActivity: Activity[];
}

interface Activity {
  id: string;
  type: 'document' | 'evaluation' | 'message' | 'payment';
  description: string;
  date: Date;
  status: string;
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    pendingDocuments: 0,
    activeEvaluations: 0,
    unreadMessages: 0,
    pendingPayments: 0,
    recentActivity: []
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch total clients
      const clientsQuery = query(collection(db, 'users'), where('role', '==', 'client'));
      const clientsSnapshot = await getDocs(clientsQuery);
      const totalClients = clientsSnapshot.size;

      // Fetch pending documents
      const docsQuery = query(collection(db, 'documents'), where('status', '==', 'pending'));
      const docsSnapshot = await getDocs(docsQuery);
      const pendingDocuments = docsSnapshot.size;

      // Fetch active evaluations - Using both InProgress and Pending status
      const evalsQuery = query(
        collection(db, 'evaluations'), 
        where('status', 'in', [EvaluationStatus.InProgress, EvaluationStatus.Pending])
      );
      const evalsSnapshot = await getDocs(evalsQuery);
      const activeEvaluations = evalsSnapshot.size;

      // Fetch unread messages
      const msgsQuery = query(collection(db, 'messages'), where('read', '==', false));
      const msgsSnapshot = await getDocs(msgsQuery);
      const unreadMessages = msgsSnapshot.size;

      // Fetch pending payments
      const paymentsQuery = query(collection(db, 'payments'), where('status', '==', 'pending'));
      const paymentsSnapshot = await getDocs(paymentsQuery);
      const pendingPayments = paymentsSnapshot.size;

      // Fetch recent activity - Updated to include evaluation status
      const recentActivity = [
        ...docsSnapshot.docs.map(doc => ({
          id: doc.id,
          type: 'document' as const,
          description: `New document uploaded: ${doc.data().name}`,
          date: doc.data().uploadDate.toDate(),
          status: 'pending'
        })),
        ...evalsSnapshot.docs.map(doc => ({
          id: doc.id,
          type: 'evaluation' as const,
          description: `Evaluation in progress for ${doc.data().userName || 'Client'}`,
          date: doc.data().createdAt.toDate(),
          status: EvaluationStatus.InProgress
        })),
        ...msgsSnapshot.docs.map(doc => ({
          id: doc.id,
          type: 'message' as const,
          description: 'New message received',
          date: doc.data().timestamp.toDate(),
          status: 'unread'
        }))
      ].sort((a, b) => b.date.getTime() - a.date.getTime());

      setStats({
        totalClients,
        pendingDocuments,
        activeEvaluations,
        unreadMessages,
        pendingPayments,
        recentActivity: recentActivity.slice(0, 5) // Only show 5 most recent activities
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tableau de Bord Administrateur</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Clients Total"
          value={stats.totalClients}
          link="/admin/clients"
        />
        <StatCard
          title="Documents en Attente"
          value={stats.pendingDocuments}
          link="/admin/documents"
        />
        <StatCard
          title="Évaluations Actives"
          value={stats.activeEvaluations}
          link="/admin/evaluations"
        />
        <StatCard
          title="Messages Non Lus"
          value={stats.unreadMessages}
          link="/admin/messages"
        />
        <StatCard
          title="Paiements en Attente"
          value={stats.pendingPayments}
          link="/admin/payments"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Activité Récente</h2>
        <div className="space-y-4">
          {stats.recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between border-b pb-4"
            >
              <div>
                <p className="text-sm font-medium">{activity.description}</p>
                <p className="text-xs text-gray-500">
                  {activity.date.toLocaleDateString()} {activity.date.toLocaleTimeString()}
                </p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                activity.status === EvaluationStatus.InProgress ? 'bg-blue-100 text-blue-800' :
                'bg-red-100 text-red-800'
              }`}>
                {activity.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  link: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, link }) => (
  <Link to={link}>
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-3xl font-bold text-blue-600">{value}</p>
    </div>
  </Link>
);
