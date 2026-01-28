// src/components/Admin/LoadingState.jsx - PRODUCTION VERSION
import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react';

const LoadingState = ({ 
  type = 'loading', // 'loading', 'empty', 'error', 'search'
  message,
  subMessage,
  icon,
  action,
  fullScreen = false
}) => {
  const config = {
    loading: {
      icon: <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />,
      title: 'Loading data...',
      subtitle: 'Please wait while we fetch the latest information',
      color: 'blue'
    },
    empty: {
      icon: <RefreshCw className="w-12 h-12 text-slate-500" />,
      title: 'No data found',
      subtitle: 'Try adjusting your filters or create new content',
      color: 'slate'
    },
    error: {
      icon: <AlertCircle className="w-12 h-12 text-red-500" />,
      title: 'Something went wrong',
      subtitle: 'Failed to load data. Please try again',
      color: 'red'
    },
    search: {
      icon: <AlertCircle className="w-12 h-12 text-amber-500" />,
      title: 'No results found',
      subtitle: 'Try different search terms or filters',
      color: 'amber'
    }
  };

  const current = config[type];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex flex-col items-center justify-center text-center ${
        fullScreen 
          ? 'min-h-[60vh] py-12 bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-3xl border border-white/5' 
          : 'py-8'
      }`}
    >
      <div className="relative mb-6">
        {icon || current.icon}
        {type === 'loading' && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-4 border-transparent border-t-blue-500/30 rounded-full"
          />
        )}
      </div>

      <h3 className={`text-lg font-bold mb-2 ${
        type === 'error' ? 'text-red-500' :
        type === 'search' ? 'text-amber-500' :
        'text-white'
      }`}>
        {message || current.title}
      </h3>
      
      <p className="text-slate-400 max-w-md mx-auto mb-6">
        {subMessage || current.subtitle}
      </p>

      {action && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={action.onClick}
          className={`px-6 py-3 rounded-xl font-medium text-sm transition-all ${
            type === 'error' 
              ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/30' 
              : 'bg-blue-600 hover:bg-blue-500 text-white'
          }`}
        >
          {action.label}
        </motion.button>
      )}

      {/* Background Animation */}
      {type === 'loading' && (
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          <motion.div
            animate={{ 
              x: ['0%', '100%'],
              opacity: [0, 0.3, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent"
          />
        </div>
      )}
    </motion.div>
  );
};

LoadingState.propTypes = {
  type: PropTypes.oneOf(['loading', 'empty', 'error', 'search']),
  message: PropTypes.string,
  subMessage: PropTypes.string,
  icon: PropTypes.node,
  action: PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
  }),
  fullScreen: PropTypes.bool
};

export default LoadingState;