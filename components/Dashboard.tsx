import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, TrendingUp, Zap, FileText, ArrowRight, PenTool, Hash, Linkedin, Mail, Sparkles } from 'lucide-react';
import { GeneratedContent } from '../types';

const data = [
  { name: 'Mon', words: 4000 },
  { name: 'Tue', words: 3000 },
  { name: 'Wed', words: 2000 },
  { name: 'Thu', words: 2780 },
  { name: 'Fri', words: 1890 },
  { name: 'Sat', words: 2390 },
  { name: 'Sun', words: 3490 },
];

interface Props {
  history: GeneratedContent[];
  onNavigate: (tab: string) => void;
}

const Dashboard: React.FC<Props> = ({ history, onNavigate }) => {
  const totalGenerations = history.length;
  const recentGenerations = history.slice(0, 3);
  const totalWords = history.reduce((acc, curr) => acc + curr.content.split(/\s+/).length, 0);

  const StatCard = ({ title, value, subtext, icon: Icon, colorClass, delay }: any) => (
    <div className={`glass p-6 rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-white/80 dark:hover:border-slate-700 animate-in fade-in slide-in-from-bottom-4 ${delay}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</h3>
        <div className={`p-2.5 rounded-xl ${colorClass} bg-opacity-10 backdrop-blur-sm`}>
           <Icon className={`w-5 h-5 ${colorClass.replace('bg-', 'text-')}`} />
        </div>
      </div>
      <div className="flex items-baseline space-x-2">
        <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{value}</div>
      </div>
      <div className="text-xs font-medium text-slate-400 mt-2 flex items-center">
        {subtext.includes('+') ? <TrendingUp className="w-3 h-3 mr-1 text-emerald-500" /> : null}
        {subtext}
      </div>
    </div>
  );

  const QuickAction = ({ label, icon: Icon, color, desc, delay }: any) => (
    <button 
      onClick={() => onNavigate('create')}
      className={`relative overflow-hidden flex flex-col items-start p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm hover:shadow-xl hover:border-blue-100 dark:hover:border-blue-900 transition-all duration-300 group text-left w-full animate-in fade-in slide-in-from-bottom-4 ${delay}`}
    >
      <div className={`absolute top-0 right-0 p-20 ${color} opacity-0 group-hover:opacity-5 blur-3xl rounded-full transition-opacity duration-500 -mr-10 -mt-10 pointer-events-none`}></div>
      <div className={`p-3.5 rounded-2xl ${color} text-white mb-5 shadow-lg shadow-blue-500/20 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 ease-out`}>
        <Icon className="w-6 h-6" />
      </div>
      <span className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{label}</span>
      <span className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{desc}</span>
      
      <div className="mt-4 flex items-center text-xs font-bold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
        Start Creating <ArrowRight className="w-3 h-3 ml-1" />
      </div>
    </button>
  );

  return (
    <div className="space-y-10">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center">
          Dashboard 
          <span className="ml-3 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full border border-blue-100 dark:border-blue-800 font-bold uppercase tracking-wider">Overview</span>
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg font-medium">Welcome back. Here's your content performance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Output" 
          value={totalGenerations} 
          subtext="+12% this month" 
          icon={Zap} 
          colorClass="bg-amber-400 text-amber-600"
          delay="delay-100"
        />
        <StatCard 
          title="Words Written" 
          value={totalWords > 1000 ? `${(totalWords/1000).toFixed(1)}k` : totalWords} 
          subtext="Lifetime total" 
          icon={FileText} 
          colorClass="bg-blue-500 text-blue-600"
          delay="delay-200"
        />
        <StatCard 
          title="Avg. Quality" 
          value="9.8" 
          subtext="AI Score / 10" 
          icon={Activity} 
          colorClass="bg-violet-500 text-violet-600"
          delay="delay-300"
        />
         <StatCard 
          title="Engagement" 
          value="High" 
          subtext="Trend forecast" 
          icon={Sparkles} 
          colorClass="bg-rose-500 text-rose-600"
          delay="delay-300"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center animate-in fade-in duration-700">
          Create New <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1 ml-4"></div>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <QuickAction 
            label="Blog Post" 
            icon={PenTool} 
            color="bg-pink-500" 
            desc="Draft SEO-optimized articles." 
            delay="delay-100"
          />
          <QuickAction 
            label="Viral Thread" 
            icon={Hash} 
            color="bg-sky-500" 
            desc="Engaging Twitter threads." 
            delay="delay-200"
          />
          <QuickAction 
            label="LinkedIn" 
            icon={Linkedin} 
            color="bg-blue-600" 
            desc="Professional updates." 
            delay="delay-300"
          />
          <QuickAction 
            label="Newsletter" 
            icon={Mail} 
            color="bg-orange-500" 
            desc="Weekly subscriber emails." 
            delay="delay-300"
          />
        </div>
      </div>

      {/* Charts & History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm min-h-[400px] hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Word Count Activity</h3>
            <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500/50">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 500}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 500}} />
              <Tooltip 
                cursor={{fill: 'rgba(241, 245, 249, 0.5)'}}
                contentStyle={{
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', 
                  padding: '12px 16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  color: '#1E293B'
                }}
                itemStyle={{ color: '#1E293B', fontWeight: 600 }}
              />
              <Bar dataKey="words" radius={[8, 8, 8, 8]} barSize={32}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#4F46E5' : '#CBD5E1'} className="transition-all duration-300 hover:opacity-80" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Recent Outputs</h3>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {recentGenerations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" />
                <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">No history yet.</p>
              </div>
            ) : (
              recentGenerations.map((item, idx) => (
                <div key={item.id} className="group p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md hover:shadow-blue-500/5 transition-all cursor-pointer transform hover:-translate-x-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-blue-600 dark:text-blue-400 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                      {item.format}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-semibold truncate group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                    {item.originalTitle || "Untitled Generation"}
                  </p>
                </div>
              ))
            )}
          </div>
          <button 
            onClick={() => onNavigate('history')}
            className="w-full mt-6 py-4 text-sm text-slate-600 dark:text-slate-300 hover:text-white font-bold text-center border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-900 dark:hover:bg-blue-600 transition-all duration-300 flex items-center justify-center group"
          >
            View Full History <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;