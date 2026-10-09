import React from 'react';
import {
  Shield,
  Clock,
  Network,
  AlertTriangle,
  Sparkles,
  FileText,
  Binary,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  ChevronRight,
  Database,
  ArrowRight,
  CheckCircle2,
  HardDrive
} from 'lucide-react';
import { HeroVisualizer } from './HeroVisualizer';
import type { BusinessProfile } from '../types/forensics';

interface LandingPageProps {
  business: BusinessProfile;
  onLaunchInvestigation: () => void;
  onBookAppointment: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  business,
  onLaunchInvestigation,
  onBookAppointment
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 border-b border-slate-900">
        {/* Subtle radial ambient background */}
        <div
          className="absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-cyan-600/10 blur-[130px] pointer-events-none"
          aria-hidden="true"
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Core Value Proposition */}
            <div className="lg:col-span-6 flex flex-col items-start">
              <div className="flex items-center gap-2 text-xs font-medium text-cyan-400 font-mono-code mb-4">
                <span>{business.name}</span>
                <span aria-hidden="true">·</span>
                <span>Bengaluru DFIR Labs</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-100 font-display text-balance leading-tight">
                Turn Digital Evidence Into a Clear Timeline of Events.
              </h1>

              <p className="mt-6 text-base sm:text-lg text-slate-400 leading-relaxed text-balance">
                An AI-powered digital-forensics platform that organizes evidence, correlates related activities, identifies suspicious patterns, and transforms complex digital records into explainable investigation timelines.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  onClick={onLaunchInvestigation}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-lg shadow-cyan-950/50 transition-all whitespace-nowrap"
                >
                  <span>Start Investigation</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  onClick={onBookAppointment}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-cyan-300 bg-cyan-950/60 border border-cyan-800/80 hover:bg-cyan-900/60 rounded-lg transition-colors whitespace-nowrap font-display"
                >
                  <Database className="h-4 w-4" />
                  <span>Book Forensic Consultation</span>
                </button>

                <a
                  href="#features"
                  className="inline-flex items-center justify-center px-4 py-3 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors whitespace-nowrap"
                >
                  Explore Platform
                </a>
              </div>

              {/* Verification trust markers */}
              <div className="mt-10 flex flex-wrap items-center gap-6 text-xs text-slate-400 font-mono-code border-t border-slate-900 pt-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                  <span>ISO/IEC 27037 Integrity</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                  <span>SHA-256 Vault Sealing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                  <span>Zero-Sample Fabrication</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Reconstructed Chrono-Vector */}
            <div className="lg:col-span-6">
              <HeroVisualizer onLaunch={onLaunchInvestigation} />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Platform Core Features Grid */}
      <section id="features" className="py-20 md:py-28 border-b border-slate-900 bg-slate-950/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 font-mono-code">
              Forensic Capabilities
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-100 font-display">
              Enterprise-Grade Digital Forensics Architecture
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-400">
              Built to meet the evidentiary rigor required by corporate counsel, security operations centers, and law enforcement agencies.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="rounded-xl border border-slate-800/90 bg-slate-900/40 p-6 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-950 border border-cyan-800/60 text-cyan-400 mb-4">
                  <Binary className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-slate-100 font-display">
                  Intelligent Evidence Processing
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Ingest system logs, auth gateways, VPC netflow records, file integrity feeds, and USB registry entries. Computes SHA-256 checksums, validates data quality, and eliminates duplicates.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-800/60 text-xs font-mono-code text-slate-500">
                <span>Multi-Format Ingestion</span>
                <span className="mx-2">·</span>
                <span>Cryptographic Digest</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="rounded-xl border border-slate-800/90 bg-slate-900/40 p-6 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-950 border border-sky-800/60 text-sky-400 mb-4">
                  <Clock className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-slate-100 font-display">
                  Chronological Timeline Reconstruction
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Aligns asynchronous logs into a unified, high-precision UTC sequence while recording original local timestamps and timezone offsets. Explicitly highlights clock skews and time corrections.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-800/60 text-xs font-mono-code text-slate-500">
                <span>Timezone Normalization</span>
                <span className="mx-2">·</span>
                <span>Skew Auditing</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="rounded-xl border border-slate-800/90 bg-slate-900/40 p-6 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-950 border border-cyan-800/60 text-cyan-400 mb-4">
                  <Network className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-slate-100 font-display">
                  Multi-Source Event Correlation
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Identifies latent relationships across disjoint evidence sources using temporal clustering, shared account identifiers, IP trajectories, and MITRE ATT&CK killchain patterns.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-800/60 text-xs font-mono-code text-slate-500">
                <span>Graph Exploration</span>
                <span className="mx-2">·</span>
                <span>Calibrated Confidence</span>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="rounded-xl border border-slate-800/90 bg-slate-900/40 p-6 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-950 border border-rose-800/60 text-rose-400 mb-4">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-slate-100 font-display">
                  Suspicious Activity Detection
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Flags brute-force credential bursts, geo-impossible travel, unauthorized privilege escalation, mass file access, and anomalous exfiltration using transparent, auditable detection heuristics.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-800/60 text-xs font-mono-code text-slate-500">
                <span>Rule-Based Alerts</span>
                <span className="mx-2">·</span>
                <span>Adversary TTPs</span>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="rounded-xl border border-slate-800/90 bg-slate-900/40 p-6 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-950 border border-teal-800/60 text-teal-400 mb-4">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-slate-100 font-display">
                  AI-Assisted Investigation & RAG
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Ask complex forensic questions in natural language. Powered by Gemini, the assistant grounds answers strictly in indexed case evidence with exact Event ID and hash citations.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-800/60 text-xs font-mono-code text-slate-500">
                <span>RAG Retrieval</span>
                <span className="mx-2">·</span>
                <span>Zero Hallucination</span>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="rounded-xl border border-slate-800/90 bg-slate-900/40 p-6 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-950 border border-indigo-800/60 text-indigo-400 mb-4">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-slate-100 font-display">
                  Explainable Investigation Reports
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Generate comprehensive forensic examination reports containing evidence inventories, reconstructed milestones, correlation findings, and limitations. Export to certified PDF and CSV.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-800/60 text-xs font-mono-code text-slate-500">
                <span>Audit Stamped</span>
                <span className="mx-2">·</span>
                <span>Court-Ready Summary</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Forensic Methodology Workflow */}
      <section id="workflow" className="py-20 md:py-28 border-b border-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 font-mono-code">
              Investigation Lifecycle
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-100 font-display">
              Four-Phase Forensic Reconstruction Workflow
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-400">
              How Talfor transforms volatile, unstructured multi-source digital trails into an unassailable evidentiary record.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="relative rounded-xl border border-slate-800 bg-slate-900/30 p-5">
              <span className="text-xs font-mono-code text-cyan-400 font-bold">STAGE 01</span>
              <h4 className="mt-2 text-base font-semibold text-slate-100 font-display">
                Cryptographic Ingestion
              </h4>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Raw log files, PCAPs, and disk artifacts are verified, hashed via SHA-256 and MD5, and locked in an immutable evidence repository.
              </p>
            </div>

            <div className="relative rounded-xl border border-slate-800 bg-slate-900/30 p-5">
              <span className="text-xs font-mono-code text-cyan-400 font-bold">STAGE 02</span>
              <h4 className="mt-2 text-base font-semibold text-slate-100 font-display">
                Temporal Normalization
              </h4>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Asynchronous timestamps across global data centers and local timezones are converted into a unified, monotonic UTC continuum.
              </p>
            </div>

            <div className="relative rounded-xl border border-slate-800 bg-slate-900/30 p-5">
              <span className="text-xs font-mono-code text-cyan-400 font-bold">STAGE 03</span>
              <h4 className="mt-2 text-base font-semibold text-slate-100 font-display">
                Multi-Source Correlation
              </h4>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Automated engines correlate isolated events across firewalls, hosts, and databases into coherent attack sequences and lateral pivots.
              </p>
            </div>

            <div className="relative rounded-xl border border-slate-800 bg-slate-900/30 p-5">
              <span className="text-xs font-mono-code text-cyan-400 font-bold">STAGE 04</span>
              <h4 className="mt-2 text-base font-semibold text-slate-100 font-display">
                AI Grounding & Report
              </h4>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                RAG-assisted explanation surfaces critical findings with explicit event citations, forensic limitations, and signed legal reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Verified Talfor Digital Forensics Credentials & Contact */}
      <section id="about-contact" className="py-20 md:py-28 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Business Profile Details */}
            <div className="lg:col-span-7">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 font-mono-code">
                Forensic Laboratory Profile
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-100 font-display">
                {business.name}
              </h2>
              <p className="mt-1 text-sm text-cyan-400 font-mono-code">
                {business.category}
              </p>
              <p className="mt-4 text-sm sm:text-base text-slate-400 leading-relaxed">
                Headquartered in Rajajinagar, Bengaluru, Talfor Digital Forensics provides specialized cyber forensic investigations, complex timeline reconstruction, electronic discovery, and incident response consultation to legal firms, law enforcement agencies, and enterprise organizations worldwide.
              </p>

              {/* Verified Services List */}
              <div className="mt-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-display mb-3">
                  Accredited Forensic Practice Areas
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  {business.services.map((svc, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0" />
                      <span>{svc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lab Hours & Compliance */}
              <div className="mt-6 pt-6 border-t border-slate-900 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono-code">
                <div>
                  <span className="text-slate-500 block">Laboratory Operating Hours</span>
                  <span className="text-slate-300">{business.operatingHours}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Emergency DFIR Dispatch</span>
                  <span className="text-emerald-400">{business.emergencyResponse}</span>
                </div>
              </div>
            </div>

            {/* Direct Contact & Directions Card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-100 font-display">
                    Physical Lab & Consultation
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Official laboratory address in Karnataka, India
                  </p>

                  <div className="mt-6 space-y-4 text-xs text-slate-300">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-100 block">{business.address}</span>
                        <span className="text-slate-400">{business.landmark}, {business.city}, {business.state} {business.pincode}, {business.country}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-cyan-400 shrink-0" />
                      <div>
                        <span className="text-slate-400">Direct India: </span>
                        <a href={`tel:${business.phoneIndia}`} className="text-slate-200 hover:text-cyan-400 font-mono-code font-semibold">
                          {business.phoneIndia}
                        </a>
                        <span className="text-slate-500 mx-2">|</span>
                        <span className="text-slate-400">UAE: </span>
                        <span className="font-mono-code text-slate-300">{business.phoneUAE}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-cyan-400 shrink-0" />
                      <div>
                        <span className="text-slate-400">Investigation Inquiries: </span>
                        <a href={`mailto:${business.email}`} className="text-cyan-400 hover:underline font-mono-code">
                          {business.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-3 pt-6 border-t border-slate-800">
                  <button
                    onClick={onBookAppointment}
                    className="flex items-center justify-center w-full px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow transition-colors"
                  >
                    Schedule Consultation (Supabase Live Sync)
                  </button>

                  <a
                    href={business.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between w-full px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
                  >
                    <span>View on Google Maps & Directions</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>

                  <button
                    onClick={onLaunchInvestigation}
                    className="flex items-center justify-center w-full px-4 py-2 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    Enter Investigation Workspace
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-10 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-cyan-500" />
            <span className="font-bold text-slate-300">{business.name}</span>
            <span aria-hidden="true">·</span>
            <span>Digital Evidence Reconstruction Platform</span>
          </div>

          <div className="flex items-center gap-6 font-mono-code">
            <span>ISO/IEC 27037 Standard</span>
            <span aria-hidden="true">·</span>
            <span>Rajajinagar, Bengaluru</span>
            <span aria-hidden="true">·</span>
            <span>© {new Date().getFullYear()} Talfor</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
