import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Sparkles, Send, Globe, ArrowRight, Activity, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import robotGif from "@/assets/robot.gif";

interface ChatMessage {
  sender: "user" | "bot";
  text: string;
}

const qaDatabase = [
  {
    keywords: ["who", "join", "eligibility", "eligible", "member", "student", "freshman", "sophomore", "junior", "senior"],
    question: "Who can join the IEEE Student Branch?",
    answer: "Any student currently enrolled at SREC, regardless of their major or year of study, is welcome to join our branch. We encourage diverse perspectives and interdisciplinary collaboration."
  },
  {
    keywords: ["benefit", "benefits", "why join", "advantage", "advantages", "perk", "perks", "membership"],
    question: "What are the core benefits of becoming a member?",
    answer: "Members get exclusive access to industry workshops, global networking events, hackathons, and research mentorship. You also receive the official IEEE membership which unlocks a vast library of technical publications."
  },
  {
    keywords: ["participate", "event", "events", "how", "register", "join event", "upcoming"],
    question: "How do I participate in upcoming events?",
    answer: "You can view all our upcoming initiatives on the 'Latest Activities' page. Members usually receive early-bird registration links via their university email."
  },
  {
    keywords: ["leadership", "lead", "officer", "committee", "excom", "role", "roles", "volunteer", "president", "chair"],
    question: "Are there opportunities for leadership roles?",
    answer: "Absolutely! We hold annual elections for Executive Committee positions and constantly recruit volunteers to lead specific events, technical societies, and community outreach programs."
  },
  {
    keywords: ["hello", "hi", "hey", "greetings", "nexus", "bot"],
    question: "Greetings",
    answer: "Hello! I am Nexus, your SREC IEEE AI assistant. How can I help you today?"
  },
  {
    keywords: ["about", "srec", "ieee srec", "what is"],
    question: "What is IEEE SREC?",
    answer: "Operating since June 11th, 2001 under the IEEE Madras Section, the IEEE Student Branch of Sri Ramakrishna Engineering College is a vibrant hub promoting continuous technical excellence, innovation, and professional growth."
  },
  {
    keywords: ["thank you", "thanks", "helpful"],
    question: "Thanks",
    answer: "You're very welcome! Let me know if there's anything else I can help you with."
  }
];

const getAIResponse = (input: string): string => {
  const normalized = input.toLowerCase().trim();
  const cleanInput = normalized.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "");
  const words = cleanInput.split(/\s+/);
  
  let bestMatch = null;
  let maxScore = 0;
  
  for (const item of qaDatabase) {
    let score = 0;
    
    // Score based on full phrase match
    for (const keyword of item.keywords) {
      if (cleanInput.includes(keyword)) {
        score += 3;
      }
    }
    
    // Score based on word matches
    for (const word of words) {
      if (item.keywords.includes(word)) {
        score += 1;
      }
    }
    
    if (score > maxScore) {
      maxScore = score;
      bestMatch = item;
    }
  }
  
  if (maxScore >= 2 && bestMatch) {
    return bestMatch.answer;
  }
  
  const fallbacks = [
    "I've searched the SREC IEEE Nexus database, but I couldn't find a direct answer to your question. Try asking about membership, joining eligibility, or leadership opportunities!",
    "That sounds interesting! While I don't have specific details on that in my memory bank, I can guide you on joining IEEE SREC, our technical chapters, or upcoming events.",
    "I'm sorry, I couldn't find a matching answer. Feel free to rephrase or click one of the suggested questions below!"
  ];
  
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
};

const FloatingRobotAgent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { 
      sender: "bot", 
      text: "Welcome to the IEEE SREC digital portal. I am Nexus, your interactive AI assistant. Ask me anything about our branch!" 
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Small timeout to allow the dialog animation to complete
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [isOpen, chatHistory, isTyping]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    
    setChatHistory((prev) => [...prev, { sender: "user", text }]);
    setInputValue("");
    setIsTyping(true);
    
    setTimeout(() => {
      const response = getAIResponse(text);
      setIsTyping(false);
      
      // Stream characters to simulate real AI generation
      let currentLength = 0;
      setChatHistory((prev) => [...prev, { sender: "bot", text: "" }]);
      
      const interval = setInterval(() => {
        currentLength += 4;
        if (currentLength >= response.length) {
          clearInterval(interval);
          setChatHistory((prev) => {
            const copy = [...prev];
            copy[copy.length - 1].text = response;
            return copy;
          });
        } else {
          setChatHistory((prev) => {
            const copy = [...prev];
            copy[copy.length - 1].text = response.substring(0, currentLength);
            return copy;
          });
        }
      }, 12);
    }, 800);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const suggestedQuestions = [
    "Who can join?",
    "What are the benefits?",
    "How to participate?",
    "Are there leadership roles?"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 30, scale: 0.9, filter: "blur(10px)" }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="mb-4 w-[350px] md:w-[380px] h-[520px] bg-white/95 backdrop-blur-xl border border-slate-200/60 shadow-[0_20px_50px_rgba(0,0,0,0.15),_0_0_40px_rgba(34,211,238,0.15)] rounded-2xl overflow-hidden relative flex flex-col"
          >
            {/* Ambient Top Glow */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500"></div>

            {/* Header */}
            <div className="bg-slate-900/5 px-5 py-4 flex items-center justify-between border-b border-slate-100 backdrop-blur-sm shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-3 h-3">
                  <div className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-75"></div>
                  <div className="relative w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,1)]"></div>
                </div>
                <span className="text-slate-900 font-extrabold text-xs tracking-[0.2em] uppercase">Nexus AI System</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                title="Close Assistant" 
                aria-label="Close Assistant" 
                className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-1.5 rounded-full transition-colors"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-white to-slate-50/30 flex flex-col no-scrollbar">
              {chatHistory.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm transition-all duration-300 ${
                    msg.sender === "user" 
                      ? "bg-slate-900 text-white rounded-tr-none" 
                      : "bg-white text-slate-800 border border-slate-100 rounded-tl-none"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions & Input */}
            <div className="p-4 border-t border-slate-100 bg-white shrink-0 space-y-3">
              {/* Quick Click Suggestions */}
              <div className="flex flex-wrap gap-1.5 pb-1">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(q)}
                    className="text-[11px] font-bold text-cyan-600 bg-cyan-50 hover:bg-cyan-100/80 px-2.5 py-1 rounded-full border border-cyan-100/50 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Form Input */}
              <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask Nexus AI something..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#00629b] focus:bg-white transition-all text-slate-800 font-medium"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-[#00629b] disabled:bg-slate-100 disabled:text-slate-400 transition-colors shadow-sm"
                  title="Send Message"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Robot Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        title="Toggle Assistant"
        aria-label="Toggle Assistant"
        className="group relative flex items-center justify-center w-28 h-28 md:w-32 md:h-32 transition-all duration-500 overflow-visible focus:outline-none"
      >
        {isOpen ? (
          <motion.div 
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            className="flex items-center justify-center w-14 h-14 bg-slate-900 border-2 border-slate-700 text-white rounded-full shadow-[0_0_30px_rgba(11,59,143,0.3)] hover:shadow-[0_0_40px_rgba(34,211,238,0.6)] hover:bg-rose-500 hover:border-rose-400 transition-all duration-300"
          >
            <X size={26} strokeWidth={2.5} />
          </motion.div>
        ) : (
          <motion.div 
            animate={{ 
              y: [-15, 15, -15],
              rotate: [-4, 4, -4],
              scale: [1, 1.02, 1]
            }} 
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="relative w-full h-full drop-shadow-[0_15px_15px_rgba(34,211,238,0.3)] group-hover:drop-shadow-[0_25px_35px_rgba(34,211,238,0.6)] transition-all duration-500 cursor-pointer"
          >
            <img 
              src={robotGif} 
              alt="Floating Mascot Animation" 
              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
            />
            
            <motion.div 
              animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -bottom-2 lg:-bottom-6 left-1/2 -translate-x-1/2 w-16 h-4 bg-cyan-400 blur-[15px] rounded-full -z-10 opacity-50"
            />
            <Sparkles size={24} className="absolute top-2 right-2 text-yellow-300 opacity-0 group-hover:opacity-100 group-hover:animate-ping pointer-events-none" />
          </motion.div>
        )}
      </motion.button>

    </div>
  );
};

export default FloatingRobotAgent;
