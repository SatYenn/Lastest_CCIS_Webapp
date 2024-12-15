import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { captureException } from '@/lib/sentry';

interface AuditLogEntry {
  userId: string;
  action: string;
  details?: Record<string, any>;
  timestamp?: Date;
}

export function useAuditLog() {
  const logAction = async ({ userId, action, details }: AuditLogEntry) => {
    try {
      await addDoc(collection(db, 'audit_logs'), {
        userId,
        action,
        details,
        timestamp: serverTimestamp(),
        userAgent: window.navigator.userAgent,
        ip: await fetch('https://api.ipify.org?format=json').then(r => r.json()).then(data => data.ip),
      });
    } catch (error) {
      console.error('Failed to create audit log:', error);
      captureException(error as Error, { userId, action });
    }
  };

  return { logAction };
}