import React, { useState } from 'react';
import {
  FileCheck2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  FileText,
  Copy,
} from 'lucide-react';

const ResumeOptimizer = () => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState(null);

  const sampleResume = `ALEX RIVERA
Full Stack Software Engineer | Seattle, WA | alex@example.com | github.com/alexrivera

SUMMARY
Results-driven Full Stack Engineer with 4+ years of experience engineering scalable web applications using React, Node.js, and TypeScript. Reduced application load times by 35% and scaled microservices to support 500k+ active users.

SKILLS
Languages: TypeScript, JavaScript, Python, SQL, HTML5, CSS3
Frameworks & Libraries: React, Node.js, Express, Next.js, Tailwind CSS, Redux
Databases & Cloud: MongoDB, PostgreSQL, Redis, Docker, AWS (S3, EC2, Lambda), CI/CD

EXPERIENCE
PixelSoft Solutions — Mid-Level Full Stack Engineer (2022 - Present)
• Architected responsive frontend components in React and TypeScript, decreasing initial bundle size by 28%.
• Optimized MongoDB database queries and indexing pipelines, reducing API response latency by 45%.
• Spearheaded containerized deployments using Docker and GitHub Actions CI/CD workflows.

HyperTech Systems — Frontend Developer (2020 - 2022)
• Built interactive client dashboards with React and Chart.js, serving 120,000+ daily page views.
• Implemented automated unit test coverage with Jest and React Testing Library, achieving 88% test coverage.

EDUCATION
B.S. in Computer Science — University of Washington (2020)`;

  const handleAnalyze = (e) => {
    e.preventDefault();
    if (!resumeText.trim()) return;

    const text = resumeText.toLowerCase();

    // 1. Section checks
    const sections = {
      summary: /summary|objective|about/i.test(resumeText),
      experience: /experience|employment|work history/i.test(resumeText),
      education: /education|degree|university|college/i.test(resumeText),
      skills: /skills|technologies|proficiencies/i.test(resumeText),
      projects: /projects|portfolio/i.test(resumeText),
    };

    // 2. Action verbs
    const actionVerbs = [
      'architected', 'engineered', 'spearheaded', 'designed', 'developed',
      'optimized', 'reduced', 'increased', 'scaled', 'implemented', 'built'
    ];
    const foundVerbs = actionVerbs.filter((v) => text.includes(v));

    // 3. Quantifiable impact (numbers, %, $)
    const metricsMatches = resumeText.match(/\d+[\%kmb]?|\$\d+/g) || [];
    const hasStrongMetrics = metricsMatches.length >= 3;

    // 4. Job Description keyword matching
    let matchedKeywords = [];
    let missingKeywords = [];
    if (jobDescription.trim()) {
      const jdWords = jobDescription
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .split(/\s+/)
        .filter((w) => w.length > 3);
      
      const uniqueJdKeywords = Array.from(new Set(jdWords)).slice(0, 15);
      uniqueJdKeywords.forEach((kw) => {
        if (text.includes(kw)) {
          matchedKeywords.push(kw);
        } else {
          missingKeywords.push(kw);
        }
      });
    }

    // Calculate overall score
    let score = 40;
    if (sections.experience) score += 15;
    if (sections.skills) score += 15;
    if (sections.education) score += 10;
    if (sections.summary) score += 5;
    if (hasStrongMetrics) score += 10;
    if (foundVerbs.length >= 4) score += 5;

    score = Math.min(score, 98);

    setAnalysis({
      score,
      sections,
      foundVerbs,
      metricsCount: metricsMatches.length,
      matchedKeywords,
      missingKeywords,
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-violet-950 via-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-xl border border-indigo-800/40">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-400/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive ATS Scanner</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            ATS Resume Analyzer & Keyword Matcher
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Audit your resume against Applicant Tracking Systems (ATS) algorithms. Receive an instant score, check for action verbs, and match keywords with your dream job posting.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Input Form */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-base text-slate-900 dark:text-white">
              Paste Resume Content
            </h2>
            <button
              type="button"
              onClick={() => setResumeText(sampleResume)}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Load Sample Resume</span>
            </button>
          </div>

          <form onSubmit={handleAnalyze} className="space-y-4">
            <textarea
              rows={10}
              placeholder="Paste plain text from your resume here (Summary, Skills, Experience, Education)..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="w-full p-4 text-xs font-mono bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Target Job Description (Optional)
              </label>
              <textarea
                rows={4}
                placeholder="Paste the target job posting to analyze keyword overlap..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={!resumeText.trim()}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-500/20 transition"
            >
              Scan & Calculate ATS Score
            </button>
          </form>
        </div>

        {/* Results Overview */}
        {analysis ? (
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                ATS Analysis Report
              </h3>
              <span
                className={`text-sm font-extrabold px-3 py-1 rounded-full ${
                  analysis.score >= 80
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40'
                    : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40'
                }`}
              >
                Score: {analysis.score} / 100
              </span>
            </div>

            {/* Score Ring / Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>ATS Readability Index</span>
                <span>{analysis.score >= 80 ? 'Strong Match' : 'Needs Optimization'}</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    analysis.score >= 80 ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${analysis.score}%` }}
                ></div>
              </div>
            </div>

            {/* Core Section Checklist */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Core Sections Checklist
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(analysis.sections).map(([sec, present]) => (
                  <div
                    key={sec}
                    className={`p-2.5 rounded-xl border flex items-center gap-2 capitalize ${
                      present
                        ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-400'
                    }`}
                  >
                    {present ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span>{sec} Section</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Verbs Found */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Power Action Verbs ({analysis.foundVerbs.length})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {analysis.foundVerbs.map((verb) => (
                  <span
                    key={verb}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 capitalize"
                  >
                    ✓ {verb}
                  </span>
                ))}
              </div>
            </div>

            {/* Keyword Match (If Job Description provided) */}
            {analysis.matchedKeywords?.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Matched Job Description Keywords
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.matchedKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[11px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400 space-y-3">
            <FileText className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700" />
            <h3 className="font-bold text-sm text-slate-600 dark:text-slate-300">
              Ready for Analysis
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Paste your resume or click "Load Sample Resume" to calculate your ATS readability score.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeOptimizer;
