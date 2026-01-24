import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/client';
import { 
  Briefcase, MapPin, DollarSign, Clock, Upload, X, 
  CheckCircle, ExternalLink, TrendingUp, Users, 
  Award, Zap, Heart, ChevronRight, FileText,
  Building, Globe, Coffee, BookOpen, GraduationCap,
  Search, Filter
} from 'lucide-react';

const Careers = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [jobOpenings, setJobOpenings] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    department: 'all',
    location: 'all',
    jobType: 'all',
    search: ''
  });

  const [applicationForm, setApplicationForm] = useState({
    name: '',
    email: '',
    phone: '',
    cover_letter: '',
    resume: null,
    portfolio_url: '',
    job_id: '',
    job_title: ''
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // API base URL - update this to your FastAPI backend URL
  const API_BASE_URL = 'http://localhost:8000/api/v1';

  // Fetch job openings from API
  useEffect(() => {
    fetchJobOpenings();
  }, []);

  // Apply filters when filters change
  useEffect(() => {
    filterJobs();
  }, [filters, jobOpenings]);

  const fetchJobOpenings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/careers/openings`);
      if (!response.ok) throw new Error('Failed to fetch job openings');
      const data = await response.json();
      setJobOpenings(data);
      setFilteredJobs(data);
    } catch (error) {
      console.error('Error fetching job openings:', error);
      // Fallback to static data if API fails
      setJobOpenings(staticJobOpenings);
      setFilteredJobs(staticJobOpenings);
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    let filtered = [...jobOpenings];

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchTerm) ||
        job.description.toLowerCase().includes(searchTerm) ||
        job.department.toLowerCase().includes(searchTerm)
      );
    }

    // Apply department filter
    if (filters.department !== 'all') {
      filtered = filtered.filter(job => job.department === filters.department);
    }

    // Apply location filter
    if (filters.location !== 'all') {
      filtered = filtered.filter(job => {
        if (filters.location === 'remote') return job.location.toLowerCase().includes('remote');
        if (filters.location === 'hybrid') return job.location.toLowerCase().includes('hybrid');
        return true;
      });
    }

    // Apply job type filter
    if (filters.jobType !== 'all') {
      filtered = filtered.filter(job => job.job_type === filters.jobType);
    }

    setFilteredJobs(filtered);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset error
    setUploadError('');

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size should be less than 5MB');
      return;
    }

    // Check file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Please upload PDF or Word documents only');
      return;
    }

    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setApplicationForm(prev => ({ ...prev, resume: file }));
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadError('');

    // Validate form
    if (!applicationForm.name || !applicationForm.email || !applicationForm.resume) {
      setUploadError('Please fill in all required fields (*)');
      setIsSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(applicationForm.email)) {
      setUploadError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('name', applicationForm.name.trim());
      formData.append('email', applicationForm.email.trim().toLowerCase());
      if (applicationForm.phone) formData.append('phone', applicationForm.phone.trim());
      if (applicationForm.cover_letter) formData.append('cover_letter', applicationForm.cover_letter.trim());
      if (applicationForm.portfolio_url) formData.append('portfolio_url', applicationForm.portfolio_url.trim());
      formData.append('job_id', selectedJob.id);
      formData.append('job_title', selectedJob.title);
      formData.append('resume', applicationForm.resume);

      // Send to FastAPI backend
      const response = await fetch(`${API_BASE_URL}/careers/apply`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to submit application');
      }

      alert('Application submitted successfully! We\'ll get back to you soon.');
      
      // Reset form
      setShowApplicationForm(false);
      setSelectedJob(null);
      setApplicationForm({
        name: '',
        email: '',
        phone: '',
        cover_letter: '',
        resume: null,
        portfolio_url: '',
        job_id: '',
        job_title: ''
      });
      setUploadProgress(0);
      setUploadError('');

    } catch (error) {
      console.error('Application submission error:', error);
      setUploadError(error.message || 'Error submitting application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openApplicationForm = (job) => {
    setSelectedJob(job);
    setApplicationForm(prev => ({
      ...prev,
      job_id: job.id,
      job_title: job.title
    }));
    setShowApplicationForm(true);
    setUploadError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplicationForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const companyStats = [
    { value: '50+', label: 'Team Members', icon: <Users className="w-6 h-6" /> },
    { value: '5+', label: 'Countries', icon: <Globe className="w-6 h-6" /> },
    { value: '99%', label: 'Remote Team', icon: <Coffee className="w-6 h-6" /> },
    { value: '4.8', label: 'Team Rating', icon: <Award className="w-6 h-6" /> }
  ];

  const perks = [
    {
      title: 'Flexible Work Hours',
      description: 'Work when you\'re most productive',
      icon: <Clock className="w-6 h-6" />
    },
    {
      title: 'Learning Budget',
      description: '$2,000 annual learning budget',
      icon: <BookOpen className="w-6 h-6" />
    },
    {
      title: 'Health Coverage',
      description: 'Comprehensive health insurance',
      icon: <Heart className="w-6 h-6" />
    },
    {
      title: 'Career Growth',
      description: 'Clear promotion paths',
      icon: <TrendingUp className="w-6 h-6" />
    }
  ];

  // Static job openings as fallback
  const staticJobOpenings = [
    // {
    //   id: 1,
    //   title: 'Senior Frontend Developer',
    //   department: 'Engineering',
    //   location: 'Remote',
    //   job_type: 'full-time',
    //   salary_range: '$90,000 - $120,000',
    //   experience_required: '5+ years',
    //   description: 'We are looking for an experienced Frontend Developer to join our team. You will be responsible for building user interfaces and implementing designs using React, TypeScript, and modern CSS frameworks.',
    //   requirements: '5+ years of experience with React.js, TypeScript proficiency, state management experience',
    //   benefits: 'Remote work flexibility, Health insurance, Stock options, Learning budget, Flexible PTO',
    //   is_active: true,
    //   posted_date: '2024-01-15T00:00:00'
    // },
    // {
    //   id: 2,
    //   title: 'UI/UX Designer',
    //   department: 'Design',
    //   location: 'Hybrid (Bareilly)',
    //   job_type: 'full-time',
    //   salary_range: '$70,000 - $95,000',
    //   experience_required: '3+ years',
    //   description: 'Join our design team to create beautiful and functional user interfaces for our products. You will work closely with product managers and developers to bring designs to life.',
    //   requirements: '3+ years of UI/UX design experience, Proficiency in Figma and Adobe Creative Suite',
    //   benefits: 'Remote-first culture, Professional development, Latest hardware, Annual bonus',
    //   is_active: true,
    //   posted_date: '2024-01-10T00:00:00'
    // }
  ];

  // Get unique departments and locations for filters
  const departments = ['all', ...new Set(jobOpenings.map(job => job.department))];
  const locations = ['all', 'remote', 'hybrid', ...new Set(jobOpenings.map(job => job.location).filter(loc => !loc.toLowerCase().includes('remote') && !loc.toLowerCase().includes('hybrid')))];
  const jobTypes = ['all', 'full-time', 'part-time', 'contract', 'internship', 'remote', 'hybrid'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white pt-20 lg:pt-24 px-4 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/20 border border-blue-500/20 mb-6">
            <Briefcase className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Join Our Team</span>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-black mb-6">
            Build the Future with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">Focitech</span>
          </h1>
          
          <p className="text-lg lg:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-8">
            We're looking for passionate people to join our team. Work on challenging projects, grow your skills, and make an impact.
          </p>

          {/* Company Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {companyStats.map((stat, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/5 rounded-2xl p-4">
                <div className="text-blue-500 mb-2 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-2xl font-black">{stat.value}</div>
                <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Perks & Culture */}
          <div className="lg:w-1/3">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 lg:p-8 sticky top-24">
              <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-500" />
                Why Join Us?
              </h2>
              
              <div className="space-y-4 mb-8">
                {perks.map((perk, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="p-2 rounded-xl bg-blue-600/20 text-blue-500">
                      {perk.icon}
                    </div>
                    <div>
                      <h3 className="font-bold">{perk.title}</h3>
                      <p className="text-sm text-slate-400">{perk.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/5 pt-6">
                <h3 className="font-bold mb-4">Our Culture</h3>
                <ul className="space-y-3 text-sm text-slate-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Remote-first company
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Transparent communication
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Continuous learning
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Work-life balance
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Content - Job Listings */}
          <div className="lg:w-2/3">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl lg:text-3xl font-black mb-2">Open Positions</h2>
                <p className="text-slate-400">
                  {loading ? 'Loading...' : `${filteredJobs.length} position${filteredJobs.length !== 1 ? 's' : ''} available`}
                </p>
              </div>
              
              {/* Search Bar */}
              <div className="relative mt-4 lg:mt-0 lg:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search positions..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap gap-2 mb-6">
              <select 
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept === 'all' ? 'All Departments' : dept}
                  </option>
                ))}
              </select>
              
              <select 
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
              >
                {locations.map(loc => (
                  <option key={loc} value={loc}>
                    {loc === 'all' ? 'All Locations' : loc}
                  </option>
                ))}
              </select>
              
              <select 
                value={filters.jobType}
                onChange={(e) => handleFilterChange('jobType', e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
              >
                {jobTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type.replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="mt-4 text-slate-400">Loading job openings...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/50 border border-white/5 rounded-3xl">
                <Briefcase className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-600 mb-2">No Matching Positions</h3>
                <p className="text-slate-500 mb-6">Try adjusting your filters or check back later.</p>
                <button 
                  onClick={() => setFilters({ department: 'all', location: 'all', jobType: 'all', search: '' })}
                  className="text-blue-500 hover:text-blue-400 font-bold"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 hover:border-blue-500/20 transition-all hover:scale-[1.01]"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold">{job.title}</h3>
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-500/20 text-blue-400">
                            {job.department}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {job.job_type.replace('-', ' ')}
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            {job.salary_range || 'Competitive'}
                          </div>
                        </div>
                        
                        <p className="text-slate-300 mb-4 line-clamp-2">{job.description}</p>
                        
                        <div className="text-xs text-slate-500">
                          Posted: {new Date(job.posted_date).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => openApplicationForm(job)}
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 whitespace-nowrap"
                      >
                        Apply Now
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-white/5 rounded-3xl p-8 lg:p-12">
            <div className="inline-flex p-4 rounded-2xl bg-blue-600/20 border border-blue-500/20 mb-6">
              <GraduationCap className="w-8 h-8 text-blue-500" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-black mb-4">
              Don't See the Right Role?
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
              We're always looking for talented people. Send us your resume and we'll contact you when a suitable position opens up.
            </p>
            <button className="px-8 py-4 border border-white/10 hover:bg-white/5 rounded-2xl font-bold text-lg transition-all hover:scale-[1.02] inline-flex items-center gap-2">
              Join Our Talent Pool
              <ExternalLink className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Application Form Modal */}
      <AnimatePresence>
        {showApplicationForm && selectedJob && (
          <div className="fixed inset-0 z-[9999] flex items-start sm:items-center justify-center p-0 sm:p-2 md:p-4 bg-black/90 backdrop-blur-lg overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 w-full min-h-screen sm:min-h-0 sm:max-w-2xl sm:rounded-2xl md:rounded-3xl shadow-2xl shadow-black/50"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Fixed Header for Mobile */}
              <div className="sticky top-0 z-10 bg-slate-900 border-b border-white/10 px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold truncate">
                    Apply for {selectedJob.title}
                  </h3>
                  <p className="text-xs text-slate-400 truncate">
                    {selectedJob.department} • {selectedJob.location}
                  </p>
                </div>
                <button
                  onClick={() => setShowApplicationForm(false)}
                  className="ml-4 p-1.5 hover:bg-white/5 rounded-lg transition-colors flex-shrink-0"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto max-h-[calc(100vh-60px)] sm:max-h-[80vh]">
                <div className="p-4 sm:p-6 md:p-8">
                  <form onSubmit={handleSubmitApplication} className="space-y-6">
                    {/* Job Info */}
                    <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                      <h4 className="font-bold text-base mb-3">Position Details</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-slate-500 mb-1">Salary:</div>
                          <div className="font-bold text-sm">{selectedJob.salary_range || 'Competitive'}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 mb-1">Experience:</div>
                          <div className="font-bold text-sm">{selectedJob.experience_required}</div>
                        </div>
                        <div className="col-span-2 mt-2">
                          <div className="text-xs text-slate-500 mb-1">Type:</div>
                          <div className="font-bold text-sm">{selectedJob.job_type.replace('-', ' ')}</div>
                        </div>
                      </div>
                    </div>

                    {/* Error Message */}
                    {uploadError && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                        <p className="text-red-400 text-sm">{uploadError}</p>
                      </div>
                    )}

                    {/* Personal Information */}
                    <div>
                      <h4 className="font-bold text-lg mb-4">Personal Information</h4>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={applicationForm.name}
                            onChange={handleInputChange}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm"
                            placeholder="John Doe"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={applicationForm.email}
                            onChange={handleInputChange}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm"
                            placeholder="john@example.com"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={applicationForm.phone}
                            onChange={handleInputChange}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm"
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Resume Upload */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Resume / CV *
                      </label>
                      <div className="border-2 border-dashed border-white/10 rounded-xl p-4 text-center hover:border-blue-500/50 transition-colors">
                        {applicationForm.resume ? (
                          <div className="space-y-3">
                            <div className="inline-flex p-3 rounded-xl bg-green-500/20 text-green-500">
                              <CheckCircle className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="font-bold text-sm truncate">{applicationForm.resume.name}</p>
                              <p className="text-sm text-slate-400 mt-1">
                                {(applicationForm.resume.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setApplicationForm(prev => ({ ...prev, resume: null }))}
                              className="text-sm text-red-500 hover:text-red-400"
                            >
                              Remove File
                            </button>
                          </div>
                        ) : (
                          <div>
                            <div className="inline-flex p-3 rounded-xl bg-white/5 mb-4">
                              <Upload className="w-6 h-6 text-blue-500" />
                            </div>
                            <div className="mb-4">
                              <p className="font-bold">Upload your resume</p>
                              <p className="text-sm text-slate-400 mt-1">
                                PDF or Word document, max 5MB
                              </p>
                            </div>
                            <label className="inline-block bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-bold text-sm cursor-pointer transition-colors">
                              Browse Files
                              <input
                                type="file"
                                onChange={handleFileUpload}
                                accept=".pdf,.doc,.docx"
                                className="hidden"
                              />
                            </label>
                          </div>
                        )}
                        
                        {/* Upload Progress Bar */}
                        {uploadProgress > 0 && uploadProgress < 100 && (
                          <div className="mt-4">
                            <div className="flex justify-between text-sm text-slate-400 mb-1">
                              <span>Uploading...</span>
                              <span>{uploadProgress}%</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Portfolio URL */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Portfolio / GitHub URL
                      </label>
                      <input
                        type="url"
                        name="portfolio_url"
                        value={applicationForm.portfolio_url}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm"
                        placeholder="https://github.com/username"
                      />
                    </div>

                    {/* Cover Letter */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Cover Letter
                      </label>
                      <textarea
                        name="cover_letter"
                        value={applicationForm.cover_letter}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm resize-none"
                        placeholder="Tell us why you're interested in this position..."
                      />
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-white/5">
                      <button
                        type="button"
                        onClick={() => setShowApplicationForm(false)}
                        className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold text-sm transition-colors"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Submitting...
                          </span>
                        ) : (
                          'Submit Application'
                        )}
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

export default Careers;