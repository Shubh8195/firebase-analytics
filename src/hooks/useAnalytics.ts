import { useCallback } from 'react';
import { 
  trackEvent, 
  trackPageView, 
  trackButtonClick, 
  trackExternalLinkClick,
  EventCategory,
  EventName
} from '../services/analyticsService';

/**
 * Custom hook for tracking analytics events
 */
export const useAnalytics = () => {
  /**
   * Track a custom event
   */
  const logEvent = useCallback((
    eventName: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    eventParams?: Record<string, any>
  ) => {
    trackEvent(eventName, eventParams);
  }, []);

  /**
   * Track a page view
   */
  const logPageView = useCallback((
    pageName: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pageParams?: Record<string, any>
  ) => {
    trackPageView(pageName, pageParams);
  }, []);

  /**
   * Track a button click
   */
  const logButtonClick = useCallback((
    buttonName: string,
    category: EventCategory = EventCategory.Engagement,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    additionalParams?: Record<string, any>
  ) => {
    trackButtonClick(buttonName, category, additionalParams);
  }, []);

  /**
   * Track an external link click
   */
  const logExternalLinkClick = useCallback((
    linkUrl: string,
    linkText: string,
    category: EventCategory = EventCategory.Navigation
  ) => {
    trackExternalLinkClick(linkUrl, linkText, category);
  }, []);

  /**
   * Track user engagement (time on page, scroll depth, etc.)
   */
  const logUserEngagement = useCallback((
    engagementType: string,
    engagementValue: number | string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    additionalParams?: Record<string, any>
  ) => {
    trackEvent('user_engagement', {
      engagement_type: engagementType,
      engagement_value: engagementValue,
      ...additionalParams
    });
  }, []);

  return {
    logEvent,
    logPageView,
    logButtonClick,
    logExternalLinkClick,
    logUserEngagement,
    EventCategory,
    EventName
  };
}; 