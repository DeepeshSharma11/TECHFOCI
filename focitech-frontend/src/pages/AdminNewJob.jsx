// src/pages/AdminNewJob.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase, Save, X, Calendar, MapPin,
  DollarSign, Award, GraduationCap,
  Globe, Clock, CheckCircle, AlertCircle
} from 'lucide-react';

const AdminNewJob = () => {
  const { isAdmin } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isEditMode] = useState(!!id);
  
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    job_type: 'full-time',
    salary_range: '',
    experience_required: '',
    education_required: '',
    description: '',
    requirements: '',
    benefits: '',
    is_active: true,
    application_deadline: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode && id) {
      // In real app, fetch job data by ID
      setFormData({
        title: 'Senior Frontend Developer',
        department: 'Engineering',
        location: 'Remote',
        job_type: 'full-time',
        salary_range: '$90,000 - $120,000',
        experience_required: '5+ years',
        education_required: "Bachelor's in Computer Science",
        description: 'We are looking for an experienced Frontend Developer to join our team.',
        requirements: '5+ years of React experience, TypeScript proficiency, etc.',
        benefits: 'Remote work, Health insurance, Learning budget',
        is_active: true,
        application_deadline: '2024-12-31'
      });
    }
  }, [isEditMode, id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.requirements.trim()) newErrors.requirements = 'Requirements are required';
    if (!formData.experience_required.trim()) newErrors.experience_required = 'Experience is required';
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(isEditMode ? 'Job updated successfully!' : 'Job created successfully!');
      navigate('/admin/careers');
    } catch (error) {
      console.error('Error saving job:', error);
      alert('Failed to save job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const jobTypes = [
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
    { value: 'remote', label: 'Remote' },
    { value: 'hybrid', label: 'Hybrid' }
  ];

  const departments = [
    'Engineering',
    'Design',
    'Marketing',
    'Sales',
    'Operations',
    'Human Resources',
    'Finance',
    'Product',
    'Customer Support'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-white pt-20 lg:pt-24">
      <div className="max-w-4xl mx-auto px-4 lg:px-8 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-black">
              {isEditMode ? 'Edit Job Opening' : 'Create New Job'}
            </h1>
            <p className="text-slate-400">
              {isEditMode ? 'Update job details' : 'Fill in the job requirements and details'}
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/careers')}
            className="px-4 py-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
          >
            <X size={16} />
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-slate-800/50 border border-white/5 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-blue-500/20">
                <Briefcase size={20} className="text-blue-500" />
              </div>
              <h2 className="text-lg font-bold">Basic Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Senior Frontend Developer"
                  className={`w-full bg-white/5 border ${
                    errors.title ? 'border-red-500/50' : 'border-white/10'
                  } rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm`}
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.title}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Department *
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className={`w-full bg-white/5 border ${
                    errors.department ? 'border-red-500/50' : 'border-white/10'
                  } rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors text-sm`}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                {errors.department && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.department}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Remote, Hybrid, or Office location"
                    className={`w-full bg-white/5 border ${
                      errors.location ? 'border-red-500/50' : 'border-white/10'
                    } rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm`}
                  />
                </div>
                {errors.location && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.location}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Job Type *
                </label>
                <select
                  name="job_type"
                  value={formData.job_type}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors text-sm"
                >
                  {jobTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Salary Range
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="salary_range"
                    value={formData.salary_range}
                    onChange={handleChange}
                    placeholder="$90,000 - $120,000"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Application Deadline
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    name="application_deadline"
                    value={formData.application_deadline}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white outline-none focus:border-blue-500 transition-colors text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Experience & Education */}
          <div className="bg-slate-800/50 border border-white/5 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-emerald-500/20">
                <Award size={20} className="text-emerald-500" />
              </div>
              <h2 className="text-lg font-bold">Requirements</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Experience Required *
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="experience_required"
                    value={formData.experience_required}
                    onChange={handleChange}
                    placeholder="5+ years of experience"
                    className={`w-full bg-white/5 border ${
                      errors.experience_required ? 'border-red-500/50' : 'border-white/10'
                    } rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm`}
                  />
                </div>
                {errors.experience_required && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.experience_required}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Education Required
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="education_required"
                    value={formData.education_required}
                    onChange={handleChange}
                    placeholder="Bachelor's degree in Computer Science"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="bg-slate-800/50 border border-white/5 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-purple-500/20">
                <Globe size={20} className="text-purple-500" />
              </div>
              <h2 className="text-lg font-bold">Job Description *</h2>
            </div>
            
            <div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="6"
                placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                className={`w-full bg-white/5 border ${
                  errors.description ? 'border-red-500/50' : 'border-white/10'
                } rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm resize-none`}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.description}
                </p>
              )}
              <p className="text-slate-500 text-xs mt-2">
                Describe the day-to-day responsibilities and impact of this role.
              </p>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-slate-800/50 border border-white/5 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-amber-500/20">
                <CheckCircle size={20} className="text-amber-500" />
              </div>
              <h2 className="text-lg font-bold">Requirements & Skills *</h2>
            </div>
            
            <div>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows="6"
                placeholder="List the required skills, qualifications, and technical expertise..."
                className={`w-full bg-white/5 border ${
                  errors.requirements ? 'border-red-500/50' : 'border-white/10'
                } rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm resize-none`}
              />
              {errors.requirements && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.requirements}
                </p>
              )}
              <p className="text-slate-500 text-xs mt-2">
                List each requirement on a new line or separate with bullet points.
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-slate-800/50 border border-white/5 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-cyan-500/20">
                <Clock size={20} className="text-cyan-500" />
              </div>
              <h2 className="text-lg font-bold">Benefits & Perks</h2>
            </div>
            
            <div>
              <textarea
                name="benefits"
                value={formData.benefits}
                onChange={handleChange}
                rows="4"
                placeholder="Health insurance, flexible hours, remote work, learning budget, etc..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors text-sm resize-none"
              />
              <p className="text-slate-500 text-xs mt-2">
                What makes your company a great place to work?
              </p>
            </div>
          </div>

          {/* Publish Settings */}
          <div className="bg-slate-800/50 border border-white/5 rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="w-5 h-5 bg-white/5 border border-white/10 rounded focus:ring-blue-500"
                />
                <div>
                  <label htmlFor="is_active" className="text-sm font-medium text-slate-300">
                    Publish job immediately
                  </label>
                  <p className="text-slate-500 text-xs">
                    Job will be visible on the careers page
                  </p>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    {isEditMode ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    {isEditMode ? 'Update Job' : 'Create Job'}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminNewJob;