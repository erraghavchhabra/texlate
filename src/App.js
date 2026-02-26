import React, { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import WhyUs from "./pages/WhyUs";
import Upload from "./pages/Upload";
import Legal from "./pages/Legal";
import HelpCenter from "./pages/HelpCenter";

import DashboardLayout from "./dashboard/DashboardLayout";
import NewTranslation from "./dashboardPages/NewTranslation";
import History from "./dashboardPages/History";
import UserManagement from "./dashboardPages/UserManagement";
import Wallet from "./dashboardPages/Wallet";

import useSplitTextGSAP from "./animations/useSplitTextGSAP";
import WOW from "wowjs";
import "animate.css";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./providers/ProtectedRoute";
import OnboardingPage from "./pages/OnboardingPage";
import NotFound from "./pages/NotFound";

export default function App() {

  useSplitTextGSAP();
  const location = useLocation();

  const isDashboard = location.pathname.startsWith("/dashboard");

  useEffect(() => {
    new WOW.WOW({ live: false }).init();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Scroll reset on every route change */}
      <ScrollToTop />
      <Toaster position="top-right" reverseOrder={false} />
      {/* Show Navbar only on public pages */}
      {!isDashboard && <Navbar />}

      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/why-choose-us" element={<WhyUs />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/legal/*" element={<Legal />} />
          <Route path="/help/*" element={<HelpCenter />} />

          <Route path="/onboarding" element={<OnboardingPage />} />
          {/* not found page */}
          <Route path="*" element={<NotFound />} />
          {/* Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                {" "}
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route
              path="new"
              element={
                <ProtectedRoute>
                  <NewTranslation />
                </ProtectedRoute>
              }
            />
            <Route
              path="history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />
            <Route
              path="users-management"
              element={
                <ProtectedRoute>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="wallet"
              element={
                <ProtectedRoute>
                  <Wallet />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </main>

      {/* Hide Footer in Dashboard */}
      {!isDashboard && location.pathname !== "/" && <Footer />}
    </div>
  );
}
