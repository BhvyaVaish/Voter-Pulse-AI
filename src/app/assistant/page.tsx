'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Vote, Loader2, Trash2, Sparkles, ExternalLink } from 'lucide-react';
import { useAppStore, type TrustLevel } from '@/lib/store';
import { useTranslation } from '@/lib/i18n/provider';
import { TrustLabel } from '@/components/trust-label';
import { useRouter } from 'next/navigation';

const intentKeywords: Record<string, { keywords: string[]; label: string }> = {
  ELIGIBILITY_CHECK: { keywords: ['eligible', 'age', 'qualify', 'can i vote', '18'], label: 'Eligibility Check' },
  REGISTRATION_HELP: { keywords: ['register', 'form 6', 'enroll', 'sign up'], label: 'Registration Help' },
  BOOTH_LOOKUP: { keywords: ['booth', 'polling station', 'where to vote', 'polling'], label: 'Booth Lookup' },
  CANDIDATE_INFO: { keywords: ['candidate', 'party', 'who to vote', 'profile'], label: 'Candidate Info' },
  COMPLAINT_SUPPORT: { keywords: ['complaint', 'violation', 'report', 'cvigil'], label: 'Complaint Support' },
  VOTING_EXPLANATION: { keywords: ['how to vote', 'evm', 'vvpat', 'machine', 'ballot'], label: 'Voting Explanation' },
  FACT_CHECK: { keywords: ['fake', 'rumor', 'misinformation', 'true', 'false'], label: 'Fact Check' },
};

function detectIntent(msg: string): string {
  const lower = msg.toLowerCase();
  for (const [intent, config] of Object.entries(intentKeywords)) {
    if (config.keywords.some((kw) => lower.includes(kw))) return intent;
  }
  return 'GENERAL';
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  trustLevel?: TrustLevel;
  quickActions?: string[];
  intent?: string;
}

export default function AssistantPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { persona, questSteps, language, chatHistory, addChatMessage, clearChat } = useAppStore();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>(chatHistory as Message[]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');

    const intent = detectIntent(userMsg);
    const userMessage: Message = { role: 'user', content: userMsg, intent };
    setMessages((m) => [...m, userMessage]);
    addChatMessage({ role: 'user', content: userMsg });
    setLoading(true);

    try {
      const completedStages = questSteps.filter((s) => s.completed).map((s) => s.id);
      const currentStage = questSteps.find((s) => s.active)?.id || '';

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].slice(-6).map((m) => ({ role: m.role, content: m.content })),
          userState: { persona, currentStage, completedStages, language, detectedIntent: intent },
        }),
      });

      const data = await res.json();
      const assistantMsg: Message = {
        role: 'assistant',
        content: data.answer || 'I apologize, I could not process that. Please try again.',
        trustLevel: (data.trustLevel as TrustLevel) || 'EXPLANATORY',
        quickActions: data.quickActions || [],
      };
      setMessages((m) => [...m, assistantMsg]);
      addChatMessage({ role: 'assistant', content: assistantMsg.content, trustLevel: assistantMsg.trustLevel });
    } catch {
      const errorMsg: Message = {
        role: 'assistant',
        content: 'AI is temporarily unavailable. For urgent queries, visit voters.eci.gov.in.',
        trustLevel: 'UNCERTAIN',
        quickActions: ['Try Again'],
      };
      setMessages((m) => [...m, errorMsg]);
    }
    setLoading(false);
  };

  const handleQuickAction = (action: string) => {
    const lower = action.toLowerCase();
    if (lower.includes('eligibility') || lower.includes('check')) { router.push('/journey/eligibility'); return; }
    if (lower.includes('roadmap') || lower.includes('journey')) { router.push('/journey'); return; }
    if (lower.includes('simulator') || lower.includes('vote')) { router.push('/simulator'); return; }
    if (lower.includes('report') || lower.includes('file')) { router.push('/complaint'); return; }
    if (lower.includes('polling') || lower.includes('guide')) { router.push('/polling-guide'); return; }
    if (lower.includes('candidate')) { router.push('/candidates'); return; }
    setInput(action);
  };

  const intentLabel = input ? intentKeywords[detectIntent(input)]?.label : null;

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-80px)] lg:h-screen">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-bottle-light to-bottle flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-sm">Voter Pulse AI Assistant</h1>
            <p className="text-[10px] text-muted-foreground">Context-aware civic coach</p>
          </div>
        </div>
        <button onClick={() => { clearChat(); setMessages([]); }} className="p-2 rounded-lg hover:bg-muted text-muted-foreground" title="Clear chat">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-bottle flex items-center justify-center mb-4">
              <Vote className="w-8 h-8 text-wattle" />
            </div>
            <h2 className="font-heading font-bold text-lg mb-2">Ask me anything about voting</h2>
            <p className="text-sm text-muted-foreground mb-6">I can help with eligibility, registration, EVM, candidates, complaints and more.</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Am I eligible to vote?', 'How do I register?', 'How does EVM work?', 'Report a violation'].map((q) => (
                <button key={q} onClick={() => setInput(q)} className="px-3 py-1.5 rounded-lg bg-muted text-xs font-medium hover:bg-bottle hover:text-wattle transition-all">
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] ${msg.role === 'user' ? '' : ''}`}>
              {/* Intent chip for user */}
              {msg.role === 'user' && msg.intent && msg.intent !== 'GENERAL' && (
                <p className="text-[10px] text-right text-muted-foreground mb-1">{intentKeywords[msg.intent]?.label}</p>
              )}
              <div className={`rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-bottle text-white rounded-br-md'
                  : 'glass-card rounded-bl-md'
              }`}>
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded-full bg-bottle flex items-center justify-center">
                      <Vote className="w-3 h-3 text-wattle" />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground">Voter Pulse AI</span>
                    {msg.trustLevel && <TrustLabel level={msg.trustLevel} size="xs" />}
                  </div>
                )}
                <div className="text-sm whitespace-pre-wrap leading-relaxed">
                  {(() => {
                    const content = msg.content;
                    const regex = /\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)|(https?:\/\/[^\s\)]+)/g;
                    const elements = [];
                    let lastIdx = 0;
                    let match;
                    
                    while ((match = regex.exec(content)) !== null) {
                      if (match.index > lastIdx) {
                        elements.push(content.substring(lastIdx, match.index));
                      }
                      
                      if (match[1] && match[2]) {
                        elements.push(
                          <a key={match.index} href={match[2]} target="_blank" rel="noopener noreferrer" className="text-wattle dark:text-bottle-light underline font-bold hover:opacity-80 inline-flex items-center gap-0.5">
                            {match[1]} <ExternalLink className="w-3 h-3 inline" />
                          </a>
                        );
                      } else if (match[3]) {
                        elements.push(
                          <a key={match.index} href={match[3]} target="_blank" rel="noopener noreferrer" className="text-wattle dark:text-bottle-light underline font-bold hover:opacity-80 break-all inline-flex items-center gap-0.5">
                            {match[3]} <ExternalLink className="w-3 h-3 inline" />
                          </a>
                        );
                      }
                      lastIdx = regex.lastIndex;
                    }
                    
                    if (lastIdx < content.length) {
                      elements.push(content.substring(lastIdx));
                    }
                    return elements;
                  })()}
                </div>
              </div>
              {/* Quick actions */}
              {msg.role === 'assistant' && msg.quickActions && msg.quickActions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {msg.quickActions.map((a) => (
                    <button key={a} onClick={() => handleQuickAction(a)} className="px-2.5 py-1 rounded-lg bg-muted text-[11px] font-medium hover:bg-bottle hover:text-wattle transition-all">
                      {a}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs">Thinking...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border">
        {intentLabel && input && (
          <p className="text-[10px] text-wattle font-bold mb-1">Detected: {intentLabel}</p>
        )}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about voting, registration, EVM..."
            className="flex-1 px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-bottle focus:border-bottle outline-none transition-all text-sm"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-4 py-3 rounded-xl bg-gradient-to-r from-bottle-light to-bottle text-white disabled:opacity-40 hover:shadow-lg transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
