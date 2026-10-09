import React from 'react';
import {
  ShieldAlert,
  HardDrive,
  Clock,
  Network,
  Activity,
  FileCheck2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Lock,
  User,
  Building
} from 'lucide-react';
import type { Investigation, ForensicEvent, CorrelationGroup, SuspiciousAlert } from '../types/forensics';

interface OverviewTabProps {
  investigation: Investigation;
  events: ForensicEvent[];
  correlations: CorrelationGroup[];
  alerts: SuspiciousAlert[];
  onNavigateTab: (tab: string) => void;
  onSelectEvent: (event: ForensicEvent) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  investigation,
  events,
  correlations,
  alerts,
  onNavigateTab,
  onSelectEvent
}) => {
  const criticalAlerts = alerts.filter(a => a.severity === 'critical');
  const recentEvents = [...events].reverse().slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Case Header Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-code text-cyan-400 mb-1">
              <span>{investigation.caseNumber}</span>
              <span className="text-slate-500">·</span>
              <span className="capitalize text-slate-300 font-semibold">{investigation.status.replace('_', ' ')}</span>
              <span className="text-slate-500">·</span>
              <span className="text-rose-400 uppercase font-bold">{investigation.priority} PRIORITY</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100 font-display">
              {investigation.title}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
              {investigation.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateTab('ai-assistant')}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Ask AI Assistant</span>
            </button>
            <button
              onClick={() => onNavigateTab('reports')}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-300 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <FileCheck2 className="h-3.5 w-3.5" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Case Scope & Entities Strip */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono-code">
          <div className="flex items-center gap-2 text-slate-400">
            <Building className="h-4 w-4 text-cyan-400 shrink-0" />
            <span>Target Organization: <strong className="text-slate-200">{investigation.clientOrganization}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <User className="h-4 w-4 text-cyan-400 shrink-0" />
            <span>Lead Examiner: <strong className="text-slate-200">{investigation.leadInvestigator}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Lock className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Integrity: <strong className="text-emerald-400">ISO/IEC 27037 Verified</strong></span>
          </div>
        </div>
      </div>

      {/* Primary Verified Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Evidence Items */}
        <div
          onClick={() => onNavigateTab('evidence')}
          className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 hover:border-slate-700 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 font-display">Evidence Items</span>
            <HardDrive className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-100 font-mono-code">
              {investigation.evidenceCount}
            </span>
            <span className="text-[11px] text-slate-500 font-mono-code">Containers</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Cryptographic SHA-256 sealed
          </p>
        </div>

        {/* Metric 2: Events Identified */}
        <div
          onClick={() => onNavigateTab('timeline')}
          className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 hover:border-slate-700 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 font-display">Events Identified</span>
            <Clock className="h-4 w-4 text-sky-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-100 font-mono-code">
              {events.length}
            </span>
            <span className="text-[11px] text-slate-500 font-mono-code">Reconstructed</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Monotonic UTC normalized
          </p>
        </div>

        {/* Metric 3: Suspicious Events */}
        <div
          onClick={() => onNavigateTab('suspicious')}
          className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 hover:border-slate-700 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 font-display">Suspicious Events</span>
            <AlertTriangle className="h-4 w-4 text-rose-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-rose-400 font-mono-code">
              {alerts.length}
            </span>
            <span className="text-[11px] text-rose-400/80 font-mono-code font-bold">
              ({criticalAlerts.length} Critical)
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Rule-based & heuristic alerts
          </p>
        </div>

        {/* Metric 4: Correlated Event Groups */}
        <div
          onClick={() => onNavigateTab('correlation')}
          className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 hover:border-slate-700 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 font-display">Correlated Groups</span>
            <Network className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-100 font-mono-code">
              {correlations.length}
            </span>
            <span className="text-[11px] text-slate-500 font-mono-code">Sequences</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Multi-source linkage graph
          </p>
        </div>
      </div>

      {/* Main Split: Threat Radar Alerts & Recent Timeline Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): High-Priority Suspicious Activity Findings */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/40 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-rose-400" />
                <h3 className="text-sm font-bold text-slate-100 font-display">
                  Active Suspicious Indicators & Alerts
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('suspicious')}
                className="text-xs text-cyan-400 hover:underline font-mono-code"
              >
                View all ({alerts.length})
              </button>
            </div>

            <div className="space-y-3">
              {alerts.slice(0, 3).map(alert => (
                <div
                  key={alert.id}
                  className="rounded-xl border border-slate-800/90 bg-slate-950/50 p-4 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${
                        alert.severity === 'critical' ? 'bg-rose-500' : 'bg-amber-500'
                      }`} />
                      <div>
                        <h4 className="text-xs font-semibold text-slate-100 font-display">
                          {alert.title}
                        </h4>
                        <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                          {alert.rationale}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono-code text-[11px] uppercase tracking-wider text-rose-300 shrink-0 bg-rose-950/60 border border-rose-900/60 px-2 py-0.5 rounded">
                      {alert.severity}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-slate-900 pt-2 text-[11px] font-mono-code text-slate-500">
                    <span>Rule: {alert.ruleId}</span>
                    <span>Supporting: {alert.supportingEventIds.join(', ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
            <button
              onClick={() => onNavigateTab('suspicious')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
            >
              <span>Examine Anomaly Detection Engine</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column (5 cols): Recent Chronological Events */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/40 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-100 font-display">
                  Recent Reconstructed Events
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('timeline')}
                className="text-xs text-cyan-400 hover:underline font-mono-code"
              >
                Inspect Timeline
              </button>
            </div>

            <div className="space-y-2.5">
              {recentEvents.map(evt => (
                <div
                  key={evt.id}
                  onClick={() => onSelectEvent(evt)}
                  className="rounded-lg border border-slate-800/80 bg-slate-950/40 p-3 hover:border-cyan-500/50 hover:bg-slate-900/60 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono-code">
                    <span className="font-semibold text-cyan-400">{evt.id}</span>
                    <span className="text-slate-500">{evt.timestampUtc.split('T')[1].substring(0, 8)} UTC</span>
                  </div>
                  <div className="mt-1 text-xs text-slate-200 line-clamp-1 font-medium">
                    {evt.description}
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono-code">
                    <span>User: {evt.entityUser}</span>
                    <span className={evt.riskScore >= 80 ? 'text-rose-400 font-bold' : evt.riskScore >= 60 ? 'text-amber-400' : 'text-slate-500'}>
                      Risk {evt.riskScore}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
            <button
              onClick={() => onNavigateTab('timeline')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
            >
              <span>Open Full Interactive Timeline</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
