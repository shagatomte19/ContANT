import React from 'react';
import { 
  AntIcon 
} from './Layout';
import { 
  Github, 
  Linkedin, 
  Globe, 
  Target, 
  Cpu, 
  Zap, 
  Users, 
  ShieldCheck,
  Mail,
  ExternalLink
} from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Section */}
      <div className="text-center mb-20">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-3xl mb-8 shadow-2xl animate-bounce-slow">
          <AntIcon className="w-12 h-12" />
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter mb-6 font-heading uppercase">
          The Story of the <span className="text-blue-600">Colony</span>
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed font-heading">
          ContANT was born from a simple observation: creators are drowning in the manual labor of distribution while their ideas remain trapped in single formats.
        </p>
      </div>

      {/* Philosophy Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32 items-center">
        <div className="space-y-8">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white font-heading tracking-tighter uppercase">Why the Ant?</h2>
          <div className="space-y-6">
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              An ant can carry up to <span className="text-blue-600 font-bold">50 times its own body weight</span>. They are the ultimate symbols of efficiency, strength, and collective intelligence. 
            </p>
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              We built ContANT to be the digital worker that carries your content weight. Our AI "colony" takes your single massive idea and breaks it down into platform-native pheromones that attract the right audience everywhere.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-3xl font-black text-blue-600 mb-1">50x</div>
              <div className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest">Efficiency Multiplier</div>
            </div>
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-3xl font-black text-indigo-600 mb-1">0%</div>
              <div className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest">Manual Friction</div>
            </div>
          </div>
        </div>
        <div className="relative group">
          <div className="absolute -inset-4 bg-blue-500 rounded-[48px] blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
          <div className="relative bg-slate-900 rounded-[48px] p-12 aspect-square flex flex-col items-center justify-center border-8 border-slate-800 shadow-2xl">
             <AntIcon className="w-48 h-48 text-white opacity-20 absolute" />
             <div className="relative z-10 text-center">
                <div className="text-white font-black text-4xl font-heading mb-4 uppercase tracking-tighter">Strength in <br/> Systems.</div>
                <div className="h-1.5 w-24 bg-blue-600 mx-auto rounded-full"></div>
             </div>
          </div>
        </div>
      </div>

      {/* Objectives Section */}
      <div className="mb-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white font-heading tracking-tighter uppercase">Our Core Objectives</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              title: "Democratize Distribution", 
              desc: "Make omni-channel presence accessible to solo creators, not just large media corporations with 20-person editing teams.",
              icon: Target,
              color: "text-red-500"
            },
            { 
              title: "Scientific Copywriting", 
              desc: "Moving beyond 'gut feeling' by leveraging Gemini's advanced reasoning to audit copy for cognitive biases and emotional impact.",
              icon: Cpu,
              color: "text-blue-500"
            },
            { 
              title: "Scale Without Soul-Loss", 
              desc: "Using 'Brand Voice Pheromones' to ensure that even when AI generates content, it retains the unique DNA of the original creator.",
              icon: Zap,
              color: "text-amber-500"
            }
          ].map((obj, i) => (
            <div key={i} className="p-10 bg-white dark:bg-slate-900 rounded-[40px] border-4 border-slate-200 dark:border-slate-800 shadow-xl hover:border-slate-900 dark:hover:border-white transition-all duration-500">
              <obj.icon className={`w-12 h-12 ${obj.color} mb-8`} />
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter font-heading">{obj.title}</h3>
              <p className="text-slate-700 dark:text-slate-400 font-medium leading-relaxed">{obj.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Founder Section */}
      <div className="bg-slate-950 rounded-[56px] p-12 md:p-24 overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[140px] -z-0 -mr-64 -mt-64 animate-pulse-slow"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/3">
             <div className="relative group/avatar">
                <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-[40px] blur-xl opacity-20 group-hover/avatar:opacity-40 transition-opacity"></div>
                <div className="relative aspect-square rounded-[40px] bg-slate-900 border-4 border-slate-800 overflow-hidden flex items-center justify-center">
                   <Users className="w-32 h-32 text-slate-700" />
                </div>
             </div>
          </div>
          <div className="md:w-2/3 space-y-8">
            <div className="inline-flex items-center space-x-2 text-blue-400 font-black text-xs uppercase tracking-[0.3em] font-heading">
              <ShieldCheck className="w-5 h-5" />
              <span>Colony Founder</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white font-heading tracking-tighter leading-none uppercase">
              Enamul Hasan <br /> Shagato
            </h2>
            <p className="text-xl text-slate-400 font-medium leading-relaxed font-heading max-w-xl">
              A full-stack engineer and content strategist obsessed with building systems that multiply human potential. Enamul envisions a world where AI doesn't replace the creator, but empowers them to be a whole colony of their own.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              {[
                { label: "GitHub", icon: Github, url: "https://github.com/shagatomte19" },
                { label: "LinkedIn", icon: Linkedin, url: "https://linkedin.com/in/shagatomte19" },
                { label: "Portfolio", icon: Globe, url: "https://shagatomte19.github.io" }
              ].map((link, i) => (
                <a 
                  key={i} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 px-6 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/10 transition-all group/link"
                >
                  <link.icon className="w-5 h-5" />
                  <span className="font-bold text-sm uppercase tracking-widest">{link.label}</span>
                  <ExternalLink className="w-4 h-4 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Contact/Links */}
      <div className="mt-32 text-center pb-20">
         <p className="text-slate-500 dark:text-slate-400 font-black uppercase text-xs tracking-[0.4em] mb-8">Got questions for the hive?</p>
         <a 
           href="mailto:contact@contant.ai" 
           className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white hover:text-blue-600 transition-colors font-heading tracking-tighter flex items-center justify-center group"
         >
           <Mail className="w-10 h-10 mr-4 group-hover:rotate-12 transition-transform" />
           HELLLO@CONTANT.AI
         </a>
      </div>
    </div>
  );
};

export default AboutPage;