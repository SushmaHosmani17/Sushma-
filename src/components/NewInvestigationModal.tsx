import React, { useState } from 'react';
import { X, ShieldPlus, AlertCircle } from 'lucide-react';
import type { PriorityLevel } from '../types/forensics';

interface NewInvestigationModalProps {
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    clientOrganization: string;
    description: string;
    leadInvestigator: string;
    priority: PriorityLevel;
    scope: string;
    tags: string[];
  }) => Promise<void>;
}

export const NewInvestigationModal: React.FC<NewInvestigationModalProps> = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [clientOrganization, setClientOrganization] = useState('');
  const [description, setDescription] = useState('');
  const [leadInvestigator, setLeadInvestigator] = useState('Senior DFIR Specialist (Talfor Labs)');
  const [priority, setPriority] = useState<PriorityLevel>('high');
  const [scope, setScope] = useState('Enterprise Perimeter VPN, Bastion SSH & Core Databases');
  const [tagInput, setTagInput] = useState('Incident-Response, Breach-Investigation');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !clientOrganization.trim()) {
      setError('Please provide a Case Title and Client Organization.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const tags = tagInput.split(',').map(t => t.trim()).filter(Boolean);
      await onSubmit({
        title,
        clientOrganization,
        description,
        leadInvestigator,
        priority,
        scope,
        tags
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to initialize investigation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-950 border border-cyan-800/60 text-cyan-400">
              <ShieldPlus className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 font-display">Initialize New Investigation</h3>
              <p className="text-[11px] text-slate-400">Talfor Digital Forensics Case Docket</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-rose-800/60 bg-rose-950/40 p-3 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Case Investigation Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Unauthorized Cloud Bastion Ingress & Data Exfiltration"
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Client / Organization *
              </label>
              <input
                type="text"
                required
                value={clientOrganization}
                onChange={e => setClientOrganization(e.target.value)}
                placeholder="e.g. Apex Financial Services Pvt Ltd"
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Priority Classification
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as PriorityLevel)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
              >
                <option value="critical">Critical (Active Breach / High Impact)</option>
                <option value="high">High (Privilege Escalation / Data Risk)</option>
                <option value="medium">Medium (Suspicious Anomalies)</option>
                <option value="low">Low (Routine Forensic Audit)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Lead Forensic Investigator
            </label>
            <input
              type="text"
              value={leadInvestigator}
              onChange={e => setLeadInvestigator(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none font-mono-code"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Investigation Scope & Infrastructure
            </label>
            <input
              type="text"
              value={scope}
              onChange={e => setScope(e.target.value)}
              placeholder="e.g. VPC Bastion, Production PostgreSQL clusters, VPN concentrators"
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Brief Incident Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Provide context regarding initial breach discovery, observed symptoms, or containment alerts..."
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Classification Tags (Comma separated)
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              placeholder="e.g. APT29, Exfiltration, SSH-Key-Abuse"
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 font-mono-code focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow transition-colors disabled:opacity-50"
            >
              {loading ? 'Registering Docket...' : 'Create Investigation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
