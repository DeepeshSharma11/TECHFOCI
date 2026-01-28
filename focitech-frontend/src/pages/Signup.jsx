import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Mail, Lock, User, ArrowRight, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';

import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const auth = useAuth();
  const signup = auth?.signup || (async () => {});
  const loading = auth?.loading || false;

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signup(formData.email, formData.password, formData.fullName);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message || 'An error occurred during registration.');
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg z-10"
      >
        <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 p-6 xs:p-10 md:p-12 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl relative">
          
          <div className="text-center mb-8 md:mb-10">
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight uppercase italic">
              Create <span className="text-blue-500">Account</span>
            </h1>
            <p className="text-slate-400 mt-2 md:mt-4 font-medium text-base md:text-lg">Join our community today</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-xs md:text-sm text-center font-medium flex items-center justify-center gap-2"
              >
                <AlertCircle size={16} /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          {success ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-8 md:py-12 text-center"
            >
              <div className="bg-emerald-500/10 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="text-emerald-500 w-8 h-8 md:w-10 md:h-10" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white">Welcome Aboard!</h2>
              <p className="text-slate-400 mt-2 text-sm md:text-base">Your account has been created.</p>
              <div className="flex items-center justify-center gap-2 mt-8 text-blue-500 font-black text-xs md:text-sm tracking-widest">
                <Loader2 size={16} className="animate-spin" />
                MOVING TO LOGIN...
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4 md:space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-2 uppercase tracking-wider">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input
                    type="text" required
                    placeholder="Enter your name"
                    className="w-full bg-slate-800/40 border border-slate-700/50 rounded-2xl pl-14 pr-6 py-4 md:py-5 text-sm md:text-base text-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-600"
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-2 uppercase tracking-wider">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input
                    type="email" required
                    placeholder="name@example.com"
                    className="w-full bg-slate-800/40 border border-slate-700/50 rounded-2xl pl-14 pr-6 py-4 md:py-5 text-sm md:text-base text-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-600"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-2 uppercase tracking-wider">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input
                    type="password" required
                    placeholder="Create a password"
                    className="w-full bg-slate-800/40 border border-slate-700/50 rounded-2xl pl-14 pr-6 py-4 md:py-5 text-sm md:text-base text-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-600"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                    Registering...
                  </>
                ) : (
                  <>Sign Up <ArrowRight size={18} /></>
                )}
              </motion.button>
            </form>
          )}

          <div className="text-center mt-8 md:mt-10 border-t border-white/5 pt-8">
            <p className="text-slate-500 text-xs md:text-sm font-medium">
              Already a member? <Link to="/login" className="text-blue-500 hover:text-blue-400 font-black transition-colors uppercase tracking-widest">Sign In</Link>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-8 md:mt-10 opacity-50">
           <ShieldCheck size={14} className="text-slate-600" />
           <p className="text-center text-slate-600 text-[10px] uppercase tracking-widest font-bold">
             Secure Registration
           </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;