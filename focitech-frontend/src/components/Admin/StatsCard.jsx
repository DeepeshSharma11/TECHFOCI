// src/components/Admin/StatsCard.jsx - PRODUCTION VERSION
import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const StatsCard = ({ 
  label, 
  value, 
  icon, 
  color = 'blue', 
  change, 
  loading = false,
  tooltip,
  onClick 
}) => {
  const colorClasses = {
    blue: 'from-blue-600 to-cyan-500',
    indigo: 'from-indigo-600 to-purple-500',
    amber: 'from-amber-600 to-orange-500',
    emerald: 'from-emerald-600 to-green-500',
    purple: 'from-purple-600 to-pink-500',
    red: 'from-red-600 to-rose-500'
  };

  const changeClasses = {
    positive: 'text-emerald-500',
    negative: 'text-red-500',
    neutral: 'text-slate-500'
  };

  const getChangeType = (change) => {
    if (!change) return 'neutral';
    if (typeof change === 'string') {
      if (change.startsWith('+')) return 'positive';
      if (change.startsWith('-')) return 'negative';
    }
    return 'neutral';
  };

  const changeType = getChangeType(change);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={onClick}
      className={`relative bg-slate-800/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 hover:border-${color}-500/20 transition-all cursor-pointer group ${
        onClick ? 'hover:shadow-2xl hover:shadow-' + color + '-500/10' : ''
      }`}
    >
      {/* Tooltip */}
      {tooltip && (
        <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <div className="bg-slate-900 text-xs text-slate-300 px-3 py-1.5 rounded-xl border border-white/10 shadow-2xl whitespace-nowrap">
            {tooltip}
          </div>
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className={`bg-gradient-to-br ${colorClasses[color]} w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg`}>
          {icon}
        </div>
        {change && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${changeClasses[changeType]}`}>
            {change}
          </span>
        )}
      </div>
      
      <div>
        <p className="text-slate-400 text-sm font-medium mb-1">{label}</p>
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="h-6 w-24 bg-slate-700/50 rounded-lg animate-pulse" />
            <div className="h-2 w-2 bg-slate-600 rounded-full animate-bounce" />
            <div className="h-2 w-2 bg-slate-600 rounded-full animate-bounce delay-100" />
            <div className="h-2 w-2 bg-slate-600 rounded-full animate-bounce delay-200" />
          </div>
        ) : (
          <p className="text-2xl font-black truncate">{value}</p>
        )}
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:to-white/5 rounded-3xl transition-all duration-300 pointer-events-none" />
      
      {/* Active Indicator */}
      {onClick && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/0 to-transparent group-hover:via-white/20 transition-all duration-500" />
      )}
    </motion.div>
  );
};

StatsCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node.isRequired,
  color: PropTypes.oneOf(['blue', 'indigo', 'amber', 'emerald', 'purple', 'red']),
  change: PropTypes.string,
  loading: PropTypes.bool,
  tooltip: PropTypes.string,
  onClick: PropTypes.func
};

export default StatsCard;