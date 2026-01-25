import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, Lock, Mail, AlertCircle, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState(null);
  
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalError(null);

    try {
      const { user } = await login(email, password);
      
      // Admin check directly from user metadata for instant redirection
      const userRole = user?.app_metadata?.role || 'authenticated';
      
      if (userRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      setLocalError(err.message || "Access Denied. Check your credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Dynamic Ambient Background */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-lg z-10"
      >
        <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 p-10 md:p-12 rounded-[3rem] shadow-2xl relative">
          
          <div className="text-center mb-10">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="bg-gradient-to-br from-blue-600 to-indigo-700 w-20 h-20 rounded-[1.8rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-600/30 border border-white/10"
            >
              <LogIn className="text-white w-10 h-10" />
            </motion.div>
            <h1 className="text-4xl font-black text-white tracking-tight leading-none">Welcome Back</h1>
            <p className="text-slate-400 mt-4 font-medium text-lg italic">Continue your TechnoviaX journey</p>
          </div>

          <AnimatePresence mode="wait">
            {localError && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-400 text-sm mb-8 font-medium"
              >
                <AlertCircle size={18} className="shrink-0" /> {localError}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 ml-2 uppercase tracking-widest">Enter Email</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  type="email" required
                  placeholder="operator@focitech.in"
                  className="w-full bg-slate-800/40 border border-slate-700/50 rounded-2xl pl-14 pr-6 py-5 text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder:text-slate-600 font-medium"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-2">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Password</label>
                <Link to="/forgot-password" size="sm" className="text-xs text-blue-500 hover:text-blue-400 transition-colors font-bold">Forget Password</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  type="password" required
                  placeholder="••••••••"
                  className="w-full bg-slate-800/40 border border-slate-700/50 rounded-2xl pl-14 pr-6 py-5 text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-[1.8rem] shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  AUTHENTICATING...
                </>
              ) : (
                <>Submit <ArrowRight size={20} /></>
              )}
            </motion.button>
          </form>

          <div className="text-center mt-12 border-t border-white/5 pt-8">
            <p className="text-slate-500 font-medium">
              New to the ecosystem? <Link to="/signup" className="text-blue-500 hover:text-blue-400 font-black transition-colors">JOIN FOCITECH</Link>
            </p>
          </div>
        </div>

        {/* Branding Footer */}
        <div className="flex items-center justify-center gap-2 mt-10">
           <ShieldCheck size={14} className="text-slate-600" />
           <p className="text-center text-slate-600 text-[10px] uppercase tracking-[0.4em] font-black">
             TechnoviaX Security Protocol L-3
           </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;