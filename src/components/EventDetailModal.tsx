import React from 'react';
import { X, Shield, Clock, HardDrive, User, Globe, AlertTriangle, Hash, FileCode } from 'lucide-react';
import type { ForensicEvent } from '../types/forensics';

interface EventDetailModalProps {
  event: ForensicEvent | null;
  onClose: () => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({ event, onClose }) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <span className="font-mono-code font-bold text-cyan-400 text-sm">{event.id}</span>
            <span className="text-slate-500">/</span>
            <span className="font-semibold text-slate-100 text-sm font-display">{event.eventType}</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Main Description & Risk Indicator */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm font-medium text-slate-100 leading-relaxed">
                {event.description}
              </p>
              <div className="shrink-0 text-right">
                <span className="text-[11px] font-mono-code text-slate-500 block">Risk Score</span>
                <span className={`inline-block font-mono-code text-sm font-bold ${
                  event.riskScore >= 80 ? 'text-rose-400' : event.riskScore >= 60 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {event.riskScore} / 100
                </span>
              </div>
            </div>

            {event.isSuspicious && event.suspiciousRule && (
              <div className="mt-3 flex items-center gap-2 text-xs text-rose-300 bg-rose-950/40 border border-rose-900/60 rounded-lg p-2 font-mono-code">
                <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
                <span>Detection Rule Flag: {event.suspiciousRule}</span>
              </div>
            )}
          </div>

          {/* Timestamp Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
                <Clock className="h-3.5 w-3.5 text-cyan-400" />
                <span>Normalized UTC Timestamp</span>
              </div>
              <p className="font-mono-code text-xs text-slate-200">{event.timestampUtc}</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>Observed Local Timestamp</span>
              </div>
              <p className="font-mono-code text-xs text-slate-200">
                {event.timestampLocal} ({event.timezone})
              </p>
            </div>
          </div>

          {event.hasTimestampCorrection && (
            <div className="text-xs text-amber-300 bg-amber-950/30 border border-amber-900/50 rounded-lg p-3">
              <span className="font-semibold block">Timestamp Correction Notice:</span>
              <span>{event.timestampCorrectionNote || 'Original log timestamp lacked verified timezone offset; normalized according to evidence container configuration.'}</span>
            </div>
          )}

          {/* Forensic Entities */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono-code">
            <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
              <span className="text-slate-500 block text-[11px]">User Account</span>
              <span className="text-slate-200 font-semibold">{event.entityUser}</span>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
              <span className="text-slate-500 block text-[11px]">Device Host</span>
              <span className="text-slate-200 font-semibold">{event.entityDevice}</span>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
              <span className="text-slate-500 block text-[11px]">Source Classification</span>
              <span className="text-slate-200">{event.sourceClassification}</span>
            </div>
            {event.sourceIp && (
              <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
                <span className="text-slate-500 block text-[11px]">Source IP</span>
                <span className="text-cyan-400 font-semibold">{event.sourceIp}</span>
              </div>
            )}
            {event.destIp && (
              <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
                <span className="text-slate-500 block text-[11px]">Destination IP</span>
                <span className="text-cyan-400 font-semibold">{event.destIp}</span>
              </div>
            )}
            {event.port && (
              <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
                <span className="text-slate-500 block text-[11px]">Port</span>
                <span className="text-slate-200">{event.port}</span>
              </div>
            )}
          </div>

          {/* MITRE Mapping */}
          {event.mitreTechniqueId && (
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3.5 text-xs">
              <span className="text-slate-400 block font-semibold mb-1">MITRE ATT&CK Mapping</span>
              <div className="flex items-center gap-3 font-mono-code">
                <span className="text-cyan-400 font-bold">{event.mitreTechniqueId}</span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-300">{event.mitreTactic || 'Execution'}</span>
              </div>
            </div>
          )}

          {/* Raw Forensic Attributes & JSON */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <FileCode className="h-3.5 w-3.5" />
                <span>Extracted Event Attributes</span>
              </span>
              <span className="text-[11px] font-mono-code text-slate-500">
                Container: {event.evidenceFileName}
              </span>
            </div>
            <pre className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-[11px] font-mono-code text-cyan-300 overflow-x-auto">
              {JSON.stringify(event.attributes, null, 2)}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 px-6 py-3 bg-slate-950/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-slate-100 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
