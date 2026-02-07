import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Bell, Activity, Calendar, Search, ChevronRight } from 'lucide-react';
import { DashboardHeader } from './DashboardHeader';
import { RiskExplanationPanel } from './RiskExplanationPanel';
import { calculateRiskScore } from '../../data/celestialData';

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

  // Get risk level badge color
  const getRiskColor = (level) => {
    switch (level) {
      case 'HIGH': return '#ff0000';
      case 'MODERATE': return '#ffaa00';
      case 'LOW': return '#4ade80';
      default: return '#6b7280';
    }
  };

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
                <div className="font-display text-4xl font-black text-neon-magenta flex items-center gap-2">
                  {stats.highRiskAsteroids}
                  <AlertTriangle size={28} className="text-neon-magenta animate-pulse" />
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
              {/* Asteroid Feed Table */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-none overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.05), transparent)',
                  backdropFilter: 'blur(16px)',
                  border: '2px solid rgba(0, 240, 255, 0.2)',
                  clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)',
                }}
              >
                <div className="p-4 border-b border-neon-cyan/20">
                  <h3 className="font-display text-lg font-bold text-star uppercase tracking-wider">
                    Asteroid Feed
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-neon-cyan/20">
                        <th className="px-4 py-3 text-left font-display text-xs uppercase tracking-wider text-star/60">Name</th>
                        <th className="px-4 py-3 text-left font-display text-xs uppercase tracking-wider text-star/60">Closest Approach</th>
                        <th className="px-4 py-3 text-left font-display text-xs uppercase tracking-wider text-star/60">Size (km)</th>
                        <th className="px-4 py-3 text-left font-display text-xs uppercase tracking-wider text-star/60">Velocity (km/s)</th>
                        <th className="px-4 py-3 text-left font-display text-xs uppercase tracking-wider text-star/60">Distance (km)</th>
                        <th className="px-4 py-3 text-left font-display text-xs uppercase tracking-wider text-star/60">Risk Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedBodies.slice(0, 10).map((body, index) => {
                        const riskData = calculateRiskScore(body);
                        const riskColor = getRiskColor(riskData?.level);
                        return (
                          <motion.tr
                            key={body.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.05 }}
                            onClick={() => onBodySelect(body)}
                            className="border-b border-star/10 hover:bg-neon-cyan/5 cursor-pointer transition-colors"
                            style={{
                              backgroundColor: selectedBody?.id === body.id ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
                            }}
                          >
                            <td className="px-4 py-3 font-body text-sm text-neon-cyan">
                              <ChevronRight size={16} className="inline mr-1" />
                              {body.name}
                            </td>
                            <td className="px-4 py-3 font-body text-sm text-star">
                              {body.closeApproachDate ? new Date(body.closeApproachDate).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="px-4 py-3 font-body text-sm text-star">
                              {(body.radius * 2).toFixed(2)}
                            </td>
                            <td className="px-4 py-3 font-body text-sm text-star">
                              {body.velocity.toFixed(1)} km/s
                            </td>
                            <td className="px-4 py-3 font-body text-sm text-star">
                              {body.distanceFromEarth.toLocaleString()} km
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className="px-3 py-1 rounded-none font-display text-xs font-bold uppercase tracking-wider"
                                style={{
                                  backgroundColor: `${riskColor}20`,
                                  border: `1px solid ${riskColor}`,
                                  color: riskColor,
                                }}
                              >
                                {riskData?.level || 'N/A'}
                              </span>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </motion.div>

              {/* Risk Analysis Section */}
              {selectedBody && selectedRiskData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="rounded-none p-6"
                  style={{
                    background: `linear-gradient(135deg, ${getRiskColor(selectedRiskData.level)}15, transparent)`,
                    backdropFilter: 'blur(16px)',
                    border: `2px solid ${getRiskColor(selectedRiskData.level)}40`,
                    clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)',
                  }}
                >
                  <h3 className="font-display text-lg font-bold text-star uppercase tracking-wider mb-4">
                    Risk Analysis
                  </h3>
                  <div className="flex items-center gap-6">
                    {/* Gauge Visualization */}
                    <div className="relative w-48 h-24">
                      <svg viewBox="0 0 200 100" className="w-full h-full">
                        {/* Background arc */}
                        <path
                          d="M 20 90 A 80 80 0 0 1 180 90"
                          fill="none"
                          stroke="rgba(255, 255, 255, 0.1)"
                          strokeWidth="20"
                          strokeLinecap="round"
                        />
                        {/* Risk arc */}
                        <path
                          d="M 20 90 A 80 80 0 0 1 180 90"
                          fill="none"
                          stroke={getRiskColor(selectedRiskData.level)}
                          strokeWidth="20"
                          strokeLinecap="round"
                          strokeDasharray={`${(selectedRiskData.score / 100) * 251} 251`}
                        />
                        {/* Center text */}
                        <text
                          x="100"
                          y="75"
                          textAnchor="middle"
                          className="font-display text-2xl font-black"
                          fill={getRiskColor(selectedRiskData.level)}
                        >
                          {selectedRiskData.score}
                        </text>
                      </svg>
                      <div className="absolute bottom-0 w-full text-center">
                        <span
                          className="font-display text-xs font-bold uppercase tracking-wider"
                          style={{ color: getRiskColor(selectedRiskData.level) }}
                        >
                          {selectedRiskData.level}
                        </span>
                      </div>
                    </div>
                    {/* Metrics */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <span className="font-body text-xs text-star/60 uppercase">Size:</span>
                        <span className="font-body text-sm text-star ml-2">{(selectedBody.radius * 2).toFixed(2)} km</span>
                      </div>
                      <div>
                        <span className="font-body text-xs text-star/60 uppercase">Velocity:</span>
                        <span className="font-body text-sm text-star ml-2">{selectedBody.velocity.toFixed(1)} km/s</span>
                      </div>
                      <div>
                        <span className="font-body text-xs text-star/60 uppercase">Distance:</span>
                        <span className="font-body text-sm text-star ml-2">{selectedBody.distanceFromEarth.toLocaleString()} km</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Column - Featured Asteroid + Alerts */}
            <div className="space-y-6">
              {/* Featured Asteroid */}
              {selectedBody && selectedRiskData && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-none p-6 relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${getRiskColor(selectedRiskData.level)}15, ${getRiskColor(selectedRiskData.level)}05)`,
                    backdropFilter: 'blur(16px)',
                    border: `2px solid ${getRiskColor(selectedRiskData.level)}40`,
                    clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)',
                  }}
                >
                  <h3 className="font-display text-sm font-bold text-star/60 uppercase tracking-wider mb-2">
                    Featured Asteroid
                  </h3>
                  <h2 className="font-display text-2xl font-black text-neon-cyan mb-6 tracking-wider">
                    {selectedBody.name}
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-star/10">
                      <span className="font-body text-xs text-star/60 uppercase">Closest Approach:</span>
                      <span className="font-body text-sm text-star font-semibold">
                        {selectedBody.closeApproachDate ? new Date(selectedBody.closeApproachDate).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-star/10">
                      <span className="font-body text-xs text-star/60 uppercase">Size:</span>
                      <span className="font-body text-sm text-star font-semibold">
                        {(selectedBody.radius * 2).toFixed(2)} km
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-star/10">
                      <span className="font-body text-xs text-star/60 uppercase">Velocity:</span>
                      <span className="font-body text-sm text-star font-semibold">
                        {selectedBody.velocity.toFixed(1)} km/s
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-star/10">
                      <span className="font-body text-xs text-star/60 uppercase">Distance:</span>
                      <span className="font-body text-sm text-star font-semibold">
                        {selectedBody.distanceFromEarth.toLocaleString()} km
                      </span>
                    </div>
                  </div>

                  {/* Risk Score Badge */}
                  <div className="mt-6 flex items-center justify-between">
                    <span className="font-body text-xs text-star/60 uppercase">Risk Score:</span>
                    <div className="flex items-center gap-3">
                      <span
                        className="font-display text-3xl font-black"
                        style={{ color: getRiskColor(selectedRiskData.level) }}
                      >
                        {selectedRiskData.score}
                      </span>
                      <span
                        className="px-3 py-1 rounded-none font-display text-sm font-bold uppercase tracking-wider"
                        style={{
                          backgroundColor: `${getRiskColor(selectedRiskData.level)}30`,
                          border: `2px solid ${getRiskColor(selectedRiskData.level)}`,
                          color: getRiskColor(selectedRiskData.level),
                        }}
                      >
                        {selectedRiskData.level}
                      </span>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <motion.button
                    onClick={() => setShowDetailedAnalysis(true)}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-6 w-full px-6 py-3 rounded-none font-display text-sm font-bold uppercase tracking-wider"
                    style={{
                      background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.3), rgba(0, 240, 255, 0.1))',
                      border: '2px solid rgba(0, 240, 255, 0.6)',
                      color: '#00f0ff',
                      clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
                    }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>View Details</span>
                      <ChevronRight size={16} />
                    </div>
                  </motion.button>
                </motion.div>
              )}

              {/* Alerts Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-none overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 0, 110, 0.05), transparent)',
                  backdropFilter: 'blur(16px)',
                  border: '2px solid rgba(255, 0, 110, 0.2)',
                  clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)',
                }}
              >
                <div className="p-4 border-b border-neon-magenta/20">
                  <h3 className="font-display text-lg font-bold text-star uppercase tracking-wider">
                    Alerts
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  {sortedBodies.slice(0, 3).map((body, index) => {
                    const riskData = calculateRiskScore(body);
                    if (!riskData || riskData.level === 'LOW') return null;
                    return (
                      <motion.div
                        key={body.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        onClick={() => onBodySelect(body)}
                        className="flex items-center gap-3 p-3 rounded-none cursor-pointer hover:bg-neon-magenta/5 transition-colors"
                        style={{
                          background: `linear-gradient(135deg, ${getRiskColor(riskData.level)}10, transparent)`,
                          border: `1px solid ${getRiskColor(riskData.level)}30`,
                        }}
                      >
                        <AlertTriangle size={20} style={{ color: getRiskColor(riskData.level) }} />
                        <div className="flex-1">
                          <p className="font-body text-sm text-star font-semibold">{body.name}</p>
                          <p className="font-body text-xs text-star/60">
                            Alert: Asteroid {body.name} - {riskData.level} Risk
                          </p>
                        </div>
                        <ChevronRight size={16} className="text-star/40" />
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
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
