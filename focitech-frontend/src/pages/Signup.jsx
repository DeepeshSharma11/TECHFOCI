import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { signup, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signup(formData.email, formData.password, formData.fullName);
      setSuccess(true);
      // Fast redirect: 1.5 seconds is enough for the success animation
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.message || 'An error occurred during registration.');
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg z-10"
      >
        <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 p-10 rounded-[3rem] shadow-2xl relative">
          
          <div className="text-center mb-10">
            <motion.div 
              whileHover={{ rotate: 15 }}
              className="bg-gradient-to-br from-blue-600 to-indigo-700 w-20 h-20 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-600/20"
            >
              <UserPlus className="text-white w-10 h-10" />
            </motion.div>
            <h1 className="text-4xl font-black text-white tracking-tight">Create Account</h1>
            <p className="text-slate-400 mt-3 font-medium text-lg">Join the Focitech ecosystem</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-sm text-center animate-pulse">
              {error}
            </div>
          )}

          {success ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-12 text-center"
            >
              <div className="bg-emerald-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="text-emerald-500 w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-white">Welcome Aboard!</h2>
              <p className="text-slate-400 mt-2">Your account has been created successfully.</p>
              <p className="text-blue-500 mt-6 animate-pulse font-bold tracking-widest">REDIRECTING TO LOGIN...</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-6">
              {/* Full Name Field */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 ml-2">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input
                    type="text" required
                    placeholder="Deepesh Sharma"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 ml-2">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input
                    type="email" required
                    placeholder="deepesh@focitech.com"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 ml-2">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input
                    type="password" required
                    placeholder="Min. 8 characters"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-50 text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>CREATE ACCOUNT <ArrowRight size={20} /></>
                )}
              </motion.button>
            </form>
          )}

          <div className="text-center mt-10">
            <p className="text-slate-500 font-medium">
              Already a member? <Link to="/login" className="text-blue-400 hover:text-blue-300 font-bold transition-colors">Sign In here</Link>
            </p>
          </div>
        </div>

        {/* Branding Footer */}
        <p className="text-center text-slate-600 text-xs mt-8 uppercase tracking-[0.2em] font-bold">
          TechnoviaX Powered Infrastructure
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;