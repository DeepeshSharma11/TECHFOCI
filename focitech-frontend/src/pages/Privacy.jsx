import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Lock, Eye, FileText, Users, Cookie, 
  CheckCircle, XCircle, ChevronRight, Mail,
  Globe, Clock, AlertTriangle, ExternalLink
} from 'lucide-react';

const Privacy = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', label: 'Overview', icon: <Shield size={20} /> },
    { id: 'data-collection', label: 'Data Collection', icon: <FileText size={20} /> },
    { id: 'data-usage', label: 'Data Usage', icon: <Users size={20} /> },
    { id: 'cookies', label: 'Cookies', icon: <Cookie size={20} /> },
    { id: 'rights', label: 'Your Rights', icon: <Eye size={20} /> },
    { id: 'contact', label: 'Contact Us', icon: <Mail size={20} /> },
  ];

  const lastUpdated = "January 24, 2024";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white pt-20 lg:pt-24 px-4 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 lg:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/20 border border-blue-500/20 mb-6">
            <Lock className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Privacy & Security</span>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-black mb-6">
            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">Policy</span>
          </h1>
          
          <p className="text-lg lg:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-8">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>

          <div className="inline-flex items-center gap-2 text-sm text-slate-500">
            <Clock className="w-4 h-4" />
            Last updated: {lastUpdated}
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/3">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 lg:p-8 sticky top-24">
              <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                Quick Navigation
              </h2>
              
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id);
                      // Scroll to section
                      document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all text-left ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/10 border border-blue-500/20 text-white shadow-lg shadow-blue-600/10'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${activeSection === section.id ? 'bg-blue-600' : 'bg-slate-800'}`}>
                      {section.icon}
                    </div>
                    <span className="font-bold text-sm">{section.label}</span>
                    <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${
                      activeSection === section.id ? 'rotate-90 text-white' : 'text-slate-500'
                    }`} />
                  </button>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-white/5">
                <h3 className="font-bold mb-4">Key Points</h3>
                <ul className="space-y-3 text-sm text-slate-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    We never sell your personal data
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Full control over your information
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Transparent data practices
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Industry-standard security measures
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-2/3">
            <div className="space-y-8">
              {/* Overview Section */}
              <motion.section
                id="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 lg:p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-blue-600/20 text-blue-500">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-black">Overview</h2>
                    <p className="text-slate-400">Our commitment to your privacy</p>
                  </div>
                </div>

                <div className="space-y-4 text-slate-300 leading-relaxed">
                  <p>
                    At <span className="font-bold text-white">Focitech Pvt. Ltd.</span>, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
                  </p>
                  
                  <p>
                    This policy applies to information we collect:
                  </p>
                  
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                      On our website (focitech.in)
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                      In email, text, and other electronic messages
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                      Through our products and services
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                      When you interact with our advertising
                    </li>
                  </ul>
                  
                  <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-4 mt-6">
                    <p className="text-sm">
                      <span className="font-bold text-blue-400">Note:</span> By using our website, you consent to the data practices described in this policy. If you do not agree with any part of this policy, please do not use our website.
                    </p>
                  </div>
                </div>
              </motion.section>

              {/* Data Collection Section */}
              <motion.section
                id="data-collection"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 lg:p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-500">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-black">Information We Collect</h2>
                    <p className="text-slate-400">What data we collect and why</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-white">Personal Information</h3>
                    <p className="text-slate-300 mb-4">
                      We collect personal information that you voluntarily provide to us when you:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
                        <h4 className="font-bold mb-2 text-blue-400">Contact Forms</h4>
                        <ul className="text-sm text-slate-400 space-y-1">
                          <li>• Name and email address</li>
                          <li>• Phone number (optional)</li>
                          <li>• Company name (optional)</li>
                          <li>• Message content</li>
                        </ul>
                      </div>
                      
                      <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
                        <h4 className="font-bold mb-2 text-blue-400">Job Applications</h4>
                        <ul className="text-sm text-slate-400 space-y-1">
                          <li>• Resume/CV files</li>
                          <li>• Cover letters</li>
                          <li>• Portfolio links</li>
                          <li>• Contact information</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-3 text-white">Automatically Collected Information</h3>
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
                      <ul className="space-y-2 text-slate-300">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                          <span><span className="font-bold">IP Address:</span> For security and analytics</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                          <span><span className="font-bold">Browser Type:</span> For compatibility optimization</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                          <span><span className="font-bold">Device Information:</span> For responsive design</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                          <span><span className="font-bold">Usage Data:</span> Pages visited, time spent, etc.</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-3 text-white">What We DO NOT Collect</h3>
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
                      <ul className="space-y-2 text-slate-300">
                        <li className="flex items-start gap-2">
                          <XCircle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                          <span><span className="font-bold">Sensitive Data:</span> Social security numbers, financial information</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <XCircle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                          <span><span className="font-bold">Location Data:</span> Precise GPS location</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <XCircle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                          <span><span className="font-bold">Biometric Data:</span> Fingerprints, facial recognition</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Data Usage Section */}
              <motion.section
                id="data-usage"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 lg:p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-green-600/20 text-green-500">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-black">How We Use Your Information</h2>
                    <p className="text-slate-400">Purposes of data processing</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      title: "Service Delivery",
                      description: "To provide and maintain our services, respond to inquiries, and process applications.",
                      icon: "🚀"
                    },
                    {
                      title: "Communication",
                      description: "To send important updates, respond to messages, and provide customer support.",
                      icon: "💬"
                    },
                    {
                      title: "Website Improvement",
                      description: "To analyze usage patterns and improve website functionality and user experience.",
                      icon: "📈"
                    },
                    {
                      title: "Security",
                      description: "To protect against fraud, unauthorized access, and ensure data integrity.",
                      icon: "🔒"
                    },
                    {
                      title: "Legal Compliance",
                      description: "To comply with legal obligations and respond to lawful requests.",
                      icon: "⚖️"
                    },
                    {
                      title: "Business Operations",
                      description: "To conduct internal research and development for service enhancement.",
                      icon: "🏢"
                    }
                  ].map((use, index) => (
                    <div key={index} className="bg-white/5 border border-white/5 rounded-2xl p-5">
                      <div className="text-2xl mb-3">{use.icon}</div>
                      <h3 className="font-bold text-lg mb-2 text-white">{use.title}</h3>
                      <p className="text-sm text-slate-400">{use.description}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 bg-blue-600/10 border border-blue-500/20 rounded-2xl p-4">
                  <h4 className="font-bold text-blue-400 mb-2">Data Retention</h4>
                  <p className="text-sm text-slate-300">
                    We retain personal information only for as long as necessary to fulfill the purposes for which it was collected, including for legal, accounting, or reporting requirements. Typically, we retain contact form submissions for 2 years and job applications for 3 years.
                  </p>
                </div>
              </motion.section>

              {/* Cookies Section */}
              <motion.section
                id="cookies"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 lg:p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-amber-600/20 text-amber-500">
                    <Cookie className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-black">Cookies & Tracking</h2>
                    <p className="text-slate-400">How we use cookies and similar technologies</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                    <h3 className="font-bold text-lg mb-3 text-white">What Are Cookies?</h3>
                    <p className="text-slate-300 mb-4">
                      Cookies are small text files that are placed on your device when you visit our website. They help us remember your preferences and understand how you interact with our site.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl mb-2">🍪</div>
                        <h4 className="font-bold text-sm mb-1">Essential Cookies</h4>
                        <p className="text-xs text-slate-400">Required for site functionality</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl mb-2">📊</div>
                        <h4 className="font-bold text-sm mb-1">Analytics Cookies</h4>
                        <p className="text-xs text-slate-400">Help us improve our website</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl mb-2">🎯</div>
                        <h4 className="font-bold text-sm mb-1">Preference Cookies</h4>
                        <p className="text-xs text-slate-400">Remember your settings</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-4">
                    <h4 className="font-bold text-blue-400 mb-2">Cookie Control</h4>
                    <p className="text-sm text-slate-300 mb-3">
                      You can control cookies through your browser settings. Most browsers allow you to refuse cookies or delete them. However, disabling essential cookies may affect website functionality.
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <span className="text-amber-400">Note: We do not use cookies for advertising or tracking across other websites.</span>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Your Rights Section */}
              <motion.section
                id="rights"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 lg:p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-purple-600/20 text-purple-500">
                    <Eye className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-black">Your Data Rights</h2>
                    <p className="text-slate-400">Control over your personal information</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <p className="text-slate-300">
                    Under data protection laws, you have rights regarding your personal data. We respect these rights and will respond to your requests in accordance with applicable laws.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        title: "Right to Access",
                        description: "Request a copy of your personal data we hold.",
                        color: "text-blue-400"
                      },
                      {
                        title: "Right to Correction",
                        description: "Request correction of inaccurate or incomplete data.",
                        color: "text-green-400"
                      },
                      {
                        title: "Right to Deletion",
                        description: "Request deletion of your personal data under certain conditions.",
                        color: "text-red-400"
                      },
                      {
                        title: "Right to Restriction",
                        description: "Request restriction of processing your data.",
                        color: "text-amber-400"
                      },
                      {
                        title: "Right to Object",
                        description: "Object to processing of your personal data.",
                        color: "text-purple-400"
                      },
                      {
                        title: "Right to Portability",
                        description: "Request transfer of your data to another organization.",
                        color: "text-cyan-400"
                      }
                    ].map((right, index) => (
                      <div key={index} className="bg-white/5 border border-white/5 rounded-2xl p-4">
                        <h3 className={`font-bold text-lg mb-2 ${right.color}`}>{right.title}</h3>
                        <p className="text-sm text-slate-400">{right.description}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-green-600/10 border border-green-500/20 rounded-2xl p-4">
                    <h4 className="font-bold text-green-400 mb-2">How to Exercise Your Rights</h4>
                    <p className="text-sm text-slate-300 mb-3">
                      To exercise any of these rights, please contact us using the information in the "Contact Us" section below. We will respond to your request within 30 days and may need to verify your identity before processing.
                    </p>
                  </div>
                </div>
              </motion.section>

              {/* Contact Section */}
              <motion.section
                id="contact"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 lg:p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-cyan-600/20 text-cyan-500">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-black">Contact Us</h2>
                    <p className="text-slate-400">Get in touch with privacy concerns</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                    <h3 className="font-bold text-lg mb-3 text-white">Data Protection Officer</h3>
                    <p className="text-slate-300 mb-4">
                      For any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact our Data Protection Officer:
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-cyan-500" />
                        <a href="mailto:info.technoviax@gmail.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                          Info.technoviax@gmail.com
                        </a>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-blue-500" />
                        <span className="text-slate-300">Focitech Pvt. Ltd.</span>
                      </div>
                      
                      <div className="text-sm text-slate-400 mt-4">
                        <p>Bareilly, Uttar Pradesh</p>
                        <p>India - 243001</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-4">
                    <h4 className="font-bold text-blue-400 mb-2">Policy Updates</h4>
                    <p className="text-sm text-slate-300 mb-3">
                      We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span className="text-blue-400">You are advised to review this Privacy Policy periodically for any changes.</span>
                    </div>
                  </div>

                  <div className="text-center pt-6 border-t border-white/5">
                    <p className="text-slate-400 text-sm">
                      For more information about data protection regulations, visit:{' '}
                      <a 
                        href="https://www.meity.gov.in/data-protection-framework" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-400 transition-colors inline-flex items-center gap-1"
                      >
                        MeitY Data Protection Framework
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </p>
                  </div>
                </div>
              </motion.section>
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <p className="text-slate-500 text-sm">
            This Privacy Policy is effective as of {lastUpdated} and applies to all visitors and users of focitech.in
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;