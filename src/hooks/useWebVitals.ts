import { useEffect } from 'react';
import { getCLS, getFID, getLCP, getFCP, getTTFB } from 'web-vitals';
import { captureMessage } from '@/lib/sentry';

export function useWebVitals() {
  useEffect(() => {
    const reportWebVital = ({ name, value, id }: { name: string; value: number; id: string }) => {
      // Report to Sentry
      captureMessage(`Web Vital: ${name}`, {
        metric: name,
        value: Math.round(value),
        id,
      });

      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`Web Vital: ${name}`, value);
      }
    };

    getCLS(reportWebVital);
    getFID(reportWebVital);
    getLCP(reportWebVital);
    getFCP(reportWebVital);
    getTTFB(reportWebVital);
  }, []);
}