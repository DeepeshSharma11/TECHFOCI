import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Page Components

import Home from './pages/Home';
import Projects from './pages/Projects';
import Team from './pages/Team';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdminInquiries from './pages/AdminInquiries';
// import AdminCareers from './pages/AdminCareers';
import OurBusiness from './pages/OurBusiness';
import Careers from './pages/Careers';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Feedback from './pages/Feedback';

// --- ADVANCED PROTECTED ROUTE COMPONENT ---
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617]">
      <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );

  if (!user) return <Navigate to="/login" />;

  if (adminOnly && !isAdmin) return <Navigate to="/profile" />;

  return children;
};

// Admin Layout Component
const AdminLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#020617]">
      <Navbar />
      {children}
    </div>
  );
};

function AppRoutes() {
  return (
    <div className="flex flex-col min-h-screen bg-[#020617] selection:bg-blue-500/30 selection:text-white">
      <Navbar />
      
      <main className="flex-grow">
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/team" element={<Team />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/our-business" element={<OurBusiness />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/feedback" element={<Feedback />} />

          {/* --- Auth Routes --- */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* --- User Protected Routes --- */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          {/* --- Admin Dashboard (Main) --- */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          } />

          {/* --- Admin Sub-routes --- */}
          <Route path="/admin/inquiries" element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout>
                <AdminInquiries />
              </AdminLayout>
            </ProtectedRoute>
          } />
{/* 
          <Route path="/admin/careers" element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout>
                <AdminCareers />
              </AdminLayout>
            </ProtectedRoute>
          } /> */}

          {/* --- 404 Page --- */}
          <Route path="*" element={
            <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-[#020617] pt-20">
              <h1 className="text-[12rem] font-black text-white/5 leading-none">404</h1>
              <div className="relative -mt-20">
                <h2 className="text-4xl font-black text-white mb-4 italic">ORBIT LOST</h2>
                <p className="text-slate-500 max-w-md mx-auto mb-10 font-medium">
                  The requested node does not exist in the Focitech ecosystem. 
                  Redirecting to primary headquarters.
                </p>
                <a href="/" className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black transition-all shadow-xl shadow-blue-600/20 active:scale-95">
                  RETURN HOME
                </a>
              </div>
            </div>
          } />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

// Final App Wrapper with Context
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;