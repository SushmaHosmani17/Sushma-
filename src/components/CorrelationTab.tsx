import React, { useState } from 'react';
import {
  Network,
  Share2,
  Clock,
  User,
  ShieldAlert,
  ArrowRight,
  Info,
  CheckCircle2,
  Layers,
  Sparkles
} from 'lucide-react';
import type { CorrelationGroup, ForensicEvent } from '../types/forensics';

interface CorrelationTabProps {
  correlations: CorrelationGroup[];
  events: ForensicEvent[];
  onSelectEvent: (event: ForensicEvent) => void;
}

export const CorrelationTab: React.FC<CorrelationTabProps> = ({
  correlations,
  events,
  onSelectEvent
}) => {
  const [selectedGroupId, setSelectedGroupId] = useState<string>(
    correlations[0]?.id || ''
  );

  const activeGroup = correlations.find(c => c.id === selectedGroupId) || correlations[0];
  const eventMap = new Map(events.map(e => [e.id, e]));

  return (
    <div className="space-y-6">
      {/* Correlation Engine Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-100 font-display">
              Multi-Source Event Correlation & Relationship Graph
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Heuristic and killchain-based event linkage identifying multi-stage attacks across isolated evidence silos.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-cyan-800/60 bg-cyan-950/40 px-3 py-1.5 text-xs text-cyan-300 font-mono-code">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{correlations.length} Correlated Clusters Identified</span>
          </div>
        </div>

        {/* Legal & Forensic Causation Disclosure */}
        <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-amber-900/60 bg-amber-950/30 p-3 text-xs text-amber-300">
          <Info className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
          <span>
            <strong>Forensic Evidentiary Notice:</strong> Correlation reflects probabilistic temporal proximity, shared identity tokens, or observed trajectory linkage. In strict digital forensics jurisprudence, correlation does not constitute proof of causation without secondary corroborative artifacts.
          </span>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (4 cols): Correlation Groups List */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono-code">
            Correlated Clusters ({correlations.length})
          </h3>

          <div className="space-y-2">
            {correlations.map(group => {
              const isSelected = group.id === selectedGroupId;
              return (
                <button
                  key={group.id}
                  onClick={() => setSelectedGroupId(group.id)}
                  className={`w-full rounded-xl border p-4 text-left transition-all ${
                    isSelected
                      ? 'border-cyan-500 bg-slate-800 text-slate-100 shadow-md'
                      : 'border-slate-800/80 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:bg-slate-900/70'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono-code mb-1">
                    <span className={isSelected ? 'text-cyan-400 font-bold' : ''}>
                      {group.id}
                    </span>
                    <span className="rounded bg-slate-950/80 border border-slate-800 px-2 py-0.5 text-cyan-300 font-bold">
                      {(group.confidenceScore * 100).toFixed(0)}% Confidence
                    </span>
                  </div>

                  <h4 className="text-xs font-semibold text-slate-200 font-display line-clamp-1">
                    {group.title}
                  </h4>

                  <p className="mt-1 text-[11px] text-slate-400 line-clamp-2">
                    {group.explanation}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[10px] font-mono-code text-slate-500 border-t border-slate-800/80 pt-2">
                    <span>{group.eventIds.length} Linked Events</span>
                    <span>Window: {Math.round(group.timeSpanSeconds / 60)} min</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column (8 cols): Selected Cluster Deep Dive & Graph Visualizer */}
        <div className="lg:col-span-8 space-y-6">
          {activeGroup ? (
            <>
              {/* Active Cluster Details Box */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono-code text-cyan-400 mb-1">
                      <span>{activeGroup.id}</span>
                      <span className="text-slate-600">·</span>
                      <span className="uppercase text-slate-300">{activeGroup.method.replace('_', ' ')}</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-100 font-display">
                      {activeGroup.title}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] font-mono-code text-slate-500 block">Calibrated Confidence</span>
                    <span className="text-base font-bold text-cyan-400 font-mono-code">
                      {(activeGroup.confidenceScore * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
                  {activeGroup.explanation}
                </p>

                {/* Shared Attributes & MITRE Technique */}
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono-code">
                  {activeGroup.sharedAttributes.user && (
                    <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-2.5">
                      <span className="text-slate-500 block text-[10px]">Pivot User</span>
                      <span className="text-slate-200">{activeGroup.sharedAttributes.user}</span>
                    </div>
                  )}
                  {activeGroup.sharedAttributes.ip && (
                    <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-2.5">
                      <span className="text-slate-500 block text-[10px]">Pivot IP</span>
                      <span className="text-cyan-400">{activeGroup.sharedAttributes.ip}</span>
                    </div>
                  )}
                  {activeGroup.sharedAttributes.device && (
                    <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-2.5">
                      <span className="text-slate-500 block text-[10px]">Pivot Host</span>
                      <span className="text-slate-200">{activeGroup.sharedAttributes.device}</span>
                    </div>
                  )}
                  <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-2.5">
                    <span className="text-slate-500 block text-[10px]">Cluster Duration</span>
                    <span className="text-slate-200">{Math.round(activeGroup.timeSpanSeconds)} sec</span>
                  </div>
                </div>

                {activeGroup.mitreTechnique && (
                  <div className="mt-3 text-xs font-mono-code text-slate-400">
                    <span className="text-slate-500">ATT&CK Technique Chain: </span>
                    <span className="text-cyan-300">{activeGroup.mitreTechnique}</span>
                  </div>
                )}
              </div>

              {/* Interactive Visual Graph Sequence */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono-code flex items-center gap-2">
                    <Network className="h-4 w-4 text-cyan-400" />
                    <span>Chronological Edge Linkages & Hop Sequence</span>
                  </h4>
                  <span className="text-xs text-slate-500 font-mono-code">
                    {activeGroup.eventIds.length} Nodes · {activeGroup.edges.length} Edges
                  </span>
                </div>

                {/* Graph Sequence Cards */}
                <div className="space-y-4">
                  {activeGroup.edges.map((edge, index) => {
                    const fromEvt = eventMap.get(edge.fromEventId);
                    const toEvt = eventMap.get(edge.toEventId);

                    return (
                      <div
                        key={index}
                        className="rounded-xl border border-slate-800/90 bg-slate-950/60 p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-code border-b border-slate-800/80 pb-2 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-cyan-400">Hop #{index + 1}</span>
                            <span className="text-slate-500">·</span>
                            <span className="text-slate-300 capitalize">{edge.relationship.replace('_', ' ')}</span>
                          </div>
                          <div className="text-slate-400">
                            Δt: <strong className="text-slate-200 font-bold">{edge.timeDeltaSeconds} seconds</strong>
                            {' · '}
                            Confidence: <strong className="text-cyan-300">{(edge.confidence * 100).toFixed(0)}%</strong>
                          </div>
                        </div>

                        {/* From and To Node Badges */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {fromEvt && (
                            <div
                              onClick={() => onSelectEvent(fromEvt)}
                              className="rounded-lg border border-slate-800/80 bg-slate-900/60 p-3 hover:border-cyan-500/50 cursor-pointer transition-colors"
                            >
                              <div className="flex justify-between items-center text-[11px] font-mono-code mb-1">
                                <span className="text-cyan-400 font-semibold">{fromEvt.id}</span>
                                <span className="text-slate-500">{fromEvt.eventType}</span>
                              </div>
                              <p className="text-xs text-slate-200 line-clamp-1">{fromEvt.description}</p>
                              <div className="mt-1 text-[10px] text-slate-500 font-mono-code">
                                {fromEvt.evidenceFileName} · Risk {fromEvt.riskScore}
                              </div>
                            </div>
                          )}

                          {toEvt && (
                            <div
                              onClick={() => onSelectEvent(toEvt)}
                              className="rounded-lg border border-slate-800/80 bg-slate-900/60 p-3 hover:border-cyan-500/50 cursor-pointer transition-colors"
                            >
                              <div className="flex justify-between items-center text-[11px] font-mono-code mb-1">
                                <span className="text-cyan-400 font-semibold">{toEvt.id}</span>
                                <span className="text-slate-500">{toEvt.eventType}</span>
                              </div>
                              <p className="text-xs text-slate-200 line-clamp-1">{toEvt.description}</p>
                              <div className="mt-1 text-[10px] text-slate-500 font-mono-code">
                                {toEvt.evidenceFileName} · Risk {toEvt.riskScore}
                              </div>
                            </div>
                          )}
                        </div>

                        <p className="mt-3 text-xs text-slate-400 font-sans">
                          <strong>Linkage Rationale: </strong>
                          {edge.reason}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-8 text-center text-slate-500">
              No correlation groups available for this investigation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
