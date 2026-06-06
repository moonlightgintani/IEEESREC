import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, Check } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const societiesList = [
  "IEEE Student Branch SREC",
  "IEEE Computer Society (CS)",
  "IEEE Women in Engineering (WIE)",
  "IEEE Communication Society (ComSoc)",
  "IEEE Power Electronics Society (PELS)",
  "IEEE Engineering in Medicine and Biology (EMBS)",
  "IEEE Instrumentation and Measurement (IM)",
  "IEEE Computational Intelligence Society (CIS)",
];

const JoinPage = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [sop, setSop] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [selectedSociety, setSelectedSociety] = useState<string>("IEEE Computer Society (CS)");
  const [step, setStep] = useState<number>(1);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const skillsList = [
    "Web Development", "Artificial Intelligence", "Hardware Design", "Data Science",
    "Public Speaking", "Event Management", "Graphic Design", "Cybersecurity", "Robotics"
  ];

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const nextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) return;
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('applications').insert([
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
          department: department,
          year_of_study: yearOfStudy,
          target_society: selectedSociety,
          skills: selectedSkills,
          statement_of_purpose: sop,
        }
      ]);

      if (error) throw error;
      
      setIsSubmitted(true);
      setTimeout(() => navigate("/"), 3500);
    } catch (error: any) {
      toast({
        title: "Submission Error",
        description: error.message || "Could not submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-slate-900 selection:text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 w-full pt-32 pb-24">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-slate-400 mb-2">Application Portal</p>
            <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-slate-900 mb-6">
              Join a Chapter
            </h1>
            <div className="h-[1px] w-12 bg-slate-900 mb-6"></div>
            <p className="text-slate-500 max-w-2xl text-lg">
              Select the society you wish to apply for and submit your academic details. Our executive committee will review your application and contact you shortly.
            </p>
          </motion.div>

          {isSubmitted ? (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white border border-slate-200 p-16 text-center shadow-lg"
            >
              <CheckCircle2 size={64} className="mx-auto text-cyan-600 mb-6" />
              <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Application Received</h2>
              <p className="text-slate-500 mb-8 max-w-md mx-auto">
                Thank you for applying to the {selectedSociety}. Your application is under review. Redirecting to home...
              </p>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-5 gap-12 lg:gap-8 items-start">
              
              {/* Left Side: Society Selection */}
              <div className="lg:col-span-2 space-y-2">
                <h3 className="font-bold text-slate-900 tracking-tight mb-6 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs">A</span>
                  Target Society
                </h3>
                {societiesList.map((soc) => (
                  <button
                    key={soc}
                    type="button"
                    onClick={() => { setSelectedSociety(soc); setStep(1); }}
                    className={`block w-full text-left px-5 py-4 border transition-all duration-300 ${
                      selectedSociety === soc 
                      ? "border-slate-900 bg-slate-900 text-white shadow-md lg:translate-x-4" 
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-sm font-semibold tracking-wide">{soc}</span>
                  </button>
                ))}
              </div>

              {/* Right Side: Form System */}
              <div className="lg:col-span-3 bg-white border border-slate-200 p-8 md:p-12 shadow-sm min-h-[600px] relative">
                
                {/* Progress Indicators */}
                <div className="flex gap-2 mb-12">
                  <div className={`h-1 flex-1 transition-colors duration-500 ${step >= 1 ? 'bg-slate-900' : 'bg-slate-100'}`}></div>
                  <div className={`h-1 flex-1 transition-colors duration-500 ${step >= 2 ? 'bg-slate-900' : 'bg-slate-100'}`}></div>
                </div>

                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.form 
                      key="step1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.4 }}
                      onSubmit={nextStep} 
                      className="space-y-6"
                    >
                      <h3 className="font-bold text-2xl text-slate-900 tracking-tight mb-8">
                        Applicant Details
                      </h3>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">First Name</label>
                          <input required type="text" className="w-full bg-[#fafafa] border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white transition-colors" placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Last Name</label>
                          <input required type="text" className="w-full bg-[#fafafa] border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white transition-colors" placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Academic Email</label>
                        <input required type="email" className="w-full bg-[#fafafa] border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white transition-colors" placeholder="john@srec.ac.in" value={email} onChange={(e) => setEmail(e.target.value)} />
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Department</label>
                          <select required title="Department" aria-label="Department" value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full bg-[#fafafa] border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-slate-900 transition-colors appearance-none cursor-pointer">
                            <option value="">Select Dept</option>
                            <option value="CSE">Computer Science</option>
                            <option value="ECE">Electronics</option>
                            <option value="EEE">Electrical</option>
                            <option value="IT">Information Tech</option>
                            <option value="BME">Biomedical</option>
                            <option value="Robotics">Robotics & Auto.</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Year of Study</label>
                          <select required title="Year of Study" aria-label="Year of Study" value={yearOfStudy} onChange={(e) => setYearOfStudy(e.target.value)} className="w-full bg-[#fafafa] border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-slate-900 transition-colors appearance-none cursor-pointer">
                            <option value="">Select Year</option>
                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                          </select>
                        </div>
                      </div>

                      <div className="pt-8">
                        <button type="submit" className="group flex items-center justify-between w-full px-8 py-5 bg-slate-900 text-white text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold hover:bg-slate-800 transition-colors">
                          Continue to Validation <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </motion.form>
                  )}

                  {step === 2 && (
                    <motion.form 
                      key="step2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.4 }}
                      onSubmit={handleSubmit} 
                      className="space-y-8"
                    >
                      <div>
                        <button type="button" onClick={() => setStep(1)} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 mb-6 transition-colors">
                          <ArrowLeft size={12} /> Back
                        </button>
                        <h3 className="font-bold text-2xl text-slate-900 tracking-tight mb-2">
                          Skills & Validation
                        </h3>
                        <p className="text-sm text-slate-500 mb-8">Select your core competencies to help us match you with the right project teams in {selectedSociety.match(/\(([^)]+)\)/)?.[1]}.</p>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Technical & Soft Skills</label>
                        <div className="flex flex-wrap gap-2">
                          {skillsList.map(skill => (
                            <button
                              type="button"
                              key={skill}
                              onClick={() => handleSkillToggle(skill)}
                              className={`px-4 py-2 text-xs font-semibold border rounded-sm transition-all duration-300 ${
                                selectedSkills.includes(skill)
                                ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-900/20"
                                : "bg-white border-slate-200 text-slate-500 hover:border-slate-400"
                              }`}
                            >
                              {skill}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2 pt-4">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Statement of Purpose</label>
                        <textarea required rows={3} className="w-full bg-[#fafafa] border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white transition-colors resize-none" placeholder="Briefly explain your objective in joining..." value={sop} onChange={(e) => setSop(e.target.value)}></textarea>
                      </div>

                      <div className="pt-4 border-t border-slate-100">
                        <label className="flex items-start gap-4 cursor-pointer group">
                          <div className={`mt-0.5 flex shrink-0 items-center justify-center w-5 h-5 border transition-colors ${termsAccepted ? 'bg-cyan-600 border-cyan-600' : 'bg-white border-slate-300 group-hover:border-slate-500'}`}>
                            {termsAccepted && <Check size={12} className="text-white" />}
                          </div>
                          <input type="checkbox" className="hidden" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} />
                          <span className="text-xs text-slate-500 leading-relaxed font-medium">I agree to the IEEE code of ethics and understand my application will be reviewed by the student branch executive committee.</span>
                        </label>
                      </div>

                      <div className="pt-4">
                        <button type="submit" disabled={!termsAccepted || isSubmitting} className={`group flex items-center justify-between w-full px-8 py-5 text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold transition-all ${termsAccepted ? 'bg-cyan-600 text-white hover:bg-cyan-700 shadow-xl shadow-cyan-600/20' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
                          {isSubmitting ? "Submitting..." : "Complete Application"} <ShieldCheck size={16} className={termsAccepted ? "text-cyan-200" : "text-slate-300"} />
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JoinPage;
