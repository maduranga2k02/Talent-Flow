import React from 'react';
import { Candidate, ApplicationStatus } from '../types';
import { STATUS_COLUMNS } from '../constants';
import { CandidateCard } from './CandidateCard';

interface KanbanBoardProps {
  candidates: Candidate[];
  onStatusChange: (id: string, newStatus: ApplicationStatus) => void;
  onCandidateClick: (candidate: Candidate) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ candidates, onStatusChange, onCandidateClick }) => {
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.setData('candidateId', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: ApplicationStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('candidateId');
    if (id) {
      onStatusChange(id, status);
    }
  };

  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden h-full">
      <div className="flex gap-6 h-full min-w-max p-1">
        {STATUS_COLUMNS.map((column) => {
          const columnCandidates = candidates.filter(c => c.status === column.id);
          
          return (
            <div
              key={column.id}
              className={`w-80 flex-shrink-0 flex flex-col bg-gray-50/50 rounded-xl border-t-4 ${column.color.replace('bg-', 'border-').split(' ')[0]} border-x border-b border-gray-200 h-full max-h-full`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className={`p-3 flex justify-between items-center border-b border-gray-200 bg-white/50 backdrop-blur-sm rounded-t-lg`}>
                <h2 className="font-bold text-sm text-gray-700 uppercase tracking-wide">{column.label}</h2>
                <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">
                  {columnCandidates.length}
                </span>
              </div>
              
              <div className="p-3 overflow-y-auto flex-1 space-y-3 scrollbar-thin scrollbar-thumb-gray-300">
                {columnCandidates.map(candidate => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    onDragStart={handleDragStart}
                    onClick={onCandidateClick}
                  />
                ))}
                {columnCandidates.length === 0 && (
                    <div className="h-24 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                        Drop Here
                    </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
