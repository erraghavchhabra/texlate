import { useEffect, useRef, useState } from "react";
import {
  Upload,
  FileText,
  Trash2,
  Calculator,
  Wallet,
  Sparkles,
  Languages,
  ScanLine,
  AlertCircle,
  WifiOff,
  FileWarning,
  AlertTriangle,
  Check,
  Download,
  FileCode,
  CheckCircle,
  Copy,
  Loader2,
  X,
} from "lucide-react";
import axios from "axios";
import { dashboardUploadApi } from "../api/org_jobs_api";
import Cookies from "js-cookie";
import { useUploadStore } from "../Store/uploadStore";
import uploadService from "../services/UploadService";
import { useApp } from "../context/AppContext";
import toast from "react-hot-toast";
import LoadingOverlay from "../pages/resources/LoadingOverlay";

export default function NewTranslation() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isCheckingJob, setIsCheckingJob] = useState(true);
  const [jobNotFound, setJobNotFound] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [uploadDots, setUploadDots] = useState(0);
  const [translateDots, setTranslateDots] = useState(0);

  // State for Terms and Conditions
  const [termsAccepted, setTermsAccepted] = useState(false);

  // State for Confirmation Modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // State for Upload Failure Modal
  const [showUploadFailureModal, setShowUploadFailureModal] = useState(false);

  // Get wallet balance from AppContext
  const { user, updateBalance } = useApp();

  const {
    amount,
    loading,
    setLoading,
    pages,
    jobId,
    paymentCompleted,
    paymentStatus,
    jobStatus,
    downloadUrls,
    setJob,
    translationProgress,
  } = useUploadStore();

  const steps = ["Analyzing", "Calculating Pages", "Generating order summary"];

  // Check if job_id exists in URL on mount
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const jobIdFromUrl = searchParams.get("job_id");

    if (jobIdFromUrl) {
      verifyJobExists(jobIdFromUrl);
    } else {
      setIsCheckingJob(false);
    }
  }, []);

  // Animate upload dots
  useEffect(() => {
    if (!isUploading) {
      setUploadDots(0);
      return;
    }

    const interval = setInterval(() => {
      setUploadDots((prev) => (prev + 1) % 4);
    }, 400);

    return () => clearInterval(interval);
  }, [isUploading]);

  // Animate translation dots
  useEffect(() => {
    const shouldAnimate = paymentCompleted && jobStatus !== "COMPLETED";

    if (!shouldAnimate) {
      setTranslateDots(0);
      return;
    }

    const interval = setInterval(() => {
      setTranslateDots((prev) => (prev + 1) % 4);
    }, 400);

    return () => clearInterval(interval);
  }, [paymentCompleted, jobStatus]);

  const verifyJobExists = async (jobId) => {
    try {
      setIsCheckingJob(true);
      // Use wallet-specific job check
      const jobExists = await uploadService.checkOrgJobExists(jobId);

      if (!jobExists) {
        setJobNotFound(true);
        setIsCheckingJob(false);
        return;
      }

      // Use wallet-specific status endpoint
      const statusResponse = await uploadService.getOrgJobStatus(jobId);

      setJob(jobId, statusResponse.expires_at || "");

      useUploadStore.setState({
        jobStatus: statusResponse.status,
        pages: statusResponse.pages_detected ?? 0,
        isPayable: statusResponse.status === "AWAITING_WALLET_CONFIRMATION",
      });

      if (statusResponse.status === "AWAITING_WALLET_CONFIRMATION") {
        useUploadStore.setState({ paymentCompleted: false });
      } else if (
        statusResponse.status === "QUEUED" ||
        statusResponse.status === "PROCESSING"
      ) {
        useUploadStore.setState({ paymentCompleted: true });
        setTimeout(() => {
          uploadService.pollOrgTranslationStatus(jobId);
        }, 5000);
      } else if (statusResponse.status === "COMPLETED") {
        useUploadStore.setState({ paymentCompleted: true });
        const downloadUrls = await uploadService.getOrgDownloadUrls(jobId);
        useUploadStore.setState({
          downloadUrls: downloadUrls,
        });
      }

      setIsCheckingJob(false);
    } catch (error) {
      console.error("Error verifying job:", error);
      if (error.response?.status === 404) {
        setJobNotFound(true);
      }
      setIsCheckingJob(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;

    if (!selectedFile) {
      toast.error("No file selected!");
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      toast.error("Only PDF files are allowed!");
      return;
    }

    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
  };

  const handleRemoveFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setPreviewUrl(null);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please upload a PDF file first.");
      return;
    }

    const fileDetails = {
      fileName: file.name,
      fileSizeInBytes: file.size,
      language: "en",
      file,
    };

    setIsUploading(true);

    try {
      // Use wallet-specific init endpoint
      await uploadService.initOrgJob(fileDetails);
      toast.success(`File uploaded successfully!`);
      setLoading(true);
    } catch (error) {
      setShowUploadFailureModal(true);
      setLoading(false);
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Wallet-based payment - deduct from user's wallet
   * Uses unified apiClient which automatically adds fresh Firebase token
   */
  const handlePayFromWallet = async () => {
    // 1. Validate Terms Acceptance
    if (!termsAccepted) {
      toast.error("Please accept the Terms & Conditions to proceed.");
      return;
    }

    if (!jobId) {
      toast.error("Job ID not found. Please try uploading again.");
      return;
    }

    if (!pages) {
      toast.error("Pages not calculated. Please try again.");
      return;
    }

    // 2. Check if wallet has sufficient balance (in pages)
    const walletBalance = user?.wallet?.balance || 0;
    if (walletBalance < pages) {
      toast.error(
        `Insufficient balance. You need ${pages} pages but have ${walletBalance} pages.`,
      );
      return;
    }

    setIsProcessingPayment(true);

    try {
      // 3. Call wallet deduction API using uploadService
      const response = await uploadService.confirmWalletDeduction(jobId);

      // 4. Update wallet balance in context with new balance from response
      updateBalance(response.new_wallet_balance - (user?.wallet?.balance || 0));

      toast.success(`${response.pages_deducted} pages deducted from wallet!`);

      // 5. Mark payment as completed and start polling
      useUploadStore.setState({
        paymentCompleted: true,
        paymentStatus: "SUCCESS",
        jobStatus: "QUEUED",
      });

      // Start polling for translation status
      setTimeout(() => {
        uploadService.pollOrgTranslationStatus(jobId);
      }, 2000);
    } catch (error) {
      console.error("Wallet payment error:", error);
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Wallet deduction failed. Please try again.";
      toast.error(errorMessage);
      useUploadStore.setState({ paymentStatus: "FAILED" });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleDownload = () => {
    if (downloadUrls) {
      // Download PDF
      const pdfLink = document.createElement("a");
      pdfLink.href = downloadUrls.pdf_url;
      pdfLink.download = "";
      pdfLink.target = "_blank";
      document.body.appendChild(pdfLink);
      pdfLink.click();
      document.body.removeChild(pdfLink);

      // Small delay before downloading DOCX
      setTimeout(() => {
        const docxLink = document.createElement("a");
        docxLink.href = downloadUrls.docx_url;
        docxLink.download = "";
        docxLink.target = "_blank";
        document.body.appendChild(docxLink);
        docxLink.click();
        document.body.removeChild(docxLink);

        toast.success("Both PDF and Word documents downloaded!");
      }, 500);
    } else {
      toast.error("Download URLs not available yet.");
    }
  };

  const copyUrlToClipboard = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
      toast.success("URL copied to clipboard!");
    });
  };

  // Loading state while checking job
  if (isCheckingJob) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600">Checking job status...</p>
        </div>
      </div>
    );
  }

  // Job not found state
  if (jobNotFound) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-3xl p-8 sm:p-12 text-center shadow-sm">
          <AlertCircle className="w-16 h-16 text-red-500 mb-6 mx-auto" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Job Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The job ID you're looking for doesn't exist or has expired.
          </p>
          <button
            onClick={() => {
              window.history.pushState({}, "", window.location.pathname);
              window.location.reload();
            }}
            className="bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-xl font-bold transition-all inline-flex items-center gap-2"
          >
            <Sparkles size={20} />
            Start New Translation
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-5xl mx-auto space-y-6 relative">
      {/* Heading */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">
          Translate Your PDF to English
        </h1>
        <p className="text-gray-500 mt-1">
          Upload, pay from wallet, and get your translated document
        </p>
      </div>

      {/* Balance Card */}
      <div className="flex items-center gap-4 bg-emerald-50 border border-emerald-200 rounded-xl p-5">
        <div className="bg-emerald-500 text-white p-3 rounded-lg">
          <Wallet size={22} />
        </div>
        <div>
          <p className="text-sm text-gray-600">Available Balance</p>
          <p className="text-2xl font-semibold text-emerald-600">
            {(user?.wallet?.balance || 0).toLocaleString()} pages
          </p>
        </div>
      </div>

      {/* Warning */}
      <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
        <AlertTriangle className="text-amber-500 mt-1" size={20} />
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Verification Required:</span> Texlate
          can make mistakes. Please cross-verify the translated document,
          especially{" "}
          <span className="italic font-medium">handwritten numericals</span>, as
          regional numbers may appear similar.
        </p>
      </div>

      {/* ---------------- DROPZONE / SUMMARY ---------------- */}
      {!paymentCompleted ? (
        <>
          {/*============== uploader ==============*/}
          {!file && amount === null && pages === null && (
            <label
              htmlFor="file-upload"
              className={`inline-block w-full border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer border-gray-300 hover:border-blue-400 hover:bg-gray-50
              transition-all duration-300 group
              `}
            >
              <div className="mx-auto w-14 h-14 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Upload size={24} />
              </div>

              <p className="text-lg font-medium text-gray-800">
                Tap to upload PDF or drag and drop here
              </p>

              <div className="flex justify-center gap-4 mt-5 text-xs text-gray-400">
                <span className="bg-gray-100 px-3 py-1 rounded-md">
                  MAX 100 MB
                </span>
                <span className="bg-gray-100 px-3 py-1 rounded-md">
                  MAX 200 PAGES
                </span>
              </div>

              <input
                id="file-upload"
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading || amount !== null}
              />
            </label>
          )}
          {/*============== preview ==============*/}
          {file && amount === null && pages === null && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="bg-red-50 p-2 rounded-md">
                    <FileText className="text-red-500" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleRemoveFile}
                  className="text-gray-400 hover:text-red-500 transition"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="h-[520px] bg-gray-100">
                <embed
                  src={previewUrl}
                  type="application/pdf"
                  className="w-full h-full"
                />
              </div>

              <div className="p-6">
                <button
                  onClick={handleUpload}
                  disabled={!file || isUploading}
                  className="w-full flex items-center justify-center gap-2
                  bg-blue-600 text-white py-3.5 rounded-lg
                  text-base font-semibold tracking-wide
                  hover:bg-blue-700 transition-all duration-200
                  shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Calculator size={20} />
                  <span>
                    {isUploading
                      ? `Uploading${".".repeat(uploadDots)}`
                      : "Calculate Cost"}
                  </span>
                </button>
              </div>
            </div>
          )}
          {/* ================= ORDER SUMMARY ================= */}
          {pages !== null &&
            pages > 0 &&
            jobStatus === "AWAITING_WALLET_CONFIRMATION" && (
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-6 md:p-10 border border-gray-200 space-y-6 animate-fadeIn">
                <h2 className="text-3xl font-semibold text-center text-gray-900">
                  Order Summary
                </h2>

                <div className="bg-white rounded-2xl p-6 flex justify-between items-center border">
                  <p className="text-lg font-medium text-gray-800">
                    Pages Detected:
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {pages}
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-6 flex justify-between items-center border">
                  <p className="text-lg font-medium text-gray-800">
                    Deduction from Wallet:
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {pages} pages
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 flex justify-between items-center border">
                  <p className="text-lg font-medium text-gray-800">
                    Available Wallet Balance:
                  </p>
                  <div className="flex items-center gap-2">
                    <Wallet
                      className={`w-5 h-5 ${(user?.wallet?.balance || 0) >= pages ? "text-emerald-600" : "text-red-600"}`}
                    />
                    <span
                      className={`font-bold text-xl ${(user?.wallet?.balance || 0) >= pages ? "text-emerald-600" : "text-red-600"}`}
                    >
                      {(user?.wallet?.balance || 0).toLocaleString()} pages
                    </span>
                  </div>
                  {/* <div>
                    <div className="flex items-center text-end gap-4">
                      <span className="text-gray-400 line-through text-lg">
                        ₹100
                      </span>

                      <span className="text-3xl font-bold text-gray-900">
                        ₹30
                      </span>
                    </div>
                    <span className="text-green-600 font-semibold">
                      70% OFF
                    </span>
                  </div> */}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-gray-700">
                  <span className="font-semibold">Important:</span> Please stay
                  on page. You will be redirected once the payment is complete.
                  A recovery file will auto-download. Save it OR{" "}
                  <span className="text-blue-600 underline cursor-pointer">
                    Copy this link
                  </span>{" "}
                  to track your order.
                </div>

                <div className="mb-6 flex items-start gap-3 px-1">
                  <div className="relative flex items-center pt-0.5">
                    <input
                      type="checkbox"
                      id="terms-checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-gray-300 bg-white transition-all checked:border-gray-900 checked:bg-gray-900 hover:border-gray-900"
                    />
                    <Check className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" />
                  </div>
                  <p className="text-sm text-gray-600 select-none">
                    I have read, understood and accept the legal policies (being{" "}
                    <a
                      href="/terms/conditions"
                      className="text-blue-600 underline font-semibold"
                    >
                      terms and conditions
                    </a>
                    ,{" "}
                    <a
                      href="/terms/disclaimer"
                      className="text-blue-600 underline font-semibold"
                    >
                      disclaimer
                    </a>
                    ,{" "}
                    <a
                      href="/terms/privacy"
                      className="text-blue-600 underline font-semibold"
                    >
                      Privacy Policy
                    </a>{" "}
                    and{" "}
                    <a
                      href="/terms/refunds"
                      className="text-blue-600 underline font-semibold"
                    >
                      Refund Policy
                    </a>
                    ).
                  </p>
                </div>

                <button
                  onClick={() => setShowConfirmModal(true)}
                  disabled={
                    isProcessingPayment ||
                    !termsAccepted ||
                    (user?.wallet?.balance || 0) < pages
                  }
                  className="w-full bg-gradient-to-r disabled:from-green-200 disabled:to-green-200 from-green-400 to-emerald-500 text-white py-4 rounded-full text-lg font-semibold flex items-center gap-2 justify-center"
                >
                  <Wallet className="w-5 h-5" />
                  {isProcessingPayment
                    ? "Processing..."
                    : (user?.wallet?.balance || 0) < pages
                      ? "Insufficient Balance"
                      : `Deduct ${pages} pages from wallet`}
                </button>
                {(user?.wallet?.balance || 0) < pages && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-red-600">
                      You need{" "}
                      {(pages - (user?.wallet?.balance || 0)).toLocaleString()}{" "}
                      more pages in your wallet.
                    </p>
                  </div>
                )}

                {paymentStatus === "FAILED" && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-red-600">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      Wallet deduction failed. Please try again.
                    </span>
                  </div>
                )}
              </div>
            )}
        </>
      ) : (
        /* Payment Completed - Translation Status */
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8">
          <h3
            className={`text-2xl font-bold text-gray-900 mb-6 text-center ${jobStatus !== "COMPLETED" ? "animate-pulse" : ""}`}
          >
            {jobStatus === "COMPLETED"
              ? "Translation Completed"
              : `Translating PDF${".".repeat(translateDots)}`}
          </h3>

          <div className="flex items-center gap-2 mb-6 p-3 bg-green-50 rounded-xl border border-green-200">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-gray-700 text-sm">
              Payment successful from wallet
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
              <span className="font-semibold text-gray-700">Order ID:</span>
              <span className="text-gray-600 text-xs font-mono">{jobId}</span>
            </div>
          </div>

          {jobStatus === "VERIFYING" && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
              <p className="text-lg font-bold text-gray-800 mb-2">
                Verifying Payment
              </p>
              <p className="text-sm text-gray-600">
                Please wait while we confirm your transaction...
              </p>
            </div>
          )}

          {jobStatus === "QUEUED" && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
              <p className="text-base text-gray-800 mb-2 font-semibold">
                ⏳ Your translation is in queue...
              </p>
              <p className="text-sm text-gray-600">
                This service takes{" "}
                <span className="font-bold">2-20 minutes</span>. You can{" "}
                <button
                  onClick={copyUrlToClipboard}
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 underline font-semibold"
                >
                  copy the URL{" "}
                  {copiedUrl ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>{" "}
                and reopen it later.
              </p>
            </div>
          )}

          {jobStatus === "PROCESSING" && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <p className="text-base text-gray-800 mb-4 font-semibold">
                🔄 Your PDF is being translated...
              </p>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-400 to-amber-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${translationProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-3 text-center font-bold">
                {translationProgress}% complete
              </p>
            </div>
          )}

          {jobStatus === "COMPLETED" && (
            <div className="space-y-4">
              {downloadUrls ? (
                <>
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                    <p className="text-lg font-bold text-gray-800 mb-2">
                      Translation Complete!
                    </p>
                    <p className="text-sm text-gray-600">
                      Your translated documents are ready to download
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = downloadUrls.pdf_url;
                        link.target = "_blank";
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        toast.success("PDF download started!");
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <FileText className="w-5 h-5" />
                      Download PDF
                    </button>

                    <button
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = downloadUrls.docx_url;
                        link.target = "_blank";
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        toast.success("Word document download started!");
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <FileCode className="w-5 h-5" />
                      Download Word
                    </button>
                  </div>

                  <button
                    onClick={handleDownload}
                    className="w-full bg-gray-900 hover:bg-black text-white px-6 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download Both Files
                  </button>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="text-xs text-amber-800 text-center">
                      ⏰ <strong>Important:</strong> Files are available for{" "}
                      <strong>24 hours only</strong>. Please download now.
                    </p>
                  </div>
                </>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                  <AlertCircle className="w-10 h-10 text-yellow-600 mx-auto mb-3" />
                  <p className="text-base font-semibold text-gray-800 mb-2">
                    Translation complete, but download links not loaded
                  </p>
                  <button
                    onClick={async () => {
                      try {
                        toast.loading("Fetching download links...");
                        const urls = await uploadService.getDownloadUrls(jobId);
                        if (urls) {
                          useUploadStore.setState({ downloadUrls: urls });
                          toast.success("Download links loaded!");
                        } else {
                          toast.error("Could not fetch download links.");
                        }
                      } catch (error) {
                        toast.error("Failed to fetch download links");
                      }
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl font-bold transition-all inline-flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Get Download Links
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ================= SMART INFO SECTION ================= */}
      <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-2xl p-6 transition hover:shadow-md">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center">
            <Sparkles className="text-blue-600" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Smart Processing
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex gap-4">
            <div className="mt-1">
              <Languages className="text-emerald-500" size={20} />
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">
              <span className="font-semibold text-gray-900">
                English Text Handling:
              </span>{" "}
              Upload carefree. If your document already contains English text,
              Texlate preserves it exactly as-is — just like a human typist
              would.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="mt-1">
              <ScanLine className="text-emerald-500" size={20} />
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">
              <span className="font-semibold text-gray-900">Advanced OCR:</span>{" "}
              Our OCR reads handwritten, old, and faded documents with high
              accuracy.
              <span className="text-gray-400 italic">
                {" "}
                Better clarity = better results.
              </span>
            </p>
          </div>
        </div>
      </div>
      {loading && (
        <LoadingOverlay
          steps={steps}
          onComplete={() => {
            setLoading(false);
          }}
        />
      )}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowConfirmModal(false)}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-amber-600" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              Confirm Wallet Deduction
            </h3>

            <p className="text-gray-600 text-center mb-6">
              This action cannot be undone. Once you confirm, the translation
              process will begin immediately.
            </p>

            <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pages to translate:</span>
                <span className="font-bold text-gray-900">{pages}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Deduction amount:</span>
                <span className="font-bold text-red-600">-{pages} pages</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                <span className="text-gray-600">Balance after deduction:</span>
                <span className="font-bold text-emerald-600">
                  {(
                    (user?.wallet?.balance || 0) - (pages || 0)
                  ).toLocaleString()}{" "}
                  pages
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  handlePayFromWallet();
                }}
                disabled={isProcessingPayment}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessingPayment ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Wallet className="w-4 h-4" />
                    Confirm & Proceed
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {showUploadFailureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          {/* Modal Card */}
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 animate-[fadeIn_.2s_ease-out]">
            {/* Close Button */}
            <button
              onClick={() => setShowUploadFailureModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
            >
              <span className="text-gray-400 hover:text-gray-600 text-lg font-bold leading-none">
                ×
              </span>
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center shadow-sm">
                <AlertCircle className="text-amber-500" size={22} />
              </div>

              <h3 className="text-lg font-semibold text-gray-900">
                Upload Failed?
              </h3>
            </div>

            {/* Content */}
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <WifiOff className="text-gray-400 mt-1" size={18} />
                <p className="text-sm text-gray-600 leading-relaxed">
                  <span className="font-medium text-gray-900">
                    Network issues?
                  </span>{" "}
                  Try another connection. Some providers may intermittently
                  block uploads.
                </p>
              </div>

              <div className="flex items-start gap-4">
                <FileWarning className="text-gray-400 mt-1" size={18} />
                <p className="text-sm text-gray-600 leading-relaxed">
                  <span className="font-medium text-gray-900">
                    Check filename:
                  </span>{" "}
                  Remove emojis or special characters before uploading.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
