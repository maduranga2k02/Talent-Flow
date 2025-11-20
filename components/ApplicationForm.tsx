
import React, { useState } from 'react';
import { Candidate, Job } from '../types';
import { Upload, CheckCircle, Briefcase } from 'lucide-react';

interface ApplicationFormProps {
  job: Job;
  onSubmit: (candidate: Omit<Candidate, 'id' | 'status' | 'appliedDate'>) => void;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({ job, onSubmit }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    experienceYears: 0,
    skills: '',
    notes: ''
  });
  
  // Dynamic answers state
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      jobId: job.id,
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s.length > 0),
      customAnswers
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-xl text-center border border-gray-100">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Application Received!</h2>
        <p className="text-gray-600">Thank you for applying to the <strong>{job.title}</strong> position. We will review your profile shortly.</p>
        <button 
            onClick={() => window.location.reload()} 
            className="mt-6 text-blue-600 hover:text-blue-700 font-medium underline"
        >
            Submit another application
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto my-10 p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-4">
            <Briefcase size={14} />
            {job.department}
        </div>
        <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
        <p className="text-gray-500 mt-2">{job.description}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Standard Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              required
              type="text"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Jane Doe"
              value={formData.fullName}
              onChange={e => setFormData({...formData, fullName: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              required
              type="email"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="jane@example.com"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              required
              type="tel"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                <input
                required
                type="number"
                min="0"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                value={formData.experienceYears}
                onChange={e => setFormData({...formData, experienceYears: parseInt(e.target.value) || 0})}
                />
          </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Skills (Comma separated)</label>
            <input
            type="text"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="React, Communication, Excel..."
            value={formData.skills}
            onChange={e => setFormData({...formData, skills: e.target.value})}
            />
        </div>

        {/* Dynamic Custom Questions */}
        {job.questions.length > 0 && (
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-4">
                <h3 className="font-semibold text-gray-800 mb-2">Role Specific Questions</h3>
                {job.questions.map(q => (
                    <div key={q.id}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{q.text}</label>
                        {q.type === 'long_text' ? (
                            <textarea
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all h-24 resize-none"
                                value={customAnswers[q.id] || ''}
                                onChange={e => setCustomAnswers({...customAnswers, [q.id]: e.target.value})}
                            />
                        ) : q.type === 'yes_no' ? (
                            <select
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                                value={customAnswers[q.id] || ''}
                                onChange={e => setCustomAnswers({...customAnswers, [q.id]: e.target.value})}
                            >
                                <option value="">Select an option</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        ) : (
                            <input
                                required
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                value={customAnswers[q.id] || ''}
                                onChange={e => setCustomAnswers({...customAnswers, [q.id]: e.target.value})}
                            />
                        )}
                    </div>
                ))}
            </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Why are you a good fit?</label>
          <textarea
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all h-24 resize-none"
            placeholder="Tell us a bit about yourself..."
            value={formData.notes}
            onChange={e => setFormData({...formData, notes: e.target.value})}
          ></textarea>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resume/CV</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer">
                <Upload size={24} className="mb-2" />
                <span className="text-sm">Click to upload or drag and drop</span>
                <span className="text-xs text-gray-400 mt-1">(Simulated upload)</span>
            </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition hover:-translate-y-0.5"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
};
