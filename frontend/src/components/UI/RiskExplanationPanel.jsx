import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, ChevronDown, ChevronUp, Info, Zap, Ruler, Maximize } from 'lucide-react';
import { explainRiskFactors, getActionRecommendation } from '../../utils/explainability';
import { ContributionBar, SeverityBadge, InlineHelp } from './ExplainabilityComponents';
import { calculateRiskScore } from '../../data/celestialData';

/**
 * RISK EXPLANATION PANEL (Detailed Analysis)
 * 
 * Purpose: THE SINGLE SOURCE for detailed risk factor breakdown
 * 
 * This is the ONLY place where detailed "WHY?" explanations appear:
 * - Factor-by-factor breakdown (velocity, distance, size)
 * - Contribution percentages with visual bars
 * - Technical comparisons and explanations
 * - Expandable deep-dive sections
 * 
 * UX Decision: RiskCard shows "WHAT?" (verdict), this shows "WHY?" (factors)
 * No duplication - each section has a distinct purpose.
 * 
 * Features:
 * - Overall risk explanation in plain language
 * - Factor breakdown (velocity, distance, size)
 * - Visual contribution indicators
 * - Expandable detailed view
 * - Action recommendations
 * 
 * This helps users understand:
 * - What makes something risky
 * - Which factors matter most
 * - What we're doing about it
 */

export const RiskExplanationPanel = ({ selectedBody, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate risk data
  const riskData = useMemo(() => {
    if (!selectedBody) return null;
    return calculateRiskScore(selectedBody);
  }, [selectedBody?.id, selectedBody?.velocity, selectedBody?.distanceFromEarth]);

  // Generate explanations
  const explanation = useMemo(() => {
    if (!selectedBody || !riskData) return null;
    return explainRiskFactors(selectedBody, riskData);
  }, [selectedBody, riskData]);

  // No selection state
  if (!selectedBody || !explanation) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-none p-6 text-center ${className}`}
        style={{
          background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.05), transparent)',
          backdropFilter: 'blur(16px)',
          border: '2px solid rgba(0, 240, 255, 0.2)',
          clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)',
        }}
      >
        <Info size={32} className="text-neon-cyan/30 mx-auto mb-2" />
        <p className="font-display text-sm text-star/40 tracking-wider">
          SELECT_OBJECT_FOR_RISK_ANALYSIS
        </p>
      </motion.div>
    );
  }

  const { overall, factors, riskLevel, summary } = explanation;
  const actionRec = getActionRecommendation(riskLevel);

  // Icon selection
  const RiskIcon = riskLevel === 'HIGH' ? AlertTriangle : Shield;
  const iconColor = riskData.color;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden rounded-none ${className}`}
      style={{
        background: `linear-gradient(135deg, ${iconColor}10, transparent)`,
        backdropFilter: 'blur(20px)',
        border: `2px solid ${iconColor}40`,
        boxShadow: `0 0 30px ${iconColor}20`,
        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)',
      }}
    >
      {/* Header Section */}
      <div className="p-6 border-b-2 border-white/10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="p-3 rounded-none"
              style={{
                background: `${iconColor}20`,
                border: `2px solid ${iconColor}`,
                clipPath: 'polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 20%)',
              }}
            >
              <RiskIcon size={24} style={{ color: iconColor }} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-display text-lg font-black tracking-wider text-star">
                DETAILED_RISK_ANALYSIS
              </h3>
              <p className="font-body text-xs text-neon-cyan/60 uppercase tracking-widest mt-1">
                ▸ Factor Breakdown • {selectedBody.name}
              </p>
            </div>
          </div>
          <SeverityBadge severity={riskLevel.toLowerCase()} label={`${riskLevel} RISK`} />
        </div>

        {/* Overall Explanation */}
        <div
          className="p-4 rounded-none"
          style={{
            background: 'rgba(0, 240, 255, 0.05)',
            border: '1px solid rgba(0, 240, 255, 0.2)',
            clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
          }}
        >
          <p className="font-body text-sm leading-relaxed text-star">
            {overall}
          </p>
        </div>
      </div>

      {/* Factor Contributions */}
      <div className="p-6">
        <h4 className="font-display text-sm font-bold tracking-widest text-neon-cyan mb-4">
          CONTRIBUTING_FACTORS
        </h4>

        <div className="space-y-4">
          {/* Velocity Factor */}
          <ContributionBar
            label="Speed"
            percentage={factors.velocity.contribution}
            icon={factors.velocity.icon}
            explanation={factors.velocity.explanation}
            comparison={factors.velocity.comparison}
          />

          {/* Distance Factor */}
          <ContributionBar
            label="Distance"
            percentage={factors.distance.contribution}
            icon={factors.distance.icon}
            explanation={factors.distance.explanation}
            comparison={factors.distance.comparison}
          />

          {/* Size Factor */}
          {selectedBody.radius && (
            <ContributionBar
              label="Size"
              percentage={factors.size.contribution}
              icon={factors.size.icon}
              explanation={factors.size.explanation}
              comparison={factors.size.comparison}
            />
          )}
        </div>

        {/* Summary */}
        <InlineHelp 
          text={summary}
          color={iconColor}
          icon="🎯"
        />
      </div>

      {/* Expandable Details */}
      <div className="border-t-2 border-white/10">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-4 flex items-center justify-between 
                   hover:bg-white/5 transition-all duration-300 group"
        >
          <span className="font-display text-xs font-bold tracking-widest text-neon-cyan">
            {isExpanded ? 'SHOW_LESS' : 'MORE_DETAILS'}
          </span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown size={18} className="text-neon-cyan" strokeWidth={2.5} />
          </motion.div>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="p-6 pt-0 space-y-4">
                {/* Detailed Factor Breakdown */}
                <div className="space-y-3">
                  {/* Velocity Details */}
                  <div
                    className="p-4 rounded-none"
                    style={{
                      background: `${factors.velocity.contribution > 70 ? '#ff006e' : factors.velocity.contribution > 40 ? '#ffbe0b' : '#00f0ff'}10`,
                      border: `1px solid ${factors.velocity.contribution > 70 ? '#ff006e' : factors.velocity.contribution > 40 ? '#ffbe0b' : '#00f0ff'}30`,
                      clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Zap size={16} className="text-neon-cyan" />
                      <h5 className="font-display text-xs font-bold tracking-wider text-star">
                        VELOCITY BREAKDOWN
                      </h5>
                    </div>
                    <p className="font-body text-xs text-star/80 leading-relaxed">
                      {factors.velocity.explanation}
                    </p>
                    <div className="mt-2 font-body text-xs text-neon-cyan">
                      💡 {factors.velocity.comparison}
                    </div>
                  </div>

                  {/* Distance Details */}
                  <div
                    className="p-4 rounded-none"
                    style={{
                      background: `${factors.distance.contribution > 70 ? '#ff006e' : factors.distance.contribution > 40 ? '#ffbe0b' : '#00f0ff'}10`,
                      border: `1px solid ${factors.distance.contribution > 70 ? '#ff006e' : factors.distance.contribution > 40 ? '#ffbe0b' : '#00f0ff'}30`,
                      clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Ruler size={16} className="text-neon-cyan" />
                      <h5 className="font-display text-xs font-bold tracking-wider text-star">
                        DISTANCE BREAKDOWN
                      </h5>
                    </div>
                    <p className="font-body text-xs text-star/80 leading-relaxed">
                      {factors.distance.explanation}
                    </p>
                    <div className="mt-2 font-body text-xs text-neon-cyan">
                      💡 {factors.distance.comparison}
                    </div>
                  </div>

                  {/* Size Details */}
                  {selectedBody.radius && (
                    <div
                      className="p-4 rounded-none"
                      style={{
                        background: `${factors.size.contribution > 70 ? '#ff006e' : factors.size.contribution > 40 ? '#ffbe0b' : '#00f0ff'}10`,
                        border: `1px solid ${factors.size.contribution > 70 ? '#ff006e' : factors.size.contribution > 40 ? '#ffbe0b' : '#00f0ff'}30`,
                        clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Maximize size={16} className="text-neon-cyan" />
                        <h5 className="font-display text-xs font-bold tracking-wider text-star">
                          SIZE BREAKDOWN
                        </h5>
                      </div>
                      <p className="font-body text-xs text-star/80 leading-relaxed">
                        {factors.size.explanation}
                      </p>
                      <div className="mt-2 font-body text-xs text-neon-cyan">
                        💡 {factors.size.comparison}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Recommendation */}
                <div
                  className="p-4 rounded-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.1), transparent)',
                    border: '2px solid rgba(0, 240, 255, 0.3)',
                    clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <Shield size={18} className="text-neon-cyan" />
                    </div>
                    <div>
                      <h5 className="font-display text-xs font-bold tracking-wider text-neon-cyan mb-2">
                        MONITORING_STATUS
                      </h5>
                      <p className="font-body text-xs text-star/80 leading-relaxed">
                        {actionRec}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
