import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, Users, TrendingUp, BarChart3, 
  Plus, Trash2, CheckCircle, 
  Clock, X, ExternalLink, Mail, 
  Phone, Download, Eye, ChevronRight,
  Search, Filter, Calendar, FileText,
  Edit, Save, CalendarDays, Globe, Building,
  Award, DollarSign, MapPin, Type, RefreshCw,
  AlertCircle, Loader, Check, XCircle, MoreVertical
} from 'lucide-react';

/**
 * MOCK DATA CONSTANTS
 * Used as initial state or fallback when API is unavailable
 */
const INITIAL_JOBS = [
  {
    id: 'job-1',
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    location: 'Remote',
    job_type: 'Full-time',
    salary_range: '$120k - $160k',
    experience_required: '5+ years',
    description: 'We are looking for a React expert to lead our dashboard initiatives.',
    requirements: 'Expertise in React, Tailwind, and Framer Motion.',
    benefits: 'Remote-first, health insurance, 401k.',
    is_active: true,
    created_at: new Date().toISOString(),
    education_required: 'Bachelors in CS'
  },
  {
    id: 'job-2',
    title: 'Product Designer',
    department: 'Design',
    location: 'Hybrid',
    job_type: 'Full-time',
    salary_range: '$100k - $140k',
    experience_required: '3+ years',
    description: 'Help us shape the future of our product interface.',
    requirements: 'Proficiency in Figma and design systems.',
    benefits: 'Flexible hours, equipment budget.',
    is_active: true,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    education_required: 'Portfolio required'
  }
];

const INITIAL_APPLICATIONS = [
  {
    id: 'app-1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    phone: '+1 234 567 8901',
    job_id: 'job-1',
    job_title: 'Senior Frontend Developer',
    job_department: 'Engineering',
    status: 'reviewing',
    applied_at: new Date(Date.now() - 86400000).toISOString(),
    cover_letter: 'I have been working with React for 6 years and love building complex UIs.',
    portfolio_url: 'https://github.com/sarahj',
    resume_filename: 'resume_sarah.pdf',
    internal_notes: 'Strong portfolio, seems like a good cultural fit.'
  },
  {
    id: 'app-2',
    name: 'Michael Chen',
    email: 'm.chen@example.com',
    phone: '+1 987 654 3210',
    job_id: 'job-1',
    job_title: 'Senior Frontend Developer',
    job_department: 'Engineering',
    status: 'pending',
    applied_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    cover_letter: 'Excited to apply for this role!',
    portfolio_url: 'https://mchen.dev',
    resume_filename: 'mchen_cv.pdf',
    internal_notes: ''
  }
];

const AdminCareers = () => {
  // --- State Management ---
  const [activeTab, setActiveTab] = useState('jobs');
  const [jobOpenings, setJobOpenings] = useState(INITIAL_JOBS);
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Modal States
  const [showJobModal, setShowJobModal] = useState(false);
  const [showAppModal, setShowAppModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');

  // Job Form State
  const [jobForm, setJobForm] = useState({
    title: '', department: '', location: '', job_type: 'Full-time',
    salary_range: '', experience_required: '', description: '',
    requirements: '', benefits: '', is_active: true, education_required: ''
  });

  // App Internal Notes State (transient for modal)
  const [tempNotes, setTempNotes] = useState('');

  // --- Helpers ---
  const showToast = (msg, type = 'success') => {
    if (type === 'success') {
      setSuccess(msg);
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(msg);
      setTimeout(() => setError(''), 5000);
    }
  };

  // --- CRUD Operations ---
  const handleSaveJob = (e) => {
    e.preventDefault();
    if (editingJob) {
      setJobOpenings(prev => prev.map(j => j.id === editingJob.id ? { ...j, ...jobForm } : j));
      showToast('Job updated successfully');
    } else {
      const newJob = {
        ...jobForm,
        id: `job-${Date.now()}`,
        created_at: new Date().toISOString()
      };
      setJobOpenings(prev => [newJob, ...prev]);
      showToast('New job posted');
    }
    setShowJobModal(false);
    setEditingJob(null);
  };

  const deleteJob = (id) => {
    if (window.confirm('Delete this job opening? This will also affect application links.')) {
      setJobOpenings(prev => prev.filter(j => j.id !== id));
      showToast('Job deleted');
    }
  };

  const toggleJobStatus = (id) => {
    setJobOpenings(prev => prev.map(j => 
      j.id === id ? { ...j, is_active: !j.is_active } : j
    ));
    showToast('Status toggled');
  };

  const updateAppStatus = (appId, newStatus) => {
    setApplications(prev => prev.map(app => 
      app.id === appId ? { ...app, status: newStatus } : app
    ));
    if (selectedApp?.id === appId) {
        setSelectedApp(prev => ({...prev, status: newStatus}));
    }
    showToast(`Status updated to ${newStatus}`);
  };

  const saveAppNotes = () => {
    if (!selectedApp) return;
    setApplications(prev => prev.map(app => 
      app.id === selectedApp.id ? { ...app, internal_notes: tempNotes } : app
    ));
    showToast('Notes saved');
  };

  const deleteApplication = (id) => {
      if (window.confirm("Remove this application?")) {
          setApplications(prev => prev.filter(a => a.id !== id));
          setShowAppModal(false);
          showToast("Application removed");
      }
  }

  // --- Computed Data ---
  const filteredJobs = useMemo(() => {
    return jobOpenings.filter(j => {
      const matchesSearch = j.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          j.department.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = deptFilter === 'all' || j.department === deptFilter;
      return matchesSearch && matchesDept;
    });
  }, [jobOpenings, searchQuery, deptFilter]);

  const filteredApps = useMemo(() => {
    return applications.filter(a => {
      const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.job_title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
      const matchesDept = deptFilter === 'all' || a.job_department === deptFilter;
      return matchesSearch && matchesStatus && matchesDept;
    });
  }, [applications, searchQuery, statusFilter, deptFilter]);

  const stats = useMemo(() => {
    return [
      { label: 'Active Jobs', value: jobOpenings.filter(j => j.is_active).length, icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-500/10' },
      { label: 'Total Apps', value: applications.length, icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10' },
      { label: 'Pending Review', value: applications.filter(a => a.status === 'pending').length, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
      { label: 'Hired', value: applications.filter(a => a.status === 'hired').length, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    ];
  }, [jobOpenings, applications]);

  const uniqueDepts = useMemo(() => ['all', ...new Set(jobOpenings.map(j => j.department))], [jobOpenings]);

  // --- Lifecycle ---
  useEffect(() => {
    if (editingJob) {
      setJobForm({ ...editingJob });
    } else {
      setJobForm({
        title: '', department: '', location: '', job_type: 'Full-time',
        salary_range: '', experience_required: '', description: '',
        requirements: '', benefits: '', is_active: true, education_required: ''
      });
    }
  }, [editingJob]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Notifications */}
      <AnimatePresence>
        {success && (
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
            className="fixed top-6 right-6 z-[100] bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2">
            <CheckCircle size={18} /> {success}
          </motion.div>
        )}
        {error && (
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
            className="fixed top-6 right-6 z-[100] bg-red-500 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2">
            <AlertCircle size={18} /> {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Recruiting Dashboard</h1>
            <p className="text-slate-400 mt-1">Manage openings, review talent, and track hiring progress.</p>
          </div>
          <button 
            onClick={() => { setEditingJob(null); setShowJobModal(true); }}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            <Plus size={20} /> Create Opening
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}>
                  <stat.icon size={24} />
                </div>
                <TrendingUp size={16} className="text-slate-500" />
              </div>
              <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
              <p className="text-3xl font-black text-white mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters & Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div className="flex bg-slate-800/50 p-1 rounded-2xl w-fit border border-slate-700/50">
            {['jobs', 'applications', 'analytics'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${
                  activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-slate-800/50 border border-slate-700/50 rounded-2xl pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 w-full sm:w-64 transition-all"
              />
            </div>
            
            <select 
              value={deptFilter}
              onChange={e => setDeptFilter(e.target.value)}
              className="bg-slate-800/50 border border-slate-700/50 rounded-2xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
            >
              {uniqueDepts.map(d => <option key={d} value={d}>{d === 'all' ? 'All Departments' : d}</option>)}
            </select>

            {activeTab === 'applications' && (
              <select 
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-slate-800/50 border border-slate-700/50 rounded-2xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="reviewing">Reviewing</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
                <option value="hired">Hired</option>
              </select>
            )}
          </div>
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {activeTab === 'jobs' && (
            <motion.div key="jobs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredJobs.length > 0 ? filteredJobs.map(job => (
                <div key={job.id} className="group bg-slate-800/40 border border-slate-700/50 rounded-[2rem] p-8 hover:border-blue-500/30 transition-all hover:shadow-2xl hover:shadow-blue-500/5">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{job.title}</h3>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="bg-slate-700/50 text-slate-300 px-3 py-1 rounded-full text-xs font-bold border border-slate-600/50 flex items-center gap-1">
                          <Building size={12}/> {job.department}
                        </span>
                        <span className="bg-slate-700/50 text-slate-300 px-3 py-1 rounded-full text-xs font-bold border border-slate-600/50 flex items-center gap-1">
                          <MapPin size={12}/> {job.location}
                        </span>
                        <span className="bg-slate-700/50 text-slate-300 px-3 py-1 rounded-full text-xs font-bold border border-slate-600/50 flex items-center gap-1">
                          <Type size={12}/> {job.job_type}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingJob(job); setShowJobModal(true); }} className="p-2 text-slate-400 hover:text-white bg-slate-700/30 hover:bg-slate-700 rounded-xl transition-all">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => deleteJob(job.id)} className="p-2 text-red-400 hover:text-white bg-red-400/10 hover:bg-red-500 rounded-xl transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-slate-400 text-sm line-clamp-2 mb-6 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 border-t border-slate-700/50 pt-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Applications</p>
                      <p className="text-lg font-bold text-white">
                        {applications.filter(a => a.job_id === job.id).length}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Status</p>
                      <button 
                        onClick={() => toggleJobStatus(job.id)}
                        className={`text-xs font-bold px-3 py-1 rounded-full ${job.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}
                      >
                        {job.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-full py-20 text-center bg-slate-800/20 border border-dashed border-slate-700 rounded-[2rem]">
                  <Briefcase size={48} className="mx-auto text-slate-700 mb-4" />
                  <h3 className="text-xl font-bold text-slate-500">No jobs found matching your criteria</h3>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'applications' && (
            <motion.div key="apps" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-slate-800/40 border border-slate-700/50 rounded-[2rem] overflow-hidden backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/40 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                      <th className="px-8 py-5">Candidate</th>
                      <th className="px-8 py-5">Position</th>
                      <th className="px-8 py-5">Applied Date</th>
                      <th className="px-8 py-5 text-center">Status</th>
                      <th className="px-8 py-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {filteredApps.length > 0 ? filteredApps.map(app => (
                      <tr key={app.id} className="hover:bg-slate-700/20 transition-colors group">
                        <td className="px-8 py-5">
                          <div>
                            <p className="text-white font-bold">{app.name}</p>
                            <p className="text-slate-500 text-xs flex items-center gap-1 mt-0.5"><Mail size={12}/> {app.email}</p>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <p className="text-slate-300 font-medium">{app.job_title}</p>
                          <p className="text-slate-500 text-xs mt-0.5">{app.job_department}</p>
                        </td>
                        <td className="px-8 py-5">
                          <p className="text-slate-400 text-sm">{new Date(app.applied_at).toLocaleDateString()}</p>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex justify-center">
                            <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider ${
                              app.status === 'hired' ? 'bg-emerald-500/10 text-emerald-400' :
                              app.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                              app.status === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                              'bg-blue-500/10 text-blue-400'
                            }`}>
                              {app.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button 
                            onClick={() => { setSelectedApp(app); setTempNotes(app.internal_notes); setShowAppModal(true); }}
                            className="bg-slate-700 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-black/20"
                          >
                            View Detail
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="5" className="py-20 text-center">
                          <Users size={48} className="mx-auto text-slate-700 mb-4" />
                          <h3 className="text-xl font-bold text-slate-500">No applications found</h3>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-[2rem] p-8">
                <h3 className="text-lg font-bold text-white mb-6">Status Breakdown</h3>
                <div className="space-y-4">
                  {['pending', 'reviewing', 'shortlisted', 'rejected', 'hired'].map(status => {
                    const count = applications.filter(a => a.status === status).length;
                    const percent = applications.length ? (count / applications.length * 100) : 0;
                    return (
                      <div key={status}>
                        <div className="flex justify-between text-xs font-bold uppercase mb-2">
                          <span className="text-slate-400">{status}</span>
                          <span className="text-white">{count} ({Math.round(percent)}%)</span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${
                              status === 'hired' ? 'bg-emerald-500' : 
                              status === 'rejected' ? 'bg-red-500' : 
                              status === 'pending' ? 'bg-amber-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/50 rounded-[2rem] p-8">
                <h3 className="text-lg font-bold text-white mb-6">By Department</h3>
                <div className="space-y-6">
                  {uniqueDepts.filter(d => d !== 'all').map(dept => {
                    const count = applications.filter(a => a.job_department === dept).length;
                    return (
                      <div key={dept} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                          <span className="text-sm font-bold text-slate-200">{dept}</span>
                        </div>
                        <span className="bg-slate-700 text-slate-300 px-3 py-1 rounded-lg text-xs font-bold">{count} Apps</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/50 rounded-[2rem] p-8">
                <h3 className="text-lg font-bold text-white mb-6">Quick Recap</h3>
                <div className="space-y-4">
                    <div className="flex justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-700/50">
                        <span className="text-sm text-slate-400">Avg Response Time</span>
                        <span className="text-sm font-bold text-emerald-400">2.4 Days</span>
                    </div>
                    <div className="flex justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-700/50">
                        <span className="text-sm text-slate-400">Interview Rate</span>
                        <span className="text-sm font-bold text-blue-400">12.5%</span>
                    </div>
                    <div className="flex justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-700/50">
                        <span className="text-sm text-slate-400">Top Referral Source</span>
                        <span className="text-sm font-bold text-purple-400">LinkedIn</span>
                    </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- MODALS --- */}

      {/* Job Modal */}
      <AnimatePresence>
        {showJobModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowJobModal(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-[#1e293b] border border-slate-700 rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="px-8 py-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                <h2 className="text-xl font-black text-white">{editingJob ? 'Update Opening' : 'New Opening'}</h2>
                <button onClick={() => setShowJobModal(false)} className="p-2 hover:bg-slate-700 rounded-xl transition-all"><X /></button>
              </div>
              
              <form onSubmit={handleSaveJob} className="p-8 space-y-6 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Job Title</label>
                    <input required type="text" value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-3.5 focus:border-blue-500 outline-none transition-all text-white" placeholder="e.g. Lead Developer" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Department</label>
                    <input required type="text" value={jobForm.department} onChange={e => setJobForm({...jobForm, department: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-3.5 focus:border-blue-500 outline-none transition-all text-white" placeholder="e.g. Engineering" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Location</label>
                    <input required type="text" value={jobForm.location} onChange={e => setJobForm({...jobForm, location: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-3.5 focus:border-blue-500 outline-none transition-all text-white" placeholder="e.g. New York or Remote" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Salary Range</label>
                    <input type="text" value={jobForm.salary_range} onChange={e => setJobForm({...jobForm, salary_range: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-3.5 focus:border-blue-500 outline-none transition-all text-white" placeholder="e.g. $100k - $130k" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Description</label>
                  <textarea required rows="3" value={jobForm.description} onChange={e => setJobForm({...jobForm, description: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-3.5 focus:border-blue-500 outline-none transition-all text-white resize-none" placeholder="Role overview..." />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Requirements</label>
                  <textarea required rows="3" value={jobForm.requirements} onChange={e => setJobForm({...jobForm, requirements: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-3.5 focus:border-blue-500 outline-none transition-all text-white resize-none" placeholder="Bullet points..." />
                </div>

                <div className="flex items-center gap-3 bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50">
                  <input type="checkbox" checked={jobForm.is_active} onChange={e => setJobForm({...jobForm, is_active: e.target.checked})} className="w-5 h-5 rounded-lg border-slate-700 bg-slate-900 accent-blue-600" id="active" />
                  <label htmlFor="active" className="text-sm font-bold text-slate-300 cursor-pointer">Post immediately as active</label>
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setShowJobModal(false)} className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-400 hover:text-white transition-all bg-slate-700/50 hover:bg-slate-700">Cancel</button>
                  <button type="submit" className="flex-[2] px-6 py-4 rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/20 transition-all active:scale-95">
                    {editingJob ? 'Update Listing' : 'Publish Job'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Application Detail Modal */}
      <AnimatePresence>
        {showAppModal && selectedApp && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAppModal(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-[#1e293b] border border-slate-700 rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="px-8 py-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl font-black">
                        {selectedApp.name.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white leading-tight">{selectedApp.name}</h2>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{selectedApp.job_title}</p>
                    </div>
                </div>
                <button onClick={() => setShowAppModal(false)} className="p-2 hover:bg-slate-700 rounded-xl transition-all"><X /></button>
              </div>

              <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-3">
                {/* Left: Info */}
                <div className="lg:col-span-2 p-8 space-y-8 border-r border-slate-700/50">
                    <section>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-4">Candidate Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-700/50">
                                <p className="text-[10px] font-bold text-slate-500 mb-1">Email</p>
                                <p className="text-sm font-bold text-white flex items-center gap-2"><Mail size={14}/> {selectedApp.email}</p>
                            </div>
                            <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-700/50">
                                <p className="text-[10px] font-bold text-slate-500 mb-1">Phone</p>
                                <p className="text-sm font-bold text-white flex items-center gap-2"><Phone size={14}/> {selectedApp.phone}</p>
                            </div>
                            <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-700/50">
                                <p className="text-[10px] font-bold text-slate-500 mb-1">Social/Portfolio</p>
                                <a href={selectedApp.portfolio_url} target="_blank" className="text-sm font-bold text-blue-400 flex items-center gap-2 hover:underline"><Globe size={14}/> Portfolio Link</a>
                            </div>
                            <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-700/50">
                                <p className="text-[10px] font-bold text-slate-500 mb-1">Applied Date</p>
                                <p className="text-sm font-bold text-white flex items-center gap-2"><Calendar size={14}/> {new Date(selectedApp.applied_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-4">Cover Letter Snippet</h3>
                        <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-700/50 text-slate-400 text-sm leading-relaxed italic">
                            "{selectedApp.cover_letter}"
                        </div>
                    </section>

                    <div className="flex gap-4">
                        <button className="flex-1 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 rounded-2xl transition-all">
                            <Download size={18} /> Download CV
                        </button>
                        <button onClick={() => deleteApplication(selectedApp.id)} className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white font-bold py-4 rounded-2xl transition-all">
                            <Trash2 size={18} /> Remove App
                        </button>
                    </div>
                </div>

                {/* Right: Actions/Notes */}
                <div className="bg-slate-800/30 p-8 space-y-8">
                    <section>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-4">Hiring Workflow</h3>
                        <div className="space-y-2">
                            {['pending', 'reviewing', 'shortlisted', 'rejected', 'hired'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => updateAppStatus(selectedApp.id, status)}
                                    className={`w-full text-left px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                        selectedApp.status === status 
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                                        : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 border border-slate-700'
                                    }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="flex flex-col h-full">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-4">Recruiter Notes</h3>
                        <textarea 
                            value={tempNotes}
                            onChange={e => setTempNotes(e.target.value)}
                            placeholder="Type internal thoughts here..."
                            className="flex-1 bg-slate-900 border border-slate-700 rounded-2xl p-4 text-sm text-slate-300 outline-none focus:border-blue-500 transition-all resize-none min-h-[150px]"
                        />
                        <button 
                            onClick={saveAppNotes}
                            className="mt-4 w-full bg-slate-700 hover:bg-blue-600 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-widest transition-all"
                        >
                            Save Notes
                        </button>
                    </section>
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