import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Scale, AlertTriangle, BookOpen, 
  Shield, Globe, Clock, ChevronRight,
  CheckCircle, XCircle, ExternalLink, Mail,
  Lock, Users, Terminal, Code, Building
} from 'lucide-react';

const Terms = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', label: 'Overview', icon: <FileText size={20} /> },
    { id: 'acceptance', label: 'Acceptance', icon: <CheckCircle size={20} /> },
    { id: 'intellectual', label: 'Intellectual Property', icon: <Code size={20} /> },
    { id: 'use', label: 'Acceptable Use', icon: <Terminal size={20} /> },
    { id: 'liability', label: 'Limitations', icon: <AlertTriangle size={20} /> },
    { id: 'termination', label: 'Termination', icon: <XCircle size={20} /> },
    { id: 'governing', label: 'Governing Law', icon: <Scale size={20} /> },
    { id: 'contact', label: 'Contact', icon: <Mail size={20} /> },
  ];

  const lastUpdated = "January 24, 2024";
  const companyName = "Focitech Private Limited";
  const website = "focitech.in";

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
            <Scale className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Legal Terms</span>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-black mb-6">
            Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">Service</span>
          </h1>
          
          <p className="text-lg lg:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-8">
            Please read these terms carefully before using our website. These terms govern your access to and use of {website}.
          </p>

          <div className="inline-flex items-center gap-2 text-sm text-slate-500">
            <Clock className="w-4 h-4" />
            Last updated: {lastUpdated}
          </div>
        </motion.div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-amber-600/10 border border-amber-500/20 rounded-3xl p-6 mb-8"
        >
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-amber-400 mb-2">Important Legal Notice</h3>
              <p className="text-amber-300 text-sm">
                These Terms of Service constitute a legally binding agreement between you and {companyName}. By accessing or using our website, you acknowledge that you have read, understood, and agree to be bound by these terms.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/3">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 lg:p-8 sticky top-24">
              <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                Quick Navigation
              </h2>
              
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id);
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
                    Age requirement: 18+ years
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    No scraping or automated access
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Content is for informational purposes
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Contact for commercial inquiries
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
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-black">1. Overview</h2>
                    <p className="text-slate-400">Introduction and scope</p>
                  </div>
                </div>

                <div className="space-y-4 text-slate-300 leading-relaxed">
                  <p>
                    These Terms of Service ("Terms") govern your access to and use of the website located at {website} (the "Website") operated by {companyName} ("we," "us," or "our").
                  </p>
                  
                  <p>
                    The Website provides information about our software development services, portfolio, team, and career opportunities. By accessing or using the Website, you agree to be bound by these Terms.
                  </p>
                  
                  <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-4 mt-4">
                    <h4 className="font-bold text-blue-400 mb-2">Definitions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-bold text-white">"Website"</span>
                        <p className="text-slate-400">Refers to focitech.in and all associated pages</p>
                      </div>
                      <div>
                        <span className="font-bold text-white">"Content"</span>
                        <p className="text-slate-400">Text, images, code, designs, and other materials</p>
                      </div>
                      <div>
                        <span className="font-bold text-white">"User" / "You"</span>
                        <p className="text-slate-400">Any person accessing the Website</p>
                      </div>
                      <div>
                        <span className="font-bold text-white">"Services"</span>
                        <p className="text-slate-400">Information and functionalities provided on the Website</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Acceptance Section */}
              <motion.section
                id="acceptance"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 lg:p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-green-600/20 text-green-500">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-black">2. Acceptance of Terms</h2>
                    <p className="text-slate-400">Your agreement to these terms</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                    <h3 className="font-bold text-lg mb-3 text-white">Eligibility</h3>
                    <p className="text-slate-300 mb-4">
                      You must be at least <span className="font-bold text-white">18 years of age</span> to use this Website. By using the Website, you represent and warrant that you are of legal age to form a binding contract with us.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-green-600/10 rounded-xl">
                        <div className="text-2xl mb-2">✅</div>
                        <h4 className="font-bold text-sm mb-1">Allowed</h4>
                        <p className="text-xs text-slate-400">Users 18+ years old</p>
                      </div>
                      <div className="text-center p-4 bg-red-600/10 rounded-xl">
                        <div className="text-2xl mb-2">❌</div>
                        <h4 className="font-bold text-sm mb-1">Prohibited</h4>
                        <p className="text-xs text-slate-400">Users under 18 years old</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-3 text-white">Modification of Terms</h3>
                    <p className="text-slate-300 mb-4">
                      We reserve the right to modify these Terms at any time. All changes will be effective immediately upon posting to the Website. Your continued use of the Website following the posting of revised Terms means that you accept and agree to the changes.
                    </p>
                    
                    <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-4">
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-bold text-blue-400 mb-1">Update Notification</h4>
                          <p className="text-sm text-slate-300">
                            We will update the "Last Updated" date at the top of these Terms when changes are made. It is your responsibility to check this page periodically for updates.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Intellectual Property Section */}
              <motion.section
                id="intellectual"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 lg:p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-purple-600/20 text-purple-500">
                    <Code className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-black">3. Intellectual Property Rights</h2>
                    <p className="text-slate-400">Ownership and usage rights</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-white">Ownership</h3>
                    <p className="text-slate-300 mb-4">
                      The Website and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by {companyName}, its licensors, or other providers of such material and are protected by Indian and international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                      <h4 className="font-bold text-lg mb-3 text-green-400">Permitted Uses</h4>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                          <span className="text-sm text-slate-300">View and display content for personal, non-commercial use</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                          <span className="text-sm text-slate-300">Share links to our content via social media</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                          <span className="text-sm text-slate-300">Use contact forms for legitimate inquiries</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                      <h4 className="font-bold text-lg mb-3 text-red-400">Prohibited Uses</h4>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                          <XCircle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                          <span className="text-sm text-slate-300">Copy, modify, or create derivative works</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <XCircle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                          <span className="text-sm text-slate-300">Use trademarks or logos without permission</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <XCircle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                          <span className="text-sm text-slate-300">Reverse engineer or decompile code</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-amber-600/10 border border-amber-500/20 rounded-2xl p-4">
                    <h4 className="font-bold text-amber-400 mb-2">Trademark Notice</h4>
                    <p className="text-sm text-slate-300">
                      "Focitech," the Focitech logo, and all related names, logos, product and service names, designs, and slogans are trademarks of {companyName} or its affiliates or licensors. You must not use such marks without the prior written permission of {companyName}.
                    </p>
                  </div>
                </div>
              </motion.section>

              {/* Acceptable Use Section */}
              <motion.section
                id="use"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 lg:p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-cyan-600/20 text-cyan-500">
                    <Terminal className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-black">4. Acceptable Use</h2>
                    <p className="text-slate-400">Rules for using our website</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <p className="text-slate-300">
                    You agree not to use the Website:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "In any way that violates any applicable law or regulation",
                      "To engage in any conduct that restricts or inhibits anyone's use of the Website",
                      "To impersonate or attempt to impersonate the company, employees, or other users",
                      "To engage in any automated use of the system, such as scraping or data mining",
                      "To introduce viruses, trojan horses, worms, logic bombs, or other malicious material",
                      "To attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of the Website"
                    ].map((prohibition, index) => (
                      <div key={index} className="bg-white/5 border border-white/5 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                          <span className="text-sm text-slate-300">{prohibition}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-4">
                    <h4 className="font-bold text-blue-400 mb-2">Security Requirements</h4>
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-slate-300 mb-2">
                          You are responsible for:
                        </p>
                        <ul className="text-sm text-slate-400 space-y-1 ml-4">
                          <li>• Maintaining the confidentiality of any login credentials</li>
                          <li>• All activities that occur under your account</li>
                          <li>• Notifying us immediately of any unauthorized access</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Limitations Section */}
              <motion.section
                id="liability"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 lg:p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-red-600/20 text-red-500">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-black">5. Limitations of Liability</h2>
                    <p className="text-slate-400">Disclaimer and liability limits</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-white">Disclaimer of Warranties</h3>
                    <p className="text-slate-300 mb-4">
                      THE WEBSITE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. {companyName.toUpperCase()} DISCLAIMS ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                    <h4 className="font-bold text-lg mb-3 text-white">Limitation of Liability</h4>
                    <p className="text-slate-300 mb-4">
                      TO THE FULLEST EXTENT PROVIDED BY LAW, IN NO EVENT WILL {companyName.toUpperCase()}, ITS AFFILIATES, OR THEIR LICENSORS, SERVICE PROVIDERS, EMPLOYEES, AGENTS, OFFICERS, OR DIRECTORS BE LIABLE FOR DAMAGES OF ANY KIND, UNDER ANY LEGAL THEORY, ARISING OUT OF OR IN CONNECTION WITH YOUR USE, OR INABILITY TO USE, THE WEBSITE.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div className="p-4 bg-red-600/10 rounded-xl">
                        <div className="text-2xl font-bold text-red-400 mb-1">Direct</div>
                        <p className="text-xs text-slate-400">Direct damages</p>
                      </div>
                      <div className="p-4 bg-red-600/10 rounded-xl">
                        <div className="text-2xl font-bold text-red-400 mb-1">Indirect</div>
                        <p className="text-xs text-slate-400">Consequential damages</p>
                      </div>
                      <div className="p-4 bg-red-600/10 rounded-xl">
                        <div className="text-2xl font-bold text-red-400 mb-1">Incidental</div>
                        <p className="text-xs text-slate-400">Incidental damages</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-4">
                    <h4 className="font-bold text-blue-400 mb-2">Informational Purpose Only</h4>
                    <p className="text-sm text-slate-300">
                      The content on this Website is for informational purposes only. It does not constitute professional advice. You should not act or refrain from acting on the basis of any content included on this Website without seeking appropriate professional advice.
                    </p>
                  </div>
                </div>
              </motion.section>

              {/* Termination Section */}
              <motion.section
                id="termination"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 lg:p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-orange-600/20 text-orange-500">
                    <XCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-black">6. Termination</h2>
                    <p className="text-slate-400">Suspension and termination rights</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <p className="text-slate-300">
                    We may terminate or suspend your access to the Website immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms.
                  </p>

                  <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                    <h4 className="font-bold text-lg mb-3 text-white">Grounds for Termination</h4>
                    <div className="space-y-3">
                      {[
                        "Violation of these Terms of Service",
                        "Engaging in fraudulent, illegal, or harmful activities",
                        "Attempting to compromise website security",
                        "Creating multiple accounts to circumvent restrictions",
                        "Harassing other users or our employees"
                      ].map((reason, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-sm text-slate-300">{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-green-600/10 border border-green-500/20 rounded-2xl p-4">
                    <h4 className="font-bold text-green-400 mb-2">Effect of Termination</h4>
                    <p className="text-sm text-slate-300">
                      Upon termination, your right to use the Website will immediately cease. All provisions of these Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
                    </p>
                  </div>
                </div>
              </motion.section>

              {/* Governing Law Section */}
              <motion.section
                id="governing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 lg:p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-500">
                    <Scale className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-black">7. Governing Law & Dispute Resolution</h2>
                    <p className="text-slate-400">Legal jurisdiction and conflict resolution</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-white">Governing Law</h3>
                    <p className="text-slate-300 mb-4">
                      These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. The courts located in Bareilly, Uttar Pradesh shall have exclusive jurisdiction over any disputes arising out of or relating to these Terms or the use of the Website.
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                    <h4 className="font-bold text-lg mb-3 text-white">Dispute Resolution Process</h4>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-600/20 rounded-lg">
                          <span className="font-bold text-blue-400">1</span>
                        </div>
                        <div>
                          <h5 className="font-bold text-white mb-1">Informal Resolution</h5>
                          <p className="text-sm text-slate-400">Contact us first to resolve any issues informally</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-600/20 rounded-lg">
                          <span className="font-bold text-blue-400">2</span>
                        </div>
                        <div>
                          <h5 className="font-bold text-white mb-1">Mediation</h5>
                          <p className="text-sm text-slate-400">If unresolved, parties agree to attempt mediation</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-600/20 rounded-lg">
                          <span className="font-bold text-blue-400">3</span>
                        </div>
                        <div>
                          <h5 className="font-bold text-white mb-1">Legal Action</h5>
                          <p className="text-sm text-slate-400">As a last resort, legal proceedings may be initiated</p>
                        </div>
                      </div>
                    </div>
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
                    <h2 className="text-2xl lg:text-3xl font-black">8. Contact Information</h2>
                    <p className="text-slate-400">How to reach us</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                    <h3 className="font-bold text-lg mb-3 text-white">Legal Inquiries</h3>
                    <p className="text-slate-300 mb-4">
                      For any questions about these Terms of Service, please contact our legal team:
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Building className="w-5 h-5 text-cyan-500" />
                        <div>
                          <p className="font-bold text-white">{companyName}</p>
                          <p className="text-sm text-slate-400">Bareilly, Uttar Pradesh, India - 243001</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-cyan-500" />
                        <a href="info.technoviax@gmail.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                          info.technoviax@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-4">
                    <h4 className="font-bold text-blue-400 mb-2">Complete Agreement</h4>
                    <p className="text-sm text-slate-300 mb-3">
                      These Terms constitute the entire agreement between you and {companyName} regarding the Website and supersede all prior and contemporaneous understandings, agreements, representations, and warranties, both written and oral, regarding the Website.
                    </p>
                  </div>

                  <div className="text-center pt-6 border-t border-white/5">
                    <p className="text-slate-400 text-sm">
                      For additional legal information, please refer to our{' '}
                      <a 
                        href="/privacy" 
                        className="text-blue-500 hover:text-blue-400 transition-colors"
                      >
                        Privacy Policy
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
            © {new Date().getFullYear()} {companyName}. All rights reserved. These Terms of Service are effective as of {lastUpdated}.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;