
export enum ApplicationStatus {
  NEW = 'New Application',
  SCREENING = 'Screening',
  INTERVIEW_1 = '1st Interview',
  SELECTED = 'Selected',
  REJECTED = 'Rejected'
}

export interface FormQuestion {
  id: string;
  text: string;
  type: 'text' | 'long_text' | 'yes_no';
}

export interface Job {
  id: string;
  title: string;
  department: string;
  description: string;
  status: 'active' | 'closed';
  questions: FormQuestion[];
}

export interface Candidate {
  id: string;
  jobId: string; // Links candidate to a specific job
  fullName: string;
  email: string;
  phone: string;
  experienceYears: number;
  skills: string[];
  status: ApplicationStatus;
  appliedDate: string;
  notes?: string;
  aiSummary?: string;
  customAnswers?: Record<string, string>; // Answers to dynamic questions
}

export interface EmailDraft {
  subject: string;
  body: string;
}

export interface DragItem {
  id: string;
  status: ApplicationStatus;
}
