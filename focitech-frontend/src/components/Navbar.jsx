import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Search, LogOut, User as UserIcon, ShieldCheck, ChevronRight
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

  // Changes background color when you scroll down
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Closes the menu automatically when you click a link
  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  // Stops the background from moving when the menu is open
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
          
          {/* --- LOGO --- */}
          <Link to="/" className="flex items-center gap-3 group relative z-[110]">
            <div className="relative w-9 h-9 flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-600 rounded-lg rotate-6 transition-transform duration-300 group-hover:rotate-0"></div>
              <div className="relative z-10 font-black text-white text-lg italic">F</div>
            </div>
            <span className="text-xl font-black tracking-tighter text-white uppercase italic">
              FOCI<span className="text-blue-500">TECH</span>
            </span>
          </Link>

          {/* --- PC MENU --- */}
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
              {user ? (
                <div className="flex items-center gap-3">
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

          {/* --- MOBILE BUTTON --- */}
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-white relative z-[110]">
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* --- MOBILE MENU (WORKS ON ALL SCREENS) --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-[#020617] z-[105] flex flex-col p-8 pt-24 overflow-y-auto"
          >
            {/* Links Section */}
            <div className="flex flex-col space-y-4 mb-8">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] px-2">Navigation</p>
              {navLinks.map((link) => (
                <Link
                  key={link.name} to={link.path}
                  className={`flex justify-between items-center p-4 rounded-xl text-3xl font-black italic tracking-tighter border-b border-white/5 transition-all ${
                    location.pathname === link.path ? 'text-blue-500 bg-white/5' : 'text-slate-300'
                  }`}
                >
                  {link.name}
                  <ChevronRight size={20} className={location.pathname === link.path ? 'text-blue-500' : 'opacity-10'} />
                </Link>
              ))}
            </div>

            {/* Account Section */}
            <div className="mt-auto pt-8 pb-10 flex flex-col space-y-6">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] px-2">Account Control</p>
              {user ? (
                <div className="flex flex-col space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Link to="/profile" className="flex items-center justify-center gap-2 bg-white/5 py-4 rounded-xl text-[11px] font-black uppercase border border-white/10 text-white">
                      <UserIcon size={16} /> Profile
                    </Link>
                    <button onClick={handleLogout} className="flex items-center justify-center gap-2 bg-red-500/10 text-red-500 py-4 rounded-xl text-[11px] font-black uppercase border border-red-500/20">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                  {isAdmin && (
                    <Link to="/admin" className="w-full text-center bg-amber-500/10 text-amber-500 py-4 rounded-xl font-bold border border-amber-500/20 text-[11px] uppercase tracking-widest">
                      <ShieldCheck size={16} className="inline mr-2" /> Admin Dashboard
                    </Link>
                  )}
                </div>
              ) : (
                <Link to="/login" className="w-full text-center bg-blue-600 text-white py-5 rounded-xl font-black text-xs tracking-[0.2em] uppercase shadow-xl shadow-blue-600/30">
                  Log In
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