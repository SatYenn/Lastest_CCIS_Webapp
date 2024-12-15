// src/components/admin/AdminEvaluations.tsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import EvaluationDetailsModal from './EvaluationDetailsModal';
import { Evaluation } from '../../types/evaluation';

const AdminEvaluations: React.FC = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const evaluationsCollection = collection(db, 'evaluations');
        const evaluationsSnapshot = await getDocs(evaluationsCollection);
        const evaluationsList = evaluationsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Evaluation[];
        
        setEvaluations(evaluationsList);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch evaluations');
        setLoading(false);
        console.error('Error fetching evaluations:', err);
      }
    };

    fetchEvaluations();
  }, [refreshTrigger]);

  const handleViewDetails = (evaluation: Evaluation) => {
    setSelectedEvaluation(evaluation);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvaluation(null);
  };

  const handleStatusUpdate = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleDelete = async (evaluationId: string) => {
    try {
      await deleteDoc(doc(db, 'evaluations', evaluationId));
      setEvaluations(prevEvaluations => 
        prevEvaluations.filter(evaluation => evaluation.id !== evaluationId)
      );
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting evaluation:', err);
      setError('Failed to delete evaluation');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Program Interest
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Education
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
          {evaluations.map((evaluation) => (
            <tr key={evaluation.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {evaluation.data.personalInfo.firstName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {evaluation.data.personalInfo.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {evaluation.data.immigrationDetails.programInterest.join(', ')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {evaluation.data.education.highestDegree} - {evaluation.data.education.institution}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${evaluation.status === 'completed' ? 'bg-green-100 text-green-800' : 
                    evaluation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'}`}>
                  {evaluation.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                  onClick={() => handleViewDetails(evaluation)}
                >
                  View Details
                </button>
                {showDeleteConfirm === evaluation.id ? (
                  <>
                    <button 
                      className="text-red-600 hover:text-red-900 mr-2"
                      onClick={() => handleDelete(evaluation.id)}
                    >
                      Confirm
                    </button>
                    <button 
                      className="text-gray-600 hover:text-gray-900"
                      onClick={() => setShowDeleteConfirm(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button 
                    className="text-red-600 hover:text-red-900"
                    onClick={() => setShowDeleteConfirm(evaluation.id)}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedEvaluation && (
        <EvaluationDetailsModal
          evaluation={selectedEvaluation}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
};

export default AdminEvaluations;