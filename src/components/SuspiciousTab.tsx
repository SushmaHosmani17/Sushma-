import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Clock,
  ExternalLink,
  SlidersHorizontal,
  FileText,
  UserCheck,
  ShieldCheck,
  Info
} from 'lucide-react';
import type { SuspiciousAlert, ForensicEvent, PriorityLevel } from '../types/forensics';

interface SuspiciousTabProps {
  alerts: SuspiciousAlert[];
  events: ForensicEvent[];
  investigationId: string;
  onUpdateAlertStatus: (alertId: string, status: string, note?: string) => Promise<void>;
  onSelectEvent: (event: ForensicEvent) => void;
}

export const SuspiciousTab: React.FC<SuspiciousTabProps> = ({
  alerts,
  events,
  onUpdateAlertStatus,
  onSelectEvent
}) => {
  const [severityFilter, setSeverityFilter] = useState<'all' | PriorityLevel>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingAlertId, setUpdatingAlertId] = useState<string | null>(null);

  const eventMap = new Map(events.map(e => [e.id, e]));

  const filteredAlerts = alerts.filter(a => {
    if (severityFilter !== 'all' && a.severity !== severityFilter) return false;
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    return true;
  });

  const handleStatusChange = async (alertId: string, newStatus: string) => {
    setUpdatingAlertId(alertId);
    try {
      await onUpdateAlertStatus(alertId, newStatus);
    } finally {
      setUpdatingAlertId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-100 font-display">
              Suspicious Event Detection Radar
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Heuristic, statistical, and rule-based anomaly detection engines mapped against adversary intrusion techniques.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded bg-rose-950/60 border border-rose-800/60 px-3 py-1 text-xs font-bold text-rose-300 font-mono-code">
              {alerts.filter(a => a.severity === 'critical').length} Critical Threats
            </span>
            <span className="rounded bg-amber-950/60 border border-amber-800/60 px-3 py-1 text-xs font-bold text-amber-300 font-mono-code">
              {alerts.filter(a => a.severity === 'high').length} High Alerts
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap gap-4 text-xs font-mono-code">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Severity:</span>
            <select
              value={severityFilter}
              onChange={e => setSeverityFilter(e.target.value as any)}
              className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">Review Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed_adversary">Confirmed Adversary</option>
              <option value="under_investigation">Under Investigation</option>
              <option value="benign_activity">Benign / False Positive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="space-y-4">
        {filteredAlerts.map(alert => (
          <div
            key={alert.id}
            className={`rounded-2xl border p-5 sm:p-6 transition-all ${
              alert.severity === 'critical'
                ? 'border-rose-900/80 bg-slate-900/60'
                : 'border-slate-800 bg-slate-900/40'
            }`}
          >
            {/* Top row */}
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono-code mb-1">
                  <span className="font-bold text-rose-400">{alert.id}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400">{alert.ruleId}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400">{alert.detectedAt.split('T')[0]}</span>
                </div>
                <h3 className="text-base font-bold text-slate-100 font-display">
                  {alert.title}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded text-xs font-bold font-mono-code uppercase tracking-wider ${
                  alert.severity === 'critical'
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}>
                  {alert.severity} SEVERITY
                </span>

                {/* Status Dropdown */}
                <select
                  disabled={updatingAlertId === alert.id}
                  value={alert.status}
                  onChange={e => handleStatusChange(alert.id, e.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1 text-xs text-slate-200 font-mono-code focus:outline-none"
                >
                  <option value="under_investigation">Under Investigation</option>
                  <option value="confirmed_adversary">Confirmed Adversary</option>
                  <option value="benign_activity">Benign / Whitelisted</option>
                </select>
              </div>
            </div>

            {/* Rationale description */}
            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {alert.rationale}
            </p>

            {/* Remediation Advisory */}
            {alert.remediationStep && (
              <div className="mt-4 rounded-xl border border-slate-800/90 bg-slate-950/70 p-3 text-xs text-cyan-300 font-sans">
                <strong className="text-cyan-400 block mb-0.5">Recommended Containment Action:</strong>
                {alert.remediationStep}
              </div>
            )}

            {/* Supporting Event Nodes */}
            <div className="mt-4 pt-4 border-t border-slate-800/80">
              <span className="text-xs font-semibold text-slate-400 block mb-2 font-mono-code">
                Supporting Evidence Events ({alert.supportingEventIds.length} Linked Nodes):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {alert.supportingEventIds.map(eid => {
                  const ev = eventMap.get(eid);
                  if (!ev) {
                    return (
                      <div key={eid} className="rounded-lg border border-slate-800 bg-slate-950/40 p-2.5 text-xs text-slate-500 font-mono-code">
                        Event {eid} (Indexed in Case Storage)
                      </div>
                    );
                  }
                  return (
                    <div
                      key={eid}
                      onClick={() => onSelectEvent(ev)}
                      className="rounded-lg border border-slate-800 bg-slate-950/60 p-2.5 hover:border-cyan-500/60 cursor-pointer transition-colors"
                    >
                      <div className="flex justify-between items-center text-[11px] font-mono-code mb-1">
                        <span className="text-cyan-400 font-bold">{ev.id}</span>
                        <span className="text-slate-500">{ev.eventType}</span>
                      </div>
                      <p className="text-xs text-slate-200 line-clamp-1">{ev.description}</p>
                      <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500 font-mono-code">
                        <span>{ev.entityUser}</span>
                        <span className="text-rose-400 font-bold">Risk {ev.riskScore}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}

        {filteredAlerts.length === 0 && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-8 text-center text-slate-500">
            No alerts found matching the current filter options.
          </div>
        )}
      </div>
    </div>
  );
};
