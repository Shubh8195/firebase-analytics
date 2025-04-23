import { analytics } from '../config/firebase';
import { logEvent, EventParams } from 'firebase/analytics';

// Event categories
export enum EventCategory {
  Engagement = 'engagement',
  Navigation = 'navigation',
  User = 'user',
  Content = 'content',
  Conversion = 'conversion',
}

// Event names
export enum EventName {
  PageView = 'page_view',
  ButtonClick = 'button_click',
  ExternalLinkClick = 'external_link_click',
  SearchQuery = 'search_query',
  Login = 'login',
  Signup = 'signup',
  ContentView = 'content_view',
  FormSubmit = 'form_submit',
  Error = 'error',
}

/**
 * Track a Firebase Analytics event
 */
export const trackEvent = (
  eventName: string, 
  eventParams?: EventParams
): void => {
  try {
    if (analytics) {
      logEvent(analytics, eventName, eventParams);
      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`Analytics event tracked: ${eventName}`, eventParams);
      }
    }
  } catch (error) {
    console.error('Error tracking analytics event:', error);
  }
};

/**
 * Track a page view event
 */
export const trackPageView = (
  pageName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pageParams?: Record<string, any>
): void => {
  trackEvent(EventName.PageView, {
    page_title: pageName,
    page_location: typeof window !== 'undefined' ? window.location.href : '',
    page_path: typeof window !== 'undefined' ? window.location.pathname : '',
    ...pageParams,
  });
};

/**
 * Track a button click event
 */
export const trackButtonClick = (
  buttonName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  category: EventCategory = EventCategory.Engagement,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  additionalParams?: Record<string, any>
): void => {
  trackEvent(EventName.ButtonClick, {
    button_name: buttonName,
    category,
    ...additionalParams,
  });
};

/**
 * Track an external link click
 */
export const trackExternalLinkClick = (
  linkUrl: string,
  linkText: string,
  category: EventCategory = EventCategory.Navigation,
): void => {
  trackEvent(EventName.ExternalLinkClick, {
    link_url: linkUrl,
    link_text: linkText,
    category,
  });
}; 