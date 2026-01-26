// pages/AdminCareers.jsx
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, Users, TrendingUp, BarChart3, 
  LogOut, Plus, Trash2, CheckCircle, 
  Clock, X, ExternalLink, Mail, 
  Phone, Download, Eye, ChevronRight,
  Search, Filter, Calendar, FileText,
  ArrowUpRight, UserCheck, UserX, UserClock
} from 'lucide-react';

const AdminCareers = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('jobs');
  const [jobOpenings, setJobOpenings] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    department: 'all',
    status: 'all'
  });
  
  // Form States
  const [newJob, setNewJob] = useState({ 
    title: '', 
    department: '', 
    location: '', 
    job_type: 'full-time',
    salary_range: '', 
    experience_required: '', 
    description: '', 
    requirements: '', 
    benefits: '',
    is_active: true
  });

  // Stats calculation
  const stats = [
    { 
      label: 'Active Jobs', 
      value: jobOpenings.filter(job => job.is_active).length, 
      icon: <Briefcase size={20}/>, 
      color: 'bg-gradient-to-br from-blue-600 to-cyan-500' 
    },
    { 
      label: 'Total Applications', 
      value: applications.length, 
      icon: <Users size={20}/>, 
      color: 'bg-gradient-to-br from-indigo-600 to-purple-500' 
    },
    { 
      label: 'Pending Review', 
      value: applications.filter(app => app.status === 'pending').length, 
      icon: <Clock size={20}/>, 
      color: 'bg-gradient-to-br from-amber-600 to-orange-500' 
    },
    { 
      label: 'Shortlisted', 
      value: applications.filter(app => app.status === 'shortlisted').length, 
      icon: <UserCheck size={20}/>, 
      color: 'bg-gradient-to-br from-emerald-600 to-green-500' 
    },
  ];

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      // Note: Update these endpoints based on your actual API
      const [jobsRes, appsRes] = await Promise.all([
        api.get('/careers/openings'),
        api.get('/careers/applications')
      ]);
      setJobOpenings(Array.isArray(jobsRes.data) ? jobsRes.data : []);
      setApplications(Array.isArray(appsRes.data) ? appsRes.data : []);
    } catch (err) {
      console.error("Failed to fetch careers data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    fetchData(); 
  }, [fetchData]);

  // Filter applications
  const filteredApplications = applications.filter(app => {
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        app.name.toLowerCase().includes(searchTerm) ||
        app.email.toLowerCase().includes(searchTerm) ||
        app.job_title.toLowerCase().includes(searchTerm)
      );
    }
    if (filters.status !== 'all') {
      return app.status === filters.status;
    }
    return true;
  });

  // Handle job creation
  const handleAddJob = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newJob,
        title: newJob.title.trim(),
        description: newJob.description.trim(),
        requirements: newJob.requirements.trim(),
        benefits: newJob.benefits.trim(),
        experience_required: newJob.experience_required.trim(),
        salary_range: newJob.salary_range.trim()
      };
      
      if (!payload.title || !payload.description || !payload.department || !payload.location) {
        alert("Please fill in all required fields.");
        return;
      }
      
      const res = await api.post('/careers/openings', payload);
      setJobOpenings(prev => [res.data, ...prev]);
      setShowJobModal(false);
      setNewJob({ 
        title: '', department: '', location: '', job_type: 'full-time',
        salary_range: '', experience_required: '', description: '', 
        requirements: '', benefits: '', is_active: true
      });
    } catch (err) {
      console.error("Job creation error:", err);
      alert(err.response?.data?.detail || "Failed to create job opening.");
    }
  };

  // Handle application status update
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.put(`/careers/applications/${id}/status`, { status: newStatus });
      setApplications(prev => prev.map(app => 
        app.id === id ? { ...app, status: newStatus } : app
      ));
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  // Handle delete
  const deleteItem = async (endpoint, id, stateSetter) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await api.delete(`/${endpoint}/${id}`);
        stateSetter(prev => prev.filter(item => item.id !== id));
      } catch (err) { 
        alert("Delete failed."); 
      }
    }
  };

  // View application details
  const viewApplication = (application) => {
    setSelectedApplication(application);
    setShowApplicationModal(true);
  };

  // Download resume
  const downloadResume = async (filename) => {
    try {
      // Implement resume download logic
      const response = await api.get(`/careers/resume/${filename}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Failed to download resume.");
    }
  };

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
          <p className="mt-6 text-slate-400 text-sm font-medium">Loading careers dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-white pt-20 lg:pt-24">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-black">Careers Management</h1>
            <p className="text-slate-400">Manage job openings and applications</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowJobModal(true)}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20"
            >
              <Plus size={18} />
              New Job
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6">
              <div className={`${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-4`}>
                {stat.icon}
              </div>
              <p className="text-slate-400 text-sm font-medium mb-1">{stat.label}</p>
              <p className="text-2xl font-black">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/5 mb-6">
          {['jobs', 'applications', 'analytics'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-medium capitalize border-b-2 transition-colors ${
                activeTab === tab
                  ? 'text-blue-500 border-blue-500'
                  : 'text-slate-500 border-transparent hover:text-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <h2 className="text-xl font-bold">Job Openings ({jobOpenings.length})</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search jobs..."
                    className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {jobOpenings.length === 0 ? (
              <div className="text-center py-16 bg-slate-800/30 border border-white/5 rounded-3xl">
                <Briefcase className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-600 mb-2">No Job Openings</h3>
                <p className="text-slate-500 mb-6">Create your first job opening to get started.</p>
                <button
                  onClick={() => setShowJobModal(true)}
                  className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-bold text-sm"
                >
                  Create Job Opening
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {jobOpenings.map(job => (
                  <div key={job.id} className="bg-slate-800/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold mb-1">{job.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-slate-400">
                          <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full">
                            {job.department}
                          </span>
                          <span>{job.location}</span>
                          <span>{job.job_type}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => deleteItem('careers/openings', job.id, setJobOpenings)}
                          className="p-2 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg"
                          title="Delete Job"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-slate-300 text-sm mb-4 line-clamp-2">{job.description}</p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <span className="text-slate-500">Posted: </span>
                        <span>{new Date(job.posted_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          job.is_active 
                            ? 'bg-green-500/20 text-green-500' 
                            : 'bg-red-500/20 text-red-500'
                        }`}>
                          {job.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <h2 className="text-xl font-bold">Applications ({applications.length})</h2>
              <div className="flex flex-wrap gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search applications..."
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                    className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <select 
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="rejected">Rejected</option>
                  <option value="hired">Hired</option>
                </select>
              </div>
            </div>

            {filteredApplications.length === 0 ? (
              <div className="text-center py-16 bg-slate-800/30 border border-white/5 rounded-3xl">
                <FileText className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-600 mb-2">No Applications</h3>
                <p className="text-slate-500">Applications will appear here when candidates apply.</p>
              </div>
            ) : (
              <div className="bg-slate-800/30 border border-white/5 rounded-3xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead className="bg-slate-900/50 border-b border-white/5">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Candidate</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Position</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredApplications.map(app => (
                        <tr key={app.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-bold text-white">{app.name}</p>
                              <div className="flex items-center gap-1 text-slate-400 text-sm">
                                <Mail size={14} />
                                {app.email}
                              </div>
                              {app.phone && (
                                <div className="flex items-center gap-1 text-slate-400 text-sm mt-1">
                                  <Phone size={14} />
                                  {app.phone}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-bold">{app.job_title}</p>
                            <p className="text-slate-400 text-sm">ID: {app.job_id}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-slate-400 text-sm">
                              {new Date(app.applied_at).toLocaleDateString()}
                            </p>
                            <p className="text-slate-500 text-xs">
                              {new Date(app.applied_at).toLocaleTimeString()}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                              app.status === 'pending' ? 'bg-amber-500/20 text-amber-500' :
                              app.status === 'reviewing' ? 'bg-blue-500/20 text-blue-500' :
                              app.status === 'shortlisted' ? 'bg-emerald-500/20 text-emerald-500' :
                              app.status === 'rejected' ? 'bg-red-500/20 text-red-500' :
                              'bg-green-500/20 text-green-500'
                            }`}>
                              {app.status === 'pending' && <Clock size={12} />}
                              {app.status === 'reviewing' && <Eye size={12} />}
                              {app.status === 'shortlisted' && <UserCheck size={12} />}
                              {app.status === 'rejected' && <UserX size={12} />}
                              {app.status === 'hired' && <UserCheck size={12} />}
                              {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => viewApplication(app)}
                                className="px-3 py-1.5 bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 border border-blue-500/30 rounded-xl text-xs font-bold transition-colors"
                              >
                                View
                              </button>
                              <button
                                onClick={() => downloadResume(app.resume_filename)}
                                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                title="Download Resume"
                              >
                                <Download size={14} />
                              </button>
                              <div className="relative group">
                                <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-colors">
                                  Update
                                </button>
                                <div className="absolute right-0 mt-1 w-48 bg-slate-900 border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                                  <div className="py-1">
                                    {['pending', 'reviewing', 'shortlisted', 'rejected', 'hired'].map(status => (
                                      <button
                                        key={status}
                                        onClick={() => handleUpdateStatus(app.id, status)}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-white/5 ${
                                          app.status === status ? 'text-blue-500' : 'text-slate-300'
                                        }`}
                                      >
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
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

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-bold">Careers Analytics</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Status Distribution */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6">
                <h3 className="font-bold mb-4">Application Status Distribution</h3>
                <div className="space-y-3">
                  {['pending', 'reviewing', 'shortlisted', 'rejected', 'hired'].map(status => {
                    const count = applications.filter(app => app.status === status).length;
                    const percentage = applications.length > 0 ? (count / applications.length * 100).toFixed(1) : 0;
                    return (
                      <div key={status} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{status}</span>
                          <span>{count} ({percentage}%)</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              status === 'pending' ? 'bg-amber-500' :
                              status === 'reviewing' ? 'bg-blue-500' :
                              status === 'shortlisted' ? 'bg-emerald-500' :
                              status === 'rejected' ? 'bg-red-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Department Distribution */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6">
                <h3 className="font-bold mb-4">Jobs by Department</h3>
                <div className="space-y-3">
                  {Array.from(new Set(jobOpenings.map(job => job.department))).map(dept => {
                    const count = jobOpenings.filter(job => job.department === dept && job.is_active).length;
                    return (
                      <div key={dept} className="flex items-center justify-between">
                        <span className="text-sm">{dept}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-400">{count} jobs</span>
                          <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${(count / Math.max(...Array.from(new Set(jobOpenings.map(job => job.department))).map(d => jobOpenings.filter(job => job.department === d && job.is_active).length)) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Job Creation Modal */}
      <AnimatePresence>
        {showJobModal && (
          <div className="fixed inset-0 z-[9999] flex items-start sm:items-center justify-center p-0 sm:p-2 md:p-4 bg-black/90 backdrop-blur-lg overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 w-full min-h-screen sm:min-h-0 sm:max-w-2xl sm:rounded-2xl md:rounded-3xl shadow-2xl shadow-black/50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 bg-slate-900 border-b border-white/10 px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold truncate">Create New Job Opening</h3>
                  <p className="text-xs text-slate-400 truncate">Fill in the job details</p>
                </div>
                <button
                  onClick={() => setShowJobModal(false)}
                  className="ml-4 p-1.5 hover:bg-white/5 rounded-lg transition-colors flex-shrink-0"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="overflow-y-auto max-h-[calc(100vh-60px)] sm:max-h-[80vh]">
                <div className="p-4 sm:p-6 md:p-8">
                  <form onSubmit={handleAddJob} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Job Title *</label>
                        <input
                          type="text"
                          placeholder="Senior Frontend Developer"
                          value={newJob.title}
                          onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Department *</label>
                        <input
                          type="text"
                          placeholder="Engineering"
                          value={newJob.department}
                          onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Location *</label>
                        <input
                          type="text"
                          placeholder="Remote, Hybrid, On-site"
                          value={newJob.location}
                          onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Job Type *</label>
                        <select
                          value={newJob.job_type}
                          onChange={(e) => setNewJob({ ...newJob, job_type: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors text-sm"
                          required
                        >
                          <option value="full-time">Full-time</option>
                          <option value="part-time">Part-time</option>
                          <option value="contract">Contract</option>
                          <option value="internship">Internship</option>
                          <option value="remote">Remote</option>
                          <option value="hybrid">Hybrid</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Salary Range</label>
                        <input
                          type="text"
                          placeholder="$90,000 - $120,000"
                          value={newJob.salary_range}
                          onChange={(e) => setNewJob({ ...newJob, salary_range: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Experience Required *</label>
                        <input
                          type="text"
                          placeholder="5+ years"
                          value={newJob.experience_required}
                          onChange={(e) => setNewJob({ ...newJob, experience_required: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm"
                          required
                        />
                      </div>
                    </div>

                    
                      <label className="block text-sm font-medium text-slate-300 mb-2">Job Description *</label>
                      <textarea
                        placeholder="Describe the role and responsibilities..."
                        value={newJob.description}
                        onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                        rows="4"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm resize-none"
                        required
                      />
                                        <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Requirements *</label>
                      <textarea
                        placeholder="List the requirements and qualifications..."
                        value={newJob.requirements}
                        onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                        rows="4"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm resize-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Benefits & Perks</label>
                      <textarea
                        placeholder="Health insurance, flexible hours, etc..."
                        value={newJob.benefits}
                        onChange={(e) => setNewJob({ ...newJob, benefits: e.target.value })}
                        rows="3"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm resize-none"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="is_active"
                          checked={newJob.is_active}
                          onChange={(e) => setNewJob({ ...newJob, is_active: e.target.checked })}
                          className="w-4 h-4 bg-white/5 border border-white/10 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="is_active" className="text-sm text-slate-300">
                          Publish job immediately
                        </label>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setShowJobModal(false)}
                          className="px-6 py-3 text-sm font-medium text-slate-400 hover:text-white border border-white/10 hover:border-white/20 rounded-xl transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-600/20"
                        >
                          Create Job Opening
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Application Detail Modal */}
      <AnimatePresence>
        {showApplicationModal && selectedApplication && (
          <div className="fixed inset-0 z-[9999] flex items-start sm:items-center justify-center p-0 sm:p-2 md:p-4 bg-black/90 backdrop-blur-lg overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 w-full min-h-screen sm:min-h-0 sm:max-w-3xl sm:rounded-2xl md:rounded-3xl shadow-2xl shadow-black/50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 bg-slate-900 border-b border-white/10 px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold truncate">Application Details</h3>
                  <p className="text-xs text-slate-400 truncate">
                    {selectedApplication.name} - {selectedApplication.job_title}
                  </p>
                </div>
                <button
                  onClick={() => setShowApplicationModal(false)}
                  className="ml-4 p-1.5 hover:bg-white/5 rounded-lg transition-colors flex-shrink-0"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="overflow-y-auto max-h-[calc(100vh-60px)] sm:max-h-[80vh]">
                <div className="p-4 sm:p-6 md:p-8">
                  <div className="space-y-6">
                    {/* Candidate Info */}
                    <div className="bg-slate-800/30 border border-white/5 rounded-2xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-xl font-bold mb-2">{selectedApplication.name}</h4>
                          <div className="flex flex-wrap gap-3 text-sm">
                            <div className="flex items-center gap-2 text-slate-300">
                              <Mail size={16} />
                              {selectedApplication.email}
                            </div>
                            {selectedApplication.phone && (
                              <div className="flex items-center gap-2 text-slate-300">
                                <Phone size={16} />
                                {selectedApplication.phone}
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-slate-300">
                              <Calendar size={16} />
                              Applied on {new Date(selectedApplication.applied_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => downloadResume(selectedApplication.resume_filename)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 border border-blue-500/30 rounded-xl text-sm font-bold transition-colors"
                          >
                            <Download size={16} />
                            Resume
                          </button>
                        </div>
                      </div>

                      {/* Status Update */}
                      <div className="pt-4 border-t border-white/10">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-slate-400 mb-2">Current Status</p>
                            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${
                              selectedApplication.status === 'pending' ? 'bg-amber-500/20 text-amber-500' :
                              selectedApplication.status === 'reviewing' ? 'bg-blue-500/20 text-blue-500' :
                              selectedApplication.status === 'shortlisted' ? 'bg-emerald-500/20 text-emerald-500' :
                              selectedApplication.status === 'rejected' ? 'bg-red-500/20 text-red-500' :
                              'bg-green-500/20 text-green-500'
                            }`}>
                              {selectedApplication.status === 'pending' && <Clock size={16} />}
                              {selectedApplication.status === 'reviewing' && <Eye size={16} />}
                              {selectedApplication.status === 'shortlisted' && <UserCheck size={16} />}
                              {selectedApplication.status === 'rejected' && <UserX size={16} />}
                              {selectedApplication.status === 'hired' && <UserCheck size={16} />}
                              {selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-slate-400">Update Status:</p>
                            <div className="flex flex-wrap gap-2">
                              {['shortlisted', 'rejected', 'hired'].map(status => (
                                <button
                                  key={status}
                                  onClick={() => {
                                    handleUpdateStatus(selectedApplication.id, status);
                                    setSelectedApplication({...selectedApplication, status});
                                  }}
                                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                                    status === 'shortlisted' ? 'bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30' :
                                    status === 'rejected' ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' :
                                    'bg-green-500/20 text-green-500 hover:bg-green-500/30'
                                  }`}
                                >
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Job Details */}
                    <div className="bg-slate-800/30 border border-white/5 rounded-2xl p-6">
                      <h4 className="text-lg font-bold mb-4">Applied Position</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-slate-400 mb-1">Job Title</p>
                          <p className="font-bold">{selectedApplication.job_title}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-400 mb-1">Department</p>
                          <p className="font-bold">{selectedApplication.job_department || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-400 mb-1">Application ID</p>
                          <p className="font-mono text-sm">{selectedApplication.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-400 mb-1">Job Type</p>
                          <p className="font-bold">{selectedApplication.job_type || 'Full-time'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Cover Letter */}
                    {selectedApplication.cover_letter && (
                      <div className="bg-slate-800/30 border border-white/5 rounded-2xl p-6">
                        <h4 className="text-lg font-bold mb-4">Cover Letter</h4>
                        <div className="bg-slate-900/50 border border-white/5 rounded-xl p-4">
                          <p className="text-slate-300 whitespace-pre-wrap">
                            {selectedApplication.cover_letter}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Additional Info */}
                    {selectedApplication.additional_info && (
                      <div className="bg-slate-800/30 border border-white/5 rounded-2xl p-6">
                        <h4 className="text-lg font-bold mb-4">Additional Information</h4>
                        <div className="bg-slate-900/50 border border-white/5 rounded-xl p-4">
                          <p className="text-slate-300 whitespace-pre-wrap">
                            {selectedApplication.additional_info}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Notes Section */}
                    <div className="bg-slate-800/30 border border-white/5 rounded-2xl p-6">
                      <h4 className="text-lg font-bold mb-4">Internal Notes</h4>
                      <div className="space-y-4">
                        <textarea
                          placeholder="Add internal notes about this candidate..."
                          className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm resize-none min-h-[100px]"
                          defaultValue={selectedApplication.internal_notes || ''}
                        />
                        <div className="flex justify-end">
                          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-bold transition-colors">
                            Save Notes
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCareers;