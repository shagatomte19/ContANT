import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ContentFormat, InputType, BrandVoice, GeneratedContent, PsychologyAnalysis, ContentStrategy } from '../types';
import { generatePlatformContent, modifyContent, analyzeContentPsychology, generateContentStrategy, generateMarketingImage } from '../services/api';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Copy, Twitter, Linkedin, Mail, AlignLeft, Search, Clock, Sliders, RefreshCw, ChevronDown, FileJson, FileType, HardDrive, Cloud, Sparkles, MoreVertical, Wand2, Edit3, Send, BrainCircuit, Image as ImageIcon, Calendar, Microscope, LayoutTemplate, PenTool } from 'lucide-react';
import { AntIcon } from './Layout';

interface Props {
  brandVoice: BrandVoice;
  onContentGenerated: (content: GeneratedContent) => void;
  showToast: (title: string, type: 'success' | 'error' | 'info') => void;
}

const progressMessages = [
  "Analyzing worker input...",
  "Encoding source pheromones...",
  "Assigning colony tasks...",
  "Structuring worker paths...",
  "Polishing final output...",
  "Success."
];

type WorkflowStep = 'RESEARCH' | 'DRAFT' | 'REFINE' | 'VISUALS';

const ContentCreator: React.FC<Props> = ({ brandVoice, onContentGenerated, showToast }) => {
  const [currentView, setCurrentView] = useState<WorkflowStep>('DRAFT');

  // Input State
  const [inputType, setInputType] = useState<InputType>(InputType.TEXT);
  const [sourceText, setSourceText] = useState('');
  const [sourceFile, setSourceFile] = useState<{ data: string, mimeType: string, name: string } | null>(null);

  // Strategy/Research State
  const [researchTopic, setResearchTopic] = useState('');
  const [strategy, setStrategy] = useState<ContentStrategy | null>(null);
  const [isResearching, setIsResearching] = useState(false);

  // Generation State
  const [selectedFormats, setSelectedFormats] = useState<ContentFormat[]>([]);
  const [seoKeywords, setSeoKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<{ format: ContentFormat; content: string; psychology?: PsychologyAnalysis; imageUrl?: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeResultIndex, setActiveResultIndex] = useState(0);

  // Progress State
  const [progressStep, setProgressStep] = useState(0);

  // Features State
  const [toneOverride, setToneOverride] = useState<string>('');
  const [customInstructions, setCustomInstructions] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  // Interactive Edit State
  const [selection, setSelection] = useState<{
    text: string;
    resultIndex: number;
    start: number;
    end: number;
    top: number;
    left: number;
  } | null>(null);

  const [modificationPrompt, setModificationPrompt] = useState('');
  const [isModifying, setIsModifying] = useState(false);
  const selectionRef = useRef<HTMLDivElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Analysis & Visuals State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [resultTab, setResultTab] = useState<'CONTENT' | 'PSYCHOLOGY' | 'VISUALS'>('CONTENT');

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [results, activeResultIndex, resultTab]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown !== null) {
        setActiveDropdown(null);
      }
      if (selection && selectionRef.current && !selectionRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement;
        if (target.tagName !== 'TEXTAREA') {
          setSelection(null);
          setModificationPrompt('');
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown, selection]);

  useEffect(() => {
    if (isGenerating) {
      setProgressStep(0);
      const interval = setInterval(() => {
        setProgressStep(prev => (prev < progressMessages.length - 1 ? prev + 1 : prev));
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  useEffect(() => {
    if (results.length > 0 && !isGenerating && resultsContainerRef.current) {
      resultsContainerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [results, isGenerating]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("File size exceeds 10MB limit.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        setSourceFile({
          data: base64Data,
          mimeType: file.type,
          name: file.name
        });
        setError(null);
        showToast("Worker input accepted", 'success');
      };
      reader.readAsDataURL(file);
    }
  }, [showToast]);

  const toggleFormat = (format: ContentFormat) => {
    setSelectedFormats(prev =>
      prev.includes(format) ? prev.filter(f => f !== format) : [...prev, format]
    );
  };

  const handleResearch = async () => {
    if (!researchTopic.trim()) {
      showToast("Please enter a topic", 'error');
      return;
    }
    setIsResearching(true);
    try {
      const strat = await generateContentStrategy(researchTopic);
      setStrategy(strat);
      showToast("Colony map generated", 'success');
    } catch (e) {
      showToast("Failed to research", 'error');
    } finally {
      setIsResearching(false);
    }
  };

  const applyStrategy = () => {
    if (!strategy) return;
    const strategicContext = `
     Target Audience: ${strategy.targetAudience}
     Content Angle: ${strategy.contentAngle}
     Pain Points: ${strategy.painPoints.join(', ')}
     Suggested Hooks: ${strategy.suggestedHooks.join(' | ')}
     `;
    setCustomInstructions(prev => (prev ? prev + "\n" : "") + "STRATEGY CONTEXT:\n" + strategicContext);
    setSourceText(prev => prev || `Topic: ${researchTopic}\n\nKey Points:\n- `);
    setCurrentView('DRAFT');
    showToast("Applied to worker pipe", 'success');
  };

  const handleGenerate = async () => {
    if ((inputType === InputType.TEXT && !sourceText) || (inputType === InputType.FILE && !sourceFile)) {
      setError("Please provide source content.");
      return;
    }
    if (selectedFormats.length === 0) {
      setError("Please select at least one worker role.");
      return;
    }
    setIsGenerating(true);
    setError(null);
    setResults([]);

    try {
      const promises = selectedFormats.map(async (format) => {
        const content = await generatePlatformContent({
          sourceText,
          sourceFile: sourceFile || undefined,
          inputType,
          selectedFormats: [format],
          brandVoice,
          customInstructions: customInstructions || "Maintain worker efficiency.",
          seoKeywords: seoKeywords ? seoKeywords.split(',').map(s => s.trim()).filter(s => s) : undefined,
          toneOverride: toneOverride || undefined
        }, format);
        return { format, content, success: true };
      });

      const rawResults = await Promise.all(promises);
      const finalResults = rawResults.map(r => ({ format: r.format, content: r.content }));

      rawResults.forEach(r => {
        if (r.success) {
          onContentGenerated({
            id: Date.now().toString() + r.format,
            format: r.format,
            content: r.content,
            createdAt: Date.now(),
            originalTitle: sourceFile?.name || sourceText.substring(0, 50) + "..."
          });
        }
      });

      setResults(finalResults);
      setActiveResultIndex(0);
      setResultTab('CONTENT');
      showToast("Workers finished tasks!", 'success');
    } catch (e) {
      setError("Colony error. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnalyzePsychology = async () => {
    if (!results[activeResultIndex]) return;
    if (results[activeResultIndex].psychology) {
      setResultTab('PSYCHOLOGY');
      return;
    }
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeContentPsychology(results[activeResultIndex].content);
      setResults(prev => prev.map((r, i) => i === activeResultIndex ? { ...r, psychology: analysis } : r));
      setResultTab('PSYCHOLOGY');
    } catch (e) {
      showToast("Analysis failed", 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!results[activeResultIndex]) return;
    if (results[activeResultIndex].imageUrl) {
      setResultTab('VISUALS');
      return;
    }
    setIsGeneratingImage(true);
    try {
      const promptContext = results[activeResultIndex].content.substring(0, 200);
      const imgUrl = await generateMarketingImage(promptContext);
      setResults(prev => prev.map((r, i) => i === activeResultIndex ? { ...r, imageUrl: imgUrl } : r));
      setResultTab('VISUALS');
    } catch (e) {
      showToast("Visual task failed", 'error');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const calculateReadingTime = (text: string) => {
    const wpm = 200;
    const words = text.trim().split(/\s+/).length;
    const time = Math.ceil(words / wpm);
    return `${time} min walk`;
  };

  const formatIcon = (format: ContentFormat) => {
    switch (format) {
      case ContentFormat.TWITTER: return <Twitter className="w-5 h-5" />;
      case ContentFormat.LINKEDIN: return <Linkedin className="w-5 h-5" />;
      case ContentFormat.NEWSLETTER: return <Mail className="w-5 h-5" />;
      default: return <AlignLeft className="w-5 h-5" />;
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setResults(prev => prev.map((res, i) => i === activeResultIndex ? { ...res, content: newContent } : res));
  };

  const handleTextSelect = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    if (target.selectionStart !== target.selectionEnd) {
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const text = target.value.substring(start, end);
      if (text.trim().length > 0) {
        setSelection({ text, resultIndex: activeResultIndex, start, end, top: e.clientY + 20, left: e.clientX });
      }
    } else {
      setSelection(null);
    }
  };

  const handleApplyModification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selection || !modificationPrompt.trim()) return;
    setIsModifying(true);
    const { text, resultIndex, start, end } = selection;
    const currentFullContent = results[resultIndex].content;
    try {
      const newText = await modifyContent(currentFullContent, text, modificationPrompt);
      const updatedContent = currentFullContent.substring(0, start) + newText + currentFullContent.substring(end);
      setResults(prev => prev.map((r, i) => i === resultIndex ? { ...r, content: updatedContent } : r));
      showToast("Task re-assigned", 'success');
      setSelection(null);
      setModificationPrompt('');
    } catch (err) {
      showToast("Refinement failed", 'error');
    } finally {
      setIsModifying(false);
    }
  };

  const activeRes = results[activeResultIndex];

  return (
    <div className="max-w-6xl mx-auto relative min-h-[600px]">

      {/* Workflow Navigation */}
      <div className="flex items-center justify-center mb-10 space-x-4">
        {[
          { id: 'RESEARCH', icon: Search, label: 'Scouting' },
          { id: 'DRAFT', icon: AntIcon, label: 'Heavy Lifting' },
          { id: 'REFINE', icon: BrainCircuit, label: 'Organization' },
          { id: 'VISUALS', icon: ImageIcon, label: 'Patterns' }
        ].map((step, idx) => (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => {
                if (step.id === 'RESEARCH' || step.id === 'DRAFT' || results.length > 0) {
                  setCurrentView(step.id as WorkflowStep);
                  if (step.id === 'REFINE' && results.length > 0) handleAnalyzePsychology();
                  if (step.id === 'VISUALS' && results.length > 0) handleGenerateImage();
                }
              }}
              className={`flex items-center space-x-3 px-6 py-3 rounded-2xl text-sm font-black transition-all border-2 uppercase tracking-tighter font-heading ${currentView === step.id
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-2xl scale-105'
                  : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-100 dark:border-slate-800 hover:border-slate-300'
                } ${results.length === 0 && (step.id === 'REFINE' || step.id === 'VISUALS') ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              {typeof step.icon === 'function' ? <step.icon className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
              <span>{step.label}</span>
            </button>
            {idx < 3 && <div className="w-8 h-px bg-slate-200 dark:bg-slate-800 mx-2"></div>}
          </div>
        ))}
      </div>

      {/* Dynamic Progress Overlay */}
      {isGenerating && (
        <div className="absolute inset-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center rounded-3xl animate-in fade-in duration-300 min-h-[600px]">
          <div className="relative w-24 h-24 mb-8">
            <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-700 rounded-full animate-ping opacity-20"></div>
            <div className="absolute inset-0 border-4 border-t-slate-900 border-r-transparent border-b-slate-900 border-l-transparent rounded-full animate-spin duration-1000"></div>
            <div className="absolute inset-4 bg-slate-900 dark:bg-white rounded-full flex items-center justify-center shadow-xl">
              <AntIcon className="w-10 h-10 text-white dark:text-slate-900 animate-pulse" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-8 uppercase tracking-tighter font-heading">Colony In Motion</h3>
          <div className="w-72 space-y-4">
            {progressMessages.map((msg, i) => (
              <div key={i} className={`flex items-center space-x-4 transition-all duration-500 ${i <= progressStep ? 'opacity-100' : 'opacity-0'}`}>
                <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center border-2 ${i < progressStep ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' :
                    i === progressStep ? 'border-slate-900 text-slate-900' : 'border-slate-200 dark:border-slate-700'
                  }`}>
                  {i < progressStep ? <CheckCircle className="w-4 h-4" /> : i === progressStep ? <div className="w-2 h-2 bg-slate-900 rounded-full animate-pulse" /> : null}
                </div>
                <span className={`text-xs font-black uppercase tracking-widest ${i === progressStep ? 'text-slate-900 dark:text-white' : 'text-slate-300 dark:text-slate-600'}`}>{msg}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Editor Tooltip */}
      {selection && !isGenerating && (
        <div ref={selectionRef} className="fixed z-50 animate-in fade-in zoom-in-95 duration-200" style={{ top: selection.top, left: selection.left, transform: 'translateX(-50%)' }}>
          <div className="bg-slate-900 dark:bg-black text-white p-2 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 min-w-[320px]">
            <div className="flex-1 flex items-center bg-slate-800 dark:bg-slate-900 rounded-lg px-3 py-1.5 border border-slate-700 focus-within:border-blue-500 transition-all">
              <AntIcon className="w-4 h-4 text-white mr-2" />
              <input
                type="text" autoFocus placeholder="Give a worker direct orders..."
                className="bg-transparent border-none outline-none text-sm text-white placeholder-slate-500 w-full font-bold"
                value={modificationPrompt} onChange={(e) => setModificationPrompt(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleApplyModification(e)}
              />
            </div>
            <button onClick={handleApplyModification} className="p-2 bg-white text-slate-900 rounded-lg hover:bg-slate-100 transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* --- RESEARCH VIEW --- */}
      {currentView === 'RESEARCH' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter font-heading">Scouting Mode</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Map the digital terrain before the workers begin the heavy lifting.</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border-2 border-slate-100 dark:border-slate-800 shadow-2xl">
            <div className="flex gap-4">
              <input
                value={researchTopic}
                onChange={(e) => setResearchTopic(e.target.value)}
                placeholder="Enter a territory to scout (e.g., 'The Future of AI')"
                className="flex-1 px-5 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-2xl focus:bg-white dark:focus:bg-slate-950 focus:border-slate-900 dark:focus:border-white outline-none text-lg font-bold"
              />
              <button onClick={handleResearch} disabled={isResearching} className="px-10 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl hover:bg-slate-800 transition-all uppercase tracking-widest font-heading shadow-xl">
                {isResearching ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Scout'}
              </button>
            </div>
          </div>

          {strategy && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4">
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border-2 border-slate-100 dark:border-slate-800 group hover:border-slate-900 transition-colors">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 flex items-center uppercase tracking-tighter font-heading"><LayoutTemplate className="w-5 h-5 mr-3" /> Attack Angle</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{strategy.contentAngle}</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border-2 border-slate-100 dark:border-slate-800 group hover:border-slate-900 transition-colors">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 flex items-center uppercase tracking-tighter font-heading"><Microscope className="w-5 h-5 mr-3" /> Target Nest</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{strategy.targetAudience}</p>
              </div>
              <div className="md:col-span-2 flex justify-center mt-6">
                <button onClick={applyStrategy} className="px-12 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black shadow-2xl hover:scale-105 transition-transform uppercase tracking-widest font-heading">
                  Order Workers To Deploy
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- DRAFT VIEW --- */}
      {currentView === 'DRAFT' && results.length === 0 && (
        <div className={`space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 transition-opacity`}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-slate-100 dark:border-slate-800 overflow-hidden relative">
            <div className="flex border-b-2 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <button onClick={() => setInputType(InputType.TEXT)} className={`flex-1 py-5 text-xs font-black text-center transition-all uppercase tracking-widest ${inputType === InputType.TEXT ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-b-2 border-b-slate-900 dark:border-b-white' : 'text-slate-400 dark:text-slate-600'}`}>Manual Payload</button>
              <button onClick={() => setInputType(InputType.FILE)} className={`flex-1 py-5 text-xs font-black text-center transition-all uppercase tracking-widest ${inputType === InputType.FILE ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-b-2 border-b-slate-900 dark:border-b-white' : 'text-slate-400 dark:text-slate-600'}`}>Import Mass</button>
            </div>
            <div className="p-8">
              {inputType === InputType.TEXT ? (
                <textarea value={sourceText} onChange={(e) => setSourceText(e.target.value)} placeholder="Dump your raw ideas here for processing..." className="w-full h-80 p-8 bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-2xl focus:bg-white dark:focus:bg-slate-950 focus:border-slate-900 dark:focus:border-white outline-none resize-none text-slate-800 dark:text-slate-200 text-xl font-bold leading-relaxed placeholder-slate-300 transition-all duration-300" />
              ) : (
                <div className="h-80 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-800/30 cursor-pointer group relative overflow-hidden">
                  <input type="file" id="file-upload" className="hidden" onChange={handleFileUpload} />
                  <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center w-full h-full justify-center">
                    {sourceFile ? (
                      <div className="flex flex-col items-center">
                        <AntIcon className="w-16 h-16 text-slate-900 dark:text-white mb-4" />
                        <span className="text-slate-900 dark:text-white font-black text-xl uppercase tracking-tighter">{sourceFile.name}</span>
                        <button onClick={(e) => { e.preventDefault(); setSourceFile(null); }} className="mt-4 text-red-500 text-xs font-black uppercase tracking-widest">Eject Payload</button>
                      </div>
                    ) : (
                      <><div className="w-20 h-20 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-full flex items-center justify-center mb-6 shadow-xl border-2 border-slate-100 dark:border-slate-800 group-hover:scale-110 transition-transform"><Upload className="w-10 h-10" /></div><span className="text-slate-900 dark:text-white font-black text-xl uppercase tracking-tighter">Click to drop assets</span></>
                    )}
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter font-heading">Worker Roles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[ContentFormat.BLOG, ContentFormat.TWITTER, ContentFormat.LINKEDIN, ContentFormat.NEWSLETTER].map((fmt) => (
                  <button key={fmt} onClick={() => toggleFormat(fmt)} className={`group relative flex items-start p-6 rounded-3xl border-2 transition-all duration-300 text-left ${selectedFormats.includes(fmt) ? 'border-slate-900 bg-slate-50 dark:bg-slate-900 shadow-xl' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400'}`}>
                    <div className={`p-4 rounded-2xl mr-4 transition-all ${selectedFormats.includes(fmt) ? 'bg-slate-900 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-slate-900'}`}>{formatIcon(fmt)}</div>
                    <div><span className={`block font-black text-xl capitalize mb-1 font-heading tracking-tighter ${selectedFormats.includes(fmt) ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>{fmt.toLowerCase()} Worker</span><span className="text-xs font-bold uppercase tracking-widest opacity-60">Ready for task</span></div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter font-heading">Pheromones</h3>
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border-2 border-slate-100 dark:border-slate-800 shadow-2xl space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Tone Setting</label>
                  <select className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-2xl text-xs font-black uppercase focus:bg-white focus:border-slate-900 outline-none transition-all cursor-pointer" value={toneOverride} onChange={(e) => setToneOverride(e.target.value)}>
                    <option value="">Default Worker ({brandVoice.tone})</option><option value="Professional & Authoritative">Elite</option><option value="Casual & Friendly">Friendly</option><option value="Witty & Sarcastic">Sharp</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-8 pb-12">
            <button onClick={handleGenerate} disabled={isGenerating} className={`group relative flex items-center px-16 py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xl shadow-2xl shadow-slate-900/40 transition-all duration-300 hover:scale-105 hover:shadow-black/20 ${isGenerating ? 'opacity-50' : ''} uppercase tracking-widest font-heading`}>
              {isGenerating ? 'Lifting Payload...' : <><AntIcon className="w-6 h-6 mr-4" /> Start Colony Task</>}
            </button>
          </div>
        </div>
      )}

      {/* --- RESULTS VIEW --- */}
      {results.length > 0 && !isGenerating && (
        <div ref={resultsContainerRef} className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 min-h-[500px]">
          <div className="sticky top-24 z-30 bg-slate-900 text-white p-4 rounded-3xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-700">
            <div className="flex items-center gap-3">
              {results.map((res, index) => (
                <button key={index} onClick={() => setActiveResultIndex(index)} className={`flex items-center px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeResultIndex === index ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-white'}`}>
                  {formatIcon(res.format)}
                  <span className="ml-2 hidden sm:inline">{res.format}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={handleGenerate} className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all"><RefreshCw className="w-5 h-5" /></button>
            </div>
          </div>

          {activeRes && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-slate-100 dark:border-slate-800 overflow-visible transition-all duration-500">
              <div className="bg-slate-50/50 dark:bg-slate-800/50 px-8 py-5 border-b-2 border-slate-100 dark:border-slate-800 flex items-center gap-8 rounded-t-3xl">
                <button onClick={() => { setCurrentView('DRAFT'); setResultTab('CONTENT'); }} className={`text-xs font-black uppercase tracking-widest flex items-center ${resultTab === 'CONTENT' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}><FileText className="w-4 h-4 mr-2" /> Payload</button>
                <button onClick={() => { setCurrentView('REFINE'); handleAnalyzePsychology(); }} className={`text-xs font-black uppercase tracking-widest flex items-center ${resultTab === 'PSYCHOLOGY' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}><BrainCircuit className="w-4 h-4 mr-2" /> Structure</button>
                <button onClick={() => { setCurrentView('VISUALS'); handleGenerateImage(); }} className={`text-xs font-black uppercase tracking-widest flex items-center ${resultTab === 'VISUALS' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}><ImageIcon className="w-4 h-4 mr-2" /> Pattern</button>
                <div className="ml-auto text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center"><Clock className="w-3 h-3 mr-1" /> {calculateReadingTime(activeRes.content)}</div>
              </div>

              <div className="min-h-[500px]">
                {resultTab === 'CONTENT' && (
                  <textarea ref={textareaRef} value={activeRes.content} onChange={handleContentChange} onMouseUp={handleTextSelect} className="w-full h-full min-h-[500px] p-8 md:p-12 bg-transparent border-none outline-none resize-none font-sans text-lg leading-relaxed text-slate-900 dark:text-slate-100 placeholder-slate-300 rounded-b-3xl font-bold" spellCheck={false} />
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContentCreator;