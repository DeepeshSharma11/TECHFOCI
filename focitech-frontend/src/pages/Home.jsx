import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion, LazyMotion, domAnimation } from 'framer-motion';

// Lazy load Lucide icons to reduce initial bundle size
const Rocket = lazy(() => import('lucide-react').then(mod => ({ default: mod.Rocket })));
const Shield = lazy(() => import('lucide-react').then(mod => ({ default: mod.Shield })));
const Cpu = lazy(() => import('lucide-react').then(mod => ({ default: mod.Cpu })));
const ArrowRight = lazy(() => import('lucide-react').then(mod => ({ default: mod.ArrowRight })));
const Zap = lazy(() => import('lucide-react').then(mod => ({ default: mod.Zap })));
const Globe = lazy(() => import('lucide-react').then(mod => ({ default: mod.Globe })));
const Layers = lazy(() => import('lucide-react').then(mod => ({ default: mod.Layers })));

// Loading fallback for icons
const IconLoader = ({ children }) => (
  <Suspense fallback={<div className="w-6 h-6 bg-slate-700 rounded animate-pulse" />}>
    {children}
  </Suspense>
);

const Home = () => {
  // Simple animation variants for performance
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  // Features data
  const features = [
    { 
      icon: <Cpu />, 
      title: "Planning & Strategy", 
      desc: "Crafting innovative solutions for the tech world. Our expert team combines seamless design and strategic planning to revolutionize your digital landscape. Let us elevate your vision to new heights.", 
      color: "from-blue-600 to-cyan-500" 
    },
    { 
      icon: <Shield />, 
      title: "Android App", 
      desc: "Crafting cutting-edge Android experiences on a budget. We excel in app development and extending existing applications. Quality meets affordability, as we strive to deliver top-notch solutions tailored to your needs.", 
      color: "from-indigo-600 to-purple-500" 
    },
    { 
      icon: <Layers />, 
      title: "Web Design & Development", 
      desc: "Crafting digital experiences that leave a lasting impression. We are Foci Tech, your go-to web development experts dedicated to building top-notch websites with a keen eye for design and functionality.", 
      color: "from-emerald-600 to-teal-500" 
    }
  ];

  // Stats data
  const stats = [
    { value: "50+", label: "Projects Delivered", color: "text-blue-400" },
    { value: "99%", label: "Client Satisfaction", color: "text-indigo-400" },
    { value: "24/7", label: "Technical Support", color: "text-emerald-400" }
  ];

  return (
    <LazyMotion features={domAnimation}>
      <div className="bg-[#020617] text-white min-h-screen overflow-hidden selection:bg-blue-500/30">
        
        {/* --- HERO SECTION --- */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32">
          {/* Optimized background with less expensive effects */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[80px]" />
            <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-indigo-600/10 rounded-full blur-[60px]" />
            {/* Light grid effect - minimal performance impact */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,#1e293b_1px,transparent_1px),linear-gradient(180deg,#1e293b_1px,transparent_1px)] bg-[size:64px_64px] opacity-10" />
          </div>

          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center"
          >
            <motion.div 
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase mb-6 sm:mb-8"
            >
              <IconLoader>
                <Zap size={14} className="fill-current" />
              </IconLoader>
              Next-Gen Technology Solutions
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 sm:mb-8 leading-[1.1]"
            >
              Engineering the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-blue-400 via-blue-600 to-indigo-700">
                Digital Future
              </span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-base sm:text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed font-medium px-4"
            >
              Focitech Pvt. Ltd. builds high-performance custom software, 
              transforming complex challenges into scalable digital ecosystems.
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link 
                to="/projects" 
                className="group relative px-8 py-4 sm:px-10 sm:py-5 bg-blue-600 text-white rounded-2xl font-bold transition-all hover:bg-blue-700 hover:shadow-[0_0_20px_rgba(37,99,235,0.3)] active:scale-95"
                aria-label="View our projects"
              >
                <span className="flex items-center gap-2">
                  View Projects
                  <IconLoader>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </IconLoader>
                </span>
              </Link>
              <Link 
                to="/contact" 
                className="px-8 py-4 sm:px-10 sm:py-5 bg-slate-900/50 backdrop-blur-md border border-slate-800 text-slate-300 rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95"
                aria-label="Start a new project"
              >
                Start a Project
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* --- FEATURES SECTION --- */}
        <section className="py-16 sm:py-20 lg:py-24 relative bg-[#020617]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {features.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.4,
                    delay: i * 0.1,
                    ease: "easeOut"
                  }}
                  viewport={{ 
                    once: true,
                    margin: "-50px"
                  }}
                  className="group relative p-6 sm:p-8 rounded-[2rem] bg-slate-900/40 border border-slate-800/50 hover:border-blue-500/50 transition-all duration-300"
                >
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-6 shadow-lg`}>
                    <IconLoader>
                      {item.icon}
                    </IconLoader>
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-slate-100 group-hover:text-white transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --- STATS SECTION --- */}
        <section className="pb-20 sm:pb-24 lg:pb-32 bg-[#020617]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 sm:p-12 rounded-[2.5rem] bg-gradient-to-r from-blue-900/20 via-slate-900/40 to-indigo-900/20 border border-white/5"
            >
              <div className="flex flex-col sm:flex-row justify-around items-center gap-8 sm:gap-12 text-center">
                {stats.map((stat, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <h4 className="text-4xl sm:text-5xl font-black text-white mb-1 sm:mb-2">
                      {stat.value}
                    </h4>
                    <p className={`${stat.color} font-bold uppercase tracking-widest text-xs sm:text-sm`}>
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </LazyMotion>
  );
};

// Export with React.memo for performance
export default Home;