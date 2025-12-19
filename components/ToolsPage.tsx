import React, { useState } from 'react';
import { 
  Sparkles, Zap, Activity, Repeat, Search, 
  Heart, Loader2, Copy, Shield, AlertTriangle, 
  Settings2, Target, Eye, Ear, Mic, Type, 
  User, History, Layers
} from 'lucide-react';
import { 
  generateContextualHooks, 
  generateEmotionalContent, 
  analyzeNarrativePhysics, 
  generateBrandLore, 
  resurrectIdea, 
  analyzeWhyItWorks 
} from '../services/geminiService';
import { 
  HookSuggestion, 
  NarrativePoint, 
  BrandLore, 
  ResurrectionVariant, 
  DeepAnalysis 
} from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

interface Props {
  showToast: (title: string, type: 'success' | 'error' | 'info') => void;
}

const ToolsPage: React.FC<Props> = ({ showToast }) => {
  const [activeTool, setActiveTool] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // --- 1. Emotion Generator State ---
  const [emoTopic, setEmoTopic] = useState('');
  const [emoType, setEmoType] = useState('Curiosity');
  const [emoIntensity, setEmoIntensity] = useState(7);
  const [emoSensory, setEmoSensory] = useState<string[]>(['Sight']);
  const [emoFormat, setEmoFormat] = useState('Story');
  const [emoAudience, setEmoAudience] = useState('General Audience');
  const [emoResult, setEmoResult] = useState('');

  // --- 2. Hook Composer State ---
  const [hookContext, setHookContext] = useState('');
  const [hookPlatform, setHookPlatform] = useState('Twitter/X');
  const [hookFrameworks, setHookFrameworks] = useState<string[]>([]);
  const [hooks, setHooks] = useState<HookSuggestion[]>([]);

  // --- 3. Narrative Physics State ---
  const [narrativeText, setNarrativeText] = useState('');
  const [narrativePoints, setNarrativePoints] = useState<NarrativePoint[]>([]);

  // --- 4. Brand Lore State ---
  const [loreInput, setLoreInput] = useState('');
  const [loreArchetype, setLoreArchetype] = useState('The Hero');
  const [loreStyle, setLoreStyle] = useState('Epic & Legendary');
  const [loreResult, setLoreResult] = useState<BrandLore | null>(null);

  // --- 5. Resurrection Lab State ---
  const [oldContent, setOldContent] = useState('');
  const [resurrectPivot, setResurrectPivot] = useState('Modernize & Simplify');
  const [resurrected, setResurrected] = useState<ResurrectionVariant[]>([]);

  // --- 6. Why It Works State ---
  const [analysisText, setAnalysisText] = useState('');
  const [analysisPersona, setAnalysisPersona] = useState('Skeptical Buyer');
  const [analysisResult, setAnalysisResult] = useState<DeepAnalysis | null>(null);

  const tools = [
    { id: 0, name: "Emotion Engine", icon: Heart, desc: "Inject specific feelings into your copy." },
    { id: 1, name: "Hook Composer", icon: Zap, desc: "Generate platform-specific viral openers." },
    { id: 2, name: "Physics Engine", icon: Activity, desc: "Visualize narrative tension and pacing." },
    { id: 3, name: "Lore Builder", icon: Shield, desc: "Forge your brand's mythos and enemy." },
    { id: 4, name: "Resurrection Lab", icon: Repeat, desc: "Pivot dead content into new angles." },
    { id: 5, name: "Psych Analyzer", icon: Search, desc: "Decode copy through specific personas." },
  ];

  // --- Handlers ---

  const handleEmotionGen = async () => {
     if (!emoTopic) return;
     setIsLoading(true);
     try {
        const res = await generateEmotionalContent(
            emoTopic, 
            emoType, 
            emoIntensity.toString(),
            emoSensory,
            emoFormat,
            emoAudience
        );
        setEmoResult(res);
     } catch(e) { showToast("Failed to generate", "error"); }
     setIsLoading(false);
  };

  const handleHookGen = async () => {
    if (!hookContext) return;
    setIsLoading(true);
    try {
       const res = await generateContextualHooks(hookContext, hookPlatform, hookFrameworks);
       setHooks(res);
    } catch(e) { showToast("Failed to generate hooks", "error"); }
    setIsLoading(false);
  };

  const handleNarrativeGen = async () => {
    if (!narrativeText) return;
    setIsLoading(true);
    try {
       const res = await analyzeNarrativePhysics(narrativeText);
       setNarrativePoints(res);
    } catch(e) { showToast("Analysis failed", "error"); }
    setIsLoading(false);
  };

  const handleLoreGen = async () => {
    if (!loreInput) return;
    setIsLoading(true);
    try {
       const res = await generateBrandLore(loreInput, loreArchetype, loreStyle);
       setLoreResult(res);
    } catch(e) { showToast("Failed to build lore", "error"); }
    setIsLoading(false);
  };

  const handleResurrection = async () => {
    if (!oldContent) return;
    setIsLoading(true);
    try {
       const res = await resurrectIdea(oldContent, resurrectPivot);
       setResurrected(res);
    } catch(e) { showToast("Resurrection failed", "error"); }
    setIsLoading(false);
  };

  const handleDeepAnalysis = async () => {
    if (!analysisText) return;
    setIsLoading(true);
    try {
       const res = await analyzeWhyItWorks(analysisText, analysisPersona);
       setAnalysisResult(res);
    } catch(e) { showToast("Analysis failed", "error"); }
    setIsLoading(false);
  };

  // --- Helper Components ---
  const SectionLabel = ({ icon: Icon, text }: { icon: any, text: string }) => (
      <div className="flex items-center space-x-2 text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">
          <Icon className="w-4 h-4" />
          <span>{text}</span>
      </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[700px] animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Sidebar Navigation */}
      <div className="lg:w-1/4 space-y-3">
         <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-6 pl-2">Power Tools</h2>
         <div className="space-y-2">
            {tools.map((tool) => (
                <button
                key={tool.id}
                onClick={() => { setActiveTool(tool.id); setIsLoading(false); }}
                className={`w-full text-left p-4 rounded-2xl flex items-center transition-all duration-300 border ${
                    activeTool === tool.id 
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-xl transform scale-[1.02]' 
                        : 'bg-white dark:bg-slate-900 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800'
                }`}
                >
                <div className={`p-2.5 rounded-xl mr-4 transition-colors ${activeTool === tool.id ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                    <tool.icon className="w-5 h-5" />
                </div>
                <div>
                    <div className="font-bold text-sm">{tool.name}</div>
                    <div className={`text-[10px] font-medium mt-1 ${activeTool === tool.id ? 'opacity-80' : 'text-slate-500 dark:text-slate-400'}`}>{tool.desc}</div>
                </div>
                </button>
            ))}
         </div>
      </div>

      {/* Main Tool Area */}
      <div className="lg:w-3/4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-black/40 p-1 min-h-[600px] flex flex-col relative overflow-hidden">
         {/* Background Decoration */}
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-full blur-[100px] opacity-70 -mr-32 -mt-32 pointer-events-none"></div>

         <div className="flex-1 p-8 md:p-10 relative z-10 flex flex-col">
            
            {/* --- 1. Emotion Generator --- */}
            {activeTool === 0 && (
               <div className="flex flex-col h-full">
                  <div className="flex items-center space-x-4 mb-8">
                     <div className="p-4 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-2xl shadow-sm"><Heart className="w-8 h-8"/></div>
                     <div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Emotion Engine</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">Craft content that hits specific emotional chords.</p>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-full">
                     {/* Controls */}
                     <div className="md:col-span-5 space-y-6">
                        <div>
                            <SectionLabel icon={Settings2} text="Core Settings" />
                            <textarea 
                                className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-transparent focus:bg-white dark:focus:bg-slate-950 focus:border-rose-500 outline-none text-slate-900 dark:text-white text-sm font-medium resize-none transition-all" 
                                placeholder="Topic (e.g., The struggle of starting a business)"
                                rows={3}
                                value={emoTopic} onChange={e => setEmoTopic(e.target.value)}
                            />
                        </div>
                        
                        <div>
                           <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block">Target Emotion</label>
                           <div className="flex flex-wrap gap-2">
                              {['Curiosity', 'Fear', 'Joy', 'Anger', 'Hope', 'Nostalgia'].map(e => (
                                 <button key={e} onClick={() => setEmoType(e)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${emoType === e ? 'bg-rose-50 border-rose-500 text-rose-600 dark:bg-rose-900/20 dark:text-rose-300' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 hover:border-slate-300'}`}>
                                    {e}
                                 </button>
                              ))}
                           </div>
                        </div>

                        <div>
                           <div className="flex justify-between mb-2">
                              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Intensity</label>
                              <span className="text-xs font-bold text-rose-500">{emoIntensity}/10</span>
                           </div>
                           <input 
                              type="range" min="1" max="10" value={emoIntensity} onChange={e => setEmoIntensity(parseInt(e.target.value))}
                              className="w-full accent-rose-500 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                           />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block">Audience</label>
                                <select value={emoAudience} onChange={(e) => setEmoAudience(e.target.value)} className="w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-bold border border-slate-200 dark:border-transparent focus:border-rose-500 outline-none text-slate-900 dark:text-white">
                                    <option>General Audience</option><option>Experts</option><option>Beginners</option><option>Skeptics</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block">Format</label>
                                <select value={emoFormat} onChange={(e) => setEmoFormat(e.target.value)} className="w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-bold border border-slate-200 dark:border-transparent focus:border-rose-500 outline-none text-slate-900 dark:text-white">
                                    <option>Story</option><option>Rant</option><option>Poem</option><option>Monologue</option>
                                </select>
                            </div>
                        </div>

                        <button onClick={handleEmotionGen} disabled={isLoading} className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold shadow-lg shadow-rose-500/20 transition-all flex justify-center items-center">
                           {isLoading ? <Loader2 className="animate-spin" /> : "Generate Content"}
                        </button>
                     </div>

                     {/* Output */}
                     <div className="md:col-span-7 bg-slate-50 dark:bg-slate-950 rounded-2xl p-8 border border-slate-100 dark:border-slate-800 flex flex-col">
                        <SectionLabel icon={Eye} text="Result" />
                        {emoResult ? (
                           <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                               <p className="text-slate-800 dark:text-slate-200 text-lg leading-relaxed whitespace-pre-wrap font-medium">{emoResult}</p>
                           </div>
                        ) : (
                           <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-white/50 dark:bg-slate-900/50">
                               <Heart className="w-8 h-8 mb-2 opacity-50" />
                               <span>Content will appear here</span>
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            )}

            {/* --- 2. Hook Composer --- */}
            {activeTool === 1 && (
               <div className="flex flex-col h-full">
                  <div className="flex items-center space-x-4 mb-8">
                     <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 rounded-2xl shadow-sm"><Zap className="w-8 h-8"/></div>
                     <div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Hook Composer</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">Stop the scroll with platform-native opening lines.</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-full">
                     <div className="md:col-span-5 space-y-6">
                        <div>
                            <SectionLabel icon={Layers} text="Context & Settings" />
                            <textarea 
                                className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-transparent focus:bg-white dark:focus:bg-slate-950 focus:border-yellow-500 outline-none text-slate-900 dark:text-white text-sm font-medium resize-none transition-all" 
                                placeholder="What is your content about? Paste a draft or a summary."
                                rows={4}
                                value={hookContext} onChange={e => setHookContext(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block">Platform</label>
                            <div className="flex gap-2">
                                {['Twitter/X', 'LinkedIn', 'TikTok Script', 'YouTube Intro'].map(p => (
                                    <button key={p} onClick={() => setHookPlatform(p)} className={`flex-1 py-2 rounded-xl text-[10px] font-bold border transition-all ${hookPlatform === p ? 'bg-yellow-500 text-white border-yellow-500 shadow-md' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-transparent text-slate-600 dark:text-slate-500'}`}>
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block">Frameworks</label>
                            <div className="flex flex-wrap gap-2">
                                {['Open Loop', 'Contrarian', 'Negative', 'Story Start', 'Data Shock', 'How-To'].map(f => (
                                    <button key={f} onClick={() => setHookFrameworks(prev => prev.includes(f) ? prev.filter(i => i !== f) : [...prev, f])} className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${hookFrameworks.includes(f) ? 'bg-yellow-50 border-yellow-500 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600'}`}>
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button onClick={handleHookGen} disabled={isLoading} className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-white rounded-xl font-bold shadow-lg shadow-yellow-500/20 transition-all flex justify-center items-center">
                            {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : "Generate Hooks"}
                        </button>
                     </div>

                     <div className="md:col-span-7 bg-slate-50 dark:bg-slate-950 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 overflow-y-auto custom-scrollbar">
                        <SectionLabel icon={Eye} text="Variations" />
                        <div className="space-y-4">
                            {hooks.length === 0 && (
                                <div className="h-48 flex flex-col items-center justify-center text-slate-400 text-sm border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-white/50 dark:bg-slate-900/50">
                                    <Zap className="w-8 h-8 mb-2 opacity-50" />
                                    <span>Hooks will appear here</span>
                                </div>
                            )}
                            {hooks.map((hook, i) => (
                                <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm group hover:border-yellow-200 dark:hover:border-yellow-900 transition-all">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center space-x-2">
                                            <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-[10px] font-bold uppercase rounded">{hook.type}</span>
                                            <span className="text-[10px] font-bold text-green-600">Score: {hook.viralityScore}</span>
                                        </div>
                                        <button onClick={() => navigator.clipboard.writeText(hook.text)} className="text-slate-400 hover:text-yellow-500 transition-colors"><Copy className="w-4 h-4" /></button>
                                    </div>
                                    <p className="text-slate-900 dark:text-white font-bold text-lg mb-2 leading-tight">"{hook.text}"</p>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                                        <span className="font-bold">Why it works:</span> {hook.explanation}
                                    </p>
                                </div>
                            ))}
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {/* --- 3. Narrative Physics --- */}
            {activeTool === 2 && (
               <div className="flex flex-col h-full">
                   <div className="flex items-center space-x-4 mb-8">
                     <div className="p-4 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-2xl shadow-sm"><Activity className="w-8 h-8"/></div>
                     <div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Narrative Physics Engine</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">Visualize the heartbeat of your story: Tension vs. Pacing.</p>
                     </div>
                  </div>

                  <div className="flex gap-4 mb-6">
                     <input 
                        className="flex-1 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-transparent focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
                        placeholder="Paste your content here to analyze its flow..."
                        value={narrativeText} onChange={e => setNarrativeText(e.target.value)}
                     />
                     <button onClick={handleNarrativeGen} disabled={isLoading} className="px-8 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/20">
                        {isLoading ? <Loader2 className="animate-spin" /> : "Analyze"}
                     </button>
                  </div>

                  {narrativePoints.length > 0 ? (
                     <div className="flex-1 bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <SectionLabel icon={Activity} text="Tension & Pacing Arc" />
                            <div className="flex space-x-4 text-xs font-bold text-slate-700 dark:text-slate-300">
                                <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>Tension</div>
                                <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>Pacing</div>
                            </div>
                        </div>
                        <div className="flex-1 w-full min-h-[300px]">
                           <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={narrativePoints}>
                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" strokeOpacity={0.5} />
                                 <XAxis dataKey="index" hide />
                                 <YAxis hide domain={[0, 100]} />
                                 <RechartsTooltip 
                                    content={({ active, payload }) => {
                                       if (active && payload && payload.length) {
                                          const data = payload[0].payload;
                                          return (
                                             <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 max-w-xs">
                                                <p className="font-bold text-slate-900 dark:text-white mb-2 text-sm">"{data.snippet}..."</p>
                                                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">{data.insight}</p>
                                                <div className="flex justify-between items-center text-xs font-bold">
                                                    <span className="text-purple-600">Tension: {data.tension}</span>
                                                    <span className="text-blue-500">Pacing: {data.pacing}</span>
                                                </div>
                                             </div>
                                          );
                                       }
                                       return null;
                                    }}
                                 />
                                 <Line type="monotone" dataKey="tension" stroke="#9333ea" strokeWidth={3} dot={{ r: 4, fill: '#9333ea' }} activeDot={{ r: 6 }} />
                                 <Line type="monotone" dataKey="pacing" stroke="#60a5fa" strokeWidth={2} strokeDasharray="5 5" dot={false} activeDot={{ r: 6 }} />
                              </LineChart>
                           </ResponsiveContainer>
                        </div>
                     </div>
                  ) : (
                     <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 bg-slate-50/50 dark:bg-slate-900/50">
                        <Activity className="w-12 h-12 mb-4 opacity-20" />
                        <p className="font-medium text-slate-500">Analysis visualization will appear here.</p>
                     </div>
                  )}
               </div>
            )}

            {/* --- 4. Brand Lore --- */}
            {activeTool === 3 && (
               <div className="flex flex-col h-full">
                  <div className="flex items-center space-x-4 mb-8">
                     <div className="p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl shadow-sm"><Shield className="w-8 h-8"/></div>
                     <div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Brand Lore Builder</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">Define the legend behind your business.</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                     <div className="md:col-span-4 space-y-6">
                        <div>
                            <SectionLabel icon={User} text="Identity" />
                            <textarea 
                                className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-transparent text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                                placeholder="Brand Name, Industry, Key Values..."
                                rows={3}
                                value={loreInput} onChange={e => setLoreInput(e.target.value)}
                            />
                        </div>
                        
                        <div>
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block">Archetype</label>
                            <select value={loreArchetype} onChange={(e) => setLoreArchetype(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-bold border border-slate-200 dark:border-transparent focus:border-blue-500 outline-none text-slate-900 dark:text-white">
                                {['The Hero', 'The Rebel', 'The Sage', 'The Creator', 'The Ruler', 'The Magician', 'The Caregiver', 'The Explorer'].map(a => <option key={a}>{a}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block">Voice Style</label>
                            <select value={loreStyle} onChange={(e) => setLoreStyle(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-bold border border-slate-200 dark:border-transparent focus:border-blue-500 outline-none text-slate-900 dark:text-white">
                                {['Epic & Legendary', 'Modern & Minimalist', 'Cyberpunk & Edgy', 'Warm & Folk', 'Scientific & Cold'].map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>

                        <button onClick={handleLoreGen} disabled={isLoading} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 flex justify-center items-center">
                           {isLoading ? <Loader2 className="animate-spin" /> : "Forge Legend"}
                        </button>
                     </div>

                     <div className="md:col-span-8 space-y-6">
                        {loreResult ? (
                            <div className="animate-in fade-in slide-in-from-right-10 space-y-6 h-full overflow-y-auto custom-scrollbar pr-2">
                                <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                                    <h4 className="text-xs font-bold text-blue-600 dark:text-blue-500 uppercase tracking-widest mb-4 relative z-10">The Origin Story</h4>
                                    <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-serif italic text-lg relative z-10">"{loreResult.originStory}"</p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                                        <h4 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">The Enemy</h4>
                                        <p className="text-red-600 font-black text-xl">{loreResult.enemy}</p>
                                    </div>
                                    <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                                        <h4 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Archetype Confirmed</h4>
                                        <p className="text-purple-600 font-black text-xl">{loreResult.archetype}</p>
                                    </div>
                                </div>

                                <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-20"></div>
                                    <h4 className="text-xs font-bold text-white/60 uppercase tracking-widest mb-4 relative z-10">The Manifesto</h4>
                                    <p className="text-xl md:text-2xl font-bold leading-relaxed relative z-10">"{loreResult.manifesto}"</p>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/50 text-slate-400">
                                <Shield className="w-12 h-12 mb-4 opacity-20" />
                                <p className="text-slate-500">Define your brand to reveal its lore.</p>
                            </div>
                        )}
                     </div>
                  </div>
               </div>
            )}

            {/* --- 5. Resurrection Lab --- */}
            {activeTool === 4 && (
               <div className="flex flex-col h-full">
                  <div className="flex items-center space-x-4 mb-8">
                     <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl shadow-sm"><Repeat className="w-8 h-8"/></div>
                     <div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Resurrection Lab</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">Give old ideas a new life with strategic pivots.</p>
                     </div>
                  </div>

                  <div className="flex flex-col gap-6 h-full">
                     <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-transparent">
                        <SectionLabel icon={History} text="Source Material" />
                        <div className="flex flex-col md:flex-row gap-4">
                            <textarea 
                                className="flex-1 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-transparent focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white text-sm"
                                placeholder="Paste old, flat content here..."
                                rows={4}
                                value={oldContent} onChange={e => setOldContent(e.target.value)}
                            />
                            <div className="md:w-64 flex flex-col gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block">Pivot Angle</label>
                                    <select value={resurrectPivot} onChange={(e) => setResurrectPivot(e.target.value)} className="w-full p-3 bg-white dark:bg-slate-900 rounded-xl text-xs font-bold border border-slate-200 dark:border-transparent focus:border-emerald-500 outline-none text-slate-900 dark:text-white">
                                        <option>Modernize & Simplify</option>
                                        <option>Contrarian Flip</option>
                                        <option>Story-Driven</option>
                                        <option>Actionable Checklist</option>
                                        <option>Metaphorical</option>
                                    </select>
                                </div>
                                <button onClick={handleResurrection} disabled={isLoading} className="flex-1 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20 flex flex-col items-center justify-center p-4">
                                    {isLoading ? <Loader2 className="animate-spin mb-2" /> : <Sparkles className="w-6 h-6 mb-2" />}
                                    <span>Resurrect Idea</span>
                                </button>
                            </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
                        {resurrected.length > 0 ? resurrected.map((item, i) => (
                           <div key={i} className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all group flex flex-col">
                              <div className="mb-4">
                                 <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-full text-[10px] font-bold uppercase tracking-wider">{item.style}</span>
                              </div>
                              <div className="flex-1 overflow-y-auto custom-scrollbar max-h-[200px] mb-4">
                                  <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed">{item.content}</p>
                              </div>
                              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                  <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">Pivot Strategy</p>
                                  <p className="text-xs text-slate-600 dark:text-slate-400 italic">{item.reasoning}</p>
                              </div>
                           </div>
                        )) : (
                            <div className="col-span-3 flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                                <span className="text-slate-500">Waiting for input...</span>
                            </div>
                        )}
                     </div>
                  </div>
               </div>
            )}

            {/* --- 6. Why It Works --- */}
            {activeTool === 5 && (
               <div className="flex flex-col h-full">
                  <div className="flex items-center space-x-4 mb-8">
                     <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl shadow-sm"><Search className="w-8 h-8"/></div>
                     <div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Psych Analyzer</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">Reverse-engineer success with behavioral psychology.</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-full">
                     <div className="md:col-span-5 space-y-6">
                        <SectionLabel icon={Type} text="Input Text" />
                        <textarea 
                            className="w-full p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-transparent focus:ring-2 focus:ring-indigo-500 h-64 text-sm text-slate-900 dark:text-white placeholder-slate-400 resize-none font-medium" 
                            placeholder="Paste any high-performing text here (ads, emails, viral posts)..."
                            value={analysisText} onChange={e => setAnalysisText(e.target.value)}
                        />
                        
                        <div>
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block">Simulate Audience Persona</label>
                            <select value={analysisPersona} onChange={(e) => setAnalysisPersona(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-bold border border-slate-200 dark:border-transparent focus:border-indigo-500 outline-none text-slate-900 dark:text-white">
                                <option>Skeptical Buyer</option>
                                <option>Enthusiastic Fan</option>
                                <option>Busy Executive</option>
                                <option>Impulse Shopper</option>
                                <option>Industry Expert</option>
                            </select>
                        </div>

                        <button onClick={handleDeepAnalysis} disabled={isLoading} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 flex items-center justify-center">
                            {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : "Decode Psychology"}
                        </button>
                     </div>

                     <div className="md:col-span-7 space-y-6 overflow-y-auto custom-scrollbar pr-2">
                        {analysisResult ? (
                            <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6">
                                <div className="flex items-center justify-between bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 rounded-full border-4 border-indigo-500 flex items-center justify-center text-xl font-bold mr-4">{analysisResult.overallScore}</div>
                                    <div>
                                        <span className="font-bold text-lg block">Persuasion Score</span>
                                        <span className="text-xs text-slate-400">Based on behavioral triggers</span>
                                    </div>
                                </div>
                                </div>
                                
                                <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                                    <h4 className="font-bold text-slate-600 dark:text-slate-400 uppercase text-xs mb-3 flex items-center"><User className="w-4 h-4 mr-2"/> Simulated Reaction: {analysisPersona}</h4>
                                    <p className="text-slate-800 dark:text-slate-200 text-sm italic font-medium">"{analysisResult.audienceReaction}"</p>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                                    <h4 className="font-bold text-slate-600 dark:text-slate-400 uppercase text-xs mb-4">Cognitive Biases Leveraged</h4>
                                    <div className="space-y-4">
                                        {analysisResult.cognitiveBiases.map((b, i) => (
                                            <div key={i} className="flex items-start">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 mr-3 shrink-0"></div>
                                                <div>
                                                    <span className="font-bold text-slate-900 dark:text-white text-sm">{b.name}</span>
                                                    <p className="text-xs text-slate-600 dark:text-slate-400">{b.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {analysisResult.copyTriggers.map((t, i) => (
                                        <span key={i} className="px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-indigo-900 text-indigo-700 dark:text-indigo-400 rounded-lg text-xs font-bold shadow-sm">{t}</span>
                                    ))}
                                </div>

                                <div className="bg-orange-50 dark:bg-orange-900/10 p-6 rounded-2xl border border-orange-200 dark:border-orange-900/30">
                                <h4 className="font-bold text-orange-700 dark:text-orange-400 uppercase text-xs mb-4 flex items-center"><AlertTriangle className="w-4 h-4 mr-2"/> Improvement Tips</h4>
                                <ul className="space-y-2">
                                    {analysisResult.improvementTips.map((tip, i) => (
                                        <li key={i} className="text-sm font-medium text-slate-800 dark:text-slate-300 flex items-start">
                                            <span className="mr-2 text-orange-500">•</span> {tip}
                                        </li>
                                    ))}
                                </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white/50 dark:bg-slate-900/50">
                                <Search className="w-12 h-12 mb-4 opacity-20" />
                                <p className="text-slate-500">Analysis results will appear here.</p>
                            </div>
                        )}
                     </div>
                  </div>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default ToolsPage;