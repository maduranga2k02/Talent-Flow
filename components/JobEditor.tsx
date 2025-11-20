
import React, { useState } from 'react';
import { Job, FormQuestion } from '../types';
import { Plus, Trash2, Link as LinkIcon, Copy, ExternalLink, Save } from 'lucide-react';

interface JobEditorProps {
  jobs: Job[];
  onUpdateJobs: (jobs: Job[]) => void;
}

export const JobEditor: React.FC<JobEditorProps> = ({ jobs, onUpdateJobs }) => {
  const [activeJobId, setActiveJobId] = useState<string | null>(jobs[0]?.id || null);
  const [showCopied, setShowCopied] = useState<string | null>(null);

  const activeJob = jobs.find(j => j.id === activeJobId);

  const handleAddJob = () => {
    const newJob: Job = {
      id: `job-${Date.now()}`,
      title: 'New Position',
      department: 'General',
      description: 'Description of the role...',
      status: 'active',
      questions: []
    };
    onUpdateJobs([...jobs, newJob]);
    setActiveJobId(newJob.id);
  };

  const updateJobField = (field: keyof Job, value: string) => {
    if (!activeJob) return;
    const updatedJobs = jobs.map(j => j.id === activeJobId ? { ...j, [field]: value } : j);
    onUpdateJobs(updatedJobs);
  };

  const addQuestion = () => {
    if (!activeJob) return;
    const newQ: FormQuestion = {
      id: `q-${Date.now()}`,
      text: 'New Question?',
      type: 'text'
    };
    const updatedJobs = jobs.map(j => 
      j.id === activeJobId ? { ...j, questions: [...j.questions, newQ] } : j
    );
    onUpdateJobs(updatedJobs);
  };

  const updateQuestion = (qId: string, field: keyof FormQuestion, value: string) => {
    if (!activeJob) return;
    const updatedQuestions = activeJob.questions.map(q => 
      q.id === qId ? { ...q, [field]: value } : q
    );
    const updatedJobs = jobs.map(j => 
      j.id === activeJobId ? { ...j, questions: updatedQuestions } : j
    );
    onUpdateJobs(updatedJobs);
  };

  const deleteQuestion = (qId: string) => {
    if (!activeJob) return;
    const updatedJobs = jobs.map(j => 
        j.id === activeJobId ? { ...j, questions: j.questions.filter(q => q.id !== qId) } : j
    );
    onUpdateJobs(updatedJobs);
  };

  const copyLink = (jobId: string) => {
    const url = `${window.location.origin}?apply=${jobId}`;
    navigator.clipboard.writeText(url);
    setShowCopied(jobId);
    setTimeout(() => setShowCopied(null), 2000);
  };

  return (
    <div className="flex h-full bg-gray-50">
      {/* Sidebar List */}
      <div className="w-1/4 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-bold text-gray-700">Positions</h2>
          <button onClick={handleAddJob} className="p-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100">
            <Plus size={18} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1">
          {jobs.map(job => (
            <div 
              key={job.id}
              onClick={() => setActiveJobId(job.id)}
              className={`p-4 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors ${activeJobId === job.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
            >
              <h3 className="font-medium text-gray-800 truncate">{job.title}</h3>
              <p className="text-xs text-gray-500 truncate">{job.department}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {activeJob ? (
          <div className="flex-1 overflow-y-auto p-8">
             <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Edit Position</h1>
                    <p className="text-gray-500">Configure the application form for this role.</p>
                </div>
                <div className="flex gap-2">
                   <button 
                    onClick={() => copyLink(activeJob.id)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 shadow-sm"
                   >
                      {showCopied === activeJob.id ? <span className="text-green-600 font-medium">Copied!</span> : <><Copy size={14}/> Copy Apply Link</>}
                   </button>
                   <button 
                     onClick={() => window.open(`${window.location.origin}?apply=${activeJob.id}`, '_blank')}
                     className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 shadow-sm"
                   >
                      <ExternalLink size={14}/> Preview Form
                   </button>
                </div>
             </div>

             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4 mb-8">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Job Title</label>
                        <input 
                            type="text" 
                            value={activeJob.title} 
                            onChange={(e) => updateJobField('title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Department</label>
                        <input 
                            type="text" 
                            value={activeJob.department} 
                            onChange={(e) => updateJobField('department', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                    <textarea 
                        value={activeJob.description} 
                        onChange={(e) => updateJobField('description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-20"
                    />
                </div>
             </div>

             <div className="mb-6 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">Custom Application Questions</h3>
                <button onClick={addQuestion} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium">
                    <Plus size={16} /> Add Question
                </button>
             </div>

             <div className="space-y-4">
                {activeJob.questions.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg text-gray-400">
                        No custom questions added yet.
                    </div>
                )}
                {activeJob.questions.map((q, idx) => (
                    <div key={q.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex gap-4 items-start group">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                             <div className="md:col-span-2">
                                <input 
                                    type="text" 
                                    value={q.text}
                                    onChange={(e) => updateQuestion(q.id, 'text', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-500 outline-none font-medium"
                                    placeholder="Question text..."
                                />
                             </div>
                             <div>
                                <select 
                                    value={q.type}
                                    onChange={(e) => updateQuestion(q.id, 'type', e.target.value as any)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-500 outline-none text-sm bg-gray-50"
                                >
                                    <option value="text">Short Text</option>
                                    <option value="long_text">Long Text</option>
                                    <option value="yes_no">Yes / No</option>
                                </select>
                             </div>
                        </div>
                        <button 
                            onClick={() => deleteQuestion(q.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
             </div>
          </div>
        ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">Select a position to edit</div>
        )}
      </div>
    </div>
  );
};
