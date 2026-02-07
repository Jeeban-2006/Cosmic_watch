import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Navigation, Eye, Target } from 'lucide-react';

/**
 * Proximity Selector Component
 * 
 * PURPOSE:
 * - Displays dropdown list of all celestial objects sorted by proximity
 * - Allows user to select an asteroid to view details and highlight in 3D scene
 * - Shows visual feedback for current selection
 * 
 * SELECTION BEHAVIOR:
 * 1. Click asteroid in dropdown → Updates selectedBody state
 * 2. State flows to SolarSystemScene → Planet component receives isSelected prop
 * 3. Planet component applies visual highlighting (glow, ring, bright trail)
 * 4. UI shows selected item with cyan background and "VIEWING" badge
 * 
 * VISUAL FEEDBACK:
 * - Selected item: Cyan background, left border, "VIEWING" badge
 * - Hover: Magenta tint, cursor pointer
 * - Color indicators: Diamond shape with asteroid color + glow
 */
export const ProximitySelector = ({ 
  sortedBodies, 
  selectedBody, 
  onBodySelect 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.01, y: -3 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <label className="block font-display text-xs font-bold text-neon-magenta/80 mb-3 uppercase tracking-[0.2em]">
          ▸ Proximity_Selector
        </label>

        {/* Dropdown trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-5 py-4 rounded-none 
                   bg-nebula/40 border-2 border-neon-magenta/30 hover:border-neon-magenta 
                   hover:shadow-[0_0_30px_rgba(255,0,110,0.3)] transition-all duration-300 group"
          style={{
            clipPath: 'polygon(15px 0, 100% 0, 100% 100%, 0 100%, 0 15px)',
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-3 h-3"
              style={{ 
                backgroundColor: selectedBody?.color || '#888',
                boxShadow: `0 0 10px ${selectedBody?.color || '#888'}`,
                clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              }}
            />
            <span className="text-star font-body font-bold tracking-wide group-hover:text-neon-magenta transition-colors">
              {selectedBody?.name || 'SELECT_CELESTIAL_BODY'}
            </span>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <ChevronDown size={22} className="text-neon-magenta/80" strokeWidth={2.5} />
          </motion.div>
        </button>
      </motion.div>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-30 w-full mt-3 rounded-none overflow-hidden shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(13, 17, 23, 0.98), rgba(22, 27, 46, 0.98))',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(255, 0, 110, 0.4)',
              boxShadow: '0 0 40px rgba(255, 0, 110, 0.3)',
              clipPath: 'polygon(10px 0, 100% 0, 100% 100%, 0 100%, 0 10px)',
            }}
          >
            <div className="max-h-80 overflow-y-auto">
              {sortedBodies.map((body, index) => {
                const isCurrentlySelected = selectedBody?.id === body.id;
                
                return (
                  <motion.button
                    key={body.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04, duration: 0.3 }}
                    onClick={() => {
                      onBodySelect(body);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-5 py-4 
                             hover:bg-neon-magenta/10 transition-all duration-200 border-l-4 relative group
                             ${isCurrentlySelected ? 'bg-neon-cyan/15 border-neon-cyan' : 'border-transparent hover:border-neon-magenta/30'}`}
                  >
                    {/* Selection indicator pulse (only for selected item) */}
                    {isCurrentlySelected && (
                      <motion.div
                        className="absolute inset-0 bg-neon-cyan/5"
                        animate={{ opacity: [0.3, 0.1, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                    
                    <div className="flex items-center gap-4 relative z-10">
                      {/* Color indicator diamond */}
                      <motion.div
                        className="w-3 h-3 flex-shrink-0"
                        animate={isCurrentlySelected ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        style={{ 
                          backgroundColor: body.color,
                          boxShadow: isCurrentlySelected 
                            ? `0 0 15px ${body.color}, 0 0 30px ${body.color}40`
                            : `0 0 8px ${body.color}`,
                          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                        }}
                      />
                      <div className="text-left">
                        <div className={`font-body font-bold tracking-wide flex items-center gap-2
                                      ${isCurrentlySelected ? 'text-neon-cyan' : 'text-star'}`}>
                          {body.name}
                          {/* "VIEWING" badge for selected item */}
                          {isCurrentlySelected && (
                            <motion.span
                              initial={{ scale: 0, rotate: -45 }}
                              animate={{ scale: 1, rotate: 0 }}
                              className="px-2 py-0.5 rounded-none font-display text-xs font-black bg-neon-cyan/20 
                                       text-neon-cyan border border-neon-cyan/50"
                              style={{
                                clipPath: 'polygon(3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%, 0 3px)',
                              }}
                            >
                              VIEWING
                            </motion.span>
                          )}
                        </div>
                        <div className="text-xs text-neon-cyan/60 font-body mt-0.5">
                          {body.distanceFromEarth.toFixed(2)} M km
                        </div>
                      </div>
                    </div>
                    
                    {/* Icon indicator */}
                    <div className="flex items-center gap-2 relative z-10">
                      {isCurrentlySelected ? (
                        <Eye 
                          size={16} 
                          className="text-neon-cyan flex-shrink-0" 
                          strokeWidth={2.5}
                        />
                      ) : (
                        <Target 
                          size={16} 
                          className="text-neon-magenta/30 group-hover:text-neon-magenta/70 flex-shrink-0 transition-colors" 
                          strokeWidth={2}
                        />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
