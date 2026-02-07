import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';

/**
 * EXPLAINABILITY TOOLTIP COMPONENT
 * 
 * Purpose: Provide contextual explanations for metrics and values
 * 
 * Features:
 * - Smooth hover animations
 * - Cyber-themed styling matching dashboard
 * - Lightweight and performant
 * - Accessible (keyboard navigation ready)
 * 
 * Usage:
 * <ExplainabilityTooltip explanation="This is why..." comparison="Like a bullet train!" />
 */

export const ExplainabilityTooltip = ({ 
  explanation, 
  comparison = null,
  icon = Info,
  iconSize = 16,
  position = 'top', // top, bottom, left, right
  color = '#00f0ff', // Default cyan
  maxWidth = 320
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const Icon = icon;

  // Position-based offset styling
  const positionStyles = {
    top: {
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      marginBottom: '12px',
    },
    bottom: {
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      marginTop: '12px',
    },
    left: {
      right: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
      marginRight: '12px',
    },
    right: {
      left: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
      marginLeft: '12px',
    },
  };

  return (
    <div className="relative inline-flex items-center">
      {/* Info Icon Trigger */}
      <button
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="inline-flex items-center justify-center p-1.5 rounded-none 
                   transition-all duration-300 cursor-help group"
        style={{
          background: `${color}15`,
          border: `1px solid ${color}40`,
          clipPath: 'polygon(15% 0%, 100% 0%, 100% 85%, 85% 100%, 0% 100%, 0% 15%)',
        }}
        aria-label="More information"
      >
        <Icon 
          size={iconSize} 
          className="transition-all duration-300 group-hover:rotate-12"
          style={{ color }}
          strokeWidth={2.5}
        />
      </button>

      {/* Tooltip Popup */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: position === 'top' ? 10 : position === 'bottom' ? -10 : 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-50 pointer-events-none"
            style={{
              ...positionStyles[position],
              maxWidth: `${maxWidth}px`,
            }}
          >
            <div
              className="relative p-4 rounded-none shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(13, 17, 23, 0.98), rgba(22, 27, 46, 0.98))',
                backdropFilter: 'blur(24px)',
                border: `2px solid ${color}60`,
                boxShadow: `0 0 30px ${color}40, 0 10px 20px rgba(0, 0, 0, 0.6)`,
                clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
              }}
            >
              {/* Corner accent */}
              <div
                className="absolute top-0 left-0 w-10 h-10 opacity-40"
                style={{
                  background: `linear-gradient(135deg, ${color}, transparent)`,
                  clipPath: 'polygon(0 0, 100% 0, 0 100%)',
                }}
              />

              {/* Explanation Text */}
              <p 
                className="font-body text-sm leading-relaxed relative z-10"
                style={{ color: '#e5e7eb' }}
              >
                {explanation}
              </p>

              {/* Optional Comparison */}
              {comparison && (
                <div 
                  className="mt-3 pt-3 font-display text-xs font-bold tracking-wider relative z-10"
                  style={{
                    borderTop: `1px solid ${color}30`,
                    color: color,
                  }}
                >
                  💡 {comparison}
                </div>
              )}

              {/* Arrow pointer */}
              <div
                className="absolute w-3 h-3"
                style={{
                  background: 'linear-gradient(135deg, rgba(13, 17, 23, 0.98), rgba(22, 27, 46, 0.98))',
                  border: `2px solid ${color}60`,
                  transform: 'rotate(45deg)',
                  ...(position === 'top' && {
                    bottom: '-7px',
                    left: '50%',
                    marginLeft: '-6px',
                    borderTop: 'none',
                    borderLeft: 'none',
                  }),
                  ...(position === 'bottom' && {
                    top: '-7px',
                    left: '50%',
                    marginLeft: '-6px',
                    borderBottom: 'none',
                    borderRight: 'none',
                  }),
                  ...(position === 'left' && {
                    right: '-7px',
                    top: '50%',
                    marginTop: '-6px',
                    borderTop: 'none',
                    borderRight: 'none',
                  }),
                  ...(position === 'right' && {
                    left: '-7px',
                    top: '50%',
                    marginTop: '-6px',
                    borderBottom: 'none',
                    borderLeft: 'none',
                  }),
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * INLINE HELP TEXT COMPONENT
 * 
 * Purpose: Provide brief contextual hints without hover interaction
 * Use when explanation should always be visible
 */
export const InlineHelp = ({ text, color = '#00f0ff', icon = '💡' }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-start gap-2 mt-2 p-3 rounded-none"
      style={{
        background: `${color}10`,
        border: `1px solid ${color}30`,
        clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
      }}
    >
      <span className="text-sm flex-shrink-0">{icon}</span>
      <p 
        className="font-body text-xs leading-relaxed"
        style={{ color: `${color}` }}
      >
        {text}
      </p>
    </motion.div>
  );
};

/**
 * CONTRIBUTION BAR COMPONENT
 * 
 * Purpose: Visual indicator showing how much each factor contributes to risk
 * Shows percentage with color coding (red = high contribution, cyan = low)
 */
export const ContributionBar = ({ 
  label, 
  percentage, 
  icon = '●',
  explanation = null,
  comparison = null
}) => {
  // Determine color based on contribution level
  const getColor = (pct) => {
    if (pct >= 70) return '#ff006e'; // High - Magenta
    if (pct >= 40) return '#ffbe0b'; // Medium - Yellow
    return '#00f0ff'; // Low - Cyan
  };

  const color = getColor(percentage);

  return (
    <div className="space-y-2">
      {/* Label row with tooltip */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span style={{ color }}>{icon}</span>
          <span className="font-display text-sm font-bold tracking-wider" style={{ color: '#e5e7eb' }}>
            {label}
          </span>
          {explanation && (
            <ExplainabilityTooltip 
              explanation={explanation}
              comparison={comparison}
              color={color}
              position="right"
            />
          )}
        </div>
        <span className="font-display text-sm font-black" style={{ color }}>
          {percentage}%
        </span>
      </div>

      {/* Progress bar */}
      <div 
        className="relative h-2 rounded-full overflow-hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: `linear-gradient(90deg, ${color}, ${color}80)`,
            boxShadow: `0 0 15px ${color}60`,
          }}
        />
      </div>
    </div>
  );
};

/**
 * SEVERITY BADGE COMPONENT
 * 
 * Purpose: Visual indicator for severity levels (high/medium/low)
 * Used in risk explanations to show factor severity
 */
export const SeverityBadge = ({ severity, label = null }) => {
  const getBadgeStyle = (level) => {
    switch (level) {
      case 'high':
        return {
          color: '#ff006e',
          bgColor: 'rgba(255, 0, 110, 0.2)',
          text: label || 'HIGH CONCERN',
        };
      case 'medium':
        return {
          color: '#ffbe0b',
          bgColor: 'rgba(255, 190, 11, 0.2)',
          text: label || 'MODERATE',
        };
      case 'low':
        return {
          color: '#00f0ff',
          bgColor: 'rgba(0, 240, 255, 0.2)',
          text: label || 'LOW CONCERN',
        };
      default:
        return {
          color: '#888',
          bgColor: 'rgba(136, 136, 136, 0.2)',
          text: label || 'UNKNOWN',
        };
    }
  };

  const style = getBadgeStyle(severity);

  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="inline-flex items-center px-3 py-1 rounded-none font-display text-xs font-black tracking-widest"
      style={{
        backgroundColor: style.bgColor,
        border: `1px solid ${style.color}`,
        color: style.color,
        clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)',
      }}
    >
      {style.text}
    </motion.span>
  );
};
