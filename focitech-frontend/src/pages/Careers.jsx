import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, MapPin, DollarSign, Clock, Upload, X, 
  CheckCircle, ExternalLink, TrendingUp, Users, 
  Award, Zap, Heart, ChevronRight, FileText,
  Building, Globe, Coffee, BookOpen, GraduationCap
} from 'lucide-react';

const Careers = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationForm, setApplicationForm] = useState({
    name: '',
    email: '',
    phone: '',
    coverLetter: '',
    resume: null,
    portfolioUrl: ''
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const jobOpenings = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      salary: '$90,000 - $120,000',
      experience: '5+ years',
      description: 'We are looking for an experienced Frontend Developer to join our team. You will be responsible for building user interfaces and implementing designs using React, TypeScript, and modern CSS frameworks.',
      requirements: [
        '5+ years of experience with React.js',
        'Strong proficiency in TypeScript',
        'Experience with state management (Redux, Context API)',
        'Knowledge of modern CSS frameworks (Tailwind CSS, Styled Components)',
        'Familiarity with testing frameworks (Jest, React Testing Library)'
      ],
      benefits: [
        'Remote work flexibility',
        'Health insurance',
        'Stock options',
        'Learning budget',
        'Flexible PTO'
      ],
      postedDate: '2024-01-15'
    },
    {
      id: 2,
      title: 'UI/UX Designer',
      department: 'Design',
      location: 'Hybrid (Bareilly)',
      type: 'Full-time',
      salary: '$70,000 - $95,000',
      experience: '3+ years',
      description: 'Join our design team to create beautiful and functional user interfaces for our products. You will work closely with product managers and developers to bring designs to life.',
      requirements: [
        '3+ years of UI/UX design experience',
        'Proficiency in Figma and Adobe Creative Suite',
        'Strong portfolio showcasing design projects',
        'Understanding of user-centered design principles',
        'Experience with design systems'
      ],
      benefits: [
        'Remote-first culture',
        'Professional development',
        'Latest hardware',
        'Annual bonus',
        'Wellness program'
      ],
      postedDate: '2024-01-10'
    },
    {
      id: 3,
      title: 'Backend Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      salary: '$85,000 - $115,000',
      experience: '4+ years',
      description: 'Build scalable backend systems using Node.js, Python, and modern databases. You will work on API design, database architecture, and system optimization.',
      requirements: [
        '4+ years of backend development experience',
        'Strong knowledge of Node.js and/or Python',
        'Experience with SQL and NoSQL databases',
        'Familiarity with cloud platforms (AWS, GCP)',
        'Understanding of microservices architecture'
      ],
      benefits: [
        'Remote work',
        'Health benefits',
        'Conference budget',
        '401(k) matching',
        'Home office setup'
      ],
      postedDate: '2024-01-05'
    },
    {
      id: 4,
      title: 'DevOps Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      salary: '$80,000 - $110,000',
      experience: '3+ years',
      description: 'Help us build and maintain our cloud infrastructure. You will work on CI/CD pipelines, monitoring, and automation to ensure our systems are reliable and scalable.',
      requirements: [
        '3+ years of DevOps experience',
        'Experience with Docker and Kubernetes',
        'Knowledge of CI/CD tools (Jenkins, GitLab CI)',
        'Familiarity with infrastructure as code (Terraform)',
        'Monitoring and logging experience'
      ],
      benefits: [
        'Flexible hours',
        'Stock options',
        'Learning opportunities',
        'Health insurance',
        'Team events'
      ],
      postedDate: '2024-01-12'
    },
    {
      id: 5,
      title: 'Product Manager',
      department: 'Product',
      location: 'Hybrid (Bareilly)',
      type: 'Full-time',
      salary: '$95,000 - $130,000',
      experience: '5+ years',
      description: 'Lead product development from conception to launch. Work with cross-functional teams to define product vision, strategy, and roadmap.',
      requirements: [
        '5+ years of product management experience',
        'Experience in SaaS products',
        'Strong analytical skills',
        'Excellent communication skills',
        'Technical background preferred'
      ],
      benefits: [
        'Competitive salary',
        'Equity package',
        'Health benefits',
        'Remote flexibility',
        'Annual bonus'
      ],
      postedDate: '2024-01-08'
    },
    {
      id: 6,
      title: 'Marketing Specialist',
      department: 'Marketing',
      location: 'Remote',
      type: 'Full-time',
      salary: '$60,000 - $85,000',
      experience: '2+ years',
      description: 'Create and execute marketing campaigns to drive brand awareness and customer acquisition. You will work on content creation, social media, and digital marketing strategies.',
      requirements: [
        '2+ years of marketing experience',
        'Experience with digital marketing channels',
        'Content creation skills',
        'Analytical mindset',
        'SEO/SEM knowledge'
      ],
      benefits: [
        'Remote work',
        'Creative freedom',
        'Performance bonuses',
        'Learning budget',
        'Team retreats'
      ],
      postedDate: '2024-01-03'
    }
  ];

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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    // Check file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload PDF or Word documents only');
      return;
    }

    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setApplicationForm({ ...applicationForm, resume: file });
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (!applicationForm.name || !applicationForm.email || !applicationForm.resume) {
      alert('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('name', applicationForm.name);
    formData.append('email', applicationForm.email);
    formData.append('phone', applicationForm.phone);
    formData.append('coverLetter', applicationForm.coverLetter);
    formData.append('portfolioUrl', applicationForm.portfolioUrl);
    formData.append('jobId', selectedJob.id);
    formData.append('jobTitle', selectedJob.title);
    formData.append('resume', applicationForm.resume);

    try {
      // Here you would typically send the formData to your backend
      // For now, we'll simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert('Application submitted successfully! We\'ll get back to you soon.');
      setShowApplicationForm(false);
      setSelectedJob(null);
      setApplicationForm({
        name: '',
        email: '',
        phone: '',
        coverLetter: '',
        resume: null,
        portfolioUrl: ''
      });
    } catch (error) {
      alert('Error submitting application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openApplicationForm = (job) => {
    setSelectedJob(job);
    setShowApplicationForm(true);
  };

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
                <p className="text-slate-400">{jobOpenings.length} positions available</p>
              </div>
              <div className="flex gap-2 mt-4 lg:mt-0">
                <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500">
                  <option value="all">All Departments</option>
                  <option value="engineering">Engineering</option>
                  <option value="design">Design</option>
                  <option value="product">Product</option>
                  <option value="marketing">Marketing</option>
                </select>
                <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500">
                  <option value="all">All Locations</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {jobOpenings.map((job) => (
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
                          {job.type}
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          {job.salary}
                        </div>
                      </div>
                      
                      <p className="text-slate-300 mb-4 line-clamp-2">{job.description}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {job.requirements.slice(0, 3).map((req, index) => (
                          <span key={index} className="px-3 py-1 bg-white/5 rounded-full text-xs">
                            {req.split(' ').slice(0, 3).join(' ')}...
                          </span>
                        ))}
                        {job.requirements.length > 3 && (
                          <span className="px-3 py-1 bg-white/5 rounded-full text-xs">
                            +{job.requirements.length - 3} more
                          </span>
                        )}
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

            {/* No Openings Message */}
            {jobOpenings.length === 0 && (
              <div className="text-center py-16 bg-slate-900/50 border border-white/5 rounded-3xl">
                <Briefcase className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-600 mb-2">No Open Positions</h3>
                <p className="text-slate-500 mb-6">Check back later for new opportunities.</p>
                <button className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 font-bold">
                  Join Talent Pool
                  <ExternalLink className="w-4 h-4" />
                </button>
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
              {/* Job Info - Mobile Optimized */}
              <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                <h4 className="font-bold text-base mb-3">Position Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Salary:</div>
                    <div className="font-bold text-sm">{selectedJob.salary}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Experience:</div>
                    <div className="font-bold text-sm">{selectedJob.experience}</div>
                  </div>
                  <div className="col-span-2 mt-2">
                    <div className="text-xs text-slate-500 mb-1">Type:</div>
                    <div className="font-bold text-sm">{selectedJob.type}</div>
                  </div>
                </div>
              </div>

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
                      value={applicationForm.name}
                      onChange={(e) => setApplicationForm({ ...applicationForm, name: e.target.value })}
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
                      value={applicationForm.email}
                      onChange={(e) => setApplicationForm({ ...applicationForm, email: e.target.value })}
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
                      value={applicationForm.phone}
                      onChange={(e) => setApplicationForm({ ...applicationForm, phone: e.target.value })}
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
                        onClick={() => setApplicationForm({ ...applicationForm, resume: null })}
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
                  value={applicationForm.portfolioUrl}
                  onChange={(e) => setApplicationForm({ ...applicationForm, portfolioUrl: e.target.value })}
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
                  value={applicationForm.coverLetter}
                  onChange={(e) => setApplicationForm({ ...applicationForm, coverLetter: e.target.value })}
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