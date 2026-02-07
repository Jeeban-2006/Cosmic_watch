import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gauge, Route, TrendingUp, X, AlertTriangle, Bell, Activity, Calendar, Search, ChevronRight } from 'lucide-react';
import { DashboardHeader } from './DashboardHeader';
import { MetricCard } from './MetricCard';
import { RiskCard } from './RiskCard';
import { RiskExplanationPanel } from './RiskExplanationPanel';
import { FilterPanel } from './FilterPanel';
import { ProximitySelector } from './ProximitySelector';
import { convertDistance, calculateRiskScore } from '../../data/celestialData';

export const Dashboard = ({
  selectedBody,
  sortedBodies,
  onBodySelect,
  onFilterChange,
  currentUnit,
  onUnitChange,
  notificationCount,
  onNotificationClick,
}) => {
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Calculate statistics
  const stats = {
    totalNEOs: sortedBodies.length,
    closeApproachesToday: sortedBodies.filter(b => b.closeApproachDate).length,
    highRiskAsteroids: sortedBodies.filter(b => {
      const risk = calculateRiskScore(b);
      return risk && risk.level === 'HIGH';
    }).length,
    alertsSent: notificationCount || 12,
  };

  // Reset detailed view when body changes
  useEffect(() => {
    setShowDetailedAnalysis(false);
  }, [selectedBody?.id]);

  // Get risk data for selected body
  const selectedRiskData = selectedBody ? calculateRiskScore(selectedBody) : null;

  return (
    <div className="relative pointer-events-none">
      <div className="container mx-auto px-6 py-8 pointer-events-auto min-h-screen">
        {/* Header */}
        <DashboardHeader
          notificationCount={notificationCount}
          onNotificationClick={onNotificationClick}
        />

        {/* Main dashboard content */}
        <div className="space-y-6 mt-6">
          {/* NEO Activity Summary - 4 Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h2 className="font-display text-lg font-bold text-star/80 uppercase tracking-wider mb-4">
              NEO Activity Summary
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total NEOs */}
              <motion.div
                whileHover={{ scale: 1.03, y: -3 }}
                className="rounded-none p-5 relative overflow-hidden cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.1), rgba(0, 240, 255, 0.05))',
                  backdropFilter: 'blur(16px)',
                  border: '2px solid rgba(0, 240, 255, 0.3)',
                  clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)',
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Activity size={24} className="text-neon-cyan" />
                  <span className="font-display text-xs uppercase tracking-wider text-star/60">Total NEOs</span>
                </div>
                <div className="font-display text-4xl font-black text-neon-cyan">
                  {stats.totalNEOs}
                </div>
              </motion.div>

              {/* Close Approaches Today */}
              <motion.div
                whileHover={{ scale: 1.03, y: -3 }}
                className="rounded-none p-5 relative overflow-hidden cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, rgba(131, 56, 236, 0.1), rgba(131, 56, 236, 0.05))',
                  backdropFilter: 'blur(16px)',
                  border: '2px solid rgba(131, 56, 236, 0.3)',
                  clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)',
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Calendar size={24} className="text-purple-400" />
                  <span className="font-display text-xs uppercase tracking-wider text-star/60">Close Approaches Today</span>
                </div>
                <div className="font-display text-4xl font-black text-purple-400">
                  {stats.closeApproachesToday}
                </div>
              </motion.div>

              {/* High-Risk Asteroids */}
              <motion.div
                whileHover={{ scale: 1.03, y: -3 }}
                className="rounded-none p-5 relative overflow-hidden cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 0, 110, 0.1), rgba(255, 0, 110, 0.05))',
                  backdropFilter: 'blur(16px)',
                  border: '2px solid rgba(255, 0, 110, 0.3)',
                  clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)',
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle size={24} className="text-neon-magenta" />
                  <span className="font-display text-xs uppercase tracking-wider text-star/60">High-Risk Asteroids</span>
                </div>
                <div className="font-display text-4xl font-black text-neon-magenta">
                  {stats.highRiskAsteroids}
                </div>
              </motion.div>

              {/* Alerts Sent */}
              <motion.div
                whileHover={{ scale: 1.03, y: -3 }}
                className="rounded-none p-5 relative overflow-hidden cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 190, 11, 0.1), rgba(255, 190, 11, 0.05))',
                  backdropFilter: 'blur(16px)',
                  border: '2px solid rgba(255, 190, 11, 0.3)',
                  clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)',
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Bell size={24} className="text-yellow-400" />
                  <span className="font-display text-xs uppercase tracking-wider text-star/60">Alerts Sent</span>
                </div>
                <div className="font-display text-4xl font-black text-yellow-400">
                  {stats.alertsSent}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Date Range Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-none p-4"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.05), transparent)',
              backdropFilter: 'blur(16px)',
              border: '2px solid rgba(0, 240, 255, 0.2)',
              clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
            }}
          >
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-display text-sm uppercase tracking-wider text-star/70">Date Range:</span>
              <div className="flex items-center gap-2">
                <label className="font-body text-xs text-star/60">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 bg-space/50 border border-neon-cyan/30 rounded-none text-star text-sm focus:border-neon-cyan focus:outline-none"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="font-body text-xs text-star/60">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 bg-space/50 border border-neon-cyan/30 rounded-none text-star text-sm focus:border-neon-cyan focus:outline-none"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 rounded-none font-display text-sm uppercase tracking-wider"
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.3), rgba(0, 240, 255, 0.1))',
                  border: '2px solid rgba(0, 240, 255, 0.6)',
                  color: '#00f0ff',
                  clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
                }}
              >
                <div className="flex items-center gap-2">
                  <Search size={16} />
                  <span>Search</span>
                </div>
              </motion.button>
            </div>
          </motion.div>

          {/* Main Content Area - 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Asteroid Feed + Risk Analysis */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <MetricCard
                  title="Velocity"
                  value={selectedBody?.velocity || 0}
                  unit="km/s"
                  icon={Gauge}
                  color="#00f0ff"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <MetricCard
                  title="Distance"
                  value={
                    selectedBody
                      ? convertDistance(selectedBody.distanceFromEarth, currentUnit)
                      : 0
                  }
                  unit={currentUnit}
                  icon={Route}
                  color="#ff006e"
                />
              </motion.div>
            </div>

            {/* Risk Analysis Row (Horizontal) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Risk Summary Card - Shows verdict only */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <RiskCard 
                  selectedBody={selectedBody}
                  onViewDetails={() => setShowDetailedAnalysis(true)}
                />
              </motion.div>

              {/* Risk Explanation Panel - Always visible */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <RiskExplanationPanel 
                  selectedBody={selectedBody}
                />
              </motion.div>
            </div>

            {/* Controls and Info Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Info panel - Always visible */}
              {selectedBody && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ duration: 0.8, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-none p-6 relative overflow-hidden group cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.1), rgba(255, 0, 110, 0.05))',
                    backdropFilter: 'blur(16px)',
                    border: '2px solid rgba(0, 240, 255, 0.3)',
                    boxShadow: '0 0 30px rgba(0, 240, 255, 0.2)',
                    clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)',
                    transition: 'border 0.3s ease, box-shadow 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.border = '2px solid rgba(0, 240, 255, 0.8)';
                    e.currentTarget.style.boxShadow = '0 0 50px rgba(0, 240, 255, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.border = '2px solid rgba(0, 240, 255, 0.3)';
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 240, 255, 0.2)';
                  }}
                >
                  {/* Corner accent */}
                  <div
                    className="absolute bottom-0 right-0 w-20 h-20 opacity-30"
                    style={{
                      background: 'linear-gradient(135deg, transparent, #00f0ff)',
                      clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
                    }}
                  />

                  <h3 className="font-display text-xl font-bold text-neon-cyan mb-6 tracking-wider uppercase">
                    {selectedBody.name}
                  </h3>
                  <div className="space-y-4 text-sm relative z-10">
                    <div className="flex justify-between items-center py-2 border-b border-neon-cyan/20">
                      <span className="font-body text-star/60 tracking-wider uppercase text-xs">Type</span>
                      <span className="font-body text-neon-cyan font-semibold tracking-wide">
                        {selectedBody.id.includes('asteroid')
                          ? 'ASTEROID'
                          : selectedBody.id.includes('comet')
                          ? 'COMET'
                          : 'PLANET'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-neon-cyan/20">
                      <span className="font-body text-star/60 tracking-wider uppercase text-xs">Orbit Radius</span>
                      <span className="font-body text-star font-semibold">
                        {selectedBody.orbitRadius} AU
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-neon-cyan/20">
                      <span className="font-body text-star/60 tracking-wider uppercase text-xs">Distance from Sun</span>
                      <span className="font-body text-star font-semibold">
                        {selectedBody.distance} M km
                      </span>
                    </div>
                    {selectedBody.closeApproachDate && (
                      <div className="flex justify-between items-center py-2">
                        <span className="font-body text-star/60 tracking-wider uppercase text-xs">Next Approach</span>
                        <span className="font-body text-neon-magenta font-semibold">
                          {new Date(selectedBody.closeApproachDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Filter and Unit Controls */}
              <div className="lg:col-span-2">
                <FilterPanel
                  onFilterChange={onFilterChange}
                  currentUnit={currentUnit}
                  onUnitChange={onUnitChange}
                />
              </div>
            </div>

            {/* Proximity Selector - Full Width */}
            <ProximitySelector
              sortedBodies={sortedBodies}
              selectedBody={selectedBody}
              onBodySelect={onBodySelect}
            />

            {/* Stats grid - Full Width */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
                {[
                  { label: 'Total Bodies', value: sortedBodies.length, color: '#00f0ff' },
                  {
                    label: 'Closest',
                    value: sortedBodies[0]?.name || 'N/A',
                    color: '#ff006e',
                  },
                  {
                    label: 'Avg Distance',
                    value:
                      sortedBodies.length > 0
                        ? (
                            sortedBodies.reduce((acc, b) => acc + b.distanceFromEarth, 0) /
                            sortedBodies.length
                          ).toFixed(1) + ' M km'
                        : 'N/A',
                    color: '#8338ec',
                  },
                  {
                    label: 'Monitored',
                    value: sortedBodies.filter((b) => b.closeApproachDate).length,
                    color: '#ffbe0b',
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="rounded-none p-5 text-center relative overflow-hidden group cursor-pointer"
                    whileHover={{ scale: 1.05, y: -5 }}
                    style={{
                      background: `linear-gradient(135deg, ${stat.color}15, transparent)`,
                      backdropFilter: 'blur(16px)',
                      border: `2px solid ${stat.color}40`,
                      boxShadow: `0 0 20px ${stat.color}15`,
                      clipPath: 'polygon(10% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 10%)',
                      transition: 'border 0.3s ease, box-shadow 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.border = `2px solid ${stat.color}`;
                      e.currentTarget.style.boxShadow = `0 0 40px ${stat.color}40`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.border = `2px solid ${stat.color}40`;
                      e.currentTarget.style.boxShadow = `0 0 20px ${stat.color}15`;
                    }}
                  >
                    {/* Corner accent */}
                    <div
                      className="absolute top-0 left-0 w-8 h-8 opacity-50 group-hover:opacity-70 transition-opacity"
                      style={{
                        background: `linear-gradient(135deg, ${stat.color}, transparent)`,
                        clipPath: 'polygon(0 0, 100% 0, 0 100%)',
                      }}
                    />
                    <div
                      className="font-display text-3xl font-black mb-2"
                      style={{ 
                        color: stat.color,
                        textShadow: `0 0 20px ${stat.color}80`,
                      }}
                    >
                      {stat.value}
                    </div>
                    <div className="font-body text-xs text-star/60 uppercase tracking-widest font-semibold">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
          </div>

          {/* Modal Popup for Detailed Risk Analysis */}
          <AnimatePresence>
            {showDetailedAnalysis && selectedBody && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.85)',
                  backdropFilter: 'blur(8px)',
                }}
                onClick={() => setShowDetailedAnalysis(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 50 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 50 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(5, 8, 17, 0.98), rgba(22, 27, 46, 0.98))',
                    backdropFilter: 'blur(20px)',
                    border: '2px solid rgba(0, 240, 255, 0.4)',
                    boxShadow: '0 0 60px rgba(0, 240, 255, 0.3), inset 0 0 40px rgba(0, 240, 255, 0.05)',
                    clipPath: 'polygon(30px 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%, 0 30px)',
                  }}
                >
                  {/* Modal Header with Close Button */}
                  <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-neon-cyan/20" style={{
                    background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.1), transparent)',
                    backdropFilter: 'blur(20px)',
                  }}>
                    <div>
                      <h2 className="font-display text-2xl font-bold text-neon-cyan tracking-wider uppercase">
                        Detailed Risk Analysis
                      </h2>
                      <p className="font-body text-sm text-star/60 mt-1">
                        {selectedBody.name}
                      </p>
                    </div>
                    <motion.button
                      onClick={() => setShowDetailedAnalysis(false)}
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 rounded-none"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 0, 110, 0.3), rgba(255, 0, 110, 0.1))',
                        border: '2px solid rgba(255, 0, 110, 0.6)',
                        clipPath: 'polygon(20% 0%, 100% 0%, 100% 80%, 80% 100%, 0% 100%, 0% 20%)',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <X size={24} className="text-neon-magenta" strokeWidth={3} />
                    </motion.button>
                  </div>

                  {/* Modal Content */}
                  <div className="p-6">
                    <RiskExplanationPanel selectedBody={selectedBody} />
                  </div>

                  {/* Corner accents */}
                  <div
                    className="absolute top-0 left-0 w-16 h-16 opacity-30"
                    style={{
                      background: 'linear-gradient(135deg, #00f0ff, transparent)',
                      clipPath: 'polygon(0 0, 100% 0, 0 100%)',
                    }}
                  />
                  <div
                    className="absolute bottom-0 right-0 w-16 h-16 opacity-30"
                    style={{
                      background: 'linear-gradient(135deg, transparent, #ff006e)',
                      clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
                    }}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
  );
};
