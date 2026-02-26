import React, { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { FileText, FileType } from "lucide-react";
import walletService from "../../services/WalletService";

/**
 * Format UTC date to IST with readable format
 * e.g., "25 Jan 2026, 04:39 PM IST"
 */
const formatDateToIST = (utcDateString) => {
  const date = new Date(utcDateString);

  // Format date in IST timezone
  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  };

  const formatted = date.toLocaleString("en-IN", options);
  return `${formatted} IST`;
};

/**
 * Check if transaction is within last 24 hours
 */
const isWithin24Hours = (utcDateString) => {
  const transactionDate = new Date(utcDateString);
  const now = new Date();
  const diffInHours =
    (now.getTime() - transactionDate.getTime()) / (1000 * 60 * 60);
  return diffInHours <= 24;
};

/**
 * Download file from URL
 */
const downloadFile = async (url, filename) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const link = document.createElement("a");
    const objectUrl = URL.createObjectURL(blob);
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
  } catch (error) {
    console.error("Failed to download file:", error);
    throw error;
  }
};

const TransactionRow = ({ transaction, index, currentUserEmail }) => {
  const rowRef = useRef(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingWord, setDownloadingWord] = useState(false);

  // GSAP: Staggered entrance for the row
  useLayoutEffect(() => {
    gsap.fromTo(
      rowRef.current,
      {
        opacity: 0,
        y: 10,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        delay: index * 0.05,
        ease: "power2.out",
      },
    );
  }, [index]);

  // Truncate transaction ID to first 8 characters
  const truncatedId = `${transaction.transaction_id.substring(0, 8)}...`;

  // Construct description based on transaction type
  const getDescription = () => {
    if (transaction.type === "debit") {
      const jobId = transaction.metadata.job_id;
      if (jobId) {
        return `Translation for ${jobId.substring(0, 8)}...`;
      }
      return "Translation";
    }

    const packageName = transaction.metadata.package_name || "Package";
    const type = transaction.metadata.type || "top_up";
    return `${packageName} - ${type}`;
  };

  const description = getDescription();

  // Format date + time in IST
  const formattedDateTime = formatDateToIST(transaction.created_at);

  // Determine sign for amount
  const amountDisplay =
    transaction.type === "credit"
      ? `+${Math.abs(transaction.amount)}`
      : `${transaction.amount}`;

  // Get performed by
  const performedBy =
    transaction.metadata.user_name || transaction.metadata.user_email || "-";

  // Only show if debit + has job_id + within 24h + own transaction
  const isOwnTransaction =
    currentUserEmail && transaction.metadata.user_email === currentUserEmail;

  const showDownloadButton =
    transaction.type === "debit" &&
    transaction.metadata.job_id &&
    isWithin24Hours(transaction.created_at) &&
    isOwnTransaction;

  // Handle PDF download
  const handleDownloadPdf = async () => {
    if (!transaction.metadata.job_id) return;

    try {
      setDownloadingPdf(true);
      const response = await walletService.downloadJobFiles(
        transaction.metadata.job_id,
      );

      if (response.pdf_url) {
        await downloadFile(
          response.pdf_url,
          `${transaction.metadata.job_id}.pdf`,
        );
      } else {
        alert("PDF file not available.");
      }
    } catch (error) {
      console.error("Failed to download PDF:", error);
      alert("Failed to download PDF. Please try again.");
    } finally {
      setDownloadingPdf(false);
    }
  };

  // Handle Word download
  const handleDownloadWord = async () => {
    if (!transaction.metadata.job_id) return;

    try {
      setDownloadingWord(true);
      const response = await walletService.downloadJobFiles(
        transaction.metadata.job_id,
      );

      if (response.docx_url) {
        await downloadFile(
          response.docx_url,
          `${transaction.metadata.job_id}.docx`,
        );
      } else {
        alert("Word file not available.");
      }
    } catch (error) {
      console.error("Failed to download Word file:", error);
      alert("Failed to download Word file. Please try again.");
    } finally {
      setDownloadingWord(false);
    }
  };

  return (
    <tr
      ref={rowRef}
      className="border-t border-slate-100 transition-all duration-200 hover:bg-slate-50 hover:shadow-[inset_0_1px_0_0_rgba(0,0,0,0.02)]"
    >
      <td className="px-4 sm:px-6 py-4">{index + 1}</td>

      <td className="px-4 sm:px-6 py-4 font-medium text-slate-800 whitespace-nowrap">
        {truncatedId}
      </td>

      <td className="px-4 sm:px-6 py-4">{amountDisplay}</td>

      <td className="px-4 sm:px-6 py-4 max-w-[260px] text-slate-600">
        {description}
      </td>

      <td className="px-4 sm:px-6 py-4 text-slate-600">{performedBy}</td>

      <td className="px-4 sm:px-6 py-4">
        <span
          className={`px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-600 ring-1 ring-blue-100
          ${
            transaction.type === "credit"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {transaction.type}
        </span>
      </td>

      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-slate-500">
        {formattedDateTime}
      </td>

      <td className="px-4 sm:px-6 py-4 text-center">
        {showDownloadButton ? (
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={downloadingPdf}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-red-600 text-white rounded-lg text-[10px] font-bold transition-all hover:bg-red-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Download PDF"
            >
              <FileText
                size={12}
                className={downloadingPdf ? "animate-pulse" : ""}
              />
              {downloadingPdf ? "..." : "PDF"}
            </button>

            <button
              onClick={handleDownloadWord}
              disabled={downloadingWord}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-600 text-white rounded-lg text-[10px] font-bold transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Download Word"
            >
              <FileType
                size={12}
                className={downloadingWord ? "animate-pulse" : ""}
              />
              {downloadingWord ? "..." : "Word"}
            </button>
          </div>
        ) : (
          <span className="text-xs text-gray-300">-</span>
        )}
      </td>
    </tr>
  );
};

export default TransactionRow;
