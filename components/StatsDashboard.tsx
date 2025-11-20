import React from 'react';
import { Candidate, ApplicationStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, Briefcase, UserCheck, UserX } from 'lucide-react';

interface StatsDashboardProps {
  candidates: Candidate[];
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ candidates }) => {
  
  const stats = {
    total: candidates.length,
    active: candidates.filter(c => ![ApplicationStatus.REJECTED, ApplicationStatus.SELECTED].includes(c.status)).length,
    hired: candidates.filter(c => c.status === ApplicationStatus.SELECTED).length,
    rejected: candidates.filter(c => c.status === ApplicationStatus.REJECTED).length,
  };

  const data = [
    { name: 'New', count: candidates.filter(c => c.status === ApplicationStatus.NEW).length, color: '#3b82f6' },
    { name: 'Screening', count: candidates.filter(c => c.status === ApplicationStatus.SCREENING).length, color: '#eab308' },
    { name: 'Interview', count: candidates.filter(c => c.status === ApplicationStatus.INTERVIEW_1).length, color: '#a855f7' },
    { name: 'Selected', count: candidates.filter(c => c.status === ApplicationStatus.SELECTED).length, color: '#22c55e' },
    { name: 'Rejected', count: candidates.filter(c => c.status === ApplicationStatus.REJECTED).length, color: '#ef4444' },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Applicants</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full">
            <Briefcase size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Active Pipeline</p>
            <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-full">
            <UserCheck size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Hired</p>
            <p className="text-2xl font-bold text-gray-900">{stats.hired}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-full">
            <UserX size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Rejected</p>
            <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Pipeline Distribution</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
              <Tooltip 
                cursor={{fill: '#f9fafb'}}
                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
