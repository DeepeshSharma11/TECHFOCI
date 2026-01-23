import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion'; // For smooth mobile transitions
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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
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
      setIsOpen(false); // Close mobile menu if open
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
      scrolled || isOpen
        ? 'bg-[#020617]/95 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center">
          
          {/* --- LOGO --- */}
          <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 group relative z-[110]">
            <div className="relative w-9 h-9 flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-600 rounded-lg rotate-6 group-hover:rotate-0 transition-transform duration-300"></div>
              <div className="relative z-10 font-black text-white text-lg italic">F</div>
            </div>
            <span className="text-xl font-black tracking-tighter text-white uppercase italic">
              Foci<span className="text-blue-500">Tech</span>
            </span>
          </Link>

          {/* --- DESKTOP NAV --- */}
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
                    <motion.span layoutId="underline" className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-500 rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4 pl-6 border-l border-white/10">
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
                        autoFocus type="text" placeholder="Search projects..."
                        className="w-full bg-slate-900 border border-blue-500/30 rounded-2xl px-5 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none shadow-2xl"
                        value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>

              {user ? (
                <div className="flex items-center gap-2">
                  <Link to="/profile" className="p-2 text-slate-400 hover:text-blue-400 transition"><UserIcon size={19} /></Link>
                  {isAdmin && <Link to="/admin" className="p-2 text-amber-500 hover:scale-110 transition"><ShieldCheck size={19} /></Link>}
                  <button onClick={handleLogout} className="p-2 text-red-500/70 hover:text-red-500 transition"><LogOut size={19} /></button>
                </div>
              ) : (
                <Link to="/login" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black tracking-widest rounded-full transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                  GET STARTED
                </Link>
              )}
            </div>
          </div>

          {/* --- MOBILE TOGGLE --- */}
          <div className="flex lg:hidden items-center gap-4 relative z-[110]">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-white bg-white/5 rounded-xl border border-white/10">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE DRAWER (UPDATED) --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden fixed inset-0 top-0 bg-[#020617] z-[105] flex flex-col p-8 pt-28 space-y-8"
          >
            {/* Mobile Search */}
            <form onSubmit={onSearchSubmit} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" placeholder="Search anything..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white outline-none focus:border-blue-500"
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Navigation</p>
              {navLinks.map((link) => (
                <Link
                  key={link.name} to={link.path} onClick={() => setIsOpen(false)}
                  className={`flex justify-between items-center text-2xl font-black italic tracking-tighter p-4 rounded-2xl ${
                    location.pathname === link.path ? 'bg-blue-600 text-white' : 'text-slate-300 bg-white/5'
                  }`}
                >
                  {link.name}
                  <ChevronRight size={20} className={location.pathname === link.path ? 'opacity-100' : 'opacity-20'} />
                </Link>
              ))}
            </div>

            <div className="mt-auto pb-10 space-y-4">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Account Node</p>
              {user ? (
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 bg-white/5 py-4 rounded-2xl text-sm font-bold border border-white/10">
                    <UserIcon size={18} /> Profile
                  </Link>
                  <button onClick={handleLogout} className="flex items-center justify-center gap-2 bg-red-500/10 py-4 rounded-2xl text-sm font-bold text-red-500 border border-red-500/20">
                    <LogOut size={18} /> Logout
                  </button>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setIsOpen(false)} className="col-span-2 flex items-center justify-center gap-2 bg-amber-500/10 py-4 rounded-2xl text-sm font-bold text-amber-500 border border-amber-500/20">
                      <ShieldCheck size={18} /> Admin Command Center
                    </Link>
                  )}
                </div>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full text-center bg-blue-600 py-5 rounded-2xl font-black text-sm tracking-widest">
                  SIGN IN TO FOCITECH
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