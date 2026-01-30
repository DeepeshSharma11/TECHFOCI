import axios from 'axios';
import { supabase } from '../supabaseClient';

// 1. Centralized Configuration
// IMPORTANT: Backend logs mein 404 aa raha hai, isliye base URL check karein.
const API_URL = import.meta.env.VITE_API_URL || 'https://techfoci.onrender.com/api/v1';
// const API_URL = 'http://localhost:8000/api/v1';


const api = axios.create({
  baseURL: API_URL,
  timeout: 15000, // Increased to 15s for Render cold starts
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
});

// 2. Request Interceptor: Secure Token Management
api.interceptors.request.use(
  async (config) => {
    // Trailing slash fix: FastAPI sometimes fails on /contact/ vs /contact
    // This ensures consistency based on your router settings
    if (config.url && !config.url.endsWith('/')) {
      config.url += '/';
    }

    // Fetching session directly from Supabase for the latest JWT
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Auth Session Error:", error.message);
    }

    if (session?.access_token) {
      // Bearer token for FastAPI's Depends(get_current_user)
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    if (import.meta.env.DEV) {
      console.log(`🚀 [TechnoviaX Request] ${config.method.toUpperCase()} -> ${config.url}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Response Interceptor: Smart Error & Session Management
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized (Session Expired/Invalid)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.warn("🔐 Session dead. Redirecting to login...");
        // Use a small delay before redirecting for better UX
        setTimeout(() => {
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }, 2000);
      }
    }

    // Handle 404 (Not Found) - Your logs showed many of these
    if (error.response?.status === 404) {
      console.error("🔍 Route not found. Check if '/api/v1' is missing in baseURL or backend prefix.");
    }

    // Global Error Message
    const errorMessage = error.response?.data?.detail || "TechnoviaX Engine Sync Failure.";
    
    return Promise.reject({
      status: error.response?.status,
      message: Array.isArray(errorMessage) ? errorMessage[0].msg : errorMessage,
      originalError: error
    });
  }
);

export default api;