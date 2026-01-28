import { Youtube, Mail, ArrowRight, Instagram, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }
    
    console.log('Newsletter subscription:', email);
    alert('Thank you for subscribing!');
    e.target.reset();
  };

  return (
    <footer className="bg-[#020617] text-slate-400 pt-12 sm:pt-16 md:pt-20 lg:pt-24 pb-6 sm:pb-8 md:pb-12 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12 lg:gap-16 mb-8 sm:mb-12 md:mb-16 lg:mb-20">
          
          {/* Company Info */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group w-fit">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600 to-emerald-400 rounded-lg sm:rounded-xl rotate-6 transition-all duration-500 group-hover:rotate-0 group-hover:scale-110 shadow-lg shadow-emerald-500/20"></div>
                
                <div className="relative z-10 w-full h-full p-0.5 sm:p-1 flex items-center justify-center">
                  <img 
                    src="/Foci-Tech Fav.jpeg" 
                    alt="FociTech Logo" 
                    className="w-full h-full object-cover rounded-md sm:rounded-lg shadow-sm transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      // Fallback logic
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                    loading="lazy"
                  />
                  {/* Fallback styled "F" if image fails to load */}
                  <div className="hidden absolute inset-0 items-center justify-center font-black text-white text-base sm:text-xl italic">F</div>
                </div>
                
                {/* Decorative Ring */}
                <div className="absolute inset-0 border-2 border-white/10 rounded-lg sm:rounded-xl -rotate-3 group-hover:rotate-0 transition-transform duration-500 pointer-events-none"></div>
              </div>

              {/* BRAND TEXT */}
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-tighter uppercase italic leading-none">
                  <span className="text-emerald-500 transition-colors duration-300 group-hover:text-emerald-400">FOCI</span>
                  <span className="text-blue-500">TECH</span>
                </span>
                <span className="text-[6px] sm:text-[7px] font-bold text-slate-500 tracking-[0.3em] sm:tracking-[0.4em] uppercase mt-0.5 sm:mt-1">Innovating Future</span>
              </div>
            </Link>
            
            <p className="text-xs sm:text-sm leading-relaxed font-medium text-slate-400 max-w-xs">
              We create powerful digital solutions for businesses. We help turn ideas into working software.
            </p>
            
            <div className="flex gap-2 sm:gap-3 pt-1 sm:pt-2">
              <a
                href="https://youtube.com/@thefocitech?feature=shared"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 sm:p-2.5 bg-white/5 rounded-lg sm:rounded-xl hover:bg-sky-500 hover:text-white transition-all duration-300 hover:scale-110"
                aria-label="Visit our Youtube page"
              >
                <Youtube size={16} className="sm:size-[18px]" />
              </a>
              <a
                href="https://www.instagram.com/thefocitech?igsh=azA5ZjM5ZHAyOXEz"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 sm:p-2.5 bg-white/5 rounded-lg sm:rounded-xl hover:bg-pink-600 hover:text-white transition-all duration-300 hover:scale-110"
                aria-label="Visit our Instagram page"
              >
                <Instagram size={16} className="sm:size-[18px]" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold uppercase text-xs mb-4 sm:mb-6 md:mb-8">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-3 md:space-y-4">
              <li>
                <Link 
                  to="/" 
                  className="text-xs sm:text-sm font-medium hover:text-blue-500 transition-colors duration-300 inline-block py-1"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/projects" 
                  className="text-xs sm:text-sm font-medium hover:text-blue-500 transition-colors duration-300 inline-block py-1"
                >
                  Our Work
                </Link>
              </li>
              <li>
                <Link 
                  to="/team" 
                  className="text-xs sm:text-sm font-medium hover:text-blue-500 transition-colors duration-300 inline-block py-1"
                >
                  Our Team
                </Link>
              </li>
              <li>
                <Link 
                  to="/our-business" 
                  className="text-xs sm:text-sm font-medium hover:text-blue-500 transition-colors duration-300 inline-block py-1"
                >
                  Our Businesses
                </Link>
              </li>
              <li>
                <Link 
                  to="/careers" 
                  className="text-xs sm:text-sm font-medium hover:text-blue-500 transition-colors duration-300 inline-block py-1"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h4 className="text-white font-bold uppercase text-xs mb-4 sm:mb-6 md:mb-8">More</h4>
            <ul className="space-y-2 sm:space-y-3 md:space-y-4">
              <li>
                <Link 
                  to="/services" 
                  className="text-xs sm:text-sm font-medium hover:text-blue-500 transition-colors duration-300 inline-block py-1"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-xs sm:text-sm font-medium hover:text-blue-500 transition-colors duration-300 inline-block py-1"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <a 
                  href="https://focistore.site" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm font-medium hover:text-blue-500 transition-colors duration-300 inline-block py-1"
                >
                  Focistore
                </a>
              </li>
              <li>
                <a 
                  href="https://focifinance.site" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm font-medium hover:text-blue-500 transition-colors duration-300 inline-block py-1"
                >
                  Focifinance
                </a>
              </li>
              <li>
                <a 
                  href="/Feedback" 
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm font-medium hover:text-blue-500 transition-colors duration-300 inline-block py-1"
                >
                  Feedback
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="text-white font-bold uppercase text-xs mb-4 sm:mb-6 md:mb-8">Stay Updated</h4>
            <div className="space-y-2 sm:space-y-3 md:space-y-4 mb-4 sm:mb-6">
              <div className="flex items-start gap-2 sm:gap-3">
                <Mail className="text-blue-500 shrink-0 mt-0.5 sm:mt-1 sm:size-[18px]" size={16} />
                <div>
                  <span className="text-xs sm:text-sm font-medium block">Email</span>
                  <a 
                    href="mailto:info@focitech.in" 
                    className="text-xs sm:text-sm hover:text-blue-500 transition-colors duration-300 break-words"
                  >
                    Thefocitech@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <Globe className="text-indigo-500 shrink-0 mt-0.5 sm:mt-1 sm:size-[18px]" size={16} />
                <div>
                  <span className="text-xs sm:text-sm font-medium block">Location</span>
                  <span className="text-xs sm:text-sm">
                    Bareilly, Uttar Pradesh<br />India - 243122
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm md:text-xs mb-3 sm:mb-4 font-medium text-slate-400">
              Get updates about our latest projects.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="relative">
              <input 
                type="email" 
                name="email"
                required
                placeholder="your.email@example.com" 
                className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 md:py-4 text-xs sm:text-sm md:text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 placeholder:text-slate-600"
                aria-label="Your email for newsletter"
              />
              <button 
                type="submit"
                className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40"
                aria-label="Subscribe"
              >
                <ArrowRight size={14} className="sm:size-[16px] text-white" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-6 sm:pt-8 md:pt-12 border-t border-white/5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 md:gap-6">
            <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">
              <span className="text-slate-600">Made with</span>
              <span className="text-blue-500">❤️ by Focitech</span>
            </div>
            
            <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">
              © {currentYear} Focitech. All rights reserved.
            </p>

            <div className="hidden sm:flex gap-4 sm:gap-6 md:gap-8 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">
              <Link 
                to="/Privacy" 
                className="hover:text-white transition-colors duration-300"
              >
                Privacy
              </Link>
              <Link 
                to="/terms" 
                className="hover:text-white transition-colors duration-300"
              >
                Terms
              </Link>
            </div>
          </div>

          {/* Mobile Extra Links */}
          <div className="sm:hidden flex flex-wrap justify-center gap-3 sm:gap-4 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/5">
            <Link 
              to="/privacy" 
              className="text-xs text-slate-500 hover:text-white transition-colors"
            >
              Privacy
            </Link>
            <Link 
              to="/terms" 
              className="text-xs text-slate-500 hover:text-white transition-colors"
            >
              Terms
            </Link>
            <a 
              href="https://focitech1.blogspot.com/?m=1" 
              className="text-xs text-slate-500 hover:text-white transition-colors"
            >
              Blog
            </a>
            <a 
              href="/careers" 
              className="text-xs text-slate-500 hover:text-white transition-colors"
            >
              Careers
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;