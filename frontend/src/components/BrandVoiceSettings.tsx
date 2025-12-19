import React from 'react';
import { BrandVoice } from '../types';
import { Save, UserCircle, MessageSquare, Target, Hash, FileText } from 'lucide-react';

interface Props {
  voice: BrandVoice;
  onSave: (voice: BrandVoice) => void;
}

const BrandVoiceSettings: React.FC<Props> = ({ voice, onSave }) => {
  const [localVoice, setLocalVoice] = React.useState<BrandVoice>(voice);
  const [keywordInput, setKeywordInput] = React.useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setLocalVoice({ ...localVoice, [e.target.name]: e.target.value });
  };

  const addKeyword = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && keywordInput.trim()) {
      e.preventDefault();
      if (!localVoice.keywords.includes(keywordInput.trim())) {
        setLocalVoice({
          ...localVoice,
          keywords: [...localVoice.keywords, keywordInput.trim()]
        });
      }
      setKeywordInput('');
    }
  };

  const removeKeyword = (kw: string) => {
    setLocalVoice({
      ...localVoice,
      keywords: localVoice.keywords.filter(k => k !== kw)
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Brand Voice</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg font-medium">Teach ContentFlow to sound exactly like you.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-100 dark:border-slate-800 p-8 md:p-10 space-y-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-full blur-3xl opacity-50 -mr-20 -mt-20 pointer-events-none"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
          <div className="space-y-3">
            <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center">
              <UserCircle className="w-4 h-4 mr-2 text-blue-500" />
              Voice Name
            </label>
            <input
              name="name"
              value={localVoice.name}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:bg-white dark:focus:bg-slate-900 focus:border-blue-100 dark:focus:border-blue-900 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-900 dark:text-white font-bold placeholder-slate-400"
              placeholder="e.g. Founder Personal Brand"
            />
          </div>
          <div className="space-y-3">
            <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center">
              <MessageSquare className="w-4 h-4 mr-2 text-purple-500" />
              Tone Category
            </label>
            <div className="relative">
              <select
                name="tone"
                value={localVoice.tone}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:bg-white dark:focus:bg-slate-900 focus:border-blue-100 dark:focus:border-blue-900 focus:ring-4 focus:ring-blue-500/10 outline-none appearance-none text-slate-900 dark:text-white font-bold cursor-pointer"
              >
                <option value="Professional & Authoritative">Professional & Authoritative</option>
                <option value="Casual & Friendly">Casual & Friendly</option>
                <option value="Witty & Sarcastic">Witty & Sarcastic</option>
                <option value="Inspirational & Story-driven">Inspirational & Story-driven</option>
                <option value="Technical & Precise">Technical & Precise</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-3 relative z-10">
          <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center">
             <Target className="w-4 h-4 mr-2 text-red-500" />
             Target Audience
          </label>
          <input
            name="audience"
            value={localVoice.audience}
            onChange={handleChange}
            className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:bg-white dark:focus:bg-slate-900 focus:border-blue-100 dark:focus:border-blue-900 focus:ring-4 focus:ring-blue-500/10 outline-none text-slate-900 dark:text-white font-medium placeholder-slate-400"
            placeholder="e.g. SaaS Founders, Marketing Managers, Developers"
          />
        </div>

        <div className="space-y-3 relative z-10">
          <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center">
             <Hash className="w-4 h-4 mr-2 text-green-500" />
             Keywords & Topics
          </label>
          <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border-2 border-slate-50 dark:border-slate-800 focus-within:border-blue-100 dark:focus-within:border-blue-900 focus-within:bg-white dark:focus-within:bg-slate-900 transition-colors">
            <div className="flex flex-wrap gap-2.5 mb-4">
              {localVoice.keywords.length === 0 && <span className="text-slate-400 text-sm font-medium italic">No keywords added yet. Type below and press Enter.</span>}
              {localVoice.keywords.map(kw => (
                <span key={kw} className="pl-4 pr-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-full text-sm font-bold flex items-center shadow-sm hover:shadow-md transition-shadow">
                  {kw}
                  <button onClick={() => removeKeyword(kw)} className="ml-2 p-0.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-300 hover:text-red-500 transition-colors">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </span>
              ))}
            </div>
            <input
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={addKeyword}
              className="w-full bg-transparent border-none focus:ring-0 p-0 text-slate-900 dark:text-white font-medium placeholder-slate-400"
              placeholder="Add a keyword..."
            />
          </div>
        </div>

        <div className="space-y-3 relative z-10">
          <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center">
            <FileText className="w-4 h-4 mr-2 text-orange-500" />
            Style Sample (Optional)
          </label>
          <div className="relative">
            <textarea
              name="exampleText"
              value={localVoice.exampleText}
              onChange={handleChange}
              rows={6}
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:bg-white dark:focus:bg-slate-900 focus:border-blue-100 dark:focus:border-blue-900 focus:ring-4 focus:ring-blue-500/10 outline-none resize-none text-slate-700 dark:text-slate-200 leading-relaxed font-medium placeholder-slate-400"
              placeholder="Paste a paragraph of your previous content here to help the AI mimic your cadence..."
            />
          </div>
        </div>

        <div className="pt-8 flex justify-end relative z-10">
          <button
            onClick={() => onSave(localVoice)}
            className="flex items-center px-10 py-4 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-slate-900/20 dark:shadow-blue-500/20 hover:scale-105 active:scale-95"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrandVoiceSettings;