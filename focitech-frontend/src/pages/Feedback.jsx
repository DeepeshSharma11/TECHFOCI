import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, Quote, ChevronLeft, ChevronRight, 
  Users, ThumbsUp, Award, TrendingUp,
  Globe, Zap, Heart, Shield, Sparkles,
  Calendar, CheckCircle, ExternalLink
} from 'lucide-react';

const Feedback = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [filter, setFilter] = useState('all');
  const [hoveredCard, setHoveredCard] = useState(null);

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

  // Render stars
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        size={16}
        className={`${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-700'}`}
      />
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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white pt-20 lg:pt-24 px-4 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 lg:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600/20 border border-emerald-500/20 mb-6">
            <Heart className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Testimonials</span>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-black mb-6">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-400">Happy</span> Clients
          </h1>
          
          <p className="text-lg lg:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            See what our clients have to say about their experience working with us. 
            Their success is our greatest achievement.
          </p>
        </motion.div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 lg:mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800/30 backdrop-blur-sm border border-white/5 rounded-2xl p-6 text-center"
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} mb-4`}>
                {stat.icon}
              </div>
              <div className="text-2xl lg:text-3xl font-black mb-2">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content - Featured Testimonial */}
          <div className="lg:w-2/3">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
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
                  className={`${getCardBackground(filteredTestimonials[activeTestimonial]?.category)} border border-white/5 rounded-3xl p-8 lg:p-12`}
                >
                  {filteredTestimonials[activeTestimonial] && (
                    <>
                      <div className="inline-flex p-3 rounded-2xl bg-white/5 mb-6">
                        <Quote className="w-6 h-6 text-blue-500" />
                      </div>
                      
                      <p className="text-xl lg:text-2xl font-medium italic mb-8 leading-relaxed">
                        "{filteredTestimonials[activeTestimonial].feedback}"
                      </p>
                      
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/10">
                            <img 
                              src={filteredTestimonials[activeTestimonial].image} 
                              alt={filteredTestimonials[activeTestimonial].name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">
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
                        
                        <div className="hidden lg:flex items-center gap-4">
                          {getCategoryBadge(filteredTestimonials[activeTestimonial].category)}
                          <div className="text-right">
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                              <Calendar size={14} />
                              {new Date(filteredTestimonials[activeTestimonial].date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                year: 'numeric' 
                              })}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                              <Globe size={14} />
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
                  <ChevronLeft size={20} />
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
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {/* All Testimonials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTestimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`${getCardBackground(testimonial.category)} border border-white/5 rounded-2xl p-6 hover:border-blue-500/30 transition-all cursor-pointer ${
                    hoveredCard === testimonial.id ? 'scale-[1.02]' : ''
                  }`}
                  onMouseEnter={() => setHoveredCard(testimonial.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => setActiveTestimonial(index)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold">{testimonial.name}</h4>
                        <p className="text-sm text-slate-400">{testimonial.role}</p>
                      </div>
                    </div>
                    {getCategoryBadge(testimonial.category)}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    {renderStars(testimonial.rating)}
                  </div>
                  
                  <p className="text-slate-300 text-sm mb-4 line-clamp-3">
                    "{testimonial.feedback}"
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <Calendar size={12} />
                      {new Date(testimonial.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap size={12} />
                      {testimonial.duration}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar - Why Choose Us */}
          <div className="lg:w-1/3">
            <div className="bg-slate-800/30 backdrop-blur-sm border border-white/5 rounded-3xl p-6 lg:p-8 sticky top-24">
              <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Why Clients Choose Us
              </h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                  <div className="p-2 rounded-xl bg-blue-600/20 text-blue-500">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Proven Track Record</h3>
                    <p className="text-sm text-slate-400">150+ successful projects delivered on time</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                  <div className="p-2 rounded-xl bg-purple-600/20 text-purple-500">
                    <Users size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Expert Team</h3>
                    <p className="text-sm text-slate-400">Skilled developers, designers & strategists</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="p-2 rounded-xl bg-emerald-600/20 text-emerald-500">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Reliable Support</h3>
                    <p className="text-sm text-slate-400">24/7 technical support & maintenance</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                  <div className="p-2 rounded-xl bg-amber-600/20 text-amber-500">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">ROI Focused</h3>
                    <p className="text-sm text-slate-400">Solutions that drive business growth</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/5 pt-6">
                <h3 className="font-bold mb-4">Global Reach</h3>
                <div className="flex flex-wrap gap-2">
                  {['India', 'USA', 'UK', 'Canada', 'Australia', 'Singapore', 'UAE', 'Germany'].map((country) => (
                    <span 
                      key={country}
                      className="px-3 py-1.5 bg-white/5 rounded-lg text-xs font-medium"
                    >
                      {country}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-white/5 rounded-3xl p-8 lg:p-12">
            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/20 mb-6">
              <Sparkles className="w-8 h-8 text-blue-500" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-black mb-4">
              Ready to Become Our Next Success Story?
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
              Join hundreds of satisfied clients who have transformed their businesses with our expertise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-2xl font-bold text-lg transition-all hover:scale-[1.02] shadow-xl shadow-blue-600/20">
              <a href='/contact'>
                Start Your Project</a>
              </button>
              {/* <button className="px-8 py-4 border border-white/10 hover:bg-white/5 rounded-2xl font-bold text-lg transition-all hover:scale-[1.02]">
                View Case Studies
                <ExternalLink className="inline ml-2 w-5 h-5" />
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;