import React, { useState } from 'react';
import {
  Clock,
  Filter,
  Search,
  ArrowUpDown,
  AlertTriangle,
  FileText,
  User,
  Shield,
  ExternalLink,
  SlidersHorizontal,
  Layers,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import type { ForensicEvent } from '../types/forensics';

interface TimelineTabProps {
  events: ForensicEvent[];
  onSelectEvent: (event: ForensicEvent) => void;
  investigationId: string;
}

export const TimelineTab: React.FC<TimelineTabProps> = ({
  events,
  onSelectEvent
}) => {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [minRisk, setMinRisk] = useState<number>(0);
  const [sortAsc, setSortAsc] = useState(true);
  const [compareMode, setCompareMode] = useState(false);
  const [comparedEvents, setComparedEvents] = useState<ForensicEvent[]>([]);

  // Filter logic
  const filteredEvents = events.filter(e => {
    if (selectedType !== 'all' && e.eventType !== selectedType) return false;
    if (e.riskScore < minRisk) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        e.id.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.entityUser.toLowerCase().includes(q) ||
        e.evidenceFileName.toLowerCase().includes(q) ||
        (e.sourceIp && e.sourceIp.includes(q)) ||
        (e.destIp && e.destIp.includes(q));
      if (!match) return false;
    }
    return true;
  });

  // Sort logic
  filteredEvents.sort((a, b) => {
    const timeA = new Date(a.timestampUtc).getTime();
    const timeB = new Date(b.timestampUtc).getTime();
    return sortAsc ? timeA - timeB : timeB - timeA;
  });

  const toggleCompare = (event: ForensicEvent) => {
    if (comparedEvents.some(e => e.id === event.id)) {
      setComparedEvents(comparedEvents.filter(e => e.id !== event.id));
    } else {
      if (comparedEvents.length >= 2) {
        setComparedEvents([comparedEvents[1], event]);
      } else {
        setComparedEvents([...comparedEvents, event]);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Timeline Controls Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-100 font-display">
              Chronological Timeline Reconstruction Engine
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Synchronized multi-source chronological sequence normalized to high-precision UTC with observed local offsets.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCompareMode(!compareMode)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                compareMode
                  ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300'
                  : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {compareMode ? 'Exit Compare Mode' : 'Compare Events Mode'}
            </button>
            <button
              onClick={() => setSortAsc(!sortAsc)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              <span>{sortAsc ? 'Oldest First' : 'Newest First'}</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter events, users, IPs..."
              className="w-full rounded-lg border border-slate-800 bg-slate-950 pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Event Type Filter */}
          <div>
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
            >
              <option value="all">All Forensic Event Types</option>
              <option value="auth_failed">Authentication Failures</option>
              <option value="auth_success">Authentication Successes</option>
              <option value="privilege_escalation">Privilege Escalations</option>
              <option value="file_accessed">File Access Operations</option>
              <option value="file_modified">File Modifications / Deletions</option>
              <option value="data_exfiltration">Data Exfiltration & Egress</option>
              <option value="process_execution">Process Executions</option>
              <option value="network_outbound">Network Outbound Connections</option>
              <option value="usb_connected">Removable Media / USB</option>
            </select>
          </div>

          {/* Min Risk Score Filter */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-xs text-slate-300">
            <span className="text-slate-500 whitespace-nowrap text-[11px]">Min Risk:</span>
            <input
              type="range"
              min="0"
              max="90"
              step="10"
              value={minRisk}
              onChange={e => setMinRisk(parseInt(e.target.value, 10))}
              className="w-full accent-cyan-400"
            />
            <span className="font-mono-code font-bold text-cyan-400 w-8 text-right">{minRisk}+</span>
          </div>

          {/* Event count status */}
          <div className="flex items-center justify-between px-3 py-2 rounded-lg border border-slate-800 bg-slate-950/60 text-xs font-mono-code text-slate-400">
            <span>Showing:</span>
            <span className="text-slate-100 font-bold">
              {filteredEvents.length} / {events.length} Events
            </span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Event Comparison Banner (if active) */}
      {compareMode && (
        <div className="rounded-2xl border border-cyan-800/80 bg-cyan-950/20 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300 font-mono-code">
              Cross-Source Event Comparison ({comparedEvents.length}/2 Selected)
            </h3>
            {comparedEvents.length > 0 && (
              <button
                onClick={() => setComparedEvents([])}
                className="text-xs text-slate-400 hover:text-slate-200 underline"
              >
                Clear Selection
              </button>
            )}
          </div>

          {comparedEvents.length === 0 ? (
            <p className="text-xs text-slate-400">
              Click the checkbox next to any two events in the timeline below to inspect their time differential, attributes, and provenance side by side.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {comparedEvents.map(evt => (
                <div key={evt.id} className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs font-mono-code">
                  <div className="flex justify-between items-center text-cyan-400 font-bold mb-1">
                    <span>{evt.id}</span>
                    <span>Risk {evt.riskScore}</span>
                  </div>
                  <p className="text-slate-200 font-sans text-xs mb-2">{evt.description}</p>
                  <div className="space-y-1 text-slate-400 text-[11px]">
                    <div>UTC: <span className="text-slate-200">{evt.timestampUtc}</span></div>
                    <div>Source: <span className="text-slate-200">{evt.evidenceFileName}</span></div>
                    <div>User: <span className="text-slate-200">{evt.entityUser}</span></div>
                    <div>Device: <span className="text-slate-200">{evt.entityDevice}</span></div>
                    {evt.sourceIp && <div>Source IP: <span className="text-cyan-300">{evt.sourceIp}</span></div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reconstructed Chronological Event Stream */}
      <div className="relative border-l-2 border-slate-800 ml-4 sm:ml-8 pl-6 sm:pl-8 space-y-6">
        {filteredEvents.map(event => {
          const isCompared = comparedEvents.some(e => e.id === event.id);

          return (
            <div
              key={event.id}
              className="relative group transition-all"
            >
              {/* Timeline Node Pip */}
              <div
                className={`absolute -left-[31px] sm:-left-[39px] top-4 h-4 w-4 rounded-full border-2 transition-all ${
                  event.riskScore >= 80
                    ? 'border-rose-500 bg-rose-950'
                    : event.riskScore >= 60
                    ? 'border-amber-500 bg-amber-950'
                    : 'border-cyan-500 bg-slate-950'
                }`}
              />

              {/* Event Card */}
              <div
                className={`rounded-xl border p-4 sm:p-5 transition-all bg-slate-900/40 hover:bg-slate-900/70 ${
                  isCompared
                    ? 'border-cyan-500 ring-1 ring-cyan-500/50'
                    : event.isSuspicious
                    ? 'border-rose-900/60 hover:border-rose-700/80'
                    : 'border-slate-800/90 hover:border-slate-700'
                }`}
              >
                {/* Header row */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {compareMode && (
                      <input
                        type="checkbox"
                        checked={isCompared}
                        onChange={() => toggleCompare(event)}
                        className="mr-1 accent-cyan-400 rounded h-3.5 w-3.5"
                      />
                    )}
                    <span className="font-mono-code text-xs font-bold text-cyan-400">
                      {event.id}
                    </span>
                    <span className="text-slate-600">/</span>
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-300 font-mono-code uppercase">
                      {event.eventType.replace('_', ' ')}
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="text-xs text-slate-400 font-mono-code">
                      {event.evidenceFileName}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`font-mono-code text-xs font-bold px-2 py-0.5 rounded ${
                      event.riskScore >= 80
                        ? 'bg-rose-950/70 text-rose-300 border border-rose-800/60'
                        : event.riskScore >= 60
                        ? 'bg-amber-950/70 text-amber-300 border border-amber-800/60'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      Risk {event.riskScore}
                    </span>

                    <button
                      onClick={() => onSelectEvent(event)}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-1"
                    >
                      <span>Inspect</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Event Description */}
                <p className="mt-2.5 text-sm font-medium text-slate-100 leading-relaxed font-sans">
                  {event.description}
                </p>

                {/* Timestamp & Provenance Details */}
                <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-slate-400 font-mono-code border-t border-slate-800/80 pt-3">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-cyan-400" />
                    <span className="text-slate-200">{event.timestampUtc}</span>
                    <span className="text-slate-500">(UTC)</span>
                  </div>

                  <div>
                    <span className="text-slate-500">Observed: </span>
                    <span className="text-slate-300">{event.timestampLocal}</span>
                  </div>

                  <div>
                    <span className="text-slate-500">User: </span>
                    <span className="text-slate-200">{event.entityUser}</span>
                  </div>

                  <div>
                    <span className="text-slate-500">Device: </span>
                    <span className="text-slate-200">{event.entityDevice}</span>
                  </div>

                  {event.sourceIp && (
                    <div>
                      <span className="text-slate-500">IP: </span>
                      <span className="text-cyan-400">{event.sourceIp}</span>
                    </div>
                  )}

                  {event.mitreTechniqueId && (
                    <div>
                      <span className="text-slate-500">MITRE: </span>
                      <span className="text-slate-300">{event.mitreTechniqueId}</span>
                    </div>
                  )}
                </div>

                {/* Correction or Suspicious Rule Notice */}
                {event.hasTimestampCorrection && (
                  <div className="mt-2 text-[11px] text-amber-300 font-mono-code">
                    Timestamp normalized from unstructured record string: &quot;{event.originalTimestampStr}&quot;
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredEvents.length === 0 && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-8 text-center text-slate-500">
            No events match the selected filter criteria. Try resetting the risk score or search query.
          </div>
        )}
      </div>
    </div>
  );
};
