import React, { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center py-32 bg-blue-50">
      {/* Signup Card */}
      <div className="w-full max-w-lg p-8 bg-white shadow-2xl rounded-2xl border border-blue-200">
        {/* Header */}
        <h2 className="text-3xl font-bold mb-4 text-center text-[#1e1e1e]">
          Create Account
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Fill in the information below to create your account
        </p>

        {/* Form */}
        <form className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-1 text-[#1e1e1e]">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition"
            />
          </div>

          {/* Email + Phone in one row */}
          <div className="flex flex-col md:flex-row md:space-x-4">
            {/* Email */}
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1 text-[#1e1e1e]">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition"
              />
            </div>

            {/* Phone */}
            <div className="flex-1 mt-4 md:mt-0">
              <label className="block text-sm font-medium mb-1 text-[#1e1e1e]">
                Phone
              </label>
              <input
                type="tel"
                placeholder="+1 234 567 890"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition"
              />
            </div>
          </div>

          {/* Password + Confirm Password in one row */}
          <div className="flex flex-col md:flex-row md:space-x-4">
            {/* Password */}
            <div className="flex-1 relative mt-4 md:mt-0">
              <label className="block text-sm font-medium mb-1 text-[#1e1e1e]">
                Password
              </label>
              <div className="relative">
                <input
                type={showPassword ? "text" : "password"}
                placeholder="********"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition pr-12"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
              </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex-1 relative mt-4 md:mt-0">
              <label className="block text-sm font-medium mb-1 text-[#1e1e1e]">
                Confirm Password
              </label>
              <div className="relative">
                <input
                type={showConfirm ? "text" : "password"}
                placeholder="********"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition pr-12"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <HiEyeOff size={20} /> : <HiEye size={20} />}
              </button>
              </div>
            </div>
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mt-4"
          >
            Sign Up
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
              Sign Up with Google
            </button>
        {/* Footer Links */}
        <div className="mt-6 text-center">
          <p className="text-gray-500">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 font-medium hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
