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
      // Optional: Add a success toast here
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
    <div className="min-h-screen bg-[#020617] text-slate-200 py-24 px-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] -z-10"></div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl">
          
          {/* Header Banner */}
          <div className="h-44 bg-gradient-to-r from-blue-700 to-indigo-900 relative">
            <div className="absolute -bottom-14 left-10">
              <div className="w-28 h-28 bg-[#020617] rounded-[2rem] border-4 border-[#020617] shadow-2xl flex items-center justify-center overflow-hidden">
                <img 
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${profileData.fullName}&backgroundColor=2563eb`}
                  alt="Avatar" className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="pt-20 pb-12 px-10">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="flex-1 w-full">
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 max-w-md">
                      <input 
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 w-full text-2xl font-bold outline-none focus:border-blue-500"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                        placeholder="Full Name"
                      />
                      <div className="flex gap-2">
                        <input 
                          className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs w-full outline-none"
                          value={profileData.location}
                          onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                          placeholder="Location"
                        />
                        <input 
                          className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs w-full outline-none"
                          value={profileData.education}
                          onChange={(e) => setProfileData({...profileData, education: e.target.value})}
                          placeholder="Education"
                        />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <h1 className="text-4xl font-black text-white flex items-center gap-3">
                        {profileData.fullName} {isAdmin && <ShieldCheck className="text-blue-400" size={28} />}
                      </h1>
                      <p className="text-blue-500 font-black uppercase tracking-[0.2em] text-[10px] mt-2">
                        {isAdmin ? 'Founder & CEO @ Focitech' : 'TechnoviaX Associate'}
                      </p>
                      <div className="flex gap-3 mt-6">
                        <span className="flex items-center gap-2 text-[10px] font-bold text-slate-400 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                          <MapPin size={12} className="text-blue-500"/> {profileData.location}
                        </span>
                        <span className="flex items-center gap-2 text-[10px] font-bold text-slate-400 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                          <GraduationCap size={12} className="text-indigo-500"/> {profileData.education}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex gap-3">
                {isEditing ? (
                  <>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 border border-white/5"
                    >
                      <X size={20} />
                    </button>
                    <button 
                      onClick={handleUpdate}
                      disabled={updating}
                      className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20"
                    >
                      {updating ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                      Save Node
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest border border-white/10 flex items-center gap-2 transition-all"
                  >
                    <Edit3 size={18} /> Edit Profile
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
              <div className="p-8 bg-white/5 rounded-[2rem] border border-white/5 group hover:border-blue-500/30 transition-all">
                <Mail className="text-blue-500 mb-4" size={24} />
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Communication Node</p>
                <p className="text-white font-bold text-lg mt-1">{user?.email}</p>
                <p className="text-[10px] text-slate-600 mt-2 font-bold italic underline decoration-blue-500/50">Primary Email (Locked)</p>
              </div>

              <div className="p-8 bg-white/5 rounded-[2rem] border border-white/5 group hover:border-indigo-500/30 transition-all">
                <Calendar className="text-indigo-500 mb-4" size={24} />
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Activation Date</p>
                <p className="text-white font-bold text-lg mt-1">{memberSince}</p>
                <p className="text-[10px] text-slate-600 mt-2 font-bold uppercase tracking-widest">System Operational</p>
              </div>
            </div>

            <div className="mt-16 pt-8 border-t border-white/5 flex justify-between items-center">
              <button 
                onClick={logout}
                className="flex items-center gap-3 text-red-500 hover:text-white hover:bg-red-500 font-black text-[10px] uppercase tracking-[0.2em] px-8 py-4 rounded-2xl transition-all border border-red-500/20"
              >
                <LogOut size={16} /> Terminate Session
              </button>
              
              <div className="hidden md:flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">
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