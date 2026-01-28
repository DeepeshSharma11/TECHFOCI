// src/components/Admin/FormModal.jsx
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { X, Save, Loader2 } from 'lucide-react';

const FormModal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  onSubmit,
  submitLabel = 'Save',
  submitLoading = false,
  submitDisabled = false,
  size = 'md',
  showClose = true,
  backdropClickClose = true,
  className = ''
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const sizeClasses = {
    sm: 'max-w-lg',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={backdropClickClose ? onClose : undefined}
            className="fixed inset-0 z-[9998] bg-black/90 backdrop-blur-lg"
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-[9999] flex items-start lg:items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`relative bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 rounded-3xl shadow-2xl shadow-black/50 w-full ${sizeClasses[size]} ${className}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-white/5 px-6 py-4 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold truncate">{title}</h2>
                    {subtitle && (
                      <p className="text-sm text-slate-400 truncate mt-1">{subtitle}</p>
                    )}
                  </div>
                  
                  {showClose && (
                    <button
                      onClick={onClose}
                      className="ml-4 p-2 hover:bg-white/5 rounded-xl transition-colors flex-shrink-0"
                      aria-label="Close"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
                <div className="p-6">
                  {children}
                </div>
              </div>

              {/* Footer */}
              {(onSubmit || onClose) && (
                <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-sm border-t border-white/5 px-6 py-4 rounded-b-3xl">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={submitLoading}
                      className="px-6 py-3 text-slate-400 hover:text-white border border-white/10 hover:border-white/20 rounded-xl font-medium text-sm transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    
                    {onSubmit && (
                      <button
                        type="button"
                        onClick={onSubmit}
                        disabled={submitDisabled || submitLoading}
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
                      >
                        {submitLoading ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={16} />
                            {submitLabel}
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

FormModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  children: PropTypes.node.isRequired,
  onSubmit: PropTypes.func,
  submitLabel: PropTypes.string,
  submitLoading: PropTypes.bool,
  submitDisabled: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  showClose: PropTypes.bool,
  backdropClickClose: PropTypes.bool,
  className: PropTypes.string
};

export default FormModal;