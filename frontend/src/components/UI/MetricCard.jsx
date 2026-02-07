import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { animateValue } from '../../data/celestialData';
import { explainVelocity, explainDistance, getEverydayComparison } from '../../utils/explainability';
import { ExplainabilityTooltip } from './ExplainabilityComponents';

// Utility: Determine dynamic color based on value range
const getDynamicColor = (title, value, baseColor) => {
  if (title === 'Velocity') {
    // High velocity = more dangerous (red), low = safe (cyan)
    if (value > 30) return '#ff006e'; // magenta/red
    if (value > 25) return '#ffbe0b'; // yellow
    return baseColor; // cyan
  }
  
  if (title === 'Distance') {
    // Close distance = dangerous (red), far = safe (cyan)
    if (value < 1) return '#ff006e'; // magenta/red - very close
    if (value < 10) return '#ffbe0b'; // yellow - close
    return baseColor; // cyan - safe distance
  }
  
  return baseColor;
};

// Utility: Get threat level for visual indicators
const getThreatLevel = (title, value) => {
  if (title === 'Velocity') {
    if (value > 30) return { level: 'HIGH', pulse: true };
    if (value > 25) return { level: 'MEDIUM', pulse: false };
    return { level: 'LOW', pulse: false };
  }
  
  if (title === 'Distance') {
    if (value < 1) return { level: 'HIGH', pulse: true };
    if (value < 10) return { level: 'MEDIUM', pulse: false };
    return { level: 'LOW', pulse: false };
  }
  
  return { level: 'LOW', pulse: false };
};

export const MetricCard = ({ title, value, unit, icon: Icon, color }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [prevValue, setPrevValue] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  // Calculate dynamic color based on current value
  const dynamicColor = useMemo(() => getDynamicColor(title, value, color), [title, value, color]);
  const threatLevel = useMemo(() => getThreatLevel(title, value), [title, value]);

  useEffect(() => {
    if (value !== prevValue) {
      setIsUpdating(true);
      animateValue(prevValue, value, 1000, (current) => {
        setDisplayValue(current);
      });
      setPrevValue(value);
      
      // Reset update indicator after animation
      const timer = setTimeout(() => setIsUpdating(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [value, prevValue]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -60 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-none p-6 group cursor-pointer"
      style={{
        background: `linear-gradient(135deg, ${dynamicColor}15, transparent)`,
        backdropFilter: 'blur(16px)',
        border: `2px solid ${dynamicColor}${threatLevel.level === 'HIGH' ? '80' : '40'}`,
        boxShadow: `0 0 ${threatLevel.level === 'HIGH' ? '40' : '30'}px ${dynamicColor}${threatLevel.level === 'HIGH' ? '40' : '20'}, inset 0 0 30px ${dynamicColor}10`,
        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)',
        transition: 'all 0.5s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.border = `2px solid ${dynamicColor}`;
        e.currentTarget.style.boxShadow = `0 0 50px ${dynamicColor}40, inset 0 0 40px ${dynamicColor}20`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.border = `2px solid ${dynamicColor}${threatLevel.level === 'HIGH' ? '80' : '40'}`;
        e.currentTarget.style.boxShadow = `0 0 ${threatLevel.level === 'HIGH' ? '40' : '30'}px ${dynamicColor}${threatLevel.level === 'HIGH' ? '40' : '20'}, inset 0 0 30px ${dynamicColor}10`;
      }}
    >
      {/* Threat level indicator - pulses when high */}
      {threatLevel.level !== 'LOW' && (
        <motion.div
          className="absolute top-4 right-4 px-3 py-1 rounded-none font-display text-xs font-bold tracking-widest"
          style={{
            backgroundColor: `${dynamicColor}30`,
            border: `1px solid ${dynamicColor}`,
            color: dynamicColor,
            clipPath: 'polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)',
          }}
          animate={threatLevel.pulse ? {
            opacity: [1, 0.5, 1],
            scale: [1, 1.05, 1],
          } : {}}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {threatLevel.level}_ALERT
        </motion.div>
      )}

      {/* Update indicator - flashes when value changes */}
      {isUpdating && (
        <motion.div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: dynamicColor }}
          initial={{ scaleX: 0, transformOrigin: 'left' }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1 }}
        />
      )}

      {/* Corner accent */}
      <div
        className="absolute bottom-0 right-0 w-20 h-20 opacity-40 group-hover:opacity-60 transition-opacity"
        style={{
          background: `linear-gradient(135deg, transparent, ${dynamicColor})`,
          clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
        }}
      />

      {/* Animated border line - changes color dynamically */}
      <motion.div
        className="absolute top-0 left-0 h-[2px]"
        style={{ background: dynamicColor }}
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-xs font-bold text-star/60 uppercase tracking-[0.2em]">
              {title}
            </h3>
            {/* Explainability Tooltip */}
            <ExplainabilityTooltip
              explanation={
                title === 'Velocity' 
                  ? explainVelocity(value)
                  : title === 'Distance'
                  ? explainDistance(value)
                  : "This metric helps assess the object's characteristics and monitoring priority."
              }
              comparison={
                title === 'Velocity'
                  ? getEverydayComparison('velocity', value)
                  : title === 'Distance'
                  ? getEverydayComparison('distance', value)
                  : null
              }
              color={dynamicColor}
              position="top"
            />
          </div>
          {Icon && (
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="p-3 rounded-none"
              style={{
                backgroundColor: `${dynamicColor}20`,
                border: `1px solid ${dynamicColor}50`,
                clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
              }}
            >
              <Icon size={24} style={{ color: dynamicColor, strokeWidth: 2.5 }} />
            </motion.div>
          )}
        </div>

        <div className="flex items-baseline gap-3">
          <motion.div
            key={value}
            initial={{ scale: 1.3, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-5xl font-black"
            style={{
              color: dynamicColor,
              textShadow: `0 0 20px ${dynamicColor}80, 0 0 40px ${dynamicColor}40`,
            }}  
          >
            {displayValue.toFixed(2)}
          </motion.div>
          <span className="font-body text-xl text-star/50 font-semibold tracking-wider">
            {unit}
          </span>
        </div>

        {/* Data visualization bars */}
        <div className="mt-6 flex gap-1">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`${i}-${value}`}
              className="flex-1 rounded-none"
              style={{
                backgroundColor: `${dynamicColor}30`,
                height: `${Math.min((displayValue / 50) * 30 + 10, 40)}px`,
              }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.8 + i * 0.05,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};
