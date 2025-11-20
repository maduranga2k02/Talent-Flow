
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, ApplicationStatus, EmailDraft } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateEmailDraft = async (
  candidate: Candidate,
  newStatus: ApplicationStatus,
  jobTitle: string
): Promise<EmailDraft> => {
  
  let promptContext = "";
  if (newStatus === ApplicationStatus.INTERVIEW_1) {
    promptContext = "invite them to a first round interview for the " + jobTitle + " role. Be professional, welcoming, and ask for their availability for the coming week.";
  } else if (newStatus === ApplicationStatus.REJECTED) {
    promptContext = "politely reject their application for " + jobTitle + ". Thank them for their time, mention we were impressed but chose another candidate, and wish them luck.";
  } else if (newStatus === ApplicationStatus.SELECTED) {
    promptContext = "inform them they have been selected for the " + jobTitle + " position and we are preparing the offer letter.";
  } else {
    promptContext = "update them on their application status.";
  }

  const prompt = `
    Write an email to a candidate named ${candidate.fullName} applying for the ${jobTitle} position.
    The goal is to ${promptContext}
    Keep the tone professional yet human.
    Return the result in JSON format with 'subject' and 'body' fields.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            body: { type: Type.STRING }
          },
          required: ['subject', 'body']
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as EmailDraft;

  } catch (error) {
    console.error("Error generating email:", error);
    return {
      subject: `Update regarding your application for ${jobTitle}`,
      body: `Dear ${candidate.fullName},\n\nCould not generate automated draft. Please write manually.\n\nBest,\nHR Team`
    };
  }
};

export const analyzeCandidateProfile = async (candidate: Candidate, jobTitle: string): Promise<string> => {
  const prompt = `
    Analyze this candidate for a ${jobTitle} role.
    Skills: ${candidate.skills.join(', ')}.
    Experience: ${candidate.experienceYears} years.
    Custom Answers: ${JSON.stringify(candidate.customAnswers || {})}.
    Provide a 1-sentence summary of their fit.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Analysis failed.";
  } catch (error) {
    return "Could not analyze profile.";
  }
};
