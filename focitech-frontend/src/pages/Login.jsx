import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, AlertCircle, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';

/**
 * IMPORT NOTE: 
 * Hum aapka asli AuthContext import kar rahe hain. 
 * Agar compilation error aaye toh check karein ki '../context/AuthContext' path sahi hai.
 * Preview crash na ho, isliye humne yahan fallback logic lagayi hai.
 */
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState(null);
  
  // useAuth hook se login logic lena
  const { login, loading } = useAuth() || { login: async () => ({ user: {} }), loading: false };
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalError(null);

    try {
      const result = await login(email, password);
      const user = result?.user;
      
      // Admin check metadata se
      const userRole = user?.app_metadata?.role || 'authenticated';
      
      if (userRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      setLocalError(err.message || "Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-blue-600/5 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-emerald-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-lg z-10"
      >
        <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 p-6 xs:p-10 md:p-12 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl relative">
          
          <div className="text-center mb-8 md:mb-10">
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight uppercase italic">
              Welcome <span className="text-blue-500 font-black">Back</span>
            </h1>
            <p className="text-slate-400 mt-2 md:mt-4 font-medium text-base md:text-lg">Sign in to your account</p>
          </div>

          {/* Error Message Display */}
          <AnimatePresence mode="wait">
            {localError && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-400 text-xs md:text-sm mb-6 md:mb-8 font-medium"
              >
                <AlertCircle size={18} className="shrink-0" /> {localError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4 md:space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-2 uppercase tracking-wider">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  type="email" required
                  placeholder="name@example.com"
                  className="w-full bg-slate-800/40 border border-slate-700/50 rounded-2xl pl-14 pr-6 py-4 md:py-5 text-sm md:text-base text-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-600"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                <Link to="/forgot-password" intrinsic="true" className="text-xs text-blue-500 hover:text-blue-400 transition-colors font-bold">Forgot?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  type="password" required
                  placeholder="••••••••"
                  className="w-full bg-slate-800/40 border border-slate-700/50 rounded-2xl pl-14 pr-6 py-4 md:py-5 text-sm md:text-base text-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-600"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 md:py-5 rounded-2xl md:rounded-[1.8rem] shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-xs md:text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Checking...
                </>
              ) : (
                <>Login <ArrowRight size={18} /></>
              )}
            </motion.button>
          </form>

          <div className="text-center mt-10 md:mt-12 border-t border-white/5 pt-8">
            <p className="text-slate-500 text-xs md:text-sm font-medium">
              Don't have an account? <Link to="/signup" className="text-blue-500 hover:text-blue-400 font-black transition-colors">Sign Up</Link>
            </p>
          </div>
        </div>

        {/* Security Footer */}
        <div className="flex items-center justify-center gap-2 mt-8 md:mt-10 opacity-50">
           <ShieldCheck size={14} className="text-slate-600" />
           <p className="text-center text-slate-600 text-[10px] uppercase tracking-widest font-bold">
             Secure Login
           </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;