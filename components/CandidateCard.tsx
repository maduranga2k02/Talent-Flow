
import React from 'react';
import { Candidate } from '../types';
import { Mail, Phone, Calendar, BrainCircuit, MessageSquare } from 'lucide-react';

interface CandidateCardProps {
  candidate: Candidate;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, id: string) => void;
  onClick: (candidate: Candidate) => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, onDragStart, onClick }) => {
  const hasCustomAnswers = candidate.customAnswers && Object.keys(candidate.customAnswers).length > 0;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, candidate.id)}
      onClick={() => onClick(candidate)}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-grab active:cursor-grabbing mb-3 group relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-gray-800">{candidate.fullName}</h3>
          <div className="flex items-center gap-2 mt-1">
             <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
               {candidate.experienceYears}y Exp
             </span>
             {hasCustomAnswers && <MessageSquare size={12} className="text-blue-500" />}
          </div>
        </div>
      </div>
      
      <div className="space-y-1 mb-3">
        <div className="flex items-center text-xs text-gray-500">
          <Mail size={12} className="mr-2" />
          {candidate.email}
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <Phone size={12} className="mr-2" />
          {candidate.phone}
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <Calendar size={12} className="mr-2" />
          {candidate.appliedDate}
        </div>
      </div>

      <div className="flex flex-wrap gap-1">
        {candidate.skills.slice(0, 3).map((skill, idx) => (
          <span key={idx} className="text-[10px] bg-gray-50 text-gray-600 px-1.5 py-0.5 rounded border border-gray-100">
            {skill}
          </span>
        ))}
        {candidate.skills.length > 3 && (
          <span className="text-[10px] text-gray-400 px-1 py-0.5">+{candidate.skills.length - 3}</span>
        )}
      </div>

      {candidate.aiSummary && (
         <div className="mt-3 pt-2 border-t border-gray-50 bg-indigo-50/30 -mx-4 -mb-4 px-4 py-2 text-xs text-indigo-800 flex items-start">
            <BrainCircuit size={12} className="mr-1.5 mt-0.5 shrink-0" />
            {candidate.aiSummary}
         </div>
      )}
    </div>
  );
};
