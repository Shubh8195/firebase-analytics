'use client';

import { useEffect, useState } from 'react';
import { testDbConnection } from '../services/firebaseService';

export default function FirebaseTest() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        setIsLoading(true);
        const connected = await testDbConnection();
        setIsConnected(connected);
      } catch (error) {
        console.error('Firebase connection test failed:', error);
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkConnection();
  }, []);

  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-lg font-bold mb-2">Firebase Connection Test</h2>
      {isLoading ? (
        <p>Testing connection...</p>
      ) : (
        <p>
          Connection status:{' '}
          <span className={isConnected ? 'text-green-500' : 'text-red-500'}>
            {isConnected ? 'Connected' : 'Failed to connect'}
          </span>
        </p>
      )}
      <p className="text-sm mt-2">Check the console for more details.</p>
    </div>
  );
} 