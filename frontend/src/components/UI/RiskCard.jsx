import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Activity, ChevronRight } from 'lucide-react';
import { calculateRiskScore } from '../../data/celestialData';
import { generateRiskVerdict, getMonitoringStatus } from '../../utils/explainability';

/**
 * RISK SUMMARY CARD (Simplified)
 * 
 * Purpose: Show quick risk verdict WITHOUT detailed factor breakdown
 * 
 * Displays:
 * - Risk level badge (HIGH/MEDIUM/LOW)
 * - Risk score (0-100)
 * - Concise 1-2 line verdict ("WHAT does this mean?")
 * - Monitoring status indicator
 * 
 * Does NOT show:
 * - Detailed factor explanations (that's in RiskExplanationPanel)
 * - Technical data breakdowns
 * - Expandable details
 * 
 * UX Decision: Keep this card simple and scannable at a glance.
 * Users can scroll down to RiskExplanationPanel for detailed "WHY?"
 */

export const RiskCard = ({ selectedBody, onViewDetails }) => {
  // Calculate risk score with memoization for performance
  const riskData = useMemo(() => {
    if (!selectedBody) return null;
    return calculateRiskScore(selectedBody);
  }, [selectedBody?.id, selectedBody?.distanceFromEarth, selectedBody?.velocity]);

  // Generate concise verdict (1-2 lines)
  const verdict = useMemo(() => {
    if (!selectedBody || !riskData) return '';
    return generateRiskVerdict(selectedBody, riskData);
  }, [selectedBody, riskData]);

  if (!selectedBody || !riskData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-none p-6 text-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.05), transparent)',
          backdropFilter: 'blur(16px)',
          border: '2px solid rgba(0, 240, 255, 0.2)',
          clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)',
        }}
      >
        <Shield size={40} className="text-neon-cyan/30 mx-auto mb-3" />
        <p className="font-display text-sm text-star/40 tracking-wider">
          SELECT_OBJECT_FOR_RISK_ANALYSIS
        </p>
      </motion.div>
    );
  }

  const { score, level, color } = riskData;
  
  // Get icon based on risk level
  const RiskIcon = level === 'HIGH' ? AlertTriangle : Shield;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-none p-6 cursor-pointer group"
      style={{
        background: `linear-gradient(135deg, ${color}15, transparent)`,
        backdropFilter: 'blur(16px)',
        border: `2px solid ${color}40`,
        boxShadow: `0 0 30px ${color}20`,
        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)',
        transition: 'all 0.5s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.border = `2px solid ${color}`;
        e.currentTarget.style.boxShadow = `0 0 50px ${color}40`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.border = `2px solid ${color}40`;
        e.currentTarget.style.boxShadow = `0 0 30px ${color}20`;
      }}
    >
      {/* Corner accent */}
      <div
        className="absolute bottom-0 right-0 w-20 h-20 opacity-40 group-hover:opacity-60 transition-opacity"
        style={{
          background: `linear-gradient(135deg, transparent, ${color})`,
          clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
        }}
      />

      {/* Risk level badge */}
      <motion.div
        className="absolute top-4 right-4 px-3 py-1 rounded-none font-display text-xs font-bold tracking-widest"
        style={{
          backgroundColor: `${color}30`,
          border: `2px solid ${color}`,
          color: color,
          clipPath: 'polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)',
        }}
        animate={level === 'HIGH' ? {
          scale: [1, 1.05, 1],
          opacity: [1, 0.8, 1],
        } : {}}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {level}_RISK
      </motion.div>

      <div className="relative z-10">
        {/* Header with Icon and Title */}
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            animate={{
              rotate: level === 'HIGH' ? [0, -10, 10, 0] : [0, 5, -5, 0],
            }}
            transition={{
              duration: level === 'HIGH' ? 2 : 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="p-3 rounded-none"
            style={{
              backgroundColor: `${color}20`,
              border: `2px solid ${color}50`,
              clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
            }}
          >
            <RiskIcon size={28} style={{ color, strokeWidth: 2.5 }} />
          </motion.div>
          <div className="flex-1">
            <h3 className="font-display text-xs font-bold text-star/60 uppercase tracking-[0.2em]">
              Risk Summary
            </h3>
            <p className="font-body text-xs text-star/40 mt-1">
              {selectedBody.name}
            </p>
          </div>
        </div>

        {/* Risk Score Display */}
        <div className="flex items-baseline gap-3 mb-6">
          <motion.div
            key={score}
            initial={{ scale: 1.3, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-6xl font-black"
            style={{
              color,
              textShadow: `0 0 20px ${color}80, 0 0 40px ${color}40`,
            }}
          >
            {score}
          </motion.div>
          <div>
            <span className="font-body text-2xl text-star/50 font-semibold tracking-wider">
              / 100
            </span>
            <div className="font-body text-xs text-star/40 uppercase tracking-widest mt-1">
              Risk Score
            </div>
          </div>
        </div>

        {/* Verdict - Concise Summary (1-2 lines) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-5 px-4 py-4 rounded-none"
          style={{
            backgroundColor: `${color}10`,
            border: `2px solid ${color}30`,
            clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="flex-shrink-0 mt-0.5 p-2 rounded-none"
              style={{
                backgroundColor: `${color}20`,
                border: `1px solid ${color}50`,
                clipPath: 'polygon(20% 0%, 100% 0%, 100% 80%, 80% 100%, 0% 100%, 0% 20%)',
              }}
            >
              <Activity size={16} style={{ color }} strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <h4 className="font-display text-xs font-bold uppercase tracking-wider mb-2"
                style={{ color }}>
                Assessment Verdict
              </h4>
              <p className="font-body text-sm text-star leading-relaxed">
                {verdict}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Monitoring Status */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="px-4 py-3 rounded-none"
          style={{
            backgroundColor: 'rgba(0, 240, 255, 0.05)',
            border: '1px solid rgba(0, 240, 255, 0.2)',
            clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
          }}
        >
          <p className="font-body text-xs text-neon-cyan/80 leading-relaxed">
            {getMonitoringStatus(level)}
          </p>
        </motion.div>

        {/* View Detailed Analysis Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onViewDetails}
          className="mt-5 w-full px-6 py-4 rounded-none font-display text-sm font-bold tracking-widest uppercase relative overflow-hidden group"
          style={{
            background: `linear-gradient(135deg, ${color}30, ${color}10)`,
            border: `2px solid ${color}60`,
            color: color,
            clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = `linear-gradient(135deg, ${color}50, ${color}20)`;
            e.currentTarget.style.boxShadow = `0 0 30px ${color}40`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = `linear-gradient(135deg, ${color}30, ${color}10)`;
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {/* Shine effect on hover */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100"
            style={{
              background: `linear-gradient(90deg, transparent, ${color}30, transparent)`,
            }}
            animate={{
              x: ['-200%', '200%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          <div className="relative flex items-center justify-center gap-3">
            <span>View Detailed Analysis</span>
            <ChevronRight size={18} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
};
