import React, { useState } from 'react';
import { 
  Search, BarChart2, Globe, Crosshair, 
  Loader2, CheckCircle, AlertCircle, Copy, 
  TrendingUp, TrendingDown, Layout, Map,
  Link, MapPin, ArrowLeft, ChevronRight, Mail, Star
} from 'lucide-react';
import { 
  generateSEOKeywords, 
  performSEOAudit, 
  generateSEOMetaTags, 
  analyzeCompetitorGap,
  generateBacklinkStrategy,
  generateLocalSEOAudit
} from '../services/geminiService';
import { 
  SEOKeyword, 
  SEOAudit, 
  SEOMeta, 
  SEOGapAnalysis,
  BacklinkStrategy,
  LocalSEO
} from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface Props {
  showToast: (title: string, type: 'success' | 'error' | 'info') => void;
}

type ViewState = 'HUB' | 'TOOL_KEYWORD' | 'TOOL_AUDIT' | 'TOOL_SERP' | 'TOOL_GAP' | 'TOOL_BACKLINK' | 'TOOL_LOCAL';

const SEOToolsPage: React.FC<Props> = ({ showToast }) => {
  const [currentView, setCurrentView] = useState<ViewState>('HUB');
  const [isLoading, setIsLoading] = useState(false);

  // --- 1. Keyword Architect ---
  const [kwTopic, setKwTopic] = useState('');
  const [kwRegion, setKwRegion] = useState('United States');
  const [keywords, setKeywords] = useState<SEOKeyword[]>([]);

  // --- 2. On-Page Auditor ---
  const [auditText, setAuditText] = useState('');
  const [auditKeyword, setAuditKeyword] = useState('');
  const [auditResult, setAuditResult] = useState<SEOAudit | null>(null);

  // --- 3. SERP Simulator ---
  const [serpContent, setSerpContent] = useState('');
  const [serpKeyword, setSerpKeyword] = useState('');
  const [metaTags, setMetaTags] = useState<SEOMeta[]>([]);

  // --- 4. Competitor Gap ---
  const [gapMyContent, setGapMyContent] = useState('');
  const [gapCompContent, setGapCompContent] = useState('');
  const [gapResult, setGapResult] = useState<SEOGapAnalysis | null>(null);

  // --- 5. Backlink Builder ---
  const [blDomain, setBlDomain] = useState('');
  const [blNiche, setBlNiche] = useState('');
  const [blResult, setBlResult] = useState<BacklinkStrategy | null>(null);

  // --- 6. Local SEO ---
  const [localBizName, setLocalBizName] = useState('');
  const [localLocation, setLocalLocation] = useState('');
  const [localType, setLocalType] = useState('');
  const [localResult, setLocalResult] = useState<LocalSEO | null>(null);

  // --- Handlers ---

  const handleKeywordGen = async () => {
    if (!kwTopic) return;
    setIsLoading(true);
    try {
      const res = await generateSEOKeywords(kwTopic, kwRegion);
      setKeywords(res);
    } catch (e) { showToast("Failed to fetch keywords", "error"); }
    setIsLoading(false);
  };

  const handleAudit = async () => {
    if (!auditText || !auditKeyword) {
        showToast("Please enter both text and keyword", "error");
        return;
    }
    setIsLoading(true);
    try {
      const res = await performSEOAudit(auditText, auditKeyword);
      setAuditResult(res);
    } catch (e) { showToast("Audit failed", "error"); }
    setIsLoading(false);
  };

  const handleMetaGen = async () => {
    if (!serpKeyword) return;
    setIsLoading(true);
    try {
      const res = await generateSEOMetaTags(serpContent, serpKeyword);
      setMetaTags(res);
    } catch (e) { showToast("Generation failed", "error"); }
    setIsLoading(false);
  };

  const handleGapAnalysis = async () => {
    if (!gapMyContent || !gapCompContent) return;
    setIsLoading(true);
    try {
      const res = await analyzeCompetitorGap(gapMyContent, gapCompContent);
      setGapResult(res);
    } catch (e) { showToast("Analysis failed", "error"); }
    setIsLoading(false);
  };

  const handleBacklinkGen = async () => {
    if (!blDomain || !blNiche) return;
    setIsLoading(true);
    try {
      const res = await generateBacklinkStrategy(blDomain, blNiche);
      setBlResult(res);
    } catch (e) { showToast("Strategy failed", "error"); }
    setIsLoading(false);
  };

  const handleLocalGen = async () => {
    if (!localBizName || !localLocation) return;
    setIsLoading(true);
    try {
      const res = await generateLocalSEOAudit(localBizName, localLocation, localType);
      setLocalResult(res);
    } catch (e) { showToast("Optimization failed", "error"); }
    setIsLoading(false);
  };

  // --- Helper Components ---
  const DifficultyBadge = ({ score }: { score: number }) => {
    let color = 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    if (score > 40) color = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    if (score > 70) color = 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    return <span className={`px-2 py-1 rounded-full text-xs font-bold ${color}`}>{score}/100 KD</span>;
  };

  const TrendIcon = ({ trend }: { trend: string }) => {
      if (trend === 'Up') return <TrendingUp className="w-4 h-4 text-green-500" />;
      if (trend === 'Down') return <TrendingDown className="w-4 h-4 text-red-500" />;
      return <div className="w-4 h-1 bg-slate-300 rounded-full"></div>;
  };

  const HubCard = ({ icon: Icon, title, desc, viewId, color }: { icon: any, title: string, desc: string, viewId: ViewState, color: string }) => (
    <button 
        onClick={() => setCurrentView(viewId)}
        className="group relative p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 shadow-sm hover:shadow-xl transition-all duration-300 text-left overflow-hidden"
    >
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 rounded-full blur-3xl -mr-10 -mt-10 transition-opacity`}></div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${color} bg-opacity-10 text-opacity-100`}>
            <Icon className={`w-6 h-6 ${color.replace('from-', 'text-').replace('to-', '')} text-slate-900 dark:text-white`} />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
        <div className="mt-6 flex items-center text-xs font-bold text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            Launch Tool <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
        </div>
    </button>
  );

  const ToolHeader = ({ title, icon: Icon }: { title: string, icon: any }) => (
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
              <button onClick={() => setCurrentView('HUB')} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
                  <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-900 dark:text-white">
                      <Icon className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">{title}</h2>
              </div>
          </div>
      </div>
  );

  // --- RENDER ---

  if (currentView === 'HUB') {
      return (
          <div className="max-w-6xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="text-center mb-16">
                  <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">SEO Suite</h1>
                  <p className="text-lg text-slate-500 dark:text-slate-400">Comprehensive tools to dominate search rankings.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <HubCard viewId="TOOL_KEYWORD" icon={Crosshair} title="Keyword Architect" desc="Discover high-value keywords and search intent." color="from-green-500 to-emerald-500" />
                  <HubCard viewId="TOOL_AUDIT" icon={BarChart2} title="On-Page Auditor" desc="Score content against density and readability metrics." color="from-blue-500 to-cyan-500" />
                  <HubCard viewId="TOOL_SERP" icon={Search} title="SERP Simulator" desc="Preview and optimize your Google search snippets." color="from-purple-500 to-indigo-500" />
                  <HubCard viewId="TOOL_GAP" icon={Map} title="Competitor Gap" desc="Find missed topics your rivals are ranking for." color="from-orange-500 to-amber-500" />
                  <HubCard viewId="TOOL_BACKLINK" icon={Link} title="Backlink Builder" desc="Generate outreach strategies and linkable assets." color="from-pink-500 to-rose-500" />
                  <HubCard viewId="TOOL_LOCAL" icon={MapPin} title="Local SEO" desc="Optimize for Google Business and local citations." color="from-red-500 to-orange-500" />
              </div>
          </div>
      );
  }

  // --- TOOL VIEWS ---

  return (
    <div className="max-w-6xl mx-auto min-h-[800px] animate-in slide-in-from-right-10 duration-500">
        
        {/* --- 1. Keyword Architect --- */}
        {currentView === 'TOOL_KEYWORD' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl p-8">
                <ToolHeader title="Keyword Architect" icon={Crosshair} />
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                        <div>
                            <label className="text-xs font-bold text-slate-400 mb-2 block uppercase">Seed Topic</label>
                            <input className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-green-500 text-slate-900 dark:text-white font-bold" placeholder="e.g. Marketing" value={kwTopic} onChange={e => setKwTopic(e.target.value)} />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 mb-2 block uppercase">Region</label>
                            <select className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-green-500 text-slate-900 dark:text-white font-bold" value={kwRegion} onChange={e => setKwRegion(e.target.value)}><option>United States</option><option>United Kingdom</option><option>Global</option></select>
                        </div>
                        <button onClick={handleKeywordGen} disabled={isLoading} className="w-full py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold shadow-lg flex justify-center items-center">{isLoading ? <Loader2 className="animate-spin"/> : "Discover"}</button>
                    </div>
                    <div className="lg:col-span-3">
                        <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                                    <tr>
                                        <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase">Keyword</th>
                                        <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase">Intent</th>
                                        <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase">Trend</th>
                                        <th className="text-right py-4 px-6 text-xs font-bold text-slate-500 uppercase">Difficulty</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {keywords.length === 0 && <tr><td colSpan={4} className="py-20 text-center text-slate-400">Enter a topic to start research.</td></tr>}
                                    {keywords.map((k, i) => (
                                        <tr key={i} className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                            <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">{k.term}</td>
                                            <td className="py-4 px-6"><span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-bold text-slate-600 dark:text-slate-300 uppercase">{k.intent}</span></td>
                                            <td className="py-4 px-6"><div className="flex items-center gap-2"><TrendIcon trend={k.trend} /><span className="text-sm font-medium text-slate-600 dark:text-slate-400">{k.trend}</span></div></td>
                                            <td className="py-4 px-6 text-right"><DifficultyBadge score={k.difficulty} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* --- 2. On-Page Auditor --- */}
        {currentView === 'TOOL_AUDIT' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl p-8">
                <ToolHeader title="On-Page Auditor" icon={BarChart2} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div><label className="text-xs font-bold text-slate-400 mb-2 block uppercase">Target Keyword</label><input className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none text-slate-900 dark:text-white font-bold" value={auditKeyword} onChange={e => setAuditKeyword(e.target.value)} /></div>
                        <div><label className="text-xs font-bold text-slate-400 mb-2 block uppercase">Content</label><textarea className="w-full h-64 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none text-slate-900 dark:text-white font-medium resize-none" value={auditText} onChange={e => setAuditText(e.target.value)} /></div>
                        <button onClick={handleAudit} disabled={isLoading} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg flex justify-center items-center">{isLoading ? <Loader2 className="animate-spin"/> : "Analyze Content"}</button>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center">
                        {auditResult ? (
                            <div className="w-full space-y-8 animate-in fade-in">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Audit Score</h3>
                                    <span className="text-3xl font-extrabold text-blue-600">{auditResult.score}/100</span>
                                </div>
                                <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart outerRadius={90} data={[
                                            { subject: 'Technical', A: auditResult.breakdown?.technical || 0, fullMark: 100 },
                                            { subject: 'Content', A: auditResult.breakdown?.content || 0, fullMark: 100 },
                                            { subject: 'UX', A: auditResult.breakdown?.ux || 0, fullMark: 100 },
                                            { subject: 'Readability', A: auditResult.breakdown?.readability || 0, fullMark: 100 },
                                        ]}>
                                            <PolarGrid stroke="#94a3b8" />
                                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} />
                                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                            <Radar name="Score" dataKey="A" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.5} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-slate-400 uppercase">Suggestions</p>
                                    {auditResult.suggestions.map((s, i) => (
                                        <div key={i} className="flex items-start text-sm font-medium text-slate-700 dark:text-slate-300"><CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 shrink-0"/>{s}</div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-slate-400"><BarChart2 className="w-12 h-12 mx-auto mb-4 opacity-20"/><p>Awaiting input...</p></div>
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* --- 3. SERP Simulator --- */}
        {currentView === 'TOOL_SERP' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl p-8">
                <ToolHeader title="SERP Simulator" icon={Search} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div><label className="text-xs font-bold text-slate-400 mb-2 block uppercase">Keyword</label><input className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none text-slate-900 dark:text-white font-bold" value={serpKeyword} onChange={e => setSerpKeyword(e.target.value)} /></div>
                        <div><label className="text-xs font-bold text-slate-400 mb-2 block uppercase">Content / Summary</label><textarea className="w-full h-40 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none text-slate-900 dark:text-white font-medium resize-none" value={serpContent} onChange={e => setSerpContent(e.target.value)} /></div>
                        <button onClick={handleMetaGen} disabled={isLoading} className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold shadow-lg flex justify-center items-center">{isLoading ? <Loader2 className="animate-spin"/> : "Generate Meta Tags"}</button>
                    </div>
                    <div className="space-y-4">
                        {metaTags.map((meta, i) => (
                            <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 group hover:border-purple-300 transition-all cursor-pointer">
                                <div className="flex items-center text-xs text-[#202124] mb-1 font-sans">
                                    <div className="w-7 h-7 bg-slate-100 rounded-full mr-3 flex items-center justify-center"><Globe className="w-4 h-4 text-slate-400"/></div>
                                    <div className="flex flex-col">
                                        <span className="font-medium">yourwebsite.com</span>
                                        <span className="text-[10px] text-slate-500">https://yourwebsite.com › blog</span>
                                    </div>
                                </div>
                                <h3 className="text-[#1a0dab] text-xl font-medium truncate hover:underline mb-1 font-sans">{meta.title}</h3>
                                <p className="text-[#4d5156] text-sm leading-snug font-sans">{meta.description}</p>
                                <div className="mt-3 flex justify-between items-center border-t border-slate-100 pt-2">
                                    <span className="text-[10px] font-bold uppercase text-slate-400">{meta.type}</span>
                                    <button onClick={() => navigator.clipboard.writeText(meta.title + "\n" + meta.description)} className="text-slate-400 hover:text-purple-600"><Copy className="w-4 h-4"/></button>
                                </div>
                            </div>
                        ))}
                        {metaTags.length === 0 && <div className="h-full flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">Preview Area</div>}
                    </div>
                </div>
            </div>
        )}

        {/* --- 4. Competitor Gap --- */}
        {currentView === 'TOOL_GAP' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl p-8">
                <ToolHeader title="Competitor Gap" icon={Map} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div><label className="text-xs font-bold text-slate-400 mb-2 block uppercase">My Content</label><textarea className="w-full h-32 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none text-slate-900 dark:text-white font-medium resize-none" value={gapMyContent} onChange={e => setGapMyContent(e.target.value)} /></div>
                        <div><label className="text-xs font-bold text-slate-400 mb-2 block uppercase">Competitor Content / Topic</label><textarea className="w-full h-32 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none text-slate-900 dark:text-white font-medium resize-none" value={gapCompContent} onChange={e => setGapCompContent(e.target.value)} /></div>
                        <button onClick={handleGapAnalysis} disabled={isLoading} className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold shadow-lg flex justify-center items-center">{isLoading ? <Loader2 className="animate-spin"/> : "Find Gaps"}</button>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 overflow-y-auto">
                        {gapResult ? (
                            <div className="space-y-6 animate-in fade-in">
                                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm">
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Strategic Advice</h4>
                                    <p className="text-slate-600 dark:text-slate-300 italic">"{gapResult.strategicAdvice}"</p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-red-500 uppercase mb-3">Missing Topics</h4>
                                    <div className="flex flex-wrap gap-2">{gapResult.missingTopics.map((t, i) => <span key={i} className="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-xs font-bold">{t}</span>)}</div>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-green-500 uppercase mb-3">Your Opportunities</h4>
                                    <ul className="space-y-2">{gapResult.yourOpportunities.map((o, i) => <li key={i} className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-start"><TrendingUp className="w-4 h-4 mr-2 text-green-500"/>{o}</li>)}</ul>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400">Analysis results will appear here.</div>
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* --- 5. Backlink Builder --- */}
        {currentView === 'TOOL_BACKLINK' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl p-8">
                <ToolHeader title="Backlink Builder" icon={Link} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div><label className="text-xs font-bold text-slate-400 mb-2 block uppercase">Your Domain</label><input className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none text-slate-900 dark:text-white font-bold" placeholder="example.com" value={blDomain} onChange={e => setBlDomain(e.target.value)} /></div>
                        <div><label className="text-xs font-bold text-slate-400 mb-2 block uppercase">Niche / Industry</label><input className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none text-slate-900 dark:text-white font-bold" placeholder="e.g. Organic Skincare" value={blNiche} onChange={e => setBlNiche(e.target.value)} /></div>
                        <button onClick={handleBacklinkGen} disabled={isLoading} className="w-full py-4 bg-pink-600 hover:bg-pink-500 text-white rounded-xl font-bold shadow-lg flex justify-center items-center">{isLoading ? <Loader2 className="animate-spin"/> : "Generate Strategy"}</button>
                    </div>
                    <div className="space-y-6">
                        {blResult ? (
                            <div className="animate-in fade-in space-y-6">
                                <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <h4 className="text-xs font-bold text-pink-500 uppercase mb-4 flex items-center"><Star className="w-4 h-4 mr-2"/> Linkable Asset Ideas</h4>
                                    <div className="space-y-4">
                                        {blResult.linkableAssets.map((asset, i) => (
                                            <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="font-bold text-slate-900 dark:text-white">{asset.title}</span>
                                                    <span className="text-[10px] uppercase font-bold bg-pink-100 dark:bg-pink-900/30 text-pink-600 px-2 py-1 rounded">{asset.type}</span>
                                                </div>
                                                <p className="text-xs text-slate-500">{asset.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-4 flex items-center"><Mail className="w-4 h-4 mr-2"/> Outreach Template</h4>
                                    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white mb-2">Subject: {blResult.emailTemplate.subject}</p>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">{blResult.emailTemplate.body}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-100 dark:border-slate-800">Generate a strategy to see results.</div>
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* --- 6. Local SEO --- */}
        {currentView === 'TOOL_LOCAL' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl p-8">
                <ToolHeader title="Local SEO Optimizer" icon={MapPin} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div><label className="text-xs font-bold text-slate-400 mb-2 block uppercase">Business Name</label><input className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none text-slate-900 dark:text-white font-bold" value={localBizName} onChange={e => setLocalBizName(e.target.value)} /></div>
                        <div><label className="text-xs font-bold text-slate-400 mb-2 block uppercase">Location</label><input className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none text-slate-900 dark:text-white font-bold" value={localLocation} onChange={e => setLocalLocation(e.target.value)} /></div>
                        <div><label className="text-xs font-bold text-slate-400 mb-2 block uppercase">Business Type</label><input className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none text-slate-900 dark:text-white font-bold" placeholder="e.g. Dentist" value={localType} onChange={e => setLocalType(e.target.value)} /></div>
                        <button onClick={handleLocalGen} disabled={isLoading} className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold shadow-lg flex justify-center items-center">{isLoading ? <Loader2 className="animate-spin"/> : "Optimize Profile"}</button>
                    </div>
                    <div className="space-y-6 overflow-y-auto custom-scrollbar h-[600px]">
                        {localResult ? (
                            <div className="animate-in fade-in space-y-6">
                                <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-lg">
                                    <h4 className="text-xs font-bold text-red-500 uppercase mb-4">Optimized GMB Profile</h4>
                                    <div className="space-y-4">
                                        <div><span className="text-xs text-slate-400 block">Title</span><span className="font-bold text-lg text-slate-900 dark:text-white">{localResult.gmbTitle}</span></div>
                                        <div><span className="text-xs text-slate-400 block">Categories</span><div className="flex flex-wrap gap-2 mt-1">{localResult.categories.map((c,i) => <span key={i} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-bold">{c}</span>)}</div></div>
                                        <div><span className="text-xs text-slate-400 block">Description</span><p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{localResult.description}</p></div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Citations</h4>
                                        <ul className="space-y-1">{localResult.citationOpportunities.map((c,i) => <li key={i} className="text-sm font-medium text-slate-700 dark:text-slate-300">• {c}</li>)}</ul>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Post Ideas</h4>
                                        <ul className="space-y-1">{localResult.postsIdeas.map((p,i) => <li key={i} className="text-sm font-medium text-slate-700 dark:text-slate-300">• {p}</li>)}</ul>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl">Local optimization results.</div>
                        )}
                    </div>
                </div>
            </div>
        )}

    </div>
  );
};

export default SEOToolsPage;