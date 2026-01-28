import { useState, useEffect, useCallback, memo } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, FolderPlus, MessageSquare, Users, 
  LogOut, Plus, Trash2, CheckCircle, 
  Clock, TrendingUp, X, ExternalLink,
  Phone, Building, Mail, GitBranch,
  Edit, Save, Loader2
} from 'lucide-react';

// Memoized components for performance
const StatCard = memo(({ stat }) => (
  <div className="bg-slate-800/50 backdrop-blur-sm border border-white/5 rounded-3xl p-4 sm:p-6">
    <div className={`${stat.color} w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-white mb-3 sm:mb-4`}>
      {stat.icon}
    </div>
    <p className="text-slate-400 text-xs sm:text-sm font-medium mb-1">{stat.label}</p>
    <p className="text-2xl sm:text-3xl lg:text-4xl font-black">{stat.value}</p>
  </div>
));

const ProjectCard = memo(({ project, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...project });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onEdit(project.id, editedData);
      setIsEditing(false);
    } catch (error) {
      alert('Failed to update project');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedData({ ...project });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6">
        <div className="space-y-3">
          <input
            type="text"
            value={editedData.title}
            onChange={(e) => setEditedData({ ...editedData, title: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 outline-none"
            placeholder="Project Title"
          />
          
          <textarea
            value={editedData.description}
            onChange={(e) => setEditedData({ ...editedData, description: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 outline-none resize-none h-24"
            placeholder="Project Description"
          />
          
          <input
            type="text"
            value={editedData.tech_stack?.join(', ')}
            onChange={(e) => setEditedData({ ...editedData, tech_stack: e.target.value.split(',').map(s => s.trim()) })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 outline-none"
            placeholder="Tech Stack (comma separated)"
          />
          
          <div className="grid grid-cols-2 gap-2">
            <input
              type="url"
              value={editedData.live_url || ''}
              onChange={(e) => setEditedData({ ...editedData, live_url: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 outline-none"
              placeholder="Live URL"
            />
            <input
              type="url"
              value={editedData.github_url || ''}
              onChange={(e) => setEditedData({ ...editedData, github_url: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 outline-none"
              placeholder="GitHub URL"
            />
          </div>
          
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg font-bold text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-6 group hover:border-blue-500/30 transition-all">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-base sm:text-lg font-bold line-clamp-1 flex-1">{project.title}</h3>
        <div className="flex gap-1">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
            title="Edit Project"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(project.id)}
            className="p-1.5 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Delete Project"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
        {project.tech_stack?.slice(0, 3).map((tech, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-xs font-medium"
          >
            {tech}
          </span>
        ))}
        {project.tech_stack?.length > 3 && (
          <span className="px-2 py-1 bg-slate-700/50 text-slate-400 rounded-lg text-xs">
            +{project.tech_stack.length - 3}
          </span>
        )}
      </div>
      
      <p className="text-slate-400 text-xs sm:text-sm mb-4 sm:mb-6 line-clamp-3 leading-relaxed">
        {project.description}
      </p>
      
      <div className="flex justify-between items-center border-t border-white/5 pt-3 sm:pt-4">
        <div className="flex gap-2 sm:gap-3">
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 hover:text-blue-400 transition-colors"
              title="Live Demo"
            >
              <ExternalLink size={16} sm:size={18} />
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
              <GitBranch size={16} sm:size={18} />
            </a>
          )}
        </div>
        <span className="text-xs text-slate-500">
          {new Date(project.created_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
});

const TeamCard = memo(({ member, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...member });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onEdit(member.id, editedData);
      setIsEditing(false);
    } catch (error) {
      alert('Failed to update team member');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedData({ ...member });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6">
        <div className="space-y-3">
          <input
            type="text"
            value={editedData.name}
            onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 outline-none"
            placeholder="Full Name"
          />
          
          <input
            type="text"
            value={editedData.role}
            onChange={(e) => setEditedData({ ...editedData, role: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 outline-none"
            placeholder="Role"
          />
          
          <textarea
            value={editedData.bio || ''}
            onChange={(e) => setEditedData({ ...editedData, bio: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 outline-none resize-none h-20"
            placeholder="Bio"
          />
          
          <div className="grid grid-cols-2 gap-2">
            <input
              type="url"
              value={editedData.linkedin_url || ''}
              onChange={(e) => setEditedData({ ...editedData, linkedin_url: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 outline-none"
              placeholder="LinkedIn URL"
            />
            <input
              type="url"
              value={editedData.github_url || ''}
              onChange={(e) => setEditedData({ ...editedData, github_url: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 outline-none"
              placeholder="GitHub URL"
            />
          </div>
          
          <input
            type="url"
            value={editedData.image_url || ''}
            onChange={(e) => setEditedData({ ...editedData, image_url: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 outline-none"
            placeholder="Image URL"
          />
          
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg font-bold text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-6 group hover:border-indigo-500/30 transition-all">
      <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-bold text-lg sm:text-xl uppercase border border-indigo-500/30">
          {member.name?.[0] || 'M'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white text-base sm:text-lg truncate">{member.name}</h3>
              <p className="text-indigo-400 text-xs sm:text-sm font-medium truncate">{member.role}</p>
            </div>
            <div className="flex gap-1 ml-2">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                title="Edit Member"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => onDelete(member.id)}
                className="p-1.5 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Remove Member"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {member.bio && (
        <p className="text-slate-400 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3 leading-relaxed">
          {member.bio}
        </p>
      )}
      
      <div className="flex items-center justify-between border-t border-white/5 pt-3 sm:pt-4">
        <div className="flex gap-1 sm:gap-2">
          {member.linkedin_url && (
            <a
              href={member.linkedin_url}
              target="_blank"
              rel="noreferrer"
              className="p-1 sm:p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
              title="LinkedIn"
            >
              <ExternalLink size={14} sm:size={16} />
            </a>
          )}
          {member.github_url && (
            <a
              href={member.github_url}
              target="_blank"
              rel="noreferrer"
              className="p-1 sm:p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              title="GitHub"
            >
              <GitBranch size={14} sm:size={16} />
            </a>
          )}
        </div>
        <span className="text-xs text-slate-500">
          {new Date(member.created_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
});

const InquiryRow = memo(({ inquiry, onUpdateStatus, onDelete }) => (
  <tr className="hover:bg-white/5 transition-colors">
    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
      <div>
        <p className="font-bold text-white text-sm sm:text-base">{inquiry.name}</p>
        <div className="flex items-center gap-1 text-slate-400 text-xs sm:text-sm">
          <Mail size={12} sm:size={14} />
          <span className="truncate">{inquiry.email}</span>
        </div>
        {inquiry.phone && (
          <div className="flex items-center gap-1 text-slate-400 text-xs sm:text-sm mt-1">
            <Phone size={12} sm:size={14} />
            <span>{inquiry.phone}</span>
          </div>
        )}
        {inquiry.company && (
          <div className="flex items-center gap-1 text-slate-400 text-xs sm:text-sm mt-1">
            <Building size={12} sm:size={14} />
            <span className="truncate">{inquiry.company}</span>
          </div>
        )}
      </div>
    </td>
    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
      <div>
        <p className="text-blue-500 text-xs font-bold uppercase mb-1">
          {inquiry.subject || 'General Inquiry'}
        </p>
        <p className="text-slate-400 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3 leading-relaxed">
          {inquiry.message}
        </p>
      </div>
    </td>
    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
      <p className="text-slate-400 text-xs sm:text-sm">
        {new Date(inquiry.created_at).toLocaleDateString()}
      </p>
      <p className="text-slate-500 text-[10px] sm:text-xs">
        {new Date(inquiry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
    </td>
    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
      <span className={`inline-flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-bold ${
        inquiry.status === 'resolved' 
          ? 'bg-emerald-500/20 text-emerald-500' 
          : 'bg-amber-500/20 text-amber-500'
      }`}>
        {inquiry.status === 'resolved' ? (
          <>
            <CheckCircle size={10} sm:size={12} />
            <span className="hidden sm:inline">Resolved</span>
          </>
        ) : (
          <>
            <Clock size={10} sm:size={12} />
            <span className="hidden sm:inline">Pending</span>
          </>
        )}
      </span>
    </td>
    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
      <div className="flex items-center gap-1 sm:gap-2">
        {inquiry.status === 'pending' ? (
          <button
            onClick={() => onUpdateStatus(inquiry.id, 'resolved')}
            className="px-2 py-1 sm:px-4 sm:py-2 bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-lg sm:rounded-xl text-xs font-bold transition-colors"
          >
            <span className="hidden sm:inline">Mark Resolved</span>
            <span className="sm:hidden">
              <CheckCircle size={14} />
            </span>
          </button>
        ) : (
          <button
            onClick={() => onUpdateStatus(inquiry.id, 'pending')}
            className="px-2 py-1 sm:px-4 sm:py-2 bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 border border-amber-500/30 rounded-lg sm:rounded-xl text-xs font-bold transition-colors"
          >
            <span className="hidden sm:inline">Mark Pending</span>
            <span className="sm:hidden">
              <Clock size={14} />
            </span>
          </button>
        )}
        <button
          onClick={() => onDelete(inquiry.id)}
          className="p-1 sm:p-2 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
          title="Delete Inquiry"
        >
          <Trash2 size={14} sm:size={16} />
        </button>
      </div>
    </td>
  </tr>
));

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [inquiries, setInquiries] = useState([]);
  const [projects, setProjects] = useState([]);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('project');

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

  // Optimized data fetching with caching
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [inqRes, projRes, teamRes] = await Promise.allSettled([
        api.get('/contact/'),
        api.get('/portfolio/'),
        api.get('/corporate/')
      ]);
      
      setInquiries(Array.isArray(inqRes.value?.data) ? inqRes.value.data : []);
      setProjects(Array.isArray(projRes.value?.data) ? projRes.value.data : []);
      setTeam(Array.isArray(teamRes.value?.data) ? teamRes.value.data : []);
    } catch (err) {
      console.error("Sync error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    fetchData(); 
  }, [fetchData]);

  // Update project
  const handleUpdateProject = async (id, updatedData) => {
    try {
      // Format the data according to your schema
      const payload = {
        ...updatedData,
        tech_stack: Array.isArray(updatedData.tech_stack) ? updatedData.tech_stack : updatedData.tech_stack
      };

      const res = await api.patch(`/portfolio/${id}`, payload);
      setProjects(prev => prev.map(project => 
        project.id === id ? res.data : project
      ));
      return res.data;
    } catch (err) {
      console.error("Update error:", err);
      throw err;
    }
  };

  // Update team member
  const handleUpdateMember = async (id, updatedData) => {
    try {
      const res = await api.patch(`/corporate/${id}`, updatedData);
      setTeam(prev => prev.map(member => 
        member.id === id ? res.data : member
      ));
      return res.data;
    } catch (err) {
      console.error("Update error:", err);
      throw err;
    }
  };

  // Status update with optimistic UI
  const handleUpdateStatus = async (id, newStatus) => {
    const previousInquiries = [...inquiries];
    try {
      setInquiries(prev => prev.map(inq => 
        inq.id === id ? { ...inq, status: newStatus } : inq
      ));
      await api.put(`/contact/${id}`, { status: newStatus });
    } catch (err) {
      setInquiries(previousInquiries);
      alert("Status Update Failed.");
    }
  };

  // Add new project
  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newProject,
        tech_stack: newProject.tech_stack.split(',').map(s => s.trim()).filter(Boolean),
        description: newProject.description.trim(),
        title: newProject.title.trim()
      };
      
      if (!payload.title || !payload.description || payload.tech_stack.length === 0) {
        alert("Please fill in all required fields");
        return;
      }
      
      const res = await api.post('/portfolio/', payload);
      setProjects(prev => [res.data, ...prev]);
      setShowModal(false);
      setNewProject({ 
        title: '', description: '', tech_stack: '', 
        live_url: '', github_url: '', image_url: '' 
      });
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to create project");
    }
  };

  // Add new team member
  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newMember,
        name: newMember.name.trim(),
        role: newMember.role.trim()
      };
      
      if (!payload.name || !payload.role) {
        alert("Name and Role are required");
        return;
      }
      
      const res = await api.post('/corporate/', payload);
      setTeam(prev => [res.data, ...prev]);
      setShowModal(false);
      setNewMember({ 
        name: '', role: '', bio: '', linkedin_url: '',
        github_url: '', image_url: '', twitter_url: '' 
      });
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to add team member");
    }
  };

  // Delete items
  const deleteItem = async (endpoint, id, stateSetter) => {
    if (window.confirm("Are you sure? This cannot be undone.")) {
      try {
        await api.delete(`/${endpoint}/${id}`);
        stateSetter(prev => prev.filter(item => item.id !== id));
      } catch (err) { 
        alert("Delete failed"); 
      }
    }
  };

  // Memoized stats
  const stats = [
    { 
      label: 'Total Projects', 
      value: projects.length, 
      icon: <LayoutDashboard size={18} sm:size={20}/>, 
      color: 'bg-gradient-to-br from-blue-600 to-cyan-500' 
    },
    { 
      label: 'Pending Inquiries', 
      value: inquiries.filter(i => i.status === 'pending').length, 
      icon: <MessageSquare size={18} sm:size={20}/>, 
      color: 'bg-gradient-to-br from-amber-600 to-orange-500' 
    },
    { 
      label: 'Team Members', 
      value: team.length, 
      icon: <Users size={18} sm:size={20}/>, 
      color: 'bg-gradient-to-br from-indigo-600 to-purple-500' 
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center pt-16 sm:pt-20">
        <div className="text-center">
          <div className="relative mx-auto w-12 h-12 sm:w-16 sm:h-16">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-full h-full border-4 border-blue-600/30 border-t-blue-600 rounded-full"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 sm:w-6 sm:h-6 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="mt-4 sm:mt-6 text-slate-400 text-xs sm:text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-white pt-16 sm:pt-20 lg:pt-24">
      <div className="flex flex-col lg:flex-row">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-72 lg:w-80 border-r border-white/5 bg-slate-900/50 backdrop-blur-xl flex-col sticky top-16 lg:top-20 h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)] z-40">
          <div className="p-6 lg:p-8 border-b border-white/5">
            <div className="flex items-center gap-3 lg:gap-4 mb-6 lg:mb-8">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-black text-lg lg:text-xl shadow-lg shadow-blue-600/30 uppercase">
                {user?.user_metadata?.full_name?.[0] || user?.email?.[0] || 'A'}
              </div>
              <div>
                <h2 className="text-lg lg:text-xl font-black tracking-tight uppercase">FOCI<span className="text-blue-500">ADMIN</span></h2>
                <p className="text-slate-500 text-xs font-medium mt-1 truncate max-w-[150px] lg:max-w-[180px]">
                  {user?.email || 'admin@focitech.com'}
                </p>
              </div>
            </div>

            <nav className="space-y-1 lg:space-y-2">
              {[
                { id: 'overview', label: 'Overview', icon: <TrendingUp size={18} lg:size={20} /> },
                { id: 'projects', label: 'Projects', icon: <FolderPlus size={18} lg:size={20} /> },
                { id: 'inquiries', label: 'Inquiries', icon: <MessageSquare size={18} lg:size={20} /> },
                { id: 'team', label: 'Team', icon: <Users size={18} lg:size={20} /> }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 lg:gap-4 px-4 lg:px-6 py-3 lg:py-4 rounded-xl lg:rounded-2xl transition-all text-left ${
                    activeTab === item.id 
                      ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/10 border border-blue-500/20 text-white shadow-lg shadow-blue-600/10' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className={`p-1.5 lg:p-2 rounded-lg ${activeTab === item.id ? 'bg-blue-600' : 'bg-slate-800'}`}>
                    {item.icon}
                  </div>
                  <span className="font-bold text-sm">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6 lg:p-8 mt-auto">
            <div className="flex items-center gap-3 lg:gap-4 mb-4 lg:mb-6">
              <button
                onClick={() => {
                  setModalType(activeTab === 'team' ? 'team' : 'project');
                  setShowModal(true);
                }}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl font-bold text-xs lg:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20"
              >
                <Plus size={16} lg:size={18} />
                Add New
              </button>
              <button
                onClick={logout}
                className="p-2 lg:p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-red-500/20"
                title="Logout"
              >
                <LogOut size={16} lg:size={18} />
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Header */}
        <div className="lg:hidden px-4 sm:px-6 py-3 sm:py-4 border-b border-white/5 bg-slate-900/50 backdrop-blur-xl sticky top-16 z-30">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight">FOCI<span className="text-blue-500">ADMIN</span></h1>
              <p className="text-[9px] sm:text-[10px] text-slate-500 font-medium uppercase tracking-wider">Dashboard</p>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => {
                  setModalType(activeTab === 'team' ? 'team' : 'project');
                  setShowModal(true);
                }}
                className="bg-blue-600 hover:bg-blue-500 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-bold text-xs flex items-center gap-1 sm:gap-2 transition-colors"
              >
                <Plus size={14} sm:size={16} /> 
                <span className="hidden sm:inline">New</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Tab Navigation */}
        <div className="lg:hidden flex border-b border-white/5 bg-slate-900/50 backdrop-blur-xl overflow-x-auto no-scrollbar sticky top-[4.5rem] sm:top-[5rem] z-20">
          {['overview', 'projects', 'inquiries', 'team'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-none px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium capitalize border-b-2 transition-colors ${
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
        <main className="flex-1 p-3 sm:p-4 lg:p-6 xl:p-8 overflow-x-hidden">
          {/* Stats Overview */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 sm:mb-8"
            >
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black mb-4 sm:mb-6 lg:mb-8">Dashboard Overview</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                {stats.map((stat, index) => (
                  <StatCard key={index} stat={stat} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4 sm:space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black">Projects ({projects.length})</h1>
                <button
                  onClick={() => {
                    setModalType('project');
                    setShowModal(true);
                  }}
                  className="hidden lg:flex bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-4 lg:px-6 py-2.5 lg:py-3 rounded-xl font-bold text-sm items-center gap-2 transition-all shadow-lg shadow-blue-600/20"
                >
                  <Plus size={16} lg:size={18} />
                  Add Project
                </button>
              </div>

              {projects.length === 0 ? (
                <div className="text-center py-12 sm:py-16 bg-slate-800/30 border border-white/5 rounded-2xl sm:rounded-3xl">
                  <FolderPlus className="w-12 h-12 sm:w-16 sm:h-16 text-slate-700 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-bold text-slate-600 mb-1 sm:mb-2">No Projects Yet</h3>
                  <p className="text-slate-500 text-xs sm:text-sm">Add your first project</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                  {projects.map(project => (
                    <ProjectCard 
                      key={project.id} 
                      project={project} 
                      onDelete={(id) => deleteItem('portfolio', id, setProjects)}
                      onEdit={handleUpdateProject}
                    />
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
              className="space-y-4 sm:space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black">Team Members ({team.length})</h1>
                <button
                  onClick={() => {
                    setModalType('team');
                    setShowModal(true);
                  }}
                  className="hidden lg:flex bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-4 lg:px-6 py-2.5 lg:py-3 rounded-xl font-bold text-sm items-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
                >
                  <Plus size={16} lg:size={18} />
                  Add Member
                </button>
              </div>

              {team.length === 0 ? (
                <div className="text-center py-12 sm:py-16 bg-slate-800/30 border border-white/5 rounded-2xl sm:rounded-3xl">
                  <Users className="w-12 h-12 sm:w-16 sm:h-16 text-slate-700 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-bold text-slate-600 mb-1 sm:mb-2">No Team Members</h3>
                  <p className="text-slate-500 text-xs sm:text-sm">Start building your team</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                  {team.map(member => (
                    <TeamCard 
                      key={member.id} 
                      member={member} 
                      onDelete={(id) => deleteItem('corporate', id, setTeam)}
                      onEdit={handleUpdateMember}
                    />
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
              className="space-y-4 sm:space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black">Inquiries ({inquiries.length})</h1>
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <span className="px-2 py-1 sm:px-3 sm:py-1 bg-amber-500/20 text-amber-500 rounded-full">
                    {inquiries.filter(i => i.status === 'pending').length} Pending
                  </span>
                  <span className="px-2 py-1 sm:px-3 sm:py-1 bg-emerald-500/20 text-emerald-500 rounded-full">
                    {inquiries.filter(i => i.status === 'resolved').length} Resolved
                  </span>
                </div>
              </div>

              {inquiries.length === 0 ? (
                <div className="text-center py-12 sm:py-16 bg-slate-800/30 border border-white/5 rounded-2xl sm:rounded-3xl">
                  <MessageSquare className="w-12 h-12 sm:w-16 sm:h-16 text-slate-700 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-bold text-slate-600 mb-1 sm:mb-2">No Inquiries</h3>
                  <p className="text-slate-500 text-xs sm:text-sm">Contact form inquiries will appear here</p>
                </div>
              ) : (
                <div className="bg-slate-800/30 border border-white/5 rounded-2xl sm:rounded-3xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px] sm:min-w-[800px]">
                      <thead className="bg-slate-900/50 border-b border-white/5">
                        <tr>
                          <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Contact</th>
                          <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Message</th>
                          <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                          <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                          <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {inquiries.map(inquiry => (
                          <InquiryRow 
                            key={inquiry.id} 
                            inquiry={inquiry}
                            onUpdateStatus={handleUpdateStatus}
                            onDelete={(id) => deleteItem('contact', id, setInquiries)}
                          />
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

      {/* Modal for Add New */}
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
              {/* Fixed Header */}
              <div className="sticky top-0 z-10 bg-slate-900 border-b border-white/10 px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold truncate">
                    Add New {modalType === 'project' ? 'Project' : 'Team Member'}
                  </h3>
                  <p className="text-xs text-slate-400 truncate">
                    Fill in the details below
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="ml-2 p-1.5 hover:bg-white/5 rounded-lg transition-colors flex-shrink-0"
                  aria-label="Close"
                >
                  <X size={18} sm:size={20} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto max-h-[calc(100vh-60px)] sm:max-h-[80vh]">
                <div className="p-4 sm:p-6 md:p-8">
                  <form
                    onSubmit={modalType === 'project' ? handleAddProject : handleAddMember}
                    className="space-y-3 sm:space-y-4 md:space-y-6"
                  >
                    {modalType === 'project' ? (
                      <>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1 sm:mb-2">Project Title *</label>
                          <input
                            type="text"
                            placeholder="Enter project title"
                            value={newProject.title}
                            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1 sm:mb-2">Description *</label>
                          <textarea
                            placeholder="Describe the project"
                            value={newProject.description}
                            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                            rows="3"
                            className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm resize-none"
                            required
                            minLength={20}
                          />
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1 sm:mb-2">Tech Stack *</label>
                          <input
                            type="text"
                            placeholder="React, FastAPI, Supabase"
                            value={newProject.tech_stack}
                            onChange={(e) => setNewProject({ ...newProject, tech_stack: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1 sm:mb-2">Live URL</label>
                            <input
                              type="url"
                              placeholder="https://example.com"
                              value={newProject.live_url}
                              onChange={(e) => setNewProject({ ...newProject, live_url: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1 sm:mb-2">GitHub URL</label>
                            <input
                              type="url"
                              placeholder="https://github.com/user/repo"
                              value={newProject.github_url}
                              onChange={(e) => setNewProject({ ...newProject, github_url: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1 sm:mb-2">Image URL</label>
                          <input
                            type="url"
                            placeholder="https://images.unsplash.com/..."
                            value={newProject.image_url}
                            onChange={(e) => setNewProject({ ...newProject, image_url: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1 sm:mb-2">Full Name *</label>
                          <input
                            type="text"
                            placeholder="Enter full name"
                            value={newMember.name}
                            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1 sm:mb-2">Role *</label>
                          <input
                            type="text"
                            placeholder="e.g., Lead Developer"
                            value={newMember.role}
                            onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1 sm:mb-2">Bio</label>
                          <textarea
                            placeholder="Short bio"
                            value={newMember.bio}
                            onChange={(e) => setNewMember({ ...newMember, bio: e.target.value })}
                            rows="2"
                            className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm resize-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1 sm:mb-2">LinkedIn URL</label>
                            <input
                              type="url"
                              placeholder="https://linkedin.com/in/username"
                              value={newMember.linkedin_url}
                              onChange={(e) => setNewMember({ ...newMember, linkedin_url: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1 sm:mb-2">GitHub URL</label>
                            <input
                              type="url"
                              placeholder="https://github.com/username"
                              value={newMember.github_url}
                              onChange={(e) => setNewMember({ ...newMember, github_url: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1 sm:mb-2">Image URL</label>
                          <input
                            type="url"
                            placeholder="https://images.unsplash.com/..."
                            value={newMember.image_url}
                            onChange={(e) => setNewMember({ ...newMember, image_url: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1 sm:mb-2">Twitter URL</label>
                          <input
                            type="url"
                            placeholder="https://twitter.com/username"
                            value={newMember.twitter_url}
                            onChange={(e) => setNewMember({ ...newMember, twitter_url: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm"
                          />
                        </div>
                      </>
                    )}

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-white/5">
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="py-2 sm:py-2.5 bg-white/5 hover:bg-white/10 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className={`py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all ${
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