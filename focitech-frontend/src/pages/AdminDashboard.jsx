import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, FolderPlus, MessageSquare, Users, 
  LogOut, Plus, Trash2, CheckCircle, 
  Clock, TrendingUp, X, ExternalLink, ShieldCheck,
  Phone, Building, Mail, GitBranch
} from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [inquiries, setInquiries] = useState([]);
  const [projects, setProjects] = useState([]);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('project'); // 'project' or 'team'

  // Form States
  const [newProject, setNewProject] = useState({ 
    title: '', 
    description: '', 
    tech_stack: '', 
    live_url: '', 
    github_url: '',
    image_url: ''
  });
  const [newMember, setNewMember] = useState({ 
    name: '', 
    role: '', 
    bio: '', 
    linkedin_url: '',
    github_url: '',
    image_url: '',
    twitter_url: ''
  });

  // --- 1. DATA SYNC PROTOCOL ---
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [inqRes, projRes, teamRes] = await Promise.all([
        api.get('/contact/'),
        api.get('/portfolio/'),
        api.get('/corporate/')
      ]);
      setInquiries(Array.isArray(inqRes.data) ? inqRes.data : []);
      setProjects(Array.isArray(projRes.data) ? projRes.data : []);
      setTeam(Array.isArray(teamRes.data) ? teamRes.data : []);
    } catch (err) {
      console.error("Critical Sync Failure:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    fetchData(); 
  }, [fetchData]);

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
        tech_stack: newProject.tech_stack.split(',').map(s => s.trim()).filter(s => s !== ""),
        description: newProject.description.trim(),
        title: newProject.title.trim()
      };
      
      // Validate required fields
      if (!payload.title || !payload.description || payload.tech_stack.length === 0) {
        alert("Please fill in all required fields: Title, Description, and at least one technology.");
        return;
      }
      
      const res = await api.post('/portfolio/', payload);
      setProjects(prev => [res.data, ...prev]);
      setShowModal(false);
      setNewProject({ 
        title: '', 
        description: '', 
        tech_stack: '', 
        live_url: '', 
        github_url: '',
        image_url: ''
      });
    } catch (err) {
      console.error("Project creation error:", err);
      alert(err.response?.data?.detail || "Failed to create project. Please check your inputs.");
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newMember,
        name: newMember.name.trim(),
        role: newMember.role.trim()
      };
      
      // Validate required fields
      if (!payload.name || !payload.role) {
        alert("Name and Role are required fields.");
        return;
      }
      
      const res = await api.post('/corporate/', payload);
      setTeam(prev => [res.data, ...prev]);
      setShowModal(false);
      setNewMember({ 
        name: '', 
        role: '', 
        bio: '', 
        linkedin_url: '',
        github_url: '',
        image_url: '',
        twitter_url: ''
      });
    } catch (err) {
      console.error("Team member creation error:", err);
      alert(err.response?.data?.detail || "Failed to add team member.");
    }
  };

  const deleteItem = async (endpoint, id, stateSetter) => {
    if (window.confirm("Are you sure you want to delete this item? This action cannot be undone.")) {
      try {
        await api.delete(`/${endpoint}/${id}`);
        stateSetter(prev => prev.filter(item => item.id !== id));
      } catch (err) { 
        alert("Delete failed. Please try again."); 
      }
    }
  };

  // Stats calculation
  const stats = [
    { 
      label: 'Total Projects', 
      value: projects.length, 
      icon: <LayoutDashboard size={20}/>, 
      color: 'bg-gradient-to-br from-blue-600 to-cyan-500' 
    },
    { 
      label: 'Pending Inquiries', 
      value: inquiries.filter(i => i.status === 'pending').length, 
      icon: <MessageSquare size={20}/>, 
      color: 'bg-gradient-to-br from-amber-600 to-orange-500' 
    },
    { 
      label: 'Team Members', 
      value: team.length, 
      icon: <Users size={20}/>, 
      color: 'bg-gradient-to-br from-indigo-600 to-purple-500' 
    },
  ];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="relative mx-auto w-16 h-16">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-full h-full border-4 border-blue-600/30 border-t-blue-600 rounded-full"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="mt-6 text-slate-400 text-sm font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-white pt-20 lg:pt-24">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex w-80 border-r border-white/5 bg-slate-900/50 backdrop-blur-xl flex-col sticky top-20 h-[calc(100vh-5rem)] z-40">
          <div className="p-8 border-b border-white/5">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-black text-xl shadow-lg shadow-blue-600/30 uppercase">
                {user?.user_metadata?.full_name?.[0] || user?.email?.[0] || 'A'}
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight uppercase">FOCI<span className="text-blue-500">ADMIN</span></h2>
                <p className="text-slate-500 text-xs font-medium mt-1 truncate max-w-[180px]">
                  {user?.email || 'admin@focitech.com'}
                </p>
              </div>
            </div>

            <nav className="space-y-2">
              {[
                { id: 'overview', label: 'Overview', icon: <TrendingUp size={20} /> },
                { id: 'projects', label: 'Projects', icon: <FolderPlus size={20} /> },
                { id: 'inquiries', label: 'Inquiries', icon: <MessageSquare size={20} /> },
                { id: 'team', label: 'Team', icon: <Users size={20} /> }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all text-left ${
                    activeTab === item.id 
                      ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/10 border border-blue-500/20 text-white shadow-lg shadow-blue-600/10' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${activeTab === item.id ? 'bg-blue-600' : 'bg-slate-800'}`}>
                    {item.icon}
                  </div>
                  <span className="font-bold text-sm">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8 mt-auto">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => {
                  setModalType(activeTab === 'team' ? 'team' : 'project');
                  setShowModal(true);
                }}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-4 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20"
              >
                <Plus size={18} />
                Add New
              </button>
              <button
                onClick={logout}
                className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-red-500/20"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Header */}
        <div className="lg:hidden px-6 py-4 border-b border-white/5 bg-slate-900/50 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-black tracking-tight">FOCI<span className="text-blue-500">ADMIN</span></h1>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Dashboard</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setModalType(activeTab === 'team' ? 'team' : 'project');
                  setShowModal(true);
                }}
                className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-colors"
              >
                <Plus size={16} /> New
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Tab Navigation */}
        <div className="lg:hidden flex border-b border-white/5 bg-slate-900/50 backdrop-blur-xl overflow-x-auto no-scrollbar">
          {['overview', 'projects', 'inquiries', 'team'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-none px-6 py-4 text-sm font-medium capitalize border-b-2 transition-colors ${
                activeTab === tab
                  ? 'text-blue-500 border-blue-500'
                  : 'text-slate-500 border-transparent hover:text-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          {/* Stats Overview */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-2xl lg:text-3xl font-black mb-6 lg:mb-8">Dashboard Overview</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-slate-800/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 lg:p-8"
                  >
                    <div className={`${stat.color} w-12 h-12 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center text-white mb-4 lg:mb-6`}>
                      {stat.icon}
                    </div>
                    <p className="text-slate-400 text-xs lg:text-sm font-medium mb-1">{stat.label}</p>
                    <p className="text-3xl lg:text-4xl font-black">{stat.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <h1 className="text-2xl lg:text-3xl font-black">Projects ({projects.length})</h1>
                <button
                  onClick={() => {
                    setModalType('project');
                    setShowModal(true);
                  }}
                  className="hidden lg:flex bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-6 py-3 rounded-xl font-bold text-sm items-center gap-2 transition-all shadow-lg shadow-blue-600/20"
                >
                  <Plus size={18} />
                  Add Project
                </button>
              </div>

              {projects.length === 0 ? (
                <div className="text-center py-16 bg-slate-800/30 border border-white/5 rounded-3xl">
                  <FolderPlus className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-600 mb-2">No Projects Yet</h3>
                  <p className="text-slate-500 text-sm">Get started by adding your first project.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  {projects.map(project => (
                    <div
                      key={project.id}
                      className="bg-slate-800/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 group hover:border-blue-500/30 transition-all"
                    >
                      <h3 className="text-lg font-bold mb-3 line-clamp-1">{project.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tech_stack?.slice(0, 3).map((tech, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-xs font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.tech_stack?.length > 3 && (
                          <span className="px-3 py-1 bg-slate-700/50 text-slate-400 rounded-lg text-xs">
                            +{project.tech_stack.length - 3} more
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed">
                        {project.description}
                      </p>
                      <div className="flex justify-between items-center border-t border-white/5 pt-4">
                        <div className="flex gap-3">
                          {project.live_url && (
                            <a
                              href={project.live_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-500 hover:text-blue-400 transition-colors"
                              title="Live Demo"
                            >
                              <ExternalLink size={18} />
                            </a>
                          )}
                          {project.github_url && (
                            <a
                              href={project.github_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-400 hover:text-white transition-colors"
                              title="GitHub"
                            >
                              <GitBranch size={18} />
                            </a>
                          )}
                        </div>
                        <button
                          onClick={() => deleteItem('portfolio', project.id, setProjects)}
                          className="text-red-500/50 hover:text-red-500 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                          title="Delete Project"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Team Tab */}
          {activeTab === 'team' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <h1 className="text-2xl lg:text-3xl font-black">Team Members ({team.length})</h1>
                <button
                  onClick={() => {
                    setModalType('team');
                    setShowModal(true);
                  }}
                  className="hidden lg:flex bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-6 py-3 rounded-xl font-bold text-sm items-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
                >
                  <Plus size={18} />
                  Add Member
                </button>
              </div>

              {team.length === 0 ? (
                <div className="text-center py-16 bg-slate-800/30 border border-white/5 rounded-3xl">
                  <Users className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-600 mb-2">No Team Members</h3>
                  <p className="text-slate-500 text-sm">Start building your team by adding members.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                  {team.map(member => (
                    <div
                      key={member.id}
                      className="bg-slate-800/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 group hover:border-indigo-500/30 transition-all"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl uppercase border border-indigo-500/30">
                          {member.name?.[0] || 'M'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-white text-lg truncate">{member.name}</h3>
                          <p className="text-indigo-400 text-sm font-medium">{member.role}</p>
                        </div>
                      </div>
                      
                      {member.bio && (
                        <p className="text-slate-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                          {member.bio}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between border-t border-white/5 pt-4">
                        <div className="flex gap-2">
                          {member.linkedin_url && (
                            <a
                              href={member.linkedin_url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                              title="LinkedIn"
                            >
                              <ExternalLink size={16} />
                            </a>
                          )}
                          {member.github_url && (
                            <a
                              href={member.github_url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                              title="GitHub"
                            >
                              <GitBranch size={16} />
                            </a>
                          )}
                        </div>
                        <button
                          onClick={() => deleteItem('corporate', member.id, setTeam)}
                          className="p-2 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Remove Member"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Inquiries Tab */}
          {activeTab === 'inquiries' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <h1 className="text-2xl lg:text-3xl font-black">Inquiries ({inquiries.length})</h1>
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-500 rounded-full">
                    {inquiries.filter(i => i.status === 'pending').length} Pending
                  </span>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-500 rounded-full">
                    {inquiries.filter(i => i.status === 'resolved').length} Resolved
                  </span>
                </div>
              </div>

              {inquiries.length === 0 ? (
                <div className="text-center py-16 bg-slate-800/30 border border-white/5 rounded-3xl">
                  <MessageSquare className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-600 mb-2">No Inquiries</h3>
                  <p className="text-slate-500 text-sm">Contact form inquiries will appear here.</p>
                </div>
              ) : (
                <div className="bg-slate-800/30 border border-white/5 rounded-3xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                      <thead className="bg-slate-900/50 border-b border-white/5">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Contact</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Message</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {inquiries.map(inquiry => (
                          <tr key={inquiry.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-bold text-white">{inquiry.name}</p>
                                <div className="flex items-center gap-1 text-slate-400 text-sm">
                                  <Mail size={14} />
                                  {inquiry.email}
                                </div>
                                {inquiry.phone && (
                                  <div className="flex items-center gap-1 text-slate-400 text-sm mt-1">
                                    <Phone size={14} />
                                    {inquiry.phone}
                                  </div>
                                )}
                                {inquiry.company && (
                                  <div className="flex items-center gap-1 text-slate-400 text-sm mt-1">
                                    <Building size={14} />
                                    {inquiry.company}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 max-w-md">
                              <div>
                                <p className="text-blue-500 text-xs font-bold uppercase mb-1">
                                  {inquiry.subject || 'General Inquiry'}
                                </p>
                                <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed">
                                  {inquiry.message}
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-slate-400 text-sm">
                                {new Date(inquiry.created_at).toLocaleDateString()}
                              </p>
                              <p className="text-slate-500 text-xs">
                                {new Date(inquiry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                                inquiry.status === 'resolved' 
                                  ? 'bg-emerald-500/20 text-emerald-500' 
                                  : 'bg-amber-500/20 text-amber-500'
                              }`}>
                                {inquiry.status === 'resolved' ? (
                                  <>
                                    <CheckCircle size={12} />
                                    Resolved
                                  </>
                                ) : (
                                  <>
                                    <Clock size={12} />
                                    Pending
                                  </>
                                )}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                {inquiry.status === 'pending' ? (
                                  <button
                                    onClick={() => handleUpdateStatus(inquiry.id, 'resolved')}
                                    className="px-4 py-2 bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-xl text-xs font-bold transition-colors"
                                  >
                                    Mark Resolved
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleUpdateStatus(inquiry.id, 'pending')}
                                    className="px-4 py-2 bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 border border-amber-500/30 rounded-xl text-xs font-bold transition-colors"
                                  >
                                    Mark Pending
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteItem('contact', inquiry.id, setInquiries)}
                                  className="p-2 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                  title="Delete Inquiry"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </main>
      </div>

      {/* Modal */}
      {/* Modal */}
<AnimatePresence>
  {showModal && (
    <div className="fixed inset-0 z-[9999] flex items-start sm:items-center justify-center p-0 sm:p-2 md:p-4 bg-black/90 backdrop-blur-lg overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 w-full min-h-screen sm:min-h-0 sm:max-w-lg sm:rounded-2xl md:rounded-3xl shadow-2xl shadow-black/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed Header for Mobile */}
        <div className="sticky top-0 z-10 bg-slate-900 border-b border-white/10 px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold truncate">
              Add New {modalType === 'project' ? 'Project' : 'Team Member'}
            </h3>
            <p className="text-xs text-slate-400 truncate">
              Fill in the details below
            </p>
          </div>
          <button
            onClick={() => setShowModal(false)}
            className="ml-4 p-1.5 hover:bg-white/5 rounded-lg transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(100vh-60px)] sm:max-h-[80vh]">
          <div className="p-4 sm:p-6 md:p-8">
            <form
              onSubmit={modalType === 'project' ? handleAddProject : handleAddMember}
              className="space-y-4 sm:space-y-6"
            >
              {modalType === 'project' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Project Title *</label>
                    <input
                      type="text"
                      placeholder="Enter project title"
                      value={newProject.title}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Description * (Min. 20 characters)
                    </label>
                    <textarea
                      placeholder="Describe the project in detail"
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      rows="4"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm resize-none"
                      required
                      minLength={20}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Tech Stack * (comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="React, FastAPI, Supabase, etc."
                      value={newProject.tech_stack}
                      onChange={(e) => setNewProject({ ...newProject, tech_stack: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Live URL</label>
                      <input
                        type="url"
                        placeholder="https://example.com"
                        value={newProject.live_url}
                        onChange={(e) => setNewProject({ ...newProject, live_url: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">GitHub URL</label>
                      <input
                        type="url"
                        placeholder="https://github.com/username/repo"
                        value={newProject.github_url}
                        onChange={(e) => setNewProject({ ...newProject, github_url: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Image URL</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={newProject.image_url}
                      onChange={(e) => setNewProject({ ...newProject, image_url: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Full Name *</label>
                    <input
                      type="text"
                      placeholder="Enter full name"
                      value={newMember.name}
                      onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Role *</label>
                    <input
                      type="text"
                      placeholder="e.g., Lead Developer, Designer, etc."
                      value={newMember.role}
                      onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Bio</label>
                    <textarea
                      placeholder="Short bio about the team member"
                      value={newMember.bio}
                      onChange={(e) => setNewMember({ ...newMember, bio: e.target.value })}
                      rows="3"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">LinkedIn URL</label>
                      <input
                        type="url"
                        placeholder="https://linkedin.com/in/username"
                        value={newMember.linkedin_url}
                        onChange={(e) => setNewMember({ ...newMember, linkedin_url: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">GitHub URL</label>
                      <input
                        type="url"
                        placeholder="https://github.com/username"
                        value={newMember.github_url}
                        onChange={(e) => setNewMember({ ...newMember, github_url: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Image URL</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={newMember.image_url}
                      onChange={(e) => setNewMember({ ...newMember, image_url: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Twitter URL</label>
                    <input
                      type="url"
                      placeholder="https://twitter.com/username"
                      value={newMember.twitter_url}
                      onChange={(e) => setNewMember({ ...newMember, twitter_url: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm"
                    />
                  </div>
                </>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="py-2.5 sm:py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`py-2.5 sm:py-3 rounded-xl font-bold text-sm transition-all ${
                    modalType === 'project'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                  }`}
                >
                  {modalType === 'project' ? 'Create Project' : 'Add Team Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>
    </div>
  );
};

export default AdminDashboard;