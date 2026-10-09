import React, { useState, useEffect } from 'react';
import {
  Shield,
  LayoutDashboard,
  HardDrive,
  Clock,
  Network,
  AlertTriangle,
  Sparkles,
  FileText,
  Lock,
  Plus,
  ChevronDown,
  Menu,
  X,
  Building,
  User,
  ArrowLeft,
  CheckCircle2,
  FolderOpen
} from 'lucide-react';
import { api } from '../services/api';
import { OverviewTab } from './OverviewTab';
import { EvidenceTab } from './EvidenceTab';
import { TimelineTab } from './TimelineTab';
import { CorrelationTab } from './CorrelationTab';
import { SuspiciousTab } from './SuspiciousTab';
import { AIAssistantTab } from './AIAssistantTab';
import { ReportsTab } from './ReportsTab';
import { AuditTab } from './AuditTab';
import { AppointmentsTab } from './AppointmentsTab';
import { AppointmentModal } from './AppointmentModal';
import { EventDetailModal } from './EventDetailModal';
import { NewInvestigationModal } from './NewInvestigationModal';
import { Calendar } from 'lucide-react';
import type {
  BusinessProfile,
  Investigation,
  EvidenceFile,
  ForensicEvent,
  CorrelationGroup,
  SuspiciousAlert,
  AIAssistantMessage,
  EvidenceFileType
} from '../types/forensics';

interface DashboardLayoutProps {
  business: BusinessProfile;
  onBackToLanding: () => void;
  onBookAppointment?: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  business,
  onBackToLanding,
  onBookAppointment
}) => {
  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<
    'overview' | 'evidence' | 'timeline' | 'correlation' | 'suspicious' | 'ai-assistant' | 'reports' | 'audit' | 'appointments'
  >('overview');

  const [evidenceFiles, setEvidenceFiles] = useState<EvidenceFile[]>([]);
  const [events, setEvents] = useState<ForensicEvent[]>([]);
  const [correlations, setCorrelations] = useState<CorrelationGroup[]>([]);
  const [alerts, setAlerts] = useState<SuspiciousAlert[]>([]);
  const [chatHistory, setChatHistory] = useState<AIAssistantMessage[]>([]);

  const [loading, setLoading] = useState(true);
  const [inspectEvent, setInspectEvent] = useState<ForensicEvent | null>(null);
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [showBookAppointmentModal, setShowBookAppointmentModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initial load
  useEffect(() => {
    loadInvestigations();
  }, []);

  const loadInvestigations = async () => {
    try {
      const list = await api.getInvestigations();
      setInvestigations(list);
      if (list.length > 0 && !selectedCaseId) {
        setSelectedCaseId(list[0].id);
      }
    } catch (err) {
      console.error('Failed to load investigations:', err);
    }
  };

  // Load active case details whenever selectedCaseId changes
  useEffect(() => {
    if (selectedCaseId) {
      loadCaseData(selectedCaseId);
    }
  }, [selectedCaseId]);

  const loadCaseData = async (caseId: string) => {
    setLoading(true);
    try {
      const [filesData, timelineData, corrData, alertsData, chatData] = await Promise.all([
        api.getEvidenceFiles(caseId),
        api.getTimeline(caseId),
        api.getCorrelations(caseId),
        api.getSuspiciousAlerts(caseId),
        api.getAIChatHistory(caseId)
      ]);

      setEvidenceFiles(filesData);
      setEvents(timelineData.events);
      setCorrelations(corrData.correlationGroups);
      setAlerts(alertsData);
      setChatHistory(chatData);
    } catch (err) {
      console.error('Error fetching case data:', err);
    } finally {
      setLoading(false);
    }
  };

  const activeInvestigation =
    investigations.find(inv => inv.id === selectedCaseId) || investigations[0];

  const handleUploadEvidence = async (data: {
    fileName: string;
    fileContent: string;
    fileType: EvidenceFileType;
    timezone: string;
    uploadedBy: string;
  }) => {
    if (!selectedCaseId) return;
    await api.uploadEvidence(selectedCaseId, data);
    await loadCaseData(selectedCaseId);
    await loadInvestigations();
  };

  const handleCreateCase = async (newCaseData: any) => {
    const created = await api.createInvestigation(newCaseData);
    await loadInvestigations();
    setSelectedCaseId(created.id);
  };

  const handleSendMessage = async (query: string) => {
    if (!selectedCaseId) return;
    const res = await api.queryAIAssistant(selectedCaseId, query);
    setChatHistory(prev => [...prev, res.message]);
  };

  const handleUpdateAlertStatus = async (alertId: string, status: string, note?: string) => {
    if (!selectedCaseId) return;
    await api.updateAlertStatus(selectedCaseId, alertId, status, note);
    const updated = await api.getSuspiciousAlerts(selectedCaseId);
    setAlerts(updated);
  };

  const navItems = [
    { id: 'overview', label: 'Case Overview', icon: LayoutDashboard },
    { id: 'evidence', label: 'Evidence Vault', icon: HardDrive, count: evidenceFiles.length },
    { id: 'timeline', label: 'Timeline Reconstruction', icon: Clock, count: events.length },
    { id: 'correlation', label: 'Event Correlation', icon: Network, count: correlations.length },
    { id: 'suspicious', label: 'Suspicious Radar', icon: AlertTriangle, count: alerts.length },
    { id: 'ai-assistant', label: 'AI Forensic Assistant', icon: Sparkles },
    { id: 'reports', label: 'Case Examination Report', icon: FileText },
    { id: 'audit', label: 'Immutable Audit Trail', icon: Lock },
    { id: 'appointments', label: 'Consultation Bookings', icon: Calendar }
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* 1. Sidebar Navigation (260px) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800/80 bg-slate-950 transition-transform duration-200 lg:static lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Lockup */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-950 border border-cyan-800/60 text-cyan-400">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-slate-100 text-sm font-display block leading-none">
                Talfor DFIR
              </span>
              <span className="text-[10px] text-cyan-400 font-mono-code block mt-0.5">
                Evidence Lab
              </span>
            </div>
          </div>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-900 lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Active Docket Summary */}
        {activeInvestigation && (
          <div className="border-b border-slate-800/80 p-4 bg-slate-900/30">
            <span className="text-[10px] font-mono-code uppercase tracking-wider text-slate-500 block mb-1">
              Active Docket:
            </span>
            <div className="font-mono-code font-bold text-xs text-cyan-300 truncate">
              {activeInvestigation.caseNumber}
            </div>
            <div className="text-[11px] text-slate-400 truncate mt-0.5">
              {activeInvestigation.clientOrganization}
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-slate-800 text-cyan-400 font-semibold shadow-sm'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {typeof item.count === 'number' && (
                  <span
                    className={`rounded font-mono-code text-[10px] px-1.5 py-0.5 ${
                      isActive ? 'bg-cyan-950 text-cyan-300' : 'bg-slate-900 text-slate-500'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-slate-800/80 p-4 bg-slate-950/60">
          <div className="flex items-center justify-between text-xs font-mono-code text-slate-500 mb-2">
            <span>Bengaluru Lab</span>
            <span className="text-emerald-400">Online</span>
          </div>
          <button
            onClick={onBackToLanding}
            className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Public Site View</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header Toolbar */}
        <header className="flex h-16 items-center justify-between gap-4 border-b border-slate-800/80 bg-slate-950/90 px-4 sm:px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-900 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Case Selection Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-mono-code hidden sm:inline">Case:</span>
              <div className="relative">
                <select
                  value={selectedCaseId}
                  onChange={e => setSelectedCaseId(e.target.value)}
                  className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-100 font-mono-code focus:border-cyan-500 focus:outline-none"
                >
                  {investigations.map(inv => (
                    <option key={inv.id} value={inv.id}>
                      {inv.caseNumber} - {inv.clientOrganization}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowBookAppointmentModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-800/80 bg-cyan-950/40 px-3 py-1.5 text-xs font-medium text-cyan-300 hover:bg-cyan-900/40 transition-colors font-mono-code"
            >
              <Calendar className="h-3.5 w-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Book Consultation</span>
            </button>

            <button
              onClick={() => setShowNewCaseModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <Plus className="h-3.5 w-3.5 text-cyan-400" />
              <span className="hidden sm:inline">New Case Docket</span>
            </button>

            <button
              onClick={() => setActiveTab('evidence')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-400 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-950 hover:bg-cyan-300 shadow transition-colors"
            >
              <HardDrive className="h-3.5 w-3.5" />
              <span>Ingest Evidence</span>
            </button>
          </div>
        </header>

        {/* Dynamic Tab Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {loading ? (
            <div className="flex h-64 items-center justify-center text-xs font-mono-code text-slate-400">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent mr-3" />
              <span>Loading forensic evidence and chronological timeline...</span>
            </div>
          ) : activeInvestigation ? (
            <>
              {activeTab === 'overview' && (
                <OverviewTab
                  investigation={activeInvestigation}
                  events={events}
                  correlations={correlations}
                  alerts={alerts}
                  onNavigateTab={tab => setActiveTab(tab as any)}
                  onSelectEvent={ev => setInspectEvent(ev)}
                />
              )}

              {activeTab === 'evidence' && (
                <EvidenceTab
                  investigationId={activeInvestigation.id}
                  files={evidenceFiles}
                  onUpload={handleUploadEvidence}
                  onRefresh={() => loadCaseData(activeInvestigation.id)}
                />
              )}

              {activeTab === 'timeline' && (
                <TimelineTab
                  events={events}
                  onSelectEvent={ev => setInspectEvent(ev)}
                  investigationId={activeInvestigation.id}
                />
              )}

              {activeTab === 'correlation' && (
                <CorrelationTab
                  correlations={correlations}
                  events={events}
                  onSelectEvent={ev => setInspectEvent(ev)}
                />
              )}

              {activeTab === 'suspicious' && (
                <SuspiciousTab
                  alerts={alerts}
                  events={events}
                  investigationId={activeInvestigation.id}
                  onUpdateAlertStatus={handleUpdateAlertStatus}
                  onSelectEvent={ev => setInspectEvent(ev)}
                />
              )}

              {activeTab === 'ai-assistant' && (
                <AIAssistantTab
                  investigationId={activeInvestigation.id}
                  chatHistory={chatHistory}
                  events={events}
                  onSendMessage={handleSendMessage}
                  onSelectEvent={ev => setInspectEvent(ev)}
                />
              )}

              {activeTab === 'reports' && (
                <ReportsTab investigation={activeInvestigation} />
              )}

              {activeTab === 'audit' && (
                <AuditTab investigationId={activeInvestigation.id} />
              )}

              {activeTab === 'appointments' && (
                <AppointmentsTab onOpenBookModal={() => setShowBookAppointmentModal(true)} />
              )}
            </>
          ) : (
            <div className="p-8 text-center text-slate-500">
              No investigation docket found. Click &quot;New Case Docket&quot; to initialize.
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <EventDetailModal
        event={inspectEvent}
        onClose={() => setInspectEvent(null)}
      />

      {showNewCaseModal && (
        <NewInvestigationModal
          onClose={() => setShowNewCaseModal(false)}
          onSubmit={handleCreateCase}
        />
      )}

      {showBookAppointmentModal && (
        <AppointmentModal
          onClose={() => setShowBookAppointmentModal(false)}
          onBookingSuccess={() => {
            if (activeTab === 'appointments') {
              // triggers refresh if tab is appointments
            }
          }}
        />
      )}
    </div>
  );
};
