import { Download, FileX } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import walletService from "../services/WalletService";
import TransactionsTable from "./transactions/TransactionsTable";
/**
 * Format UTC date to IST with readable format for export
 */
const formatDateToISTForExport = (utcDateString) => {
  const date = new Date(utcDateString);
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
 * Get full description for export (no truncation)
 */
const getFullDescription = (transaction) => {
  if (transaction.type === "debit") {
    const jobId = transaction.metadata.job_id;
    if (jobId) {
      return `Translation for ${jobId}`;
    }
    return "Translation";
  }
  const packageName = transaction.metadata.package_name || "Package";
  const type = transaction.metadata.type || "top_up";
  return `${packageName} - ${type}`;
};

/**
 * Get performed by value
 */
const getPerformedBy = (transaction) => {
  return (
    transaction.metadata.user_name || transaction.metadata.user_email || "-"
  );
};

/**
 * Export transactions to CSV
 */
const exportToCSV = (transactions) => {
  const headers = [
    "#",
    "Transaction ID",
    "Pages",
    "Description",
    "Performed By",
    "Type",
    "Date & Time",
  ];

  const rows = transactions.map((txn, index) => {
    const amount =
      txn.type === "credit" ? `+${Math.abs(txn.amount)}` : `${txn.amount}`;
    return [
      index + 1,
      txn.transaction_id, // Full transaction ID
      amount,
      getFullDescription(txn), // Full description without truncation
      getPerformedBy(txn),
      txn.type,
      formatDateToISTForExport(txn.created_at),
    ];
  });

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `transactions_${new Date().toISOString().split("T")[0]}.csv`,
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
export default function History() {
  const transactions = [];
  const containerRef = useRef(null);
  const { user } = useApp();
  const [exporting, setExporting] = useState(false);

  const isAdmin = user?.role === "admin";
  const handleExport = useCallback(async () => {
    try {
      setExporting(true);
      const response = await walletService.getTransactions(500); // Fetch more for export
      const transactions = response.transactions || [];
      exportToCSV(transactions);
    } catch (err) {
      console.error("Failed to export transactions:", err);
    } finally {
      setExporting(false);
    }
  }, []);
  return (
    <div className="animate-fadeIn">
      {/* Section Label */}
      <p className="text-xs tracking-[0.2em] text-slate-400 mb-2">
        USAGE & BILLING
      </p>

      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-800">
          Transactions
        </h1>

        {/* Export Button */}
        {isAdmin && (
          <button
            onClick={handleExport}
            disabled={exporting}
            className="group flex items-center justify-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition-all duration-300 hover:bg-blue-700 hover:shadow-md active:scale-[0.97]"
          >
            <Download
              size={16}
              className="transition-transform duration-300 group-hover:-translate-y-[1px]"
            />
            <span>{exporting ? "Exporting..." : "Export Usage"}</span>
          </button>
        )}
      </div>

      <p className="text-slate-500 mb-6 sm:mb-8 text-sm sm:text-base">
        Track your translation usage, credits, and payments.
      </p>

      {/* Table Card */}
      <TransactionsTable />
    </div>
  );
}
