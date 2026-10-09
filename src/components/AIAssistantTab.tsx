import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  Shield,
  FileCheck2,
  AlertCircle,
  HelpCircle,
  Terminal,
  ExternalLink,
  Info,
  Clock
} from 'lucide-react';
import type { AIAssistantMessage, ForensicEvent } from '../types/forensics';

interface AIAssistantTabProps {
  investigationId: string;
  chatHistory: AIAssistantMessage[];
  events: ForensicEvent[];
  onSendMessage: (query: string) => Promise<void>;
  onSelectEvent: (event: ForensicEvent) => void;
}

const SAMPLE_PROMPTS = [
  'What happened in chronological order?',
  'Explain the lateral movement and privilege escalation path.',
  'Which events support the data exfiltration hypothesis?',
  'What evidence or logs are currently missing from the investigation?',
  'Analyze the impossible travel velocity anomaly between EVT-104 and EVT-105.'
];

export const AIAssistantTab: React.FC<AIAssistantTabProps> = ({
  investigationId,
  chatHistory,
  events,
  onSendMessage,
  onSelectEvent
}) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const eventMap = new Map(events.map(e => [e.id, e]));

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, loading]);

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return;
    setLoading(true);
    setError(null);
    setInput('');

    try {
      await onSendMessage(text.trim());
    } catch (err: any) {
      setError(err?.message || 'Failed to generate grounded AI analysis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-code text-cyan-400 mb-1">
              <Sparkles className="h-4 w-4" />
              <span>Grounding: Indexed Case Evidence & Forensic Rules</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-100 font-display">
              RAG & Generative AI Forensic Investigation Assistant
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Retrieval-Augmented Generation synthesizing multi-source forensic logs. Strictly cites verified Event IDs and Evidence Hashes, separating facts from inferences.
            </p>
          </div>

          <div className="rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs text-slate-300 font-mono-code">
            Model: <strong className="text-cyan-400">gemini-3.8-flash</strong>
          </div>
        </div>

        {/* Suggested Queries */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 font-mono-code block mb-2">
            Suggested Investigative Queries:
          </span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                disabled={loading}
                className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-300 hover:border-cyan-500 hover:text-cyan-300 transition-colors text-left font-sans"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-6 min-h-[420px]">
        {chatHistory.length === 0 && (
          <div className="py-16 text-center text-slate-500">
            <Sparkles className="h-8 w-8 mx-auto text-slate-600 mb-3" />
            <h4 className="text-sm font-semibold text-slate-300 font-display">
              No queries logged for this investigation yet.
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Select one of the suggested prompts above or type a forensic hypothesis below to analyze timestamps, killchains, and evidence integrity.
            </p>
          </div>
        )}

        {chatHistory.map((msg, index) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={msg.id || index}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-3xl rounded-2xl p-5 sm:p-6 transition-all ${
                  isUser
                    ? 'bg-cyan-950/40 border border-cyan-800/60 text-cyan-100'
                    : 'bg-slate-950/80 border border-slate-800 text-slate-200'
                }`}
              >
                {/* Role header */}
                <div className="flex items-center justify-between gap-4 border-b border-slate-800/60 pb-2 mb-3 text-xs font-mono-code">
                  <span className={isUser ? 'text-cyan-400 font-bold' : 'text-slate-400 font-bold'}>
                    {isUser ? 'Investigator Query' : 'Talfor AI Forensic Assistant (Grounded)'}
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    {msg.timestamp ? msg.timestamp.split('T')[1].substring(0, 8) : ''} UTC
                  </span>
                </div>

                {/* Content */}
                <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {msg.content}
                </div>

                {/* Cited Event IDs Badge Strip */}
                {msg.citedEventIds && msg.citedEventIds.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-800/80">
                    <span className="text-[11px] font-mono-code font-semibold text-slate-400 block mb-2">
                      Cited Verified Event IDs (Click to inspect):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {msg.citedEventIds.map(eid => {
                        const ev = eventMap.get(eid);
                        return (
                          <button
                            key={eid}
                            onClick={() => ev && onSelectEvent(ev)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-800/70 bg-cyan-950/60 px-2.5 py-1 text-xs font-mono-code text-cyan-300 hover:bg-cyan-900/60 transition-colors"
                          >
                            <span>{eid}</span>
                            {ev && <span className="text-cyan-500 text-[10px]">({ev.eventType})</span>}
                            <ExternalLink className="h-3 w-3" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Separated Analytical Inferences */}
                {msg.inferences && msg.inferences.length > 0 && (
                  <div className="mt-4 rounded-xl border border-sky-900/60 bg-sky-950/30 p-3 text-xs text-sky-200 font-sans">
                    <strong className="text-sky-400 block mb-1">Analytical Inferences (Non-Conclusive Hypotheses):</strong>
                    <ul className="list-disc list-inside space-y-1">
                      {msg.inferences.map((inf, idx) => (
                        <li key={idx}>{inf}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Declared Gaps / Missing Evidence */}
                {msg.unresolvedGaps && msg.unresolvedGaps.length > 0 && (
                  <div className="mt-3 rounded-xl border border-amber-900/60 bg-amber-950/30 p-3 text-xs text-amber-200 font-sans">
                    <strong className="text-amber-400 block mb-1">Evidentiary Limitations & Missing Data:</strong>
                    <ul className="list-disc list-inside space-y-1">
                      {msg.unresolvedGaps.map((gap, idx) => (
                        <li key={idx}>{gap}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3 text-xs text-cyan-400 font-mono-code p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
            <span>Grounding evidence context & evaluating RAG index...</span>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSend(input);
        }}
        className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4"
      >
        {error && (
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-rose-800/60 bg-rose-950/40 p-2.5 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
            placeholder="Ask a forensic question (e.g. 'What evidence proves exfiltration?' or 'Did r.sharma execute sudo?')..."
            className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl shadow transition-colors disabled:opacity-50 shrink-0"
          >
            <span>Ask</span>
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
