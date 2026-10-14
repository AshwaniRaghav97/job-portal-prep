import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Building2,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
} from 'lucide-react';

const CompanyPrep = () => {
  const [guides, setGuides] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const res = await api.get('/prep/companies');
        if (res.data?.success) {
          setGuides(res.data.guides || []);
          if (res.data.guides && res.data.guides.length > 0) {
            setSelectedGuide(res.data.guides[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching company guides:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-xl border border-teal-800/40">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/20 mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>Company Interview Playbooks</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Crack FAANG & High-Growth Tech Loops
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Learn the exact round-by-round hiring workflows, evaluation criteria, and cultural expectations of top tier engineering companies.
          </p>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" text="Loading company interview tracks..." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Company Selector Tab */}
          <div className="space-y-2 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
              Select Company
            </h3>
            {guides.map((g) => {
              const isSelected = selectedGuide?._id === g._id;
              return (
                <button
                  key={g._id}
                  onClick={() => setSelectedGuide(g)}
                  className={`w-full text-left p-3.5 rounded-2xl transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/20'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm">{g.companyName}</span>
                  </div>
                  <ArrowRight className={`w-4 h-4 ${isSelected ? 'opacity-100' : 'opacity-30'}`} />
                </button>
              );
            })}
          </div>

          {/* Guide Details */}
          {selectedGuide && (
            <div className="lg:col-span-3 space-y-8 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              {/* Header */}
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                    {selectedGuide.companyName}
                  </h2>
                </div>
                {selectedGuide.tagline && (
                  <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mt-1">
                    "{selectedGuide.tagline}"
                  </p>
                )}
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                  {selectedGuide.overview}
                </p>
              </div>

              {/* Hiring Stages Stepper */}
              <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-500" />
                  Standard Hiring Pipeline
                </h3>

                <div className="space-y-4">
                  {selectedGuide.hiringProcess?.map((step) => (
                    <div
                      key={step.stepNumber}
                      className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                          {step.stepNumber}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {step.stage}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 pl-8 leading-relaxed">
                        {step.description}
                      </p>
                      {step.proTip && (
                        <div className="ml-8 mt-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-2 text-xs text-amber-800 dark:text-amber-300">
                          <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <span><strong>Pro Tip:</strong> {step.proTip}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Questions Asked */}
              {selectedGuide.sampleQuestions && selectedGuide.sampleQuestions.length > 0 && (
                <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-emerald-500" />
                    Frequently Asked Questions
                  </h3>

                  <div className="space-y-3">
                    {selectedGuide.sampleQuestions.map((q, i) => (
                      <div
                        key={i}
                        className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 bg-white dark:bg-slate-900"
                      >
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {q.round}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">Difficulty: {q.difficulty}</span>
                        </div>
                        <p className="font-bold text-sm text-slate-900 dark:text-white">
                          {q.question}
                        </p>
                        {q.tips && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                            Strategy: {q.tips}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Culture Notes */}
              {selectedGuide.cultureNotes && selectedGuide.cultureNotes.length > 0 && (
                <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-500" />
                    Cultural Pillars & Behavioral Signals
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedGuide.cultureNotes.map((note, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CompanyPrep;
