
import React, { useState, useEffect } from 'react';
import { ApplicationStatus, Candidate, EmailDraft, Job } from './types';
import { MOCK_CANDIDATES, MOCK_JOBS } from './constants';
import { KanbanBoard } from './components/KanbanBoard';
import { ApplicationForm } from './components/ApplicationForm';
import { JobEditor } from './components/JobEditor';
import { generateEmailDraft, analyzeCandidateProfile } from './services/geminiService';
import { EmailModal } from './components/EmailModal';
import { StatsDashboard } from './components/StatsDashboard';
import { Layout, Users, PieChart as PieChartIcon, UserPlus, Briefcase, ArrowRight, LogOut, Lock, Settings } from 'lucide-react';

enum AppMode {
  LANDING = 'landing',
  RECRUITER_AUTH = 'recruiter_auth',
  RECRUITER = 'recruiter',
  CANDIDATE = 'candidate',
  DIRECT_APPLY = 'direct_apply'
}

enum RecruiterView {
  DASHBOARD = 'dashboard',
  KANBAN = 'kanban',
  JOBS = 'jobs'
}

const App: React.FC = () => {
  // State
  const [jobs, setJobs] = useState<Job[]>(() => {
      const saved = localStorage.getItem('jobs');
      return saved ? JSON.parse(saved) : MOCK_JOBS;
  });

  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    const saved = localStorage.getItem('candidates');
    return saved ? JSON.parse(saved) : MOCK_CANDIDATES;
  });
  
  const [appMode, setAppMode] = useState<AppMode>(AppMode.LANDING);
  const [recruiterView, setRecruiterView] = useState<RecruiterView>(RecruiterView.DASHBOARD);
  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id); // For Recruiter Filter
  const [directApplyJob, setDirectApplyJob] = useState<Job | null>(null);
  
  // Auth
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(false);

  // Email Automation State
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailDraft, setEmailDraft] = useState<EmailDraft | null>(null);
  const [isDraftLoading, setIsDraftLoading] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<{id: string, status: ApplicationStatus} | null>(null);
  const [activeCandidateName, setActiveCandidateName] = useState('');

  // --- Initialization ---
  useEffect(() => {
    // Check for query params to simulate a direct link
    const params = new URLSearchParams(window.location.search);
    const applyId = params.get('apply');
    if (applyId) {
        const job = jobs.find(j => j.id === applyId);
        if (job) {
            setDirectApplyJob(job);
            setAppMode(AppMode.DIRECT_APPLY);
        }
    }
  }, []); // Run once

  // --- Persistence ---
  useEffect(() => {
    localStorage.setItem('candidates', JSON.stringify(candidates));
  }, [candidates]);

  useEffect(() => {
    localStorage.setItem('jobs', JSON.stringify(jobs));
  }, [jobs]);

  // --- Handlers ---

  const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      if (password === 'admin') {
          setAppMode(AppMode.RECRUITER);
          setAuthError(false);
      } else {
          setAuthError(true);
      }
  };

  const handleStatusChange = async (id: string, newStatus: ApplicationStatus) => {
    const candidate = candidates.find(c => c.id === id);
    if (!candidate) return;
    
    const job = jobs.find(j => j.id === candidate.jobId);

    if (newStatus === ApplicationStatus.REJECTED || newStatus === ApplicationStatus.INTERVIEW_1 || newStatus === ApplicationStatus.SELECTED) {
      setPendingStatusChange({ id, status: newStatus });
      setActiveCandidateName(candidate.fullName);
      setIsEmailModalOpen(true);
      setIsDraftLoading(true);

      try {
        const draft = await generateEmailDraft(candidate, newStatus, job?.title || 'the role');
        setEmailDraft(draft);
      } finally {
        setIsDraftLoading(false);
      }
    } else {
      updateCandidateStatus(id, newStatus);
    }
  };

  const updateCandidateStatus = (id: string, status: ApplicationStatus) => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  const handleEmailSent = () => {
    if (pendingStatusChange) {
      updateCandidateStatus(pendingStatusChange.id, pendingStatusChange.status);
    }
    setIsEmailModalOpen(false);
    setPendingStatusChange(null);
    setEmailDraft(null);
  };

  const handleNewApplication = async (data: Omit<Candidate, 'id' | 'status' | 'appliedDate'>) => {
    const newCandidate: Candidate = {
      ...data,
      id: Date.now().toString(),
      status: ApplicationStatus.NEW,
      appliedDate: new Date().toISOString().split('T')[0],
    };

    setCandidates(prev => [...prev, newCandidate]);

    // Background AI Analysis
    const job = jobs.find(j => j.id === data.jobId);
    try {
        const summary = await analyzeCandidateProfile(newCandidate, job?.title || 'unknown');
        setCandidates(prev => prev.map(c => c.id === newCandidate.id ? { ...c, aiSummary: summary } : c));
    } catch (e) {
        console.error("AI Analysis failed silently");
    }
  };

  // --- Render: Direct Link View ---
  if (appMode === AppMode.DIRECT_APPLY && directApplyJob) {
      return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Layout className="text-blue-600" />
                    <span className="font-bold text-xl text-gray-900">TalentFlow <span className="text-gray-500 font-normal">Careers</span></span>
                </div>
            </div>
            </header>
            <main className="py-8 px-4">
                <ApplicationForm job={directApplyJob} onSubmit={handleNewApplication} />
            </main>
        </div>
      );
  }

  // --- Render: Landing Page ---
  if (appMode === AppMode.LANDING) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
               <Layout className="text-blue-400 w-12 h-12" />
               <h1 className="text-5xl font-bold text-white tracking-tight">TalentFlow</h1>
            </div>
            <p className="text-xl text-gray-400">The intelligent way to manage your hiring pipeline.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Candidate Portal Entry */}
            <button 
              onClick={() => setAppMode(AppMode.CANDIDATE)}
              className="group relative overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-8 rounded-2xl transition-all duration-300 text-left hover:scale-105 hover:shadow-2xl hover:border-blue-500/50"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <UserPlus size={120} />
              </div>
              <div className="bg-blue-500/20 w-16 h-16 rounded-xl flex items-center justify-center text-blue-400 mb-6 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <UserPlus size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">I am a Candidate</h2>
              <p className="text-gray-400 mb-6">Looking for a job? Browse open positions and apply.</p>
              <div className="flex items-center text-blue-400 font-semibold group-hover:translate-x-2 transition-transform">
                View Openings <ArrowRight size={16} className="ml-2" />
              </div>
            </button>

            {/* Recruiter Dashboard Entry */}
            <button 
               onClick={() => setAppMode(AppMode.RECRUITER_AUTH)}
               className="group relative overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-8 rounded-2xl transition-all duration-300 text-left hover:scale-105 hover:shadow-2xl hover:border-purple-500/50"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <Briefcase size={120} />
              </div>
              <div className="bg-purple-500/20 w-16 h-16 rounded-xl flex items-center justify-center text-purple-400 mb-6 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                <Briefcase size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">I am a Recruiter</h2>
              <p className="text-gray-400 mb-6">Secure access for HR staff to manage applications.</p>
              <div className="flex items-center text-purple-400 font-semibold group-hover:translate-x-2 transition-transform">
                Login to Dashboard <ArrowRight size={16} className="ml-2" />
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Render: Candidate Job List (Default Candidate View) ---
  if (appMode === AppMode.CANDIDATE) {
      // Simple logic: if they click a job, we set directApplyJob temporarily
      if (directApplyJob) {
           return (
            <div className="min-h-screen bg-gray-50">
                <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Layout className="text-blue-600" />
                        <span className="font-bold text-xl text-gray-900">TalentFlow <span className="text-gray-500 font-normal">Careers</span></span>
                    </div>
                    <button onClick={() => setDirectApplyJob(null)} className="text-sm text-blue-600 hover:underline">
                      Back to Openings
                    </button>
                </div>
                </header>
                <main className="py-8 px-4">
                    <ApplicationForm job={directApplyJob} onSubmit={handleNewApplication} />
                </main>
            </div>
           );
      }

      return (
        <div className="min-h-screen bg-gray-50">
           <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
              <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <Layout className="text-blue-600" />
                    <span className="font-bold text-xl text-gray-900">TalentFlow <span className="text-gray-500 font-normal">Careers</span></span>
                 </div>
                 <button onClick={() => setAppMode(AppMode.LANDING)} className="text-sm text-gray-500 hover:text-gray-900">
                   Back to Home
                 </button>
              </div>
           </header>
           <main className="py-12 px-4 max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Open Positions</h1>
              <p className="text-gray-500 mb-8">Find the role that fits you best.</p>
              <div className="grid gap-4">
                  {jobs.map(job => (
                      <div key={job.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center hover:border-blue-300 transition-all">
                          <div>
                              <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
                              <p className="text-blue-600 text-sm font-medium mb-2">{job.department}</p>
                              <p className="text-gray-500 line-clamp-2 max-w-xl">{job.description}</p>
                          </div>
                          <button 
                             onClick={() => setDirectApplyJob(job)}
                             className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                          >
                              Apply Now
                          </button>
                      </div>
                  ))}
              </div>
           </main>
        </div>
      );
  }

  // --- Render: Recruiter Auth ---
  if (appMode === AppMode.RECRUITER_AUTH) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4">
                        <Lock size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Recruiter Access</h2>
                    <p className="text-gray-500">Please enter your credentials.</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input 
                           type="password" 
                           className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                           placeholder="Hint: admin"
                           value={password}
                           onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    {authError && <p className="text-red-500 text-sm text-center">Invalid password. Try 'admin'.</p>}
                    <div className="flex flex-col gap-3 pt-2">
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition-colors">
                            Login
                        </button>
                        <button type="button" onClick={() => setAppMode(AppMode.LANDING)} className="text-gray-500 text-sm hover:text-gray-700">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
      );
  }

  // --- Render: Recruiter Dashboard ---
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans text-gray-900">
      <nav className="bg-gray-900 text-white shadow-lg z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setRecruiterView(RecruiterView.DASHBOARD)}>
              <Layout className="text-blue-400" />
              <span className="font-bold text-xl tracking-tight">TalentFlow <span className="text-gray-500 text-sm font-normal ml-1">Recruiter</span></span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-800 rounded-lg p-1">
                <button 
                  onClick={() => setRecruiterView(RecruiterView.DASHBOARD)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${recruiterView === RecruiterView.DASHBOARD ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                >
                  <PieChartIcon size={16} />
                  Overview
                </button>
                <button 
                  onClick={() => setRecruiterView(RecruiterView.KANBAN)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${recruiterView === RecruiterView.KANBAN ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                >
                  <Users size={16} />
                  Pipeline
                </button>
                <button 
                  onClick={() => setRecruiterView(RecruiterView.JOBS)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${recruiterView === RecruiterView.JOBS ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                >
                  <Settings size={16} />
                  Positions
                </button>
              </div>
              
              <div className="h-6 w-px bg-gray-700 mx-2"></div>

              <button 
                onClick={() => setAppMode(AppMode.LANDING)}
                className="text-gray-400 hover:text-white transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 overflow-hidden relative">
        {recruiterView === RecruiterView.DASHBOARD && (
          <div className="max-w-7xl mx-auto py-8">
             <div className="mb-6 px-6">
                <h2 className="text-2xl font-bold text-gray-800">Recruitment Overview</h2>
                <p className="text-gray-500">Key metrics across all positions.</p>
             </div>
            <StatsDashboard candidates={candidates} />
          </div>
        )}

        {recruiterView === RecruiterView.KANBAN && (
          <div className="h-full flex flex-col p-6 overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <div>
                 <h2 className="text-2xl font-bold text-gray-800">Active Pipeline</h2>
                 <p className="text-gray-500 text-sm">Manage candidates by stage.</p>
              </div>
              <div className="flex items-center gap-4">
                 <select 
                    value={selectedJobId} 
                    onChange={(e) => setSelectedJobId(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                 >
                     {jobs.map(j => (
                         <option key={j.id} value={j.id}>{j.title}</option>
                     ))}
                 </select>
                 <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                    {candidates.filter(c => c.jobId === selectedJobId).length} Applicants
                 </span>
              </div>
            </div>
            <KanbanBoard 
              candidates={candidates.filter(c => c.jobId === selectedJobId)} 
              onStatusChange={handleStatusChange}
              onCandidateClick={() => {}} 
            />
          </div>
        )}

        {recruiterView === RecruiterView.JOBS && (
            <JobEditor jobs={jobs} onUpdateJobs={setJobs} />
        )}
      </main>

      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        draft={emailDraft}
        isLoading={isDraftLoading}
        onSend={handleEmailSent}
        candidateName={activeCandidateName}
      />
    </div>
  );
};

export default App;
