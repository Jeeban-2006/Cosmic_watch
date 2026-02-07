import { useState, useEffect, useMemo, useCallback } from 'react';
import { calculateRiskScore } from '../data/celestialData';

/**
 * Custom hook for managing notification and alert system
 * 
 * ALERT DETECTION CRITERIA:
 * 1. Close approach date within next 30 days
 * 2. Distance from Earth below 10 M km (configurable threshold)
 * 3. Object not already dismissed by user
 * 
 * STATE MANAGEMENT:
 * - Tracks unread notifications (badge count)
 * - Marks notifications as read when panel is viewed
 * - Allows dismissing individual notifications
 * - Persists dismissed notifications in localStorage
 * 
 * @param {Array} celestialBodies - All tracked celestial objects
 * @returns {Object} Notification state and control functions
 */
export const useNotifications = (celestialBodies) => {
  // Configuration
  const ALERT_DAYS_THRESHOLD = 30; // Alert for approaches within 30 days
  const ALERT_DISTANCE_THRESHOLD = 10; // Alert if distance < 10 M km
  
  // State
  const [dismissedIds, setDismissedIds] = useState(() => {
    // Load dismissed notifications from localStorage
    const stored = localStorage.getItem('dismissedNotifications');
    return stored ? JSON.parse(stored) : [];
  });
  
  const [hasViewedPanel, setHasViewedPanel] = useState(false);
  const [lastViewedTime, setLastViewedTime] = useState(() => {
    const stored = localStorage.getItem('notificationsLastViewed');
    return stored ? new Date(stored) : null;
  });

  /**
   * Generate alert notifications from celestial bodies
   * Filters for upcoming close approaches and calculates risk
   */
  const alerts = useMemo(() => {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + ALERT_DAYS_THRESHOLD * 24 * 60 * 60 * 1000);
    
    return celestialBodies
      .filter(body => {
        // Must have a close approach date
        if (!body.closeApproachDate) return false;
        
        const approachDate = new Date(body.closeApproachDate);
        
        // Filter criteria:
        // 1. Approach date is in the future
        // 2. Approach date is within next 30 days
        // 3. Distance is below threshold OR velocity is high (backup criteria)
        // 4. Not dismissed by user
        const isFutureDate = approachDate > now;
        const isWithinThirtyDays = approachDate <= thirtyDaysFromNow;
        const isCloseProximity = body.distanceFromEarth < ALERT_DISTANCE_THRESHOLD;
        const isNotDismissed = !dismissedIds.includes(body.id);
        
        return isFutureDate && isWithinThirtyDays && isCloseProximity && isNotDismissed;
      })
      .map(body => {
        const approachDate = new Date(body.closeApproachDate);
        const riskData = calculateRiskScore(body);
        const daysUntilApproach = Math.ceil((approachDate - now) / (1000 * 60 * 60 * 24));
        
        // Determine if notification is "new" (created after last viewed time)
        const isNew = !lastViewedTime || approachDate > lastViewedTime;
        
        return {
          id: `alert-${body.id}`,
          objectId: body.id,
          objectName: body.name,
          closeApproachDate: body.closeApproachDate,
          approachDate: approachDate,
          daysUntilApproach,
          distanceFromEarth: body.distanceFromEarth,
          velocity: body.velocity,
          riskLevel: riskData.level,
          riskScore: riskData.score,
          riskColor: riskData.color,
          color: body.color,
          isNew,
          createdAt: now.toISOString(),
        };
      })
      .sort((a, b) => {
        // Sort by:
        // 1. Risk level (HIGH > MEDIUM > LOW)
        // 2. Days until approach (sooner first)
        const riskOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        const riskDiff = riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
        if (riskDiff !== 0) return riskDiff;
        return a.daysUntilApproach - b.daysUntilApproach;
      });
  }, [celestialBodies, dismissedIds, lastViewedTime]);

  /**
   * Unread notification count (for badge)
   * Shows number of new alerts since last panel view
   */
  const unreadCount = useMemo(() => {
    if (!hasViewedPanel) {
      // If panel never viewed, all alerts are unread
      return alerts.length;
    }
    // Count alerts that are marked as new
    return alerts.filter(alert => alert.isNew).length;
  }, [alerts, hasViewedPanel]);

  /**
   * High-priority alerts (HIGH risk level)
   * Used for urgent notifications or special UI treatment
   */
  const highPriorityAlerts = useMemo(() => {
    return alerts.filter(alert => alert.riskLevel === 'HIGH');
  }, [alerts]);

  /**
   * Mark notifications as viewed
   * Called when notification panel is opened
   */
  const markAsViewed = useCallback(() => {
    const now = new Date();
    setLastViewedTime(now);
    setHasViewedPanel(true);
    localStorage.setItem('notificationsLastViewed', now.toISOString());
  }, []);

  /**
   * Dismiss a specific notification
   * Removes it from the alert list permanently
   */
  const dismissNotification = useCallback((alertId) => {
    // Extract object ID from alert ID
    const objectId = alertId.replace('alert-', '');
    
    setDismissedIds(prev => {
      const updated = [...prev, objectId];
      // Persist to localStorage
      localStorage.setItem('dismissedNotifications', JSON.stringify(updated));
      return updated;
    });
  }, []);

  /**
   * Clear all dismissed notifications
   * Useful for resetting the system
   */
  const clearDismissed = useCallback(() => {
    setDismissedIds([]);
    localStorage.removeItem('dismissedNotifications');
  }, []);

  /**
   * Reset all notification state
   * Clears dismissed list and last viewed time
   */
  const resetNotifications = useCallback(() => {
    setDismissedIds([]);
    setLastViewedTime(null);
    setHasViewedPanel(false);
    localStorage.removeItem('dismissedNotifications');
    localStorage.removeItem('notificationsLastViewed');
  }, []);

  /**
   * Get notification summary statistics
   */
  const stats = useMemo(() => ({
    total: alerts.length,
    unread: unreadCount,
    highPriority: highPriorityAlerts.length,
    mediumPriority: alerts.filter(a => a.riskLevel === 'MEDIUM').length,
    lowPriority: alerts.filter(a => a.riskLevel === 'LOW').length,
    dismissed: dismissedIds.length,
  }), [alerts, unreadCount, highPriorityAlerts, dismissedIds]);

  /**
   * Auto-detect new alerts
   * When new qualifying events appear, increment badge automatically
   */
  useEffect(() => {
    // This effect runs when alerts array changes
    // The unreadCount will automatically update due to useMemo dependency
    if (alerts.length > 0 && highPriorityAlerts.length > 0) {
      // Could trigger sound/notification here if desired
      console.log(`🚨 ${highPriorityAlerts.length} HIGH PRIORITY alerts detected`);
    }
  }, [alerts.length, highPriorityAlerts.length]);

  return {
    // Alert data
    alerts,
    highPriorityAlerts,
    unreadCount,
    
    // Actions
    markAsViewed,
    dismissNotification,
    clearDismissed,
    resetNotifications,
    
    // Statistics
    stats,
    
    // Configuration (exposed for debugging/customization)
    config: {
      daysThreshold: ALERT_DAYS_THRESHOLD,
      distanceThreshold: ALERT_DISTANCE_THRESHOLD,
    },
  };
};
