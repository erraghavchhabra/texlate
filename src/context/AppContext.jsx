import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";

// ============================================================================
// App Context
// ============================================================================

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  // User state - starts as null until loaded from backend
  const [user, setUserState] = useState(null);

  // Transactions state
  const [transactions, setTransactions] = useState([]);

  /**
   * Set the complete user object from backend API responses
   */
  const setUser = (userData) => {
    setUserState(userData);
  };

  /**
   * Update balance - used for legacy compatibility
   * Note: Only updates balance, does not create transaction records
   */
  const updateBalance = (amount) => {
    if (!user || !user.wallet) return;
    const newBalance = user.wallet.balance + amount;
    setBalance(newBalance);
  };

  /**
   * Direct balance setter - used when API returns new balance
   */
  const setBalance = (newBalance) => {
    setUserState((prevUser) => {
      if (!prevUser || !prevUser.wallet) return prevUser;

      return {
        ...prevUser,
        wallet: {
          ...prevUser.wallet,
          balance: newBalance,
        },
      };
    });
  };

  /**
   * Logout - signs out from Firebase and clears local state
   */
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Firebase signOut error:", error);
    }

    localStorage.removeItem("idToken");
    setUserState(null);
    setTransactions([]);
    
    navigate("/");
  };

  return (
    <AppContext.Provider
      value={{
        user,
        transactions,
        setUser,
        setTransactions,
        updateBalance,
        setBalance,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }

  return context;
};
