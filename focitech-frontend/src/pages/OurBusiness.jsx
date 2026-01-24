import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, CreditCard, ArrowUpRight, ExternalLink,
  Globe, Shield, Zap, TrendingUp, Users, Lock,
  CheckCircle, Star, ArrowRight, ChevronRight, 
  Store, Wallet, Smartphone, Building,
  Cpu, PieChart, RefreshCw, BarChart3
} from 'lucide-react';

const OurBusiness = () => {
  const [activeTab, setActiveTab] = useState('focistore');
  const [stats, setStats] = useState({
    focistore: { 
      customers: 25000, 
      products: 1500, 
      rating: 4.8,
      // Add transactions for focistore
      transactions: 125000 
    },
    focifinance: { 
      users: 18000, 
      transactions: 500000, 
      rating: 4.9 
    }
  });

  // Simulate live updates - FIXED VERSION
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        focistore: {
          ...prev.focistore,
          customers: prev.focistore.customers + Math.floor(Math.random() * 10),
          products: prev.focistore.products + Math.floor(Math.random() * 5),
          transactions: prev.focistore.transactions + Math.floor(Math.random() * 100)
        },
        focifinance: {
          ...prev.focifinance,
          users: prev.focifinance.users + Math.floor(Math.random() * 5),
          transactions: prev.focifinance.transactions + Math.floor(Math.random() * 50)
        }
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const businesses = [
    {
      id: 'focistore',
      name: 'Focistore',
      domain: 'focistore.site',
      tagline: 'Premium E-commerce Platform',
      description: 'A cutting-edge e-commerce solution offering curated products, seamless shopping experiences, and global delivery.',
      icon: <Store className="w-8 h-8" />,
      color: 'from-blue-600 to-cyan-500',
      bgColor: 'bg-gradient-to-br from-blue-600/20 to-cyan-500/20',
      borderColor: 'border-blue-500/20',
      features: [
        { icon: <ShoppingBag />, text: 'Curated Product Collections' },
        { icon: <Globe />, text: 'Global Shipping Network' },
        { icon: <Shield />, text: 'Secure Payment Gateway' },
        { icon: <Zap />, text: 'Lightning Fast Checkout' },
        { icon: <Users />, text: 'Personalized Recommendations' },
        { icon: <RefreshCw />, text: 'Easy Returns & Refunds' }
      ],
      highlights: [
        'AI-powered product discovery',
        'Same-day delivery in major cities',
        'Sustainable packaging initiative',
        'Multi-currency support'
      ],
      cta: {
        text: 'Visit Focistore',
        url: 'https://focistore.site',
        color: 'bg-gradient-to-r from-blue-600 to-cyan-600'
      }
    },
    {
      id: 'focifinance',
      name: 'Focifinance',
      domain: 'focifinance.site',
      tagline: 'Modern Financial Solutions',
      description: 'Next-generation financial platform offering smart banking, investment tools, and secure digital transactions.',
      icon: <Wallet className="w-8 h-8" />,
      color: 'from-indigo-600 to-purple-500',
      bgColor: 'bg-gradient-to-br from-indigo-600/20 to-purple-500/20',
      borderColor: 'border-indigo-500/20',
      features: [
        { icon: <CreditCard />, text: 'Digital Banking Solutions' },
        { icon: <TrendingUp />, text: 'Smart Investment Tools' },
        { icon: <Lock />, text: 'Bank-Grade Security' },
        { icon: <PieChart />, text: 'Financial Analytics' },
        { icon: <Smartphone />, text: 'Mobile-First Experience' },
        { icon: <BarChart3 />, text: 'Real-time Market Insights' }
      ],
      highlights: [
        'AI-driven portfolio management',
        'Instant cross-border transfers',
        'Cryptocurrency integration',
        '24/7 customer support'
      ],
      cta: {
        text: 'Explore Focifinance',
        url: 'https://focifinance.site',
        color: 'bg-gradient-to-r from-indigo-600 to-purple-600'
      }
    }
  ];

  const currentBusiness = businesses.find(b => b.id === activeTab);

  // Get the correct stat based on business type
  const getBusinessStat = (statName) => {
    const businessStats = stats[currentBusiness.id];
    
    if (currentBusiness.id === 'focistore') {
      switch(statName) {
        case 'customers':
          return businessStats.customers.toLocaleString();
        case 'rating':
          return businessStats.rating.toFixed(1);
        case 'products':
          return `${businessStats.products.toLocaleString()}+`;
        case 'transactions':
          return `${businessStats.transactions.toLocaleString()}+`;
        default:
          return '0';
      }
    } else {
      switch(statName) {
        case 'users':
          return businessStats.users.toLocaleString();
        case 'rating':
          return businessStats.rating.toFixed(1);
        case 'transactions':
          return `${businessStats.transactions.toLocaleString()}+`;
        default:
          return '0';
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white pt-20 lg:pt-24 px-4 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 lg:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
            <Cpu className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Our Ventures</span>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-black mb-6">
            Building <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">Digital</span> Excellence
          </h1>
          
          <p className="text-lg lg:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            We're pioneering the future through innovative platforms that transform e-commerce and financial services.
          </p>
        </motion.div>

        {/* Business Tabs */}
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          {/* Left Panel - Business Selector */}
          <div className="lg:w-1/3">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 lg:p-8 sticky top-24">
              <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-500" />
                Our Businesses
              </h2>
              
              <div className="space-y-3 mb-8">
                {businesses.map((business) => (
                  <button
                    key={business.id}
                    onClick={() => setActiveTab(business.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                      activeTab === business.id
                        ? `${business.bgColor} border ${business.borderColor} shadow-lg`
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${business.color}`}>
                      {business.icon}
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="font-bold text-lg">{business.name}</h3>
                      <p className="text-slate-400 text-sm">{business.domain}</p>
                    </div>
                    <ChevronRight className={`w-5 h-5 transition-transform ${
                      activeTab === business.id ? 'rotate-90 text-white' : 'text-slate-500'
                    }`} />
                  </button>
                ))}
              </div>

              {/* Live Stats */}
              <div className="border-t border-white/5 pt-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
                  Live Performance
                </h3>
                <div className="space-y-3">
                  {currentBusiness.id === 'focistore' ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Active Customers</span>
                        <span className="font-bold">
                          {getBusinessStat('customers')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Products Listed</span>
                        <span className="font-bold">
                          {getBusinessStat('products')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Orders Processed</span>
                        <span className="font-bold">
                          {getBusinessStat('transactions')}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Active Users</span>
                        <span className="font-bold">
                          {getBusinessStat('users')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Total Transactions</span>
                        <span className="font-bold">
                          {getBusinessStat('transactions')}
                        </span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Platform Rating</span>
                    <span className="font-bold flex items-center gap-1">
                      {getBusinessStat('rating')}
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Business Details */}
          <div className="lg:w-2/3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Business Hero */}
                <div className={`rounded-3xl p-8 lg:p-12 ${currentBusiness.bgColor} border ${currentBusiness.borderColor}`}>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${currentBusiness.color}`}>
                          {currentBusiness.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-3xl lg:text-4xl font-black">{currentBusiness.name}</h2>
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/10">
                              LIVE
                            </span>
                          </div>
                          <p className="text-slate-300">{currentBusiness.domain}</p>
                        </div>
                      </div>
                      <h3 className="text-xl lg:text-2xl font-bold mb-3">{currentBusiness.tagline}</h3>
                      <p className="text-lg text-slate-300 leading-relaxed max-w-3xl">
                        {currentBusiness.description}
                      </p>
                    </div>
                    
                    <a
                      href={currentBusiness.cta.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${currentBusiness.cta.color} hover:opacity-90 px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 transition-all shadow-xl hover:scale-[1.02] group`}
                    >
                      {currentBusiness.cta.text}
                      <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>
                  </div>
                </div>

                {/* Features Grid */}
                <div>
                  <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
                    <Zap className="w-6 h-6 text-blue-500" />
                    Core Features
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentBusiness.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors"
                      >
                        <div className="inline-flex p-3 rounded-xl bg-white/5 mb-4">
                          <div className="text-blue-500">{feature.icon}</div>
                        </div>
                        <h4 className="font-bold text-lg mb-2">{feature.text}</h4>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Highlights & Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Highlights */}
                  <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 lg:p-8">
                    <h3 className="text-2xl font-black mb-6">Key Highlights</h3>
                    <ul className="space-y-4">
                      {currentBusiness.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                          <span className="text-slate-300">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Platform Stats */}
                  <div className={`rounded-3xl p-6 lg:p-8 ${currentBusiness.bgColor} border ${currentBusiness.borderColor}`}>
                    <h3 className="text-2xl font-black mb-6">Platform Statistics</h3>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-slate-300">User Growth</span>
                          <span className="text-green-500 font-bold">+24%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                            style={{ width: '85%' }}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-slate-300">Platform Uptime</span>
                          <span className="text-green-500 font-bold">99.9%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                            style={{ width: '99.9%' }}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-slate-300">Customer Satisfaction</span>
                          <span className="text-yellow-500 font-bold flex items-center gap-1">
                            {getBusinessStat('rating')}
                            <Star className="w-4 h-4 fill-yellow-500" />
                          </span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full"
                            style={{ width: `${parseFloat(getBusinessStat('rating')) * 20}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-white/5 rounded-3xl p-8 lg:p-12 text-center">
                  <h3 className="text-2xl lg:text-3xl font-black mb-4">
                    Ready to Experience {currentBusiness.name}?
                  </h3>
                  <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
                    Join thousands of satisfied users who trust our platform for their {currentBusiness.id === 'focistore' ? 'shopping needs' : 'financial solutions'}.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href={currentBusiness.cta.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${currentBusiness.cta.color} hover:opacity-90 px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-xl hover:scale-[1.02] group`}
                    >
                      Visit {currentBusiness.name}
                      <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>
                    <button className="px-8 py-4 border border-white/10 hover:bg-white/5 rounded-2xl font-bold text-lg transition-all hover:scale-[1.02]">
                      Request Demo
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <p className="text-slate-500 text-sm">
            Both platforms are actively maintained and updated with new features regularly.
            For partnership inquiries, contact us at{' '}
            <a href="mailto:business@focitech.com" className="text-blue-500 hover:text-blue-400">
              business@focitech.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OurBusiness;