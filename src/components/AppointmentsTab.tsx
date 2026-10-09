import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  User,
  Building,
  Mail,
  Phone,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Plus,
  Database,
  Search,
  Copy,
  Check,
  Shield,
  ExternalLink
} from 'lucide-react';
import { api } from '../services/api';
import type { AppointmentBooking } from '../types/forensics';

interface AppointmentsTabProps {
  onOpenBookModal: () => void;
}

export const AppointmentsTab: React.FC<AppointmentsTabProps> = ({ onOpenBookModal }) => {
  const [appointments, setAppointments] = useState<AppointmentBooking[]>([]);
  const [supabaseStatus, setSupabaseStatus] = useState<{
    projectId: string;
    supabaseUrl: string;
    connected: boolean;
    tableExists: boolean;
    sqlSchemaScript: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [copiedSql, setCopiedSql] = useState(false);
  const [showSqlGuide, setShowSqlGuide] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statusData, bookingsData] = await Promise.all([
        api.getSupabaseStatus(),
        api.getAppointments()
      ]);
      setSupabaseStatus(statusData);
      setAppointments(bookingsData);
    } catch (err) {
      console.error('Failed to load appointments or Supabase status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.updateAppointmentStatus(id, newStatus);
      setAppointments(prev =>
        prev.map(a => (a.id === id ? { ...a, status: newStatus as any } : a))
      );
    } catch (err) {
      console.error('Failed to update appointment status:', err);
    }
  };

  const handleCopySql = () => {
    if (supabaseStatus?.sqlSchemaScript) {
      navigator.clipboard.writeText(supabaseStatus.sqlSchemaScript);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2500);
    }
  };

  const filtered = appointments.filter(a => {
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        a.full_name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        (a.organization && a.organization.toLowerCase().includes(q)) ||
        a.service_type.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-code text-cyan-400 mb-1">
              <Database className="h-4 w-4" />
              <span>Supabase Backend: Project {supabaseStatus?.projectId || 'jjsmcsoqcfssaswodubz'}</span>
              <span className="text-slate-600">·</span>
              <span className="text-emerald-400 font-semibold">Live Integration Active</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-100 font-display">
              Forensic Consultations & Appointment Dockets
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              All submitted consultation requests from the booking form are synced directly to your Supabase PostgreSQL database.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSqlGuide(!showSqlGuide)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 hover:bg-cyan-900/40 rounded-lg transition-colors font-mono-code"
            >
              <Database className="h-3.5 w-3.5" />
              <span>{showSqlGuide ? 'Hide Schema Guide' : 'Supabase SQL Setup'}</span>
            </button>

            <button
              onClick={loadData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Refresh</span>
            </button>

            <button
              onClick={onOpenBookModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>

        {/* Supabase Schema Guide Collapsible */}
        {showSqlGuide && supabaseStatus && (
          <div className="mt-6 pt-5 border-t border-slate-800/80 rounded-xl bg-slate-950/80 p-5 border border-cyan-800/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold font-display text-cyan-300">
                <Database className="h-4 w-4" />
                <span>Supabase PostgreSQL Schema (Table: &apos;public.appointments&apos;)</span>
              </div>
              <button
                onClick={handleCopySql}
                className="inline-flex items-center gap-1.5 rounded bg-cyan-950 border border-cyan-700 px-3 py-1 text-xs font-mono-code text-cyan-300 hover:bg-cyan-900 transition-colors"
              >
                {copiedSql ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedSql ? 'Copied SQL!' : 'Copy SQL Schema'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Run this in your Supabase SQL Editor for Project ID <strong className="text-slate-200">jjsmcsoqcfssaswodubz</strong> to create the table and enable instant public insert permissions:
            </p>
            <pre className="rounded-lg bg-slate-950 p-3 text-[11px] font-mono-code text-cyan-300 overflow-x-auto max-h-40 border border-slate-800">
              {supabaseStatus.sqlSchemaScript}
            </pre>
          </div>
        )}

        {/* Quick Stats Strip */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono-code">
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
            <span className="text-slate-500 block text-[11px]">Total Bookings</span>
            <strong className="text-base text-slate-100">{appointments.length} Consultations</strong>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
            <span className="text-slate-500 block text-[11px]">Pending Review</span>
            <strong className="text-base text-amber-400">
              {appointments.filter(a => a.status === 'pending').length} Action Items
            </strong>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
            <span className="text-slate-500 block text-[11px]">Confirmed Consultations</span>
            <strong className="text-base text-emerald-400">
              {appointments.filter(a => a.status === 'confirmed').length} Scheduled
            </strong>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
            <span className="text-slate-500 block text-[11px]">Emergency Breach</span>
            <strong className="text-base text-rose-400">
              {appointments.filter(a => a.investigation_urgency === 'emergency').length} Active
            </strong>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search client, organization, email..."
            className="w-full rounded-lg border border-slate-800 bg-slate-950 pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:border-cyan-500 focus:outline-none font-mono-code"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono-code">
          <span className="text-slate-500">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            <option value="all">All Appointments</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="rescheduled">Rescheduled</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Appointments List Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 font-mono-code text-slate-400">
                <th className="py-3 px-4 font-semibold">Client & Contact</th>
                <th className="py-3 px-4 font-semibold">Service Practice</th>
                <th className="py-3 px-4 font-semibold">Date & Time Slot</th>
                <th className="py-3 px-4 font-semibold">Urgency</th>
                <th className="py-3 px-4 font-semibold">Supabase Backend</th>
                <th className="py-3 px-4 font-semibold">Status / Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono-code">
              {filtered.map(apt => (
                <tr key={apt.id} className="hover:bg-slate-800/30 transition-colors">
                  {/* Client Info */}
                  <td className="py-3.5 px-4 text-slate-200">
                    <span className="font-bold text-slate-100 block">{apt.full_name}</span>
                    <span className="text-[11px] text-slate-400 block font-mono-code">
                      {apt.email} {apt.phone ? `· ${apt.phone}` : ''}
                    </span>
                    {apt.organization && (
                      <span className="text-[10px] text-cyan-400 font-sans block mt-0.5">
                        {apt.organization}
                      </span>
                    )}
                  </td>

                  {/* Practice / Service */}
                  <td className="py-3.5 px-4 text-slate-300 max-w-xs">
                    <span className="font-sans font-medium line-clamp-2">{apt.service_type}</span>
                    {apt.case_description && (
                      <span className="text-[11px] text-slate-500 font-sans block mt-1 line-clamp-1 italic">
                        &quot;{apt.case_description}&quot;
                      </span>
                    )}
                  </td>

                  {/* Scheduled Slot */}
                  <td className="py-3.5 px-4 text-slate-200">
                    <div className="flex items-center gap-1.5 text-slate-100 font-semibold">
                      <Calendar className="h-3 w-3 text-cyan-400" />
                      <span>{apt.preferred_date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                      <Clock className="h-3 w-3 text-slate-500" />
                      <span>{apt.preferred_time}</span>
                    </div>
                  </td>

                  {/* Urgency */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        apt.investigation_urgency === 'emergency'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : apt.investigation_urgency === 'high_priority'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {apt.investigation_urgency.replace('_', ' ')}
                    </span>
                  </td>

                  {/* Supabase Status */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold ${
                        apt.saved_to_supabase
                          ? 'bg-emerald-950/60 border border-emerald-800/60 text-emerald-300'
                          : 'bg-cyan-950/60 border border-cyan-800/60 text-cyan-300'
                      }`}
                    >
                      <Database className="h-3 w-3" />
                      <span>{apt.saved_to_supabase ? 'Synced to DB' : 'Active Record'}</span>
                    </span>
                  </td>

                  {/* Status Dropdown */}
                  <td className="py-3.5 px-4">
                    <select
                      value={apt.status}
                      onChange={e => handleStatusChange(apt.id, e.target.value)}
                      className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="rescheduled">Rescheduled</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 font-sans">
                    No appointment bookings found matching the current search.
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
