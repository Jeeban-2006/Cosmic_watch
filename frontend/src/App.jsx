import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Lenis from 'lenis';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Login from './components/Auth/Login';
import { SolarSystemScene } from './components/3D/SolarSystemScene';
import { Dashboard } from './components/UI/Dashboard';
import { NotificationPanel } from './components/UI/NotificationPanel';
import { useNotifications } from './hooks/useNotifications';
import {
  celestialBodies,
  sortByProximity,
  filterByDistance,
} from './data/celestialData';

const DashboardPage = () => {
  const [selectedBody, setSelectedBody] = useState(null);
  const [filteredBodies, setFilteredBodies] = useState(celestialBodies);
  const [currentUnit, setCurrentUnit] = useState('km');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const lenisRef = useRef(null);

  // Notification system with alert detection
  const {
    alerts,
    unreadCount,
    markAsViewed,
    dismissNotification,
    stats,
  } = useNotifications(celestialBodies);

  // Initialize with first asteroid selected
  useEffect(() => {
    const firstAsteroid = celestialBodies[0];
    setSelectedBody(firstAsteroid);
  }, []);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Track scroll progress
    lenis.on('scroll', ({ scroll, limit }) => {
      const progress = limit > 0 ? scroll / limit : 0;
      setScrollProgress(Math.min(progress, 1));
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  // Handle body selection
  const handleBodySelect = (body) => {
    setSelectedBody(body);
  };

  // Handle distance filter
  const handleFilterChange = (distance, unit) => {
    if (distance === null) {
      setFilteredBodies(celestialBodies);
    } else {
      const filtered = filterByDistance(celestialBodies, distance, unit);
      setFilteredBodies(filtered);
    }
  };

  // Handle unit change
  const handleUnitChange = (newUnit) => {
    setCurrentUnit(newUnit);
  };

  // Sort bodies by proximity
  const sortedBodies = sortByProximity(filteredBodies);

  // Handle notification panel open
  const handleNotificationClick = () => {
    setNotificationOpen(true);
    // Mark notifications as viewed when panel is opened
    if (alerts.length > 0) {
      markAsViewed();
    }
  };

  return (
    <div className="relative bg-void">
      {/* Scanline effect */}
      <div className="scanline-container">
        <div className="scanline" />
      </div>

      {/* Aurora gradient overlay */}
      <div className="fixed inset-0 bg-gradient-aurora pointer-events-none z-0" />

      {/* Three.js Background Scene */}
      <SolarSystemScene
        celestialBodies={filteredBodies}
        selectedBody={selectedBody}
        onBodySelect={handleBodySelect}
        scrollProgress={scrollProgress}
      />

      {/* Dashboard UI Overlay */}
      <div className="relative z-10">
        <Dashboard
          selectedBody={selectedBody}
          sortedBodies={sortedBodies}
          onBodySelect={handleBodySelect}
          onFilterChange={handleFilterChange}
          currentUnit={currentUnit}
          onUnitChange={handleUnitChange}
          notificationCount={unreadCount}
          onNotificationClick={handleNotificationClick}
        />
      </div>

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={notificationOpen}
        onClose={() => setNotificationOpen(false)}
        alerts={alerts}
        onDismiss={dismissNotification}
        unreadCount={unreadCount}
      />

      {/* Scroll indicator */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none">
        <div
          className="flex flex-col items-center gap-2 text-neon-cyan animate-float transition-opacity duration-500"
          style={{
            opacity: scrollProgress < 0.1 ? 1 : 0,
          }}
        >
          <span className="font-display text-sm font-bold tracking-widest">SCROLL_TO_EXPLORE</span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="animate-bounce"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Spacer for scrolling - extends content for camera zoom animation */}
      <div style={{ height: '11vh' }} />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
