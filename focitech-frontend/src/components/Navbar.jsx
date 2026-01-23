import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Search, LayoutDashboard, 
  LogOut, User as UserIcon, ShieldCheck, ChevronRight
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);

  // Handle Scroll Effect for Visibility
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync mobile menu closure on route change
  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  // Lock body scroll when mobile menu is active for better performance
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const onSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/projects?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Team', path: '/team' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-colors duration-300 ${
      scrolled || isOpen 
        ? 'bg-[#020617] border-b border-white/10 py-3 shadow-2xl' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center">
          
          {/* --- LOGO: TechnoviaX Brand --- */}
          <Link to="/" className="flex items-center gap-3 group relative z-[110]">
            <div className="relative w-9 h-9 flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-600 rounded-lg rotate-6 group-hover:rotate-0 transition-transform duration-300"></div>
              <div className="relative z-10 font-black text-white text-lg italic">F</div>
            </div>
            <span className="text-xl font-black tracking-tighter text-white uppercase italic">
              FOCI<span className="text-blue-500">TECH</span>
            </span>
          </Link>

          {/* --- DESKTOP NAVIGATION --- */}
          <div className="hidden lg:flex items-center gap-8">
            <div className="flex gap-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} to={link.path} 
                  className={`relative px-4 py-2 text-sm font-bold uppercase tracking-widest transition-colors ${
                    location.pathname === link.path ? 'text-blue-500' : 'text-slate-400 hover:text-white'
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
              {/* Search Implementation */}
              <div className="relative" ref={searchRef}>
                <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2 text-slate-400 hover:text-white transition-colors">
                  <Search size={18} />
                </button>
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.form 
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                      onSubmit={onSearchSubmit} className="absolute right-0 mt-4 w-64"
                    >
                      <input 
                        autoFocus type="text" placeholder="Search Node..."
                        className="w-full bg-[#0f172a] border border-blue-500/30 rounded-xl px-5 py-2.5 text-xs text-white outline-none"
                        value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>

              {user ? (
                <div className="flex items-center gap-3">
                  {/* PROFILE BUTTON - ADDED TO DESKTOP */}
                  <Link to="/profile" className="p-2 text-slate-400 hover:text-blue-500 transition-colors">
                    <UserIcon size={20} />
                  </Link>
                  {isAdmin && <Link to="/admin" className="p-2 text-amber-500 hover:scale-110 transition"><ShieldCheck size={18} /></Link>}
                  <button onClick={handleLogout} className="p-2 text-red-500/80 hover:text-red-500 transition"><LogOut size={18} /></button>
                </div>
              ) : (
                <Link to="/login" className="px-5 py-2 bg-blue-600 text-[10px] font-black tracking-widest text-white rounded hover:bg-blue-500 transition-all">
                  SIGN IN
                </Link>
              )}
            </div>
          </div>

          {/* --- MOBILE TOGGLE --- */}
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-white relative z-[110]">
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* --- MOBILE OVERLAY (Lag-Free & Solid) --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-[#020617] z-[105] flex flex-col p-8 pt-28 space-y-6"
          >
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] px-2">Navigation Node</p>
            {navLinks.map((link) => (
              <Link
                key={link.name} to={link.path}
                className={`flex justify-between items-center p-4 rounded-xl text-3xl font-black italic tracking-tighter border-b border-white/5 ${
                  location.pathname === link.path ? 'text-blue-500 bg-white/5' : 'text-slate-300'
                }`}
              >
                {link.name}
                <ChevronRight size={20} className={location.pathname === link.path ? 'text-blue-500' : 'opacity-10'} />
              </Link>
            ))}

            <div className="mt-auto pb-10 flex flex-col gap-4">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] px-2">Account Node</p>
              {user ? (
                <div className="grid grid-cols-2 gap-3">
                  {/* PROFILE BUTTON FOR MOBILE */}
                  <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 bg-white/5 py-4 rounded-xl text-[10px] font-black uppercase border border-white/10 text-white">
                    <UserIcon size={16} /> Profile
                  </Link>
                  <button onClick={handleLogout} className="flex items-center justify-center gap-2 bg-red-500/10 text-red-500 py-4 rounded-xl text-[10px] font-black uppercase border border-red-500/20">
                    <LogOut size={16} /> Logout
                  </button>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setIsOpen(false)} className="col-span-2 flex items-center justify-center gap-2 bg-amber-500/10 py-4 rounded-xl font-bold border border-amber-500/20 text-[10px] uppercase tracking-widest text-amber-500">
                      <ShieldCheck size={16} /> Admin Command Center
                    </Link>
                  )}
                </div>
              ) : (
                <Link to="/login" className="w-full text-center bg-blue-600 text-white py-5 rounded-xl font-black text-xs tracking-[0.2em] uppercase">
                  Access System
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