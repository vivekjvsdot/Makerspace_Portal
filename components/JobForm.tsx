
import React, { useState } from 'react';
import { JobFormData, UserType, MachineType, ComponentItem } from '../types';
// import { getFeasibilityAdvice } from '../services/geminiService';

interface JobFormProps {
  onSubmit: (data: JobFormData) => void;
}

const QuestionCard: React.FC<{ label: string; required?: boolean; children: React.ReactNode; hint?: string }> = ({ label, required, children, hint }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-4">
    <label className="block text-base font-medium text-slate-900 mb-2">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    {hint && <p className="text-sm text-slate-500 mb-3">{hint}</p>}
    {children}
  </div>
);

const JobForm: React.FC<JobFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<JobFormData>({
    email: '',
    fullName: '',
    phone: '',
    shippingAddress: '',
    city: '',
    state: '',
    zipCode: '',
    isBillingSame: true,
    billingAddress: '',
    userType: UserType.Student,
    projectName: '',
    components: [
      {
        id: crypto.randomUUID(),
        name: '',
        description: '',
        machine: MachineType.ThreeDPrinting,
        quantity: 1,
        material: '',
      },
    ],
  });

  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);
  const [isAdviceLoading, setIsAdviceLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleComponentChange = (id: string, field: keyof ComponentItem, value: any) => {
    setFormData((prev) => ({
      ...prev,
      components: prev.components.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    }));
  };

  const addComponent = () => {
    setFormData((prev) => ({
      ...prev,
      components: [
        ...prev.components,
        {
          id: crypto.randomUUID(),
          name: '',
          description: '',
          machine: MachineType.ThreeDPrinting,
          quantity: 1,
          material: '',
        },
      ],
    }));
  };

  const removeComponent = (id: string) => {
    if (formData.components.length > 1) {
      setFormData((prev) => ({
        ...prev,
        components: prev.components.filter((c) => c.id !== id),
      }));
    }
  };

  // const handleGetAdvice = async () => {
  //   setIsAdviceLoading(true);
  //   const feedback = await getFeasibilityAdvice(formData.components);
  //   setAdvice(feedback);
  //   setIsAdviceLoading(false);
  // };

  const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]); // remove metadata prefix
    };
    reader.onerror = error => reject(error);
  });

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {

    const formattedComponents = await Promise.all(
      formData.components.map(async (comp) => {
        let fileBase64 = "";
        let fileType = "";
        let fileName = "";

        if (comp.file) {
          fileBase64 = await toBase64(comp.file);
          fileType = comp.file.type;
          fileName = comp.file.name;
        }

        return {
          name: comp.name,
          description: comp.description,
          machine: comp.machine,
          quantity: comp.quantity,
          material: comp.material,
          fileBase64,
          fileType,
          fileName
        };
      })
    );

    const payload = {
      token: "kase2026secure",
      email: formData.email,
      fullName: formData.fullName,
      phone: formData.phone,
      address: `${formData.shippingAddress}, ${formData.city}, ${formData.state}, ${formData.zipCode}`,
      userType: formData.userType,
      projectName: formData.projectName,
      components: formattedComponents
    };

    const response = await fetch(
      "https://script.google.com/macros/s/AKfycby4h6FW7f6QTP621exWkC33ico5dtWYFI0ogXnzEH6eSaGgbv5ve-RMH2bRC1jQVzzI/exec",
      {
        method: "POST",
        body: JSON.stringify(payload)
      }
    );

    const result = await response.json();

    if (result.success) {
      onSubmit(formData);
    } else {
      alert("Submission failed");
    }

  } catch (error) {
    console.error("Error submitting form:", error);
    alert("Error submitting form");
  }
};



  const inputClasses = "w-full py-2 border-b-2 border-slate-100 focus:border-indigo-600 outline-none transition-colors text-slate-800 bg-transparent placeholder:text-slate-300";

  return (
    <form onSubmit={handleSubmit} className="pb-12">
      <QuestionCard label="Email" required hint="Record innovationhead.kase@kgr.ac.in as the email to be included with my response">
        <input required type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Your email address" className={inputClasses} />
      </QuestionCard>

      <QuestionCard label="Full Name" required>
        <input required type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Your answer" className={inputClasses} />
      </QuestionCard>

      <QuestionCard label="Phone Number" required>
        <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Your answer" className={inputClasses} />
      </QuestionCard>

      <QuestionCard label="Shipping Address" required>
        <div className="space-y-4">
          <input required type="text" name="shippingAddress" value={formData.shippingAddress} onChange={handleInputChange} placeholder="Street Address" className={inputClasses} />
          <div className="grid grid-cols-2 gap-4">
            <input required type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="City" className={inputClasses} />
            <input required type="text" name="state" value={formData.state} onChange={handleInputChange} placeholder="State" className={inputClasses} />
          </div>
          <input required type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} placeholder="Zip Code" className={inputClasses} />
        </div>
      </QuestionCard>

      <QuestionCard label="Is Your Shipping Address Same as Your Billing Address?" required>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="radio" name="isBillingSame" checked={formData.isBillingSame} onChange={() => setFormData(p => ({...p, isBillingSame: true}))} className="w-4 h-4 text-indigo-600" />
            <span className="text-slate-700">Yes</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="radio" name="isBillingSame" checked={!formData.isBillingSame} onChange={() => setFormData(p => ({...p, isBillingSame: false}))} className="w-4 h-4 text-indigo-600" />
            <span className="text-slate-700">No</span>
          </label>
        </div>
      </QuestionCard>

      {!formData.isBillingSame && (
        <QuestionCard label="Billing Address" required hint="Please provide the full billing address.">
          <textarea required name="billingAddress" value={formData.billingAddress} onChange={handleInputChange} placeholder="Your answer" className={`${inputClasses} h-24 resize-none`} />
        </QuestionCard>
      )}

      <QuestionCard label="User Type" required>
        <select name="userType" value={formData.userType} onChange={handleInputChange} className={inputClasses}>
          {Object.values(UserType).map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </QuestionCard>

      <QuestionCard label="Project Name" required>
        <input required type="text" name="projectName" value={formData.projectName} onChange={handleInputChange} placeholder="Your answer" className={inputClasses} />
      </QuestionCard>

      {/* Component Loop */}
      {formData.components.map((comp, index) => (
        <div key={comp.id} className="relative mt-8">
          <div className="absolute -top-3 left-4 bg-indigo-600 text-white px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest z-10 shadow-sm">
            Component {index + 1}
          </div>
          
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm divide-y divide-slate-100">
            <div className="p-6">
              <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Name</label>
              <input required type="text" value={comp.name} onChange={(e) => handleComponentChange(comp.id, 'name', e.target.value)} placeholder="Component Name" className={inputClasses} />
            </div>
            <div className="p-6">
              <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Description</label>
              <input required type="text" value={comp.description} onChange={(e) => handleComponentChange(comp.id, 'description', e.target.value)} placeholder="Usage and details" className={inputClasses} />
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Machine</label>
                <select value={comp.machine} onChange={(e) => handleComponentChange(comp.id, 'machine', e.target.value)} className={inputClasses}>
                  {Object.values(MachineType).map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Quantity</label>
                <input required type="number" min="1" value={comp.quantity} onChange={(e) => handleComponentChange(comp.id, 'quantity', parseInt(e.target.value))} className={inputClasses} />
              </div>
            </div>
            <div className="p-6">
              <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Material</label>
              <input required type="text" value={comp.material} onChange={(e) => handleComponentChange(comp.id, 'material', e.target.value)} placeholder="Material specification" className={inputClasses} />
            </div>
            <div className="p-6">
              <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Design File</label>
              <div className="mt-2">
              <input
                required
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  setFormData(prev => ({
                    ...prev,
                    components: prev.components.map(c =>
                      c.id === comp.id
                        ? { ...c, file }   // 👈 store actual File object
                        : c
                    )
                  }));
                }}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
              />
            </div>

            </div>
            {formData.components.length > 1 && (
              <div className="bg-slate-50 p-3 text-right">
                <button type="button" onClick={() => removeComponent(comp.id)} className="text-xs font-bold text-rose-500 hover:text-rose-600">Remove Component</button>
              </div>
            )}
          </div>
        </div>
      ))}

      <div className="mt-6 flex flex-col gap-4">
        <button type="button" onClick={addComponent} className="w-full py-4 rounded-xl border-2 border-dashed border-slate-300 text-slate-400 font-bold hover:border-indigo-400 hover:text-indigo-500 hover:bg-white transition-all">
          + Add Another Component
        </button>

        <div className="flex items-center justify-between px-2 pt-8">
          {/* <button type="button" onClick={handleGetAdvice} disabled={isAdviceLoading} className="text-xs font-bold text-indigo-600 hover:underline">
            {isAdviceLoading ? 'Analyzing...' : 'Analyze with AI Assistant'}
          </button> */}
          <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-10 py-3 rounded-lg font-bold shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50">
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>

        {/* {advice && (
          <div className="mt-6 bg-indigo-50 border border-indigo-100 p-4 rounded-xl text-sm text-indigo-800 animate-in fade-in zoom-in duration-300">
             <div className="font-bold mb-1">AI Technician Advice:</div>
             <div className="whitespace-pre-line">{advice}</div>
          </div>
        )} */}
      </div>
    </form>
  );
};

export default JobForm;
