
import { ApplicationStatus, Candidate, Job } from './types';

export const STATUS_COLUMNS = [
  { id: ApplicationStatus.NEW, label: 'New Applications', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { id: ApplicationStatus.SCREENING, label: 'Screening', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
  { id: ApplicationStatus.INTERVIEW_1, label: '1st Interview', color: 'bg-purple-50 border-purple-200 text-purple-700' },
  { id: ApplicationStatus.SELECTED, label: 'Selected', color: 'bg-green-50 border-green-200 text-green-700' },
  { id: ApplicationStatus.REJECTED, label: 'Rejected', color: 'bg-red-50 border-red-200 text-red-700' },
];

export const MOCK_JOBS: Job[] = [
  {
    id: 'job1',
    title: 'Frontend Engineer',
    department: 'Engineering',
    description: 'We are looking for a React expert to join our core team.',
    status: 'active',
    questions: [
      { id: 'q1', text: 'Link to your GitHub profile?', type: 'text' },
      { id: 'q2', text: 'Describe your experience with Tailwind CSS.', type: 'long_text' }
    ]
  },
  {
    id: 'job2',
    title: 'HR Assistant',
    department: 'People Ops',
    description: 'Assist with daily HR operations and candidate screening.',
    status: 'active',
    questions: [
      { id: 'q3', text: 'Are you familiar with local labor laws?', type: 'yes_no' },
      { id: 'q4', text: 'How do you handle confidential information?', type: 'long_text' }
    ]
  }
];

export const MOCK_CANDIDATES: Candidate[] = [
  {
    id: 'c1',
    jobId: 'job1',
    fullName: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '555-0101',
    experienceYears: 5,
    skills: ['React', 'TypeScript', 'Tailwind'],
    status: ApplicationStatus.SCREENING,
    appliedDate: '2023-10-25',
    notes: 'Strong portfolio, good communication skills.',
    customAnswers: { 'q1': 'github.com/alice', 'q2': 'I use it daily.' }
  },
  {
    id: 'c2',
    jobId: 'job1',
    fullName: 'Bob Smith',
    email: 'bob@example.com',
    phone: '555-0102',
    experienceYears: 3,
    skills: ['Node.js', 'PostgreSQL', 'Docker'],
    status: ApplicationStatus.NEW,
    appliedDate: '2023-10-26'
  },
  {
    id: 'c3',
    jobId: 'job1',
    fullName: 'Charlie Davis',
    email: 'charlie@example.com',
    phone: '555-0103',
    experienceYears: 7,
    skills: ['Agile', 'Jira', 'Roadmapping'],
    status: ApplicationStatus.INTERVIEW_1,
    appliedDate: '2023-10-20',
    aiSummary: 'Experienced PM with a background in SaaS.'
  },
  {
    id: 'c4',
    jobId: 'job2', // HR Assistant
    fullName: 'Dana Lee',
    email: 'dana@example.com',
    phone: '555-0104',
    experienceYears: 4,
    skills: ['Communication', 'Scheduling', 'Office Suite'],
    status: ApplicationStatus.NEW,
    appliedDate: '2023-10-27',
    customAnswers: { 'q3': 'Yes', 'q4': 'Strict confidentiality is my priority.' }
  }
];
