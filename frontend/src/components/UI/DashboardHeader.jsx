import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Zap } from 'lucide-react';

export const DashboardHeader = ({ 
  notificationCount, 
  onNotificationClick 
}) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center justify-between mb-8"
    >
      {/* Logo and title */}
      <div className="flex items-center gap-4">
        <motion.div
          animate={{
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatDelay: 2,
          }}
          className="relative p-4 rounded-none bg-gradient-to-br from-neon-cyan via-electric-purple to-neon-magenta"
          style={{
            clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
          }}
        >
          <Zap size={28} className="text-void" strokeWidth={3} />
          <div className="absolute inset-0 bg-neon-cyan opacity-30 blur-xl" />
        </motion.div>
        <div>
          <h1 className="font-display text-3xl font-black text-white tracking-wider">
            COSMIC_WATCH
          </h1>
          <p className="font-body text-sm text-neon-cyan/60 tracking-widest uppercase mt-1">
            ▸ Solar System Surveillance
          </p>
        </div>
      </div>

      {/* Notification bell */}
      <motion.button
        whileHover={{ scale: 1.05, rotate: 15 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNotificationClick}
        className="relative p-4 rounded-none bg-nebula/50 hover:bg-neon-cyan/10 
                 border-2 border-neon-cyan/30 hover:border-neon-cyan transition-all duration-300
                 backdrop-blur-md group"
        style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 70%, 90% 100%, 0 100%)',
        }}
      >
        <Bell size={22} className="text-neon-cyan group-hover:text-neon-magenta transition-colors" strokeWidth={2.5} />
        
        {/* Notification badge */}
        {notificationCount > 0 && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 min-w-[24px] h-6 px-2 bg-neon-magenta rounded-none 
                       flex items-center justify-center font-display text-xs font-bold text-void
                       border border-neon-yellow"
              style={{
                clipPath: 'polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)',
              }}
            >
              {notificationCount}
            </motion.div>
            
            {/* Pulse animation */}
            <motion.div
              animate={{
                scale: [1, 1.8, 1],
                opacity: [0.7, 0, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-neon-magenta"
            />
          </>
        )}
      </motion.button>
    </motion.header>
  );
};
