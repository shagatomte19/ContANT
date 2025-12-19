import React, { useState, useEffect, useRef } from 'react';
import {
    ArrowRight, Sparkles, Zap, Layers,
    Play, Mic, FileText, Twitter, Linkedin,
    Mail, Globe, Cpu, ChevronRight, Wand2,
    Loader2, Copy, Heart, Activity, Search,
    BarChart2, Shield, MousePointer2, ZapOff,
    Check, ArrowUpRight, MessageSquare, Plus,
    Hash, Users, Target, BookOpen, Quote,
    RefreshCw, Link, MapPin, Eye, TrendingUp,
    Crosshair
} from 'lucide-react';
import { generatePlatformContent } from '../services/api';
import { ContentFormat, InputType } from '../types';
import { AntIcon } from './Layout';

interface Props {
    onNavigate: (page: string) => void;
}

const HomePage: React.FC<Props> = ({ onNavigate }) => {
    const [activeTab, setActiveTab] = useState<'blog' | 'video' | 'audio'>('blog');
    const [isScrolled, setIsScrolled] = useState(false);
    const [demoInput, setDemoInput] = useState('Building a successful brand requires consistency, clear messaging, and a deep understanding of your audience\'s pain points. Most people focus on the features, but the secret is in the emotional benefit.');
    const [demoFormat, setDemoFormat] = useState<ContentFormat>(ContentFormat.TWITTER);
    const [demoIsGenerating, setDemoIsGenerating] = useState(false);
    const [demoOutput, setDemoOutput] = useState<string>('');

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleDemoGenerate = async () => {
        if (!demoInput.trim()) return;
        setDemoIsGenerating(true);
        setDemoOutput('');
        try {
            const content = await generatePlatformContent({
                sourceText: demoInput,
                inputType: InputType.TEXT,
                selectedFormats: [demoFormat],
                brandVoice: {
                    name: 'Demo Voice',
                    tone: 'Engaging & Viral',
                    audience: 'Creators',
                    keywords: ['Success', 'Branding', 'Emotion']
                },
            }, demoFormat);
            setDemoOutput(content);
        } catch (e) {
            setDemoOutput("Error: Worker disconnected. Check your API configuration.");
        } finally {
            setDemoIsGenerating(false);
        }
    };

    return (
        <div className="flex flex-col items-center w-full overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans">

            {/* --- HERO SECTION --- */}
            <section className="relative w-full max-w-7xl mx-auto px-6 pt-24 pb-20 md:pt-40 md:pb-32 flex flex-col items-center text-center">
                {/* Modern Mesh Gradients */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] -z-10 animate-blob"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px] -z-10 animate-blob animation-delay-4000"></div>

                {/* Floating Interactive elements */}
                <div className="hidden lg:block absolute top-40 left-10 p-4 glass rounded-2xl shadow-2xl animate-float pointer-events-none rotate-[-12deg]">
                    <div className="flex items-center space-x-2 text-blue-600 font-black text-xs uppercase tracking-widest">
                        <Linkedin className="w-4 h-4" />
                        <span>LinkedIn Ready</span>
                    </div>
                </div>
                <div className="hidden lg:block absolute top-60 right-20 p-4 glass rounded-2xl shadow-2xl animate-float animation-delay-2000 pointer-events-none rotate-[8deg]">
                    <div className="flex items-center space-x-2 text-sky-500 font-black text-xs uppercase tracking-widest">
                        <Twitter className="w-4 h-4" />
                        <span>Thread Generated</span>
                    </div>
                </div>

                {/* Main Content */}
                <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xl mb-10 animate-in fade-in slide-in-from-bottom-4">
                    <AntIcon className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] font-heading">The Content Colony Methodology</span>
                </div>

                <h1 className="text-6xl md:text-9xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9] mb-10 animate-in fade-in slide-in-from-bottom-4 delay-100 font-heading">
                    Stop Writing. <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-400 dark:from-blue-400 dark:via-white dark:to-slate-600">
                        Start Deploying.
                    </span>
                </h1>

                <p className="text-xl md:text-3xl text-slate-600 dark:text-slate-400 max-w-3xl mb-12 leading-tight font-medium animate-in fade-in slide-in-from-bottom-4 delay-200 font-heading">
                    ContANT is a multi-modal "worker hive" that transforms a single source of truth into an entire ecosystem of platform-native content in seconds.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-6 animate-in fade-in slide-in-from-bottom-4 delay-300">
                    <button
                        onClick={() => onNavigate('create')}
                        className="group px-12 py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-3xl font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-slate-900/40 dark:shadow-white/10 font-heading tracking-tight flex items-center"
                    >
                        Start Your Colony
                        <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </button>
                    <button
                        onClick={() => onNavigate('dashboard')}
                        className="px-12 py-6 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-4 border-slate-200 dark:border-slate-800 rounded-3xl font-black text-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-heading tracking-tight"
                    >
                        See Dashboard
                    </button>
                </div>

                {/* --- DEMO SANDBOX --- */}
                <div className="relative w-full max-w-5xl mt-24 group">
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-[40px] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
                    <div className="relative bg-white dark:bg-slate-950 border-4 border-slate-200 dark:border-slate-900 rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">
                        {/* Left Panel: Inputs */}
                        <div className="md:w-2/5 p-8 bg-slate-50 dark:bg-slate-900/50 border-r-4 border-slate-100 dark:border-slate-900 flex flex-col">
                            <div className="flex items-center space-x-2 mb-8">
                                <div className="w-8 h-8 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-slate-900">
                                    <AntIcon className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 font-heading">Worker Interface</span>
                            </div>

                            <div className="flex-1 space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest font-heading">Source Material</label>
                                    <textarea
                                        value={demoInput}
                                        onChange={(e) => setDemoInput(e.target.value)}
                                        className="w-full h-40 p-5 bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:border-slate-900 dark:focus:border-white transition-all text-sm font-bold resize-none font-sans text-slate-900 dark:text-white"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest font-heading">Platform Target</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { id: ContentFormat.TWITTER, icon: Twitter, label: 'Thread' },
                                            { id: ContentFormat.LINKEDIN, icon: Linkedin, label: 'LinkedIn' },
                                        ].map((fmt) => (
                                            <button
                                                key={fmt.id}
                                                onClick={() => setDemoFormat(fmt.id)}
                                                className={`flex items-center justify-center space-x-2 py-3 rounded-xl text-[10px] font-black uppercase border-2 transition-all font-heading ${demoFormat === fmt.id ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white' : 'bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-slate-500'
                                                    }`}
                                            >
                                                <fmt.icon className="w-3 h-3" />
                                                <span>{fmt.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleDemoGenerate}
                                disabled={demoIsGenerating}
                                className="mt-8 w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-500 flex items-center justify-center transition-all disabled:opacity-50 font-heading"
                            >
                                {demoIsGenerating ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Zap className="w-4 h-4 mr-2" />}
                                {demoIsGenerating ? 'Lifting Payload...' : 'Process Asset'}
                            </button>
                        </div>

                        {/* Right Panel: Output Preview */}
                        <div className="md:w-3/5 p-8 flex flex-col relative bg-white dark:bg-slate-950">
                            <div className="flex items-center justify-between mb-8">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 font-heading">Processed Result</span>
                                {demoOutput && <button onClick={() => navigator.clipboard.writeText(demoOutput)} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg text-slate-400 hover:text-slate-900 transition-all"><Copy className="w-4 h-4" /></button>}
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                {!demoOutput && !demoIsGenerating ? (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-800">
                                        <ZapOff className="w-16 h-16 mb-4 opacity-10" />
                                        <p className="text-sm font-black uppercase opacity-20 font-heading">Worker Idle</p>
                                    </div>
                                ) : demoIsGenerating ? (
                                    <div className="h-full space-y-4">
                                        <div className="h-4 w-3/4 bg-slate-100 dark:bg-slate-900 animate-pulse rounded-lg"></div>
                                        <div className="h-4 w-1/2 bg-slate-100 dark:bg-slate-900 animate-pulse rounded-lg"></div>
                                        <div className="h-20 w-full bg-slate-100 dark:bg-slate-900 animate-pulse rounded-lg"></div>
                                    </div>
                                ) : (
                                    <div className="animate-in fade-in slide-in-from-right-4">
                                        <p className="text-slate-800 dark:text-slate-200 font-bold text-lg leading-relaxed whitespace-pre-wrap font-sans">{demoOutput}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- LOGO MARQUEE --- */}
            <section className="w-full py-16 border-y-4 border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 overflow-hidden">
                <div className="flex space-x-20 animate-marquee whitespace-nowrap items-center">
                    {['REPURPOSE', 'STRATEGY', 'VIRALITY', 'SEO', 'GROWTH', 'CONTENT', 'SYSTEM'].map((word, i) => (
                        <div key={i} className="flex items-center space-x-4">
                            <span className="text-6xl md:text-8xl font-black text-slate-200 dark:text-slate-900 font-heading tracking-tighter uppercase">{word}</span>
                            <AntIcon className="w-12 h-12 text-slate-200 dark:text-slate-900" />
                        </div>
                    ))}
                    {['REPURPOSE', 'STRATEGY', 'VIRALITY', 'SEO', 'GROWTH', 'CONTENT', 'SYSTEM'].map((word, i) => (
                        <div key={`d-${i}`} className="flex items-center space-x-4">
                            <span className="text-6xl md:text-8xl font-black text-slate-200 dark:text-slate-900 font-heading tracking-tighter uppercase">{word}</span>
                            <AntIcon className="w-12 h-12 text-slate-200 dark:text-slate-900" />
                        </div>
                    ))}
                </div>
            </section>

            {/* --- THE HIVE PROCESSOR --- */}
            <section className="w-full py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-40">
                        <div className="space-y-8 animate-in slide-in-from-left-10 duration-1000">
                            <div className="inline-flex p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl shadow-sm">
                                <Layers className="w-8 h-8" />
                            </div>
                            <h2 className="text-5xl font-black text-slate-900 dark:text-white font-heading tracking-tighter leading-none uppercase">The Hive Processor</h2>
                            <p className="text-2xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed font-heading">
                                One video. One podcast. One document. <br />
                                <span className="text-slate-900 dark:text-white">Our hive splits the atom.</span>
                            </p>
                            <div className="space-y-4">
                                {[
                                    'SEO-Driven Long-form Blogs that rank.',
                                    'Viral-optimized Twitter/X Threads for reach.',
                                    'Professional LinkedIn Updates for authority.',
                                    'High-conversion Newsletter subject & body hooks.',
                                    'Branded Marketing Visuals for every platform.'
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center space-x-3">
                                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white">
                                            <Check className="w-4 h-4" />
                                        </div>
                                        <span className="font-bold text-slate-800 dark:text-slate-300 font-sans">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative group perspective-1000">
                            <div className="absolute -inset-4 bg-blue-500 rounded-[40px] blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
                            <div className="relative bg-slate-900 rounded-[40px] p-8 aspect-square flex flex-col justify-center items-center shadow-2xl border-4 border-slate-800 transform group-hover:rotate-y-12 transition-transform duration-700">
                                <div className="grid grid-cols-2 gap-4 w-full h-full">
                                    <div className="bg-slate-800 rounded-3xl p-6 flex flex-col justify-center items-center text-center">
                                        <Twitter className="w-10 h-10 text-sky-400 mb-4" />
                                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest font-heading">Twitter Worker</span>
                                    </div>
                                    <div className="bg-blue-600 rounded-3xl p-6 flex flex-col justify-center items-center text-center">
                                        <Linkedin className="w-10 h-10 text-white mb-4" />
                                        <span className="text-[10px] font-black text-white/80 uppercase tracking-widest font-heading">LinkedIn Worker</span>
                                    </div>
                                    <div className="bg-white rounded-3xl p-6 flex flex-col justify-center items-center text-center">
                                        <Mail className="w-10 h-10 text-slate-900 mb-4" />
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-heading">Email Worker</span>
                                    </div>
                                    <div className="bg-slate-800 rounded-3xl p-6 flex flex-col justify-center items-center text-center">
                                        <FileText className="w-10 h-10 text-indigo-400 mb-4" />
                                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest font-heading">Blog Worker</span>
                                    </div>
                                </div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl border-8 border-slate-900 animate-pulse">
                                    <AntIcon className="w-10 h-10 text-slate-900" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- ALCHEMIST TOOLS SECTION --- */}
                    <div className="text-center mb-20">
                        <h2 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white font-heading tracking-tighter mb-6 uppercase">The Alchemist Tools</h2>
                        <p className="text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-medium font-heading">Fine-tune the chemical composition of your content for max conversion.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-48">
                        {[
                            { title: 'Emotion Engine', icon: Heart, desc: 'Why guess if your copy resonates? Inject precisely measured psychological triggers—Nostalgia for comfort, Fear for urgency, or Hope for aspiration—to drive high-intent actions.', color: 'text-rose-500', bg: 'bg-rose-500/10' },
                            { title: 'Hook Composer', icon: Zap, desc: 'The first 3 seconds are everything. Generate 10+ variations of scrolling-stopping openers using proven frameworks like the Open Loop, the Contrarian Flip, or Data Shock.', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
                            { title: 'Physics Engine', icon: Activity, desc: 'Visualize the narrative "heartbeat" of your content. Our engine analyzes text to map Tension against Pacing, ensuring your audience never gets bored or overwhelmed.', color: 'text-purple-500', bg: 'bg-purple-500/10' },
                            { title: 'Lore Builder', icon: Shield, desc: 'Turn a commodity business into a legendary brand. Forge your origin story, define your brand archetype, and identify the "Philosophical Enemy" you’re fighting against.', color: 'text-blue-500', bg: 'bg-blue-500/10' },
                            { title: 'Resurrection Lab', icon: RefreshCw, desc: 'Don\'t let great ideas die. Pivot high-performing "zombie" content into fresh angles. We modernize style, simplify complex nodes, and add metaphorical depth automatically.', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                            { title: 'Psych Analyzer', icon: Search, desc: 'Audit your copy through the eyes of a "Skeptical Buyer" or a "Busy Executive." Identify cognitive biases leveraged and get actionable tips to increase perceived value.', color: 'text-indigo-500', bg: 'bg-indigo-500/10' }
                        ].map((tool, i) => (
                            <div key={i} className="group p-10 bg-white dark:bg-slate-900 border-4 border-slate-100 dark:border-slate-800 rounded-[40px] hover:border-slate-900 dark:hover:border-white hover:shadow-2xl transition-all duration-500 flex flex-col">
                                <div className={`w-16 h-16 ${tool.bg} ${tool.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-sm`}>
                                    <tool.icon className="w-9 h-9" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white font-heading tracking-tighter mb-4 uppercase tracking-widest leading-none">{tool.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed font-sans">{tool.desc}</p>
                                <div className="mt-auto pt-6 flex items-center text-xs font-black uppercase text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors tracking-[0.2em]">
                                    Refine Tone <ArrowRight className="ml-2 w-3 h-3" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* --- SEO SCOUT INTELLIGENCE (DETAILED SEO SECTION) --- */}
                    <div className="relative bg-slate-900 rounded-[56px] p-12 md:p-24 overflow-hidden mb-32 group">
                        {/* Background Glows */}
                        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-blue-600/10 rounded-full blur-[140px] -z-0 -mr-64 -mt-64 animate-pulse-slow"></div>
                        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] -z-0 -ml-32 -mb-32"></div>

                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                            <div className="lg:col-span-7 space-y-10">
                                <div className="inline-flex items-center space-x-3 text-blue-400 font-black text-xs uppercase tracking-[0.3em] font-heading">
                                    <BarChart2 className="w-5 h-5" />
                                    <span>The Scout Intelligence Suite</span>
                                </div>
                                <h2 className="text-6xl md:text-8xl font-black text-white font-heading tracking-tighter leading-[0.85] uppercase">Dominate <br /> Search.</h2>
                                <p className="text-2xl text-slate-400 font-medium leading-relaxed font-heading max-w-2xl">
                                    Ranking requires more than just keywords. Our AI "Scouts" perform the technical heavy-lifting to ensure your colony owns the first page.
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6">
                                    {[
                                        { title: 'Keyword Architect', icon: Crosshair, desc: 'Discover high-opportunity terms with real intent scoring and difficulty maps.', color: 'text-green-400' },
                                        { title: 'On-Page Auditor', icon: Eye, desc: 'Real-time content health score covering LSI density, readability, and UX.', color: 'text-blue-400' },
                                        { title: 'Competitor Gap', icon: Target, desc: 'Visualizes exactly which topics your rivals rank for that you are missing.', color: 'text-orange-400' },
                                        { title: 'Backlink Builder', icon: Link, desc: 'Generate high-authority linkable assets and outreach scripts instantly.', color: 'text-pink-400' }
                                    ].map((s, idx) => (
                                        <div key={idx} className="flex flex-col space-y-3 group/item">
                                            <div className="flex items-center space-x-3">
                                                <s.icon className={`w-6 h-6 ${s.color}`} />
                                                <h4 className="text-lg font-black text-white uppercase tracking-wider font-heading">{s.title}</h4>
                                            </div>
                                            <p className="text-sm text-slate-500 font-medium leading-relaxed font-sans">{s.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Dynamic Tool Visualizer Mockup */}
                            <div className="lg:col-span-5 relative perspective-1000">
                                <div className="bg-slate-800/40 backdrop-blur-3xl rounded-[40px] p-8 border-2 border-white/10 shadow-2xl rotate-y-[-10deg] hover:rotate-y-0 transition-transform duration-1000 group-hover:shadow-blue-500/20">
                                    <div className="flex items-center justify-between mb-10">
                                        <div className="flex space-x-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                                        </div>
                                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest font-heading">Live SEO Audit</span>
                                    </div>
                                    <div className="space-y-8">
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-end">
                                                <span className="text-xs font-bold text-slate-400 uppercase">Search Intent</span>
                                                <span className="text-xs font-black text-green-400 uppercase">Transactional</span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                                                <div className="h-full w-[85%] bg-blue-500 animate-pulse"></div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="h-3 w-3/4 bg-slate-700/50 rounded-lg"></div>
                                            <div className="h-3 w-1/2 bg-slate-700/50 rounded-lg"></div>
                                            <div className="h-3 w-2/3 bg-slate-700/50 rounded-lg"></div>
                                        </div>
                                        <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                                            <div className="bg-white/5 p-4 rounded-2xl text-center">
                                                <span className="block text-xl font-black text-white font-heading tracking-tighter">94/100</span>
                                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Health Score</span>
                                            </div>
                                            <div className="bg-white/5 p-4 rounded-2xl text-center">
                                                <span className="block text-xl font-black text-white font-heading tracking-tighter">Low</span>
                                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Difficulty</span>
                                            </div>
                                        </div>
                                        <button className="w-full py-4 bg-blue-600 rounded-2xl text-white text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all font-heading">Deploy To Production</button>
                                    </div>
                                </div>
                                {/* Secondary floating card */}
                                <div className="absolute -bottom-10 -left-10 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-2xl border-4 border-slate-100 dark:border-slate-800 rotate-[-5deg] animate-float">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <TrendingUp className="w-5 h-5 text-green-500" />
                                        <span className="text-xs font-black text-slate-900 dark:text-white uppercase font-heading">Gap Identified</span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold max-w-[150px]">Competitors are ranking for "Content Systems" but you are not.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- LOCAL SEO & SERP SPECIFICS --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-40">
                        <div className="bg-white dark:bg-slate-900 p-12 rounded-[48px] border-4 border-slate-200 dark:border-slate-800 hover:shadow-2xl transition-all duration-500 group">
                            <div className="w-14 h-14 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mb-8">
                                <MapPin className="w-8 h-8" />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white font-heading tracking-tighter mb-4 uppercase">Hyper-Local Domination</h3>
                            <p className="text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed font-sans mb-8">
                                Optimize your Google Business Profile instantly. We find local citation opportunities and generate localized post ideas to win the map pack.
                            </p>
                            <ul className="space-y-3">
                                {['GMB Category Selection', 'Location-Based Content Hooks', 'Citation Opportunity Mapping'].map((feat, i) => (
                                    <li key={i} className="flex items-center space-x-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                                        <Plus className="w-4 h-4 text-red-500" /> <span>{feat}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-12 rounded-[48px] border-4 border-slate-200 dark:border-slate-800 hover:shadow-2xl transition-all duration-500 group">
                            <div className="w-14 h-14 bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center mb-8">
                                <Search className="w-8 h-8" />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white font-heading tracking-tighter mb-4 uppercase">SERP Simulator</h3>
                            <p className="text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed font-sans mb-8">
                                Preview exactly how your meta titles and descriptions will look on Google. We generate three variations: Clickbait, Professional, and Question-based.
                            </p>
                            <ul className="space-y-3">
                                {['Automatic CTR Optimization', 'Real-time Snippet Preview', 'A/B Variant Generation'].map((feat, i) => (
                                    <li key={i} className="flex items-center space-x-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                                        <Plus className="w-4 h-4 text-purple-500" /> <span>{feat}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- REVIEWS / SOCIAL PROOF --- */}
            <section className="w-full py-32 bg-slate-50 dark:bg-slate-900/30 border-y-4 border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <span className="text-blue-600 font-black text-xs uppercase tracking-[0.4em] mb-4 block font-heading">Proven by Workers</span>
                        <h2 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white font-heading tracking-tighter uppercase">Hive Success Stories</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            { name: 'Alex Rivera', role: 'SaaS Founder', text: 'I used to spend 10 hours a week on content. With ContANT, I drop one Loom video into the hive and my Twitter, LinkedIn, and Blog are handled for the next 7 days. The SEO tools alone are worth the Pro plan.', avatar: 'bg-blue-500' },
                            { name: 'Sarah Chen', role: 'Content Strategist', text: 'The Psychology Analyzer is a game changer. Being able to audit my copy through the eyes of a "Skeptical Buyer" before hitting send has doubled my CTR. No other tool does this.', avatar: 'bg-purple-500' },
                            { name: 'Marcus Thorn', role: 'Agency Owner', text: 'Scaling my agency required more writers. Now, my existing team is 5x more productive because they focus on strategy while the workers handle the drafts. The hive is real.', avatar: 'bg-emerald-500' }
                        ].map((review, i) => (
                            <div key={i} className="p-12 bg-white dark:bg-slate-950 rounded-[48px] border-4 border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between group hover:border-blue-500 transition-colors">
                                <Quote className="w-12 h-12 text-slate-200 dark:text-slate-800 mb-8" />
                                <p className="text-xl text-slate-700 dark:text-slate-300 font-medium mb-10 leading-relaxed italic font-serif">"{review.text}"</p>
                                <div className="flex items-center space-x-5">
                                    <div className={`w-14 h-14 rounded-2xl ${review.avatar} flex items-center justify-center text-white font-black font-heading text-xl shadow-lg`}>{review.name[0]}</div>
                                    <div>
                                        <span className="block font-black text-slate-900 dark:text-white text-sm uppercase tracking-widest font-heading">{review.name}</span>
                                        <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest mt-1">{review.role}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CTA FINAL --- */}
            <section className="w-full py-48 px-6 relative overflow-hidden bg-white dark:bg-slate-950">
                <div className="absolute inset-0 bg-blue-600 opacity-0 dark:opacity-5 blur-[120px] pointer-events-none"></div>
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <h2 className="text-7xl md:text-9xl font-black text-slate-900 dark:text-white font-heading tracking-tighter mb-12 leading-[0.85] uppercase">Join the <br /> Production <br /> Colony.</h2>
                    <p className="text-2xl text-slate-600 dark:text-slate-400 mb-16 max-w-2xl mx-auto font-medium font-heading">
                        Thousands of content workers are waiting for your first asset. Join the most efficient production engine in the world.
                    </p>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                        <button
                            onClick={() => onNavigate('create')}
                            className="w-full md:w-auto px-16 py-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[40px] font-black text-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-slate-900/40 font-heading tracking-tight"
                        >
                            Start Your Hive Free
                        </button>
                        <button
                            onClick={() => onNavigate('pricing')}
                            className="w-full md:w-auto px-16 py-8 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-4 border-slate-200 dark:border-slate-800 rounded-[40px] font-black text-2xl hover:bg-slate-50 transition-all font-heading tracking-tight"
                        >
                            Explore Plans
                        </button>
                    </div>
                    <div className="mt-16 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
                        <div className="flex items-center space-x-2 text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest font-heading">
                            <Check className="w-4 h-4 text-green-500" />
                            <span>No CC Required</span>
                        </div>
                        <div className="flex items-center space-x-2 text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest font-heading">
                            <Check className="w-4 h-4 text-green-500" />
                            <span>Cancel Anytime</span>
                        </div>
                        <div className="flex items-center space-x-2 text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest font-heading">
                            <Check className="w-4 h-4 text-green-500" />
                            <span>Gemini 2.5 Powered</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;