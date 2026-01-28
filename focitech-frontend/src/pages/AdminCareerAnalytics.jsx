// src/pages/AdminCareerAnalytics.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  BarChart3, TrendingUp, Users, Briefcase,
  DollarSign, Calendar, Award, Globe,
  PieChart, LineChart, Download, Filter,
  RefreshCw, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

const AdminCareerAnalytics = () => {
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');

  // Mock analytics data
  const mockData = {
    overview: {
      totalJobs: 15,
      activeJobs: 8,
      totalApplications: 124,
      conversionRate: '8.2%',
      avgTimeToHire: '24 days',
      avgSalary: '$95,000'
    },
    applicationsByMonth: [65, 59, 80, 81, 56, 55, 40, 45, 60, 70, 85, 90],
    departmentDistribution: [
      { name: 'Engineering', value: 45, color: '#3b82f6' },
      { name: 'Design', value: 25, color: '#8b5cf6' },
      { name: 'Marketing', value: 15, color: '#10b981' },
      { name: 'Sales', value: 10, color: '#f59e0b' },
      { name: 'Operations', value: 5, color: '#ef4444' }
    ],
    statusDistribution: [
      { status: 'Pending', count: 45, color: '#f59e0b' },
      { status: 'Reviewing', count: 30, color: '#3b82f6' },
      { status: 'Shortlisted', count: 25, color: '#10b981' },
      { status: 'Rejected', count: 18, color: '#ef4444' },
      { status: 'Hired', count: 6, color: '#059669' }
    ],
    topJobs: [
      { title: 'Senior Frontend Dev', applications: 42, hires: 3 },
      { title: 'UI/UX Designer', applications: 35, hires: 2 },
      { title: 'Backend Engineer', applications: 28, hires: 2 },
      { title: 'Marketing Manager', applications: 15, hires: 1 },
      { title: 'Sales Executive', applications: 12, hires: 1 }
    ]
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, [timeRange]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center pt-20">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="mx-auto w-16 h-16 border-4 border-blue-600/30 border-t-blue-600 rounded-full"
          />
          <p className="mt-6 text-slate-400 text-sm font-medium">Loading analytics...</p>
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
            <h1 className="text-2xl lg:text-3xl font-black">Career Analytics</h1>
            <p className="text-slate-400">Insights and performance metrics</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            <button className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-medium flex items-center gap-2">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {[
            {
              label: 'Total Jobs',
              value: mockData.overview.totalJobs,
              icon: <Briefcase size={20} />,
              color: 'bg-blue-500/20 text-blue-500',
              change: '+12%'
            },
            {
              label: 'Active Jobs',
              value: mockData.overview.activeJobs,
              icon: <Briefcase size={20} />,
              color: 'bg-emerald-500/20 text-emerald-500',
              change: '+8%'
            },
            {
              label: 'Applications',
              value: mockData.overview.totalApplications,
              icon: <Users size={20} />,
              color: 'bg-purple-500/20 text-purple-500',
              change: '+24%'
            },
            {
              label: 'Conversion Rate',
              value: mockData.overview.conversionRate,
              icon: <TrendingUp size={20} />,
              color: 'bg-amber-500/20 text-amber-500',
              change: '+2.1%'
            },
            {
              label: 'Avg Time to Hire',
              value: mockData.overview.avgTimeToHire,
              icon: <Calendar size={20} />,
              color: 'bg-cyan-500/20 text-cyan-500',
              change: '-3 days'
            },
            {
              label: 'Avg Salary',
              value: mockData.overview.avgSalary,
              icon: <DollarSign size={20} />,
              color: 'bg-green-500/20 text-green-500',
              change: '+5.2%'
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800/50 backdrop-blur-sm border border-white/5 rounded-2xl p-4 hover:border-blue-500/20 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`${stat.color} w-10 h-10 rounded-xl flex items-center justify-center`}>
                  {stat.icon}
                </div>
                <span className={`text-xs font-medium flex items-center gap-1 ${
                  stat.change.startsWith('+') ? 'text-emerald-500' : 'text-red-500'
                }`}>
                  {stat.change.startsWith('+') ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {stat.change}
                </span>
              </div>
              <p className="text-slate-400 text-xs mb-1">{stat.label}</p>
              <p className="text-xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Application Trends */}
          <div className="bg-slate-800/50 border border-white/5 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-lg">Application Trends</h3>
                <p className="text-slate-400 text-sm">Applications over time</p>
              </div>
              <LineChart size={20} className="text-blue-500" />
            </div>
            <div className="h-64">
              <div className="flex items-end h-48 gap-1">
                {mockData.applicationsByMonth.map((value, index) => (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div className="flex items-end justify-center h-full w-6">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(value / 100) * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.05 }}
                        className="w-3 bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t-lg"
                      />
                    </div>
                    <span className="text-xs text-slate-500 mt-2">
                      {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Department Distribution */}
          <div className="bg-slate-800/50 border border-white/5 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-lg">Department Distribution</h3>
                <p className="text-slate-400 text-sm">Applications by department</p>
              </div>
              <PieChart size={20} className="text-purple-500" />
            </div>
            <div className="space-y-4">
              {mockData.departmentDistribution.map((dept, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: dept.color }}
                      />
                      <span>{dept.name}</span>
                    </div>
                    <span>{dept.value}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${dept.value}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: dept.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status Distribution & Top Jobs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Distribution */}
          <div className="bg-slate-800/50 border border-white/5 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-lg">Application Status</h3>
                <p className="text-slate-400 text-sm">Current status distribution</p>
              </div>
              <BarChart3 size={20} className="text-emerald-500" />
            </div>
            <div className="space-y-4">
              {mockData.statusDistribution.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.status}</span>
                    </div>
                    <span>{item.count} applications</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.count / 124) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performing Jobs */}
          <div className="bg-slate-800/50 border border-white/5 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-lg">Top Performing Jobs</h3>
                <p className="text-slate-400 text-sm">Most applied positions</p>
              </div>
              <Award size={20} className="text-amber-500" />
            </div>
            <div className="space-y-4">
              {mockData.topJobs.map((job, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <div className="flex-1">
                    <p className="font-medium text-sm truncate">{job.title}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-slate-400">{job.applications} applications</span>
                      <span className="text-xs text-emerald-500">{job.hires} hires</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium text-slate-400">
                      {((job.hires / job.applications) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="mt-6 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/20 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-blue-500/20">
              <TrendingUp size={20} className="text-blue-500" />
            </div>
            <h3 className="font-bold text-lg">Key Insights</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-black/20 rounded-2xl">
              <p className="text-sm text-slate-300">
                <span className="font-bold text-blue-400">Engineering roles</span> receive the most applications (45% of total)
              </p>
            </div>
            <div className="p-4 bg-black/20 rounded-2xl">
              <p className="text-sm text-slate-300">
                <span className="font-bold text-emerald-400">Conversion rate</span> increased by 2.1% compared to last month
              </p>
            </div>
            <div className="p-4 bg-black/20 rounded-2xl">
              <p className="text-sm text-slate-300">
                <span className="font-bold text-amber-400">Senior Frontend Developer</span> is the most popular position
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCareerAnalytics;