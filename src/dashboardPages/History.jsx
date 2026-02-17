import { Download, FileX } from "lucide-react";

export default function History() {
  const transactions = [];

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
        <button className="group flex items-center justify-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition-all duration-300 hover:bg-blue-700 hover:shadow-md active:scale-[0.97]">
          <Download
            size={16}
            className="transition-transform duration-300 group-hover:-translate-y-[1px]"
          />
          Export Usage
        </button>
      </div>

      <p className="text-slate-500 mb-6 sm:mb-8 text-sm sm:text-base">
        Track your translation usage, credits, and payments.
      </p>

      {/* Table Card */}
      <div className="relative bg-white border border-slate-200 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden">
        {/* Scroll Wrapper */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            {/* Sticky Head */}
            <thead className="bg-slate-50 text-slate-600 sticky top-0 z-10">
              <tr className="text-left">
                {[
                  "#",
                  "Transaction ID",
                  "Pages",
                  "Description",
                  "Performed By",
                  "Type",
                  "Date & Time",
                  "Download",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 sm:px-6 py-4 font-medium tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="8">
                    {/* Empty State */}
                    <div className="flex flex-col items-center justify-center py-20 text-center animate-[fadeIn_.4s_ease]">
                      <div className="bg-blue-50 p-5 rounded-full mb-5 animate-[floatY_4s_ease-in-out_infinite]">
                        <FileX className="text-blue-600" size={28} />
                      </div>

                      <p className="font-semibold text-slate-700">
                        No transactions found
                      </p>

                      <p className="text-sm text-slate-500 mt-2 max-w-sm">
                        Your usage history will appear here once you start
                        translating documents.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                transactions.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-t border-slate-100 transition-all duration-200 hover:bg-slate-50 hover:shadow-[inset_0_1px_0_0_rgba(0,0,0,0.02)]"
                  >
                    <td className="px-4 sm:px-6 py-4">{index + 1}</td>

                    <td className="px-4 sm:px-6 py-4 font-medium text-slate-800 whitespace-nowrap">
                      {item.txnId}
                    </td>

                    <td className="px-4 sm:px-6 py-4">{item.pages}</td>

                    <td className="px-4 sm:px-6 py-4 max-w-[260px] text-slate-600">
                      {item.description}
                    </td>

                    <td className="px-4 sm:px-6 py-4 text-slate-600">
                      {item.performedBy}
                    </td>

                    <td className="px-4 sm:px-6 py-4">
                      <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                        {item.type}
                      </span>
                    </td>

                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-slate-500">
                      {item.date}
                    </td>

                    <td className="px-4 sm:px-6 py-4 text-center">
                      <button className="p-2 rounded-md text-blue-600 hover:bg-blue-50 transition">
                        <Download size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
