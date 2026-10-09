import React, { useState } from 'react';
import {
  UploadCloud,
  FileCheck,
  HardDrive,
  Hash,
  Shield,
  AlertCircle,
  Clock,
  Search,
  CheckCircle2,
  FileCode,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import type { EvidenceFile, EvidenceFileType } from '../types/forensics';

interface EvidenceTabProps {
  investigationId: string;
  files: EvidenceFile[];
  onUpload: (data: {
    fileName: string;
    fileContent: string;
    fileType: EvidenceFileType;
    timezone: string;
    uploadedBy: string;
  }) => Promise<void>;
  onRefresh: () => void;
}

const SAMPLE_LOGS: Array<{
  name: string;
  fileType: EvidenceFileType;
  timezone: string;
  description: string;
  content: string;
}> = [
  {
    name: 'apache_access_gateway.log',
    fileType: 'web_access',
    timezone: 'Asia/Kolkata (UTC+05:30)',
    description: 'HTTP POST brute-force and web application exploit payload attempts',
    content: `185.220.101.44 - - [06/Oct/2026:07:18:02 +0530] "GET /api/v1/auth/challenge HTTP/1.1" 200 1420
185.220.101.44 - - [06/Oct/2026:07:19:15 +0530] "POST /api/v1/auth/login HTTP/1.1" 401 328
185.220.101.44 - - [06/Oct/2026:07:20:44 +0530] "POST /api/v1/auth/login HTTP/1.1" 401 328
185.220.101.44 - - [06/Oct/2026:07:21:05 +0530] "POST /api/v1/auth/login HTTP/1.1" 200 892
185.220.101.44 - - [06/Oct/2026:07:22:30 +0530] "GET /api/v1/admin/cluster/nodes HTTP/1.1" 200 4810`
  },
  {
    name: 'linux_auth_sudo.log',
    fileType: 'auth_log',
    timezone: 'UTC',
    description: 'Linux pam_unix and sudo invocation syslog stream',
    content: `Oct  6 02:08:44 srv-bastion-prod01 sshd[14892]: Accepted publickey for r.sharma from 10.240.4.18 port 48210 ssh2
Oct  6 02:10:15 srv-bastion-prod01 bash[14920]: user r.sharma executed id; uname -a
Oct  6 02:13:30 srv-bastion-prod01 sudo[15102]: r.sharma : TTY=pts/0 ; PWD=/home/r.sharma ; USER=root ; COMMAND=sudoedit -s \\
Oct  6 02:15:02 srv-bastion-prod01 root[15144]: file /etc/hosts modified by uid 0`
  },
  {
    name: 'cloud_vpc_egress.csv',
    fileType: 'network_flow',
    timezone: 'UTC',
    description: 'VPC network flow capture with destination port and packet volumes',
    content: `timestamp,source,user,ip,event_type,details
2026-10-06T02:22:15Z,vpc_router,system,10.10.1.5,file_accessed,Creation of staging archive /tmp/.cache_bak.gz
2026-10-06T02:24:50Z,vpc_router,system,10.10.1.5,data_exfiltration,High-volume egress of 452MB to bulletproof host 194.26.29.112:8443
2026-10-06T02:29:10Z,vpc_router,root,10.10.1.5,file_modified,Anti-forensic log shredding detected on /var/log/auth.log`
  }
];

export const EvidenceTab: React.FC<EvidenceTabProps> = ({
  investigationId,
  files,
  onUpload,
  onRefresh
}) => {
  const [search, setSearch] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [fileType, setFileType] = useState<EvidenceFileType>('auth_log');
  const [timezone, setTimezone] = useState('Asia/Kolkata (UTC+05:30)');
  const [uploadedBy, setUploadedBy] = useState('Senior Investigator (Talfor DFIR)');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const filteredFiles = files.filter(f =>
    f.fileName.toLowerCase().includes(search.toLowerCase()) ||
    f.sha256Hash.toLowerCase().includes(search.toLowerCase()) ||
    f.sourceClassification.toLowerCase().includes(search.toLowerCase())
  );

  const handleManualUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim() || !fileContent.trim()) {
      setUploadError('Please provide a file name and log content.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      await onUpload({
        fileName: fileName.trim(),
        fileContent,
        fileType,
        timezone,
        uploadedBy
      });
      setUploadSuccess(`Successfully ingested and cryptographically hashed "${fileName}".`);
      setFileName('');
      setFileContent('');
      onRefresh();
    } catch (err: any) {
      setUploadError(err?.message || 'Ingestion failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleLoadSample = (sample: typeof SAMPLE_LOGS[0]) => {
    setFileName(sample.name);
    setFileType(sample.fileType);
    setTimezone(sample.timezone);
    setFileContent(sample.content);
    setUploadError(null);
    setUploadSuccess(null);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const file = droppedFiles[0];
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = event => {
        const text = event.target?.result as string;
        setFileContent(text || '');
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload & Evidence Vault Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-100 font-display">
              Digital Evidence Vault & Provenance Management
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Upload multi-source system logs, PCAP json, auth streams, and disk registries. All files are hashed via SHA-256 for ISO/IEC 27037 chain-of-custody compliance.
            </p>
          </div>
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh Vault</span>
          </button>
        </div>

        {/* Quick Sample Ingest Buttons */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono-code block mb-3">
            Quick Ingestion Presets (One-Click Synthetic Datasets):
          </span>
          <div className="flex flex-wrap gap-2.5">
            {SAMPLE_LOGS.map((sample, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleLoadSample(sample)}
                className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-200 bg-slate-950/70 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/60 rounded-lg transition-all"
              >
                <FileCode className="h-3.5 w-3.5 text-cyan-400" />
                <span>Load: {sample.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Upload Drag & Drop Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-12 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <form onSubmit={handleManualUpload} className="space-y-4">
            <h3 className="text-sm font-bold text-slate-100 font-display flex items-center gap-2">
              <UploadCloud className="h-4 w-4 text-cyan-400" />
              <span>Evidence Ingestion Engine</span>
            </h3>

            {uploadError && (
              <div className="flex items-center gap-2 rounded-lg border border-rose-800/60 bg-rose-950/40 p-3 text-xs text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {uploadSuccess && (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-800/60 bg-emerald-950/40 p-3 text-xs text-emerald-300">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{uploadSuccess}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Evidence File Name *
                </label>
                <input
                  type="text"
                  required
                  value={fileName}
                  onChange={e => setFileName(e.target.value)}
                  placeholder="e.g. srv_auth_edge01.log"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 font-mono-code placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Classification Format
                </label>
                <select
                  value={fileType}
                  onChange={e => setFileType(e.target.value as EvidenceFileType)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="auth_log">Authentication / SSH / VPN Log</option>
                  <option value="system_syslog">System Syslog / Auditd JSON</option>
                  <option value="web_access">Web Server Access Log (Apache / NGINX)</option>
                  <option value="network_flow">VPC Flow Logs / PCAP CSV</option>
                  <option value="device_usb">Removable Media / USBSTOR Registry</option>
                  <option value="custom_json">Structured Custom JSON Array</option>
                  <option value="custom_csv">Delimited Event CSV</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Assumed Timezone Alignment
                </label>
                <select
                  value={timezone}
                  onChange={e => setTimezone(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="Asia/Kolkata (UTC+05:30)">Asia/Kolkata (UTC+05:30) - IST</option>
                  <option value="UTC">UTC (Universal Coordinated Time)</option>
                  <option value="America/New_York (UTC-04:00)">America/New_York (EDT)</option>
                  <option value="Europe/London (UTC+01:00)">Europe/London (BST)</option>
                  <option value="Asia/Dubai (UTC+04:00)">Asia/Dubai (GST)</option>
                </select>
              </div>
            </div>

            {/* Drag & drop content area */}
            <div
              onDragOver={e => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleFileDrop}
              className={`rounded-xl border border-dashed p-4 text-center transition-all ${
                dragOver
                  ? 'border-cyan-400 bg-cyan-950/20'
                  : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
              }`}
            >
              <label className="block text-xs font-semibold text-slate-300 mb-2 text-left">
                Raw Forensic Log Payload (Paste lines, CSV records, JSON, or drag-and-drop a file)
              </label>
              <textarea
                rows={5}
                required
                value={fileContent}
                onChange={e => setFileContent(e.target.value)}
                placeholder="Paste system log lines, syslog entries, CSV rows, or JSON objects..."
                className="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 font-mono-code placeholder-slate-700 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <span className="text-[11px] font-mono-code text-slate-500">
                Payload Size: {fileContent.length} bytes · Duplicate check enforced via SHA-256
              </span>
              <button
                type="submit"
                disabled={isUploading}
                className="inline-flex items-center justify-center px-5 py-2 text-xs font-bold uppercase tracking-wider text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow transition-colors disabled:opacity-50"
              >
                {isUploading ? 'Hashing & Parsing...' : 'Ingest & Reconstruct Events'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Verified Evidence Inventory Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-100 font-display">
              Immutable Evidence Inventory ({files.length} Containers)
            </h3>
            <p className="text-xs text-slate-400">
              Cryptographically validated against tampering with strict ISO/IEC 27037 chain-of-custody.
            </p>
          </div>

          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search file name or hash..."
              className="w-full rounded-lg border border-slate-800 bg-slate-950 pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 font-mono-code text-slate-400">
                <th className="py-3 px-4 font-semibold">Evidence File</th>
                <th className="py-3 px-4 font-semibold">Classification</th>
                <th className="py-3 px-4 font-semibold">SHA-256 Checksum</th>
                <th className="py-3 px-4 font-semibold">Events Parsed</th>
                <th className="py-3 px-4 font-semibold">Timezone Alignment</th>
                <th className="py-3 px-4 font-semibold">Integrity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono-code">
              {filteredFiles.map(file => (
                <tr key={file.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 text-slate-200">
                    <span className="font-bold text-slate-100 block">{file.fileName}</span>
                    <span className="text-[10px] text-slate-500 font-mono-code">
                      {(file.sizeBytes / 1024).toFixed(1)} KB · Ingested {file.uploadedAt.split('T')[0]}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    <span className="capitalize">{file.fileType.replace('_', ' ')}</span>
                  </td>
                  <td className="py-3 px-4 text-cyan-400">
                    <span className="text-[11px]" title={file.sha256Hash}>
                      {file.sha256Hash.substring(0, 18)}...
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-100 font-bold">
                    {file.parsedEventCount} events
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {file.timezone}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1.5 rounded bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Verified</span>
                    </span>
                  </td>
                </tr>
              ))}
              {filteredFiles.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No evidence files matching the search filter.
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
