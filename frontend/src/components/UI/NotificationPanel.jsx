import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Ruler, AlertTriangle, Clock, Trash2, Info } from 'lucide-react';
import { explainNotificationTrigger, getFriendlyTimeDescription } from '../../utils/explainability';

export const NotificationPanel = ({ 
  isOpen, 
  onClose, 
  alerts,
  onDismiss,
  unreadCount 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 400, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 400, scale: 0.9 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-6 top-24 w-[420px] max-h-[85vh] overflow-hidden rounded-none z-50"
            style={{
              background: 'linear-gradient(135deg, rgba(13, 17, 23, 0.98), rgba(22, 27, 46, 0.98))',
              backdropFilter: 'blur(24px)',
              border: '2px solid rgba(255, 0, 110, 0.4)',
              boxShadow: '0 0 60px rgba(255, 0, 110, 0.4), 0 20px 40px rgba(0, 0, 0, 0.6)',
              clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)',
            }}
          >
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-20 h-20" style={{
              background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.3), transparent)',
              clipPath: 'polygon(0 0, 100% 0, 0 100%)',
            }} />
            <div className="absolute bottom-0 right-0 w-20 h-20" style={{
              background: 'linear-gradient(135deg, transparent, rgba(255, 0, 110, 0.3))',
              clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
            }} />

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b-2 border-neon-magenta/30 relative z-10">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="font-display text-xl font-black text-neon-magenta tracking-wider">
                    INCOMING_THREATS
                  </h2>
                  {unreadCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="px-3 py-1 rounded-none font-display text-xs font-black"
                      style={{
                        background: 'linear-gradient(135deg, #ff006e, #ff4d94)',
                        color: '#fff',
                        boxShadow: '0 0 20px rgba(255, 0, 110, 0.6)',
                        clipPath: 'polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)',
                      }}
                    >
                      {unreadCount} NEW
                    </motion.div>
                  )}
                </div>
                <p className="font-body text-xs text-neon-cyan/60 mt-1 tracking-widest uppercase">
                  ▸ Close Approach Events ({alerts.length} Active)
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-3 rounded-none bg-neon-magenta/10 hover:bg-neon-magenta/20 
                         border border-neon-magenta/40 hover:border-neon-magenta
                         transition-all duration-300 group"
                style={{
                  clipPath: 'polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 20%)',
                }}
              >
                <X size={20} className="text-neon-magenta group-hover:rotate-90 transition-transform duration-300" strokeWidth={2.5} />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(85vh-7rem)] p-5 relative z-10">
              {alerts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="font-display text-neon-cyan/30 text-lg tracking-widest">
                    NO_THREATS_DETECTED
                  </div>
                  <div className="font-body text-star/40 text-sm mt-2">
                    All systems nominal
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {alerts.map((alert, index) => {
                    const isHighRisk = alert.riskLevel === 'HIGH';
                    const isMediumRisk = alert.riskLevel === 'MEDIUM';
                    
                    return (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30, height: 0 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        transition={{ delay: index * 0.08, duration: 0.4 }}
                        className="relative p-5 rounded-none group cursor-pointer overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${alert.riskColor}15, transparent)`,
                          border: `2px solid ${alert.riskColor}40`,
                          boxShadow: `0 0 20px ${alert.riskColor}20`,
                          clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
                          transition: 'border 0.3s ease, box-shadow 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.border = `2px solid ${alert.riskColor}`;
                          e.currentTarget.style.boxShadow = `0 0 35px ${alert.riskColor}40`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.border = `2px solid ${alert.riskColor}40`;
                          e.currentTarget.style.boxShadow = `0 0 20px ${alert.riskColor}20`;
                        }}
                      >
                        {/* Pulsing animation for high-risk alerts */}
                        {isHighRisk && (
                          <motion.div
                            className="absolute inset-0 opacity-20"
                            animate={{
                              opacity: [0.1, 0.3, 0.1],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            style={{
                              background: `radial-gradient(circle at top left, ${alert.riskColor}, transparent)`,
                            }}
                          />
                        )}

                        {/* Accent corner */}
                        <div
                          className="absolute top-0 left-0 w-10 h-10 opacity-50 group-hover:opacity-70 transition-opacity"
                          style={{
                            background: `linear-gradient(135deg, ${alert.riskColor}, transparent)`,
                            clipPath: 'polygon(0 0, 100% 0, 0 100%)',
                          }}
                        />

                        {/* Dismiss button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDismiss(alert.id);
                          }}
                          className="absolute top-4 right-4 p-2 rounded-none bg-void/80 hover:bg-void 
                                   border border-star/30 hover:border-neon-magenta/60
                                   opacity-0 group-hover:opacity-100 transition-all duration-300 z-20"
                          style={{
                            clipPath: 'polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 15%)',
                          }}
                        >
                          <Trash2 size={14} className="text-neon-magenta" strokeWidth={2.5} />
                        </button>

                        <div className="flex items-start justify-between mb-4 relative z-10">
                          <div className="flex-1 pr-8">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-display text-lg font-bold text-star tracking-wide">
                                {alert.objectName}
                              </h3>
                              {alert.isNew && (
                                <motion.div
                                  initial={{ scale: 0, rotate: -45 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  className="px-2 py-0.5 rounded-none font-body text-xs font-black"
                                  style={{
                                    background: 'linear-gradient(135deg, #00f0ff, #00b8cc)',
                                    color: '#0a0e1a',
                                    clipPath: 'polygon(3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%, 0 3px)',
                                  }}
                                >
                                  NEW
                                </motion.div>
                              )}
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              {/* Risk level badge */}
                              <div
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none font-body text-xs font-bold tracking-wider"
                                style={{
                                  backgroundColor: `${alert.riskColor}30`,
                                  color: alert.riskColor,
                                  border: `1px solid ${alert.riskColor}60`,
                                  clipPath: 'polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)',
                                }}
                              >
                                {isHighRisk && <AlertTriangle size={12} strokeWidth={3} />}
                                {alert.riskLevel}_RISK
                              </div>
                              {/* Object type badge */}
                              <div
                                className="inline-block px-3 py-1 rounded-none font-body text-xs font-bold tracking-wider"
                                style={{
                                  backgroundColor: `${alert.color}30`,
                                  color: alert.color,
                                  border: `1px solid ${alert.color}60`,
                                  clipPath: 'polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)',
                                }}
                              >
                                ASTEROID
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3 text-sm font-body">
                          {/* Days until approach */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-neon-cyan/80">
                              <Clock size={16} strokeWidth={2.5} />
                              <span className="font-semibold tracking-wide">
                                {alert.daysUntilApproach} {alert.daysUntilApproach === 1 ? 'day' : 'days'} until approach
                              </span>
                            </div>
                            {alert.daysUntilApproach <= 7 && (
                              <motion.div
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="px-2 py-0.5 rounded-none font-body text-xs font-black text-neon-magenta"
                                style={{
                                  background: 'rgba(255, 0, 110, 0.2)',
                                  border: '1px solid rgba(255, 0, 110, 0.5)',
                                }}
                              >
                                IMMINENT
                              </motion.div>
                            )}
                          </div>
                          
                          {/* Close approach date */}
                          <div className="flex items-center gap-3 text-neon-cyan/80">
                            <Calendar size={16} strokeWidth={2.5} />
                            <span className="font-semibold tracking-wide">
                              {alert.approachDate.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                          
                          {/* Distance */}
                          <div className="flex items-center gap-3 text-neon-magenta/80">
                            <Ruler size={16} strokeWidth={2.5} />
                            <span className="font-semibold tracking-wide">
                              {alert.distanceFromEarth.toFixed(2)} M km
                            </span>
                          </div>

                          {/* Risk score bar */}
                          <div className="mt-4 pt-3 border-t border-star/20">
                            <div className="flex items-center justify-between text-xs text-star/60 mb-2">
                              <span className="font-semibold tracking-wider">RISK SCORE</span>
                              <span className="font-bold font-display" style={{ color: alert.riskColor }}>
                                {alert.riskScore}/100
                              </span>
                            </div>
                            <div className="h-2 rounded-none bg-void/50 overflow-hidden relative">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${alert.riskScore}%` }}
                                transition={{ delay: index * 0.1 + 0.3, duration: 0.8, ease: "easeOut" }}
                                className="h-full relative"
                                style={{
                                  background: `linear-gradient(90deg, ${alert.riskColor}, ${alert.riskColor}cc)`,
                                  boxShadow: `0 0 10px ${alert.riskColor}80`,
                                }}
                              />
                            </div>
                          </div>

                          {/* Why triggered - Explainability */}
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
                            className="mt-4 p-3 rounded-none"
                            style={{
                              background: 'rgba(0, 240, 255, 0.08)',
                              border: '1px solid rgba(0, 240, 255, 0.25)',
                              clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
                            }}
                          >
                            <div className="flex items-start gap-2">
                              <Info size={14} className="text-neon-cyan flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                              <div>
                                <div className="font-display text-xs font-bold text-neon-cyan mb-1 tracking-wider">
                                  WHY_TRIGGERED
                                </div>
                                <p className="font-body text-xs text-star/70 leading-relaxed">
                                  {explainNotificationTrigger(alert)}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
