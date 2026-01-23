import { Laptop, Facebook, Twitter, Linkedin, Mail, ArrowRight, Instagram, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#020617] text-slate-400 pt-24 pb-12 relative overflow-hidden border-t border-white/5">
      {/* Background Ambience */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-blue-600/5 blur-[120px] -z-10"></div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          {/* Brand Identity */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:rotate-6 transition-transform">
                <Laptop className="text-white" size={20} />
              </div>
              <span className="text-2xl font-black text-white italic tracking-tighter">FOCI<span className="text-blue-500">TECH</span></span>
            </Link>
            <p className="text-sm leading-relaxed font-medium">
              Architecting high-performance digital solutions. We transform complex ideas into scalable enterprise-grade software.
            </p>
            <div className="flex gap-4">
              {[
                { icon: <Facebook size={18} />, link: "#" },
                { icon: <Twitter size={18} />, link: "#" },
                { icon: <Linkedin size={18} />, link: "#" },
                { icon: <Instagram size={18} />, link: "#" }
              ].map((social, i) => (
                <a key={i} href={social.link} className="p-2.5 bg-white/5 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300">
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-8">Navigation</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link to="/projects" className="hover:text-blue-500 transition-colors">Portfolio</Link></li>
              <li><Link to="/team" className="hover:text-blue-500 transition-colors">Innovators</Link></li>
              <li><Link to="/services" className="hover:text-blue-500 transition-colors">Solutions</Link></li>
              <li><Link to="/contact" className="hover:text-blue-500 transition-colors">Get in Touch</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-8">Headquarters</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex items-start gap-3">
                <Mail className="text-blue-500 shrink-0" size={18} />
                <span>info@focitech.in</span>
              </li>
              <li className="flex items-start gap-3">
                <Globe className="text-indigo-500 shrink-0" size={18} />
                <span>Bareilly, Uttar Pradesh,<br /> India - 243001</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div>
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-8">Stay Synced</h4>
            <p className="text-xs mb-6 font-medium">Join our network for latest tech insights and project updates.</p>
            <form className="relative group">
              <input 
                type="email" 
                placeholder="operator@focitech.in" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600" 
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 p-2 rounded-xl transition-all shadow-lg shadow-blue-600/20">
                <ArrowRight size={16} className="text-white" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em]">
            <span className="text-slate-600">Powered by</span>
            <span className="text-blue-500">TechnoviaX Engine</span>
          </div>
          
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            © {currentYear} Focitech Pvt. Ltd. | All Systems Operational
          </p>

          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;