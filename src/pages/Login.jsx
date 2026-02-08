import React, { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      {/* Login Card */}
      <div className="w-full max-w-md p-8 bg-white shadow-2xl rounded-2xl border border-blue-200">
        {/* Header */}
        <h2 className="text-3xl font-bold mb-2 text-center text-[#1e1e1e]">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Enter your credentials to access your account
        </p>

        {/* Form */}
        <form className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1 text-[#1e1e1e]">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium mb-1 text-[#1e1e1e]">
              Password
            </label>
            <div class="relative">
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

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 text-center">
          <p className="text-gray-500">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-600 font-medium hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
