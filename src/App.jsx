import React, { useState, useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { AppProvider } from "./context/AppContext";
import { LanguageProvider } from "./context/LanguageContext";
import BottomNavigation from "./components/BottomNavigation";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingSpinner from "./components/LoadingSpinner";
import GlobalLoader from "./components/GlobalLoader";
import SuspenseFallback from "./components/SuspenseFallback";
import PWAInstallButton from "./components/PWAInstallButton";
import ScrollToTop from "./components/ScrollToTop";
import OfflineIndicator from "./components/OfflineIndicator";
import { resourcePreloader } from "./utils/preloader";
const OnboardingModal = lazy(() => import("./components/OnboardingModal"));
const HomePage = lazy(() => import("./pages/HomePage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const StoriesPage = lazy(() => import("./pages/StoriesPage"));
const WikiPage = lazy(() => import("./pages/WikiPage"));
const WikiDetailPage = lazy(() => import("./pages/WikiDetailPage"));
const GamesPage = lazy(() => import("./pages/GamesPage"));
import "./index.css";

function App() {
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);

  useEffect(() => {
    // Show onboarding only once for first-time users (in all environments)
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
    if (!hasSeenOnboarding) {
      const timer = setTimeout(() => {
        setShowOnboardingModal(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleOnboardingClose = () => {
    setShowOnboardingModal(false);
    localStorage.setItem("hasSeenOnboarding", "true");
  };
  return (
    <LanguageProvider>
      <UserProvider>
        <AppProvider>
          <Router
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            <ScrollToTop />
            <div className="App">
              <GlobalLoader />
              <PWAInstallButton />
              <OfflineIndicator />
              <Suspense fallback={<SuspenseFallback />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute requireAuth={true}>
                        <DashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/stories" element={<StoriesPage />} />
                  <Route path="/wiki" element={<WikiPage />} />
                  <Route path="/wiki/:id" element={<WikiDetailPage />} />
                  <Route path="/games" element={<GamesPage />} />
                </Routes>
              </Suspense>
              <BottomNavigation />

              {/* Onboarding Modal */}
              <Suspense fallback={<SuspenseFallback />}>
                <OnboardingModal
                  isOpen={showOnboardingModal}
                  onClose={handleOnboardingClose}
                />
              </Suspense>
            </div>
          </Router>
        </AppProvider>
      </UserProvider>
    </LanguageProvider>
  );
}

export default App;
