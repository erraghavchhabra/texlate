import React, { useState, useEffect } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc"; // ✅ Google Icon Added

import loginImage from "../assets/img/login.svg";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");

  // Close modal on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setShowModal(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

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
                <a
                  href="/signup"
                  className=" font-semibold hover:underline"
                >
                  Sign Up
                </a>
              </p>
            </div>

            <h2 className="text-3xl font-bold mb-2 ">
              Welcome Back
            </h2>

            <p className="text-slate-500 mb-8">
              Enter your credentials to access your account
            </p>

            <form className="space-y-5">

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1 text-blue-900">
                  Email
                </label>
                <input
                  type="email"
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
                    className="w-full border border-blue-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 pr-12"
                  />

                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                  </button>
                </div>

                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md"
              >
                Login
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
              className="w-full flex items-center justify-center gap-3 border border-blue-200 py-3 rounded-lg font-medium hover:bg-blue-50 transition"
            >
              <FcGoogle size={22} />
              Sign in with Google
            </button>

          </div>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
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

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-blue-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 mb-5"
            />

            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
              Send Reset Link
            </button>

            <p className="text-xs text-gray-400 text-center mt-4">
              Check your inbox after submitting.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
