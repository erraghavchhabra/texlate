import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase-config";

// ============================================================================
// Auth Context
// ============================================================================

const AuthContext = createContext(undefined);

// ============================================================================
// Auth Provider Component
// ============================================================================

export const AuthProvider = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setIsAuthLoading(false);

      // If user signed out, clean up localStorage
      if (!user) {
        localStorage.removeItem("idToken");
      }
    });

    return () => unsubscribe();
  }, []);

  /**
   * Get a valid (fresh) Firebase ID token.
   * Firebase automatically refreshes expired tokens.
   */
  const getValidToken = useCallback(
    async (forceRefresh = false) => {
      if (!firebaseUser) {
        throw new Error("Not authenticated - no Firebase user");
      }

      try {
        const token = await firebaseUser.getIdToken(forceRefresh);
        return token;
      } catch (error) {
        console.error("Failed to get valid token:", error);
        await logout();
        throw new Error("Session expired - please log in again");
      }
    },
    [firebaseUser],
  );

  /**
   * Logout user from Firebase and clear local state
   */
  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("idToken");
      setFirebaseUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("idToken");
      setFirebaseUser(null);
    }
  }, []);

  const value = {
    firebaseUser,
    isAuthLoading,
    isAuthenticated: !!firebaseUser,
    getValidToken,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ============================================================================
// Hook to use Auth Context
// ============================================================================

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

/**
 * Utility function to get a valid token outside React components
 */
export const getFirebaseToken = async (forceRefresh = false) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Not authenticated - no Firebase user");
  }

  return user.getIdToken(forceRefresh);
};
