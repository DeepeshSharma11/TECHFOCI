import { lazy, Suspense, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';

// Lazy load Lucide icons to reduce initial bundle size
const Rocket = lazy(() => import('lucide-react').then(mod => ({ default: mod.Rocket })));
const Shield = lazy(() => import('lucide-react').then(mod => ({ default: mod.Shield })));
const Cpu = lazy(() => import('lucide-react').then(mod => ({ default: mod.Cpu })));
const ArrowRight = lazy(() => import('lucide-react').then(mod => ({ default: mod.ArrowRight })));
const Zap = lazy(() => import('lucide-react').then(mod => ({ default: mod.Zap })));
const Globe = lazy(() => import('lucide-react').then(mod => ({ default: mod.Globe })));
const Layers = lazy(() => import('lucide-react').then(mod => ({ default: mod.Layers })));
const Linkedin = lazy(() => import('lucide-react').then(mod => ({ default: mod.Linkedin })));
const Github = lazy(() => import('lucide-react').then(mod => ({ default: mod.Github })));
const User = lazy(() => import('lucide-react').then(mod => ({ default: mod.User })));
const Sparkles = lazy(() => import('lucide-react').then(mod => ({ default: mod.Sparkles })));
const ExternalLink = lazy(() => import('lucide-react').then(mod => ({ default: mod.ExternalLink })));
const Heart = lazy(() => import('lucide-react').then(mod => ({ default: mod.Heart })));
const Quote = lazy(() => import('lucide-react').then(mod => ({ default: mod.Quote })));
const ChevronLeft = lazy(() => import('lucide-react').then(mod => ({ default: mod.ChevronLeft })));
const ChevronRight = lazy(() => import('lucide-react').then(mod => ({ default: mod.ChevronRight })));
const Users = lazy(() => import('lucide-react').then(mod => ({ default: mod.Users })));
const ThumbsUp = lazy(() => import('lucide-react').then(mod => ({ default: mod.ThumbsUp })));
const Award = lazy(() => import('lucide-react').then(mod => ({ default: mod.Award })));
const TrendingUp = lazy(() => import('lucide-react').then(mod => ({ default: mod.TrendingUp })));
const Calendar = lazy(() => import('lucide-react').then(mod => ({ default: mod.Calendar })));
const CheckCircle = lazy(() => import('lucide-react').then(mod => ({ default: mod.CheckCircle })));
const Star = lazy(() => import('lucide-react').then(mod => ({ default: mod.Star })));

// Loading fallback for icons
const IconLoader = ({ children }) => (
  <Suspense fallback={<div className="w-6 h-6 bg-slate-700 rounded animate-pulse" />}>
    {children}
  </Suspense>
);

const Home = () => {
  const [team, setTeam] = useState([]);
  const [teamLoading, setTeamLoading] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [filter, setFilter] = useState('all');
  const [hoveredCard, setHoveredCard] = useState(null);

  // Team data fetch
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const { data, error } = await supabase
          .from('team')
          .select('*')
          .order('id', { ascending: true });

        if (error) throw error;
        setTeam(data || []);
      } catch (err) {
        console.error("Error loading team:", err.message);
      } finally {
        setTimeout(() => setTeamLoading(false), 800);
      }
    };

    fetchTeam();
  }, []);

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      role: 'CTO at TechNova Solutions',
      company: 'TechNova Solutions',
      feedback: 'Focitech transformed our e-commerce platform from outdated to cutting-edge. Their team delivered exceptional work on time and within budget. Highly recommended!',
      rating: 5,
      project: 'E-commerce Platform Redesign',
      duration: '3 months',
      location: 'Mumbai, India',
      date: '2024-01-15',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
      category: 'development'
    },
    {
      id: 2,
      name: 'Sarah Chen',
      role: 'Product Manager at Fintech Global',
      company: 'Fintech Global',
      feedback: 'The financial dashboard they built for us has revolutionized how we track metrics. Clean design, intuitive UX, and robust backend. Our user engagement increased by 40%.',
      rating: 5,
      project: 'Financial Analytics Dashboard',
      duration: '4 months',
      location: 'Singapore',
      date: '2024-02-10',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
      category: 'design'
    },
    {
      id: 3,
      name: 'Michael Rodriguez',
      role: 'CEO at HealthTech Innovations',
      company: 'HealthTech Innovations',
      feedback: 'Working with Focitech was a game-changer. They understood our complex requirements for the healthcare platform and delivered beyond expectations. Exceptional technical expertise!',
      rating: 5,
      project: 'Healthcare Management System',
      duration: '6 months',
      location: 'New York, USA',
      date: '2023-12-05',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
      category: 'development'
    },
    {
      id: 4,
      name: 'Aisha Patel',
      role: 'Marketing Director at GreenLeaf Organic',
      company: 'GreenLeaf Organic',
      feedback: 'Our new website launched with zero issues. The Focitech team was responsive, professional, and delivered a beautiful, functional site that perfectly represents our brand.',
      rating: 5,
      project: 'Corporate Website Redesign',
      duration: '2 months',
      location: 'London, UK',
      date: '2024-01-28',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face',
      category: 'design'
    },
    {
      id: 5,
      name: 'David Wilson',
      role: 'Operations Director at LogisticsPro',
      company: 'LogisticsPro',
      feedback: 'The supply chain management system they developed has streamlined our operations by 60%. Their team\'s attention to detail and problem-solving skills are remarkable.',
      rating: 5,
      project: 'Supply Chain Management System',
      duration: '5 months',
      location: 'Sydney, Australia',
      date: '2023-11-20',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
      category: 'development'
    },
    {
      id: 6,
      name: 'Lisa Wong',
      role: 'Founder at EduTech Kids',
      company: 'EduTech Kids',
      feedback: 'Focitech built an amazing educational platform for children. The animations, interactive features, and parent dashboard are flawless. Our user base grew 3x after launch.',
      rating: 5,
      project: 'Educational Platform for Kids',
      duration: '4 months',
      location: 'Toronto, Canada',
      date: '2024-02-18',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
      category: 'design'
    }
  ];

  // Stats data
  const stats = [
    { value: "10+", label: "Projects Delivered", color: "text-blue-400" },
    { value: "99%", label: "Client Satisfaction", color: "text-indigo-400" },
    { value: "24/7", label: "Technical Support", color: "text-emerald-400" },
    { value: "98%", label: "Client Retention", color: "text-purple-400" }
  ];

  // Feedback stats data
  const feedbackStats = [
    { value: '98%', label: 'Client Satisfaction', icon: <ThumbsUp className="w-6 h-6" />, color: 'from-green-500 to-emerald-500' },
    { value: '150+', label: 'Projects Delivered', icon: <Award className="w-6 h-6" />, color: 'from-blue-500 to-cyan-500' },
    { value: '40%', label: 'Growth in Efficiency', icon: <TrendingUp className="w-6 h-6" />, color: 'from-purple-500 to-pink-500' },
    { value: '24/7', label: 'Support Available', icon: <Shield className="w-6 h-6" />, color: 'from-amber-500 to-orange-500' }
  ];

  // Filtered testimonials
  const filteredTestimonials = filter === 'all' 
    ? testimonials 
    : testimonials.filter(t => t.category === filter);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % filteredTestimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [filteredTestimonials.length]);

  // Simple animation variants for performance
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  // Team animation variants
  const teamContainerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const teamCardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" } 
    }
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

  // Render stars for testimonials
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <IconLoader key={i}>
        <Star
          size={16}
          className={`${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-700'}`}
        />
      </IconLoader>
    ));
  };

  // Get testimonial card background based on category
  const getCardBackground = (category) => {
    switch(category) {
      case 'development': return 'bg-gradient-to-br from-blue-600/10 to-cyan-600/5';
      case 'design': return 'bg-gradient-to-br from-purple-600/10 to-pink-600/5';
      default: return 'bg-gradient-to-br from-slate-800/50 to-slate-900/30';
    }
  };

  // Get category badge
  const getCategoryBadge = (category) => {
    const config = {
      development: { label: 'Development', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
      design: { label: 'UI/UX Design', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' }
    };
    
    const { label, color } = config[category] || { label: category, color: 'bg-slate-700/50 text-slate-400' };
    
    return (
      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${color}`}>
        {label}
      </span>
    );
  };

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
        <section className="py-16 sm:py-20 lg:py-24 bg-[#020617]">
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

        {/* --- TESTIMONIALS SECTION --- */}
        <section className="py-16 sm:py-20 lg:py-24 relative bg-gradient-to-b from-slate-950 to-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {/* Testimonials Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12 sm:mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600/20 border border-emerald-500/20 mb-6">
                <IconLoader>
                  <Heart className="w-4 h-4 text-emerald-500" />
                </IconLoader>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Testimonials</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6">
                Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-400">Happy</span> Clients
              </h2>
              
              <p className="text-base sm:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
                See what our clients have to say about their experience working with us. 
                Their success is our greatest achievement.
              </p>
            </motion.div>

            {/* Testimonials Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 sm:mb-16">
              {feedbackStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-800/30 backdrop-blur-sm border border-white/5 rounded-2xl p-4 sm:p-6 text-center"
                >
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} mb-3 sm:mb-4`}>
                    <IconLoader>
                      {stat.icon}
                    </IconLoader>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black mb-1 sm:mb-2">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
              {/* Main Testimonials Content */}
              <div className="lg:w-2/3">
                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                      filter === 'all'
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    All Testimonials
                  </button>
                  <button
                    onClick={() => setFilter('development')}
                    className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                      filter === 'development'
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    Development
                  </button>
                  <button
                    onClick={() => setFilter('design')}
                    className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                      filter === 'design'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    Design
                  </button>
                </div>

                {/* Featured Testimonial Carousel */}
                <div className="mb-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTestimonial}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className={`${getCardBackground(filteredTestimonials[activeTestimonial]?.category)} border border-white/5 rounded-3xl p-6 sm:p-8 lg:p-12`}
                    >
                      {filteredTestimonials[activeTestimonial] && (
                        <>
                          <div className="inline-flex p-3 rounded-2xl bg-white/5 mb-6">
                            <IconLoader>
                              <Quote className="w-6 h-6 text-blue-500" />
                            </IconLoader>
                          </div>
                          
                          <p className="text-lg sm:text-xl lg:text-2xl font-medium italic mb-6 sm:mb-8 leading-relaxed">
                            "{filteredTestimonials[activeTestimonial].feedback}"
                          </p>
                          
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-6">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-white/10">
                                <img 
                                  src={filteredTestimonials[activeTestimonial].image} 
                                  alt={filteredTestimonials[activeTestimonial].name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h3 className="text-lg sm:text-xl font-bold">
                                  {filteredTestimonials[activeTestimonial].name}
                                </h3>
                                <p className="text-slate-400 text-sm">
                                  {filteredTestimonials[activeTestimonial].role}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  {renderStars(filteredTestimonials[activeTestimonial].rating)}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col sm:items-end gap-2">
                              {getCategoryBadge(filteredTestimonials[activeTestimonial].category)}
                              <div className="text-right">
                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                  <IconLoader>
                                    <Calendar size={14} />
                                  </IconLoader>
                                  {new Date(filteredTestimonials[activeTestimonial].date).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    year: 'numeric' 
                                  })}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                                  <IconLoader>
                                    <Globe size={14} />
                                  </IconLoader>
                                  {filteredTestimonials[activeTestimonial].location}
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>
                  
                  {/* Carousel Controls */}
                  <div className="flex items-center justify-center gap-4 mt-6">
                    <button
                      onClick={() => setActiveTestimonial(prev => 
                        prev === 0 ? filteredTestimonials.length - 1 : prev - 1
                      )}
                      className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                    >
                      <IconLoader>
                        <ChevronLeft size={20} />
                      </IconLoader>
                    </button>
                    
                    <div className="flex gap-2">
                      {filteredTestimonials.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveTestimonial(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === activeTestimonial 
                              ? 'bg-blue-500 w-8' 
                              : 'bg-white/20 hover:bg-white/40'
                          }`}
                        />
                      ))}
                    </div>
                    
                    <button
                      onClick={() => setActiveTestimonial(prev => 
                        (prev + 1) % filteredTestimonials.length
                      )}
                      className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                    >
                      <IconLoader>
                        <ChevronRight size={20} />
                      </IconLoader>
                    </button>
                  </div>
                </div>

                {/* All Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredTestimonials.map((testimonial, index) => (
                    <motion.div
                      key={testimonial.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`${getCardBackground(testimonial.category)} border border-white/5 rounded-2xl p-4 sm:p-6 hover:border-blue-500/30 transition-all cursor-pointer ${
                        hoveredCard === testimonial.id ? 'scale-[1.02]' : ''
                      }`}
                      onMouseEnter={() => setHoveredCard(testimonial.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      onClick={() => setActiveTestimonial(index)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden border border-white/10">
                            <img 
                              src={testimonial.image} 
                              alt={testimonial.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm sm:text-base">{testimonial.name}</h4>
                            <p className="text-xs sm:text-sm text-slate-400">{testimonial.role}</p>
                          </div>
                        </div>
                        {getCategoryBadge(testimonial.category)}
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        {renderStars(testimonial.rating)}
                      </div>
                      
                      <p className="text-slate-300 text-xs sm:text-sm mb-4 line-clamp-3">
                        "{testimonial.feedback}"
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                          <IconLoader>
                            <Calendar size={12} />
                          </IconLoader>
                          {new Date(testimonial.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <IconLoader>
                            <Zap size={12} />
                          </IconLoader>
                          {testimonial.duration}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Sidebar - Why Choose Us */}
              <div className="lg:w-1/3 mt-8 lg:mt-0">
                <div className="bg-slate-800/30 backdrop-blur-sm border border-white/5 rounded-3xl p-6 lg:p-8 sticky top-24">
                  <h2 className="text-lg sm:text-xl font-black mb-6 flex items-center gap-2">
                    <IconLoader>
                      <Sparkles className="w-5 h-5 text-amber-500" />
                    </IconLoader>
                    Why Clients Choose Us
                  </h2>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                      <div className="p-2 rounded-xl bg-blue-600/20 text-blue-500">
                        <IconLoader>
                          <CheckCircle size={20} />
                        </IconLoader>
                      </div>
                      <div>
                        <h3 className="font-bold mb-1 text-sm sm:text-base">Proven Track Record</h3>
                        <p className="text-xs sm:text-sm text-slate-400">150+ successful projects delivered on time</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                      <div className="p-2 rounded-xl bg-purple-600/20 text-purple-500">
                        <IconLoader>
                          <Users size={20} />
                        </IconLoader>
                      </div>
                      <div>
                        <h3 className="font-bold mb-1 text-sm sm:text-base">Expert Team</h3>
                        <p className="text-xs sm:text-sm text-slate-400">Skilled developers, designers & strategists</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                      <div className="p-2 rounded-xl bg-emerald-600/20 text-emerald-500">
                        <IconLoader>
                          <Shield size={20} />
                        </IconLoader>
                      </div>
                      <div>
                        <h3 className="font-bold mb-1 text-sm sm:text-base">Reliable Support</h3>
                        <p className="text-xs sm:text-sm text-slate-400">24/7 technical support & maintenance</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                      <div className="p-2 rounded-xl bg-amber-600/20 text-amber-500">
                        <IconLoader>
                          <TrendingUp size={20} />
                        </IconLoader>
                      </div>
                      <div>
                        <h3 className="font-bold mb-1 text-sm sm:text-base">ROI Focused</h3>
                        <p className="text-xs sm:text-sm text-slate-400">Solutions that drive business growth</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-6">
                    <h3 className="font-bold mb-4 text-sm sm:text-base">Global Reach</h3>
                    <div className="flex flex-wrap gap-2">
                      {['India', 'USA', 'UK', 'Canada', 'Australia', 'Singapore', 'UAE', 'Germany'].map((country) => (
                        <span 
                          key={country}
                          className="px-2 py-1 bg-white/5 rounded-lg text-xs font-medium"
                        >
                          {country}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- TEAM SECTION --- */}
        <section className="py-16 sm:py-20 lg:py-24 relative bg-[#020617]">
          {/* Team Background Glows */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            
            {/* Team Header */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12 sm:mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
                <IconLoader>
                  <Sparkles size={12} />
                </IconLoader>
                The Brains Behind Focitech
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
                Meet the <span className="text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-blue-700">Visionaries</span>
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg font-medium leading-relaxed">
                Our multi-disciplinary team is dedicated to pushing the boundaries of what's possible in the digital landscape.
              </p>
            </motion.div>

            {/* Team Loading State */}
            {teamLoading ? (
              <div className="min-h-[400px] flex flex-col justify-center items-center">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                  <IconLoader>
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-400 animate-pulse" size={24} />
                  </IconLoader>
                </div>
                <p className="mt-6 text-slate-500 font-bold tracking-[0.4em] text-xs uppercase animate-pulse">Syncing Team Data</p>
              </div>
            ) : (
              /* Team Grid */
              <motion.div 
                variants={teamContainerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
              >
                {team.map((member) => (
                  <motion.div 
                    key={member.id} 
                    variants={teamCardVariants}
                    whileHover={{ y: -8 }}
                    className="group"
                  >
                    <div className="relative h-full bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-6 sm:p-8 overflow-hidden transition-all duration-300 hover:border-blue-500/30 hover:shadow-[0_20px_40px_-10px_rgba(37,99,235,0.2)]">
                      
                      {/* Avatar Section */}
                      <div className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-8">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[2rem] rotate-6 group-hover:rotate-0 transition-transform duration-500"></div>
                        <div className="relative w-full h-full bg-[#020617] rounded-[2rem] p-1 overflow-hidden">
                          <img 
                            src={member.photo_url || `https://api.dicebear.com/7.x/initials/svg?seed=${member.name}&backgroundColor=0f172a`} 
                            alt={member.name} 
                            className="w-full h-full object-cover rounded-[1.9rem] transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      </div>

                      {/* Info Container */}
                      <div className="text-center">
                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                          {member.name}
                        </h3>
                        <p className="text-blue-500 font-bold text-xs uppercase tracking-[0.2em] mb-4">
                          {member.role}
                        </p>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">
                          {member.bio || "Crafting robust architectures and intuitive user experiences for the next generation of web applications."}
                        </p>

                        {/* Social Links */}
                        <div className="flex justify-center items-center gap-3 pt-6 border-t border-white/5">
                          {[
                            { icon: <Linkedin size={16} />, url: member.linkedin_url, color: "hover:bg-blue-600" },
                            { icon: <Github size={16} />, url: member.github_url, color: "hover:bg-slate-700" },
                          ].map((social, idx) => (
                            social.url && (
                              <a 
                                key={idx}
                                href={social.url} 
                                target="_blank" 
                                rel="noreferrer"
                                className={`p-2.5 bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all duration-300 ${social.color}`}
                              >
                                <IconLoader>
                                  {social.icon}
                                </IconLoader>
                              </a>
                            )
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Career CTA Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mt-12 sm:mt-16 p-1 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-transparent rounded-[2.5rem]"
            >
              <div className="bg-[#020617] rounded-[2.4rem] p-6 sm:p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 border border-white/5">
                <div className="text-center md:text-left">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-2 sm:mb-3">Want to shape the future?</h3>
                  <p className="text-slate-400 text-sm sm:text-base font-medium">Join our growing team of developers, designers, and innovators.</p>
                </div>
                <button className="whitespace-nowrap px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 rounded-[1.2rem] font-bold text-xs sm:text-sm hover:bg-blue-50 hover:shadow-xl hover:shadow-white/10 transition-all flex items-center gap-2">
                  VIEW OPEN ROLES 
                  <IconLoader>
                    <ExternalLink size={16} />
                  </IconLoader>
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* --- FINAL CTA SECTION --- */}
        <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-slate-900 to-[#020617]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center">
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-white/5 rounded-3xl p-8 lg:p-12">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/20 mb-6">
                  <IconLoader>
                    <Sparkles className="w-8 h-8 text-blue-500" />
                  </IconLoader>
                </div>
                <h2 className="text-2xl lg:text-3xl font-black mb-4">
                  Ready to Become Our Next Success Story?
                </h2>
                <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
                  Join hundreds of satisfied clients who have transformed their businesses with our expertise.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/contact" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-2xl font-bold text-lg transition-all hover:scale-[1.02] shadow-xl shadow-blue-600/20">
                    Start Your Project
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </LazyMotion>
  );
};

// Export with React.memo for performance
export default Home;