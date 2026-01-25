import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Search, LogOut, User as UserIcon, ShieldCheck, ChevronRight
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);

  // Background change on scroll logic
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on navigation
  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  // Prevent background scroll when mobile menu is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
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
    // { name: 'Feedback', path: '/feedback' }
    
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
            <div className="relative w-9 h-9 flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-600 rounded-lg rotate-6 transition-transform duration-300 group-hover:rotate-0"></div>
              <div className="relative z-10 font-black text-white text-lg italic">F</div>
            </div>
            <span className="text-xl font-black tracking-tighter text-white uppercase italic">
              FOCI<span className="text-blue-500">TECH</span>
            </span>
          </Link>

          {/* --- PC NAVIGATION (Hidden on Mobile) --- */}
          <div className="hidden lg:flex items-center gap-8">
            <div className="flex gap-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} to={link.path} 
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
                  {isAdmin && <Link to="/admin" className="p-2 text-amber-500 hover:scale-110 transition-all"><ShieldCheck size={18} /></Link>}
                  <button onClick={handleLogout} className="p-2 text-red-500/80 hover:text-red-500 transition-all"><LogOut size={18} /></button>
                </div>
              ) : (
                <Link to="/login" className="px-5 py-2 bg-blue-600 text-[10px] font-black tracking-widest text-white rounded hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">
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

      {/* --- MOBILE DRAWER (Scrollable & No Overlap) --- */}
     {/* --- MOBILE DRAWER (Scrollable & No Overlap) --- */}
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
            {isAdmin && (
              <Link 
                to="/admin" 
                className="w-full text-center bg-amber-500/10 text-amber-500 py-3 rounded-lg font-bold border border-amber-500/20 text-xs uppercase tracking-wider hover:bg-amber-500/20 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <ShieldCheck size={14} className="inline mr-2" /> Admin
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