'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, MapPin, Send, Eye, EyeOff, CheckCircle2, ArrowRight, ArrowLeft, Image as ImageIcon, X, Check, Banknote, ShieldAlert, ScrollText, Building, Flame, GlassWater, HelpCircle, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { TrustLabel } from '@/components/trust-label';

const categories = [
  { id: 'cash', icon: Banknote, color: 'text-amber-500', label: 'Vote Buying / Cash', desc: 'Cash distribution to voters' },
  { id: 'intimidation', icon: ShieldAlert, color: 'text-red-500', label: 'Voter Intimidation', desc: 'Threats or pressure on voters' },
  { id: 'mcc', icon: ScrollText, color: 'text-blue-500', label: 'MCC Violation', desc: 'Model Code of Conduct breach' },
  { id: 'booth', icon: Building, color: 'text-purple-500', label: 'Booth Capturing', desc: 'Booth capture or impersonation' },
  { id: 'hate', icon: Flame, color: 'text-orange-500', label: 'Hate Speech', desc: 'Inflammatory or divisive material' },
  { id: 'liquor', icon: GlassWater, color: 'text-cyan-500', label: 'Liquor Distribution', desc: 'Alcohol given to influence votes' },
  { id: 'other', icon: HelpCircle, color: 'text-gray-500', label: 'Other Violation', desc: 'Any other election violation' },
];

const constituencies = ['Mumbai South', 'Mumbai North', 'Lucknow', 'Varanasi', 'Chennai Central', 'Hyderabad', 'Bengaluru South', 'Delhi Chandni Chowk'];

const statusSteps = [
  { key: 'submitted', label: 'Submitted' },
  { key: 'under-review', label: 'Under Review' },
  { key: 'assigned', label: 'Escalated' },
  { key: 'resolved', label: 'Resolved' },
];

export default function ComplaintPage() {
  const router = useRouter();
  const { reports, addReport, earnBadge, completeStep, addXP } = useAppStore();
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [location, setLocation] = useState('');
  const [constituency, setConstituency] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submittedId, setSubmittedId] = useState('');
  const [locating, setLocating] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleGeolocate = () => {
    setLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => { setLocation(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`); setLocating(false); },
        () => { setLocation('Location unavailable — enter manually'); setLocating(false); }
      );
    } else { setLocation('Geolocation not supported'); setLocating(false); }
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    const digits = String(Math.floor(10000 + Math.random() * 90000));
    const id = `VP-2025-${digits}`;
    addReport({ id, type: category, description, status: 'submitted', timestamp: new Date().toISOString(), location: location || 'Not specified' });
    earnBadge('civic-guardian');
    completeStep('report-violation');
    addXP(20);
    setSubmittedId(id);
    setStep(4);
    // Simulate progression
    setTimeout(() => useAppStore.getState().updateReportStatus(id, 'under-review'), 3000);
  };

  const steps = ['Category', 'Details', 'Evidence', 'Review', 'Done'];

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <div className="text-center mb-6">
        <h1 className="font-heading text-2xl font-bold mb-1">Report Violation</h1>
        <p className="text-sm text-muted-foreground mb-3">cVIGIL-style election grievance reporting</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href="https://cvigil.eci.gov.in/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider hover:bg-blue-500/20 transition-colors">
            <ExternalLink className="w-3.5 h-3.5" /> Official cVIGIL Portal
          </a>
          <a href="https://ngsp.eci.gov.in/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bottle/10 text-bottle dark:text-wattle text-[10px] font-bold uppercase tracking-wider hover:bg-bottle/20 transition-colors">
            <ExternalLink className="w-3.5 h-3.5" /> National Grievance Service (NGSP)
          </a>
        </div>
      </div>

      {/* Progress */}
      {step < 4 && (
        <div className="flex items-center gap-1 mb-6">
          {steps.slice(0, 4).map((s, i) => (
            <div key={s} className="flex-1">
              <div className={`h-1.5 rounded-full transition-all ${i <= step ? 'bg-bottle' : 'bg-muted'}`} />
              <p className={`text-[8px] mt-0.5 text-center ${i <= step ? 'text-wattle font-bold' : 'text-muted-foreground'}`}>{s}</p>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* STEP 0: Category */}
        {step === 0 && (
          <motion.div key="cat" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="glass-card p-6">
            <h2 className="font-heading font-bold text-lg mb-4">What type of violation?</h2>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((c) => (
                <button key={c.id} onClick={() => setCategory(c.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${category === c.id ? 'border-bottle bg-bottle' : 'border-border hover:bg-muted'}`}>
                  <span className="block mb-2"><c.icon className={`w-6 h-6 ${c.color}`} /></span>
                  <span className="text-xs font-bold block">{c.label}</span>
                  <span className="text-[10px] text-muted-foreground">{c.desc}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(1)} disabled={!category} className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-bottle-light to-bottle text-white font-bold disabled:opacity-40 flex items-center justify-center gap-2">
              Next <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* STEP 1: Details */}
        {step === 1 && (
          <motion.div key="details" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="glass-card p-6 space-y-4">
            <h2 className="font-heading font-bold text-lg">Describe the incident</h2>
            <div>
              <label className="text-xs font-medium mb-1 block">Description <span className="text-muted-foreground">({description.length}/500)</span></label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value.slice(0, 500))} rows={4} className="w-full px-3 py-2.5 rounded-lg border border-border bg-card text-sm focus:ring-2 focus:ring-bottle focus:border-bottle outline-none resize-none" placeholder="Describe what you witnessed..." />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Date & Time</label>
              <input type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-border bg-card text-sm focus:ring-2 focus:ring-bottle outline-none" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Location</label>
              <div className="flex gap-2">
                <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Enter location" className="flex-1 px-3 py-2.5 rounded-lg border border-border bg-card text-sm focus:ring-2 focus:ring-bottle outline-none" />
                <button onClick={handleGeolocate} disabled={locating} className="px-3 rounded-lg bg-muted hover:bg-bottle transition-colors">
                  <MapPin className={`w-4 h-4 ${locating ? 'animate-pulse' : ''}`} />
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Constituency</label>
              <select value={constituency} onChange={(e) => setConstituency(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-border bg-card text-sm focus:ring-2 focus:ring-bottle outline-none">
                <option value="">Select constituency</option>
                {constituencies.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button onClick={() => setAnonymous(!anonymous)} className="flex items-center gap-2 text-sm">
              {anonymous ? <EyeOff className="w-4 h-4 text-wattle" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
              <span className={anonymous ? 'text-wattle font-medium' : 'text-muted-foreground'}>Submit anonymously</span>
            </button>
            <div className="flex gap-3">
              <button onClick={() => setStep(0)} className="px-6 py-3 rounded-xl border border-border"><ArrowLeft className="w-4 h-4" /></button>
              <button onClick={() => setStep(2)} disabled={!description} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-bottle-light to-bottle text-white font-bold disabled:opacity-40 flex items-center justify-center gap-2">
                Next <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: Evidence */}
        {step === 2 && (
          <motion.div key="evidence" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="glass-card p-6 space-y-4">
            <h2 className="font-heading font-bold text-lg">Upload Evidence</h2>
            <p className="text-xs text-muted-foreground">Evidence will be submitted securely to ECI (Simulation)</p>
            <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
            {photoPreview ? (
              <div className="relative">
                <img src={photoPreview} alt="Evidence" className="w-full h-48 object-cover rounded-xl" />
                <button onClick={() => setPhotoPreview(null)} className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white"><X className="w-4 h-4" /></button>
              </div>
            ) : (
              <button onClick={() => fileRef.current?.click()} className="w-full border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-muted/50 transition-all">
                <Camera className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Tap to capture or upload photo</p>
              </button>
            )}
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="px-6 py-3 rounded-xl border border-border"><ArrowLeft className="w-4 h-4" /></button>
              <button onClick={() => setStep(3)} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-bottle-light to-bottle text-white font-bold flex items-center justify-center gap-2">
                Review <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: Review */}
        {step === 3 && (
          <motion.div key="review" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="glass-card p-6 space-y-4">
            <h2 className="font-heading font-bold text-lg">Review Your Report</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1 border-b border-border"><span className="text-muted-foreground">Category</span><span className="font-medium">{categories.find((c) => c.id === category)?.label}</span></div>
              <div className="flex justify-between py-1 border-b border-border"><span className="text-muted-foreground">Description</span><span className="font-medium text-right max-w-[200px] truncate">{description}</span></div>
              <div className="flex justify-between py-1 border-b border-border"><span className="text-muted-foreground">Location</span><span className="font-medium">{location || 'Not specified'}</span></div>
              <div className="flex justify-between py-1 border-b border-border"><span className="text-muted-foreground">Constituency</span><span className="font-medium">{constituency || 'Not selected'}</span></div>
              <div className="flex justify-between py-1 border-b border-border"><span className="text-muted-foreground">Anonymous</span><span className="font-medium">{anonymous ? 'Yes' : 'No'}</span></div>
              <div className="flex justify-between py-1"><span className="text-muted-foreground">Evidence</span><span className="font-medium">{photoPreview ? '1 photo attached' : 'None'}</span></div>
            </div>
            <label className="flex items-start gap-2 p-3 rounded-lg bg-muted cursor-pointer">
              <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="w-4 h-4 mt-0.5 accent-wattle" />
              <span className="text-xs text-muted-foreground">I confirm this report is accurate and truthful. Filing a false report is an offense.</span>
            </label>
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="px-6 py-3 rounded-xl border border-border"><ArrowLeft className="w-4 h-4" /></button>
              <button onClick={handleSubmit} disabled={!confirmed} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold disabled:opacity-40 flex items-center justify-center gap-2">
                Submit Report <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 4: Success */}
        {step === 4 && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            <div className="glass-card p-6 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                <div className="w-16 h-16 mx-auto rounded-full bg-sage/10 flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-8 h-8 text-sage" />
                </div>
              </motion.div>
              <h2 className="font-heading font-bold text-xl mb-1">Report Submitted!</h2>
              <p className="text-sm text-muted-foreground mb-3">Your report will be processed within 100 minutes.</p>
              <div className="inline-block px-4 py-2 rounded-lg bg-muted mb-2">
                <span className="text-xs text-muted-foreground">Tracking ID: </span>
                <span className="font-mono font-bold text-sm">{submittedId}</span>
              </div>
              <br /><TrustLabel level="MOCK_DATA" />
            </div>

            {/* Status */}
            <div className="glass-card p-5">
              <h3 className="font-heading font-semibold text-sm mb-3">Report Status</h3>
              {statusSteps.map((s, i) => {
                const idx = statusSteps.findIndex((st) => st.key === (reports.find((r) => r.id === submittedId)?.status || 'submitted'));
                const isDone = i <= idx;
                return (
                  <div key={s.key} className="flex items-center gap-3 py-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center ${isDone ? 'bg-sage/10' : 'bg-muted'} ${i === idx ? 'pulse-glow' : ''}`}>
                      {isDone ? <Check className="w-3.5 h-3.5 text-sage" /> : <span className="w-2 h-2 rounded-full bg-muted-foreground" />}
                    </div>
                    <span className={`text-sm ${isDone ? 'font-medium' : 'text-muted-foreground'}`}>{s.label}</span>
                    {i === idx && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-bottle text-wattle font-bold">Current</span>}
                  </div>
                );
              })}
              <p className="text-[10px] text-muted-foreground mt-2 italic">Estimated timeline: 100 minutes (simulated)</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => { setStep(0); setCategory(''); setDescription(''); setConfirmed(false); setPhotoPreview(null); setSubmittedId(''); }}
                className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">
                File Another Report
              </button>
              <button onClick={() => { useAppStore.getState().completeStep('report-violation'); router.push('/journey'); }}
                className="flex-1 py-2.5 rounded-xl bg-bottle text-white text-sm font-bold hover:bg-bottle-dark transition-colors">
                Mark as Complete & Continue to Journey
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
