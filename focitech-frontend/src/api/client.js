import axios from 'axios';
import { supabase } from '../supabaseClient';

// 1. Centralized Configuration
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
const API_URL = import.meta.env.VITE_API_URL || 'https://techfoci.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 seconds timeout for better UX
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
});

// 2. Request Interceptor: Secure Token Management
api.interceptors.request.use(
  async (config) => {
    // Fetching session directly from Supabase for the latest JWT
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Auth Session Error:", error.message);
    }

    if (session?.access_token) {
      // Injects the Bearer token for FastAPI's Depends(get_current_user)
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    // Performance tracking in development mode
    if (import.meta.env.DEV) {
      console.log(`🚀 [API Request] ${config.method.toUpperCase()} -> ${config.url}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Response Interceptor: Smart Error & Session Management
api.interceptors.response.use(
  (response) => {
    // You can transform data here if needed
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized (Session Expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.warn("🔐 Session expired. Attempting to refresh...");
      
      // If session is truly dead, we could force a logout or redirect to /login
      // window.location.href = '/login'; 
    }

    // Global Error Notification Logic
    const errorMessage = error.response?.data?.detail || "Something went wrong with the TechnoviaX Engine.";
    
    // For debugging during development
    if (import.meta.env.DEV) {
      console.error(`❌ [API Error] ${error.response?.status}: ${errorMessage}`);
    }

    return Promise.reject({
      status: error.response?.status,
      message: errorMessage,
      originalError: error
    });
  }
);

export default api;