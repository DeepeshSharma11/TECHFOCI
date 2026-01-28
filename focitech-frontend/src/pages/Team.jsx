import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Linkedin, Github, Twitter, Mail, ExternalLink, User, Sparkles } from 'lucide-react';

const Team = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const { data, error } = await supabase
          .from('team')
          .select('*')
          .order('id', { ascending: true });

        if (error) throw error;
        setTeam(data || []);
      } catch (err) {
        console.error("Error loading team:", err.message);
      } finally {
        setTimeout(() => setLoading(false), 800); // Smooth transition
      }
    };

    fetchTeam();
  }, []);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" } 
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex flex-col justify-center items-center">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-400 animate-pulse" size={24} />
      </div>
      <p className="mt-6 text-slate-500 font-black tracking-[0.4em] text-xs uppercase animate-pulse">Syncing Team Data</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] py-32 px-6 relative overflow-hidden selection:bg-blue-500/30">
      
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6">
            <Sparkles size={12} /> The Brains Behind Focitech
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter">
            Meet the <span className="text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-blue-700">Visionaries</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed">
            Our multi-disciplinary team is dedicated to pushing the boundaries of what's possible in the digital landscape.
          </p>
        </motion.div>

        {/* Team Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {team.map((member) => (
            <motion.div 
              key={member.id} 
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className="group"
            >
              <div className="relative h-full bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[3.5rem] p-10 overflow-hidden transition-all duration-500 hover:border-blue-500/40 hover:shadow-[0_30px_60px_-15px_rgba(37,99,235,0.25)]">
                
                {/* 3D-ish Avatar Section */}
                <div className="relative w-44 h-44 mx-auto mb-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[2.5rem] rotate-6 group-hover:rotate-0 transition-transform duration-500 shadow-xl shadow-blue-600/20"></div>
                  <div className="relative w-full h-full bg-[#020617] rounded-[2.5rem] p-1 overflow-hidden">
                    <img 
                      src={member.photo_url || `https://api.dicebear.com/7.x/initials/svg?seed=${member.name}&backgroundColor=0f172a`} 
                      alt={member.name} 
                      className="w-full h-full object-cover rounded-[2.3rem] transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                </div>

                {/* Info Container */}
                <div className="text-center">
                  <h3 className="text-3xl font-black text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-blue-500 font-black text-xs uppercase tracking-[0.2em] mb-6">
                    {member.role}
                  </p>
                  <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium">
                    {member.bio || "Crafting robust architectures and intuitive user experiences for the next generation of web applications."}
                  </p>

                  {/* Social Links with Modern Hover */}
                  <div className="flex justify-center items-center gap-3 pt-6 border-t border-white/5">
                    {[
                      { icon: <Linkedin size={18} />, url: member.linkedin_url, color: "hover:bg-blue-600" },
                      { icon: <Github size={18} />, url: member.github_url, color: "hover:bg-slate-700" },
                      // { icon: <Twitter size={18} />, url: member.twitter_url, color: "hover:bg-sky-500" },
                      // { icon: <Mail size={18} />, url: `mailto:${member.email}`, color: "hover:bg-emerald-600" }
                    ].map((social, idx) => (
                      <a 
                        key={idx}
                        href={social.url || "#"} 
                        target="_blank" 
                        rel="noreferrer"
                        className={`p-3 bg-white/5 rounded-2xl text-slate-400 hover:text-white transition-all duration-300 ${social.color}`}
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Subtle Background Icon */}
                <div className="absolute -bottom-6 -right-6 text-white/[0.02] group-hover:text-blue-500/5 transition-colors">
                  <User size={150} strokeWidth={1} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Career CTA Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-32 p-1 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-transparent rounded-[3.5rem]"
        >
          <div className="bg-[#020617] rounded-[3.4rem] p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/5">
            <div className="text-center md:text-left">
              <h3 className="text-3xl md:text-4xl font-black text-white mb-3">Want to shape the future?</h3>
              <p className="text-slate-400 text-lg font-medium">Join our growing team of developers, designers, and innovators.</p>
            </div>
            <button className="whitespace-nowrap px-10 py-5 bg-white text-blue-600 rounded-[1.5rem] font-black text-sm hover:bg-blue-50 hover:shadow-2xl hover:shadow-white/10 transition-all flex items-center gap-3">
              VIEW OPEN ROLES <ExternalLink size={18} />
            </button>
          </div>
        </motion.div>

      </div>
      
      {/* Page Footer Label */}
      <p className="text-center text-slate-800 text-[10px] mt-20 uppercase tracking-[0.5em] font-black">
        Focitech Personnel Infrastructure
      </p>
    </div>
  );
};

export default Team;