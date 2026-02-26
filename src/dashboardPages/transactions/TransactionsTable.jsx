import { useLayoutEffect, useRef, useState, useEffect } from "react";
import TransactionRow from "./TransactionRow";
import gsap from "gsap";
import { FileX, Inbox } from "lucide-react";
import walletService from "../../services/WalletService";
import { useApp } from "../../context/AppContext";

const TransactionsTable = () => {
  const tableRef = useRef(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useApp();

  const isAdmin = user?.role === "admin";
  const currentUserEmail = user?.email;

  // Fetch transactions from API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await walletService.getTransactions(50);
        let fetchedTransactions = response.transactions || [];

        // Filter transactions for non-admin users (only show their own)
        if (!isAdmin && currentUserEmail) {
          fetchedTransactions = fetchedTransactions.filter((txn) => {
            // For credit transactions (top-ups), show to all users in the org
            if (txn.type === "credit") {
              return true;
            }
            // For debit transactions, only show user's own transactions
            const txnEmail = txn.metadata?.user_email;
            return txnEmail === currentUserEmail;
          });
        }

        // Sort transactions by date (latest first)
        fetchedTransactions.sort((a, b) => {
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        });

        setTransactions(fetchedTransactions);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
        setError("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [isAdmin, currentUserEmail]);

  // GSAP: Coordinated Table Entrance
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(tableRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from("thead tr", {
        opacity: 0,
        backgroundColor: "transparent",
        duration: 0.5,
        delay: 0.3,
      });
    }, tableRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={tableRef}
      className="relative  bg-white border border-slate-200 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden"
    >
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

          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={8} className="py-20">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                    <h3 className="text-sm font-bold text-gray-900">
                      Loading transactions...
                    </h3>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={8} className="py-20">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 border border-red-100">
                      <Inbox className="text-red-300" size={24} />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900">
                      Error loading transactions
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">{error}</p>
                  </div>
                </td>
              </tr>
            ) : transactions.length > 0 ? (
              transactions.map((txn, index) => (
                <TransactionRow
                  key={txn.transaction_id}
                  transaction={txn}
                  index={index}
                  currentUserEmail={currentUserEmail}
                />
              ))
            ) : (
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
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsTable;
