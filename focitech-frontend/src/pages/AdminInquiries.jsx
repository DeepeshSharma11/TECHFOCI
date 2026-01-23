import { useEffect, useState, useCallback, useMemo } from 'react';
import api from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Calendar, Trash2, CheckCircle, 
  Search, RefreshCw, AlertCircle, Inbox, 
  Download, MessageSquare, Tag, ArrowRight,
  Clock, ShieldCheck
} from 'lucide-react';

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // 1. Decrypting Leads from TechnoviaX Node
  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/contact/');
      setInquiries(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError("TechnoviaX Node unreachable. Ensure FastAPI and Supabase are synced.");
    } finally {
      setTimeout(() => setLoading(false), 600);
    }
  }, []);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  // 2. High-Performance Filter Logic
  const filteredInquiries = useMemo(() => {
    return inquiries.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subject?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [inquiries, searchTerm, filterStatus]);

  // 3. Status Update & Purge Protocols
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      // Endpoint matches your FastAPI PUT /contact/{id} route
      await api.put(`/contact/${id}`, { status: newStatus });
      setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
    } catch (err) {
      console.error("Transmission failed", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("System Alert: Permanently erase this lead from Focitech cloud?")) {
      try {
        await api.delete(`/contact/${id}`);
        setInquiries(prev => prev.filter(inq => inq.id !== id));
      } catch (err) {
        alert("Critical failure: Record could not be purged.");
      }
    }
  };

  const exportToCSV = () => {
    const headers = ["Name,Email,Subject,Message,Status,Date\n"];
    const rows = filteredInquiries.map(i => `${i.name},${i.email},"${i.subject}","${i.message}",${i.status},${i.created_at}\n`);
    const blob = new Blob([headers + rows.join("")], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `technoviax_leads_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading && inquiries.length === 0) return (
    <div className="min-h-screen bg-[#020617] flex flex-col justify-center items-center">
      <div className="relative">
        <RefreshCw className="text-blue-500 animate-spin w-20 h-20" strokeWidth={1} />
        <div className="absolute inset-0 bg-blue-500/10 blur-2xl animate-pulse"></div>
      </div>
      <p className="mt-10 text-slate-500 font-black tracking-[0.8em] text-[10px] uppercase animate-pulse">
        Syncing Command Center
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] pt-24 pb-20 px-6 lg:px-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[140px] -z-10" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* --- CRM HEADER --- */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-4 leading-none">
              Client <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">Leads</span>
            </h1>
            <div className="flex items-center gap-4">
              <span className="px-4 py-1.5 bg-blue-600/10 border border-blue-500/20 rounded-full text-[10px] font-black text-blue-400 tracking-widest uppercase">
                {inquiries.length} Active Nodes
              </span>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest italic">TechnoviaX L-3 Access</p>
            </div>
          </motion.div>

          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            <div className="relative flex-grow lg:flex-grow-0 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search name, email or subject..."
                className="w-full lg:w-80 bg-slate-900/50 border border-white/5 rounded-2xl pl-14 pr-6 py-5 text-sm text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all backdrop-blur-3xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button onClick={exportToCSV} className="p-5 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all border border-white/5 shadow-xl" title="Export CSV">
              <Download size={22} />
            </button>
            <button onClick={fetchInquiries} className="p-5 bg-blue-600/20 text-blue-400 rounded-2xl hover:bg-blue-600 hover:text-white transition-all border border-blue-500/20 shadow-xl shadow-blue-600/10">
              <RefreshCw size={22} />
            </button>
          </div>
        </div>

        {/* --- FILTER NODES --- */}
        <div className="flex gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          {['all', 'pending', 'resolved'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
                filterStatus === status 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30 ring-2 ring-blue-400/20' 
                : 'bg-slate-900/80 text-slate-500 hover:bg-white/5 border border-white/5'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* --- DATA INFRASTRUCTURE --- */}
        <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[3.5rem] overflow-hidden shadow-2xl relative">
          {error && (
            <div className="bg-red-500/10 border-b border-red-500/20 p-6 flex items-center gap-4 text-red-400 text-sm font-bold">
              <ShieldAlert size={20} /> {error}
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-slate-500 text-[11px] font-black uppercase tracking-[0.3em]">
                  <th className="px-12 py-8">Lead Identity</th>
                  <th className="px-12 py-8">Topic & Brief</th>
                  <th className="px-12 py-8">Deployment</th>
                  <th className="px-12 py-8">Status</th>
                  <th className="px-12 py-8 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <AnimatePresence mode="popLayout">
                  {filteredInquiries.map((item, idx) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, delay: idx * 0.04 }}
                      key={item.id} 
                      className="hover:bg-blue-600/[0.03] transition-colors group"
                    >
                      <td className="px-12 py-10">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center text-white font-black text-2xl shadow-lg border border-white/10 group-hover:scale-110 transition-transform">
                            {item.name[0]}
                          </div>
                          <div>
                            <p className="text-white font-black text-xl tracking-tight leading-none mb-2">{item.name}</p>
                            <p className="text-slate-500 text-xs font-bold tracking-tight">{item.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-12 py-10">
                        <div className="max-w-xs">
                          <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Tag size={12} /> {item.subject || 'Project Inquiry'}
                          </p>
                          <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 italic font-medium group-hover:text-slate-200 transition-colors">
                            "{item.message}"
                          </p>
                        </div>
                      </td>
                      <td className="px-12 py-10">
                        <div className="flex flex-col gap-1.5">
                           <div className="flex items-center gap-2 text-slate-300 text-[11px] font-black">
                             <Clock size={14} className="text-blue-500" />
                             {new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                           </div>
                           <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.2em] ml-5">Logged</p>
                        </div>
                      </td>
                      <td className="px-12 py-10">
                        <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                          item.status === 'pending' 
                            ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
                            : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-12 py-10">
                        <div className="flex justify-center gap-4">
                          {item.status === 'pending' && (
                            <button 
                              onClick={() => handleUpdateStatus(item.id, 'resolved')}
                              className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all shadow-xl hover:shadow-emerald-500/20 border border-emerald-500/10"
                            >
                              <CheckCircle size={22} />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="p-4 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all border border-red-500/20 shadow-xl hover:shadow-red-500/20"
                          >
                            <Trash2 size={22} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            
            {filteredInquiries.length === 0 && (
              <div className="py-40 text-center">
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                   <Inbox size={100} className="mx-auto text-slate-800 mb-8" strokeWidth={0.5} />
                   <h3 className="text-2xl font-black text-slate-600 uppercase tracking-[0.4em]">Inquiry Node Empty</h3>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* --- BRAND FOOTER --- */}
      <div className="mt-20 flex flex-col items-center gap-4">
        <div className="flex items-center gap-3 text-slate-800">
           <ShieldCheck size={16} />
           <p className="text-[10px] uppercase tracking-[0.6em] font-black">
             TechnoviaX Security Protocol | Bareilly-Node
           </p>
        </div>
      </div>
    </div>
  );
};

export default AdminInquiries;