import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import LoginModal from './LoginModal';

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { currentUser } = useUser();
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (requireAuth && !currentUser) {
      const timer = setTimeout(() => {
        setShowLoginModal(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentUser, requireAuth]);

  if (requireAuth && !currentUser) {
    return (
      <>
        <div className="mobile-container relative pb-32 md:pb-24 flex items-center justify-center min-h-screen">
          <div className="text-center px-6">
            <div className="text-6xl mb-6">🔒</div>
            <h2 className="text-2xl font-bold text-accent-yellow mb-4">
              Access Restricted
            </h2>
            <p className="text-text-light mb-6">
              Please log in to access your dashboard and track your progress.
            </p>
            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-gradient-to-r from-accent-orange to-accent-yellow hover:from-accent-orange/90 hover:to-accent-yellow/90 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg animate-pulse"
            >
              🚀 Login to Continue
            </button>
          </div>
        </div>
        
        <LoginModal 
          isOpen={showLoginModal} 
          onClose={() => setShowLoginModal(false)} 
        />
      </>
    );
  }

  return children;
};

export default ProtectedRoute;