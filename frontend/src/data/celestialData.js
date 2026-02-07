// Asteroid tracking data
export const celestialBodies = [
  {
    id: 'asteroid-bennu',
    name: 'Bennu (101955)',
    distance: 168.2,
    distanceFromEarth: 18.6,
    velocity: 27.7,
    radius: 0.12,
    color: '#8B8680',
    orbitRadius: 5,
    orbitSpeed: 0.028,
    rotationSpeed: 0.06,
    closeApproachDate: '2026-02-15',
  },
  {
    id: 'asteroid-apophis',
    name: 'Apophis (99942)',
    distance: 147.1,
    distanceFromEarth: 0.31,
    velocity: 30.7,
    radius: 0.08,
    color: '#A89F91',
    orbitRadius: 4.2,
    orbitSpeed: 0.032,
    rotationSpeed: 0.055,
    closeApproachDate: '2026-03-01',
  },
  {
    id: 'asteroid-ryugu',
    name: 'Ryugu (162173)',
    distance: 189.3,
    distanceFromEarth: 39.7,
    velocity: 24.4,
    radius: 0.11,
    color: '#6E6A5B',
    orbitRadius: 6.5,
    orbitSpeed: 0.024,
    rotationSpeed: 0.05,
    closeApproachDate: '2026-03-20',
  },
  {
    id: 'asteroid-eros',
    name: 'Eros (433)',
    distance: 218.1,
    distanceFromEarth: 68.5,
    velocity: 24.36,
    radius: 0.17,
    color: '#9D9081',
    orbitRadius: 8,
    orbitSpeed: 0.021,
    rotationSpeed: 0.048,
    closeApproachDate: '2026-04-10',
  },
  {
    id: 'asteroid-itokawa',
    name: 'Itokawa (25143)',
    distance: 143.5,
    distanceFromEarth: 0.52,
    velocity: 31.2,
    radius: 0.06,
    color: '#B5ADA3',
    orbitRadius: 3.8,
    orbitSpeed: 0.034,
    rotationSpeed: 0.062,
    closeApproachDate: '2026-02-28',
  },
  {
    id: 'asteroid-vesta',
    name: 'Vesta (4)',
    distance: 353.4,
    distanceFromEarth: 203.8,
    velocity: 19.34,
    radius: 0.28,
    color: '#C4BDB2',
    orbitRadius: 11,
    orbitSpeed: 0.015,
    rotationSpeed: 0.04,
    closeApproachDate: '2026-05-15',
  },
  {
    id: 'asteroid-didymos',
    name: 'Didymos (65803)',
    distance: 195.5,
    distanceFromEarth: 45.9,
    velocity: 23.3,
    radius: 0.09,
    color: '#7D7568',
    orbitRadius: 7.2,
    orbitSpeed: 0.026,
    rotationSpeed: 0.058,
    closeApproachDate: '2026-04-05',
  },
  {
    id: 'asteroid-psyche',
    name: 'Psyche (16)',
    distance: 378.6,
    distanceFromEarth: 229.0,
    velocity: 18.95,
    radius: 0.25,
    color: '#998B7D',
    orbitRadius: 12.5,
    orbitSpeed: 0.014,
    rotationSpeed: 0.037,
    closeApproachDate: '2026-06-01',
  },
  {
    id: 'asteroid-pallas',
    name: 'Pallas (2)',
    distance: 414.5,
    distanceFromEarth: 264.9,
    velocity: 17.65,
    radius: 0.27,
    color: '#ACA59A',
    orbitRadius: 14,
    orbitSpeed: 0.012,
    rotationSpeed: 0.035,
    closeApproachDate: '2026-06-20',
  },
  {
    id: 'asteroid-ceres',
    name: 'Ceres (1)',
    distance: 413.7,
    distanceFromEarth: 264.1,
    velocity: 17.88,
    radius: 0.3,
    color: '#D4CFC7',
    orbitRadius: 13.8,
    orbitSpeed: 0.013,
    rotationSpeed: 0.04,
    closeApproachDate: '2026-06-25',
  },
  {
    id: 'asteroid-2023xy',
    name: 'Asteroid 2023 XY',
    distance: 155.2,
    distanceFromEarth: 5.6,
    velocity: 29.4,
    radius: 0.07,
    color: '#8F8679',
    orbitRadius: 4.5,
    orbitSpeed: 0.03,
    rotationSpeed: 0.065,
    closeApproachDate: '2026-02-20',
  },
  {
    id: 'asteroid-2024ab',
    name: 'Asteroid 2024 AB',
    distance: 172.8,
    distanceFromEarth: 23.2,
    velocity: 26.8,
    radius: 0.13,
    color: '#A39A8D',
    orbitRadius: 5.8,
    orbitSpeed: 0.027,
    rotationSpeed: 0.052,
    closeApproachDate: '2026-03-10',
  },
];

// Convert distance units
export const convertDistance = (km, unit) => {
  const conversions = {
    km: 1,
    LD: 384400, // Lunar Distance
    AU: 149597870.7, // Astronomical Unit
  };
  
  return (km * 1000000) / conversions[unit];
};

// Get bodies within distance range
export const filterByDistance = (bodies, maxDistance, unit) => {
  const maxDistanceKm = (maxDistance * (unit === 'LD' ? 384400 : unit === 'AU' ? 149597870.7 : 1000000)) / 1000000;
  return bodies.filter(body => body.distanceFromEarth <= maxDistanceKm);
};

// Sort by proximity to Earth
export const sortByProximity = (bodies) => {
  return [...bodies].sort((a, b) => a.distanceFromEarth - b.distanceFromEarth);
};

// Get upcoming close approaches
export const getUpcomingApproaches = (bodies) => {
  const now = new Date();
  return bodies
    .filter(body => body.closeApproachDate)
    .map(body => ({
      ...body,
      approachDate: new Date(body.closeApproachDate),
    }))
    .filter(body => body.approachDate > now)
    .sort((a, b) => a.approachDate - b.approachDate);
};

// Animate number counter
export const animateValue = (start, end, duration, callback) => {
  const startTime = performance.now();
  
  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = start + (end - start) * easeOutQuart;
    
    callback(current);
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };
  
  requestAnimationFrame(animate);
};

// ========================================
// RISK ANALYSIS SYSTEM
// ========================================

/**
 * Calculate comprehensive risk assessment for a celestial body
 * 
 * RISK FACTORS:
 * 1. Distance from Earth (proximity risk)
 * 2. Velocity (kinetic energy risk)
 * 3. Estimated diameter/radius (impact potential)
 * 
 * SCORING LOGIC (Transparent & Rule-Based):
 * - Distance Score (0-40 points):
 *   * < 0.5 M km  → 40 pts (CRITICAL - Very close approach)
 *   * 0.5-5 M km  → 30 pts (HIGH - Close monitoring required)
 *   * 5-50 M km   → 20 pts (MEDIUM - Standard tracking)
 *   * > 50 M km   → 10 pts (LOW - Distant object)
 * 
 * - Velocity Score (0-35 points):
 *   * > 35 km/s   → 35 pts (CRITICAL - Extremely fast)
 *   * 30-35 km/s  → 25 pts (HIGH - Fast approach)
 *   * 25-30 km/s  → 15 pts (MEDIUM - Moderate speed)
 *   * < 25 km/s   → 5 pts  (LOW - Slow approach)
 * 
 * - Size Score (0-25 points):
 *   * > 0.25 (250m) → 25 pts (LARGE - Significant damage potential)
 *   * 0.15-0.25     → 18 pts (MEDIUM - Regional impact)
 *   * 0.08-0.15     → 10 pts (SMALL - Local impact)
 *   * < 0.08        → 5 pts  (TINY - Minimal threat)
 * 
 * TOTAL SCORE: 0-100 points
 * CATEGORIES:
 * - 0-30:   LOW RISK (Green)
 * - 31-65:  MEDIUM RISK (Yellow)
 * - 66-100: HIGH RISK (Red)
 * 
 * @param {Object} body - Celestial body with distanceFromEarth, velocity, radius
 * @returns {Object} Risk assessment with score, level, color, and detailed explanation
 */
export const calculateRiskScore = (body) => {
  if (!body) {
    return {
      score: 0,
      level: 'LOW',
      color: '#00f0ff',
      explanation: 'No object selected',
      factors: []
    };
  }

  let score = 0;
  const factors = [];

  // ========================================
  // FACTOR 1: DISTANCE RISK (0-40 points)
  // ========================================
  let distanceScore = 0;
  let distanceExplanation = '';
  
  if (body.distanceFromEarth < 0.5) {
    distanceScore = 40;
    distanceExplanation = `CRITICAL proximity at ${body.distanceFromEarth.toFixed(2)} M km - Extremely close approach requiring immediate attention`;
  } else if (body.distanceFromEarth < 5) {
    distanceScore = 30;
    distanceExplanation = `HIGH proximity at ${body.distanceFromEarth.toFixed(2)} M km - Close monitoring zone, potential near-miss`;
  } else if (body.distanceFromEarth < 50) {
    distanceScore = 20;
    distanceExplanation = `MEDIUM proximity at ${body.distanceFromEarth.toFixed(2)} M km - Standard tracking distance`;
  } else {
    distanceScore = 10;
    distanceExplanation = `LOW proximity at ${body.distanceFromEarth.toFixed(2)} M km - Distant object, minimal immediate concern`;
  }
  
  score += distanceScore;
  factors.push({
    name: 'Distance',
    score: distanceScore,
    max: 40,
    percentage: (distanceScore / 40) * 100,
    explanation: distanceExplanation
  });

  // ========================================
  // FACTOR 2: VELOCITY RISK (0-35 points)
  // ========================================
  let velocityScore = 0;
  let velocityExplanation = '';
  
  if (body.velocity > 35) {
    velocityScore = 35;
    velocityExplanation = `CRITICAL velocity at ${body.velocity.toFixed(1)} km/s - Extremely fast approach increases impact energy exponentially (KE = ½mv²)`;
  } else if (body.velocity > 30) {
    velocityScore = 25;
    velocityExplanation = `HIGH velocity at ${body.velocity.toFixed(1)} km/s - Fast approach significantly increases kinetic energy and damage potential`;
  } else if (body.velocity > 25) {
    velocityScore = 15;
    velocityExplanation = `MEDIUM velocity at ${body.velocity.toFixed(1)} km/s - Moderate speed within typical asteroid range`;
  } else {
    velocityScore = 5;
    velocityExplanation = `LOW velocity at ${body.velocity.toFixed(1)} km/s - Relatively slow approach reduces impact energy`;
  }
  
  score += velocityScore;
  factors.push({
    name: 'Velocity',
    score: velocityScore,
    max: 35,
    percentage: (velocityScore / 35) * 100,
    explanation: velocityExplanation
  });

  // ========================================
  // FACTOR 3: SIZE RISK (0-25 points)
  // ========================================
  let sizeScore = 0;
  let sizeExplanation = '';
  const estimatedDiameter = body.radius * 2; // Convert radius to diameter
  
  if (estimatedDiameter > 0.25) {
    sizeScore = 25;
    sizeExplanation = `LARGE object (~${(estimatedDiameter * 1000).toFixed(0)}m diameter) - City-scale destruction potential, mass extinction risk`;
  } else if (estimatedDiameter > 0.15) {
    sizeScore = 18;
    sizeExplanation = `MEDIUM object (~${(estimatedDiameter * 1000).toFixed(0)}m diameter) - Regional impact potential, Tunguska-scale event`;
  } else if (estimatedDiameter > 0.08) {
    sizeScore = 10;
    sizeExplanation = `SMALL object (~${(estimatedDiameter * 1000).toFixed(0)}m diameter) - Local impact, most would burn up in atmosphere`;
  } else {
    sizeScore = 5;
    sizeExplanation = `TINY object (~${(estimatedDiameter * 1000).toFixed(0)}m diameter) - Minimal threat, likely to disintegrate on entry`;
  }
  
  score += sizeScore;
  factors.push({
    name: 'Size',
    score: sizeScore,
    max: 25,
    percentage: (sizeScore / 25) * 100,
    explanation: sizeExplanation
  });

  // ========================================
  // DETERMINE RISK LEVEL & COLOR
  // ========================================
  let level, color, overallExplanation;
  
  if (score >= 66) {
    level = 'HIGH';
    color = '#ff006e';
    overallExplanation = '⚠️ HIGH RISK: This object requires immediate monitoring and potential deflection planning. Combination of close proximity, high velocity, and/or significant size creates substantial threat.';
  } else if (score >= 31) {
    level = 'MEDIUM';
    color = '#ffbe0b';
    overallExplanation = '⚡ MEDIUM RISK: This object warrants continued observation and tracking. While not immediately threatening, certain factors elevate it above routine monitoring.';
  } else {
    level = 'LOW';
    color = '#00f0ff';
    overallExplanation = '✓ LOW RISK: This object poses minimal threat based on current trajectory and characteristics. Standard monitoring protocols apply.';
  }

  return {
    score: Math.round(score),
    level,
    color,
    explanation: overallExplanation,
    factors,
    details: {
      distance: body.distanceFromEarth,
      velocity: body.velocity,
      diameter: estimatedDiameter,
      impactEnergy: calculateImpactEnergy(body.radius, body.velocity)
    }
  };
};

/**
 * Calculate estimated impact energy (simplified)
 * Energy = 0.5 × mass × velocity²
 * 
 * Assumptions:
 * - Average asteroid density: 2.5 g/cm³
 * - Volume = (4/3)πr³ (sphere approximation)
 * 
 * @returns {string} Energy in megatons TNT equivalent
 */
const calculateImpactEnergy = (radius, velocity) => {
  // Convert radius from visual units to km, then to meters
  const radiusMeters = (radius / 8) * 1000; // Undo our 8x visual scale
  const volumeCubicMeters = (4/3) * Math.PI * Math.pow(radiusMeters, 3);
  const densityKgPerCubicMeter = 2500; // 2.5 g/cm³
  const massKg = volumeCubicMeters * densityKgPerCubicMeter;
  
  const velocityMs = velocity * 1000; // km/s to m/s
  const energyJoules = 0.5 * massKg * Math.pow(velocityMs, 2);
  
  // Convert to megatons TNT (1 megaton = 4.184 × 10^15 joules)
  const megatons = energyJoules / (4.184 * Math.pow(10, 15));
  
  if (megatons < 0.001) {
    return `${(megatons * 1000).toFixed(2)} kilotons`;
  } else if (megatons < 1) {
    return `${megatons.toFixed(3)} megatons`;
  } else {
    return `${megatons.toFixed(1)} megatons`;
  }
};

/**
 * Get risk trend indicator
 * Compares current risk with average of all tracked bodies
 * 
 * @param {Object} body - Current celestial body
 * @param {Array} allBodies - All tracked bodies
 * @returns {Object} Trend information
 */
export const getRiskTrend = (body, allBodies) => {
  const currentRisk = calculateRiskScore(body);
  const avgScore = allBodies.reduce((sum, b) => {
    return sum + calculateRiskScore(b).score;
  }, 0) / allBodies.length;
  
  const difference = currentRisk.score - avgScore;
  
  return {
    current: currentRisk.score,
    average: Math.round(avgScore),
    difference: Math.round(difference),
    trend: difference > 15 ? 'ABOVE_AVERAGE' : difference < -15 ? 'BELOW_AVERAGE' : 'AVERAGE',
    message: difference > 15 
      ? `${Math.abs(Math.round(difference))} points above fleet average - Priority monitoring`
      : difference < -15 
      ? `${Math.abs(Math.round(difference))} points below fleet average - Routine tracking`
      : 'Within average risk range for tracked objects'
  };
};
