import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, ShieldCheck, Calendar, LogOut, 
  MapPin, Edit3, Settings, GraduationCap, Save, X, Loader2
} from 'lucide-react';

const Profile = () => {
  const { user, isAdmin, logout, loading = true } = useAuth() || {};
  const navigate = useNavigate();

  // Edit Mode States
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: '',
    location: 'Bareilly, India',
    education: 'B.Tech CSE'
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
    if (user) {
      setProfileData({
        fullName: user.user_metadata?.full_name || "Deepesh Sharma",
        location: user.user_metadata?.location || "Bareilly, India",
        education: user.user_metadata?.education || "B.Tech CSE"
      });
    }
  }, [user, loading, navigate]);

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { 
          full_name: profileData.fullName,
          location: profileData.location,
          education: profileData.education
        }
      });

      if (error) throw error;
      setIsEditing(false);
    } catch (err) {
      alert("Update failed: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );

  const memberSince = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : "Recently joined";

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 py-16 md:py-24 px-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-600/5 rounded-full blur-[80px] md:blur-[100px] -z-10"></div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl">
          
          {/* Header Banner - Responsive Height */}
          <div className="h-32 md:h-44 bg-gradient-to-r from-blue-700 to-indigo-900 relative">
            <div className="absolute -bottom-10 md:-bottom-14 left-6 md:left-10">
              <div className="w-20 h-20 md:w-28 md:h-28 bg-[#020617] rounded-2xl md:rounded-[2rem] border-4 border-[#020617] shadow-2xl flex items-center justify-center overflow-hidden">
                <img 
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${profileData.fullName}&backgroundColor=2563eb`}
                  alt="Avatar" className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="pt-14 md:pt-20 pb-8 md:pb-12 px-6 md:px-10">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="flex-1 w-full">
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 w-full max-w-md">
                      <input 
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 w-full text-xl md:text-2xl font-bold outline-none focus:border-blue-500 text-white transition-all"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                        placeholder="Full Name"
                      />
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input 
                          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs w-full outline-none text-white focus:border-blue-500"
                          value={profileData.location}
                          onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                          placeholder="Location"
                        />
                        <input 
                          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs w-full outline-none text-white focus:border-blue-500"
                          value={profileData.education}
                          onChange={(e) => setProfileData({...profileData, education: e.target.value})}
                          placeholder="Education"
                        />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <h1 className="text-2xl md:text-4xl font-black text-white flex items-center gap-2 md:gap-3 flex-wrap">
                        {profileData.fullName} {isAdmin && <ShieldCheck className="text-blue-400 shrink-0" size={24} />}
                      </h1>
                      <p className="text-blue-500 font-black uppercase tracking-[0.2em] text-[8px] md:text-[10px] mt-2">
                        {isAdmin ? 'Founder & CEO @ Focitech' : 'TechnoviaX Associate'}
                      </p>
                      <div className="flex flex-wrap gap-2 md:gap-3 mt-4 md:mt-6">
                        <span className="flex items-center gap-2 text-[9px] md:text-[10px] font-bold text-slate-400 bg-white/5 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-white/5">
                          <MapPin size={10} className="text-blue-500 md:w-3 md:h-3"/> {profileData.location}
                        </span>
                        <span className="flex items-center gap-2 text-[9px] md:text-[10px] font-bold text-slate-400 bg-white/5 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-white/5">
                          <GraduationCap size={12} className="text-indigo-500 md:w-3 md:h-3"/> {profileData.education}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action Buttons - Stacked on mobile */}
              <div className="flex gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
                {isEditing ? (
                  <>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="p-3 bg-white/5 hover:bg-white/10 rounded-xl md:rounded-2xl text-slate-400 border border-white/5 transition-all"
                    >
                      <X size={20} />
                    </button>
                    <button 
                      onClick={handleUpdate}
                      disabled={updating}
                      className="flex-1 md:flex-none px-6 md:px-8 py-3 bg-blue-600 hover:bg-blue-50 text-white rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20"
                    >
                      {updating ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                      Save Node
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="w-full md:w-auto px-6 md:px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest border border-white/10 flex items-center justify-center gap-2 transition-all"
                  >
                    <Edit3 size={16} /> Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Info Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 mt-10 md:mt-16">
              <div className="p-6 md:p-8 bg-white/5 rounded-[1.5rem] md:rounded-[2rem] border border-white/5 group hover:border-blue-500/30 transition-all overflow-hidden">
                <Mail className="text-blue-500 mb-4" size={20} />
                <p className="text-slate-500 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">Communication Node</p>
                <p className="text-white font-bold text-base md:text-lg mt-1 break-all">
                  {user?.email}
                </p>
                <p className="text-[9px] md:text-[10px] text-slate-600 mt-2 font-bold italic underline decoration-blue-500/50">Primary Email (Locked)</p>
              </div>

              <div className="p-6 md:p-8 bg-white/5 rounded-[1.5rem] md:rounded-[2rem] border border-white/5 group hover:border-indigo-500/30 transition-all">
                <Calendar className="text-indigo-500 mb-4" size={20} />
                <p className="text-slate-500 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">Activation Date</p>
                <p className="text-white font-bold text-base md:text-lg mt-1">{memberSince}</p>
                <p className="text-[9px] md:text-[10px] text-slate-600 mt-2 font-bold uppercase tracking-widest">System Operational</p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="mt-10 md:mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
              <button 
                onClick={logout}
                className="w-full md:w-auto flex items-center justify-center gap-3 text-red-500 hover:text-white hover:bg-red-500 font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] px-8 py-4 rounded-xl md:rounded-2xl transition-all border border-red-500/20 active:scale-95"
              >
                <LogOut size={14} /> Logout
              </button>
              
              <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-slate-600 uppercase tracking-widest">
                <ShieldCheck size={14} /> Focitech Encrypted Profile
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;