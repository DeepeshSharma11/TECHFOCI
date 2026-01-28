import React from 'react';
import { Link } from 'react-router-dom';

/**
 * RESPONSIVE BRAND LOGO COMPONENT
 * - Features responsive sizing for mobile and desktop
 * - Uses emerald green for "FOCI" and blue for "TECH"
 * - Maintains actual image logo with styled fallback
 */
const BrandLogo = () => {
  return (
    <Link to="/" className="flex items-center gap-2 sm:gap-3 group w-fit relative z-[110]">
      {/* --- LOGO ICON CONTAINER --- */}
      <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
        {/* Emerald Gradient Background / Border Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600 to-emerald-400 rounded-lg sm:rounded-xl rotate-6 transition-all duration-500 group-hover:rotate-0 group-hover:scale-110 shadow-lg shadow-emerald-500/20"></div>
        
        {/* Actual Image Logo */}
        <div className="relative z-10 w-full h-full p-0.5 sm:p-1 flex items-center justify-center">
          <img 
            src="/Foci-Tech Fav.jpeg" 
            alt="FociTech Logo" 
            className="w-full h-full object-cover rounded-md sm:rounded-lg shadow-sm transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              // Fallback logic
              e.target.style.display = 'none';
              if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
            }}
          />
          {/* Fallback styled "F" if image fails to load */}
          <div className="hidden absolute inset-0 items-center justify-center font-black text-white text-base sm:text-xl italic">F</div>
        </div>
        
        {/* Decorative Ring */}
        <div className="absolute inset-0 border border-white/10 rounded-lg sm:rounded-xl -rotate-3 group-hover:rotate-0 transition-transform duration-500 pointer-events-none"></div>
      </div>

      {/* --- BRAND TEXT --- */}
      <div className="flex flex-col">
        <span className="text-xl sm:text-2xl font-black tracking-tighter uppercase italic leading-none">
          <span className="text-emerald-500 transition-colors duration-300 group-hover:text-emerald-400">FOCI</span>
          <span className="text-blue-500">TECH</span>
        </span>
        <span className="text-[6px] sm:text-[7px] font-bold text-slate-500 tracking-[0.3em] sm:tracking-[0.4em] uppercase mt-0.5 sm:mt-1">Innovating Future</span>
      </div>
    </Link>
  );
};

export default BrandLogo;