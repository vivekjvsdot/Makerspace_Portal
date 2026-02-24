
import React, { useState } from 'react';
import JobForm from './components/JobForm';
import SuccessView from './components/SuccessView';
import { JobFormData } from './types';

const App: React.FC = () => {
  const [submittedData, setSubmittedData] = useState<JobFormData | null>(null);

  const handleSubmit = (data: JobFormData) => {
    setSubmittedData(data);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setSubmittedData(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      {/* Subtle branding line at the top */}
      <div className="h-2 w-full bg-indigo-600"></div>
      
      <main className="flex-grow max-w-2xl mx-auto px-4 py-12 w-full">
        <header className="mb-8 px-2">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">KASE Makerspace Jobwork</h1>
          <p className="text-slate-500 mt-2">Submit your fabrication requirements for review.</p>
        </header>

        {!submittedData ? (
          <JobForm onSubmit={handleSubmit} />
        ) : (
          <SuccessView data={submittedData} onReset={resetForm} />
        )}
      </main>

      <footer className="py-8 text-center border-t border-slate-200 mt-12">
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
          &copy; {new Date().getFullYear()} KASE - innovationhead.kase@kgr.ac.in
        </p>
      </footer>
    </div>
  );
};

export default App;
