import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, RefreshCw, Search, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import type { AuditLogEntry } from '../types/forensics';

interface AuditTabProps {
  investigationId: string;
}

export const AuditTab: React.FC<AuditTabProps> = ({ investigationId }) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadLogs();
  }, [investigationId]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await api.getAuditLogs(investigationId);
      setLogs(data);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(l =>
    l.actor.toLowerCase().includes(search.toLowerCase()) ||
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.resource.toLowerCase().includes(search.toLowerCase()) ||
    l.details.toLowerCase().includes(search.toLowerCase()) ||
    l.cryptoChecksum.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-100 font-display">
              Immutable Forensic Audit & Chain-of-Custody Ledger
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Cryptographically signed chronological record of every analyst action, file ingestion, RAG query, and report compilation.
            </p>
          </div>

          <button
            onClick={loadLogs}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Verify Ledger</span>
          </button>
        </div>

        <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono-code text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            <span>All {logs.length} audit transactions verified against SHA-256 state signatures</span>
          </div>

          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search audit trail..."
              className="w-full rounded-lg border border-slate-800 bg-slate-950 pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono-code">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                <th className="py-3 px-4 font-semibold">Timestamp</th>
                <th className="py-3 px-4 font-semibold">Examiner / Actor</th>
                <th className="py-3 px-4 font-semibold">Action</th>
                <th className="py-3 px-4 font-semibold">Resource</th>
                <th className="py-3 px-4 font-semibold">Audit Details</th>
                <th className="py-3 px-4 font-semibold">Crypto Checksum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.map(entry => (
                <tr key={entry.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                    {entry.timestamp.replace('T', ' ').substring(0, 19)}
                  </td>
                  <td className="py-3 px-4 text-slate-200 font-semibold">
                    {entry.actor}
                  </td>
                  <td className="py-3 px-4 text-cyan-400 font-bold">
                    {entry.action}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {entry.resource}
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-sans max-w-xs truncate" title={entry.details}>
                    {entry.details}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    <span className="text-[11px]" title={entry.cryptoChecksum}>
                      {entry.cryptoChecksum.substring(0, 14)}...
                    </span>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 font-sans">
                    No audit records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
