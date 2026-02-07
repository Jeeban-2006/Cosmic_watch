import { motion } from 'framer-motion';
import { LogOut, User, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserProfile = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative group"
    >
      <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-nebula/50 border border-neon-cyan/30 hover:border-neon-cyan/60 transition-all duration-300">
        <img
          src={user.picture}
          alt={user.name}
          className="w-8 h-8 rounded-full border-2 border-neon-cyan/50"
        />
        <span className="text-sm text-white font-medium hidden md:block">
          {user.name}
        </span>
      </button>

      {/* Dropdown */}
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 0, y: -10, scale: 0.95 }}
        whileHover={{ opacity: 1, y: 0, scale: 1 }}
        className="absolute right-0 mt-2 w-64 rounded-xl bg-nebula/95 backdrop-blur-xl border border-neon-cyan/30 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50"
      >
        <div className="p-4 border-b border-neon-cyan/20">
          <div className="flex items-center gap-3">
            <img
              src={user.picture}
              alt={user.name}
              className="w-12 h-12 rounded-full border-2 border-neon-cyan/50"
            />
            <div>
              <p className="text-white font-semibold">{user.name}</p>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="p-2">
          <div className="px-3 py-2 flex items-center gap-2 text-sm text-gray-400">
            <User className="w-4 h-4" />
            <span>Profile</span>
          </div>
          <div className="px-3 py-2 flex items-center gap-2 text-sm text-gray-400">
            <Mail className="w-4 h-4" />
            <span>{user.email}</span>
          </div>
        </div>

        <div className="p-2 border-t border-neon-cyan/20">
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UserProfile;
