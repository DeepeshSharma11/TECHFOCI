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

  // Handle Scroll Effect for Glassmorphism
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
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
      setIsOpen(false);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const onSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/projects?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setIsOpen(false);
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
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
      scrolled 
        ? 'bg-[#020617]/90 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center">
          
          {/* --- LOGO SECTION --- */}
          <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 group relative z-[110]">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-600 rounded-xl rotate-6 group-hover:rotate-0 transition-transform duration-300 shadow-lg shadow-blue-500/30"></div>
              <div className="relative z-10 font-black text-white text-xl italic">F</div>
            </div>
            <span className="text-xl font-bold tracking-tighter text-white uppercase italic">
              FOCI<span className="text-blue-500">TECH</span>
            </span>
          </Link>

          {/* --- DESKTOP NAVIGATION --- */}
          <div className="hidden lg:flex items-center gap-8">
            <div className="flex gap-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  className={`relative px-4 py-2 text-sm font-bold transition-all duration-300 ${
                    location.pathname === link.path ? 'text-blue-400' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <motion.span layoutId="nav-underline" className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-500 rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4 pl-6 border-l border-white/10">
              {/* Desktop Search */}
              <div className="relative" ref={searchRef}>
                <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2 text-slate-400 hover:text-white transition-colors">
                  <Search size={20} />
                </button>
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.form 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                      onSubmit={onSearchSubmit} className="absolute right-0 mt-4 w-64"
                    >
                      <input 
                        autoFocus type="text" placeholder="Search Focitech..."
                        className="w-full bg-[#1e293b] border border-blue-500/30 rounded-2xl px-5 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none shadow-2xl"
                        value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>

              {user ? (
                <div className="flex items-center gap-2">
                  <Link to="/profile" className="p-2 text-slate-300 hover:text-blue-400 transition" title="Profile"><UserIcon size={20} /></Link>
                  {isAdmin && <Link to="/admin" className="p-2 text-amber-400 hover:scale-110 transition" title="Admin Control"><ShieldCheck size={20} /></Link>}
                  <button onClick={handleLogout} className="p-2 text-red-500/70 hover:text-red-500 transition"><LogOut size={20} /></button>
                </div>
              ) : (
                <Link to="/login" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black tracking-widest rounded-full transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                  GET STARTED
                </Link>
              )}
            </div>
          </div>

          {/* --- MOBILE TOGGLE --- */}
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-white relative z-[110] bg-white/5 rounded-xl border border-white/10">
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* --- MOBILE MENU DRAWER (FULLY UPDATED) --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden fixed inset-0 bg-[#020617] z-[105] flex flex-col p-8 pt-28 space-y-8 h-screen"
          >
            {/* Background Decorative Glow */}
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -z-10"></div>
            
            {/* Mobile Search Input */}
            <form onSubmit={onSearchSubmit} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" placeholder="Search anything..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white outline-none focus:border-blue-500 transition-all"
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            {/* Navigation Links */}
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2 px-2">Main Menu</p>
              {navLinks.map((link) => (
                <Link
                  key={link.name} to={link.path} onClick={() => setIsOpen(false)}
                  className={`flex justify-between items-center p-4 rounded-2xl text-2xl font-black italic tracking-tighter transition-all ${
                    location.pathname === link.path ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-300 bg-white/5 border border-white/5'
                  }`}
                >
                  {link.name}
                  <ChevronRight size={20} className={location.pathname === link.path ? 'opacity-100' : 'opacity-20'} />
                </Link>
              ))}
            </div>

            {/* Account Management Node */}
            <div className="mt-auto pb-10 space-y-4">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] px-2">Account Node</p>
              {user ? (
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 bg-white/5 py-4 rounded-2xl text-sm font-bold border border-white/10 text-white">
                    <UserIcon size={18} /> Profile
                  </Link>
                  <button onClick={handleLogout} className="flex items-center justify-center gap-2 bg-red-500/10 py-4 rounded-2xl text-sm font-bold text-red-500 border border-red-500/20">
                    <LogOut size={18} /> Logout
                  </button>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setIsOpen(false)} className="col-span-2 flex items-center justify-center gap-2 bg-amber-500/10 py-4 rounded-2xl text-sm font-bold text-amber-500 border border-amber-500/20 uppercase tracking-widest">
                      <ShieldCheck size={18} /> Admin Panel
                    </Link>
                  )}
                </div>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full text-center bg-blue-600 py-5 rounded-2xl font-black text-sm tracking-widest text-white shadow-xl shadow-blue-600/20">
                  SIGN IN TO SYSTEM
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