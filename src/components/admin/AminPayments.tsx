import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, updateDoc, doc, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { LoadingSpinner } from '../ui/loading-spinner';
import { Button } from '../ui/button';
import { toast } from '../ui/toast';

interface Payment {
  id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  date: any;
  description: string;
  paymentMethod: string;
  userEmail?: string;
  userName?: string;
  reference: string;
}

const AdminPayments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'failed' | 'refunded'>('all');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const paymentsRef = collection(db, 'payments');
      const paymentsSnapshot = await getDocs(paymentsRef);
      
      // Get all unique user IDs from payments
      const userIds = new Set(paymentsSnapshot.docs.map(doc => doc.data().userId));
      
      // Fetch user details
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(query(usersRef, where('id', 'in', Array.from(userIds))));
      const userDetails = new Map(usersSnapshot.docs.map(doc => [doc.id, doc.data()]));

      const paymentsData = paymentsSnapshot.docs.map(doc => {
        const data = doc.data();
        const user = userDetails.get(data.userId);
        return {
          id: doc.id,
          ...data,
          userName: user ? `${user.firstName} ${user.lastName}` : 'Unknown User',
          userEmail: user?.email || 'No email'
        };
      }) as Payment[];

      // Sort payments by date (most recent first)
      paymentsData.sort((a, b) => b.date.toDate() - a.date.toDate());
      setPayments(paymentsData);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (paymentId: string, newStatus: Payment['status']) => {
    try {
      await updateDoc(doc(db, 'payments', paymentId), {
        status: newStatus,
        updatedAt: new Date()
      });
      toast.success('Payment status updated');
      fetchPayments();
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error('Failed to update payment status');
    }
  };

  const filteredPayments = payments.filter(payment => 
    filter === 'all' ? true : payment.status === filter
  );

  const getTotalAmount = (status: Payment['status'] | 'all') => {
    const relevantPayments = status === 'all' ? payments : payments.filter(p => p.status === status);
    return relevantPayments.reduce((sum, payment) => sum + payment.amount, 0);
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Payment Management</h1>
        <div className="space-x-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'pending' ? 'default' : 'outline'}
            onClick={() => setFilter('pending')}
          >
            Pending
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            onClick={() => setFilter('completed')}
          >
            Completed
          </Button>
          <Button
            variant={filter === 'failed' ? 'default' : 'outline'}
            onClick={() => setFilter('failed')}
          >
            Failed
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard
          title="Total Payments"
          amount={getTotalAmount('all')}
          status="all"
        />
        <SummaryCard
          title="Completed Payments"
          amount={getTotalAmount('completed')}
          status="completed"
        />
        <SummaryCard
          title="Pending Payments"
          amount={getTotalAmount('pending')}
          status="pending"
        />
        <SummaryCard
          title="Failed Payments"
          amount={getTotalAmount('failed')}
          status="failed"
        />
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{payment.userName}</div>
                    <div className="text-sm text-gray-500">{payment.userEmail}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{payment.reference}</div>
                    <div className="text-sm text-gray-500">{payment.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    €{payment.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.date.toDate().toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                      payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                      payment.status === 'refunded' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {payment.status === 'pending' && (
                        <>
                          <Button
                            variant="default"
                            onClick={() => updatePaymentStatus(payment.id, 'completed')}
                          >
                            Mark Completed
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => updatePaymentStatus(payment.id, 'failed')}
                          >
                            Mark Failed
                          </Button>
                        </>
                      )}
                      {payment.status === 'completed' && (
                        <Button
                          variant="outline"
                          onClick={() => updatePaymentStatus(payment.id, 'refunded')}
                        >
                          Refund
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

interface SummaryCardProps {
  title: string;
  amount: number;
  status: 'all' | 'completed' | 'pending' | 'failed';
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, amount, status }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <p className={`text-2xl font-semibold mt-2 ${
      status === 'completed' ? 'text-green-600' :
      status === 'failed' ? 'text-red-600' :
      status === 'pending' ? 'text-yellow-600' :
      'text-blue-600'
    }`}>
      €{amount.toFixed(2)}
    </p>
  </div>
);

export default AdminPayments;