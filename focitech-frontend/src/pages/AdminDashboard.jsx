import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, FolderPlus, MessageSquare, Users, 
  LogOut, Plus, Trash2, CheckCircle, 
  Clock, TrendingUp, X, ExternalLink, ShieldCheck 
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

  // --- 2. INQUIRY STATUS MANAGEMENT ---
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.put(`/contact/${id}`, { status: newStatus });
      setInquiries(prev => prev.map(inq => 
        inq.id === id ? { ...inq, status: newStatus } : inq
      ));
    } catch (err) {
      alert("Status Update Failed.");
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

  const stats = [
    { label: 'Total Projects', value: projects.length, icon: <LayoutDashboard size={18}/>, color: 'bg-blue-600' },
    { label: 'Pending Leads', value: inquiries.filter(i => i.status === 'pending').length, icon: <MessageSquare size={18}/>, color: 'bg-amber-600' },
    { label: 'Team Nodes', value: team.length, icon: <Users size={18}/>, color: 'bg-indigo-600' },
  ];

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col lg:flex-row pt-20 lg:pt-0">
      
      {/* --- SIDEBAR (PC) / TOP NAV (MOBILE) --- */}
      <aside className="w-full lg:w-80 border-b lg:border-r lg:border-b-0 border-white/5 bg-slate-900/50 backdrop-blur-3xl p-6 lg:p-8 flex flex-col lg:sticky lg:top-0 lg:h-screen z-[40]">
        <div className="mb-6 lg:mb-12 px-2 flex justify-between items-center lg:block">
          <div>
            <h2 className="text-xl lg:text-2xl font-black italic tracking-tighter uppercase">FOCI<span className="text-blue-500">ADMIN</span></h2>
            <p className="text-[9px] lg:text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1 italic">TechnoviaX Engine</p>
          </div>
          <button onClick={logout} className="lg:hidden text-red-500 p-2"><LogOut size={20} /></button>
        </div>

        {/* Mobile Horizontal scroll - Fixed to not overlap Main Navbar */}
        <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 no-scrollbar">
          {['overview', 'projects', 'inquiries', 'team'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)} 
              className={`flex-none lg:w-full flex items-center gap-3 lg:gap-4 px-5 lg:px-6 py-3 lg:py-4 rounded-xl lg:rounded-2xl transition-all capitalize font-bold text-xs lg:text-sm whitespace-nowrap ${
                activeTab === tab ? 'bg-blue-600 shadow-lg shadow-blue-600/20' : 'text-slate-400 bg-white/5 lg:bg-transparent'
              }`}
            >
              {tab === 'overview' ? <TrendingUp size={16}/> : tab === 'projects' ? <FolderPlus size={16}/> : tab === 'inquiries' ? <MessageSquare size={16}/> : <Users size={16}/>}
              {tab}
            </button>
          ))}
        </nav>

        <button onClick={logout} className="hidden lg:flex mt-auto items-center gap-4 px-6 py-4 text-red-500 font-black text-xs uppercase tracking-widest hover:bg-red-500/10 rounded-2xl transition-all">
          <LogOut size={18} /> Terminate Session
        </button>
      </aside>

      {/* --- MAIN INTERFACE --- */}
      <main className="flex-1 p-6 lg:p-12 overflow-x-hidden">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center font-black text-xl shadow-lg shadow-blue-600/30 uppercase">
              {user?.user_metadata?.full_name?.[0] || user?.email?.[0] || 'A'}
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight capitalize">{activeTab}</h1>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest italic leading-none mt-1">Terminal Node Bareilly</p>
            </div>
          </div>
          <button onClick={() => setShowModal(true)} className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-600/20 transition-all active:scale-95">
            + New {activeTab === 'team' ? 'Member' : 'Project'}
          </button>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key="ov" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.map((s, i) => (
                <div key={i} className="bg-slate-900/50 border border-white/5 p-8 rounded-[2rem]">
                  <div className={`${s.color} w-10 h-10 rounded-xl flex items-center justify-center text-white mb-6`}>{s.icon}</div>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{s.label}</p>
                  <h3 className="text-4xl lg:text-5xl font-black mt-2 tracking-tighter">{s.value}</h3>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'projects' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="pj" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {projects.map(proj => (
                <div key={proj.id} className="bg-slate-900/50 border border-white/5 p-6 rounded-[2rem] flex flex-col group hover:border-blue-500/30 transition-all">
                  <h3 className="text-lg font-black mb-3 line-clamp-1">{proj.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {proj.tech_stack?.map(tag => <span key={tag} className="px-2 py-1 bg-white/5 rounded-md text-[9px] text-slate-400 font-bold uppercase">{tag}</span>)}
                  </div>
                  <p className="text-slate-400 text-xs mb-6 line-clamp-3 leading-relaxed italic">"{proj.description}"</p>
                  <div className="flex justify-between items-center mt-auto border-t border-white/5 pt-6">
                    <a href={proj.live_url} target="_blank" rel="noreferrer" className="text-blue-500"><ExternalLink size={18}/></a>
                    <button onClick={() => deleteItem('portfolio', proj.id, setProjects)} className="text-red-500/40 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'team' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="tm" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {team.map(member => (
                <div key={member.id} className="bg-slate-900/50 border border-white/5 p-6 rounded-[2rem] flex items-center gap-4 group hover:border-indigo-500/30 transition-all">
                  <div className="w-14 h-14 bg-indigo-600/20 rounded-2xl flex items-center justify-center text-indigo-400 font-black text-xl border border-indigo-500/20 uppercase">
                    {member.name?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-white text-sm truncate">{member.name}</h3>
                    <p className="text-indigo-400 text-[10px] font-bold uppercase mb-2">{member.role}</p>
                    <button onClick={() => deleteItem('corporate', member.id, setTeam)} className="text-red-500/50 hover:text-red-500 text-[9px] font-black uppercase">Remove Node</button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'inquiries' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="in" className="bg-slate-900/50 border border-white/5 rounded-[2rem] overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead className="bg-white/5 text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">
                  <tr>
                    <th className="px-8 py-6">Origin</th>
                    <th className="px-8 py-6">Packet Info</th>
                    <th className="px-8 py-6 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {inquiries.map(inq => (
                    <tr key={inq.id} className="group">
                      <td className="px-8 py-6">
                        <p className="font-black text-sm text-white">{inq.name}</p>
                        <p className="text-slate-500 text-[10px]">{inq.email}</p>
                      </td>
                      <td className="px-8 py-6 max-w-xs">
                        <p className="text-blue-500 text-[9px] font-black uppercase mb-1">{inq.subject || 'Standard Inquiry'}</p>
                        <p className="text-xs text-slate-400 italic line-clamp-1">"{inq.message}"</p>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex items-center justify-center gap-4">
                          {inq.status === 'pending' ? (
                            <button onClick={() => handleUpdateStatus(inq.id, 'resolved')} className="px-4 py-2 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl text-[9px] font-black uppercase hover:bg-amber-500 transition-all">Resolve</button>
                          ) : (
                            <span className="flex items-center gap-1 text-emerald-500 text-[9px] font-black uppercase"><ShieldCheck size={14}/> Completed</span>
                          )}
                          <button onClick={() => deleteItem('contact', inq.id, setInquiries)} className="text-slate-600 hover:text-red-500"><Trash2 size={16}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MODAL SYSTEM */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-[2.5rem] p-8 lg:p-12 my-8">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black italic uppercase">Deploy New <span className="text-blue-500">Node</span></h3>
                  <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors"><X size={24}/></button>
                </div>

                <form onSubmit={activeTab === 'team' ? handleAddMember : handleAddProject} className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-500 uppercase px-2">Identification</p>
                    <input type="text" placeholder={activeTab === 'team' ? "Member Full Name" : "Project Title"} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-blue-500 text-sm" 
                      onChange={e => activeTab === 'team' ? setNewMember({...newMember, name: e.target.value}) : setNewProject({...newProject, title: e.target.value})} required />
                  </div>

                  {activeTab === 'projects' ? (
                    <>
                      <input type="text" placeholder="Tech Stack (CSV)" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-blue-500 text-sm" onChange={e => setNewProject({...newProject, tech_stack: e.target.value})} required />
                      <textarea placeholder="Logic Description (Min 20 chars)" rows="4" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-blue-500 text-sm resize-none" onChange={e => setNewProject({...newProject, description: e.target.value})} required minLength={20}></textarea>
                      <div className="grid grid-cols-2 gap-4">
                        <input type="url" placeholder="Live URL" className="bg-white/5 border border-white/10 rounded-2xl p-4 outline-none text-[10px]" onChange={e => setNewProject({...newProject, live_url: e.target.value})} />
                        <input type="url" placeholder="GitHub" className="bg-white/5 border border-white/10 rounded-2xl p-4 outline-none text-[10px]" onChange={e => setNewProject({...newProject, github_url: e.target.value})} />
                      </div>
                    </>
                  ) : (
                    <>
                      <input type="text" placeholder="Designation" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-indigo-500 text-sm" onChange={e => setNewMember({...newMember, role: e.target.value})} required />
                      <textarea placeholder="Bio Summary" rows="3" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-indigo-500 text-sm resize-none" onChange={e => setNewMember({...newMember, bio: e.target.value})}></textarea>
                      <input type="url" placeholder="LinkedIn Data Sync" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none text-[10px]" onChange={e => setNewMember({...newMember, linkedin_url: e.target.value})} />
                    </>
                  )}

                  <div className="flex gap-4 pt-6">
                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 bg-white/5 rounded-2xl font-black text-[10px] uppercase">Abort</button>
                    <button type="submit" className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase bg-blue-600 shadow-lg shadow-blue-600/20`}>Commit Node</button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminDashboard;