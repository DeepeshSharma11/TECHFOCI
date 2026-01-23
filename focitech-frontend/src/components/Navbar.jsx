import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Using our advance context
import { 
  Menu, X, Search, LayoutDashboard, 
  LogOut, User as UserIcon, ShieldCheck
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

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close search on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setIsSearchOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        ? 'bg-[#0f172a]/90 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-600 rounded-xl rotate-6 group-hover:rotate-0 transition-transform duration-300 shadow-lg shadow-blue-500/30"></div>
              <div className="relative z-10 font-black text-white text-xl">F</div>
            </div>
            <span className="text-xl font-bold tracking-tight text-white uppercase italic">
              Foci<span className="text-blue-500">Tech</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <div className="flex gap-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                    location.pathname === link.path ? 'text-blue-400' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-500 rounded-full animate-in fade-in zoom-in"></span>
                  )}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pl-6 border-l border-white/10">
              {/* Search Toggle */}
              <div className="relative" ref={searchRef}>
                <button 
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                  <Search size={20} />
                </button>
                {isSearchOpen && (
                  <form onSubmit={onSearchSubmit} className="absolute right-0 mt-4 w-64 animate-in fade-in slide-in-from-top-2">
                    <input 
                      autoFocus
                      type="text"
                      placeholder="Search Focitech..."
                      className="w-full bg-[#1e293b] border border-blue-500/30 rounded-full px-5 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none shadow-2xl shadow-black/50"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </form>
                )}
              </div>

              {/* User Section */}
              {user ? (
                <div className="flex items-center gap-2">
                  <Link to="/profile" className="p-2 text-slate-300 hover:text-blue-400 transition" title="Profile">
                    <UserIcon size={20} />
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="p-2 text-amber-400 hover:scale-110 transition" title="Admin Access">
                      <ShieldCheck size={20} />
                    </Link>
                  )}
                  <button onClick={handleLogout} className="p-2 text-red-400 hover:text-red-300 transition" title="Sign Out">
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-full transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                  GET STARTED
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-white">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 top-[70px] bg-[#0f172a] p-8 space-y-8 animate-in slide-in-from-right duration-300">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="block text-3xl font-bold text-slate-200 active:text-blue-500"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-8 border-t border-white/10 flex flex-col gap-6">
            {user ? (
              <>
                <Link to="/profile" onClick={() => setIsOpen(false)} className="text-xl text-slate-300">My Profile</Link>
                {isAdmin && <Link to="/admin" onClick={() => setIsOpen(false)} className="text-xl text-amber-400">Admin Dashboard</Link>}
                <button onClick={handleLogout} className="text-left text-xl text-red-400">Logout</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)} className="text-2xl text-blue-500 font-bold">Sign In</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;