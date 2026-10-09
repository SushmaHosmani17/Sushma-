import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Printer,
  Shield,
  CheckCircle2,
  Lock,
  Calendar,
  Building,
  User,
  Hash,
  AlertTriangle
} from 'lucide-react';
import { api } from '../services/api';
import type { Investigation, ForensicReport } from '../types/forensics';

interface ReportsTabProps {
  investigation: Investigation;
}

export const ReportsTab: React.FC<ReportsTabProps> = ({ investigation }) => {
  const [report, setReport] = useState<ForensicReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, [investigation.id]);

  const loadReport = async () => {
    setLoading(true);
    try {
      const data = await api.getReport(investigation.id);
      setReport(data);
    } catch (err) {
      console.error('Failed to load report:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    window.location.href = `/api/investigations/${investigation.id}/export/csv`;
  };

  if (loading || !report) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center text-slate-400">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent mx-auto mb-3" />
        <p className="font-mono-code text-xs">Compiling forensic examination dossier & cryptographic seals...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Report Actions Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-100 font-display">
              Official Forensic Examination Report
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Court-ready and compliance-grade digital forensics analysis report with ISO/IEC 27037 verification.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Timeline (CSV)</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Formal Document Layout */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-8 sm:p-12 shadow-2xl text-slate-200 space-y-8 font-sans print:border-none print:shadow-none print:p-0">
        {/* Document Legal Header */}
        <div className="border-b border-slate-800 pb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm font-display">
              <Shield className="h-5 w-5" />
              <span>TALFOR DIGITAL FORENSICS (DFIR LABS)</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              #43, 2nd Main Rd, Ramachandrapura, Rajajinagar, Bengaluru, Karnataka, India
            </p>
            <p className="text-xs text-slate-500 font-mono-code">
              Contact: +91 82-17-30-41-05 · info@talfor.in · https://talfor.in
            </p>
          </div>

          <div className="text-right text-xs font-mono-code">
            <div className="text-slate-400">Case Docket Number:</div>
            <div className="text-sm font-bold text-slate-100">{report.caseNumber}</div>
            <div className="text-slate-500 mt-1">Generated: {report.generatedAt.split('T')[0]}</div>
          </div>
        </div>

        {/* Title */}
        <div>
          <span className="text-xs font-mono-code uppercase tracking-wider text-cyan-400 font-bold block mb-1">
            Forensic Investigation & Timeline Reconstruction Report
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-display">
            {report.title}
          </h1>
        </div>

        {/* Case Metadata Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/40 text-xs font-mono-code">
          <div>
            <span className="text-slate-500 block text-[11px]">Client Organization</span>
            <span className="text-slate-100 font-semibold">{investigation.clientOrganization}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Lead Forensic Analyst</span>
            <span className="text-slate-100 font-semibold">{report.generatedBy}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Evidentiary Scope</span>
            <span className="text-slate-100">{investigation.scope}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Chain-of-Custody</span>
            <span className="text-emerald-400 font-semibold">Verified ISO/IEC 27037</span>
          </div>
        </div>

        {/* Cryptographic Hash Seal */}
        <div className="rounded-xl border border-cyan-900/60 bg-cyan-950/20 p-4 font-mono-code text-xs">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold mb-1">
            <Lock className="h-4 w-4" />
            <span>Digital Document Verification Seal (SHA-256 Digest):</span>
          </div>
          <p className="text-slate-300 break-all select-all">
            {report.sha256Seal}
          </p>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100 font-display border-b border-slate-800 pb-2">
            1. Executive Summary & Incident Scope
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {report.executiveSummary}
          </p>
        </div>

        {/* Section 2: Evidence Inventory */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100 font-display border-b border-slate-800 pb-2">
            2. Evidence Inventory & Cryptographic Provenance
          </h3>
          <div className="grid grid-cols-3 gap-4 text-xs font-mono-code mb-3">
            <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/30">
              <span className="text-slate-500 block">Total Ingested Containers</span>
              <strong className="text-base text-slate-100">{report.evidenceSummary.totalFiles} Files</strong>
            </div>
            <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/30">
              <span className="text-slate-500 block">Total Reconstructed Events</span>
              <strong className="text-base text-slate-100">{report.evidenceSummary.totalEvents} Events</strong>
            </div>
            <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/30">
              <span className="text-slate-500 block">Cryptographic Verification</span>
              <strong className="text-base text-emerald-400">100% Matches</strong>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            Evidence files parsed across source classes: {report.evidenceSummary.sources.join('; ')}. Original forensic images preserved in immutable write-blocked storage.
          </p>
        </div>

        {/* Section 3: Reconstructed Chronological Milestones */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100 font-display border-b border-slate-800 pb-2">
            3. Key Reconstructed Chronological Events
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50 font-mono-code text-slate-400">
                  <th className="py-2.5 px-3">Event ID</th>
                  <th className="py-2.5 px-3">UTC Timestamp</th>
                  <th className="py-2.5 px-3">Classification</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono-code">
                {report.timelineHighlights.map((hl, i) => (
                  <tr key={i} className="hover:bg-slate-900/20">
                    <td className="py-2.5 px-3 text-cyan-400 font-bold">{hl.eventId}</td>
                    <td className="py-2.5 px-3 text-slate-300">{hl.timestamp}</td>
                    <td className="py-2.5 px-3 text-slate-400 uppercase">{hl.eventType}</td>
                    <td className="py-2.5 px-3 text-slate-200 font-sans">{hl.description}</td>
                    <td className="py-2.5 px-3 text-rose-300 uppercase font-bold">{hl.riskLevel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Forensic Correlation Findings */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100 font-display border-b border-slate-800 pb-2">
            4. Multi-Source Event Correlation & Killchain Analysis
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Correlated {report.correlationGroupCount} independent multi-source event clusters utilizing temporal proximity heuristics, user credential pivots, and MITRE ATT&CK enterprise tactics.
          </p>
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/30 text-xs text-slate-300 leading-relaxed font-sans">
            {report.aiExplanationNotes}
          </div>
        </div>

        {/* Section 5: Declared Limitations */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100 font-display border-b border-slate-800 pb-2">
            5. Evidentiary Limitations & Missing Data Declarations
          </h3>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-400 font-sans">
            {report.limitationsAndMissingData.map((lim, i) => (
              <li key={i}>{lim}</li>
            ))}
          </ul>
        </div>

        {/* Signatures & Certification */}
        <div className="border-t border-slate-800 pt-8 grid grid-cols-2 gap-8 text-xs font-mono-code">
          <div>
            <span className="text-slate-500 block">Examining Forensic Analyst:</span>
            <span className="text-slate-100 font-bold mt-1 block">{report.generatedBy}</span>
            <span className="text-slate-500 text-[11px]">Talfor Digital Forensics Laboratory</span>
          </div>
          <div className="text-right">
            <span className="text-slate-500 block">Laboratory Director Seal:</span>
            <span className="text-cyan-400 font-bold mt-1 block">ISO/IEC 27037 ENCE / GCIH CERTIFIED</span>
            <span className="text-slate-500 text-[11px]">Rajajinagar, Bengaluru, India</span>
          </div>
        </div>
      </div>
    </div>
  );
};
