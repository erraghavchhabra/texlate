import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { fetchUserProfile } from "../api/organizationApi";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute - Guards dashboard routes from unauthenticated access.
 * Uses Firebase auth state (not localStorage) to determine authentication.
 * Redirects to /login if not authenticated, or /onboarding if no organization.
 */
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { user, setUser } = useApp();
  const { isAuthenticated, isAuthLoading, logout: authLogout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      // Wait for Firebase auth to initialize
      if (isAuthLoading) {
        return;
      }

      // If not authenticated via Firebase, no need to fetch user data
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      // If we have Firebase auth but no user data, fetch from backend
      if (isAuthenticated && !user) {
        try {
          const userData = await fetchUserProfile();
          setUser(userData);
          setAuthError(false);
        } catch (error) {
          console.error("Failed to load user data:", error);
          // If fetch fails (likely 401 due to invalid token), log out
          setAuthError(true);
          await authLogout();
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadUserData();
  }, [isAuthenticated, isAuthLoading, user, setUser, authLogout]);

  // Show loading state while Firebase auth is initializing or fetching user data
  if (isAuthLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // If auth error occurred (token validation failed), redirect to login
  if (authError) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If not authenticated via Firebase, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated but no organization, redirect to onboarding
  if (user && !user.currentOrgId) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
