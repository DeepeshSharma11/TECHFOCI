import { useEffect, useState, useMemo } from 'react';
import api from '../api/client'; 
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ExternalLink, Github, Layers, AlertCircle, 
  Code2, Filter, Search, ArrowRight, Sparkles 
} from 'lucide-react';


const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Optimized Data Fetching
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/portfolio/');
        setProjects(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError("Our neural network couldn't fetch the portfolio. Please check the backend connection.");
      } finally {
        // Subtle delay for premium loader feel
        setTimeout(() => setLoading(false), 600);
      }
    };
    fetchProjects();
  }, []);

  // 2. High-Performance Filter Logic (using useMemo)
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesFilter = activeFilter === 'All' || p.tech_stack.includes(activeFilter);
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.tech_stack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  }, [projects, activeFilter, searchQuery]);

  const categories = ['All', 'React', 'FastAPI', 'Next.js', 'Python', 'Supabase', 'Node.js'];

  // --- LOADING / SKELETON STATE ---
  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex flex-col justify-center items-center">
      <div className="relative">
        <div className="h-24 w-24 border-t-4 border-blue-600 rounded-full animate-spin"></div>
        <Layers className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 animate-pulse" size={30} />
      </div>
      <p className="mt-8 text-slate-500 font-black tracking-[0.5em] text-[10px] uppercase">Retrieving Projects</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] py-32 px-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header & Search Infrastructure */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20 gap-10">
          <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6">
              <Sparkles size={12} /> TechnoviaX Ecosystem
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-none">
              Selected <span className="text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-blue-700">Artifacts</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium max-w-xl">
              Exploring the intersection of performance and aesthetics through custom-engineered software.
            </p>
          </motion.div>
          
          <div className="relative w-full lg:w-[400px] group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="text"
              placeholder="Filter by tech or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/50 border border-white/5 rounded-[2rem] pl-16 pr-8 py-5 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all backdrop-blur-3xl"
            />
          </div>
        </div>

        {/* Categories / Filter Chips */}
        <div className="flex flex-wrap gap-3 mb-24">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-8 py-3 rounded-full font-black text-[10px] tracking-widest uppercase transition-all duration-300 border ${
                activeFilter === cat 
                ? 'bg-blue-600 border-blue-500 text-white shadow-2xl shadow-blue-600/30 scale-105' 
                : 'bg-slate-900/50 border-white/5 text-slate-500 hover:text-white hover:border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Project Grid with AnimatePresence */}
        {filteredProjects.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-40 bg-slate-900/20 border border-dashed border-white/10 rounded-[4rem]">
            <Code2 className="w-16 h-16 text-slate-800 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-slate-500 tracking-wide">No projects found matching these parameters.</h3>
          </motion.div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence mode='popLayout'>
              {filteredProjects.map((project) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={project.id}
                  className="group relative h-full bg-slate-900/40 border border-white/5 rounded-[3.5rem] p-8 hover:bg-slate-900/60 transition-all duration-500"
                >
                  {/* Image Container with Hover Effects */}
                  <div className="relative h-60 rounded-[2.5rem] overflow-hidden mb-8 shadow-2xl">
                    <img 
                      src={project.image_url || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000'} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>
                    
                    {/* Floating Tech Badge */}
                    <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-[10px] font-black text-white">
                      {project.tech_stack[0]}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-3xl font-black text-white group-hover:text-blue-500 transition-colors tracking-tight">
                      {project.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 font-medium">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 pt-2">
                      {project.tech_stack.slice(0, 3).map(tech => (
                        <span key={tech} className="text-[9px] font-black text-blue-400 bg-blue-500/5 px-3 py-1.5 rounded-lg uppercase tracking-tighter border border-blue-500/10">
                          {tech}
                        </span>
                      ))}
                      {project.tech_stack.length > 3 && <span className="text-[9px] font-black text-slate-500 pt-1.5">+{project.tech_stack.length - 3}</span>}
                    </div>

                    <div className="flex gap-4 pt-6">
                      <a href={project.live_url} target="_blank" rel="noreferrer" className="flex-1 bg-white text-blue-600 py-4 rounded-2xl font-black text-[10px] tracking-widest text-center hover:bg-blue-50 transition active:scale-95 flex items-center justify-center gap-2">
                        LIVE DEMO <ExternalLink size={14} />
                      </a>
                      <a href={project.github_url} target="_blank" rel="noreferrer" className="p-4 bg-slate-800 rounded-2xl text-slate-400 hover:text-white border border-white/5 transition-colors">
                        <Github size={20} />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Decorative Footer Label */}
      <p className="text-center text-slate-800 text-[10px] mt-24 uppercase tracking-[0.5em] font-black">
        Portfolio Infrastructure Node 01 | Secure Connection
      </p>
    </div>
  );
};

export default Projects;