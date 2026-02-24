
import React from 'react';
import { JobFormData } from '../types';

interface SuccessViewProps {
  data: JobFormData;
  onReset: () => void;
}

const SuccessView: React.FC<SuccessViewProps> = ({ data, onReset }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm text-center animate-in zoom-in duration-500">
      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Submission Successful</h2>
      <p className="text-slate-600 mb-8">
        Your response for <span className="font-bold text-slate-900">"{data.projectName}"</span> has been recorded. We will contact you at <span className="font-bold">{data.phone}</span> shortly.
      </p>
      
      <div className="text-left bg-slate-50 p-6 rounded-lg mb-8 space-y-2">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Summary</p>
        <p className="text-sm text-slate-700 font-medium">Requester: {data.fullName}</p>
        <p className="text-sm text-slate-700 font-medium">Items: {data.components.length}</p>
        <p className="text-sm text-slate-700 font-medium">Type: {data.userType}</p>
      </div>

      <button
        onClick={onReset}
        className="text-indigo-600 font-bold text-sm hover:underline"
      >
        Submit another response
      </button>
    </div>
  );
};

export default SuccessView;
