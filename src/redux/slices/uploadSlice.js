import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  jobId: null,
  expiresAt: null,
  amount: null,
  pages: null,
  isPayable: false,
  loading: false,

  paymentCompleted: false,
  paymentStatus: null, // PENDING | SUCCESS | FAILED | CANCELLED | VERIFYING | TIMEOUT
  paymentError: null,

  jobStatus: null,
  translationProgress: 0,

  downloadUrls: null, // { pdf_url, docx_url }
};

const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    setJob: (state, action) => {
      state.jobId = action.payload.jobId;
      state.expiresAt = action.payload.expiresAt;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setPaymentStatus: (state, action) => {
      state.paymentStatus = action.payload;
    },

    setPaymentCompleted: (state, action) => {
      state.paymentCompleted = action.payload;
    },

    setPaymentError: (state, action) => {
      state.paymentError = action.payload;
    },

    setJobStatus: (state, action) => {
      state.jobStatus = action.payload;
    },

    setTranslationProgress: (state, action) => {
      state.translationProgress = action.payload;
    },

    setDownloadUrls: (state, action) => {
      state.downloadUrls = action.payload;
    },

    setAmount: (state, action) => {
      state.amount = action.payload;
    },

    setPages: (state, action) => {
      state.pages = action.payload;
    },

    setIsPayable: (state, action) => {
      state.isPayable = action.payload;
    },

    resetStore: () => initialState,
  },
});

export const {
  setJob,
  setLoading,
  setPaymentStatus,
  setPaymentCompleted,
  setPaymentError,
  setJobStatus,
  setTranslationProgress,
  setDownloadUrls,
  setAmount,
  setPages,
  setIsPayable,
  resetStore,
} = uploadSlice.actions;

export default uploadSlice.reducer;