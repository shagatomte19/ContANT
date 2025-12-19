import React from 'react';
import { 
  Sparkles,
  LayoutDashboard,
  PenTool,
  History,
  Settings,
  Sun,
  Moon,
  Menu,
  X,
  Wrench,
  Zap,
  Search,
  AntDesign
} from 'lucide-react';

export const AntIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="18" r="3.5" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="4.5" r="1.5" stroke="currentColor" strokeWidth="2" />
    <path d="M10.5 10L6 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M13.5 10L18 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M10 18L5 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M14 18L19 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M10 5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M14 5L16 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, isDarkMode, toggleDarkMode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const isLandingPage = ['home', 'pricing', 'about'].includes(activeTab);

  const NavLink = ({ id, label }: { id: string, label: string }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        setIsMobileMenuOpen(false);
      }}
      className={`px-4 py-2 text-sm font-bold transition-colors rounded-lg ${
        activeTab === id 
          ? 'text-blue-600 bg-blue-50 dark:bg-slate-800 dark:text-blue-400' 
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
      }`}
    >
      {label}
    </button>
  );

  const MobileNavLink = ({ id, label, icon: Icon, primary = false }: { id: string, label: string, icon?: any, primary?: boolean }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        setIsMobileMenuOpen(false);
      }}
      className={`w-full flex items-center space-x-3 px-4 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${
        activeTab === id 
          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl' 
          : primary 
            ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
      }`}
    >
      {Icon && <Icon className="w-5 h-5" />}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900 dark:selection:bg-blue-900 dark:selection:text-blue-100 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isLandingPage ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800' : 'bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center cursor-pointer group" onClick={() => setActiveTab('home')}>
              <div className="w-10 h-10 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-slate-900 shadow-lg shadow-slate-900/10 mr-3 group-hover:scale-110 transition-transform">
                <AntIcon className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 tracking-tighter leading-none font-heading">
                  ContANT
                </span>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-2">
              {isLandingPage ? (
                <>
                  <NavLink id="home" label="Home" />
                  <NavLink id="pricing" label="Pricing" />
                  <NavLink id="about" label="About" />
                </>
              ) : (
                <>
                  <NavLink id="dashboard" label="Dashboard" />
                  <NavLink id="create" label="Create" />
                  <NavLink id="tools" label="Power Tools" />
                  <NavLink id="seo-tools" label="SEO Suite" />
                  <NavLink id="history" label="History" />
                  <NavLink id="settings" label="Brand Voice" />
                  <NavLink id="about" label="About" />
                </>
              )}
            </div>

            {/* Right Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={toggleDarkMode}
                className="p-2.5 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle Dark Mode"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {isLandingPage && (
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 dark:bg-blue-600 dark:hover:bg-blue-500"
                >
                  Launch App
                </button>
              )}
              {!isLandingPage && (
                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-slate-800 to-slate-950 border-2 border-white dark:border-slate-700 shadow-sm cursor-pointer flex items-center justify-center">
                  <AntIcon className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden space-x-4">
               <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className="text-slate-600 dark:text-slate-300 p-2"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-20 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 shadow-2xl animate-in slide-in-from-top-4 overflow-y-auto max-h-[calc(100vh-5rem)]">
            <div className="p-6 space-y-3">
              {isLandingPage ? (
                <>
                  <MobileNavLink id="home" label="Home" />
                  <MobileNavLink id="pricing" label="Pricing" />
                  <MobileNavLink id="about" label="About" />
                  <div className="h-px bg-slate-100 dark:bg-slate-800 my-4" />
                  <MobileNavLink id="dashboard" label="Launch App" primary />
                </>
              ) : (
                <>
                  <div className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4 pl-4">Colony Console</div>
                  <MobileNavLink id="dashboard" label="Dashboard" icon={LayoutDashboard} />
                  <MobileNavLink id="create" label="Create Content" icon={PenTool} />
                  <MobileNavLink id="tools" label="Power Tools" icon={Zap} />
                  <MobileNavLink id="seo-tools" label="SEO Suite" icon={Search} />
                  <MobileNavLink id="history" label="Generation History" icon={History} />
                  <MobileNavLink id="settings" label="Brand Voice" icon={Settings} />
                  <MobileNavLink id="about" label="The Story" icon={AntIcon} />
                  <div className="h-px bg-slate-100 dark:bg-slate-800 my-4" />
                  <MobileNavLink id="home" label="Return Home" />
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 pt-20">
        <div className={`mx-auto ${isLandingPage ? '' : 'max-w-7xl p-6 md:p-10'}`}>
          {children}
        </div>
      </main>

      {/* Modern Footer */}
      <footer className="w-full py-24 px-6 bg-slate-950 text-white border-t-8 border-slate-900">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20 mb-24">
              <div className="col-span-1 md:col-span-2 space-y-10">
                  <div className="flex items-center space-x-4 group cursor-pointer" onClick={() => setActiveTab('home')}>
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-950 shadow-xl group-hover:rotate-12 transition-transform">
                          <AntIcon className="w-8 h-8" />
                      </div>
                      <span className="text-5xl font-black font-heading tracking-tighter uppercase">ContANT</span>
                  </div>
                  <p className="text-2xl text-slate-400 font-medium max-w-md font-heading leading-tight">
                      The content production colony built for creators who want to scale without losing their soul.
                  </p>
                  <div className="flex space-x-4">
                      {['TW', 'LI', 'IG', 'YT'].map(social => (
                          <div key={social} className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center font-black text-xs hover:bg-white hover:text-slate-950 transition-all cursor-pointer font-heading tracking-widest">{social}</div>
                      ))}
                  </div>
              </div>
              <div className="space-y-10">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 font-heading">Colony Map</h4>
                  <ul className="space-y-6 text-sm font-black uppercase tracking-widest font-heading text-slate-400">
                      <li className="hover:text-white cursor-pointer transition-colors" onClick={() => setActiveTab('home')}>Home</li>
                      <li className="hover:text-white cursor-pointer transition-colors" onClick={() => setActiveTab('pricing')}>Pricing Plans</li>
                      <li className="hover:text-white cursor-pointer transition-colors" onClick={() => setActiveTab('about')}>The Story (About)</li>
                      <li className="hover:text-white cursor-pointer transition-colors" onClick={() => setActiveTab('dashboard')}>Launch App</li>
                  </ul>
              </div>
              <div className="space-y-10">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-500 font-heading">Founder Info</h4>
                  <ul className="space-y-6 text-sm font-black uppercase tracking-widest font-heading text-slate-400">
                      <li><a href="https://github.com/shagatomte19" target="_blank" className="hover:text-white transition-colors">GitHub Profile</a></li>
                      <li><a href="https://linkedin.com/in/shagatomte19" target="_blank" className="hover:text-white transition-colors">LinkedIn Profile</a></li>
                      <li><a href="https://shagatomte19.github.io" target="_blank" className="hover:text-white transition-colors">Personal Portfolio</a></li>
                      <li className="hover:text-white cursor-pointer transition-colors">Support Nest</li>
                  </ul>
              </div>
          </div>
          <div className="max-w-7xl mx-auto pt-16 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-8">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 font-heading">© 2024 ContANT Intellectual Assets. All Rights Reserved.</span>
              <div className="flex space-x-10 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 font-heading">
                  <span className="hover:text-white cursor-pointer transition-colors">Terms of Pheromone</span>
                  <span className="hover:text-white cursor-pointer transition-colors">Privacy Protocol</span>
              </div>
          </div>
      </footer>
    </div>
  );
};

export default Layout;