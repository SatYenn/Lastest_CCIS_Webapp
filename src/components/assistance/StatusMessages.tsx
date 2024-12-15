import React from 'react';

interface StatusMessagesProps {
  error: string | null;
  uploadStatus: string;
}

export const StatusMessages: React.FC<StatusMessagesProps> = ({ error, uploadStatus }) => {
  return (
    <div className="mt-4">
      {error && (
        <div className="text-red-600 bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}
      {uploadStatus && (
        <div className="text-blue-600 bg-blue-50 p-3 rounded-md">
          {uploadStatus}
        </div>
      )}
    </div>
  );
};
