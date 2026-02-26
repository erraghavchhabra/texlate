import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const mainRef = useRef(null);

  useEffect(() => {
    // Check if user is already logged in via Firebase auth state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        // User is signed in and verified, redirect to dashboard
        navigate("/dashboard/new");
      }
    });

    return () => unsubscribe();
  }, [navigate]);
  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      inviteCode: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string()
        .min(3, "Full name must be at least 3 characters")
        .required("Full name is required"),

      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),

      phone: Yup.string()
        .matches(/^[0-9+ ]+$/, "Invalid phone number")
        .min(8, "Phone number is too short")
        .required("Phone number is required"),

      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),

      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm password is required"),

      inviteCode: Yup.string().optional(),
    }),
    onSubmit: async (values) => {
      setLoading(true);

      try {
        // Create the user account
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password,
        );

        // Update display name
        await updateProfile(userCredential.user, {
          displayName: values.fullName,
        });

        // Send verification email with action code settings
        await sendEmailVerification(userCredential.user, {
          url: `${window.location.origin}/login?verified=true`,
          handleCodeInApp: false,
        });

        // Store the invite code temporarily if provided
        if (values.inviteCode) {
          sessionStorage.setItem("pendingInviteCode", values.inviteCode);
        }

        // Sign out the user until they verify their email
        await signOut(auth);

        // Show verification message
        setVerificationEmail(values.email);
        setShowVerificationMessage(true);

        // Clear form
        formik.resetForm();
      } catch (err) {
        console.error("Sign up error:", err);
        if (err.code === "auth/email-already-in-use") {
          toast.error("This email is already registered");
        } else if (err.code === "auth/weak-password") {
          toast.error("Password is too weak");
        } else {
          toast.error(err.message || "Failed to create account");
        }
      } finally {
        setLoading(false);
      }
    },
  });
  const syncUserWithBackend = async (firebaseUser, inviteCode = null) => {
    try {
      const idToken = await firebaseUser.getIdToken();

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/sync`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            invite_code: inviteCode,
          }),
        },
      );

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
        navigate("/dashboard/new");
      }

      return userData;
    } catch (error) {
      console.error("Backend sync error:", error);
      throw error;
    }
  };
  const handleGoogleSignIn = async () => {
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Google accounts are pre-verified
      await syncUserWithBackend(result.user, null);
    } catch (err) {
      console.error("Google sign-in error:", err);
      toast.error(err.message || "Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  };
  // Verification message screen
  if (showVerificationMessage) {
    return (
      <div
        ref={mainRef}
        className="min-h-screen bg-[#FBFBFB] flex flex-col items-center justify-center font-sans selection:bg-black selection:text-white px-6 py-12"
      >
        <div className="w-full max-w-[400px]">
          <div className="bg-white border border-gray-100 rounded-[32px] p-9 shadow-[0_8px_30px_rgb(0,0,0,0.02)] text-center">
            <div className="reveal-node w-16 h-16 mx-auto mb-6 bg-green-50 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>

            <h2 className="reveal-node text-2xl font-bold text-slate-900 tracking-tight mb-3">
              Verify Your Email
            </h2>

            <p className="reveal-node text-sm text-gray-600 mb-2 leading-relaxed">
              We've sent a verification link to:
            </p>
            <p className="reveal-node text-sm font-bold text-slate-900 mb-6">
              {verificationEmail}
            </p>

            <div className="reveal-node bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
              <p className="text-xs text-blue-900 leading-relaxed">
                <strong>Next steps:</strong>
                <br />
                1. Check your email inbox (and spam folder)
                <br />
                2. Click the verification link in the email
                <br />
                3. Return here and log in with your credentials
              </p>
            </div>

            <button
              onClick={() => {
                setShowVerificationMessage(false);
                navigate("/login");
              }}
              className="reveal-node w-full bg-slate-900 hover:bg-black text-white text-[11px] font-black py-3.5 rounded-xl transition-all active:scale-[0.98] tracking-widest shadow-lg mb-3"
            >
              GO TO LOGIN
            </button>

            <p className="reveal-node text-xs text-gray-500 mt-4">
              Didn't receive the email?{" "}
              <button
                onClick={() => {
                  toast(
                    (t) => (
                      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-2xl max-w-sm w-full text-center">
                        <p className="text-xs text-gray-600 leading-relaxed mb-4">
                          Please check your spam folder first. If you still
                          can't find it, contact support for assistance.
                        </p>
                        <button
                          onClick={() => toast.dismiss(t.id)}
                          className="w-full bg-slate-900 hover:bg-black text-white text-[11px] font-black py-3 rounded-xl transition-all active:scale-[0.98] tracking-widest shadow-lg"
                        >
                          OK
                        </button>
                      </div>
                    ),
                    {
                      duration: Infinity,
                      position: "top-center",
                      style: {
                        background: "transparent",
                        boxShadow: "none",
                      },
                    },
                  );
                }}
                className="text-blue-600 font-bold hover:underline"
              >
                Contact Support
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex items-center justify-center py-32 bg-blue-50">
      <div className="w-full max-w-lg p-8 bg-white shadow-2xl rounded-2xl border border-blue-200">
        <h2 className="text-3xl font-bold mb-4 text-center text-[#1e1e1e]">
          Create Account
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Fill in the information below to create your account
        </p>

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="John Doe"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.fullName}
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-1 focus:ring-blue-600"
            />
            {formik.touched.fullName && formik.errors.fullName && (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.fullName}
              </p>
            )}
          </div>

          {/* Email + Phone */}
          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-1 focus:ring-blue-600"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.email}
                </p>
              )}
            </div>

            <div className="flex-1 mt-4 md:mt-0">
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                placeholder="+1 234 567 890"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-1 focus:ring-blue-600"
              />
              {formik.touched.phone && formik.errors.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.phone}
                </p>
              )}
            </div>
          </div>

          {/* Password + Confirm */}
          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="flex-1 relative">
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="********"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg pr-12 focus:ring-1 focus:ring-blue-600"
              />
              <button
                type="button"
                className="absolute right-3 top-10 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <HiEyeOff /> : <HiEye />}
              </button>
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.password}
                </p>
              )}
            </div>

            <div className="flex-1 relative mt-4 md:mt-0">
              <label className="block text-sm font-medium mb-1">
                Confirm Password
              </label>
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="********"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg pr-12 focus:ring-1 focus:ring-blue-600"
              />
              <button
                type="button"
                className="absolute right-3 top-10 text-gray-500"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <HiEyeOff /> : <HiEye />}
              </button>
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.confirmPassword}
                  </p>
                )}
            </div>
          </div>

          {/* Invite Code */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Invite Code (optional)
            </label>
            <input
              type="text"
              name="inviteCode"
              placeholder="invite code"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.inviteCode}
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-1 focus:ring-blue-600"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mt-4"
          >
            Sign Up
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-5">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-sm text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 border border-blue-200 py-3 rounded-lg font-medium hover:bg-blue-50 transition"
        >
          <FcGoogle size={22} />
          Sign Up with Google
        </button>

        <div className="mt-6 text-center">
          <p className="text-gray-500">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
