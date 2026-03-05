import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  MapPin, 
  Phone, 
  Github, 
  Linkedin, 
  ExternalLink, 
  Briefcase, 
  GraduationCap, 
  Code2, 
  Rocket,
  X,
  ChevronRight,
  Download,
  Terminal,
  BookOpen,
  Trophy,
  Microscope,
  Search,
  Users,
  Calendar,
  Heart,
  Award as AwardIcon,
  Presentation,
  FileText,
  Globe,
  Menu,
  Share2,
  Youtube,
  Twitter,
  Facebook,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Save,
  Image as ImageIcon,
  Type as TypeIcon
} from 'lucide-react';
import { CVData, initialCVData, BlogPost } from './types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import Markdown from 'react-markdown';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [cvData, setCvData] = useState<CVData>(initialCVData);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedImage, setSelectedImage] = useState<{ url: string; caption: string } | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(null);
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
  const [galleryFilter, setGalleryFilter] = useState<string>('All');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/cv')
      .then(res => res.json())
      .then(data => setCvData(data))
      .catch(err => console.error('Failed to fetch CV data:', err));
    
    const token = localStorage.getItem('adminToken');
    if (token) setIsAdmin(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: loginUsername,
          password: loginPassword 
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsAdmin(true);
        setShowLoginModal(false);
        localStorage.setItem('adminToken', data.token);
      } else {
        alert(data.error || 'Invalid credentials');
      }
    } catch (err) {
      alert('Login failed');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('adminToken');
  };

  const saveChanges = async (newData: CVData) => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
      });
      if (res.ok) {
        setCvData(newData);
      } else {
        alert('Failed to save changes');
      }
    } catch (err) {
      alert('Error saving changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, onUploadSuccess: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        onUploadSuccess(data.url);
      } else {
        alert('Upload failed');
      }
    } catch (err) {
      alert('Error uploading file');
    }
  };

  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'research', label: 'Research' },
    { id: 'leadership', label: 'Leadership' },
    { id: 'awards', label: 'Awards' },
    { id: 'skills', label: 'Skills' },
    { id: 'blog', label: 'Blog' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'youtube', label: 'YouTube' },
    { id: 'contact', label: 'Contact' },
  ];

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveTab(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    tabs.forEach((tab) => {
      const element = document.getElementById(tab.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [tabs]);

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 120;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-4 md:top-8 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl">
        <div className="bg-white/80 backdrop-blur-2xl border border-white/20 shadow-2xl shadow-zinc-200/50 rounded-3xl md:rounded-full px-4 md:px-8 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-serif italic text-sm shadow-lg">
              {cvData.name.charAt(0)}
            </div>
            <span className="font-bold tracking-tight text-sm hidden sm:block">{cvData.name}</span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1 md:gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className={cn(
                  "px-4 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                  activeTab === tab.id 
                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" 
                    : "text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50"
                )}
              >
                {tab.label}
              </button>
            ))}
            <div className="w-px h-6 bg-zinc-100 mx-2" />
            {isAdmin ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-red-600 hover:bg-red-50 transition-all"
              >
                <LogOut size={14} />
                Logout
              </button>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-indigo-600 hover:bg-indigo-50 transition-all"
              >
                <Settings size={14} />
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-3 rounded-2xl bg-zinc-50 text-zinc-900 hover:bg-zinc-100 transition-colors"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-24 left-0 right-0 lg:hidden bg-white/90 backdrop-blur-2xl border border-zinc-100 rounded-[2.5rem] shadow-2xl p-6 overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-3">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => scrollToSection(tab.id)}
                    className={cn(
                      "flex items-center justify-center px-4 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all",
                      activeTab === tab.id 
                        ? "bg-indigo-600 text-white shadow-lg" 
                        : "bg-zinc-50 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
                <button
                  onClick={isAdmin ? handleLogout : () => { setShowLoginModal(true); setIsMenuOpen(false); }}
                  className={cn(
                    "col-span-2 flex items-center justify-center gap-2 px-4 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all",
                    isAdmin ? "bg-red-50 text-red-600" : "bg-indigo-50 text-indigo-600"
                  )}
                >
                  {isAdmin ? <LogOut size={14} /> : <Settings size={14} />}
                  {isAdmin ? 'Logout' : 'Admin Login'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-24 md:pt-40 pb-20 space-y-16 md:space-y-32">
        {/* Home Section */}
        <div id="home" className="space-y-12 md:space-y-24 scroll-mt-32">
          {/* Hero Section */}
          <section className="relative group">
            {isAdmin && (
              <button 
                onClick={() => setEditingSection('hero')}
                className="absolute -top-4 -right-4 p-3 bg-indigo-600 text-white rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all z-20"
              >
                <Settings size={16} />
              </button>
            )}
                  <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 md:gap-16 items-center">
                    <div className="space-y-8 md:space-y-12">
                      <div className="space-y-6 md:space-y-8">
                        <h1 className="text-4xl sm:text-6xl md:text-7xl font-sans font-bold tracking-tight leading-tight text-zinc-900">
                          <span className="text-zinc-900">{cvData.name}</span>
                        </h1>
                        <div className="space-y-3">
                          <p className="text-lg md:text-xl text-zinc-500 font-light max-w-xl leading-relaxed">
                            {cvData.title}
                          </p>
                          <p className="text-sm text-indigo-400 font-medium italic">
                            Current Position: {cvData.education[0].degree}, {cvData.education[0].school.split(',')[0]}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-8">
                        <div className="flex flex-wrap gap-8 text-sm font-medium text-zinc-400">
                          <a href={`mailto:${cvData.email}`} className="flex items-center gap-2 hover:text-indigo-600 transition-colors group">
                            <div className="w-10 h-10 rounded-full border border-zinc-100 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                              <Mail size={18} />
                            </div>
                            <span>{cvData.email}</span>
                          </a>
                        </div>
                        
                        <div className="flex flex-wrap gap-4">
                          {cvData.orcid && (
                            <a 
                              href={`https://orcid.org/${cvData.orcid}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-5 py-2.5 rounded-full border border-zinc-200 bg-white text-[10px] font-bold uppercase tracking-widest text-zinc-600 hover:border-[#A6CE39] hover:bg-[#A6CE39]/5 hover:text-[#A6CE39] hover:-translate-y-0.5 transition-all flex items-center gap-2 shadow-sm hover:shadow-md group"
                            >
                              <AwardIcon size={12} className="group-hover:scale-110 transition-transform" />
                              ORCID
                            </a>
                          )}
                          {cvData.profiles.map((profile, idx) => (
                            <a 
                              key={idx} 
                              href={profile.url} 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-5 py-2.5 rounded-full border border-zinc-200 bg-white text-[10px] font-bold uppercase tracking-widest text-zinc-600 hover:border-indigo-600 hover:bg-indigo-50/50 hover:text-indigo-600 hover:-translate-y-0.5 transition-all flex items-center gap-2 shadow-sm hover:shadow-md group"
                            >
                              {profile.label.toLowerCase().includes('scholar') ? <GraduationCap size={12} className="group-hover:scale-110 transition-transform" /> :
                               profile.label.toLowerCase().includes('linkedin') ? <Linkedin size={12} className="group-hover:scale-110 transition-transform" /> :
                               profile.label.toLowerCase().includes('github') ? <Github size={12} className="group-hover:scale-110 transition-transform" /> :
                               profile.label.toLowerCase().includes('youtube') ? <Youtube size={12} className="group-hover:scale-110 transition-transform" /> :
                               profile.label.toLowerCase().includes('researchgate') ? <Microscope size={12} className="group-hover:scale-110 transition-transform" /> :
                               <Globe size={12} className="group-hover:scale-110 transition-transform" />}
                              {profile.label}
                            </a>
                          ))}
                          <button 
                            onClick={() => cvData.cvUrl && window.open(cvData.cvUrl, '_blank')}
                            className="px-5 py-2.5 rounded-full bg-indigo-600 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-indigo-700 hover:-translate-y-0.5 transition-all flex items-center gap-2 shadow-xl shadow-indigo-600/20"
                          >
                            <Download size={12} />
                            Download CV (PDF)
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="relative aspect-[4/5] bg-zinc-100 rounded-2xl overflow-hidden group shadow-xl border border-zinc-200">
                      <img 
                        src={cvData.profileImage || `https://picsum.photos/seed/${cvData.name}/800/1000`} 
                        alt={cvData.name}
                        className="w-full h-full object-cover transition-all duration-700"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                </section>

                {/* Academic Bio */}
                <section className="relative group grid lg:grid-cols-[1fr_2fr] gap-12 items-start">
                  {isAdmin && (
                    <button 
                      onClick={() => setEditingSection('hero')}
                      className="absolute -top-4 -right-4 p-3 bg-indigo-600 text-white rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all z-20"
                    >
                      <Settings size={16} />
                    </button>
                  )}
                  <div className="space-y-6">
                    <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-600 flex items-center gap-2">
                      <Search size={14} />
                      Academic Bio
                    </h2>
                    <div className="w-12 h-px bg-zinc-200" />
                  </div>
                  <div className="space-y-4">
                    <p className="text-lg md:text-xl font-sans leading-relaxed text-zinc-700">
                      {cvData.summary}
                    </p>
                  </div>
                </section>

                {/* Education Section at bottom of Home */}
                <section className="relative group grid lg:grid-cols-[1fr_2fr] gap-8 border-t border-zinc-100 pt-16 md:pt-24">
                  {isAdmin && (
                    <button 
                      onClick={() => setEditingSection('education')}
                      className="absolute -top-4 -right-4 p-3 bg-indigo-600 text-white rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all z-20"
                    >
                      <Settings size={16} />
                    </button>
                  )}
                  <div className="space-y-4">
                    <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-600 flex items-center gap-2">
                      <GraduationCap size={14} />
                      Education
                    </h2>
                    <div className="w-12 h-px bg-zinc-200" />
                  </div>
                  <div className="space-y-10">
                    {cvData.education.map((edu, idx) => (
                      <div key={idx} className="space-y-3">
                        <div className="flex justify-between items-baseline">
                          <h3 className="text-xl font-serif font-medium text-zinc-900">{edu.degree}</h3>
                          <span className="text-xs font-mono text-zinc-400">{edu.period}</span>
                        </div>
                        <p className="text-indigo-600/60 font-medium flex items-center gap-2">
                          <GraduationCap size={16} />
                          {edu.url ? (
                            <a href={edu.url} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-800 transition-colors underline decoration-indigo-200 underline-offset-4">
                              {edu.school}
                            </a>
                          ) : (
                            edu.school
                          )}
                        </p>
                        {edu.description && (
                          <div className="text-zinc-600 text-base leading-relaxed italic border-l-2 border-zinc-100 pl-4 prose prose-indigo max-w-none">
                            <Markdown>{edu.description}</Markdown>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                {/* Teaching */}
                <section className="relative group grid lg:grid-cols-[1fr_2fr] gap-8 border-t border-zinc-100 pt-16 md:pt-24">
                  {isAdmin && (
                    <button 
                      onClick={() => setEditingSection('teaching')}
                      className="absolute -top-4 -right-4 p-3 bg-indigo-600 text-white rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all z-20"
                    >
                      <Settings size={16} />
                    </button>
                  )}
                  <div className="space-y-4">
                    <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-600 flex items-center gap-2">
                      <BookOpen size={14} />
                      Teaching Experience
                    </h2>
                    <div className="w-12 h-px bg-zinc-200" />
                  </div>
                  <div className="space-y-8">
                    {cvData.teaching.map((item, idx) => (
                      <div key={idx} className="p-6 md:p-8 rounded-[2rem] bg-zinc-50 border border-zinc-100 hover:bg-white hover:border-indigo-100 transition-all group">
                        <h3 className="text-xl font-serif font-medium text-zinc-900 mb-3 group-hover:text-indigo-600 transition-colors">{item.role}</h3>
                        <p className="text-zinc-600 leading-relaxed text-base">{item.details}</p>
                      </div>
                    ))}
                  </div>
                </section>
        </div>

        {/* Research Section */}
        <div id="research" className="space-y-12 md:space-y-24 scroll-mt-32">
          {/* Research Interests */}
                <section className="relative group grid lg:grid-cols-[1fr_2fr] gap-8">
                  {isAdmin && (
                    <button 
                      onClick={() => setEditingSection('research_interests')}
                      className="absolute -top-4 -right-4 p-3 bg-indigo-600 text-white rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all z-20"
                    >
                      <Settings size={16} />
                    </button>
                  )}
                  <div className="space-y-6">
                    <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-600 flex items-center gap-2">
                      <Microscope size={14} />
                      Research Interests
                    </h2>
                    <div className="w-12 h-px bg-zinc-200" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cvData.researchInterests.map((interest, idx) => (
                      <div key={idx} className="p-6 rounded-[1.5rem] bg-white border border-zinc-100 shadow-sm hover:shadow-xl hover:shadow-zinc-200/50 transition-all group flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors flex-shrink-0">
                          <Microscope size={18} />
                        </div>
                        <div className="space-y-1">
                          <span className="text-base font-serif font-medium text-zinc-900">{interest}</span>
                          <p className="text-[10px] text-zinc-400 leading-relaxed">Exploring advanced methodologies in {interest.toLowerCase()}.</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Research Experience */}
                <section className="relative group grid lg:grid-cols-[1fr_2fr] gap-8">
                  {isAdmin && (
                    <button 
                      onClick={() => setEditingSection('experience')}
                      className="absolute -top-4 -right-4 p-3 bg-indigo-600 text-white rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all z-20"
                    >
                      <Settings size={16} />
                    </button>
                  )}
                  <div className="space-y-6">
                    <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-600 flex items-center gap-2">
                      <Briefcase size={14} />
                      Research Experience
                    </h2>
                    <div className="w-12 h-px bg-zinc-200" />
                  </div>
                  <div className="space-y-12">
                    {cvData.experiences.map((exp, idx) => (
                      <div key={idx} className="group">
                        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-1 mb-4">
                          <h3 className="text-xl font-serif font-medium text-zinc-900 group-hover:translate-x-2 transition-transform duration-300">
                            {exp.role}
                          </h3>
                          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">{exp.period}</span>
                        </div>
                        <p className="text-indigo-600/60 font-medium mb-4 flex items-center gap-2">
                          <Microscope size={14} />
                          {exp.url ? (
                            <a href={exp.url} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-800 transition-colors underline decoration-indigo-200 underline-offset-4">
                              {exp.company}
                            </a>
                          ) : (
                            exp.company
                          )}
                        </p>
                        <ul className="space-y-3">
                          {exp.description.map((item, i) => (
                            <li key={i} className="flex gap-3 text-zinc-600 leading-relaxed text-base">
                              <span className="text-zinc-200 mt-2 w-1.5 h-1.5 rounded-full bg-zinc-200 flex-shrink-0" />
                              <div className="prose prose-sm prose-indigo max-w-none">
                                <Markdown>{item}</Markdown>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Publications */}
                <section className="relative group grid lg:grid-cols-[1fr_2fr] gap-8">
                  {isAdmin && (
                    <button 
                      onClick={() => setEditingSection('publications')}
                      className="absolute -top-4 -right-4 p-3 bg-indigo-600 text-white rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all z-20"
                    >
                      <Settings size={16} />
                    </button>
                  )}
                  <div className="space-y-6">
                    <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-600 flex items-center gap-2">
                      <FileText size={14} />
                      Publications
                    </h2>
                    <div className="w-12 h-px bg-zinc-200" />
                  </div>
                  <div className="space-y-6">
                    {cvData.publications.map((pub, idx) => (
                      <div 
                        key={idx}
                        className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100 hover:bg-white hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-600/5 transition-all group"
                      >
                        <div className="space-y-3">
                          <div className="flex justify-between items-start gap-4">
                            <h3 className="text-lg font-serif font-medium leading-snug text-zinc-900">
                              {pub.link ? (
                                <a href={pub.link} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">
                                  "{pub.title}"
                                </a>
                              ) : (
                                `"${pub.title}"`
                              )}
                            </h3>
                            {pub.impactFactor && (
                              <div className="px-3 py-1 rounded-full bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider flex-shrink-0">
                                IF: {pub.impactFactor}
                              </div>
                            )}
                          </div>
                          <p className="text-indigo-600/40 text-sm italic">{pub.authors}</p>
                          {pub.doi && (
                            <p className="text-[10px] font-mono text-zinc-400">
                              DOI: <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">{pub.doi}</a>
                            </p>
                          )}
                          <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                            <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                              <BookOpen size={14} />
                              {pub.journal} • {pub.year}
                            </div>
                            {pub.link && (
                              <a href={pub.link} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-900 transition-colors">
                                <ExternalLink size={18} />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Working Papers */}
                <section className="relative group grid lg:grid-cols-[1fr_2fr] gap-8">
                  {isAdmin && (
                    <button 
                      onClick={() => setEditingSection('workingPapers')}
                      className="absolute -top-4 -right-4 p-3 bg-indigo-600 text-white rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all z-20"
                    >
                      <Settings size={16} />
                    </button>
                  )}
                  <div className="space-y-6">
                    <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-600 flex items-center gap-2">
                      <FileText size={14} />
                      Working Papers
                    </h2>
                    <div className="w-12 h-px bg-zinc-200" />
                  </div>
                  <div className="space-y-4">
                    {cvData.workingPapers.map((paper, idx) => (
                      <div key={idx} className="flex gap-3 items-start p-6 rounded-2xl border border-zinc-100 bg-white shadow-sm">
                        <FileText className="text-indigo-200 mt-1" size={20} />
                        <p className="text-lg font-serif italic text-zinc-700 leading-relaxed">{paper}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Conference Presentations */}
                <section className="relative group grid lg:grid-cols-[1fr_2fr] gap-8">
                  {isAdmin && (
                    <button 
                      onClick={() => setEditingSection('conferences')}
                      className="absolute -top-4 -right-4 p-3 bg-indigo-600 text-white rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all z-20"
                    >
                      <Settings size={16} />
                    </button>
                  )}
                  <div className="space-y-6">
                    <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-600 flex items-center gap-2">
                      <Presentation size={14} />
                      Conference Presentations
                    </h2>
                    <div className="w-12 h-px bg-zinc-200" />
                  </div>
                  <div className="space-y-6">
                    {cvData.conferences.map((conf, idx) => (
                      <div key={idx} className="flex gap-4 items-start p-5 rounded-xl bg-zinc-50 border border-zinc-100">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0 shadow-sm">
                          <Presentation className="text-indigo-400" size={16} />
                        </div>
                        <p className="text-zinc-600 leading-relaxed text-base">{conf}</p>
                      </div>
                    ))}
                  </div>
                </section>
        </div>

        {/* Leadership Section */}
        <div id="leadership" className="space-y-12 md:space-y-24 scroll-mt-32">
          <section className="relative group grid lg:grid-cols-[1fr_2fr] gap-8">
            {isAdmin && (
              <button 
                onClick={() => setEditingSection('leadership')}
                className="absolute -top-4 -right-4 p-3 bg-indigo-600 text-white rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all z-20"
              >
                <Settings size={16} />
              </button>
            )}
                  <div className="space-y-6">
                    <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-600 flex items-center gap-2">
                      <Users size={14} />
                      Leadership Roles
                    </h2>
                    <div className="w-12 h-px bg-zinc-200" />
                  </div>
                  <div className="space-y-8">
                    {cvData.leadership.map((lead, idx) => (
                      <div key={idx} className="p-6 rounded-[2rem] bg-white border border-zinc-100 shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row gap-6 items-start">
                        {lead.logo && (
                          <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-zinc-100">
                            <img src={lead.logo} alt={lead.organization} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        )}
                        <div className="flex-1 space-y-3">
                          <div className="flex justify-between items-baseline flex-wrap gap-2">
                            <h3 className="text-xl font-serif font-medium text-indigo-600">{lead.organization}</h3>
                            <span className="text-xs font-mono text-zinc-400">{lead.period}</span>
                          </div>
                          <p className="text-zinc-500 italic flex items-center gap-2 text-base">
                            <Users size={16} className="text-indigo-200" />
                            {lead.role}
                          </p>
                          {lead.description && (
                            <p className="text-sm text-zinc-400 leading-relaxed">{lead.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="relative group grid lg:grid-cols-[1fr_2fr] gap-8">
                  {isAdmin && (
                    <button 
                      onClick={() => setEditingSection('eventCoordination')}
                      className="absolute -top-4 -right-4 p-3 bg-indigo-600 text-white rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all z-20"
                    >
                      <Settings size={16} />
                    </button>
                  )}
                  <div className="space-y-6">
                    <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-600 flex items-center gap-2">
                      <Rocket size={14} />
                      Key Scientific Coordination
                    </h2>
                    <div className="w-12 h-px bg-zinc-200" />
                  </div>
                  <div className="space-y-4">
                    {cvData.eventCoordination.map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-start p-5 rounded-xl bg-zinc-50 border border-zinc-100 group hover:border-indigo-600 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          <Rocket size={16} className="text-indigo-400 group-hover:text-white" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between items-baseline gap-4">
                            <p className="font-serif text-base text-zinc-800">{item.event}</p>
                            <span className="text-xs font-mono text-zinc-400">{item.year}</span>
                          </div>
                          <p className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold">{item.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="relative group grid lg:grid-cols-[1fr_2fr] gap-8">
                  {isAdmin && (
                    <button 
                      onClick={() => setEditingSection('volunteering')}
                      className="absolute -top-4 -right-4 p-3 bg-indigo-600 text-white rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all z-20"
                    >
                      <Settings size={16} />
                    </button>
                  )}
                  <div className="space-y-6">
                    <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-600 flex items-center gap-2">
                      <Heart size={14} />
                      Community Engagement
                    </h2>
                    <div className="w-12 h-px bg-zinc-200" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {cvData.volunteering.map((item, idx) => (
                      <div key={idx} className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100 flex gap-3 items-start">
                        <Heart size={18} className="text-indigo-300 mt-1 flex-shrink-0" />
                        <p className="text-zinc-600 leading-relaxed text-sm">{item}</p>
                      </div>
                    ))}
                  </div>
                </section>
        </div>

        {/* Awards Section */}
        <div id="awards" className="space-y-12 md:space-y-24 scroll-mt-32">
          <section className="relative group grid lg:grid-cols-[1fr_2fr] gap-8">
            {isAdmin && (
              <button 
                onClick={() => setEditingSection('awards')}
                className="absolute -top-4 -right-4 p-3 bg-indigo-600 text-white rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all z-20"
              >
                <Settings size={16} />
              </button>
            )}
                <div className="space-y-6">
                  <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-600 flex items-center gap-2">
                    <Trophy size={14} />
                    Honors & Awards
                  </h2>
                  <div className="w-12 h-px bg-zinc-200" />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {cvData.awards.map((award, idx) => (
                    <div key={idx} className="p-6 rounded-[2rem] bg-white border border-zinc-100 shadow-sm hover:shadow-xl transition-all group">
                      <div className="text-xs font-mono text-amber-500/60 mb-3 tracking-widest">{award.year}</div>
                      <h3 className="text-lg font-serif font-medium text-zinc-900 mb-3 flex items-center gap-3 group-hover:text-indigo-600 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
                          <AwardIcon size={16} />
                        </div>
                        {award.title}
                      </h3>
                      <p className="text-zinc-500 leading-relaxed text-xs">{award.details}</p>
                    </div>
                  ))}
                </div>
              </section>
        </div>

        {/* Skills Section */}
        <div id="skills" className="space-y-12 md:space-y-24 scroll-mt-32">
          <section className="relative group grid lg:grid-cols-[1fr_2fr] gap-8">
            {isAdmin && (
              <button 
                onClick={() => setEditingSection('skills')}
                className="absolute -top-4 -right-4 p-3 bg-indigo-600 text-white rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all z-20"
              >
                <Settings size={16} />
              </button>
            )}
                  <div className="space-y-6">
                    <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-600 flex items-center gap-2">
                      <Terminal size={14} />
                      Skills & Training
                    </h2>
                    <div className="w-12 h-px bg-zinc-200" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-8 rounded-[2rem] bg-indigo-600 text-white space-y-6 shadow-xl shadow-indigo-600/20">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                          <Microscope size={20} />
                        </div>
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] opacity-60">Technical Skills</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {cvData.skills.instrumental.map((skill, i) => (
                          <span key={i} className="px-3 py-1.5 rounded-lg bg-white/10 text-[10px] font-medium hover:bg-white hover:text-indigo-600 transition-all">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-8 rounded-[2rem] bg-indigo-50/30 border border-indigo-100 shadow-sm space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                          <Code2 size={20} />
                        </div>
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600/60">Computational Skills</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {[...cvData.skills.software, ...cvData.skills.statistical].map((skill, i) => (
                          <span key={i} className="px-3 py-1.5 rounded-lg bg-white text-[10px] font-medium text-indigo-600 border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                <section className="relative group grid lg:grid-cols-[1fr_2fr] gap-8">
                  {isAdmin && (
                    <button 
                      onClick={() => setEditingSection('workshops')}
                      className="absolute -top-4 -right-4 p-3 bg-indigo-600 text-white rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all z-20"
                    >
                      <Settings size={16} />
                    </button>
                  )}
                  <div className="space-y-6">
                    <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-600 flex items-center gap-2">
                      <BookOpen size={14} />
                      Training & Workshops
                    </h2>
                    <div className="w-12 h-px bg-zinc-200" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {cvData.workshops.map((ws, idx) => (
                      <div key={idx} className="p-6 rounded-2xl border border-zinc-100 bg-white space-y-3 group hover:border-indigo-600 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <p className="font-serif text-base text-zinc-800">{ws.title}</p>
                            <p className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold">{ws.provider}</p>
                          </div>
                          <span className="text-xs font-mono text-zinc-300 group-hover:text-indigo-600 transition-colors">{ws.year}</span>
                        </div>
                        {ws.certificateUrl && (
                          <button 
                            onClick={() => setSelectedCertificate(ws.certificateUrl!)}
                            className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
                          >
                            <FileText size={12} />
                            View Certificate
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
        </div>

        {/* Blog Section */}
        <div id="blog" className="space-y-12 md:space-y-24 scroll-mt-32">
          <section className="relative group grid lg:grid-cols-[1fr_2fr] gap-8">
            {isAdmin && (
              <button 
                onClick={() => setEditingSection('blog')}
                className="absolute -top-4 -right-4 p-3 bg-indigo-600 text-white rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all z-20"
              >
                <Settings size={16} />
              </button>
            )}
                <div className="space-y-6">
                  <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-600 flex items-center gap-2">
                    <FileText size={14} />
                    Academic Blog
                  </h2>
                  <div className="w-12 h-px bg-zinc-200" />
                  <p className="text-sm text-zinc-400 leading-relaxed">Reflections on research, PhD applications, and the future of nanotechnology.</p>
                </div>
                <div className="space-y-8">
                  {cvData.blogPosts.map((post, idx) => (
                    <div key={idx} className="group cursor-pointer grid md:grid-cols-[200px_1fr] gap-6 items-start">
                      {post.imageUrl && (
                        <div className="aspect-video rounded-xl overflow-hidden border border-zinc-100 flex-shrink-0">
                          <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                        </div>
                      )}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 rounded-full bg-indigo-50 text-[10px] font-bold uppercase tracking-widest text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                            {post.category}
                          </span>
                          <span className="text-[10px] font-mono text-indigo-300 uppercase tracking-widest">{post.date}</span>
                        </div>
                        <h3 className="text-2xl font-serif font-medium text-zinc-900 group-hover:text-indigo-600 transition-colors leading-tight">
                          {post.title}
                        </h3>
                        <p className="text-zinc-500 leading-relaxed text-base max-w-2xl">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-6">
                          <button 
                            onClick={() => setSelectedBlogPost(post)}
                            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-800 transition-all"
                          >
                            Read Full Article <ChevronRight size={14} />
                          </button>
                          <div className="flex items-center gap-3 border-l border-zinc-100 pl-6">
                            <button 
                              onClick={() => {
                                if (navigator.share) {
                                  navigator.share({
                                    title: post.title,
                                    text: post.excerpt,
                                    url: window.location.href,
                                  });
                                } else {
                                  alert('Copying link to clipboard');
                                  navigator.clipboard.writeText(window.location.href);
                                }
                              }}
                              className="p-2 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
                              title="Share Article"
                            >
                              <Share2 size={16} />
                            </button>
                            <a 
                              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-zinc-400 hover:text-sky-500 hover:bg-sky-50 rounded-full transition-all"
                            >
                              <Twitter size={16} />
                            </a>
                            <a 
                              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-zinc-400 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-all"
                            >
                              <Linkedin size={16} />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
        </div>

        {/* Gallery Section */}
        <div id="gallery" className="space-y-12 md:space-y-24 scroll-mt-32">
          <section className="relative group space-y-8">
            {isAdmin && (
              <button 
                onClick={() => setEditingSection('gallery')}
                className="absolute -top-4 -right-4 p-3 bg-indigo-600 text-white rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all z-20"
              >
                <Settings size={16} />
              </button>
            )}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                  <div className="space-y-3">
                    <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-600 flex items-center gap-2">
                      <Globe size={14} />
                      Photo Gallery
                    </h2>
                    <h3 className="text-2xl font-sans font-bold text-zinc-900">Captured Moments</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['All', 'Campus Sunrise', 'Nature', 'Conference', 'Lab', 'Cycling'].map((cat) => (
                      <button 
                        key={cat} 
                        onClick={() => setGalleryFilter(cat)}
                        className={cn(
                          "px-4 py-2 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-all",
                          galleryFilter === cat 
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20" 
                            : "border-zinc-100 text-zinc-400 hover:border-indigo-600 hover:text-indigo-600"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {cvData.gallery
                    .filter(item => galleryFilter === 'All' || item.category === galleryFilter)
                    .map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedImage(item)}
                        className={cn(
                          "group relative rounded-[1.5rem] overflow-hidden cursor-pointer shadow-xl shadow-zinc-200/50",
                          idx % 3 === 0 ? "md:col-span-2 aspect-[16/9]" : "aspect-square"
                        )}
                      >
                      <img
                        src={item.url}
                        alt={item.caption}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 via-indigo-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-2">{item.category}</span>
                        <p className="text-white text-xs font-bold uppercase tracking-[0.2em] translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          {item.caption}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
        </div>

        {/* YouTube Section */}
        <div id="youtube" className="space-y-12 md:space-y-24 scroll-mt-32">
          <section className="relative group grid lg:grid-cols-[1fr_2fr] gap-8 md:gap-16">
            {isAdmin && (
              <button 
                onClick={() => setEditingSection('youtube')}
                className="absolute -top-4 -right-4 p-3 bg-indigo-600 text-white rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all z-20"
              >
                <Settings size={16} />
              </button>
            )}
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-600 flex items-center gap-2">
                  <Youtube size={14} />
                  YouTube Channel
                </h2>
                <div className="w-12 h-px bg-zinc-200" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-sans font-bold text-zinc-900 leading-tight">Science & Research Insights</h3>
                <p className="text-zinc-500 leading-relaxed text-base">
                  Join me on my YouTube channel where I share insights into nanotechnology, PhD life, and research methodologies.
                </p>
                <a 
                  href="https://www.youtube.com/@mahmudshareef9386" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-red-600 text-white rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-red-700 transition-all shadow-xl shadow-red-600/20"
                >
                  <Youtube size={16} />
                  Subscribe to Channel
                </a>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {cvData.youtubeVideos.map((video, idx) => (
                <div key={idx} className="group relative rounded-[2rem] overflow-hidden bg-white border border-zinc-100 shadow-sm hover:shadow-2xl transition-all">
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`} 
                      alt={video.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center text-red-600 shadow-2xl scale-90 group-hover:scale-100 transition-transform duration-500">
                        <Youtube size={24} fill="currentColor" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    <h4 className="text-lg font-serif font-medium text-zinc-900 leading-tight group-hover:text-red-600 transition-colors">
                      {video.title}
                    </h4>
                    <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                      <span>{video.views} views</span>
                      <span className="w-1 h-1 rounded-full bg-zinc-200" />
                      <span>{video.date}</span>
                    </div>
                  </div>
                  <a 
                    href={`https://www.youtube.com/watch?v=${video.id}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="absolute inset-0 z-10"
                  >
                    <span className="sr-only">Watch on YouTube</span>
                  </a>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Contact Section */}
        <div id="contact" className="space-y-12 md:space-y-24 scroll-mt-32">
          <section className="grid lg:grid-cols-[1fr_2fr] gap-8 md:gap-16">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-600 flex items-center gap-2">
                      <Mail size={14} />
                      Contact Information
                    </h2>
                    <div className="w-12 h-px bg-zinc-200" />
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Professional Email</p>
                      <a href={`mailto:${cvData.email}`} className="text-lg font-serif text-zinc-900 hover:text-indigo-600 transition-colors">{cvData.email}</a>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Location</p>
                      <p className="text-lg font-serif text-zinc-900">{cvData.location}</p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {cvData.orcid && (
                        <a href={`https://orcid.org/${cvData.orcid}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-zinc-100 flex items-center justify-center text-zinc-400 hover:bg-[#A6CE39] hover:text-white transition-all hover:-translate-y-1 shadow-sm">
                          <AwardIcon size={20} />
                        </a>
                      )}
                      {cvData.profiles.map((p, i) => (
                        <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-zinc-100 flex items-center justify-center text-zinc-400 hover:bg-indigo-600 hover:text-white transition-all hover:-translate-y-1 shadow-sm">
                          {p.label.toLowerCase().includes('linkedin') ? <Linkedin size={20} /> : 
                           p.label.toLowerCase().includes('github') ? <Github size={20} /> :
                           p.label.toLowerCase().includes('youtube') ? <Youtube size={20} /> :
                           p.label.toLowerCase().includes('scholar') ? <GraduationCap size={20} /> :
                           p.label.toLowerCase().includes('researchgate') ? <Microscope size={20} /> :
                           <Globe size={20} />}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-50 p-8 md:p-12 rounded-[2rem] border border-zinc-100">
                  <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Full Name</label>
                        <input type="text" className="w-full px-5 py-3 rounded-xl bg-white border border-zinc-100 focus:border-indigo-600 outline-none transition-all" placeholder="John Doe" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Email Address</label>
                        <input type="email" className="w-full px-5 py-3 rounded-xl bg-white border border-zinc-100 focus:border-indigo-600 outline-none transition-all" placeholder="john@example.com" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Message</label>
                      <textarea className="w-full px-5 py-3 rounded-xl bg-white border border-zinc-100 focus:border-indigo-600 outline-none transition-all h-32 resize-none" placeholder="How can we collaborate?" />
                    </div>
                    <button className="w-full py-4 rounded-full bg-indigo-600 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20">
                      Send Message
                    </button>
                  </form>
                </div>
              </section>
        </div>

        {/* Footer */}
        <footer className="pt-16 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-2 text-center md:text-left">
            <div className="text-xl font-serif italic text-zinc-900">{cvData.name}</div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
              © {new Date().getFullYear()} • PhD Portfolio
            </div>
          </div>
          <div className="flex flex-wrap gap-6 md:gap-8">
            {cvData.orcid && (
              <a href={`https://orcid.org/${cvData.orcid}`} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-[#A6CE39] transition-all hover:-translate-y-1 text-xs font-bold uppercase tracking-widest">
                ORCID
              </a>
            )}
            {cvData.profiles.map((p, i) => (
              <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-indigo-600 transition-all hover:-translate-y-1 text-xs font-bold uppercase tracking-widest">
                {p.label}
              </a>
            ))}
          </div>
        </footer>
      </main>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 md:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="absolute inset-0 bg-indigo-950/95 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-2xl"
            >
              <img
                src={selectedImage.url}
                alt={selectedImage.caption}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white text-lg font-serif italic">{selectedImage.caption}</p>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md"
              >
                <X size={24} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Certificate Modal */}
      <AnimatePresence>
        {selectedCertificate && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 md:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCertificate(null)}
              className="absolute inset-0 bg-indigo-950/95 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl"
            >
              <img
                src={selectedCertificate}
                alt="Certificate"
                className="w-full h-auto"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setSelectedCertificate(null)}
                className="absolute top-6 right-6 p-3 bg-black/10 hover:bg-black/20 text-black rounded-full transition-colors backdrop-blur-md"
              >
                <X size={24} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Blog Post Modal */}
      <AnimatePresence>
        {selectedBlogPost && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 md:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBlogPost(null)}
              className="absolute inset-0 bg-indigo-950/95 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-[3rem] overflow-y-auto shadow-2xl p-8 md:p-16"
            >
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 rounded-full bg-indigo-50 text-[10px] font-bold uppercase tracking-widest text-indigo-600">
                    {selectedBlogPost.category}
                  </span>
                  <span className="text-[10px] font-mono text-indigo-300 uppercase tracking-widest">{selectedBlogPost.date}</span>
                  <div className="ml-auto flex items-center gap-2">
                    <button 
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: selectedBlogPost.title,
                            text: selectedBlogPost.excerpt,
                            url: window.location.href,
                          });
                        } else {
                          navigator.clipboard.writeText(window.location.href);
                          alert('Link copied to clipboard');
                        }
                      }}
                      className="p-2 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
                    >
                      <Share2 size={18} />
                    </button>
                    <a 
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(selectedBlogPost.title)}&url=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-zinc-400 hover:text-sky-500 hover:bg-sky-50 rounded-full transition-all"
                    >
                      <Twitter size={18} />
                    </a>
                    <a 
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-zinc-400 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-all"
                    >
                      <Linkedin size={18} />
                    </a>
                  </div>
                </div>
                <h2 className="text-4xl md:text-5xl font-serif font-medium text-zinc-900 leading-tight">
                  {selectedBlogPost.title}
                </h2>
                {selectedBlogPost.imageUrl && (
                  <div className="aspect-video rounded-3xl overflow-hidden border border-zinc-100">
                    <img src={selectedBlogPost.imageUrl} alt={selectedBlogPost.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}
                <div className="prose prose-indigo max-w-none">
                  <p className="text-zinc-600 text-xl leading-relaxed font-serif italic mb-8">
                    {selectedBlogPost.excerpt}
                  </p>
                  <div className="text-zinc-700 leading-relaxed text-lg space-y-6">
                    {selectedBlogPost.content}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedBlogPost(null)}
                className="sticky bottom-0 mt-12 w-full py-4 bg-indigo-600 text-white rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20"
              >
                Close Article
              </button>
              <button
                onClick={() => setSelectedBlogPost(null)}
                className="absolute top-8 right-8 p-3 bg-zinc-50 hover:bg-zinc-100 text-zinc-400 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Save Button */}
      {isAdmin && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-8 right-8 z-[100]"
        >
          <button
            onClick={() => saveChanges(cvData)}
            disabled={isSaving}
            className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-600/40 disabled:opacity-50"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {isSaving ? 'Saving...' : 'Save All Changes'}
          </button>
        </motion.div>
      )}

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLoginModal(false)}
              className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 overflow-hidden"
            >
              <div className="space-y-8">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Settings size={32} />
                  </div>
                  <h2 className="text-2xl font-serif font-medium text-zinc-900">Admin Access</h2>
                  <p className="text-sm text-zinc-400">Enter your password to manage your portfolio.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Username</label>
                    <input 
                      type="text" 
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none transition-all" 
                      placeholder="Username"
                      autoFocus
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Password</label>
                    <input 
                      type="password" 
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none transition-all" 
                      placeholder="••••••••"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-5 rounded-full bg-indigo-600 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20"
                  >
                    Sign In
                  </button>
                </form>
              </div>
              <button
                onClick={() => setShowLoginModal(false)}
                className="absolute top-6 right-6 p-2 text-zinc-400 hover:text-zinc-900 transition-colors"
              >
                <X size={20} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Section Edit Modal */}
      <AnimatePresence>
        {editingSection && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingSection(null)}
              className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl p-10 overflow-y-auto max-h-[90vh]"
            >
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-serif font-medium text-zinc-900">
                    Edit {editingSection.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}
                  </h2>
                  <button onClick={() => setEditingSection(null)} className="p-2 text-zinc-400 hover:text-zinc-900">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-8">
                  {editingSection === 'hero' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Full Name</label>
                        <input 
                          type="text" 
                          value={cvData.name}
                          onChange={(e) => setCvData({...cvData, name: e.target.value})}
                          className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none transition-all" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Professional Title</label>
                        <input 
                          type="text" 
                          value={cvData.title}
                          onChange={(e) => setCvData({...cvData, title: e.target.value})}
                          className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none transition-all" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Summary</label>
                        <textarea 
                          value={cvData.summary}
                          onChange={(e) => setCvData({...cvData, summary: e.target.value})}
                          className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none transition-all h-40 resize-none" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Profile Image URL</label>
                        <div className="flex gap-4">
                          <input 
                            type="text" 
                            value={cvData.profileImage || ''}
                            onChange={(e) => setCvData({...cvData, profileImage: e.target.value})}
                            placeholder="https://example.com/image.jpg"
                            className="flex-1 px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none transition-all" 
                          />
                          <label className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl cursor-pointer hover:bg-indigo-100 transition-all">
                            <ImageIcon size={20} />
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => setCvData({...cvData, profileImage: url}))} />
                          </label>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">CV File URL</label>
                        <div className="flex gap-4">
                          <input 
                            type="text" 
                            value={cvData.cvUrl || ''}
                            onChange={(e) => setCvData({...cvData, cvUrl: e.target.value})}
                            placeholder="/uploads/cv.pdf"
                            className="flex-1 px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none transition-all" 
                          />
                          <label className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl cursor-pointer hover:bg-indigo-100 transition-all">
                            <FileText size={20} />
                            <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={(e) => handleFileUpload(e, (url) => setCvData({...cvData, cvUrl: url}))} />
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {editingSection === 'research_interests' && (
                    <div className="space-y-6">
                      {cvData.researchInterests.map((interest, idx) => (
                        <div key={idx} className="flex gap-4">
                          <input 
                            type="text" 
                            value={interest}
                            onChange={(e) => {
                              const newInterests = [...cvData.researchInterests];
                              newInterests[idx] = e.target.value;
                              setCvData({...cvData, researchInterests: newInterests});
                            }}
                            className="flex-1 px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none transition-all" 
                          />
                          <button 
                            onClick={() => {
                              const newInterests = cvData.researchInterests.filter((_, i) => i !== idx);
                              setCvData({...cvData, researchInterests: newInterests});
                            }}
                            className="p-4 text-red-400 hover:text-red-600"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={() => setCvData({...cvData, researchInterests: [...cvData.researchInterests, 'New Interest']})}
                        className="w-full py-4 border-2 border-dashed border-zinc-100 rounded-2xl text-zinc-400 hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
                      >
                        <Plus size={16} /> Add Interest
                      </button>
                    </div>
                  )}

                  {editingSection === 'education' && (
                    <div className="space-y-12">
                      {cvData.education.map((edu, idx) => (
                        <div key={idx} className="space-y-4 p-6 border border-zinc-100 rounded-3xl relative">
                          <button 
                            onClick={() => {
                              const newEdu = cvData.education.filter((_, i) => i !== idx);
                              setCvData({...cvData, education: newEdu});
                            }}
                            className="absolute top-4 right-4 p-2 text-red-400 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Degree</label>
                              <input 
                                type="text" 
                                value={edu.degree}
                                onChange={(e) => {
                                  const newEdu = [...cvData.education];
                                  newEdu[idx] = {...newEdu[idx], degree: e.target.value};
                                  setCvData({...cvData, education: newEdu});
                                }}
                                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none" 
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Period</label>
                              <input 
                                type="text" 
                                value={edu.period}
                                onChange={(e) => {
                                  const newEdu = [...cvData.education];
                                  newEdu[idx] = {...newEdu[idx], period: e.target.value};
                                  setCvData({...cvData, education: newEdu});
                                }}
                                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none" 
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">School</label>
                            <input 
                              type="text" 
                              value={edu.school}
                              onChange={(e) => {
                                const newEdu = [...cvData.education];
                                newEdu[idx] = {...newEdu[idx], school: e.target.value};
                                setCvData({...cvData, education: newEdu});
                              }}
                              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none" 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Description (Markdown)</label>
                            <textarea 
                              value={edu.description || ''}
                              onChange={(e) => {
                                const newEdu = [...cvData.education];
                                newEdu[idx] = {...newEdu[idx], description: e.target.value};
                                setCvData({...cvData, education: newEdu});
                              }}
                              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none h-32" 
                            />
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={() => setCvData({...cvData, education: [...cvData.education, { school: '', degree: '', period: '' }]})}
                        className="w-full py-4 border-2 border-dashed border-zinc-100 rounded-2xl text-zinc-400 hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
                      >
                        <Plus size={16} /> Add Education
                      </button>
                    </div>
                  )}

                  {editingSection === 'experience' && (
                    <div className="space-y-12">
                      {cvData.experiences.map((exp, idx) => (
                        <div key={idx} className="space-y-4 p-6 border border-zinc-100 rounded-3xl relative">
                          <button 
                            onClick={() => {
                              const newExp = cvData.experiences.filter((_, i) => i !== idx);
                              setCvData({...cvData, experiences: newExp});
                            }}
                            className="absolute top-4 right-4 p-2 text-red-400 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Role</label>
                              <input 
                                type="text" 
                                value={exp.role}
                                onChange={(e) => {
                                  const newExp = [...cvData.experiences];
                                  newExp[idx] = {...newExp[idx], role: e.target.value};
                                  setCvData({...cvData, experiences: newExp});
                                }}
                                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none" 
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Period</label>
                              <input 
                                type="text" 
                                value={exp.period}
                                onChange={(e) => {
                                  const newExp = [...cvData.experiences];
                                  newExp[idx] = {...newExp[idx], period: e.target.value};
                                  setCvData({...cvData, experiences: newExp});
                                }}
                                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none" 
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Company</label>
                            <input 
                              type="text" 
                              value={exp.company}
                              onChange={(e) => {
                                const newExp = [...cvData.experiences];
                                newExp[idx] = {...newExp[idx], company: e.target.value};
                                setCvData({...cvData, experiences: newExp});
                              }}
                              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none" 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Description Points (Markdown)</label>
                            {exp.description.map((desc, i) => (
                              <div key={i} className="flex gap-2">
                                <textarea 
                                  value={desc}
                                  onChange={(e) => {
                                    const newExp = [...cvData.experiences];
                                    const newDesc = [...newExp[idx].description];
                                    newDesc[i] = e.target.value;
                                    newExp[idx] = {...newExp[idx], description: newDesc};
                                    setCvData({...cvData, experiences: newExp});
                                  }}
                                  className="flex-1 px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none h-20" 
                                />
                                <button 
                                  onClick={() => {
                                    const newExp = [...cvData.experiences];
                                    const newDesc = newExp[idx].description.filter((_, j) => j !== i);
                                    newExp[idx] = {...newExp[idx], description: newDesc};
                                    setCvData({...cvData, experiences: newExp});
                                  }}
                                  className="p-2 text-red-400 hover:text-red-600"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            ))}
                            <button 
                              onClick={() => {
                                const newExp = [...cvData.experiences];
                                const newDesc = [...newExp[idx].description, 'New point'];
                                newExp[idx] = {...newExp[idx], description: newDesc};
                                setCvData({...cvData, experiences: newExp});
                              }}
                              className="w-full py-2 border border-dashed border-zinc-100 rounded-xl text-zinc-400 hover:text-indigo-600"
                            >
                              Add Point
                            </button>
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={() => setCvData({...cvData, experiences: [...cvData.experiences, { company: '', role: '', period: '', description: [] }]})}
                        className="w-full py-4 border-2 border-dashed border-zinc-100 rounded-2xl text-zinc-400 hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
                      >
                        <Plus size={16} /> Add Experience
                      </button>
                    </div>
                  )}

                  {editingSection === 'publications' && (
                    <div className="space-y-12">
                      {cvData.publications.map((pub, idx) => (
                        <div key={idx} className="space-y-4 p-6 border border-zinc-100 rounded-3xl relative">
                          <button 
                            onClick={() => {
                              const newPubs = cvData.publications.filter((_, i) => i !== idx);
                              setCvData({...cvData, publications: newPubs});
                            }}
                            className="absolute top-4 right-4 p-2 text-red-400 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Title</label>
                            <input 
                              type="text" 
                              value={pub.title}
                              onChange={(e) => {
                                const newPubs = [...cvData.publications];
                                newPubs[idx] = {...newPubs[idx], title: e.target.value};
                                setCvData({...cvData, publications: newPubs});
                              }}
                              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none" 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Authors</label>
                            <input 
                              type="text" 
                              value={pub.authors}
                              onChange={(e) => {
                                const newPubs = [...cvData.publications];
                                newPubs[idx] = {...newPubs[idx], authors: e.target.value};
                                setCvData({...cvData, publications: newPubs});
                              }}
                              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none" 
                            />
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Journal</label>
                              <input 
                                type="text" 
                                value={pub.journal}
                                onChange={(e) => {
                                  const newPubs = [...cvData.publications];
                                  newPubs[idx] = {...newPubs[idx], journal: e.target.value};
                                  setCvData({...cvData, publications: newPubs});
                                }}
                                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none" 
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Year</label>
                              <input 
                                type="text" 
                                value={pub.year}
                                onChange={(e) => {
                                  const newPubs = [...cvData.publications];
                                  newPubs[idx] = {...newPubs[idx], year: e.target.value};
                                  setCvData({...cvData, publications: newPubs});
                                }}
                                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none" 
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={() => setCvData({...cvData, publications: [...cvData.publications, { title: '', authors: '', journal: '', year: '' }]})}
                        className="w-full py-4 border-2 border-dashed border-zinc-100 rounded-2xl text-zinc-400 hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
                      >
                        <Plus size={16} /> Add Publication
                      </button>
                    </div>
                  )}

                  {editingSection === 'hero' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Full Name</label>
                        <input 
                          type="text" 
                          value={cvData.name}
                          onChange={(e) => setCvData({...cvData, name: e.target.value})}
                          className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Title</label>
                        <input 
                          type="text" 
                          value={cvData.title}
                          onChange={(e) => setCvData({...cvData, title: e.target.value})}
                          className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Summary</label>
                        <textarea 
                          value={cvData.summary}
                          onChange={(e) => setCvData({...cvData, summary: e.target.value})}
                          className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none h-40" 
                        />
                      </div>
                    </div>
                  )}

                  {editingSection === 'research_interests' && (
                    <div className="space-y-6">
                      {cvData.researchInterests.map((interest, idx) => (
                        <div key={idx} className="flex gap-4">
                          <input 
                            type="text" 
                            value={interest}
                            onChange={(e) => {
                              const newInterests = [...cvData.researchInterests];
                              newInterests[idx] = e.target.value;
                              setCvData({...cvData, researchInterests: newInterests});
                            }}
                            className="flex-1 px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none" 
                          />
                          <button 
                            onClick={() => {
                              const newInterests = cvData.researchInterests.filter((_, i) => i !== idx);
                              setCvData({...cvData, researchInterests: newInterests});
                            }}
                            className="p-4 text-red-400 hover:text-red-600"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={() => setCvData({...cvData, researchInterests: [...cvData.researchInterests, 'New Interest']})}
                        className="w-full py-4 border-2 border-dashed border-zinc-100 rounded-2xl text-zinc-400 hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
                      >
                        <Plus size={16} /> Add Interest
                      </button>
                    </div>
                  )}

                  {editingSection === 'leadership' && (
                    <div className="space-y-12">
                      {cvData.leadership.map((lead, idx) => (
                        <div key={idx} className="space-y-4 p-6 border border-zinc-100 rounded-3xl relative">
                          <button 
                            onClick={() => {
                              const newLead = cvData.leadership.filter((_, i) => i !== idx);
                              setCvData({...cvData, leadership: newLead});
                            }}
                            className="absolute top-4 right-4 p-2 text-red-400 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Organization</label>
                            <input 
                              type="text" 
                              value={lead.organization}
                              onChange={(e) => {
                                const newLead = [...cvData.leadership];
                                newLead[idx] = {...newLead[idx], organization: e.target.value};
                                setCvData({...cvData, leadership: newLead});
                              }}
                              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none" 
                            />
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Role</label>
                              <input 
                                type="text" 
                                value={lead.role}
                                onChange={(e) => {
                                  const newLead = [...cvData.leadership];
                                  newLead[idx] = {...newLead[idx], role: e.target.value};
                                  setCvData({...cvData, leadership: newLead});
                                }}
                                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none" 
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Period</label>
                              <input 
                                type="text" 
                                value={lead.period}
                                onChange={(e) => {
                                  const newLead = [...cvData.leadership];
                                  newLead[idx] = {...newLead[idx], period: e.target.value};
                                  setCvData({...cvData, leadership: newLead});
                                }}
                                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none" 
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Description</label>
                            <textarea 
                              value={lead.description || ''}
                              onChange={(e) => {
                                const newLead = [...cvData.leadership];
                                newLead[idx] = {...newLead[idx], description: e.target.value};
                                setCvData({...cvData, leadership: newLead});
                              }}
                              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none h-24" 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Logo URL</label>
                            <div className="flex gap-4">
                              <input 
                                type="text" 
                                value={lead.logo || ''}
                                onChange={(e) => {
                                  const newLead = [...cvData.leadership];
                                  newLead[idx] = {...newLead[idx], logo: e.target.value};
                                  setCvData({...cvData, leadership: newLead});
                                }}
                                placeholder="https://example.com/logo.png"
                                className="flex-1 px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none" 
                              />
                              <label className="p-3 bg-indigo-50 text-indigo-600 rounded-xl cursor-pointer hover:bg-indigo-100 transition-all">
                                <ImageIcon size={18} />
                                <input 
                                  type="file" 
                                  className="hidden" 
                                  accept="image/*" 
                                  onChange={(e) => handleFileUpload(e, (url) => {
                                    const newLead = [...cvData.leadership];
                                    newLead[idx] = {...newLead[idx], logo: url};
                                    setCvData({...cvData, leadership: newLead});
                                  })} 
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={() => setCvData({...cvData, leadership: [...cvData.leadership, { organization: '', role: '', period: '' }]})}
                        className="w-full py-4 border-2 border-dashed border-zinc-100 rounded-2xl text-zinc-400 hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
                      >
                        <Plus size={16} /> Add Role
                      </button>
                    </div>
                  )}

                  {editingSection === 'skills' && (
                    <div className="space-y-8">
                      {Object.entries(cvData.skills).map(([category, items]) => (
                        <div key={category} className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4 capitalize">{category} Skills</label>
                          <textarea 
                            value={items.join(', ')}
                            onChange={(e) => {
                              const newItems = e.target.value.split(',').map(s => s.trim()).filter(s => s !== '');
                              setCvData({
                                ...cvData, 
                                skills: {
                                  ...cvData.skills,
                                  [category]: newItems
                                }
                              });
                            }}
                            className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none h-24" 
                            placeholder="Comma separated items..."
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {editingSection === 'youtube' && (
                    <div className="space-y-12">
                      {cvData.youtubeVideos.map((video, idx) => (
                        <div key={idx} className="space-y-4 p-6 border border-zinc-100 rounded-3xl relative">
                          <button 
                            onClick={() => {
                              const newVideos = cvData.youtubeVideos.filter((_, i) => i !== idx);
                              setCvData({...cvData, youtubeVideos: newVideos});
                            }}
                            className="absolute top-4 right-4 p-2 text-red-400 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Video Title</label>
                            <input 
                              type="text" 
                              value={video.title}
                              onChange={(e) => {
                                const newVideos = [...cvData.youtubeVideos];
                                newVideos[idx] = {...newVideos[idx], title: e.target.value};
                                setCvData({...cvData, youtubeVideos: newVideos});
                              }}
                              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none" 
                            />
                          </div>
                          <div className="grid md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Video ID</label>
                              <input 
                                type="text" 
                                value={video.id}
                                onChange={(e) => {
                                  const newVideos = [...cvData.youtubeVideos];
                                  newVideos[idx] = {...newVideos[idx], id: e.target.value};
                                  setCvData({...cvData, youtubeVideos: newVideos});
                                }}
                                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none" 
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Views</label>
                              <input 
                                type="text" 
                                value={video.views}
                                onChange={(e) => {
                                  const newVideos = [...cvData.youtubeVideos];
                                  newVideos[idx] = {...newVideos[idx], views: e.target.value};
                                  setCvData({...cvData, youtubeVideos: newVideos});
                                }}
                                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none" 
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Date</label>
                              <input 
                                type="text" 
                                value={video.date}
                                onChange={(e) => {
                                  const newVideos = [...cvData.youtubeVideos];
                                  newVideos[idx] = {...newVideos[idx], date: e.target.value};
                                  setCvData({...cvData, youtubeVideos: newVideos});
                                }}
                                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none" 
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={() => setCvData({...cvData, youtubeVideos: [...cvData.youtubeVideos, { title: '', id: '', views: '', date: '' }]})}
                        className="w-full py-4 border-2 border-dashed border-zinc-100 rounded-2xl text-zinc-400 hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
                      >
                        <Plus size={16} /> Add Video
                      </button>
                    </div>
                  )}

                  {editingSection === 'blog' && (
                    <div className="space-y-12">
                      {cvData.blogPosts.map((post, idx) => (
                        <div key={idx} className="space-y-4 p-6 border border-zinc-100 rounded-3xl relative">
                          <button 
                            onClick={() => {
                              const newPosts = cvData.blogPosts.filter((_, i) => i !== idx);
                              setCvData({...cvData, blogPosts: newPosts});
                            }}
                            className="absolute top-4 right-4 p-2 text-red-400 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Title</label>
                            <input 
                              type="text" 
                              value={post.title}
                              onChange={(e) => {
                                const newPosts = [...cvData.blogPosts];
                                newPosts[idx] = {...newPosts[idx], title: e.target.value};
                                setCvData({...cvData, blogPosts: newPosts});
                              }}
                              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none" 
                            />
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Date</label>
                              <input 
                                type="text" 
                                value={post.date}
                                onChange={(e) => {
                                  const newPosts = [...cvData.blogPosts];
                                  newPosts[idx] = {...newPosts[idx], date: e.target.value};
                                  setCvData({...cvData, blogPosts: newPosts});
                                }}
                                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none" 
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Category</label>
                              <input 
                                type="text" 
                                value={post.category}
                                onChange={(e) => {
                                  const newPosts = [...cvData.blogPosts];
                                  newPosts[idx] = {...newPosts[idx], category: e.target.value as any};
                                  setCvData({...cvData, blogPosts: newPosts});
                                }}
                                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none" 
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Excerpt</label>
                            <textarea 
                              value={post.excerpt}
                              onChange={(e) => {
                                const newPosts = [...cvData.blogPosts];
                                newPosts[idx] = {...newPosts[idx], excerpt: e.target.value};
                                setCvData({...cvData, blogPosts: newPosts});
                              }}
                              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none h-20" 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Content (Markdown)</label>
                            <textarea 
                              value={post.content}
                              onChange={(e) => {
                                const newPosts = [...cvData.blogPosts];
                                newPosts[idx] = {...newPosts[idx], content: e.target.value};
                                setCvData({...cvData, blogPosts: newPosts});
                              }}
                              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none h-40" 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Image URL</label>
                            <div className="flex gap-4">
                              <input 
                                type="text" 
                                value={post.imageUrl || ''}
                                onChange={(e) => {
                                  const newPosts = [...cvData.blogPosts];
                                  newPosts[idx] = {...newPosts[idx], imageUrl: e.target.value};
                                  setCvData({...cvData, blogPosts: newPosts});
                                }}
                                placeholder="https://example.com/blog-image.jpg"
                                className="flex-1 px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none" 
                              />
                              <label className="p-3 bg-indigo-50 text-indigo-600 rounded-xl cursor-pointer hover:bg-indigo-100 transition-all">
                                <ImageIcon size={18} />
                                <input 
                                  type="file" 
                                  className="hidden" 
                                  accept="image/*" 
                                  onChange={(e) => handleFileUpload(e, (url) => {
                                    const newPosts = [...cvData.blogPosts];
                                    newPosts[idx] = {...newPosts[idx], imageUrl: url};
                                    setCvData({...cvData, blogPosts: newPosts});
                                  })} 
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={() => setCvData({...cvData, blogPosts: [...cvData.blogPosts, { title: '', date: '', category: 'Research Journey' as any, excerpt: '', content: '' }]})}
                        className="w-full py-4 border-2 border-dashed border-zinc-100 rounded-2xl text-zinc-400 hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
                      >
                        <Plus size={16} /> Add Post
                      </button>
                    </div>
                  )}

                  {editingSection === 'awards' && (
                    <div className="space-y-12">
                      {cvData.awards.map((award, idx) => (
                        <div key={idx} className="space-y-4 p-6 border border-zinc-100 rounded-3xl relative">
                          <button 
                            onClick={() => {
                              const newAwards = cvData.awards.filter((_, i) => i !== idx);
                              setCvData({...cvData, awards: newAwards});
                            }}
                            className="absolute top-4 right-4 p-2 text-red-400 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Title</label>
                              <input 
                                type="text" 
                                value={award.title}
                                onChange={(e) => {
                                  const newAwards = [...cvData.awards];
                                  newAwards[idx] = {...newAwards[idx], title: e.target.value};
                                  setCvData({...cvData, awards: newAwards});
                                }}
                                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none" 
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Year</label>
                              <input 
                                type="text" 
                                value={award.year}
                                onChange={(e) => {
                                  const newAwards = [...cvData.awards];
                                  newAwards[idx] = {...newAwards[idx], year: e.target.value};
                                  setCvData({...cvData, awards: newAwards});
                                }}
                                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none" 
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Details</label>
                            <textarea 
                              value={award.details}
                              onChange={(e) => {
                                const newAwards = [...cvData.awards];
                                newAwards[idx] = {...newAwards[idx], details: e.target.value};
                                setCvData({...cvData, awards: newAwards});
                              }}
                              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none h-20" 
                            />
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={() => setCvData({...cvData, awards: [...cvData.awards, { title: '', year: '', details: '' }]})}
                        className="w-full py-4 border-2 border-dashed border-zinc-100 rounded-2xl text-zinc-400 hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
                      >
                        <Plus size={16} /> Add Award
                      </button>
                    </div>
                  )}

                  {editingSection === 'teaching' && (
                    <div className="space-y-12">
                      {cvData.teaching.map((item, idx) => (
                        <div key={idx} className="space-y-4 p-6 border border-zinc-100 rounded-3xl relative">
                          <button 
                            onClick={() => {
                              const newTeaching = cvData.teaching.filter((_, i) => i !== idx);
                              setCvData({...cvData, teaching: newTeaching});
                            }}
                            className="absolute top-4 right-4 p-2 text-red-400 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Role</label>
                            <input 
                              type="text" 
                              value={item.role}
                              onChange={(e) => {
                                const newTeaching = [...cvData.teaching];
                                newTeaching[idx] = {...newTeaching[idx], role: e.target.value};
                                setCvData({...cvData, teaching: newTeaching});
                              }}
                              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none" 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Details</label>
                            <textarea 
                              value={item.details}
                              onChange={(e) => {
                                const newTeaching = [...cvData.teaching];
                                newTeaching[idx] = {...newTeaching[idx], details: e.target.value};
                                setCvData({...cvData, teaching: newTeaching});
                              }}
                              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none h-24" 
                            />
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={() => setCvData({...cvData, teaching: [...cvData.teaching, { role: '', details: '' }]})}
                        className="w-full py-4 border-2 border-dashed border-zinc-100 rounded-2xl text-zinc-400 hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
                      >
                        <Plus size={16} /> Add Teaching Experience
                      </button>
                    </div>
                  )}

                  {editingSection === 'volunteering' && (
                    <div className="space-y-6">
                      {cvData.volunteering.map((item, idx) => (
                        <div key={idx} className="flex gap-4">
                          <textarea 
                            value={item}
                            onChange={(e) => {
                              const newVolunteering = [...cvData.volunteering];
                              newVolunteering[idx] = e.target.value;
                              setCvData({...cvData, volunteering: newVolunteering});
                            }}
                            className="flex-1 px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none h-20" 
                          />
                          <button 
                            onClick={() => {
                              const newVolunteering = cvData.volunteering.filter((_, i) => i !== idx);
                              setCvData({...cvData, volunteering: newVolunteering});
                            }}
                            className="p-4 text-red-400 hover:text-red-600"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={() => setCvData({...cvData, volunteering: [...cvData.volunteering, 'New Volunteering Experience']})}
                        className="w-full py-4 border-2 border-dashed border-zinc-100 rounded-2xl text-zinc-400 hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
                      >
                        <Plus size={16} /> Add Volunteering
                      </button>
                    </div>
                  )}

                  {editingSection === 'conferences' && (
                    <div className="space-y-6">
                      {cvData.conferences.map((item, idx) => (
                        <div key={idx} className="flex gap-4">
                          <textarea 
                            value={item}
                            onChange={(e) => {
                              const newConferences = [...cvData.conferences];
                              newConferences[idx] = e.target.value;
                              setCvData({...cvData, conferences: newConferences});
                            }}
                            className="flex-1 px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none h-24" 
                          />
                          <button 
                            onClick={() => {
                              const newConferences = cvData.conferences.filter((_, i) => i !== idx);
                              setCvData({...cvData, conferences: newConferences});
                            }}
                            className="p-4 text-red-400 hover:text-red-600"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={() => setCvData({...cvData, conferences: [...cvData.conferences, 'New Conference Presentation']})}
                        className="w-full py-4 border-2 border-dashed border-zinc-100 rounded-2xl text-zinc-400 hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
                      >
                        <Plus size={16} /> Add Conference
                      </button>
                    </div>
                  )}

                  {editingSection === 'workingPapers' && (
                    <div className="space-y-6">
                      {cvData.workingPapers.map((item, idx) => (
                        <div key={idx} className="flex gap-4">
                          <textarea 
                            value={item}
                            onChange={(e) => {
                              const newPapers = [...cvData.workingPapers];
                              newPapers[idx] = e.target.value;
                              setCvData({...cvData, workingPapers: newPapers});
                            }}
                            className="flex-1 px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none h-24" 
                          />
                          <button 
                            onClick={() => {
                              const newPapers = cvData.workingPapers.filter((_, i) => i !== idx);
                              setCvData({...cvData, workingPapers: newPapers});
                            }}
                            className="p-4 text-red-400 hover:text-red-600"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={() => setCvData({...cvData, workingPapers: [...cvData.workingPapers, 'New Working Paper']})}
                        className="w-full py-4 border-2 border-dashed border-zinc-100 rounded-2xl text-zinc-400 hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
                      >
                        <Plus size={16} /> Add Working Paper
                      </button>
                    </div>
                  )}

                  {editingSection === 'eventCoordination' && (
                    <div className="space-y-12">
                      {cvData.eventCoordination.map((item, idx) => (
                        <div key={idx} className="space-y-4 p-6 border border-zinc-100 rounded-3xl relative">
                          <button 
                            onClick={() => {
                              const newCoord = cvData.eventCoordination.filter((_, i) => i !== idx);
                              setCvData({...cvData, eventCoordination: newCoord});
                            }}
                            className="absolute top-4 right-4 p-2 text-red-400 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Event Name</label>
                            <input 
                              type="text" 
                              value={item.event}
                              onChange={(e) => {
                                const newCoord = [...cvData.eventCoordination];
                                newCoord[idx] = {...newCoord[idx], event: e.target.value};
                                setCvData({...cvData, eventCoordination: newCoord});
                              }}
                              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none" 
                            />
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Role</label>
                              <input 
                                type="text" 
                                value={item.role}
                                onChange={(e) => {
                                  const newCoord = [...cvData.eventCoordination];
                                  newCoord[idx] = {...newCoord[idx], role: e.target.value};
                                  setCvData({...cvData, eventCoordination: newCoord});
                                }}
                                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none" 
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Year</label>
                              <input 
                                type="text" 
                                value={item.year}
                                onChange={(e) => {
                                  const newCoord = [...cvData.eventCoordination];
                                  newCoord[idx] = {...newCoord[idx], year: e.target.value};
                                  setCvData({...cvData, eventCoordination: newCoord});
                                }}
                                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none" 
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={() => setCvData({...cvData, eventCoordination: [...cvData.eventCoordination, { event: '', role: '', year: '' }]})}
                        className="w-full py-4 border-2 border-dashed border-zinc-100 rounded-2xl text-zinc-400 hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
                      >
                        <Plus size={16} /> Add Event Coordination
                      </button>
                    </div>
                  )}

                  {editingSection === 'workshops' && (
                    <div className="space-y-12">
                      {cvData.workshops.map((ws, idx) => (
                        <div key={idx} className="space-y-4 p-6 border border-zinc-100 rounded-3xl relative">
                          <button 
                            onClick={() => {
                              const newWorkshops = cvData.workshops.filter((_, i) => i !== idx);
                              setCvData({...cvData, workshops: newWorkshops});
                            }}
                            className="absolute top-4 right-4 p-2 text-red-400 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Workshop Title</label>
                            <input 
                              type="text" 
                              value={ws.title}
                              onChange={(e) => {
                                const newWorkshops = [...cvData.workshops];
                                newWorkshops[idx] = {...newWorkshops[idx], title: e.target.value};
                                setCvData({...cvData, workshops: newWorkshops});
                              }}
                              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none" 
                            />
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Provider</label>
                              <input 
                                type="text" 
                                value={ws.provider}
                                onChange={(e) => {
                                  const newWorkshops = [...cvData.workshops];
                                  newWorkshops[idx] = {...newWorkshops[idx], provider: e.target.value};
                                  setCvData({...cvData, workshops: newWorkshops});
                                }}
                                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none" 
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Year</label>
                              <input 
                                type="text" 
                                value={ws.year}
                                onChange={(e) => {
                                  const newWorkshops = [...cvData.workshops];
                                  newWorkshops[idx] = {...newWorkshops[idx], year: e.target.value};
                                  setCvData({...cvData, workshops: newWorkshops});
                                }}
                                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none" 
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Certificate URL (Optional)</label>
                            <div className="flex gap-4">
                              <input 
                                type="text" 
                                value={ws.certificateUrl || ''}
                                onChange={(e) => {
                                  const newWorkshops = [...cvData.workshops];
                                  newWorkshops[idx] = {...newWorkshops[idx], certificateUrl: e.target.value};
                                  setCvData({...cvData, workshops: newWorkshops});
                                }}
                                className="flex-1 px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none" 
                              />
                              <label className="p-3 bg-indigo-50 text-indigo-600 rounded-xl cursor-pointer hover:bg-indigo-100 transition-all">
                                <FileText size={18} />
                                <input 
                                  type="file" 
                                  className="hidden" 
                                  accept="image/*,.pdf" 
                                  onChange={(e) => handleFileUpload(e, (url) => {
                                    const newWorkshops = [...cvData.workshops];
                                    newWorkshops[idx] = {...newWorkshops[idx], certificateUrl: url};
                                    setCvData({...cvData, workshops: newWorkshops});
                                  })} 
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={() => setCvData({...cvData, workshops: [...cvData.workshops, { title: '', provider: '', year: '' }]})}
                        className="w-full py-4 border-2 border-dashed border-zinc-100 rounded-2xl text-zinc-400 hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
                      >
                        <Plus size={16} /> Add Workshop
                      </button>
                    </div>
                  )}
                  {editingSection === 'gallery' && (
                    <div className="space-y-12">
                      {cvData.gallery.map((item, idx) => (
                        <div key={idx} className="space-y-4 p-6 border border-zinc-100 rounded-3xl relative">
                          <button 
                            onClick={() => {
                              const newGallery = cvData.gallery.filter((_, i) => i !== idx);
                              setCvData({...cvData, gallery: newGallery});
                            }}
                            className="absolute top-4 right-4 p-2 text-red-400 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Image URL</label>
                            <div className="flex gap-4">
                              <input 
                                type="text" 
                                value={item.url}
                                onChange={(e) => {
                                  const newGallery = [...cvData.gallery];
                                  newGallery[idx] = {...newGallery[idx], url: e.target.value};
                                  setCvData({...cvData, gallery: newGallery});
                                }}
                                className="flex-1 px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none" 
                              />
                              <label className="p-3 bg-indigo-50 text-indigo-600 rounded-xl cursor-pointer hover:bg-indigo-100 transition-all">
                                <ImageIcon size={18} />
                                <input 
                                  type="file" 
                                  className="hidden" 
                                  accept="image/*" 
                                  onChange={(e) => handleFileUpload(e, (url) => {
                                    const newGallery = [...cvData.gallery];
                                    newGallery[idx] = {...newGallery[idx], url: url};
                                    setCvData({...cvData, gallery: newGallery});
                                  })} 
                                />
                              </label>
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Caption</label>
                              <input 
                                type="text" 
                                value={item.caption}
                                onChange={(e) => {
                                  const newGallery = [...cvData.gallery];
                                  newGallery[idx] = {...newGallery[idx], caption: e.target.value};
                                  setCvData({...cvData, gallery: newGallery});
                                }}
                                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none" 
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-4">Category</label>
                              <input 
                                type="text" 
                                value={item.category}
                                onChange={(e) => {
                                  const newGallery = [...cvData.gallery];
                                  newGallery[idx] = {...newGallery[idx], category: e.target.value};
                                  setCvData({...cvData, gallery: newGallery});
                                }}
                                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-indigo-600 outline-none" 
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={() => setCvData({...cvData, gallery: [...cvData.gallery, { url: '', caption: '', category: 'All' }]})}
                        className="w-full py-4 border-2 border-dashed border-zinc-100 rounded-2xl text-zinc-400 hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
                      >
                        <Plus size={16} /> Add Image
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => {
                      saveChanges(cvData);
                      setEditingSection(null);
                    }}
                    disabled={isSaving}
                    className="flex-1 py-5 rounded-full bg-indigo-600 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : <><Save size={14} /> Save & Close</>}
                  </button>
                  <button 
                    onClick={() => setEditingSection(null)}
                    className="flex-1 py-5 rounded-full bg-zinc-100 text-zinc-600 font-bold uppercase tracking-widest text-[10px] hover:bg-zinc-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
