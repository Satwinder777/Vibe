"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  signOut,
  type User,
} from "firebase/auth";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import {
  clearMasterUnlock,
  isAccessTokenConfigured,
  isMasterUnlocked,
  setMasterUnlocked,
  verifyAccessToken,
} from "@/lib/master-access";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isConfigured: boolean;
  hasFullAccess: boolean;
  isMasterUnlocked: boolean;
  isAccessTokenConfigured: boolean;
  unlockWithToken: (token: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [masterUnlocked, setMasterUnlockedState] = useState(false);
  const configured = isFirebaseConfigured();
  const tokenConfigured = isAccessTokenConfigured();

  const syncMasterFlag = useCallback(() => {
    setMasterUnlockedState(isMasterUnlocked());
  }, []);

  useEffect(() => {
    syncMasterFlag();
  }, [syncMasterFlag]);

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }

    const auth = getFirebaseAuth();
    let restoring = false;

    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u && isMasterUnlocked() && !restoring) {
        restoring = true;
        try {
          await signInAnonymously(auth);
          return;
        } catch {
          clearMasterUnlock();
          setMasterUnlockedState(false);
        } finally {
          restoring = false;
        }
      }
      setUser(u);
      setLoading(false);
    });

    return unsub;
  }, [configured]);

  const unlockWithToken = useCallback(
    async (token: string) => {
      if (!verifyAccessToken(token)) {
        throw new Error("Invalid access token. Please try again.");
      }
      setMasterUnlocked();
      setMasterUnlockedState(true);

      if (configured) {
        const auth = getFirebaseAuth();
        if (!auth.currentUser) {
          try {
            await signInAnonymously(auth);
          } catch (error) {
            clearMasterUnlock();
            setMasterUnlockedState(false);
            throw new Error(getAuthErrorMessage(error));
          }
        }
      }
    },
    [configured]
  );

  const signUp = useCallback(
    async (email: string, password: string) => {
      if (!configured) throw new Error("Firebase not configured");
      try {
        const auth = getFirebaseAuth();
        await createUserWithEmailAndPassword(auth, email, password);
        clearMasterUnlock();
        setMasterUnlockedState(false);
      } catch (error) {
        throw new Error(getAuthErrorMessage(error));
      }
    },
    [configured]
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      if (!configured) throw new Error("Firebase not configured");
      try {
        const auth = getFirebaseAuth();
        await signInWithEmailAndPassword(auth, email, password);
        clearMasterUnlock();
        setMasterUnlockedState(false);
      } catch (error) {
        throw new Error(getAuthErrorMessage(error));
      }
    },
    [configured]
  );

  const logOut = useCallback(async () => {
    clearMasterUnlock();
    setMasterUnlockedState(false);
    if (configured) {
      await signOut(getFirebaseAuth());
    }
  }, [configured]);

  const hasFullAccess = !!user || masterUnlocked;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isConfigured: configured,
        hasFullAccess,
        isMasterUnlocked: masterUnlocked,
        isAccessTokenConfigured: tokenConfigured,
        unlockWithToken,
        signUp,
        signIn,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
