'use client';

import { ReactNode, useEffect } from 'react';
import { trackPageView, trackExternalLinkClick, EventCategory } from '../services/analyticsService';

interface AnalyticsWrapperProps {
  children: ReactNode;
  pageName: string;
}

export default function AnalyticsWrapper({ children, pageName }: AnalyticsWrapperProps) {
  useEffect(() => {
    // Track page view when component mounts
    trackPageView(pageName);
    
    // Set up listeners for elements with data-analytics-id
    const handleClickWithAnalytics = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const analyticsElement = target.closest('[data-analytics-id]') as HTMLElement;
      
      if (analyticsElement) {
        const analyticsId = analyticsElement.getAttribute('data-analytics-id');
        
        // For links, track as external link clicks
        if (analyticsElement.tagName === 'A' && analyticsElement.getAttribute('href')) {
          const linkUrl = analyticsElement.getAttribute('href') || '';
          const linkText = analyticsElement.innerText || analyticsId || 'unknown';
          
          // Check if it's an external link
          if (linkUrl.startsWith('http') || linkUrl.startsWith('//')) {
            trackExternalLinkClick(linkUrl, linkText);
          }
        }
      }
    };
    
    document.addEventListener('click', handleClickWithAnalytics);
    
    // Cleanup function
    return () => {
      document.removeEventListener('click', handleClickWithAnalytics);
    };
  }, [pageName]);
  
  return <>{children}</>;
} 