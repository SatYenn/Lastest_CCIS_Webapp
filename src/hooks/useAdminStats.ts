import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface AdminStats {
  totalClients: number;
  activeProcesses: number;
  unreadMessages: number;
  pendingTasks: number;
  recentActivities: Array<{
    id: string;
    type: string;
    userId: string;
    userName: string;
    action: string;
    timestamp: Date;
    details: string;
  }>;
  monthlyStats: {
    applications: number;
    approvals: number;
    rejections: number;
    revenue: number;
  };
}

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total clients
        const clientsQuery = query(
          collection(db, 'users'),
          where('role', '==', 'client')
        );
        const clientsSnapshot = await getDocs(clientsQuery);
        const totalClients = clientsSnapshot.size;

        // Get active processes
        const processesQuery = query(
          collection(db, 'procedures'),
          where('status', 'in', ['submitted', 'reviewing', 'processing'])
        );
        const processesSnapshot = await getDocs(processesQuery);
        const activeProcesses = processesSnapshot.size;

        // Get unread messages
        const messagesQuery = query(
          collection(db, 'messages'),
          where('read', '==', false)
        );
        const messagesSnapshot = await getDocs(messagesQuery);
        const unreadMessages = messagesSnapshot.size;

        // Get pending tasks
        const tasksQuery = query(
          collection(db, 'tasks'),
          where('status', '==', 'pending')
        );
        const tasksSnapshot = await getDocs(tasksQuery);
        const pendingTasks = tasksSnapshot.size;

        // Get recent activities
        const activitiesQuery = query(
          collection(db, 'activities'),
          orderBy('timestamp', 'desc'),
          limit(10)
        );
        const activitiesSnapshot = await getDocs(activitiesQuery);
        const recentActivities = activitiesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp.toDate(),
        }));

        // Calculate monthly stats
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const monthlyAppsQuery = query(
          collection(db, 'procedures'),
          where('submittedAt', '>=', startOfMonth)
        );
        const monthlyAppsSnapshot = await getDocs(monthlyAppsQuery);
        
        const monthlyStats = monthlyAppsSnapshot.docs.reduce((acc, doc) => {
          const data = doc.data();
          return {
            applications: acc.applications + 1, <boltAction type="file" filePath="src/hooks/useAdminStats.ts">            approvals: data.status === 'approved' ? acc.approvals + 1 : acc.approvals,
            rejections: data.status === 'rejected' ? acc.rejections + 1 : acc.rejections,
            revenue: data.payment?.amount ? acc.revenue + data.payment.amount : acc.revenue,
          };
        }, {
          applications: 0,
          approvals: 0,
          rejections: 0,
          revenue: 0,
        });

        setStats({
          totalClients,
          activeProcesses,
          unreadMessages,
          pendingTasks,
          recentActivities,
          monthlyStats,
        });
      } catch (err) {
        console.error('Error fetching admin stats:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return {
    stats,
    isLoading,
    error,
  };
}