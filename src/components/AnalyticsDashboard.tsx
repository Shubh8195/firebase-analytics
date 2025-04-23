'use client';

import { useState, useEffect } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';

type AnalyticsEvent = {
  name: string;
  timestamp: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: Record<string, any>;
};

export default function AnalyticsDashboard() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const { logButtonClick, EventCategory } = useAnalytics();

  useEffect(() => {
    // Listen for analytics events logged to console in development
    if (process.env.NODE_ENV === 'development') {
      const originalConsoleLog = console.log;
      
      console.log = function(...args) {
        originalConsoleLog.apply(console, args);
        
        // Check if this is an analytics event log
        if (typeof args[0] === 'string' && args[0].includes('Analytics event tracked:')) {
          const eventName = args[0].split(':')[1]?.trim();
          const params = args[1] || {};
          
          if (eventName) {
            setEvents(prev => [
              {
                name: eventName,
                timestamp: new Date().toISOString(),
                params
              },
              ...prev
            ].slice(0, 20)); // Keep only the last 20 events
          }
        }
      };
      
      return () => {
        console.log = originalConsoleLog;
      };
    }
  }, []);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
    logButtonClick(
      isVisible ? 'hide_analytics_dashboard' : 'show_analytics_dashboard',
      EventCategory.Engagement
    );
  };

  if (!isVisible) {
    return (
      <button 
        onClick={toggleVisibility}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-2 rounded-full shadow-lg z-50"
        title="Show Analytics Dashboard"
      >
        📊
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 w-full md:w-96 h-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-t-lg z-50 overflow-hidden">
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
        <h3 className="font-medium">Analytics Dashboard (Dev Only)</h3>
        <button 
          onClick={toggleVisibility}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          ✖
        </button>
      </div>
      
      <div className="overflow-y-auto h-[calc(100%-45px)] p-3">
        {events.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No events tracked yet</p>
        ) : (
          <div className="space-y-2">
            {events.map((event, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded p-2 text-sm">
                <div className="font-medium">{event.name}</div>
                <div className="text-xs text-gray-500">{new Date(event.timestamp).toLocaleTimeString()}</div>
                <pre className="mt-1 overflow-x-auto text-xs bg-gray-100 dark:bg-gray-900 p-1 rounded">
                  {JSON.stringify(event.params, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 