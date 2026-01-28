// src/pages/AdminApplications.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  FileText, Search, Download, Eye, Mail, Phone, 
  Calendar, Filter, ChevronRight, UserCheck, 
  UserX, Clock, RefreshCw, AlertCircle
} from 'lucide-react';

const AdminApplications = () => {
  const { isAdmin } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    search: ''
  });

  // Mock data (replace with API call)
  const mockApplications = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      job_title: 'Senior Frontend Developer',
      job_department: 'Engineering',
      status: 'pending',
      applied_at: '2024-01-20T10:30:00',
      resume_filename: 'john_doe_resume.pdf'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1 (555) 987-6543',
      job_title: 'UI/UX Designer',
      job_department: 'Design',
      status: 'shortlisted',
      applied_at: '2024-01-18T14:20:00',
      resume_filename: 'jane_smith_resume.pdf'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setApplications(mockApplications);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredApplications = applications.filter(app => {
    if (filters.status !== 'all' && app.status !== filters.status) {
      return false;
    }
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        app.name.toLowerCase().includes(searchTerm) ||
        app.email.toLowerCase().includes(searchTerm) ||
        app.job_title.toLowerCase().includes(searchTerm)
      );
    }
    return true;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-amber-500/20 text-amber-500';
      case 'reviewing': return 'bg-blue-500/20 text-blue-500';
      case 'shortlisted': return 'bg-emerald-500/20 text-emerald-500';
      case 'rejected': return 'bg-red-500/20 text-red-500';
      case 'hired': return 'bg-green-500/20 text-green-500';
      default: return 'bg-slate-500/20 text-slate-500';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <Clock size={14} />;
      case 'reviewing': return <Eye size={14} />;
      case 'shortlisted': return <UserCheck size={14} />;
      case 'rejected': return <UserX size={14} />;
      case 'hired': return <UserCheck size={14} />;
      default: return <FileText size={14} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center pt-20">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="mx-auto w-16 h-16 border-4 border-blue-600/30 border-t-blue-600 rounded-full"
          />
          <p className="mt-6 text-slate-400 text-sm font-medium">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-white pt-20 lg:pt-24">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-black">Applications Management</h1>
            <p className="text-slate-400">Review and manage job applications</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-800/50 border border-white/5 rounded-3xl p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search applications..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <select 
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewing">Reviewing</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
                <option value="hired">Hired</option>
              </select>
              <button className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-medium flex items-center gap-2">
                <Filter size={16} />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.length === 0 ? (
            <div className="text-center py-16 bg-slate-800/30 border border-white/5 rounded-3xl">
              <FileText className="w-16 h-16 text-slate-700 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-600 mb-2">No Applications Found</h3>
              <p className="text-slate-500">
                {filters.search || filters.status !== 'all' 
                  ? "Try adjusting your filters." 
                  : "No applications have been submitted yet."}
              </p>
            </div>
          ) : (
            filteredApplications.map(app => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-800/50 border border-white/5 rounded-3xl p-6 hover:border-blue-500/20 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-2xl bg-blue-500/10">
                        <FileText className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{app.name}</h3>
                        <div className="flex flex-wrap gap-3 text-sm text-slate-400 mt-1">
                          <div className="flex items-center gap-1">
                            <Mail size={14} />
                            {app.email}
                          </div>
                          {app.phone && (
                            <div className="flex items-center gap-1">
                              <Phone size={14} />
                              {app.phone}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(app.applied_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-full text-xs">
                        {app.job_title}
                      </span>
                      <span className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-full text-xs">
                        {app.job_department}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(app.status)}`}>
                        {getStatusIcon(app.status)}
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="px-4 py-2.5 bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 border border-blue-500/30 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors"
                    >
                      <Eye size={16} />
                      View Details
                    </button>
                    {app.resume_filename && (
                      <button
                        onClick={() => alert(`Downloading ${app.resume_filename}`)}
                        className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors"
                      >
                        <Download size={16} />
                        Resume
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Stats Footer */}
        <div className="mt-8 pt-8 border-t border-white/5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/30 border border-white/5 rounded-2xl p-4">
              <p className="text-slate-400 text-sm mb-1">Total Applications</p>
              <p className="text-2xl font-bold">{applications.length}</p>
            </div>
            <div className="bg-slate-800/30 border border-white/5 rounded-2xl p-4">
              <p className="text-slate-400 text-sm mb-1">Pending Review</p>
              <p className="text-2xl font-bold text-amber-500">
                {applications.filter(app => app.status === 'pending').length}
              </p>
            </div>
            <div className="bg-slate-800/30 border border-white/5 rounded-2xl p-4">
              <p className="text-slate-400 text-sm mb-1">Shortlisted</p>
              <p className="text-2xl font-bold text-emerald-500">
                {applications.filter(app => app.status === 'shortlisted').length}
              </p>
            </div>
            <div className="bg-slate-800/30 border border-white/5 rounded-2xl p-4">
              <p className="text-slate-400 text-sm mb-1">Hired</p>
              <p className="text-2xl font-bold text-green-500">
                {applications.filter(app => app.status === 'hired').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Application Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Application Details</h3>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <ChevronRight size={20} className="rotate-90" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Candidate Info */}
                <div className="space-y-4">
                  <h4 className="font-bold text-lg">Candidate Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Full Name</p>
                      <p className="font-medium">{selectedApp.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Email</p>
                      <p className="font-medium">{selectedApp.email}</p>
                    </div>
                    {selectedApp.phone && (
                      <div>
                        <p className="text-sm text-slate-400 mb-1">Phone</p>
                        <p className="font-medium">{selectedApp.phone}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Applied Date</p>
                      <p className="font-medium">
                        {new Date(selectedApp.applied_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Job Info */}
                <div className="space-y-4">
                  <h4 className="font-bold text-lg">Position Applied</h4>
                  <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-xl bg-blue-500/10">
                        <FileText size={20} className="text-blue-500" />
                      </div>
                      <div>
                        <p className="font-bold">{selectedApp.job_title}</p>
                        <p className="text-sm text-slate-400">{selectedApp.job_department}</p>
                      </div>
                    </div>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(selectedApp.status)}`}>
                      {getStatusIcon(selectedApp.status)}
                      <span className="text-sm font-medium">
                        {selectedApp.status.charAt(0).toUpperCase() + selectedApp.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                  <h4 className="font-bold text-lg">Actions</h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedApp.resume_filename && (
                      <button
                        onClick={() => alert(`Downloading ${selectedApp.resume_filename}`)}
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors"
                      >
                        <Download size={16} />
                        Download Resume
                      </button>
                    )}
                    <button
                      onClick={() => alert('Status update functionality coming soon')}
                      className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium"
                    >
                      Update Status
                    </button>
                    <button
                      onClick={() => {
                        alert('Sending email...');
                        setSelectedApp(null);
                      }}
                      className="px-4 py-2.5 bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-xl text-sm font-medium flex items-center gap-2"
                    >
                      <Mail size={16} />
                      Send Email
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminApplications;