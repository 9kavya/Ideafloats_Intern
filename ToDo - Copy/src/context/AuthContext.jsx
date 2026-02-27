import { createContext, useContext, useEffect, useMemo, useCallback } from "react";
import useStorage from "../hooks/useStorage";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser, isUserLoading] = useStorage("current-user", null);
  const [signedInAccounts, setSignedInAccounts, isSignedLoading] = useStorage("signed-in-accounts", []);
  const [knownAccounts, setKnownAccounts, isKnownLoading] = useStorage("known-accounts", []);

  const safeSignedInAccounts = Array.isArray(signedInAccounts) ? signedInAccounts : [];
  const safeKnownAccounts = Array.isArray(knownAccounts) ? knownAccounts : [];

  const rememberAccount = useCallback((user) => {
    setKnownAccounts((prev) => {
      const list = Array.isArray(prev) ? prev : [];
      const exists = list.find((a) => a.email === user.email);
      if (exists) {
        return list.map((a) => (a.email === user.email ? { ...a, ...user } : a));
      }
      return [...list, user];
    });

    setSignedInAccounts((prev) => {
      const list = Array.isArray(prev) ? prev : [];
      const exists = list.find((a) => a.email === user.email);
      if (exists) return list;
      return [...list, user];
    });
  }, [setKnownAccounts, setSignedInAccounts]);

  useEffect(() => {
    if (!isSignedLoading && !Array.isArray(signedInAccounts)) {
      setSignedInAccounts([]);
    }
    if (!isKnownLoading && !Array.isArray(knownAccounts)) {
      setKnownAccounts([]);
    }
  }, [signedInAccounts, knownAccounts, setSignedInAccounts, setKnownAccounts, isSignedLoading, isKnownLoading]);

  useEffect(() => {
    if (isKnownLoading) return;
    try {
      const usersData = JSON.parse(localStorage.getItem("users") || "{}");
      const usersFromStorage = Object.values(usersData).map((u) => ({ email: u.email, name: u.name }));
      if (usersFromStorage.length === 0) return;

      setKnownAccounts((prev) => {
        const list = Array.isArray(prev) ? prev : [];
        const merged = [...list];
        usersFromStorage.forEach((user) => {
          const idx = merged.findIndex((a) => a.email === user.email);
          if (idx === -1) merged.push(user);
          else merged[idx] = { ...merged[idx], ...user };
        });
        return merged;
      });
    } catch {
      // Ignore malformed localStorage and continue.
    }
  }, [setKnownAccounts, isKnownLoading]);

  const signup = useCallback((email, password, name) => {
    const usersData = JSON.parse(localStorage.getItem("users") || "{}");
    if (usersData[email]) throw new Error("User already exists");

    const newUser = { email, password, name, createdAt: new Date().toISOString() };
    usersData[email] = newUser;
    localStorage.setItem("users", JSON.stringify(usersData));

    const user = { email, name };
    setCurrentUser(user);
    rememberAccount(user);
    return user;
  }, [setCurrentUser, rememberAccount]);

  const signin = useCallback((email, password) => {
    const usersData = JSON.parse(localStorage.getItem("users") || "{}");
    if (!usersData[email]) throw new Error("User not found");
    if (usersData[email].password !== password) throw new Error("Invalid password");

    const user = { email, name: usersData[email].name };
    setCurrentUser(user);
    rememberAccount(user);
    return user;
  }, [setCurrentUser, rememberAccount]);

  const switchAccount = useCallback((email) => {
    if (!email) return false;
    const fromKnown = safeKnownAccounts.find((a) => a.email === email);
    if (fromKnown) {
      setCurrentUser(fromKnown);
      rememberAccount(fromKnown);
      return true;
    }
    return false;
  }, [safeKnownAccounts, setCurrentUser, rememberAccount]);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, [setCurrentUser]);

  const signoutAccount = useCallback((email) => {
    setSignedInAccounts(prev => (Array.isArray(prev) ? prev : []).filter(a => a.email !== email));
    if (currentUser?.email === email) {
      logout();
    }
  }, [currentUser, setSignedInAccounts, logout]);

  const value = useMemo(() => ({
    currentUser,
    signedInAccounts: safeSignedInAccounts,
    knownAccounts: safeKnownAccounts,
    isLoading: isUserLoading || isSignedLoading || isKnownLoading,
    signup,
    signin,
    logout,
    switchAccount,
    signoutAccount,
  }), [currentUser, safeSignedInAccounts, safeKnownAccounts, isUserLoading, isSignedLoading, isKnownLoading, signup, signin, logout, switchAccount, signoutAccount]);

  return (
    <AuthContext.Provider value={value}>
      {!value.isLoading ? children : <div className="loading-screen" style={{ backgroundColor: "#111", height: "100vh" }}></div>}
    </AuthContext.Provider>
  );
}

