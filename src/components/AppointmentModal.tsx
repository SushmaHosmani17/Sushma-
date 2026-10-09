import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Building,
  Shield,
  CheckCircle2,
  AlertCircle,
  Database,
  Copy,
  Check,
  Send
} from 'lucide-react';
import { api } from '../services/api';
import type { AppointmentBooking } from '../types/forensics';

interface AppointmentModalProps {
  onClose: () => void;
  onBookingSuccess?: (booking: AppointmentBooking) => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  onClose,
  onBookingSuccess
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [serviceType, setServiceType] = useState('Cyber Forensic Investigations & Incident Response');
  const [preferredDate, setPreferredDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [preferredTime, setPreferredTime] = useState('10:30 AM – 12:00 PM IST');
  const [urgency, setUrgency] = useState<'standard' | 'high_priority' | 'emergency'>('standard');
  const [caseDescription, setCaseDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedResult, setSubmittedResult] = useState<{
    booking: AppointmentBooking;
    savedToSupabase: boolean;
    projectId: string;
    tableMissing: boolean;
    sqlSchemaScript: string;
    message: string;
  } | null>(null);

  const [copiedSql, setCopiedSql] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !preferredDate || !preferredTime) {
      setError('Please fill in all required fields (Name, Email, Date, and Time).');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.bookAppointment({
        full_name: fullName,
        email,
        phone,
        organization,
        service_type: serviceType,
        preferred_date: preferredDate,
        preferred_time: preferredTime,
        investigation_urgency: urgency,
        case_description: caseDescription
      });

      setSubmittedResult({
        booking: response.data,
        savedToSupabase: response.savedToSupabase,
        projectId: response.projectId,
        tableMissing: response.tableMissing,
        sqlSchemaScript: response.sqlSchemaScript,
        message: response.message
      });

      onBookingSuccess?.(response.data);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit appointment booking.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopySql = () => {
    if (submittedResult?.sqlSchemaScript) {
      navigator.clipboard.writeText(submittedResult.sqlSchemaScript);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-950 border border-cyan-800/60 text-cyan-400">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 font-display">
                Schedule Forensic Consultation & Appointment
              </h3>
              <div className="flex items-center gap-2 text-[11px] font-mono-code text-slate-400 mt-0.5">
                <span>Talfor Digital Forensics</span>
                <span aria-hidden="true">·</span>
                <span className="text-cyan-400 flex items-center gap-1">
                  <Database className="h-3 w-3" />
                  Supabase Project: jjsmcsoqcfssaswodubz
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Viewport */}
        <div className="overflow-y-auto p-6">
          {submittedResult ? (
            /* Success confirmation screen */
            <div className="space-y-6">
              <div className="rounded-xl border border-emerald-800/60 bg-emerald-950/30 p-5 text-center">
                <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto mb-2" />
                <h4 className="text-base font-bold text-slate-100 font-display">
                  Appointment Request Successfully Registered!
                </h4>
                <p className="mt-1 text-xs text-slate-300">
                  {submittedResult.message}
                </p>
                <div className="mt-3 inline-block rounded bg-emerald-950 border border-emerald-800 px-3 py-1 font-mono-code text-xs text-emerald-300">
                  Booking Reference: {submittedResult.booking.id}
                </div>
              </div>

              {/* Booking Summary Box */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2 text-xs font-mono-code">
                <div className="flex justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-slate-500">Client Name:</span>
                  <span className="text-slate-200 font-semibold">{submittedResult.booking.full_name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-slate-500">Service:</span>
                  <span className="text-cyan-300">{submittedResult.booking.service_type}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-slate-500">Scheduled Date & Slot:</span>
                  <span className="text-slate-200">{submittedResult.booking.preferred_date} ({submittedResult.booking.preferred_time})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Supabase Backend Status:</span>
                  <span className={submittedResult.savedToSupabase ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                    {submittedResult.savedToSupabase ? '✓ Saved to Supabase Table' : 'Queued (Schema Setup Guide Below)'}
                  </span>
                </div>
              </div>

              {/* Supabase SQL instructions if table has not been created yet */}
              {submittedResult.tableMissing && (
                <div className="rounded-xl border border-cyan-800/60 bg-cyan-950/20 p-4 text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-cyan-300 font-semibold font-display">
                      <Database className="h-4 w-4" />
                      <span>One-Click Supabase Table Setup (Table: &apos;appointments&apos;)</span>
                    </div>
                    <button
                      onClick={handleCopySql}
                      className="inline-flex items-center gap-1 rounded bg-cyan-950 border border-cyan-700 px-2.5 py-1 text-[11px] font-mono-code text-cyan-300 hover:bg-cyan-900 transition-colors"
                    >
                      {copiedSql ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Schema'}</span>
                    </button>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Your appointment was successfully captured! To have incoming bookings automatically sync directly into your Supabase database table, open your Supabase project dashboard (ID: <code className="text-cyan-300">jjsmcsoqcfssaswodubz</code>), navigate to <strong>SQL Editor</strong>, paste this schema, and click <strong>Run</strong>:
                  </p>
                  <pre className="rounded-lg bg-slate-950 p-3 text-[10px] font-mono-code text-cyan-300 overflow-x-auto max-h-36 border border-slate-800">
                    {submittedResult.sqlSchemaScript}
                  </pre>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 rounded-lg border border-rose-800/60 bg-rose-950/40 p-3 text-xs text-rose-300">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Kulkarni"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. ramesh@organization.com"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Contact Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 98XXX XXXXX / +971 XX XXX XXXX"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 font-mono-code placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Company / Legal Organization
                  </label>
                  <input
                    type="text"
                    value={organization}
                    onChange={e => setOrganization(e.target.value)}
                    placeholder="e.g. Legal Firm or Enterprise Name"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Forensic Practice Area / Service Required
                </label>
                <select
                  value={serviceType}
                  onChange={e => setServiceType(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="Cyber Forensic Investigations & Incident Response">
                    Cyber Forensic Investigations & Incident Response
                  </option>
                  <option value="Digital Evidence Timeline Reconstruction">
                    Digital Evidence Timeline Reconstruction & Correlation
                  </option>
                  <option value="Data Recovery Forensics (SSD, RAID, CCTV, Encrypted Volumes)">
                    Data Recovery Forensics (SSD, RAID, CCTV, Encrypted Volumes)
                  </option>
                  <option value="Electronic Data Discovery (EDD) & Legal Litigation Support">
                    Electronic Data Discovery (EDD) & Legal Litigation Support
                  </option>
                  <option value="Mobile Device & Hardware Firmware Forensics">
                    Mobile Device & Hardware Firmware Forensics
                  </option>
                  <option value="Corporate Fraud & Insider Threat Discovery">
                    Corporate Fraud & Insider Threat Discovery
                  </option>
                  <option value="Accredited DFIR Professional Training">
                    Accredited DFIR Professional Training & Workshops
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={preferredDate}
                    onChange={e => setPreferredDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 font-mono-code focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Preferred Time Slot *
                  </label>
                  <select
                    value={preferredTime}
                    onChange={e => setPreferredTime(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none font-mono-code"
                  >
                    <option value="10:00 AM – 11:30 AM IST">Morning: 10:00 AM – 11:30 AM IST</option>
                    <option value="11:30 AM – 01:00 PM IST">Morning: 11:30 AM – 01:00 PM IST</option>
                    <option value="02:30 PM – 04:00 PM IST">Afternoon: 02:30 PM – 04:00 PM IST</option>
                    <option value="04:30 PM – 06:00 PM IST">Evening: 04:30 PM – 06:00 PM IST</option>
                    <option value="Emergency Rapid Dispatch (Immediate)">24/7 Rapid Emergency Dispatch</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Investigation Priority / Urgency
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setUrgency('standard')}
                    className={`rounded-lg border p-2 text-xs text-center transition-all ${
                      urgency === 'standard'
                        ? 'border-cyan-400 bg-cyan-950/60 text-cyan-200 font-semibold'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Standard (1–3 Days)
                  </button>
                  <button
                    type="button"
                    onClick={() => setUrgency('high_priority')}
                    className={`rounded-lg border p-2 text-xs text-center transition-all ${
                      urgency === 'high_priority'
                        ? 'border-amber-400 bg-amber-950/60 text-amber-200 font-semibold'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    High Priority (24 Hrs)
                  </button>
                  <button
                    type="button"
                    onClick={() => setUrgency('emergency')}
                    className={`rounded-lg border p-2 text-xs text-center transition-all ${
                      urgency === 'emergency'
                        ? 'border-rose-400 bg-rose-950/60 text-rose-200 font-semibold'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Active Emergency
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Brief Case Overview / Symptoms Observed
                </label>
                <textarea
                  rows={3}
                  value={caseDescription}
                  onChange={e => setCaseDescription(e.target.value)}
                  placeholder="Describe evidence types (hard drives, server logs, mobile devices, timestamps) or key incident details..."
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <span className="text-[11px] font-mono-code text-cyan-400 flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5" />
                  <span>Confidential & ISO 27037 Compliant</span>
                </span>

                <div className="flex items-center gap-3">
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
                    className="inline-flex items-center justify-center gap-1.5 px-5 py-2 text-xs font-bold uppercase tracking-wider text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow transition-colors disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="h-3 w-3 animate-spin rounded-full border border-slate-950 border-t-transparent" />
                        <span>Connecting to Supabase...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" />
                        <span>Confirm Appointment</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
