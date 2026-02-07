import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Rocket, Shield, Globe2, TrendingUp } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();

  const features = [
    {
      icon: Rocket,
      title: 'Real-Time Tracking',
      description: 'Monitor Near-Earth Objects in real-time',
    },
    {
      icon: Shield,
      title: 'Risk Analysis',
      description: 'AI-powered threat assessment',
    },
    {
      icon: Globe2,
      title: '3D Visualization',
      description: 'Interactive solar system view',
    },
    {
      icon: TrendingUp,
      title: 'Predictive Analytics',
      description: 'Advanced trajectory predictions',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-void via-abyss to-nebula flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0,240,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,240,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'grid-flow 20s linear infinite'
        }} />
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-neon-cyan rounded-full filter blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-neon-magenta rounded-full filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center"
      >
        {/* Left side - Branding and features */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-neon-cyan via-electric-blue to-neon-magenta bg-clip-text text-transparent">
              COSMIC WATCH
            </h1>
            <p className="text-xl text-gray-300 font-light">
              Advanced Near-Earth Object Monitoring System
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 gap-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="p-4 rounded-lg bg-gradient-to-br from-nebula/50 to-abyss/50 border border-neon-cyan/20 backdrop-blur-sm"
              >
                <feature.icon className="w-8 h-8 text-neon-cyan mb-2" />
                <h3 className="text-sm font-semibold text-white mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Right side - Login card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/20 to-neon-magenta/20 blur-xl rounded-3xl" />
          
          <div className="relative bg-gradient-to-br from-nebula/80 to-abyss/80 backdrop-blur-xl rounded-2xl p-8 border border-neon-cyan/30 shadow-2xl">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="inline-block p-4 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-magenta/20 mb-4"
              >
                <Shield className="w-12 h-12 text-neon-cyan" />
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-400">
                Sign in to access the monitoring dashboard
              </p>
            </div>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              onClick={login}
              className="w-full group relative overflow-hidden rounded-xl p-4 bg-white hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 to-neon-magenta/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative flex items-center justify-center gap-3">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-gray-800 font-semibold text-lg">
                  Continue with Google
                </span>
              </div>
            </motion.button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-6 text-center"
            >
              <p className="text-xs text-gray-500">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </p>
            </motion.div>

            {/* Decorative elements */}
            <div className="absolute -top-2 -right-2 w-20 h-20 bg-neon-cyan/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-2 -left-2 w-20 h-20 bg-neon-magenta/20 rounded-full blur-2xl" />
          </div>
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes grid-flow {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(50px);
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
