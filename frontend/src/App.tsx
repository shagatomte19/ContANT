import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import BrandVoiceSettings from './components/BrandVoiceSettings';
import ContentCreator from './components/ContentCreator';
import HomePage from './components/HomePage';
import PricingPage from './components/PricingPage';
import ToolsPage from './components/ToolsPage';
import SEOToolsPage from './components/SEOToolsPage';
import AboutPage from './components/AboutPage';
import { BrandVoice, GeneratedContent, ToastMessage } from './types';
import { X, CheckCircle, AlertCircle, Info, Sparkles } from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Persist brand voice in local storage (mock DB)
  const [brandVoice, setBrandVoice] = useState<BrandVoice>(() => {
    const saved = localStorage.getItem('brandVoice');
    return saved ? JSON.parse(saved) : {
      name: 'Default',
      tone: 'Professional & Authoritative',
      audience: 'Business Professionals',
      keywords: ['Growth', 'Strategy', 'Efficiency'],
      exampleText: ''
    };
  });

  const [history, setHistory] = useState<GeneratedContent[]>([]);

  // Dark Mode Logic
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // Toast System
  const showToast = useCallback((title: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, title, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const handleSaveVoice = (voice: BrandVoice) => {
    setBrandVoice(voice);
    localStorage.setItem('brandVoice', JSON.stringify(voice));
    showToast("Brand Voice Saved Successfully!", 'success');
  };

  const handleContentGenerated = useCallback((content: GeneratedContent) => {
    setHistory(prev => [content, ...prev]);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage onNavigate={setActiveTab} />;
      case 'pricing':
        return <PricingPage onNavigate={setActiveTab} />;
      case 'about':
        return <AboutPage />;
      case 'dashboard':
        return <Dashboard history={history} onNavigate={setActiveTab} />;
      case 'create':
        return <ContentCreator brandVoice={brandVoice} onContentGenerated={handleContentGenerated} showToast={showToast} />;
      case 'tools':
        return <ToolsPage showToast={showToast} />;
      case 'seo-tools':
        return <SEOToolsPage showToast={showToast} />;
      case 'settings':
        return <BrandVoiceSettings voice={brandVoice} onSave={handleSaveVoice} />;
      case 'history':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <div>
              <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Generation History</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg font-medium">Archive of all your repurposed content.</p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
              {history.length === 0 ? (
                 <div className="p-20 text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                      <Info className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mb-6">No content generated yet.</p>
                    <button onClick={() => setActiveTab('create')} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-colors">
                      Create First Content
                    </button>
                 </div>
              ) : (
                history.map(item => (
                  <div key={item.id} className="p-8 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group cursor-pointer">
                    <div className="flex justify-between mb-4 items-center">
                       <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-full uppercase tracking-widest">{item.format}</span>
                       <span className="text-xs text-slate-400 font-medium">{new Date(item.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="text-slate-800 dark:text-slate-200 line-clamp-3 font-medium text-base leading-relaxed p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 group-hover:bg-white dark:group-hover:bg-slate-900 group-hover:border-blue-100 dark:group-hover:border-blue-900 transition-colors">
                      {item.content}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      default:
        return <HomePage onNavigate={setActiveTab} />;
    }
  };

  return (
    <>
      <Layout 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      >
        {renderContent()}
      </Layout>

      {/* Modern Toast Container */}
      <div className="fixed top-24 right-6 z-[60] flex flex-col gap-4 pointer-events-none">
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className={`
              pointer-events-auto flex items-center min-w-[320px] max-w-[400px] p-4 rounded-2xl shadow-2xl border animate-in slide-in-from-right-10 fade-in duration-500
              ${toast.type === 'success' ? 'bg-white dark:bg-slate-900 border-green-100 dark:border-green-900' : ''}
              ${toast.type === 'error' ? 'bg-white dark:bg-slate-900 border-red-100 dark:border-red-900' : ''}
              ${toast.type === 'info' ? 'bg-white dark:bg-slate-900 border-blue-100 dark:border-blue-900' : ''}
            `}
          >
            <div className={`
              shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4
              ${toast.type === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : ''}
              ${toast.type === 'error' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : ''}
              ${toast.type === 'info' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : ''}
            `}>
              {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
              {toast.type === 'info' && <Sparkles className="w-5 h-5" />}
            </div>
            
            <div className="flex-1">
              <h4 className={`font-bold text-sm ${
                toast.type === 'success' ? 'text-green-900 dark:text-green-100' : 
                toast.type === 'error' ? 'text-red-900 dark:text-red-100' : 'text-blue-900 dark:text-blue-100'
              }`}>
                {toast.title}
              </h4>
              {toast.description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{toast.description}</p>}
            </div>

            <button 
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="text-slate-300 hover:text-slate-500 dark:hover:text-slate-100 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default App;