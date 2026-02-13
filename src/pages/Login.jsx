import React, { useState, useEffect } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");

  // Close modal on ESC key (good UX)
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setShowModal(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      
      {/* Login Card */}
      <div className="w-full max-w-md p-8 bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl border border-blue-100">
        
        {/* Header */}
        <h2 className="text-3xl font-bold mb-2 text-center text-blue-900">
          Welcome Back
        </h2>
        <p className="text-center text-blue-700/70 mb-8">
          Enter your credentials to access your account
        </p>

        {/* Form */}
        <form className="space-y-5">
          
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1 text-blue-900">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full border border-blue-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
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
                className="w-full border border-blue-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition pr-12"
              />

              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
              </button>
            </div>

            {/* Forgot Password */}
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
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md hover:shadow-lg"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-blue-700/70">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-600 font-semibold hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-blue-100 p-8 relative animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>

            {/* Title */}
            <h3 className="text-2xl font-bold text-blue-900 mb-2">
              Reset Password
            </h3>

            <p className="text-gray-500 mb-6 text-sm">
              Enter your registered email and we'll send you a reset link.
            </p>

            {/* Email */}
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-blue-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition mb-5"
            />

            {/* Button */}
            <button
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
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
