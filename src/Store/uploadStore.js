import { create } from "zustand";

export const useUploadStore = create((set) => ({
  // Initial states
  jobId: null,
  expiresAt: null,
  amount: null,
  pages: null,
  isPayable: false,
  loading: false,
  paymentCompleted: false,
  paymentStatus: null,
  paymentError: null,
  jobStatus: null,
  translationProgress: 0,
  downloadUrls: null,

  // Actions
  setJob: (jobId, expiresAt) =>
    set({
      jobId,
      expiresAt,
    }),

  setLoading: (loading) =>
    set({
      loading,
    }),

  resetStore: () =>
    set({
      jobId: null,
      expiresAt: null,
      amount: null,
      pages: null,
      isPayable: false,
      loading: false,
      paymentCompleted: false,
      paymentStatus: null,
      paymentError: null,
      jobStatus: null,
      translationProgress: 0,
      downloadUrls: null,
    }),
}));
