import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Search, LogOut, User as UserIcon, ShieldCheck, ChevronRight,
  Briefcase, Users, FileText, BarChart3, Settings
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);
  const adminMenuRef = useRef(null);

  // Background change on scroll logic
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on navigation
  useEffect(() => { 
    setIsOpen(false); 
    setShowAdminMenu(false);
  }, [location.pathname]);

  // Prevent background scroll when mobile menu is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  // Close admin menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (adminMenuRef.current && !adminMenuRef.current.contains(event.target)) {
        setShowAdminMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Team', path: '/team' },
    { name: 'Contact', path: '/contact' },
    { name: 'Our Business', path: '/our-business' },
    { name: 'Careers', path: '/careers' }  // Added Careers to main nav
  ];

  // Admin menu items including Careers
  const adminMenuItems = [
    { 
      name: 'Admin Dashboard', 
      path: '/admin', 
      icon: <ShieldCheck size={16} /> 
    },
    { 
      name: 'Careers Management', 
      path: '/admin/careers', 
      icon: <Briefcase size={16} /> 
    },
    { 
      name: 'Job Applications', 
      path: '/admin/applications', 
      icon: <FileText size={16} /> 
    },
    { 
      name: 'Career Analytics', 
      path: '/admin/careers/analytics', 
      icon: <BarChart3 size={16} /> 
    },
    { 
      name: 'Team Members', 
      path: '/admin/team', 
      icon: <Users size={16} /> 
    },
    { 
      name: 'Settings', 
      path: '/admin/settings', 
      icon: <Settings size={16} /> 
    }
  ];

  // Admin sub-links for quick access
  const adminQuickLinks = [
    { name: 'Post New Job', path: '/admin/careers/new', color: 'bg-green-500/20 text-green-500' },
    { name: 'View Applications', path: '/admin/applications', color: 'bg-blue-500/20 text-blue-500' },
    { name: 'Analytics', path: '/admin/careers/analytics', color: 'bg-purple-500/20 text-purple-500' }
  ];

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
      scrolled || isOpen 
        ? 'bg-[#020617] border-b border-white/10 py-3 shadow-2xl' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center">
          
          {/* --- BRAND LOGO --- */}
           <Link to="/" className="flex items-center gap-3 group relative z-[110]">
      {/* --- LOGO ICON --- */}
      <div className="relative w-10 h-10 flex items-center justify-center">
        {/* Animated background shape / border */}
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600 to-emerald-400 rounded-xl rotate-6 transition-all duration-500 group-hover:rotate-0 group-hover:scale-110 shadow-lg shadow-emerald-500/20"></div>
        
        {/* Actual Image Logo */}
        <div className="relative z-10 w-full h-full p-0.5">
          <img 
            src="/Foci-Tech Fav.jpeg" 
            alt="FociTech Logo" 
            className="w-full h-full object-cover rounded-lg shadow-md transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              // Fallback if image doesn't load
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          {/* Fallback "F" in case image fails to load */}
          <div className="hidden absolute inset-0 flex items-center justify-center font-black text-white text-xl italic">F</div>
        </div>
        
        {/* Decorative Ring */}
        <div className="absolute inset-0 border-2 border-white/10 rounded-xl -rotate-3 group-hover:rotate-0 transition-transform duration-500 pointer-events-none"></div>
      </div>

      {/* --- BRAND TEXT --- */}
      <div className="flex flex-col">
        <span className="text-xl font-black tracking-tighter uppercase italic leading-none">
          <span className="text-emerald-500 transition-colors duration-300 group-hover:text-emerald-400">FOCI</span>
          <span className="text-blue-500">TECH</span>
        </span>
        <span className="text-[7px] font-bold text-slate-500 tracking-[0.4em] uppercase mt-1">Innovating Future</span>
      </div>
    </Link>

          {/* --- PC NAVIGATION (Hidden on Mobile) --- */}
          <div className="hidden lg:flex items-center gap-8">
            <div className="flex gap-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  className={`relative px-4 py-2 text-sm font-bold uppercase tracking-widest transition-colors ${
                    location.pathname === link.path ? 'text-blue-400 shadow-blue-500/10' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <motion.span layoutId="nav-line" className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-500 rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4 pl-6 border-l border-white/10">
              {user ? (
                <div className="flex items-center gap-3">
                  <Link to="/profile" className="p-2 text-slate-400 hover:text-blue-500 transition-colors">
                    <UserIcon size={20} />
                  </Link>
                  
                  {/* Admin Dropdown Menu */}
                  {isAdmin && (
                    <div className="relative" ref={adminMenuRef}>
                      <button
                        onClick={() => setShowAdminMenu(!showAdminMenu)}
                        className={`p-2 rounded-lg transition-all flex items-center gap-2 ${
                          showAdminMenu 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                            : 'text-amber-500 hover:bg-amber-500/10'
                        }`}
                      >
                        <ShieldCheck size={18} />
                        <span className="text-xs font-bold">Admin</span>
                      </button>
                      
                      {/* Admin Dropdown */}
                      <AnimatePresence>
                        {showAdminMenu && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 top-full mt-2 w-64 bg-[#0f172a] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                          >
                            {/* Admin Header */}
                            <div className="p-4 border-b border-white/10 bg-blue-600/10">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-600/20">
                                  <ShieldCheck size={20} className="text-blue-500" />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-white">Admin Panel</p>
                                  <p className="text-xs text-slate-400">Career Management</p>
                                </div>
                              </div>
                            </div>
                            
                            {/* Quick Actions */}
                            <div className="p-3 border-b border-white/10">
                              <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Quick Actions</p>
                              <div className="grid grid-cols-2 gap-2">
                                {adminQuickLinks.map((link) => (
                                  <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`px-3 py-2 rounded-lg text-xs font-bold text-center transition-all hover:scale-[1.02] ${link.color}`}
                                    onClick={() => setShowAdminMenu(false)}
                                  >
                                    {link.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                            
                            {/* Full Menu */}
                            <div className="p-2">
                              {adminMenuItems.map((item) => (
                                <Link
                                  key={item.name}
                                  to={item.path}
                                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all ${
                                    location.pathname === item.path
                                      ? 'bg-blue-600 text-white'
                                      : 'text-slate-300 hover:bg-white/5'
                                  }`}
                                  onClick={() => setShowAdminMenu(false)}
                                >
                                  <span className="text-slate-400">{item.icon}</span>
                                  <span className="text-sm font-medium">{item.name}</span>
                                </Link>
                              ))}
                            </div>
                            
                            {/* Footer */}
                            <div className="p-3 border-t border-white/10 bg-black/20">
                              <p className="text-xs text-slate-500">Logged in as: {user.email}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                  
                  <button 
                    onClick={handleLogout} 
                    className="p-2 text-red-500/80 hover:text-red-500 transition-all"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="px-5 py-2 bg-blue-600 text-[10px] font-black tracking-widest text-white rounded hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
                >
                  SIGN IN
                </Link>
              )}
            </div>
          </div>

          {/* --- MOBILE TOGGLE BUTTON --- */}
          <div className="flex lg:hidden items-center gap-4 relative z-[110]">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-white bg-white/5 border border-white/10 rounded-lg">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE DRAWER --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden fixed inset-0 bg-[#020617] z-[105] flex flex-col p-6 pt-24 overflow-y-auto"
          >
            {/* Nav Links */}
            <div className="flex flex-col space-y-3 mb-8">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] px-2 mb-2">Menu</p>
              {navLinks.map((link) => (
                <Link
                  key={link.name} 
                  to={link.path}
                  className={`flex justify-between items-center p-4 rounded-xl text-lg font-bold border border-white/5 transition-all ${
                    location.pathname === link.path 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="flex-1">{link.name}</span>
                  <ChevronRight size={18} className={location.pathname === link.path ? 'text-white' : 'opacity-30'} />
                </Link>
              ))}
            </div>

            {/* Admin Section - Mobile */}
            {isAdmin && (
              <div className="mb-6">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] px-2 mb-2">Admin Panel</p>
                <div className="space-y-2">
                  <Link 
                    to="/admin/careers" 
                    className="flex items-center gap-3 p-4 rounded-xl text-lg font-bold border border-white/5 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition-all"
                    onClick={() => setIsOpen(false)}
                  >
                    <Briefcase size={20} />
                    <span>Careers Management</span>
                  </Link>
                  
                  <Link 
                    to="/admin/applications" 
                    className="flex items-center gap-3 p-4 rounded-xl text-lg font-bold border border-white/5 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-all"
                    onClick={() => setIsOpen(false)}
                  >
                    <FileText size={20} />
                    <span>Applications</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Account Controls */}
            <div className="mt-auto pb-8 flex flex-col space-y-4">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] px-2 mb-1">Account</p>
              {user ? (
                <div className="flex flex-col space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Link 
                      to="/profile" 
                      className="flex items-center justify-center gap-2 bg-white/5 py-3 rounded-lg text-xs font-bold uppercase border border-white/10 text-white hover:bg-white/10 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <UserIcon size={14} /> Profile
                    </Link>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }} 
                      className="flex items-center justify-center gap-2 bg-red-500/10 text-red-500 py-3 rounded-lg text-xs font-bold uppercase border border-red-500/20 hover:bg-red-500/20 transition-colors"
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                  
                  {/* Admin Mobile Link */}
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      className="w-full text-center bg-amber-500/10 text-amber-500 py-3 rounded-lg font-bold border border-amber-500/20 text-xs uppercase tracking-wider hover:bg-amber-500/20 transition-colors flex items-center justify-center gap-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <ShieldCheck size={14} /> Admin Dashboard
                    </Link>
                  )}
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="w-full text-center bg-blue-600 text-white py-3.5 rounded-lg font-bold text-sm tracking-wider uppercase hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/30"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;