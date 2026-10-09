# Talfor Digital Forensics: Digital Evidence Timeline Reconstruction & Event Correlation Platform

A web application and full-stack digital forensics engine built for **Talfor Digital Forensics** (Headquartered in Rajajinagar, Bengaluru, India). The platform automates multi-source forensic evidence ingestion, high-precision UTC timestamp normalization, heuristic and killchain event correlation, suspicious activity detection, and Retrieval-Augmented Generation (RAG) generative AI investigation assistance.

---

## 1. Verified Business Profile

- **Official Business Name**: Talfor Digital Forensics
- **Primary Business Category**: Forensic Consultant / Digital Forensics & Incident Response (DFIR)
- **Official Address**: #43, 2nd Main Rd, Ramachandrapura, Rajajinagar, Bengaluru, Karnataka 560021, India
- **Coordinates**: Latitude 12.9829375, Longitude 77.5628125
- **Google Maps Reference**: [https://maps.app.goo.gl/2woyir9KjeJUNXfi9](https://maps.app.goo.gl/2woyir9KjeJUNXfi9)
- **Direct Telephone**: +91 82-17-30-41-05 (India) / +97 15-01-44-40-55 (UAE)
- **Official Email**: info@talfor.in
- **Operating Hours**: Monday – Saturday: 09:30 AM – 06:30 PM IST (24/7 Incident Emergency Hotline)
- **Practice Areas**: Cyber Forensic Investigations, Timeline Reconstruction & Multi-Source Event Correlation, Data Recovery Forensics (SSD, RAID, CCTV/DVR, NAND Flash), Electronic Data Discovery (EDD), Incident Response & Threat Hunting, Removable Device Forensics, Cloud VPC Analysis, Corporate Fraud Investigations, and Accredited DFIR Training.

---

## 2. Core Forensic Capabilities

### A. Intelligent Evidence Ingestion & Cryptographic Integrity
- **Multi-Source Support**: Ingests auth logs (`sshd`, `radius`, `pam`), Linux `sysmon`/`auditd` JSON streams, web access logs (Apache/NGINX), cloud VPC Flow log CSVs, and USB storage registry artifacts.
- **Cryptographic Sealing**: Computes SHA-256 and MD5 cryptographic checksums instantly upon upload. Duplicate evidence files are rejected via hash verification.
- **Chain of Custody Tracking**: Logs investigator credentials, ingestion timestamp, byte count, and storage vault location under ISO/IEC 27037 standards.

### B. High-Precision Chronological Timeline Reconstruction
- **UTC Monotonic Normalization**: Converts disparate timestamps from global timezones into a unified UTC continuum.
- **Observed vs. Normalized Transparency**: Preserves original raw timestamp strings and local offsets (e.g. `Asia/Kolkata +05:30`), explicitly flagging clock skew or missing timezone data.
- **Filtering & Zooming**: Filter by event type, risk score threshold (0–100), source evidence container, entity username, IP address, and date window.
- **Comparative Analysis**: Side-by-side mode enables examiners to inspect time differentials ($\Delta t$) between events from distinct evidence sources.

### C. Multi-Source Event Correlation
- **Heuristic & Killchain Linkage**: Correlates events across temporal proximity, shared identity tokens (`r.sharma`), IP trajectories, and MITRE ATT&CK enterprise tactics.
- **Graph & Hop Inspector**: Visualizes multi-stage attacks as an interconnected sequence showing source node, target node, relationship class, time delta in seconds, and calibrated confidence score.
- **Evidentiary Causation Caveat**: Explicitly discloses that correlation does not establish absolute causation without secondary corroborative artifacts.

### D. Suspicious Event Detection Engine
- **RULE-IMPOSSIBLE-TRAVEL**: Detects concurrent active authentication tokens across geographically disjoint IP blocks (e.g., Frankfurt Tor exit node vs. Bengaluru ISP in < 3 minutes).
- **RULE-BURST-AUTH-FAIL**: Flags automated password spraying ($\ge 3$ failures within 130 seconds).
- **RULE-PRIV-ESC-SUDO**: Matches CVE-2021-3156 (Baron Samedit heap overflow) and unauthorized root shell spawning.
- **RULE-EXFILTRATION-BULLETPROOF-IP**: Alerts on egress spikes to known C2 infrastructure and high-risk ASNs.
- **RULE-LOG-TAMPER-SHRED**: Detects anti-forensic timestomping and `shred -u` invocations on system logs.

### E. RAG & Generative AI Investigation Assistant
- **Evidence-Grounded Explanations**: Powered by `@google/genai` (`gemini-3.8-flash`) with strict system instructions requiring explicit Event ID citations (`EVT-104`, `EVT-108`, `EVT-112`) and evidence hash references.
- **Separation of Facts and Inferences**: Isolates confirmed forensic observations from analytical hypotheses.
- **Gap & Limitation Disclosure**: Declares missing logs (e.g. unindexed DNS history or unobtained memory dumps) instead of fabricating answers.
- **Deterministic Expert Fallback**: Zero-downtime offline forensic analysis engine available when API keys are not configured or quota limits occur.

### F. Certified Forensic Examination Reports
- Generates comprehensive forensic dossiers with executive summaries, evidence inventories, timeline milestones, correlation findings, and limitations.
- Exports court-ready **PDF / Printable format** and **CSV format** with verified SHA-256 digital document seals.
- Immutable cryptographic audit log tracking every analyst operation.

### G. Supabase Backend Integration for Appointment Bookings
- **Project ID**: `jjsmcsoqcfssaswodubz`
- **Supabase REST URL**: `https://jjsmcsoqcfssaswodubz.supabase.co`
- **Publishable Key**: `sb_publishable_oRMcvK13zbkBNr9BRCgWSg_kT1F4ZDM`
- **Direct Database Sync**: Every submitted forensic consultation or appointment booking form is structured and routed directly to Supabase (`public.appointments` table).
- **Automatic Fallback & Schema Migration**: If the table does not yet exist in the user's Supabase instance, bookings are securely captured and an instant 1-click SQL migration snippet is provided in the UI.

#### Supabase SQL Schema (`public.appointments`):
```sql
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  organization TEXT,
  service_type TEXT NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time TEXT NOT NULL,
  investigation_urgency TEXT DEFAULT 'standard',
  case_description TEXT,
  status TEXT DEFAULT 'pending',
  source TEXT DEFAULT 'web_booking'
);

-- Enable Row Level Security and allow public inserts
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts for appointment bookings"
  ON public.appointments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public read for appointment bookings"
  ON public.appointments
  FOR SELECT
  TO anon, authenticated
  USING (true);
```

---

## 3. Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion.
- **Backend**: Node.js, Express, TypeScript (`tsx`).
- **AI / SDK**: `@google/genai` (`gemini-3.8-flash`) server-side client with `aistudio-build` telemetry header.
- **Security & Crypto**: Node.js `crypto` module (SHA-256, MD5 digests), tamper-evident audit signatures.

---

## 4. REST API Documentation

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/business-profile` | Returns verified Talfor Digital Forensics listing data, coordinates, and contact details |
| `GET` | `/api/investigations` | Returns all active and archived investigation dockets |
| `POST` | `/api/investigations` | Registers a new forensic case docket |
| `GET` | `/api/investigations/:id` | Returns case details and metric aggregates |
| `PATCH` | `/api/investigations/:id/status` | Updates case lifecycle status and investigator notes |
| `GET` | `/api/investigations/:id/evidence` | Lists all ingested evidence containers and SHA-256 checksums |
| `POST` | `/api/investigations/:id/evidence` | Ingests, parses, and hashes raw digital evidence logs |
| `GET` | `/api/investigations/:id/timeline` | Returns reconstructed chronological timeline events |
| `GET` | `/api/investigations/:id/correlations` | Returns correlation groups and node-edge graph structures |
| `GET` | `/api/investigations/:id/suspicious-events` | Lists threat radar detection alerts and severity scores |
| `PATCH` | `/api/investigations/:id/suspicious-events/:alertId` | Updates alert status (`confirmed_adversary`, `benign_activity`) |
| `POST` | `/api/investigations/:id/ai-assistant` | Executes RAG grounded generative forensic analysis |
| `GET` | `/api/investigations/:id/report` | Compiles formal legal forensic report with SHA-256 seal |
| `GET` | `/api/investigations/:id/export/csv` | Streams RFC-compliant CSV timeline export |
| `GET` | `/api/investigations/:id/audit-log` | Returns tamper-evident cryptographic action ledger |

---

## 5. Startup & Execution Instructions

```bash
# 1. Install dependencies
npm install

# 2. Run in development mode (starts Express backend + Vite frontend on port 3000)
npm run dev

# 3. Build for production
npm run build

# 4. Start production server
npm start
```
