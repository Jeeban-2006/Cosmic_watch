/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Orbitron', 'monospace'],
        'body': ['Rajdhani', 'sans-serif'],
      },
      colors: {
        void: '#050811',
        abyss: '#0d1117',
        nebula: '#161b2e',
        neon: {
          cyan: '#00f0ff',
          magenta: '#ff006e',
          yellow: '#ffbe0b',
        },
        electric: {
          blue: '#3a86ff',
          purple: '#8338ec',
        },
        star: '#f0f6fc',
        dim: '#484f58',
      },
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'glitch': 'glitchText 0.3s ease-in-out infinite',
        'scan': 'scanline 6s linear infinite',
        'grid-pulse': 'gridPulse 8s ease-in-out infinite',
        'fade-in': 'fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in': 'slideInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-30px)' },
        },
        pulseGlow: {
          '0%, 100%': { 
            boxShadow: '0 0 20px var(--color-neon-cyan), 0 0 40px var(--color-neon-cyan)',
          },
          '50%': { 
            boxShadow: '0 0 40px var(--color-neon-magenta), 0 0 80px var(--color-neon-magenta)',
          },
        },
        glitchText: {
          '0%, 100%': {
            textShadow: '2px 2px var(--color-neon-cyan), -2px -2px var(--color-neon-magenta)',
          },
          '25%': {
            textShadow: '-2px -2px var(--color-neon-cyan), 2px 2px var(--color-neon-magenta)',
          },
        },
        fadeIn: {
          from: { opacity: 0, transform: 'translateY(30px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { opacity: 0, transform: 'translateX(-40px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        gridPulse: {
          '0%, 100%': { opacity: 0.03 },
          '50%': { opacity: 0.06 },
        },
      },
      backgroundImage: {
        'gradient-cosmic': 'linear-gradient(135deg, #050811, #161b2e, #0d1117)',
        'gradient-neon': 'linear-gradient(90deg, #00f0ff, #8338ec, #ff006e)',
        'gradient-aurora': 'radial-gradient(ellipse at top, rgba(0, 240, 255, 0.15), transparent 60%), radial-gradient(ellipse at bottom right, rgba(255, 0, 110, 0.15), transparent 60%)',
      },
    },
  },
  plugins: [],
}
