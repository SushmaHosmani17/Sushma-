export interface AppointmentBooking {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone?: string;
  organization?: string;
  service_type: string;
  preferred_date: string;
  preferred_time: string;
  investigation_urgency: 'standard' | 'high_priority' | 'emergency';
  case_description?: string;
  status: 'pending' | 'confirmed' | 'rescheduled' | 'cancelled';
  source?: string;
  saved_to_supabase?: boolean;
}

export type InvestigationStatus = 'active' | 'in_progress' | 'under_review' | 'completed' | 'archived';
export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';
export type RiskLevel = 'critical' | 'high' | 'medium' | 'low' | 'nominal';

export interface BusinessProfile {
  name: string;
  category: string;
  legalEntity: string;
  tagline: string;
  address: string;
  landmark: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  phoneIndia: string;
  phoneUAE: string;
  email: string;
  website: string;
  operatingHours: string;
  emergencyResponse: string;
  services: string[];
  certifications: string[];
  googleMapsUrl: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Investigation {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  leadInvestigator: string;
  status: InvestigationStatus;
  priority: PriorityLevel;
  incidentDate: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  clientOrganization: string;
  scope: string;
  evidenceCount: number;
  eventCount: number;
  suspiciousCount: number;
  correlationGroupCount: number;
}

export type EvidenceFileType =
  | 'auth_log'
  | 'system_syslog'
  | 'web_access'
  | 'network_flow'
  | 'file_integrity'
  | 'device_usb'
  | 'email_headers'
  | 'custom_json'
  | 'custom_csv';

export interface EvidenceFile {
  id: string;
  investigationId: string;
  fileName: string;
  originalName: string;
  fileType: EvidenceFileType;
  mimeType: string;
  sizeBytes: number;
  sha256Hash: string;
  md5Hash: string;
  uploadedAt: string;
  uploadedBy: string;
  parsedEventCount: number;
  sourceClassification: string;
  timezone: string;
  timezoneOffsetMinutes: number;
  status: 'verified' | 'processing' | 'rejected';
  validationNotes: string;
  chainOfCustodyRecord: string;
  immutableCopyLocation: string;
}

export type ForensicEventType =
  | 'auth_failed'
  | 'auth_success'
  | 'privilege_escalation'
  | 'file_accessed'
  | 'file_modified'
  | 'data_exfiltration'
  | 'process_execution'
  | 'network_outbound'
  | 'network_inbound'
  | 'usb_connected'
  | 'usb_disconnected'
  | 'account_created'
  | 'policy_modified';

export interface ForensicEvent {
  id: string;
  investigationId: string;
  evidenceFileId: string;
  evidenceFileName: string;
  eventIndex: number;
  timestampUtc: string;
  timestampLocal: string;
  originalTimestampStr: string;
  timezone: string;
  timezoneOffsetMinutes: number;
  hasTimestampCorrection: boolean;
  timestampCorrectionNote?: string;
  eventType: ForensicEventType;
  sourceClassification: string;
  entityUser: string;
  entityDevice: string;
  sourceIp?: string;
  destIp?: string;
  port?: number;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  description: string;
  attributes: Record<string, any>;
  isSuspicious: boolean;
  suspiciousRule?: string;
  mitreTechniqueId?: string;
  mitreTactic?: string;
}

export interface CorrelationEdge {
  fromEventId: string;
  toEventId: string;
  relationship: string;
  confidence: number; // 0 - 1.0
  timeDeltaSeconds: number;
  reason: string;
}

export interface CorrelationGroup {
  id: string;
  investigationId: string;
  title: string;
  method: 'temporal_cluster' | 'identity_pivot' | 'ip_trajectory' | 'killchain_sequence' | 'hybrid_heuristic';
  confidenceScore: number; // 0 - 1.0
  eventIds: string[];
  sharedAttributes: {
    user?: string;
    ip?: string;
    device?: string;
    subnet?: string;
    timeWindow?: string;
  };
  timeSpanSeconds: number;
  explanation: string;
  mitreTechnique?: string;
  edges: CorrelationEdge[];
}

export interface SuspiciousAlert {
  id: string;
  investigationId: string;
  title: string;
  severity: PriorityLevel;
  ruleId: string;
  ruleName: string;
  supportingEventIds: string[];
  detectedAt: string;
  rationale: string;
  status: 'under_investigation' | 'confirmed_adversary' | 'benign_activity';
  remediationStep?: string;
}

export interface AIAssistantMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  citedEventIds?: string[];
  citedEvidenceHashes?: string[];
  evidenceGrounded: boolean;
  inferences?: string[];
  unresolvedGaps?: string[];
}

export interface AuditLogEntry {
  id: string;
  investigationId: string;
  timestamp: string;
  actor: string;
  action: string;
  resource: string;
  details: string;
  cryptoChecksum: string;
}

export interface ForensicReport {
  id: string;
  investigationId: string;
  caseNumber: string;
  title: string;
  generatedAt: string;
  generatedBy: string;
  forensicLab: string;
  sha256Seal: string;
  executiveSummary: string;
  evidenceSummary: {
    totalFiles: number;
    totalEvents: number;
    verifiedHashes: number;
    sources: string[];
  };
  suspiciousFindingsCount: number;
  correlationGroupCount: number;
  methodology: string;
  timelineHighlights: Array<{
    timestamp: string;
    eventId: string;
    eventType: string;
    description: string;
    riskLevel: string;
  }>;
  aiExplanationNotes: string;
  limitationsAndMissingData: string[];
  chainOfCustodyVerified: boolean;
}
