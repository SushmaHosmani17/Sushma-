import type {
  BusinessProfile,
  Investigation,
  EvidenceFile,
  ForensicEvent,
  CorrelationGroup,
  SuspiciousAlert,
  AIAssistantMessage,
  AuditLogEntry,
  ForensicReport,
  AppointmentBooking
} from '../types/forensics';

export const api = {
  async getSupabaseStatus(): Promise<{
    projectId: string;
    supabaseUrl: string;
    connected: boolean;
    tableExists: boolean;
    sqlSchemaScript: string;
    errorDetail?: any;
  }> {
    const res = await fetch('/api/supabase/status');
    const json = await res.json();
    return json.data;
  },

  async getAppointments(): Promise<AppointmentBooking[]> {
    const res = await fetch('/api/appointments');
    const json = await res.json();
    return json.data;
  },

  async bookAppointment(data: {
    full_name: string;
    email: string;
    phone?: string;
    organization?: string;
    service_type: string;
    preferred_date: string;
    preferred_time: string;
    investigation_urgency?: string;
    case_description?: string;
  }): Promise<{
    success: boolean;
    data: AppointmentBooking;
    savedToSupabase: boolean;
    projectId: string;
    tableMissing: boolean;
    sqlSchemaScript: string;
    message: string;
  }> {
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to submit appointment booking');
    return json;
  },

  async updateAppointmentStatus(id: string, status: string): Promise<AppointmentBooking> {
    const res = await fetch(`/api/appointments/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const json = await res.json();
    return json.data;
  },
  async getBusinessProfile(): Promise<BusinessProfile> {
    const res = await fetch('/api/business-profile');
    const json = await res.json();
    return json.data;
  },

  async getInvestigations(): Promise<Investigation[]> {
    const res = await fetch('/api/investigations');
    const json = await res.json();
    return json.data;
  },

  async getInvestigation(id: string): Promise<Investigation> {
    const res = await fetch(`/api/investigations/${id}`);
    const json = await res.json();
    return json.data;
  },

  async createInvestigation(data: {
    title: string;
    clientOrganization: string;
    description?: string;
    leadInvestigator?: string;
    priority?: string;
    scope?: string;
    tags?: string[];
  }): Promise<Investigation> {
    const res = await fetch('/api/investigations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to create investigation');
    return json.data;
  },

  async updateInvestigationStatus(id: string, status: string, investigatorNotes?: string): Promise<Investigation> {
    const res = await fetch(`/api/investigations/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, investigatorNotes })
    });
    const json = await res.json();
    return json.data;
  },

  async getEvidenceFiles(investigationId: string): Promise<EvidenceFile[]> {
    const res = await fetch(`/api/investigations/${investigationId}/evidence`);
    const json = await res.json();
    return json.data;
  },

  async uploadEvidence(
    investigationId: string,
    data: {
      fileName: string;
      fileContent: string;
      fileType?: string;
      timezone?: string;
      uploadedBy?: string;
    }
  ): Promise<{ evidenceFile: EvidenceFile; parsedEventsCount: number }> {
    const res = await fetch(`/api/investigations/${investigationId}/evidence`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Evidence upload failed');
    return json.data;
  },

  async getTimeline(
    investigationId: string,
    filters?: {
      eventType?: string;
      minRisk?: number;
      search?: string;
      source?: string;
      startTime?: string;
      endTime?: string;
    }
  ): Promise<{
    investigationId: string;
    totalEventsInCase: number;
    filteredCount: number;
    events: ForensicEvent[];
  }> {
    const params = new URLSearchParams();
    if (filters?.eventType && filters.eventType !== 'all') params.set('eventType', filters.eventType);
    if (filters?.minRisk) params.set('minRisk', filters.minRisk.toString());
    if (filters?.search) params.set('search', filters.search);
    if (filters?.source && filters.source !== 'all') params.set('source', filters.source);
    if (filters?.startTime) params.set('startTime', filters.startTime);
    if (filters?.endTime) params.set('endTime', filters.endTime);

    const res = await fetch(`/api/investigations/${investigationId}/timeline?${params.toString()}`);
    const json = await res.json();
    return json.data;
  },

  async getCorrelations(investigationId: string): Promise<{
    correlationGroups: CorrelationGroup[];
    graph: {
      nodes: Array<{
        id: string;
        label: string;
        type: string;
        user: string;
        riskScore: number;
        timestamp: string;
        isSuspicious: boolean;
      }>;
      edges: Array<{
        source: string;
        target: string;
        relationship: string;
        confidence: number;
        timeDelta: number;
        reason: string;
      }>;
    };
  }> {
    const res = await fetch(`/api/investigations/${investigationId}/correlations`);
    const json = await res.json();
    return json.data;
  },

  async getSuspiciousAlerts(investigationId: string): Promise<SuspiciousAlert[]> {
    const res = await fetch(`/api/investigations/${investigationId}/suspicious-events`);
    const json = await res.json();
    return json.data;
  },

  async updateAlertStatus(
    investigationId: string,
    alertId: string,
    status: string,
    remediationNote?: string
  ): Promise<SuspiciousAlert> {
    const res = await fetch(`/api/investigations/${investigationId}/suspicious-events/${alertId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, remediationNote })
    });
    const json = await res.json();
    return json.data;
  },

  async getAIChatHistory(investigationId: string): Promise<AIAssistantMessage[]> {
    const res = await fetch(`/api/investigations/${investigationId}/ai-assistant`);
    const json = await res.json();
    return json.data;
  },

  async queryAIAssistant(
    investigationId: string,
    query: string
  ): Promise<{ message: AIAssistantMessage; usedLiveGemini: boolean }> {
    const res = await fetch(`/api/investigations/${investigationId}/ai-assistant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'AI Query failed');
    return json.data;
  },

  async getReport(investigationId: string): Promise<ForensicReport> {
    const res = await fetch(`/api/investigations/${investigationId}/report`);
    const json = await res.json();
    return json.data;
  },

  async getAuditLogs(investigationId: string): Promise<AuditLogEntry[]> {
    const res = await fetch(`/api/investigations/${investigationId}/audit-log`);
    const json = await res.json();
    return json.data;
  }
};
