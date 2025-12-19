import React, { useState } from 'react';
import { Check, Star } from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

const PricingPage: React.FC<Props> = ({ onNavigate }) => {
  const [annual, setAnnual] = useState(true);

  const plans = [
    {
      name: "Starter",
      price: annual ? 0 : 0,
      desc: "Perfect for trying out the engine.",
      features: ["5 Generations / month", "Standard Quality", "Blog & Twitter formats", "Community Support"],
      cta: "Start Free",
      highlight: false
    },
    {
      name: "Pro Creator",
      price: annual ? 29 : 39,
      desc: "For serious content creators.",
      features: ["Unlimited Generations", "Premium Quality (Gemini 2.5)", "All Formats (LinkedIn, Newsletter)", "Brand Voice Fine-tuning", "Priority Support"],
      cta: "Get Pro",
      highlight: true
    },
    {
      name: "Agency",
      price: annual ? 99 : 129,
      desc: "Scale your team's output.",
      features: ["Everything in Pro", "5 Team Members", "API Access", "Custom Templates", "Dedicated Account Manager"],
      cta: "Contact Sales",
      highlight: false
    }
  ];

  return (
    <div className="w-full py-24 px-6 flex flex-col items-center dark:bg-slate-950">
      <div className="text-center mb-16 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 dark:text-white">Simple, transparent pricing</h1>
        <p className="text-slate-500 text-lg dark:text-slate-400">
          Choose the plan that best fits your content needs. Cancel anytime.
        </p>
        
        <div className="flex items-center justify-center mt-8 space-x-4">
          <span className={`text-sm font-bold ${!annual ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>Monthly</span>
          <button 
            onClick={() => setAnnual(!annual)}
            className="w-14 h-8 bg-slate-200 rounded-full relative transition-colors focus:outline-none dark:bg-slate-700"
          >
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 ${annual ? 'left-7' : 'left-1'}`}></div>
          </button>
          <span className={`text-sm font-bold ${annual ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
            Yearly <span className="text-green-500 text-xs ml-1">(Save 20%)</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto w-full">
        {plans.map((plan, i) => (
          <div 
            key={i} 
            className={`relative p-8 rounded-3xl border flex flex-col transition-all duration-300 ${
              plan.highlight 
                ? 'bg-slate-900 text-white border-slate-900 shadow-2xl scale-105 z-10 dark:bg-blue-900/20 dark:border-blue-500/50' 
                : 'bg-white text-slate-900 border-slate-200 hover:shadow-xl dark:bg-slate-900 dark:border-slate-800 dark:text-white'
            }`}
          >
            {plan.highlight && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg flex items-center">
                <Star className="w-3 h-3 mr-1 fill-white" /> Most Popular
              </div>
            )}
            
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <p className={`text-sm ${plan.highlight ? 'text-slate-400' : 'text-slate-500'}`}>{plan.desc}</p>
            </div>

            <div className="mb-8 flex items-baseline">
              <span className="text-4xl font-extrabold">${plan.price}</span>
              <span className={`ml-2 text-sm font-medium ${plan.highlight ? 'text-slate-400' : 'text-slate-500'}`}>/month</span>
            </div>

            <div className="flex-1 space-y-4 mb-8">
              {plan.features.map((feat, idx) => (
                <div key={idx} className="flex items-center text-sm font-medium">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 shrink-0 ${
                    plan.highlight ? 'bg-blue-500 text-white' : 'bg-green-100 text-green-600'
                  }`}>
                    <Check className="w-3 h-3" />
                  </div>
                  <span className={plan.highlight ? 'text-slate-200' : 'text-slate-600 dark:text-slate-300'}>{feat}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => onNavigate('create')}
              className={`w-full py-4 rounded-xl font-bold transition-all ${
                plan.highlight 
                  ? 'bg-white text-slate-900 hover:bg-blue-50' 
                  : 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200'
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;