import React, { useState, useEffect } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc"; // ✅ Google Icon Added

import loginImage from "../assets/img/login.svg";
import axios from "axios";
import { authSync_api, loginApi } from "../api/authApi";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase-config";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [showResetSuccessModal, setShowResetSuccessModal] = useState(false);

  const [loginPassword, setLoginPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [googleLoading, setGoogleLoading] = useState(false);

  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null); // Clear errors when switching modes

    // Check if user is already logged in via Firebase auth state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        // User is signed in and verified, redirect to dashboard
        navigate("/dashboard/new");
      }
    });

    return () => unsubscribe();
  }, [navigate]);
  const syncUserWithBackend = async (firebaseUser, inviteCode = null) => {
    try {
      const idToken = await firebaseUser.getIdToken();

      const response = await fetch(authSync_api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          invite_code: inviteCode,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to sync user with backend");
      }

      const userData = await response.json();

      // Check if user has an organization
      if (!userData.currentOrgId) {
        // User doesn't have an organization - redirect to onboarding
        navigate("/onboarding");
      } else {
        // User has an organization - redirect to dashboard
        navigate("/dashboard/new  ");
      }

      return userData;
    } catch (error) {
      console.error("Backend sync error:", error);
      throw error;
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Google accounts are pre-verified
      await syncUserWithBackend(result.user, null);
    } catch (err) {
      console.error("Google sign-in error:", err);
      toast.error(err.message || "Failed to sign in with Google");
    } finally {
      setGoogleLoading(false);
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setError("Please enter email and password");
      return;
    }

    setLoginLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword,
      );
      // Check if email is verified
      if (!userCredential.user.emailVerified) {
        setError(
          "Please verify your email before logging in. Check your inbox for the verification link.",
        );
        await signOut(auth);
        setLoginLoading(false);
        return;
      }

      // Check for pending invite code from signup
      const pendingInviteCode = sessionStorage.getItem("pendingInviteCode");

      await syncUserWithBackend(userCredential.user, pendingInviteCode);

      // Clear the pending invite code
      sessionStorage.removeItem("pendingInviteCode");
    } catch (err) {
      console.error("Login error:", err);
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        setError("Invalid email or password");
      } else if (err.code === "auth/invalid-credential") {
        setError("Invalid credentials");
      } else {
        setError(err.message || "Failed to log in");
      }
    } finally {
      setLoginLoading(false);
    }
  };
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const email = resetEmail.trim();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    // If email is in form, proceed with reset
    await sendPasswordReset(email);
  };
  const sendPasswordReset = async (email) => {
    setResetLoading(true);

    try {
      // Validate email format first
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address");
        setResetLoading(false);
        return;
      }

      // Send password reset email
      // NOTE: Firebase will send the email even if the account doesn't exist
      // This is by design to prevent email enumeration attacks
      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/login`,
        handleCodeInApp: false,
      });

      // Show success message
      // We always show this message regardless of whether the account exists
      // This is a security best practice to prevent email enumeration
      setShowResetModal(false);
      setShowResetSuccessModal(true);
    } catch (err) {
      console.error("Password reset error:", err);

      // Handle specific error cases
      if (err.code === "auth/invalid-email") {
        toast.error("Please enter a valid email address");
      } else if (err.code === "auth/too-many-requests") {
        toast.error(
          "Too many password reset requests. Please try again later.",
        );
      } else if (err.code === "auth/network-request-failed") {
        toast.error("Network error. Please check your internet connection.");
      } else {
        // Generic error - still don't reveal if account exists
        toast.error("Failed to send password reset email. Please try again.");
      }
    } finally {
      setResetLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-4 lg:py-24 py-24">
      {/* Main Container */}
      <div className="w-full max-w-6xl bg-white shadow-2xl rounded-3xl overflow-hidden grid md:grid-cols-2">
        {/* ================= LEFT IMAGE ================= */}
        <div className="order-2 md:order-1 bg-white border-r-2 flex items-center justify-center p-10">
          <img
            src={loginImage}
            alt="Login Visual"
            className="max-h-[420px] w-full object-contain"
          />
        </div>

        {/* ================= RIGHT FORM ================= */}
        <div className="order-1 md:order-2 flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md">
            {/* Sign Up Link - Top Right */}
            <div className="flex justify-end mb-4">
              <p className="text-sm text-blue-700/70">
                Don't have an account?{" "}
                <a href="/signup" className=" font-semibold hover:underline">
                  Sign Up
                </a>
              </p>
            </div>

            <h2 className="text-3xl font-bold mb-2 ">Welcome Back</h2>

            <p className="text-slate-500 mb-8">
              Enter your credentials to access your account
            </p>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs">
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleLogin}>
              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1 text-blue-900">
                  Email
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border border-blue-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-1 text-blue-900">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full border border-blue-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 pr-12"
                  />

                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <HiEyeOff size={20} />
                    ) : (
                      <HiEye size={20} />
                    )}
                  </button>
                </div>

                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => setShowResetModal(true)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md"
              >
                {loginLoading ? "Logging In..." : "Login"}
              </button>
            </form>

            {/* ✅ Google Button Section Added (UI Only) */}
            <div className="flex items-center gap-4 my-5">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-sm text-gray-400">OR</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 border border-blue-200 py-3 rounded-lg font-medium hover:bg-blue-50 transition"
            >
              <FcGoogle size={22} />
              Sign in with Google
            </button>
          </div>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {showResetModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          onClick={() => setShowResetModal(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowResetModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold text-blue-900 mb-2">
              Reset Password
            </h3>

            <p className="text-gray-500 mb-6 text-sm">
              Enter your registered email and we'll send you a reset link.
            </p>
            <form onSubmit={handleForgotPassword}>
              <input
                type="email"
                placeholder="you@example.com"
                value={resetEmail}
                required
                onChange={(e) => setResetEmail(e.target.value)}
                disabled={resetLoading}
                className="w-full border border-blue-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 mb-5"
              />

              <button
                disabled={resetLoading || !resetEmail}
                type="submit"
                className="w-full disabled:opacity-50 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Send Reset Link
              </button>
            </form>

            <p className="text-xs text-gray-400 text-center mt-4">
              Check your inbox after submitting.
            </p>
          </div>
        </div>
      )}
      {showResetSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          {/* Modal Card */}
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.25)] border border-gray-100 p-10 animate-[fadeIn_.25s_ease-out]">
            {/* Close Button */}
            <button
              onClick={() => setShowResetSuccessModal(false)}
              className="absolute top-6 right-6 w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
            >
              <span className="text-gray-400 hover:text-gray-600 text-xl font-bold leading-none">
                ×
              </span>
            </button>

            {/* Success Icon */}
            <div className="w-20 h-20 mx-auto mb-6 bg-green-50 rounded-full flex items-center justify-center shadow-inner">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
              Password Reset Email Sent
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 text-center leading-relaxed mb-3">
              If an account exists with this email address, you will receive a
              password reset link at:
            </p>

            {/* Email Highlight */}
            <p className="text-sm font-bold text-slate-900 text-center mb-6">
              {resetEmail}
            </p>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-8">
              <p className="text-sm text-blue-900 leading-relaxed">
                <strong>Important:</strong>
                <br />
                • Check your spam folder if you don't see it
                <br />
                • The link expires in 1 hour
                <br />• If you signed up with Google, use "Continue with Google"
                instead
              </p>
            </div>

            {/* Primary Button (Blue) */}
            <button
              onClick={() => {
                setShowResetSuccessModal(false);
                setResetEmail("");
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-4 rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-blue-200"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
