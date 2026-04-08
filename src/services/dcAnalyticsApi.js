import api from './api';

/**
 * Digital Card Analytics API functions
 */
export const getCardAnalytics = async (cardSlug) => {
  try {
    const response = await api.get(`/api/v1/card/${cardSlug}/analytics`);
    return response.data;
  } catch (error) {
    console.error('Error fetching card analytics:', error);
    throw error;
  }
};

/**
 * Track a view for a digital card analytics
 */

export const trackCardView = async (cardSlug) => {
  try {
    const response = await api.post(`/api/v1/card/${cardSlug}/analytics/view`);
    return response.data;
  } catch (error) {
    console.error('Error tracking card view:', error);
    throw error;
  }
};

/**
 * Track a tap/click for a digital card analytics
 */
export const trackCardTap = async (cardSlug, type) => {
  try {
    const response = await api.post(`/api/v1/card/${cardSlug}/analytics/tap?type=${type}`);
    return response.data;
  } catch (error) {
    console.error('Error tracking card tap:', error);
    throw error;
  }
};

/**
 * Track a social tap/click for a digital card analytics
 */
export const trackCardSocialTap = async (cardSlug, platform) => {
  try {
    const response = await api.post(`/api/v1/card/${cardSlug}/analytics/tap?type=SOCIAL&platform=${platform}`);
    return response.data;
  } catch (error) {
    console.error('Error tracking card social tap:', error);
    throw error;
  }
};
