import React, { useState, useEffect } from 'react';
import { EmailDraft } from '../types';
import { X, Send, Wand2 } from 'lucide-react';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  draft: EmailDraft | null;
  isLoading: boolean;
  onSend: () => void;
  candidateName: string;
}

export const EmailModal: React.FC<EmailModalProps> = ({
  isOpen, onClose, draft, isLoading, onSend, candidateName
}) => {
  const [currentDraft, setCurrentDraft] = useState<EmailDraft>({ subject: '', body: '' });

  useEffect(() => {
    if (draft) {
      setCurrentDraft(draft);
    }
  }, [draft]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-2">
             <div className="p-2 bg-blue-100 rounded-full text-blue-600">
               <Wand2 size={18} />
             </div>
             <div>
               <h3 className="font-bold text-gray-800">AI Email Assistant</h3>
               <p className="text-xs text-gray-500">Reviewing draft for {candidateName}</p>
             </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
              <p className="text-gray-500 animate-pulse">Drafting email with Gemini AI...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Line</label>
                <input
                  type="text"
                  value={currentDraft.subject}
                  onChange={(e) => setCurrentDraft({ ...currentDraft, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Body</label>
                <textarea
                  value={currentDraft.body}
                  onChange={(e) => setCurrentDraft({ ...currentDraft, body: e.target.value })}
                  className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none font-mono text-sm leading-relaxed"
                />
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSend}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} />
            Approve & Send
          </button>
        </div>
      </div>
    </div>
  );
};
