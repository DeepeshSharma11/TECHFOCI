import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import api from '../api/client'; // Using our updated axios client

const AuthContext = createContext({
  user: null,
  role: 'guest',
  isAdmin: false,
  loading: true,
  login: async () => {},
  logout: async () => {},
  signup: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('guest');
  const [loading, setLoading] = useState(true);

  // Function to extract user role and details
  const extractUserDetails = useCallback((sessionUser) => {
    if (!sessionUser) {
      setUser(null);
      setRole('guest');
      return;
    }
    setUser(sessionUser);
    // Role is usually stored in app_metadata for Supabase
    setRole(sessionUser.app_metadata?.role || 'authenticated');
  }, []);

  useEffect(() => {
    // 1. Check current session on mount
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        extractUserDetails(session?.user ?? null);
      } catch (error) {
        console.error("Auth init error:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // 2. Continuous Listener for Auth Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      extractUserDetails(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [extractUserDetails]);

  // --- ADVANCED AUTH ACTIONS ---

  const signup = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName } // Storing in user_metadata
      }
    });
    if (error) throw error;
    return data;
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole('guest');
  };

  // --- DERIVED STATES ---
  const isAdmin = role === 'admin';
  const isAuthenticated = !!user;

  const value = {
    user,
    role,
    isAdmin,
    isAuthenticated,
    loading,
    login,
    logout,
    signup,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};