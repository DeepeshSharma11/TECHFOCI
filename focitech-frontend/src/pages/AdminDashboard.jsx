import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, FolderPlus, MessageSquare, Users, 
  LogOut, Plus, Trash2, CheckCircle, 
  Clock, TrendingUp, X, ExternalLink, Mail, ShieldCheck 
} from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [inquiries, setInquiries] = useState([]);
  const [projects, setProjects] = useState([]);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form States
  const [newProject, setNewProject] = useState({ title: '', description: '', tech_stack: '', live_url: '', github_url: '' });
  const [newMember, setNewMember] = useState({ name: '', role: '', bio: '', linkedin_url: '' });

  // --- 1. DATA SYNC PROTOCOL ---
  const fetchData = useCallback(async () => {
    try {
      const [inqRes, projRes, teamRes] = await Promise.all([
        api.get('/contact/'),
        api.get('/portfolio/'),
        api.get('/corporate/')
      ]);
      setInquiries(inqRes.data || []);
      setProjects(projRes.data || []);
      setTeam(teamRes.data || []);
    } catch (err) {
      console.error("Critical Sync Failure:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // --- 2. INQUIRY STATUS MANAGEMENT (FUNCTIONAL) ---
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      // API call to update status in Supabase via FastAPI
      await api.put(`/contact/${id}`, { status: newStatus });
      
      // Local state update for instant UI feedback
      setInquiries(prev => prev.map(inq => 
        inq.id === id ? { ...inq, status: newStatus } : inq
      ));
    } catch (err) {
      alert("Failed to update status. Please check backend connection.");
    }
  };

  // --- 3. CRUD OPERATIONS ---
  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newProject,
        tech_stack: newProject.tech_stack.split(',').map(s => s.trim()).filter(s => s !== "")
      };
      const res = await api.post('/portfolio/', payload);
      setProjects(prev => [...prev, res.data]);
      setShowModal(false);
      setNewProject({ title: '', description: '', tech_stack: '', live_url: '', github_url: '' });
    } catch (err) {
      alert("Validation Failed: Ensure description is 20+ chars.");
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/corporate/', newMember);
      setTeam(prev => [...prev, res.data]);
      setShowModal(false);
      setNewMember({ name: '', role: '', bio: '', linkedin_url: '' });
    } catch (err) { alert("Member deployment failed."); }
  };

  const deleteItem = async (endpoint, id, stateSetter) => {
    if (confirm("Execute permanent erasure protocol?")) {
      try {
        await api.delete(`/${endpoint}/${id}`);
        stateSetter(prev => prev.filter(item => item.id !== id));
      } catch (err) { alert("Action restricted."); }
    }
  };

  // --- 4. DYNAMIC STATS ---
  const stats = [
    { label: 'Total Projects', value: projects.length, icon: <LayoutDashboard />, color: 'bg-blue-600' },
    { label: 'Pending Leads', value: inquiries.filter(i => i.status === 'pending').length, icon: <MessageSquare />, color: 'bg-amber-600' },
    { label: 'Team Nodes', value: team.length, icon: <Users />, color: 'bg-indigo-600' },
  ];

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-white flex">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-80 border-r border-white/5 bg-slate-900/50 backdrop-blur-3xl p-8 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="mb-12 px-4">
          <h2 className="text-2xl font-black italic tracking-tighter">FOCI<span className="text-blue-500">ADMIN</span></h2>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1 italic">TechnoviaX Engine</p>
        </div>
        <nav className="flex-1 space-y-2">
          {['overview', 'projects', 'inquiries', 'team'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all capitalize font-bold text-sm ${activeTab === tab ? 'bg-blue-600 shadow-lg shadow-blue-600/20 scale-[1.02]' : 'text-slate-400 hover:bg-white/5'}`}>
              {tab === 'overview' ? <TrendingUp size={18}/> : tab === 'projects' ? <FolderPlus size={18}/> : tab === 'inquiries' ? <MessageSquare size={18}/> : <Users size={18}/>}
              {tab}
            </button>
          ))}
        </nav>
        <button onClick={logout} className="mt-auto flex items-center gap-4 px-6 py-4 text-red-500 font-black text-xs uppercase tracking-widest hover:bg-red-500/10 rounded-2xl transition-all">
          <LogOut size={18} /> Sign Out
        </button>
      </aside>

      {/* --- MAIN INTERFACE --- */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center font-black text-xl shadow-lg shadow-blue-600/30">{user?.user_metadata?.full_name[0] || 'A'}</div>
            <div>
              <h1 className="text-4xl font-black tracking-tight capitalize">{activeTab}</h1>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-none mt-1 italic">Bareilly Hub Operational</p>
            </div>
          </div>
          <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/20 transition-all active:scale-95">
            + New {activeTab === 'team' ? 'Member' : 'Project'}
          </button>
        </header>

        <AnimatePresence mode="wait">
          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key="ov">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {stats.map((s, i) => (
                  <div key={i} className="bg-slate-900/50 border border-white/5 p-8 rounded-[2.5rem]">
                    <div className={`${s.color} w-10 h-10 rounded-xl flex items-center justify-center text-white mb-6 shadow-lg shadow-current/20`}>{s.icon}</div>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{s.label}</p>
                    <h3 className="text-5xl font-black mt-2 tracking-tighter">{s.value}</h3>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* PROJECTS MANAGEMENT */}
          {activeTab === 'projects' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(proj => (
                <div key={proj.id} className="bg-slate-900/50 border border-white/5 p-8 rounded-[2.5rem] group hover:border-blue-500/30 transition-all flex flex-col">
                  <h3 className="text-xl font-black mb-3 line-clamp-1">{proj.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {proj.tech_stack?.map(tag => <span key={tag} className="px-2 py-1 bg-white/5 rounded-md text-[10px] text-slate-400 font-bold uppercase">{tag}</span>)}
                  </div>
                  <p className="text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed font-medium italic">"{proj.description}"</p>
                  <div className="flex justify-between items-center mt-auto border-t border-white/5 pt-6">
                    <a href={proj.live_url} target="_blank" className="text-blue-500 hover:text-blue-400"><ExternalLink size={20}/></a>
                    <button onClick={() => deleteItem('portfolio', proj.id, setProjects)} className="text-red-500/50 hover:text-red-500 transition-colors"><Trash2 size={20}/></button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* TEAM MANAGEMENT */}
          {activeTab === 'team' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.map(member => (
                <div key={member.id} className="bg-slate-900/50 border border-white/5 p-8 rounded-[2.5rem] flex items-center gap-6 group hover:border-indigo-500/30 transition-all">
                  <div className="w-16 h-16 bg-indigo-600/20 rounded-2xl flex items-center justify-center text-indigo-400 font-black text-2xl border border-indigo-500/20">
                    {member.name[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-white leading-none mb-1">{member.name}</h3>
                    <p className="text-indigo-400 text-xs font-bold uppercase tracking-tighter mb-4">{member.role}</p>
                    <button onClick={() => deleteItem('corporate', member.id, setTeam)} className="text-red-500/30 hover:text-red-500 transition-colors flex items-center gap-1 text-[10px] font-black uppercase">
                      <X size={12}/> Remove Node
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* INQUIRIES MANAGEMENT (STATUS FUNCTIONAL) */}
          {activeTab === 'inquiries' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                  <tr>
                    <th className="px-10 py-6">Sender Info</th>
                    <th className="px-10 py-6">Message & Subject</th>
                    <th className="px-10 py-6 text-center">Protocol Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {inquiries.map(inq => (
                    <tr key={inq.id} className="hover:bg-blue-600/[0.02] transition-colors group">
                      <td className="px-10 py-8">
                        <p className="font-black text-white">{inq.name}</p>
                        <p className="text-slate-500 text-xs font-bold">{inq.email}</p>
                      </td>
                      <td className="px-10 py-8">
                        <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest mb-1">{inq.subject || 'General Inquiry'}</p>
                        <p className="text-sm text-slate-400 italic line-clamp-2">"{inq.message}"</p>
                      </td>
                      <td className="px-10 py-8 text-center">
                        {inq.status === 'pending' ? (
                          <button 
                            onClick={() => handleUpdateStatus(inq.id, 'resolved')}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl text-[10px] font-black uppercase hover:bg-amber-500 hover:text-white transition-all shadow-lg shadow-amber-500/0 hover:shadow-amber-500/20"
                          >
                            <Clock size={14}/> Mark Resolved
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl text-[10px] font-black uppercase">
                            <ShieldCheck size={14}/> Completed
                          </span>
                        )}
                        <button 
                          onClick={() => deleteItem('contact', inq.id, setInquiries)}
                          className="ml-4 p-2.5 text-slate-600 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {inquiries.length === 0 && (
                <div className="py-20 text-center text-slate-600 uppercase font-black tracking-widest text-xs">No Transmissions Found</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* MODAL SYSTEM */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-slate-900 border border-white/10 w-full max-w-xl rounded-[3rem] p-12">
                <h3 className="text-3xl font-black mb-8 italic">New {activeTab === 'team' ? 'Member' : 'Project'} <span className="text-blue-500">Node</span></h3>
                {activeTab === 'team' ? (
                  <form onSubmit={handleAddMember} className="space-y-4">
                    <input type="text" placeholder="Member Name" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-indigo-500" onChange={e => setNewMember({...newMember, name: e.target.value})} required />
                    <input type="text" placeholder="Role (e.g., Lead Architect)" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-indigo-500" onChange={e => setNewMember({...newMember, role: e.target.value})} required />
                    <textarea placeholder="Brief Bio" rows="3" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-indigo-500" onChange={e => setNewMember({...newMember, bio: e.target.value})}></textarea>
                    <input type="url" placeholder="LinkedIn URL" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none text-xs" onChange={e => setNewMember({...newMember, linkedin_url: e.target.value})} />
                    <div className="flex gap-4 mt-8">
                      <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 bg-white/5 rounded-2xl font-black text-xs uppercase">Abort</button>
                      <button type="submit" className="flex-1 py-4 bg-indigo-600 rounded-2xl font-black text-xs uppercase shadow-lg shadow-indigo-600/20">Enroll Member</button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleAddProject} className="space-y-4">
                    <input type="text" placeholder="Project Name" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-blue-500" onChange={e => setNewProject({...newProject, title: e.target.value})} required />
                    <input type="text" placeholder="Tech Stack (Comma Separated)" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-blue-500" onChange={e => setNewProject({...newProject, tech_stack: e.target.value})} required />
                    <textarea placeholder="Description (Min 20 chars)" rows="4" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-blue-500" onChange={e => setNewProject({...newProject, description: e.target.value})} required minLength={20}></textarea>
                    <div className="grid grid-cols-2 gap-4">
                      <input type="url" placeholder="Live URL" className="bg-white/5 border border-white/10 rounded-2xl p-4 outline-none text-xs" onChange={e => setNewProject({...newProject, live_url: e.target.value})} />
                      <input type="url" placeholder="GitHub" className="bg-white/5 border border-white/10 rounded-2xl p-4 outline-none text-xs" onChange={e => setNewProject({...newProject, github_url: e.target.value})} />
                    </div>
                    <div className="flex gap-4 mt-8">
                      <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 bg-white/5 rounded-2xl font-black text-xs uppercase">Abort</button>
                      <button type="submit" className="flex-1 py-4 bg-blue-600 rounded-2xl font-black text-xs uppercase shadow-lg shadow-blue-600/20">Deploy Project</button>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminDashboard;