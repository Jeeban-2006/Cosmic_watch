/**
 * EXPLAINABILITY UTILITIES
 * 
 * Purpose: Generate plain-language explanations for NEO metrics and risk factors
 * 
 * Design Principles:
 * - No scientific jargon
 * - Short, clear sentences
 * - Real-world comparisons
 * - Beginner-friendly language
 */

// ============================================================
// METRIC EXPLANATIONS
// ============================================================

/**
 * Explain what velocity means in simple terms
 * @param {number} velocity - Velocity in km/s
 * @returns {string} Plain language explanation
 */
export const explainVelocity = (velocity) => {
  if (velocity > 30) {
    return "This object is moving extremely fast. Higher speed means more impact energy if it were to hit Earth. Think of it like a bullet vs. a baseball—faster objects are more dangerous.";
  } else if (velocity > 25) {
    return "This object is moving quite fast through space. Speed affects how much energy would be released in an impact. Faster = more powerful.";
  } else if (velocity > 20) {
    return "Moving at moderate speed. While not the fastest we track, it still carries significant kinetic energy.";
  } else {
    return "Moving relatively slowly compared to other asteroids. Lower speed means less impact energy.";
  }
};

/**
 * Explain what distance means in simple terms
 * @param {number} distance - Distance in million km
 * @returns {string} Plain language explanation
 */
export const explainDistance = (distance) => {
  // Convert to lunar distances for comparison (1 LD = 0.384 million km)
  const lunarDistances = (distance / 0.384).toFixed(1);
  
  if (distance < 0.1) {
    return `Just ${lunarDistances} times the Moon's distance! This is extremely close in space terms. Objects this near get priority monitoring because small changes in their path could be significant.`;
  } else if (distance < 1) {
    return `About ${lunarDistances} times farther than the Moon. This is considered a close approach. We carefully track objects at this distance to ensure they stay on safe paths.`;
  } else if (distance < 10) {
    return `${lunarDistances} lunar distances away. This is relatively close—closer objects are easier to study but require more careful tracking.`;
  } else if (distance < 50) {
    return `${distance.toFixed(1)} million km away. This is a comfortable distance, but we still monitor it. For context, the Moon is only 0.38 million km from Earth.`;
  } else {
    return `Very far at ${distance.toFixed(1)} million km. Objects this distant pose minimal immediate concern, but we track them to understand their long-term orbits.`;
  }
};

/**
 * Explain what risk level means
 * @param {string} level - Risk level (HIGH, MEDIUM, LOW)
 * @returns {string} Plain language explanation
 */
export const explainRiskLevel = (level) => {
  switch (level) {
    case 'HIGH':
      return "This object requires close monitoring. It's either moving fast, passing nearby, or both. High risk doesn't mean impact is certain—it means we're watching it carefully.";
    case 'MEDIUM':
      return "This object has some concerning factors but isn't immediately threatening. We track it regularly to ensure it stays on a safe path.";
    case 'LOW':
      return "This object is either far away, moving slowly, or both. It poses minimal concern but we still keep tabs on it as part of our comprehensive monitoring program.";
    default:
      return "Risk level is calculated based on distance and speed to help prioritize monitoring efforts.";
  }
};

// ============================================================
// RISK FACTOR EXPLANATIONS
// ============================================================

/**
 * Generate detailed explanation of all risk factors
 * @param {Object} body - Celestial body data
 * @param {Object} riskData - Risk calculation data
 * @returns {Object} Comprehensive explanation with breakdown
 */
export const explainRiskFactors = (body, riskData) => {
  if (!body || !riskData) return null;

  const { velocity, distanceFromEarth, radius } = body;
  const { score, level, factors } = riskData;

  // Calculate individual factor contributions (normalized to 100)
  const velocityContribution = Math.min((velocity / 35) * 100, 100);
  const distanceContribution = Math.min(((20 - distanceFromEarth) / 20) * 100, 100);
  const sizeContribution = radius ? Math.min((radius / 0.5) * 100, 100) : 0;

  // Determine primary factor
  let primaryFactor = 'distance';
  let primaryValue = distanceContribution;
  
  if (velocityContribution > primaryValue) {
    primaryFactor = 'velocity';
    primaryValue = velocityContribution;
  }
  
  if (sizeContribution > primaryValue) {
    primaryFactor = 'size';
    primaryValue = sizeContribution;
  }

  // Generate overall explanation
  let overallExplanation = '';
  
  if (level === 'HIGH') {
    overallExplanation = `${body.name} is classified as HIGH RISK because `;
    
    const highFactors = [];
    if (velocityContribution > 70) highFactors.push('moving very fast');
    if (distanceContribution > 70) highFactors.push('passing quite close');
    if (sizeContribution > 70) highFactors.push('relatively large');
    
    if (highFactors.length > 1) {
      overallExplanation += highFactors.join(' and ') + '. ';
    } else if (highFactors.length === 1) {
      overallExplanation += `it's ${highFactors[0]}. `;
    }
    
    overallExplanation += "This combination of factors means we're monitoring it very closely.";
  } else if (level === 'MEDIUM') {
    overallExplanation = `${body.name} has MEDIUM RISK. While not immediately concerning, it has some factors that warrant regular monitoring. `;
    overallExplanation += `The main concern is ${primaryFactor === 'velocity' ? 'its speed' : primaryFactor === 'distance' ? 'how close it passes' : 'its size'}.`;
  } else {
    overallExplanation = `${body.name} is LOW RISK. `;
    if (distanceFromEarth > 50) {
      overallExplanation += "It's very far away, ";
    }
    if (velocity < 20) {
      overallExplanation += "moving relatively slowly, ";
    }
    overallExplanation += "so it poses minimal concern at this time.";
  }

  // Generate factor-specific explanations
  const factorDetails = {
    velocity: {
      contribution: Math.round(velocityContribution),
      explanation: velocity > 30 
        ? `Very high speed (${velocity.toFixed(1)} km/s). Faster objects carry more kinetic energy, making them more dangerous if they were to collide.`
        : velocity > 25
        ? `High speed (${velocity.toFixed(1)} km/s). This contributes significantly to the overall risk assessment.`
        : velocity > 20
        ? `Moderate speed (${velocity.toFixed(1)} km/s). Not the fastest, but still something we factor into risk calculations.`
        : `Relatively low speed (${velocity.toFixed(1)} km/s). This reduces the overall risk level.`,
      severity: velocityContribution > 70 ? 'high' : velocityContribution > 40 ? 'medium' : 'low',
      icon: '⚡',
      comparison: `That's about ${(velocity * 3600).toFixed(0)} km/hour—much faster than any human-made vehicle!`
    },
    
    distance: {
      contribution: Math.round(distanceContribution),
      explanation: distanceFromEarth < 1
        ? `Very close approach (${distanceFromEarth.toFixed(2)} M km). Objects passing this near get intensive monitoring.`
        : distanceFromEarth < 10
        ? `Close approach (${distanceFromEarth.toFixed(1)} M km). Close enough to warrant careful tracking.`
        : distanceFromEarth < 50
        ? `Moderate distance (${distanceFromEarth.toFixed(1)} M km). Not immediately concerning but still monitored.`
        : `Far away (${distanceFromEarth.toFixed(1)} M km). Distance reduces risk significantly.`,
      severity: distanceContribution > 70 ? 'high' : distanceContribution > 40 ? 'medium' : 'low',
      icon: '📏',
      comparison: `For reference, the Moon is 0.38 M km away—this is ${(distanceFromEarth / 0.384).toFixed(1)}x that distance.`
    },
    
    size: {
      contribution: Math.round(sizeContribution),
      explanation: radius && radius > 0.2
        ? `Large object (${radius.toFixed(2)} km radius). Bigger objects would cause more damage in an impact scenario.`
        : radius && radius > 0.1
        ? `Medium-sized object (${radius.toFixed(2)} km radius). Size is a factor in potential impact effects.`
        : `Small object (${radius ? radius.toFixed(2) : 'unknown'} km radius). Smaller size means less potential damage.`,
      severity: sizeContribution > 70 ? 'high' : sizeContribution > 40 ? 'medium' : 'low',
      icon: '⚫',
      comparison: radius ? `About ${(radius * 1000).toFixed(0)} meters across—${radius > 0.2 ? 'larger than most city blocks' : radius > 0.1 ? 'similar to a large building' : 'similar to a small building'}.` : 'Size data limited.'
    }
  };

  return {
    overall: overallExplanation,
    primaryFactor,
    factors: factorDetails,
    riskScore: Math.round(score),
    riskLevel: level,
    summary: `Risk is primarily driven by ${primaryFactor}. ${level === 'HIGH' ? 'Intensive monitoring in progress.' : level === 'MEDIUM' ? 'Regular monitoring continues.' : 'Standard tracking procedures apply.'}`
  };
};

// ============================================================
// NOTIFICATION EXPLANATIONS
// ============================================================

/**
 * Explain why a notification was triggered
 * @param {Object} alert - Alert notification object
 * @returns {string} Plain language explanation
 */
export const explainNotificationTrigger = (alert) => {
  const { daysUntilApproach, distanceFromEarth, velocity, riskLevel } = alert;
  
  // Build explanation based on multiple factors
  const reasons = [];
  
  if (daysUntilApproach <= 7) {
    reasons.push(`approaching very soon (${daysUntilApproach} day${daysUntilApproach === 1 ? '' : 's'})`);
  } else if (daysUntilApproach <= 14) {
    reasons.push(`approaching within two weeks`);
  } else {
    reasons.push(`approaching within the next month`);
  }
  
  if (distanceFromEarth < 1) {
    const lunarDist = (distanceFromEarth / 0.384).toFixed(1);
    reasons.push(`will pass very close (${lunarDist} lunar distances)`);
  } else if (distanceFromEarth < 5) {
    reasons.push(`will pass relatively close to Earth`);
  }
  
  if (velocity > 30) {
    reasons.push(`moving at high speed (${velocity.toFixed(1)} km/s)`);
  } else if (velocity > 25) {
    reasons.push(`moving at notable speed`);
  }

  let explanation = `Alert triggered because this object is ${reasons.join(' and ')}. `;
  
  if (riskLevel === 'HIGH') {
    explanation += 'The combination of factors warrants close monitoring to ensure public safety.';
  } else if (riskLevel === 'MEDIUM') {
    explanation += 'While not immediately threatening, we track all close approaches carefully.';
  } else {
    explanation += "This is a standard tracking alert—we monitor all nearby passes as part of our comprehensive NEO program.";
  }
  
  return explanation;
};

/**
 * Generate action recommendation based on risk
 * @param {string} riskLevel - Risk level
 * @returns {string} Recommendation text
 */
export const getActionRecommendation = (riskLevel) => {
  switch (riskLevel) {
    case 'HIGH':
      return "Continuous observation and trajectory refinement in progress. Our team is actively monitoring this object.";
    case 'MEDIUM':
      return "Regular monitoring scheduled. We'll update calculations as we gather more observational data.";
    case 'LOW':
      return "Standard tracking procedures apply. This object is part of our routine monitoring catalog.";
    default:
      return "Monitoring status will be updated as new data becomes available.";
  }
};

// ============================================================
// CONTEXTUAL HELPERS
// ============================================================

/**
 * Convert technical units to everyday comparisons
 * @param {string} metric - Metric type
 * @param {number} value - Metric value
 * @returns {string} Everyday comparison
 */
export const getEverydayComparison = (metric, value) => {
  switch (metric) {
    case 'velocity':
      const kmPerHour = (value * 3600).toFixed(0);
      const machSpeed = (value * 3600 / 1234).toFixed(0);
      return `${kmPerHour} km/h (about Mach ${machSpeed})—way faster than any jet!`;
    
    case 'distance':
      const moonDist = (value / 0.384).toFixed(1);
      if (value < 1) {
        return `${moonDist} times the Earth-Moon distance—that's pretty close in space terms!`;
      } else if (value < 10) {
        return `${moonDist} lunar distances—imagine ${moonDist} Moons stacked in a row.`;
      } else {
        const earthDiameters = (value / 0.01276).toFixed(0);
        return `${earthDiameters} Earth diameters away.`;
      }
    
    case 'size':
      const meters = (value * 1000).toFixed(0);
      if (value > 0.3) {
        return `${meters}m across—about the size of a large stadium!`;
      } else if (value > 0.1) {
        return `${meters}m across—similar to a large building or city block.`;
      } else {
        return `${meters}m across—roughly the size of a small building.`;
      }
    
    default:
      return '';
  }
};

/**
 * Get visual indicator color based on contribution level
 * @param {number} contribution - Contribution percentage (0-100)
 * @returns {string} Color hex code
 */
export const getContributionColor = (contribution) => {
  if (contribution >= 70) return '#ff006e'; // High - Magenta
  if (contribution >= 40) return '#ffbe0b'; // Medium - Yellow
  return '#00f0ff'; // Low - Cyan
};

/**
 * Get friendly time description
 * @param {number} days - Days until event
 * @returns {string} Friendly description
 */
export const getFriendlyTimeDescription = (days) => {
  if (days <= 1) return 'TOMORROW';
  if (days <= 3) return 'THIS WEEK';
  if (days <= 7) return 'NEXT WEEK';
  if (days <= 14) return 'IN 2 WEEKS';
  if (days <= 21) return 'IN 3 WEEKS';
  return 'THIS MONTH';
};

// ============================================================
// RISK SUMMARY VERDICT GENERATION
// ============================================================

/**
 * Generate a concise 1-2 line risk summary verdict
 * 
 * Purpose: Provide immediate, plain-language understanding of risk
 * WITHOUT repeating detailed factor analysis (that's in the detailed panel)
 * 
 * This answers: "WHAT does this mean overall?"
 * Not: "WHY is it risky?" (that's the detailed explanation's job)
 * 
 * @param {Object} body - Celestial body data
 * @param {Object} riskData - Risk calculation data from calculateRiskScore()
 * @returns {string} Concise verdict statement
 */
export const generateRiskVerdict = (body, riskData) => {
  if (!body || !riskData) return '';

  const { level, score } = riskData;
  const { velocity, distanceFromEarth, radius, name } = body;

  // Determine primary concern for concise messaging
  const isVeryClose = distanceFromEarth < 1;
  const isVeryFast = velocity > 30;
  const isLarge = radius && radius > 0.2;
  const isSmall = radius && radius < 0.1;

  // Generate verdict based on risk level and primary factors
  if (level === 'HIGH') {
    // High risk verdicts - emphasize the primary concern
    if (isVeryClose && isVeryFast) {
      return `High monitoring priority: passing extremely close at high speed.`;
    } else if (isVeryClose) {
      return `Close approach detected. Enhanced tracking protocols active.`;
    } else if (isVeryFast) {
      return `High velocity object. Continuous observation required.`;
    } else if (isLarge) {
      return `Large object with notable risk factors. Active monitoring ongoing.`;
    } else {
      return `Multiple risk factors warrant intensive monitoring.`;
    }
  } else if (level === 'MEDIUM') {
    // Medium risk verdicts - acknowledge concern but provide reassurance
    if (isVeryClose) {
      return `Close pass despite moderate speed. Regular tracking maintained.`;
    } else if (isVeryFast) {
      return `Fast-moving but at safe distance. Standard monitoring continues.`;
    } else if (isSmall && distanceFromEarth < 10) {
      return `Small object with close approach. Risk remains manageable.`;
    } else {
      return `Some concerning factors present. Routine observation in effect.`;
    }
  } else {
    // Low risk verdicts - emphasize safety
    if (distanceFromEarth > 50) {
      return `Distant object with minimal immediate concern. Long-term tracking only.`;
    } else if (velocity < 20) {
      return `Slow-moving with low risk profile. Standard catalog monitoring.`;
    } else if (isSmall) {
      return `Small size and favorable trajectory. Minimal monitoring required.`;
    } else {
      return `Low risk based on current trajectory. Routine observations continue.`;
    }
  }
};

/**
 * Generate monitoring status message based on risk level
 * Used in verdict card to show what actions are being taken
 * 
 * @param {string} riskLevel - Risk level (HIGH/MEDIUM/LOW)
 * @returns {string} Monitoring status
 */
export const getMonitoringStatus = (riskLevel) => {
  switch (riskLevel) {
    case 'HIGH':
      return '🔴 Intensive monitoring • Frequent observations • Trajectory refinement ongoing';
    case 'MEDIUM':
      return '🟡 Regular monitoring • Periodic observations • Standard tracking protocols';
    case 'LOW':
      return '🟢 Routine monitoring • Catalog maintenance • Long-term orbit tracking';
    default:
      return 'Monitoring status updating...';
  }
};
