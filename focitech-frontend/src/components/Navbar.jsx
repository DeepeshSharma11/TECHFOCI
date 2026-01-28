import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, LogOut, User as UserIcon, ShieldCheck, ChevronRight
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);

  // Background change on scroll logic
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on navigation
  useEffect(() => { 
    setIsOpen(false); 
  }, [location.pathname]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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
    { name: 'Our Business', path: '/our-business' }
  ];

  return (
    <>
      <nav 
        ref={menuRef}
        className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
          scrolled || isOpen 
            ? 'bg-[#020617] border-b border-white/10 py-3 shadow-2xl' 
            : 'bg-transparent py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            
            {/* --- BRAND LOGO --- */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group relative z-[120]">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600 to-emerald-400 rounded-lg sm:rounded-xl rotate-6 transition-all duration-500 group-hover:rotate-0 group-hover:scale-110 shadow-lg shadow-emerald-500/20"></div>
                
                <div className="relative z-10 w-full h-full p-0.5">
                  <img 
                    src="/Foci-Tech Fav.jpeg" 
                    alt="FociTech Logo" 
                    className="w-full h-full object-cover rounded-md sm:rounded-lg shadow-md transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                    loading="lazy"
                  />
                  <div className="hidden absolute inset-0 items-center justify-center font-black text-white text-base sm:text-xl italic">F</div>
                </div>
                
                <div className="absolute inset-0 border-2 border-white/10 rounded-lg sm:rounded-xl -rotate-3 group-hover:rotate-0 transition-transform duration-500 pointer-events-none"></div>
              </div>

              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-black tracking-tighter uppercase italic leading-none">
                  <span className="text-emerald-500 transition-colors duration-300 group-hover:text-emerald-400">FOCI</span>
                  <span className="text-blue-500">TECH</span>
                </span>
                <span className="text-[6px] sm:text-[7px] font-bold text-slate-500 tracking-[0.3em] sm:tracking-[0.4em] uppercase mt-0.5 sm:mt-1">Innovating Future</span>
              </div>
            </Link>

            {/* --- PC NAVIGATION (Hidden on Mobile) --- */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              <div className="flex gap-1">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    to={link.path} 
                    className={`relative px-3 xl:px-4 py-2 text-xs xl:text-sm font-bold uppercase tracking-widest transition-colors ${
                      location.pathname === link.path ? 'text-blue-400 shadow-blue-500/10' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {link.name}
                    {location.pathname === link.path && (
                      <motion.span 
                        layoutId="nav-line" 
                        className="absolute bottom-0 left-3 xl:left-4 right-3 xl:right-4 h-0.5 bg-blue-500 rounded-full" 
                      />
                    )}
                  </Link>
                ))}
              </div>

              <div className="flex items-center gap-3 xl:gap-4 pl-4 xl:pl-6 border-l border-white/10">
                {user ? (
                  <div className="flex items-center gap-2 xl:gap-3">
                    <Link 
                      to="/profile" 
                      className="p-1.5 xl:p-2 text-slate-400 hover:text-blue-500 transition-colors"
                      aria-label="Profile"
                    >
                      <UserIcon size={18} xl:size={20} />
                    </Link>
                    {isAdmin && (
                      <Link 
                        to="/admin" 
                        className="p-1.5 xl:p-2 text-amber-500 hover:scale-110 transition-all"
                        aria-label="Admin Dashboard"
                      >
                        <ShieldCheck size={16} xl:size={18} />
                      </Link>
                    )}
                    <button 
                      onClick={handleLogout} 
                      className="p-1.5 xl:p-2 text-red-500/80 hover:text-red-500 transition-all"
                      aria-label="Logout"
                    >
                      <LogOut size={16} xl:size={18} />
                    </button>
                  </div>
                ) : (
                  <Link 
                    to="/login" 
                    className="px-4 xl:px-5 py-1.5 xl:py-2 bg-blue-600 text-[9px] xl:text-[10px] font-black tracking-widest text-white rounded hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
                  >
                    SIGN IN
                  </Link>
                )}
              </div>
            </div>

            {/* --- MOBILE TOGGLE BUTTON --- */}
            <div className="flex lg:hidden items-center gap-2 sm:gap-4 relative z-[120]">
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="p-2 text-white bg-white/5 border border-white/10 rounded-lg"
                aria-label={isOpen ? "Close menu" : "Open menu"}
              >
                {isOpen ? <X size={20} sm:size={24} /> : <Menu size={20} sm:size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- MOBILE DRAWER (Fixed z-index issue) --- */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99] lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 right-0 w-full max-w-sm bg-[#020617] border-l border-white/10 z-[100] overflow-y-auto"
            >
              <div className="flex flex-col h-full p-4 sm:p-6 pt-20">
                {/* Close button inside drawer */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 p-2 text-white bg-white/5 border border-white/10 rounded-lg"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>

                {/* Nav Links */}
                <div className="flex flex-col space-y-2 mb-8">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] px-2 mb-2">Menu</p>
                  {navLinks.map((link) => (
                    <Link
                      key={link.name} 
                      to={link.path}
                      className={`flex justify-between items-center p-3 sm:p-4 rounded-xl text-base sm:text-lg font-bold border transition-all ${
                        location.pathname === link.path 
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 border-blue-500/30' 
                          : 'bg-white/5 text-slate-300 hover:bg-white/10 border-white/5'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="flex-1">{link.name}</span>
                      <ChevronRight size={16} sm:size={18} className={location.pathname === link.path ? 'text-white' : 'opacity-30'} />
                    </Link>
                  ))}
                </div>

                {/* Account Controls */}
                <div className="mt-auto pb-4 sm:pb-8 flex flex-col space-y-4">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] px-2 mb-1">Account</p>
                  {user ? (
                    <div className="flex flex-col space-y-3">
                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <Link 
                          to="/profile" 
                          className="flex items-center justify-center gap-2 bg-white/5 py-2.5 sm:py-3 rounded-lg text-xs font-bold uppercase border border-white/10 text-white hover:bg-white/10 transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          <UserIcon size={12} sm:size={14} /> Profile
                        </Link>
                        <button 
                          onClick={() => {
                            handleLogout();
                            setIsOpen(false);
                          }} 
                          className="flex items-center justify-center gap-2 bg-red-500/10 text-red-500 py-2.5 sm:py-3 rounded-lg text-xs font-bold uppercase border border-red-500/20 hover:bg-red-500/20 transition-colors"
                        >
                          <LogOut size={12} sm:size={14} /> Logout
                        </button>
                      </div>
                      {isAdmin && (
                        <Link 
                          to="/admin" 
                          className="w-full text-center bg-amber-500/10 text-amber-500 py-2.5 sm:py-3 rounded-lg font-bold border border-amber-500/20 text-xs uppercase tracking-wider hover:bg-amber-500/20 transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          <ShieldCheck size={12} sm:size={14} className="inline mr-2" /> Admin
                        </Link>
                      )}
                    </div>
                  ) : (
                    <Link 
                      to="/login" 
                      className="w-full text-center bg-blue-600 text-white py-3 sm:py-3.5 rounded-lg font-bold text-xs sm:text-sm tracking-wider uppercase hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/30"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;