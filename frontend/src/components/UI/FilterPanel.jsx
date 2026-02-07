import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, Filter } from 'lucide-react';
import { convertDistance } from '../../data/celestialData';

export const FilterPanel = ({ 
  onFilterChange, 
  currentUnit,
  onUnitChange 
}) => {
  const [distance, setDistance] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);
  const units = ['km', 'LD', 'AU'];

  const handleDistanceChange = (e) => {
    const value = e.target.value;
    setDistance(value);
    if (value) {
      setIsFiltering(true);
      onFilterChange(parseFloat(value), currentUnit);
    } else {
      setIsFiltering(false);
      onFilterChange(null, currentUnit);
    }
  };

  const handleUnitChange = (newUnit) => {
    onUnitChange(newUnit);
    if (distance) {
      onFilterChange(parseFloat(distance), newUnit);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01, y: -3 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-none p-6 relative overflow-hidden group cursor-pointer"
      style={{
        background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.1), rgba(255, 0, 110, 0.05))',
        backdropFilter: 'blur(16px)',
        border: '2px solid rgba(0, 240, 255, 0.3)',
        boxShadow: '0 0 30px rgba(0, 240, 255, 0.2)',
        clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)',
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
      {/* Active filter indicator */}
      <AnimatePresence>
        {isFiltering && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -top-3 -right-3 px-3 py-1 rounded-none bg-neon-cyan font-display text-xs font-bold text-void"
            style={{
              boxShadow: '0 0 20px rgba(0, 240, 255, 0.6)',
              clipPath: 'polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)',
            }}
          >
            <div className="flex items-center gap-2">
              <Filter size={12} />
              <span>ACTIVE</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <label className="block font-display text-xs font-bold text-neon-cyan/80 mb-4 uppercase tracking-[0.2em]">
        ▸ Filter_By_Distance
      </label>

      <div className="flex gap-3">
        {/* Distance input */}
        <div className="relative flex-1">
          <Search 
            size={18} 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neon-cyan/60" 
            strokeWidth={2.5}
          />
          <input
            type="number"
            value={distance}
            onChange={handleDistanceChange}
            placeholder="ENTER_DISTANCE..."
            className="w-full pl-12 pr-4 py-3 rounded-none bg-abyss/50 border-2 border-neon-cyan/30 
                     text-star font-body font-semibold placeholder-neon-cyan/30 focus:outline-none 
                     focus:border-neon-cyan transition-all duration-300"
            min="0"
            step="0.1"
          />
        </div>

        {/* Unit selector */}
        <div className="relative">
          <select
            value={currentUnit}
            onChange={(e) => handleUnitChange(e.target.value)}
            className="appearance-none px-6 py-3 pr-12 rounded-none bg-abyss/50 border-2 
                     border-neon-magenta/30 text-star font-body font-semibold 
                     focus:outline-none focus:border-neon-magenta 
                     transition-all duration-300 cursor-pointer"
          >
            {units.map((unit) => (
              <option key={unit} value={unit} className="bg-abyss text-star">
                {unit}
              </option>
            ))}
          </select>
          <ChevronDown 
            size={18} 
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neon-magenta/80 pointer-events-none" 
            strokeWidth={2.5}
          />
        </div>
      </div>

      {/* Unit info */}
      <div className="mt-4 text-xs text-star/50 font-body">
        {currentUnit === 'km' && '▸ 1 km = 1 kilometer'}
        {currentUnit === 'LD' && '▸ 1 LD ≈ 384,400 km (Lunar Distance)'}
        {currentUnit === 'AU' && '▸ 1 AU ≈ 149,597,871 km (Astronomical Unit)'}
      </div>
    </motion.div>
  );
};
