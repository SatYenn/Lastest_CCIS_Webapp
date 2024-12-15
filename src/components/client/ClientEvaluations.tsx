import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, Timestamp, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { format } from 'date-fns';
import { LoadingSpinner } from '../ui/loading-spinner';

interface EvaluationData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  submissionDate: Timestamp;
  status: 'pending' | 'reviewed' | 'completed';
  details: {
    personalInfo: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      birthDate: Timestamp;
      nationality: string;
      currentCountry: string;
      maritalStatus: string;
      monthlySalary: number;
    };
    education: {
      highestDegree: string;
      fieldOfStudy: string;
      institution: string;
      graduationYear: string;
      languageTests: {
        type: string;
        score?: string;
      };
    };
    workExperience: {
      currentOccupation: string;
      desiredOccupation: string;
      yearsOfExperience: number;
      employmentStatus: string;
      canadianExperience: boolean;
    };
    immigrationDetails: {
      programInterest: string[];
      budget: number;
      familySize: number;
      timeframe: string;
      previousApplications: boolean;
      previousRefusals: boolean;
      additionalInfo?: string;
    };
  };
}

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


const ClientEvaluations: React.FC = () => {
  const [evaluations, setEvaluations] = useState<EvaluationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvaluation, setSelectedEvaluation] = useState<EvaluationData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvaluation, setEditedEvaluation] = useState<EvaluationData | null>(null);

  const fetchEvaluations = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      const evaluationsRef = collection(db, 'evaluations');
      const q = query(evaluationsRef, where('data.personalInfo.email', '==', user.email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('No evaluations found');
        setLoading(false);
        return;
      }

      const evaluationData = querySnapshot.docs.map(doc => {
        const docData = doc.data();
        return {
          id: doc.id,
          firstName: docData.data.personalInfo.firstName,
          lastName: docData.data.personalInfo.lastName,
          email: docData.data.personalInfo.email,
          phone: docData.data.personalInfo.phone,
          submissionDate: docData.updatedAt,
          status: docData.status,
          details: docData.data
        };
      }) as EvaluationData[];

      setEvaluations(evaluationData);
      setError(null);
    } catch (err) {
      console.error('Error fetching evaluations:', err);
      setError('Unable to load your evaluations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvaluations();
  }, []);

  const handleViewDetails = (evaluation: EvaluationData) => {
    setSelectedEvaluation(evaluation);
  };

  const handleCloseDetails = () => {
    setSelectedEvaluation(null);
  };

  const handleEditClick = () => {
    if (selectedEvaluation) {
      setEditedEvaluation({...selectedEvaluation});
      setIsEditing(true);
    }
  };

  const handleSaveChanges = async () => {
    if (!editedEvaluation) return;
    
    try {
      const evaluationRef = doc(db, 'evaluations', editedEvaluation.id);
      await updateDoc(evaluationRef, {
        data: editedEvaluation.details,
        updatedAt: Timestamp.now()
      });
      
      setSelectedEvaluation(editedEvaluation);
      setIsEditing(false);
      await fetchEvaluations();
    } catch (error) {
      console.error('Error updating evaluation:', error);
      setError('Failed to update evaluation');
    }
  };

  const handleCancelEdit = () => {
    setEditedEvaluation(null);
    setIsEditing(false);
  };

  const handleInputChange = (section: keyof EvaluationData['details'], field: string, value: any) => {
    if (!editedEvaluation) return;

    setEditedEvaluation({
      ...editedEvaluation,
      details: {
        ...editedEvaluation.details,
        [section]: {
          ...editedEvaluation.details[section],
          [field]: value
        }
      }
    });
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[400px]">
      <LoadingSpinner size="lg" />
    </div>
  );
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">My Immigration Evaluations</h2>
      
      {evaluations.length === 0 ? (
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <p>No evaluations found. Please complete an evaluation form to get started.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {evaluations.map((evaluation) => (
            <div key={evaluation.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">
                    {evaluation.firstName} {evaluation.lastName}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Submitted: {format(evaluation.submissionDate.toDate(), 'PPP')}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    evaluation.status === 'completed' ? 'bg-green-100 text-green-800' :
                    evaluation.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {evaluation.status}
                  </span>
                  <button
                    onClick={() => handleViewDetails(evaluation)}
                    className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedEvaluation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">Evaluation Details</h3>
              <button onClick={handleCloseDetails} className="text-gray-500 hover:text-gray-700">×</button>
            </div>

            <div className="mt-4 max-h-[70vh] overflow-y-auto">
              {/* Status and Dates */}
              <section className="mb-6">
                <h4 className="text-md font-semibold mb-2 bg-gray-50 p-2">Status Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <p className="capitalize">{selectedEvaluation.status}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Created At</p>
                    <p>{formatTimestamp(selectedEvaluation.submissionDate)}</p>
                  </div>
                </div>
              </section>

              {/* Personal Information */}
              <section className="mb-6">
                <h4 className="text-md font-semibold mb-2 bg-gray-50 p-2">Personal Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">First Name</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedEvaluation?.details.personalInfo.firstName || ''}
                        onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    ) : (
                      <p>{selectedEvaluation.details.personalInfo.firstName}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Last Name</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedEvaluation?.details.personalInfo.lastName || ''}
                        onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    ) : (
                      <p>{selectedEvaluation.details.personalInfo.lastName}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedEvaluation?.details.personalInfo.email || ''}
                        onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    ) : (
                      <p>{selectedEvaluation.details.personalInfo.email}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedEvaluation?.details.personalInfo.phone || ''}
                        onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    ) : (
                      <p>{selectedEvaluation.details.personalInfo.phone}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Birth Date</p>
                    <p>{formatTimestamp(selectedEvaluation.details.personalInfo.birthDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Nationality</p>
                    <p>{selectedEvaluation.details.personalInfo.nationality}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Current Country</p>
                    <p>{selectedEvaluation.details.personalInfo.currentCountry}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Marital Status</p>
                    <p className="capitalize">{selectedEvaluation.details.personalInfo.maritalStatus}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Monthly Salary</p>
                    <p>{formatCurrency(selectedEvaluation.details.personalInfo.monthlySalary)}</p>
                  </div>
                </div>
              </section>

              {/* Education Section */}
              <section className="mb-6">
                <h4 className="text-md font-semibold mb-2 bg-gray-50 p-2">Education</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Highest Degree</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedEvaluation?.details.education.highestDegree || ''}
                        onChange={(e) => handleInputChange('education', 'highestDegree', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    ) : (
                      <p>{selectedEvaluation.details.education.highestDegree}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Field of Study</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedEvaluation?.details.education.fieldOfStudy || ''}
                        onChange={(e) => handleInputChange('education', 'fieldOfStudy', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    ) : (
                      <p>{selectedEvaluation.details.education.fieldOfStudy}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Institution</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedEvaluation?.details.education.institution || ''}
                        onChange={(e) => handleInputChange('education', 'institution', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    ) : (
                      <p>{selectedEvaluation.details.education.institution}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Graduation Year</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedEvaluation?.details.education.graduationYear || ''}
                        onChange={(e) => handleInputChange('education', 'graduationYear', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    ) : (
                      <p>{selectedEvaluation.details.education.graduationYear}</p>
                    )}
                  </div>
                </div>
              </section>

              {/* Work Experience Section */}
              <section className="mb-6">
                <h4 className="text-md font-semibold mb-2 bg-gray-50 p-2">Work Experience</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Current Occupation</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedEvaluation?.details.workExperience.currentOccupation || ''}
                        onChange={(e) => handleInputChange('workExperience', 'currentOccupation', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    ) : (
                      <p>{selectedEvaluation.details.workExperience.currentOccupation}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Desired Occupation</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedEvaluation?.details.workExperience.desiredOccupation || ''}
                        onChange={(e) => handleInputChange('workExperience', 'desiredOccupation', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    ) : (
                      <p>{selectedEvaluation.details.workExperience.desiredOccupation}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Years of Experience</p>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editedEvaluation?.details.workExperience.yearsOfExperience || ''}
                        onChange={(e) => handleInputChange('workExperience', 'yearsOfExperience', parseInt(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    ) : (
                      <p>{selectedEvaluation.details.workExperience.yearsOfExperience}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Employment Status</p>
                    {isEditing ? (
                      <select
                        value={editedEvaluation?.details.workExperience.employmentStatus || ''}
                        onChange={(e) => handleInputChange('workExperience', 'employmentStatus', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="employed">Employed</option>
                        <option value="unemployed">Unemployed</option>
                        <option value="self-employed">Self-employed</option>
                        <option value="student">Student</option>
                      </select>
                    ) : (
                      <p className="capitalize">{selectedEvaluation.details.workExperience.employmentStatus}</p>
                    )}
                  </div>
                </div>
              </section>

              {/* Immigration Details Section */}
              <section className="mb-6">
                <h4 className="text-md font-semibold mb-2 bg-gray-50 p-2">Immigration Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Budget</p>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editedEvaluation?.details.immigrationDetails.budget || ''}
                        onChange={(e) => handleInputChange('immigrationDetails', 'budget', parseInt(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    ) : (
                      <p>{formatCurrency(selectedEvaluation.details.immigrationDetails.budget)}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Family Size</p>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editedEvaluation?.details.immigrationDetails.familySize || ''}
                        onChange={(e) => handleInputChange('immigrationDetails', 'familySize', parseInt(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    ) : (
                      <p>{selectedEvaluation.details.immigrationDetails.familySize}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Timeframe</p>
                    {isEditing ? (
                      <select
                        value={editedEvaluation?.details.immigrationDetails.timeframe || ''}
                        onChange={(e) => handleInputChange('immigrationDetails', 'timeframe', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="immediate">Immediate</option>
                        <option value="6months">6 Months</option>
                        <option value="1year">1 Year</option>
                        <option value="2years">2 Years</option>
                      </select>
                    ) : (
                      <p className="capitalize">{selectedEvaluation.details.immigrationDetails.timeframe}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Additional Information</p>
                    {isEditing ? (
                      <textarea
                        value={editedEvaluation?.details.immigrationDetails.additionalInfo || ''}
                        onChange={(e) => handleInputChange('immigrationDetails', 'additionalInfo', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        rows={3}
                      />
                    ) : (
                      <p>{selectedEvaluation.details.immigrationDetails.additionalInfo}</p>
                    )}
                  </div>
                </div>
              </section>
            </div>
            <div className="mt-4 flex justify-end space-x-4">
  {!isEditing ? (
    <>
      <button
        onClick={handleEditClick}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Edit
      </button>
      <button
        onClick={handleCloseDetails}
        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
      >
        Close
      </button>
    </>
  ) : (
    <>
      <button
        onClick={handleSaveChanges}
        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
      >
        Save Changes
      </button>
      <button
        onClick={handleCancelEdit}
        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
      >
        Cancel
      </button>
    </>
  )}
</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientEvaluations;