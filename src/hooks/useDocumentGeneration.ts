import { useCallback } from 'react';
import { formatCurrency } from '@/utils/formatters';

export function useDocumentGeneration() {
  const generateDocument = useCallback(async (
    data: any,
    type: 'evaluation' | 'payment',
    format: 'pdf' | 'excel'
  ) => {
    try {
      // Convert data to string format
      const formattedData = Object.entries(data).reduce((acc, [key, value]) => {
        if (typeof value === 'number') {
          return { ...acc, [key]: formatCurrency(value) };
        }
        return { ...acc, [key]: value };
      }, {});

      // Create a Blob with the formatted data
      const blob = new Blob(
        [JSON.stringify(formattedData, null, 2)], 
        { type: 'application/json' }
      );

      return blob;
    } catch (error) {
      console.error(`Error generating ${format.toUpperCase()}:`, error);
      throw error;
    }
  }, []);

  return { generateDocument };
}