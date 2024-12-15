import React from 'react';
import { Evaluation, EvaluationStatus } from '../../types/evaluation';
import { Timestamp, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface EvaluationDetailsModalProps {
  evaluation: Evaluation;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate?: () => void;
}

const EvaluationDetailsModal: React.FC<EvaluationDetailsModalProps> = ({
  evaluation,
  isOpen,
  onClose,
  onStatusUpdate
}) => {
  if (!isOpen || !evaluation) return null;

  const handleStatusChange = async (newStatus: EvaluationStatus) => {
    try {
      const evaluationRef = doc(db, 'evaluations', evaluation.id);
      await updateDoc(evaluationRef, {
        status: newStatus,
        updatedAt: Timestamp.now()
      });
      
      if (onStatusUpdate) {
        onStatusUpdate();
      }
    } catch (error) {
      console.error('Error updating evaluation status:', error);
    }
  };

  const StatusSelector = () => (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
      <h4 className="text-md font-semibold mb-3">Status de l'évaluation</h4>
      <div className="flex gap-2">
        <button
          onClick={() => handleStatusChange(EvaluationStatus.Pending)}
          className={`px-4 py-2 rounded-md ${
            evaluation.status === EvaluationStatus.Pending
              ? 'bg-yellow-500 text-white'
              : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
          }`}
        >
          En attente
        </button>
        <button
          onClick={() => handleStatusChange(EvaluationStatus.Completed)}
          className={`px-4 py-2 rounded-md ${
            evaluation.status === EvaluationStatus.Completed
              ? 'bg-green-500 text-white'
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          Approuvé
        </button>
        <button
          onClick={() => handleStatusChange(EvaluationStatus.Rejected)}
          className={`px-4 py-2 rounded-md ${
            evaluation.status === EvaluationStatus.Rejected
              ? 'bg-red-500 text-white'
              : 'bg-red-100 text-red-700 hover:bg-red-200'
          }`}
        >
          Rejeté
        </button>
      </div>
    </div>
  );

  const formatTimestamp = (timestamp: Timestamp | string | undefined) => {
    if (!timestamp) return 'N/A';
    if (timestamp instanceof Timestamp) {
      return new Date(timestamp.seconds * 1000).toLocaleDateString();
    }
    return new Date(timestamp).toLocaleDateString();
  };

  const formatCurrency = (amount: number | undefined) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF'
    }).format(amount);
  };

  const formatBoolean = (value: boolean | undefined) => {
    return value ? 'Yes' : 'No';
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">Evaluation Details</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
        </div>

        <StatusSelector />

        <div className="mt-4 max-h-[70vh] overflow-y-auto">
          {/* Status and Dates */}
          <section className="mb-6">
            <h4 className="text-md font-semibold mb-2 bg-gray-50 p-2">Status Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p className="capitalize">{evaluation.status}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Created At</p>
                <p>{formatTimestamp(evaluation.createdAt)}</p>
              </div>
            </div>
          </section>

          {/* Personal Information */}
          <section className="mb-6">
            <h4 className="text-md font-semibold mb-2 bg-gray-50 p-2">Personal Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p>{`${evaluation.data.personalInfo.firstName} ${evaluation.data.personalInfo.lastName}`}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p>{evaluation.data.personalInfo.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p>{evaluation.data.personalInfo.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Birth Date</p>
                <p>{formatTimestamp(evaluation.data.personalInfo.birthDate)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Nationality</p>
                <p>{evaluation.data.personalInfo.nationality}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Current Country</p>
                <p>{evaluation.data.personalInfo.currentCountry}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Marital Status</p>
                <p className="capitalize">{evaluation.data.personalInfo.maritalStatus}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Monthly Salary</p>
                <p>{formatCurrency(evaluation.data.personalInfo.monthlySalary)}</p>
              </div>
            </div>
          </section>

          {/* Education */}
          <section className="mb-6">
            <h4 className="text-md font-semibold mb-2 bg-gray-50 p-2">Education</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Highest Degree</p>
                <p>{evaluation.data.education.highestDegree}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Field of Study</p>
                <p>{evaluation.data.education.fieldOfStudy}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Institution</p>
                <p>{evaluation.data.education.institution}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Graduation Year</p>
                <p>{evaluation.data.education.graduationYear}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Language Test Type</p>
                <p>{evaluation.data.education.languageTests.type}</p>
              </div>
              {evaluation.data.education.languageTests.score && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Language Test Score</p>
                  <p>{evaluation.data.education.languageTests.score}</p>
                </div>
              )}
            </div>
          </section>

          {/* Work Experience */}
          <section className="mb-6">
            <h4 className="text-md font-semibold mb-2 bg-gray-50 p-2">Work Experience</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Current Occupation</p>
                <p>{evaluation.data.workExperience.currentOccupation}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Desired Occupation</p>
                <p>{evaluation.data.workExperience.desiredOccupation}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Years of Experience</p>
                <p>{evaluation.data.workExperience.yearsOfExperience}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Employment Status</p>
                <p className="capitalize">{evaluation.data.workExperience.employmentStatus}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Canadian Experience</p>
                <p>{formatBoolean(evaluation.data.workExperience.canadianExperience)}</p>
              </div>
            </div>
          </section>

          {/* Immigration Details */}
          <section className="mb-6">
            <h4 className="text-md font-semibold mb-2 bg-gray-50 p-2">Immigration Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Program Interest</p>
                <p>{evaluation.data.immigrationDetails.programInterest.join(', ')}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Budget</p>
                <p>{formatCurrency(evaluation.data.immigrationDetails.budget as number)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Family Size</p>
                <p>{evaluation.data.immigrationDetails.familySize}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Timeframe</p>
                <p className="capitalize">{evaluation.data.immigrationDetails.timeframe}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Previous Applications</p>
                <p>{formatBoolean(evaluation.data.immigrationDetails.previousApplications)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Previous Refusals</p>
                <p>{formatBoolean(evaluation.data.immigrationDetails.previousRefusals)}</p>
              </div>
            </div>
            {evaluation.data.immigrationDetails.additionalInfo && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500">Additional Information</p>
                <p className="mt-1">{evaluation.data.immigrationDetails.additionalInfo}</p>
              </div>
            )}
          </section>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EvaluationDetailsModal;
