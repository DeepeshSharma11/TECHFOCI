import { useState } from 'react';
import api from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, MapPin, CheckCircle, AlertCircle, 
  MessageSquare, User, ArrowRight, Clock, Globe,
  Briefcase, Send
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'New Project Inquiry',
    message: ''
  });

  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });

    try {
      // Data is sent including the subject field required by your new schema
      await api.post('/contact/', formData);
      setStatus({ loading: false, success: true, error: null });
      setFormData({ name: '', email: '', subject: 'New Project Inquiry', message: '' });
      
      // Success state remains for 5 seconds
      setTimeout(() => setStatus(prev => ({ ...prev, success: false })), 5000);
    } catch (err) {
      setStatus({ 
        loading: false, 
        success: false, 
        error: err.response?.data?.detail || "Connection lost. Please check your internet and try again." 
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px] -z-10"></div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* --- LEFT: BRAND PRESENCE --- */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }}
            className="space-y-12 lg:sticky lg:top-32"
          >
            <div className="space-y-6">
              <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9]">
                Have a <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-600">
                  Concept?
                </span>
              </h1>
              <p className="text-slate-400 text-xl font-medium max-w-lg leading-relaxed">
                Whether you're looking to build a custom application or need technical consultation, 
                our team at TechnoviaX is ready to help you scale.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-6">
              <div className="flex gap-5">
                <div className="w-12 h-12 shrink-0 bg-blue-600/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
                  <Mail className="text-blue-500" size={20} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm uppercase tracking-widest">Email</h4>
                  <p className="text-slate-500 text-sm mt-1">info@focitech.in</p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="w-12 h-12 shrink-0 bg-indigo-600/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
                  <MapPin className="text-indigo-500" size={20} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm uppercase tracking-widest">Office</h4>
                  <p className="text-slate-500 text-sm mt-1 italic">Bareilly, Uttar Pradesh</p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="w-12 h-12 shrink-0 bg-emerald-600/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                  <Clock className="text-emerald-500" size={20} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm uppercase tracking-widest">Availability</h4>
                  <p className="text-slate-500 text-sm mt-1 font-medium">Monday — Saturday</p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="w-12 h-12 shrink-0 bg-amber-600/10 rounded-2xl flex items-center justify-center border border-amber-500/20">
                  <Briefcase className="text-amber-500" size={20} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm uppercase tracking-widest">Status</h4>
                  <p className="text-slate-500 text-sm mt-1 font-medium">Open for Projects</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* --- RIGHT: THE FORM --- */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className="bg-slate-900/50 backdrop-blur-3xl border border-white/10 p-8 md:p-14 rounded-[4rem] shadow-2xl overflow-hidden">
              <AnimatePresence mode="wait">
                {status.success ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-20"
                  >
                    <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/20">
                      <CheckCircle className="text-emerald-500" size={48} />
                    </div>
                    <h2 className="text-4xl font-black text-white mb-4">Inquiry Received!</h2>
                    <p className="text-slate-400 text-lg">We've received your message. Our team will get back to you shortly.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Your Name</label>
                        <div className="relative group">
                          <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={20} />
                          <input 
                            type="text" required
                            placeholder="Deepesh Sharma"
                            className="w-full bg-white/5 border border-white/5 rounded-3xl pl-16 pr-8 py-5 text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-700"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Email Address</label>
                        <div className="relative group">
                          <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={20} />
                          <input 
                            type="email" required
                            placeholder="deepesh@focitech.in"
                            className="w-full bg-white/5 border border-white/5 rounded-3xl pl-16 pr-8 py-5 text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-700"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Subject</label>
                        <div className="relative group">
                          <ArrowRight className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={20} />
                          <input 
                            type="text" required
                            placeholder="How can we help?"
                            className="w-full bg-white/5 border border-white/5 rounded-3xl pl-16 pr-8 py-5 text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-700"
                            value={formData.subject}
                            onChange={(e) => setFormData({...formData, subject: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Your Message</label>
                        <div className="relative group">
                          <MessageSquare className="absolute left-6 top-7 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={20} />
                          <textarea 
                            required rows="6"
                            placeholder="Tell us about your project requirements..."
                            className="w-full bg-white/5 border border-white/5 rounded-[2.5rem] pl-16 pr-8 py-6 text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-700 resize-none"
                            value={formData.message}
                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    {status.error && (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-red-500/10 border border-red-500/20 p-5 rounded-3xl text-red-400 text-xs flex items-center gap-3 font-bold"
                      >
                        <AlertCircle size={18} /> {status.error}
                      </motion.div>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={status.loading}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-6 rounded-3xl shadow-2xl shadow-blue-600/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50 text-xs uppercase tracking-[0.3em]"
                    >
                      {status.loading ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>Transmit Message <Send size={18} /></>
                      )}
                    </motion.button>
                  </form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;