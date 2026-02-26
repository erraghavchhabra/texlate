import { useEffect, useRef, useState } from "react";
import {
  Upload as UploadIcon,
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
  X,
  ScrollText,
  Download,
  FileCode,
  CheckCircle,
  Check,
  Copy,
  Loader2,
} from "lucide-react";
import axios from "axios";
import { jobPdfUpload_api } from "../api/jobs_api";
import uploadService from "../services/UploadService";
import { useUploadStore } from "../Store/uploadStore";
import toast from "react-hot-toast";
import LoadingOverlay from "./resources/LoadingOverlay";
import CircleLoading from "../ui/circle-loading";

export default function Upload() {
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

  // State for Upload Failure Modal
  const [showUploadFailureModal, setShowUploadFailureModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

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

  // ✅ Check if job_id exists in URL on mount
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const jobIdFromUrl = searchParams.get("job_id");

    if (jobIdFromUrl) {
      verifyJobExists(jobIdFromUrl);
    } else {
      setIsCheckingJob(false);
    }
  }, []);
  useEffect(() => {
    if (!isUploading) {
      setUploadDots(0);
      return;
    }

    const interval = setInterval(() => {
      setUploadDots((prev) => (prev + 1) % 4); // cycles 0,1,2,3
    }, 400);

    return () => clearInterval(interval);
  }, [isUploading]);

  // Animate "Translating PDF..." dots
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
      const jobExists = await uploadService.checkJobExists(jobId);

      if (!jobExists) {
        setJobNotFound(true);
        setIsCheckingJob(false);
        return;
      }

      const statusResponse = await uploadService.getUploadStatus(jobId);

      setJob(jobId, statusResponse.expires_at || null);

      useUploadStore.setState({
        jobStatus: statusResponse.status,
        amount: statusResponse.calculated_total ?? 0,
        pages: statusResponse.pages_detected ?? 0,
        isPayable: statusResponse.status === "AWAITING_PAYMENT",
      });

      if (statusResponse.status === "AWAITING_PAYMENT") {
        useUploadStore.setState({ paymentCompleted: false });
      } else if (
        statusResponse.status === "QUEUED" ||
        statusResponse.status === "PROCESSING" ||
        statusResponse.status === "VERIFYING" ||
        statusResponse.status === "WEBHOOK_VERIFICATION_PENDING"
      ) {
        useUploadStore.setState({ paymentCompleted: true });

        if (statusResponse.status === "WEBHOOK_VERIFICATION_PENDING") {
          useUploadStore.setState({ jobStatus: "VERIFYING" });
          setTimeout(() => {
            uploadService.pollForWebhookVerification(jobId);
          }, 2000);
        } else {
          setTimeout(() => {
            uploadService.pollTranslationStatus(jobId);
          }, 5000);
        }
      } else if (statusResponse.status === "COMPLETED") {
        useUploadStore.setState({ paymentCompleted: true });
        const downloadUrls = await uploadService.getDownloadUrls(jobId);
        useUploadStore.setState({
          downloadUrls: downloadUrls, // Changed from downloadUrl
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
      await uploadService.uploadFile(fileDetails);
      toast.success(`File uploaded successfully!`);
      setLoading(true);
    } catch (error) {
      setShowUploadFailureModal(true);
      setLoading(false);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePayNow = async () => {
    // 1. Validate Terms Acceptance
    if (!termsAccepted) {
      toast.error("Please accept the Terms & Conditions to proceed.");
      return;
    }

    if (!jobId) {
      toast.error("Job ID not found. Please try uploading again.");
      return;
    }

    setIsProcessingPayment(true);

    try {
      await uploadService.initializeRazorpayPayment(
        jobId,
        () => {
          toast.success("Payment successful! Verifying...");
          setIsProcessingPayment(false);
        },
        (error) => {
          toast.error(error.description || "Payment failed. Please try again.");
          setIsProcessingPayment(false);
        },
      );
    } catch (error) {
      toast.error("Failed to initialize payment. Please try again.");
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

      // Small delay before downloading DOCX to prevent browser blocking
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
  if (isCheckingJob) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600">Checking job status...</p>
        </div>
      </div>
    );
  }
  if (jobNotFound) {
    return (
      <section className="relative w-full min-h-screen flex items-center justify-center px-4 sm:px-8 py-12 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-gray-300/30 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="max-w-2xl mx-auto relative z-10 w-full">
          <div className="bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-3xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_0_rgba(255,255,255,0.6)] rounded-[32px] backdrop-saturate-150 p-8 sm:p-12 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mb-6 mx-auto" />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Job Not Found
            </h1>
            <p className="text-gray-700 text-base sm:text-lg mb-8">
              The job ID you're looking for doesn't exist or has expired.
            </p>
            <button
              onClick={() => {
                window.history.pushState({}, "", window.location.pathname);
                window.location.reload();
              }}
              className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 text-black px-8 py-4 rounded-full font-bold text-base hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-500 transition shadow-[0_8px_24px_rgba(234,179,8,0.4)] hover:shadow-[0_12px_32px_rgba(234,179,8,0.5)] transform hover:scale-105 backdrop-blur-xl border border-yellow-300/50 inline-flex items-center gap-2 cursor-pointer"
            >
              <Sparkles size={20} />
              Start New Translation
            </button>
          </div>
        </div>
      </section>
    );
  }
  return (
    <div className="min-h-screen py-10 px-4 relative">
      <div className="max-w-5xl mx-auto p-6 my-16 rounded-3xl space-y-6 bg-white">
        {/* Heading */}
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-gray-900">
            Translate Your PDF to English
          </h1>
          <p className="text-gray-500 mt-1">
            Upload, pay from wallet, and get your translated document
          </p>
        </div>

        {/* Warning */}
        <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <AlertTriangle className="text-amber-500 mt-1" size={20} />
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Verification Required:</span>{" "}
            Texlate can make mistakes. Please cross-verify the translated
            document, especially{" "}
            <span className="italic font-medium">handwritten numericals</span>.
          </p>
        </div>

        {/* ================= UPLOAD OR SUMMARY ================= */}
        {!paymentCompleted ? (
          <>
            {/* Upload Section - Clean Minimalist Layout */}
            {!file && amount === null && (
              <label
                // onClick={() => inputRef.current.click()}
                // onDragEnter={handleDrag}
                // onDragLeave={handleDrag}
                // onDragOver={handleDrag}
                // onDrop={handleDrop}
                className={`inline-block w-full border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer
                transition-all duration-300 group
                border-gray-300 hover:border-blue-400 hover:bg-gray-50`}
                htmlFor="file-upload"
              >
                <div className="mx-auto w-14 h-14 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <UploadIcon size={24} />
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
            {/* File Preview */}
            {file && amount === null && (
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
                    type="button"
                    onClick={handleUpload}
                    disabled={!file || isUploading}
                    className="w-full flex items-center justify-center gap-2
                                        bg-blue-600 text-white py-3.5 rounded-lg
                                        text-base font-semibold hover:bg-blue-700 transition"
                  >
                    {isUploading ? (
                      <CircleLoading />
                    ) : (
                      <>
                        <Calculator size={20} />
                        Calculate Cost
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
            {/*  ================= ORDER SUMMARY ================= */}
            {amount !== null && amount > 0 && (
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
                    Payable Amount:
                  </p>
                  <div>
                    <div className="flex items-center text-end gap-4">
                      <span className="text-gray-400 line-through text-lg">
                        ₹{(amount / 0.3).toFixed(0)}
                      </span>
                      <span className="text-3xl font-bold text-gray-900">
                        {" "}
                        ₹{amount}
                      </span>
                    </div>
                    <span className="text-green-600 font-semibold">
                      70% OFF
                    </span>
                  </div>
                </div>
                {/* Terms & Conditions Checkbox */}
                <div className="mb-6 flex items-start gap-3 px-1">
                  <div className="relative flex items-center pt-0.5">
                    <input
                      type="checkbox"
                      id="terms-checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-gray-400/60 bg-white/50 transition-all checked:border-[#60696B] checked:bg-[#60696B] hover:border-[#60696B]"
                    />
                    <Check className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" />
                  </div>

                  <p className="text-sm text-gray-700 select-none">
                    I have read, understood and accept the legal policies (being
                    <a
                      href="/legal/terms"
                      className="text-blue-600 underline font-semibold cursor-pointer"
                    >
                      {" "}
                      terms and conditions
                    </a>
                    ,
                    <a
                      href="/legal/disclaimer"
                      className="text-blue-600 underline font-semibold cursor-pointer"
                    >
                      {" "}
                      disclaimer
                    </a>
                    ,
                    <a
                      href="/legal/privacy"
                      className="text-blue-600 underline font-semibold cursor-pointer"
                    >
                      {" "}
                      Privacy Policy
                    </a>{" "}
                    and
                    <a
                      href="/legal/refund"
                      className="text-blue-600 underline font-semibold cursor-pointer"
                    >
                      {" "}
                      Refund Policy
                    </a>
                    ) of Texlate and acknowledge that my continued use of their
                    services is subject to such legal policies.
                  </p>
                </div>
                <button
                  onClick={handlePayNow}
                  disabled={isProcessingPayment || !termsAccepted}
                  className="w-full bg-gradient-to-r disabled:from-green-200 disabled:to-green-200 from-green-400 to-emerald-500 text-white py-4 rounded-full text-lg font-semibold"
                >
                  {isProcessingPayment
                    ? "Processing Payment..."
                    : `Pay Now ₹${amount}`}
                </button>
                {paymentStatus === "FAILED" && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-red-600">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      Payment failed. Please try again.
                    </span>
                  </div>
                )}

                {paymentStatus === "CANCELLED" && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-yellow-600">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      Payment was cancelled.
                    </span>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          /* Payment Completed Section */
          <div className="bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-xl border border-white/40 rounded-[24px] p-6 sm:p-8 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6)]">
            <h3
              className={`text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center 
              ${jobStatus !== "COMPLETED" ? "animate-pulse" : ""}`}
            >
              {jobStatus === "COMPLETED"
                ? "Translation Completed"
                : `Translating PDF${".".repeat(translateDots)}`}
            </h3>

            <div className="flex items-center gap-2 mb-6 p-3 bg-green-100/60 backdrop-blur-sm rounded-[12px] border border-green-300/40">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-gray-700 text-sm">Payment successful</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center p-5 bg-white/50 rounded-[16px] backdrop-blur-sm">
                <span className="font-semibold text-gray-900">Order ID:</span>
                <span className="text-gray-600 text-xs font-mono">{jobId}</span>
              </div>
            </div>

            {jobStatus === "VERIFYING" && (
              <div className="bg-gradient-to-br from-indigo-400/20 to-indigo-500/10 backdrop-blur-xl border border-indigo-400/40 rounded-[16px] p-8 flex flex-col items-center justify-center text-center">
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-indigo-500/30 blur-xl rounded-full animate-pulse"></div>
                  <Loader2 className="w-10 h-10 text-indigo-600 animate-spin relative z-10" />
                </div>
                <p className="text-lg font-bold text-gray-800 mb-2">
                  Verifying Payment
                </p>
                <p className="text-sm text-gray-600">
                  Please wait while we confirm your transaction...
                </p>
              </div>
            )}

            {jobStatus === "QUEUED" && (
              <div className="bg-gradient-to-br from-blue-400/20 to-blue-500/10 backdrop-blur-xl border border-blue-400/40 rounded-[16px] p-5">
                <p className="text-sm sm:text-base text-gray-800 mb-2 font-semibold">
                  ⏳ Your translation is in queue and will be processed soon...
                </p>
                <p className="text-xs sm:text-sm text-gray-700">
                  This service takes anywhere between{" "}
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
              <div className="bg-gradient-to-br from-amber-400/20 to-amber-500/10 backdrop-blur-xl border border-amber-400/40 rounded-[16px] p-5">
                <p className="text-sm sm:text-base text-gray-800 mb-4 font-semibold">
                  🔄 Your PDF is being translated. This may take a few
                  minutes...
                </p>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${translationProgress}%` }}
                  />
                </div>
                <p className="text-xs sm:text-sm text-gray-700 mt-3 text-center font-bold">
                  {translationProgress}% complete
                </p>
              </div>
            )}

            {jobStatus === "COMPLETED" && (
              <div className="space-y-4">
                {/* Show download buttons if URLs exist */}
                {downloadUrls ? (
                  <>
                    {/* Success Message */}
                    <div className="bg-gradient-to-br from-green-400/20 to-green-500/10 backdrop-blur-xl border border-green-400/40 rounded-[16px] p-6 text-center">
                      <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                      <p className="text-lg font-bold text-gray-800 mb-2">
                        Translation Complete!
                      </p>
                      <p className="text-sm text-gray-600">
                        Your translated documents are ready to download
                      </p>
                    </div>

                    {/* Download Buttons */}
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
                        className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-xl font-bold text-base hover:from-red-600 hover:to-red-700 transition shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center justify-center gap-2"
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
                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-xl font-bold text-base hover:from-blue-600 hover:to-blue-700 transition shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center justify-center gap-2"
                      >
                        <FileCode className="w-5 h-5" />
                        Download Word
                      </button>
                    </div>

                    <button
                      onClick={handleDownload}
                      className="w-full bg-gradient-to-r from-[#858E96] via-[#60696B] to-[#858E96] text-white px-6 py-4 rounded-full font-bold text-lg hover:from-[#757E86] hover:via-[#50595B] hover:to-[#757E86] transition shadow-[0_8px_24px_rgba(96,105,107,0.4)] hover:shadow-[0_12px_32px_rgba(96,105,107,0.5)] backdrop-blur-xl border border-white/30 inline-flex items-center justify-center gap-2"
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
                  /* Fallback: Manual Fetch Button if URLs missing */
                  <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                      <AlertCircle className="w-10 h-10 text-yellow-600 mx-auto mb-3" />
                      <p className="text-base font-semibold text-gray-800 mb-2">
                        Translation complete, but download links not loaded
                      </p>
                      <p className="text-sm text-gray-600 mb-4">
                        Click below to fetch your download links
                      </p>
                      <button
                        onClick={async () => {
                          try {
                            toast.loading("Fetching download links...");
                            const urls =
                              await uploadService.getDownloadUrls(jobId);
                            console.log("Manual fetch result:", urls);

                            if (urls) {
                              useUploadStore.setState({ downloadUrls: urls });
                              toast.success("Download links loaded!");
                            } else {
                              toast.error(
                                "Could not fetch download links. Please contact support with Order ID: " +
                                  jobId,
                              );
                            }
                          } catch (error) {
                            console.error("Manual fetch error:", error);
                            toast.error("Failed to fetch download links");
                          }
                        }}
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:from-yellow-600 hover:to-orange-600 transition shadow-lg inline-flex items-center justify-center gap-2"
                      >
                        <Download className="w-5 h-5" />
                        Get Download Links
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= SMART INFO SECTION ================= */}
        <div className="space-y-6">
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
                <Languages className="text-emerald-500" size={20} />
                <p className="text-sm text-gray-600 leading-relaxed">
                  <span className="font-semibold text-gray-900">
                    English Text Handling:
                  </span>{" "}
                  Upload carefree. If your document already contains English
                  text, Texlate preserves it exactly as-is.
                </p>
              </div>

              <div className="flex gap-4">
                <ScanLine className="text-emerald-500" size={20} />
                <p className="text-sm text-gray-600 leading-relaxed">
                  <span className="font-semibold text-gray-900">
                    Advanced OCR:
                  </span>{" "}
                  Our OCR reads handwritten, old, and faded documents with high
                  accuracy.
                </p>
              </div>
            </div>
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

      {/* FULL TERMS AND CONDITIONS MODAL */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            onClick={() => setShowTermsModal(false)}
          ></div>
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#f8fafc] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <ScrollText className="w-5 h-5 text-[#60696B]" />
                <h2 className="text-xl font-bold text-gray-800">
                  Terms & Conditions
                </h2>
              </div>
              <button
                onClick={() => setShowTermsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Modal Content - Exact Content from your Prompt */}
            <div className="overflow-y-auto p-6">
              <div className="space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Terms & Conditions
                </h2>

                {/* Introduction */}
                <div className="bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow-sm">
                  <p className="leading-relaxed mb-4 text-gray-800">
                    Welcome to Texlate ("we," "us," "our"). These Terms and
                    Conditions ("Terms") govern your access to and use of our
                    website and services (collectively, the "Service").
                  </p>
                  <p className="leading-relaxed mb-4 text-gray-800">
                    By accessing, using, or making a purchase from our Service,
                    you ("User," "you") agree to be bound by these Terms, as
                    well as our Privacy Policy, which is incorporated herein by
                    reference.
                  </p>
                  <p className="leading-relaxed text-gray-800">
                    Please read these Terms carefully. If you do not agree with
                    these Terms, you must not use our Service.
                  </p>
                </div>

                {/* The Service */}
                <div className="bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    1. The Service
                  </h3>
                  <p className="leading-relaxed mb-3 text-gray-800">
                    Texlate provides an automated, AI-powered document
                    translation service. Our Service uses advanced artificial
                    intelligence models (such as Google's Gemini) to translate
                    documents uploaded by users.
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 text-gray-800">
                    <li>
                      <strong>"As-Is" Basis:</strong> The Service is provided on
                      an "as-is" and "as-available" basis.
                    </li>
                    <li>
                      <strong>Best-Effort Formatting:</strong> We attempt to
                      preserve the original layout of your document on a
                      best-effort basis. We do not guarantee a perfect
                      replication of the original format. Structures such as
                      forms, tables, images, and complex layouts may not be
                      replicated perfectly.
                    </li>
                    <li>
                      <strong>AI Translation:</strong> You acknowledge that the
                      translations are generated by AI and not by human
                      translators. As such, they may contain errors,
                      inaccuracies, or misinterpretations, especially with
                      handwritten text, numbers, and complex content.
                    </li>
                  </ul>
                </div>

                {/* The Translation Process & Job URL */}
                <div className="bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    2. The Translation Process & Job URL
                  </h3>
                  <p className="leading-relaxed mb-3 text-gray-800">
                    Our Service operates using a unique "Job URL" system.
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 text-gray-800">
                    <li>
                      <strong>Generation of Job URL:</strong> Upon uploading a
                      document, our system generates a unique, non-recoverable
                      "Job URL" for your translation task. This URL is displayed
                      to you before you make a payment and after your payment is
                      successful.
                    </li>
                    <li>
                      <strong>User's Sole Responsibility:</strong> It is your
                      sole and exclusive responsibility to copy, save, and
                      secure this Job URL. This URL is your only means of
                      tracking your translation's progress and accessing your
                      final translated file.
                    </li>
                    <li>
                      <strong>Lost URLs:</strong> We cannot and will not
                      retrieve or recover lost, misplaced, or forgotten Job
                      URLs. If you lose your Job URL, you will lose all access
                      to your translation, and no refund will be provided.
                    </li>
                  </ul>
                </div>

                {/* Payment and Fees */}
                <div className="bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    3. Payment and Fees
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4 text-gray-800">
                    <li>
                      All fees for the Service are displayed to you prior to
                      payment.
                    </li>
                    <li>
                      All payments are processed immediately upon your
                      confirmation.
                    </li>
                  </ul>
                </div>

                {/* Refunds and Cancellation Policy */}
                <div className="bg-gradient-to-br from-red-400/20 to-red-500/10 backdrop-blur-xl border border-red-400/40 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    4. Refunds and Cancellation Policy
                  </h3>
                  <p className="leading-relaxed mb-3 font-bold text-red-700">
                    All sales are final.
                  </p>
                  <p className="leading-relaxed mb-3 text-gray-800">
                    Due to the automated, irreversible, and digital nature of
                    our Service, Texlate operates a strict NO-REFUND,
                    NO-CANCELLATION policy.
                  </p>
                  <p className="leading-relaxed mb-3 text-gray-800">
                    By making a purchase, you explicitly acknowledge and agree
                    that:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 text-gray-800">
                    <li>
                      No refunds (full or partial) or chargebacks will be issued
                      for any reason.
                    </li>
                    <li>
                      No cancellations are possible once a payment is made and a
                      translation job is submitted.
                    </li>
                    <li>
                      Dissatisfaction with the translation quality, accuracy,
                      fluency, or presence of errors is not grounds for a
                      refund.
                    </li>
                    <li>
                      Dissatisfaction with the formatting, layout, or any
                      perceived "imperfections" in the translated document is
                      not grounds for a refund.
                    </li>
                    <li>
                      The omission of any content—including text, pages, or
                      handwritten elements—is not grounds for a refund.
                    </li>
                    <li>
                      Your failure to save your Job URL, or your loss of said
                      URL, is not grounds for a refund.
                    </li>
                    <li>
                      Your failure to download the file within the specified
                      access window (as defined in Section 7) is not grounds for
                      a refund.
                    </li>
                  </ul>
                </div>

                {/* User Content and License to Use */}
                <div className="bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    5. User Content and License to Use
                  </h3>
                  <p className="leading-relaxed mb-3 text-gray-800">
                    To provide the Service, we must handle your documents.
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 text-gray-800">
                    <li>
                      <strong>User's Grant of License:</strong> By uploading a
                      document ("User Content"), you grant Texlate a temporary,
                      non-exclusive, worldwide, royalty-free license to access,
                      read, analyze, process, and store the document and its
                      contents.
                    </li>
                    <li>
                      <strong>Purpose of License:</strong> This license is
                      granted for the sole and limited purpose of providing the
                      automated translation Service to you, including processing
                      the file with our AI models and making the translated file
                      available for download.
                    </li>
                    <li>
                      <strong>User's Assurance:</strong> You represent and
                      warrant that you own all rights to, or have obtained all
                      necessary permissions for, the User Content you upload and
                      that your User Content does not violate any law or
                      infringe on any third-party rights.
                    </li>
                    <li>
                      <strong>Data Handling:</strong> Our specific commitments
                      regarding the privacy, security, and human access of your
                      User Content are detailed in our Privacy Policy.
                    </li>
                  </ul>
                </div>

                {/* User Conduct */}
                <div className="bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    6. User Conduct
                  </h3>
                  <p className="leading-relaxed mb-3 text-gray-800">
                    You agree not to use the Service to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 text-gray-800">
                    <li>
                      Upload any content that is illegal, hateful, defamatory,
                      or obscene.
                    </li>
                    <li>
                      Upload any content that infringes upon any third-party's
                      intellectual property rights (copyright, trademark, etc.).
                    </li>
                    <li>
                      Upload any content containing viruses, malware, or other
                      malicious code.
                    </li>
                  </ul>
                </div>

                {/* Data Retention and Download Window */}
                <div className="bg-gradient-to-br from-amber-400/20 to-amber-500/10 backdrop-blur-xl border border-amber-400/40 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    7. Data Retention and Download Window
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4 text-gray-800">
                    <li>
                      <strong>24-HOUR DOWNLOAD WINDOW:</strong> Your final,
                      translated document will be made available for download
                      exclusively on your unique Job URL page. This file will be
                      available for a period of four (4) hours after the
                      translation job is marked as "Complete" or "Successful."
                    </li>
                    <li>
                      <strong>Data Deletion:</strong> After this 4-hour window
                      expires, your original and translated files are
                      permanently and irretrievably deleted from our servers.
                      Texlate has no obligation to store your files or provide
                      them to you after this window has passed.
                    </li>
                  </ul>
                </div>

                {/* Disclaimer of Warranties */}
                <div className="bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    8. Disclaimer of Warranties
                  </h3>
                  <p className="leading-relaxed mb-3 text-gray-800">
                    Our Service is provided without any warranties, express or
                    implied.
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 text-gray-800">
                    <li>
                      Texlate does not warrant that the Service will be
                      error-free, uninterrupted, or meet your specific
                      requirements.
                    </li>
                    <li>
                      We make no warranty as to the accuracy, reliability, or
                      completeness of any translation.
                    </li>
                    <li>
                      The entire risk as to the quality and performance of the
                      translation rests with you.
                    </li>
                  </ul>
                  <p className="leading-relaxed mt-3 font-bold text-gray-900">
                    You are strongly advised to independently verify the
                    translated content before relying on it for any purpose
                    (legal, medical, financial, personal, or otherwise).
                  </p>
                </div>

                {/* Limitation of Liability */}
                <div className="bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    9. Limitation of Liability
                  </h3>
                  <p className="leading-relaxed mb-3 text-gray-800">
                    To the fullest extent permitted by law, Texlate, its owners,
                    and affiliates shall not be liable for any direct, indirect,
                    incidental, special, consequential, or punitive damages
                    arising out of or in connection with:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 text-gray-800">
                    <li>Your use of, or inability to use, the Service;</li>
                    <li>
                      Your reliance on any translated content, resulting in loss
                      of data, loss of profits, business interruption, or
                      personal/commercial damages;
                    </li>
                    <li>
                      Any errors, inaccuracies, or omissions in the translated
                      content;
                    </li>
                    <li>
                      Your failure to secure your Job URL or download your file
                      within the specified time.
                    </li>
                  </ul>
                </div>

                {/* Indemnification */}
                <div className="bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    10. Indemnification
                  </h3>
                  <p className="leading-relaxed text-gray-800">
                    You agree to defend, indemnify, and hold harmless Texlate
                    from and against any and all claims, damages, liabilities,
                    and expenses (including legal fees) arising from: (a) your
                    use of the Service, (b) your breach of these Terms, or (c)
                    your User Content.
                  </p>
                </div>

                {/* Modification of Terms */}
                <div className="bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    11. Modification of Terms
                  </h3>
                  <p className="leading-relaxed text-gray-800">
                    We reserve the right to modify these Terms at any time. We
                    will notify users of any changes by posting the new Terms on
                    this page and updating the "Effective Date." Your continued
                    use of the Service after such changes constitutes your
                    acceptance of the new Terms.
                  </p>
                </div>

                {/* Governing Law */}
                <div className="bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    12. Governing Law
                  </h3>
                  <p className="leading-relaxed text-gray-800">
                    These Terms shall be governed by and construed in accordance
                    with the laws of India. Any dispute arising from these Terms
                    or the Service shall be subject to the exclusive
                    jurisdiction of the courts located in Mumbai, Maharashtra.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200 bg-white flex justify-end gap-3">
              <button
                onClick={() => setShowTermsModal(false)}
                className="px-6 py-2.5 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setTermsAccepted(true);
                  setShowTermsModal(false);
                }}
                className="px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#858E96] to-[#60696B] hover:shadow-lg hover:scale-105 transition-all"
              >
                I Agree
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Failure Modal */}
      {showUploadFailureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowUploadFailureModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setShowUploadFailureModal(false)}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            {/* Alert Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              Upload Failed!
            </h3>

            {/* Description */}
            <p className="text-gray-600 text-center mb-6">
              Your file couldn't be uploaded. Here are some common reasons:
            </p>

            {/* Troubleshooting List */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-amber-700 font-bold text-sm">1</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">
                    Network Issues?
                  </p>
                  <p className="text-sm text-gray-600">
                    Try a different internet provider (Reliance Jio users may
                    occasionally face issues).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-amber-700 font-bold text-sm">2</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">
                    Check Filename
                  </p>
                  <p className="text-sm text-gray-600">
                    Remove any emojis or symbols from filename.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => setShowUploadFailureModal(false)}
              className="w-full px-4 py-3 bg-gradient-to-r from-[#858E96] to-[#60696B] text-white rounded-xl font-semibold hover:from-[#757E86] hover:to-[#50595B] transition-all"
            >
              Okay, Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
