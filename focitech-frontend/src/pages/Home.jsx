import { Rocket, Shield, Cpu, ArrowRight, Zap, Globe, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className="bg-[#020617] text-white min-h-screen overflow-hidden selection:bg-blue-500/30">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 flex flex-col items-center justify-center">
        
        {/* Background Mesh/Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-indigo-600/10 rounded-full blur-[100px]"></div>
          {/* Grid Effect */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto px-6 relative z-10 text-center"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase mb-8">
            <Zap size={14} className="fill-current" /> Next-Gen Technology Solutions
          </motion.div>

          <motion.h1 variants={fadeInUp} className="text-5xl md:text-8xl font-black tracking-tight mb-8 leading-[1.1]">
            Engineering the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-blue-400 via-blue-600 to-indigo-700">
              Digital Future
            </span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
            Focitech Pvt. Ltd. builds high-performance custom software, 
            transforming complex challenges into scalable digital ecosystems.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Link to="/projects" className="group relative px-10 py-5 bg-blue-600 text-white rounded-2xl font-bold transition-all hover:bg-blue-700 hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                View Projects<ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link to="/contact" className="px-10 py-5 bg-slate-900/50 backdrop-blur-md border border-slate-800 text-slate-300 rounded-2xl font-bold hover:bg-slate-800 transition-all">
              Start a Project
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="py-24 relative bg-[#020617]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Cpu />, title: "Planning & Strategy", desc: "Crafting innovative solutions for the tech world. Our expert team combines seamless design and strategic planning to revolutionize your digital landscape. Let us elevate your vision to new heights.", color: "from-blue-600 to-cyan-500" },
              { icon: <Shield />, title: "Android App", desc: "Crafting cutting-edge Android experiences on a budget. We excel in app development and extending existing applications. Quality meets affordability, as we strive to deliver top-notch solutions tailored to your needs. Let's create something extraordinary together!", color: "from-indigo-600 to-purple-500" },
              { icon: <Layers />, title: "Web Design & Development", desc: "Crafting digital experiences that leave a lasting impression. We are Foci Tech, your go-to web development experts dedicated to building top-notch websites with a keen eye for design and functionality. From creation to maintenance, we've got you covered.", color: "from-emerald-600 to-teal-500" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group relative p-8 rounded-[2.5rem] bg-slate-900/40 border border-slate-800/50 hover:border-blue-500/50 transition-all duration-500 overflow-hidden"
              >
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-8 shadow-xl shadow-black/20`}>
                  {item.icon}
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-slate-100 group-hover:text-white transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- STATS SECTION (Deepesh's Achievements) --- */}
      <section className="pb-32 bg-[#020617]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="p-12 rounded-[3rem] bg-gradient-to-r from-blue-900/20 via-slate-900/40 to-indigo-900/20 border border-white/5 flex flex-wrap justify-around items-center gap-12 text-center">
            <div>
              <h4 className="text-5xl font-black text-white mb-2">50+</h4>
              <p className="text-blue-400 font-bold uppercase tracking-widest text-xs">Projects Delivered</p>
            </div>
            <div className="h-12 w-[1px] bg-white/10 hidden md:block"></div>
            <div>
              <h4 className="text-5xl font-black text-white mb-2">99%</h4>
              <p className="text-indigo-400 font-bold uppercase tracking-widest text-xs">Client Satisfaction</p>
            </div>
            <div className="h-12 w-[1px] bg-white/10 hidden md:block"></div>
            <div>
              <h4 className="text-5xl font-black text-white mb-2">24/7</h4>
              <p className="text-emerald-400 font-bold uppercase tracking-widest text-xs">Technical Support</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;