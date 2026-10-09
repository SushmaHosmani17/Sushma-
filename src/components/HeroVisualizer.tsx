import React, { useState } from 'react';
import { ShieldCheck, GitCommit, ArrowRight, Activity, Terminal, Lock } from 'lucide-react';

interface SimulatedEvent {
  id: string;
  source: string;
  timestamp: string;
  title: string;
  type: string;
  risk: number;
  ip: string;
  user: string;
  status: 'benign' | 'suspicious' | 'critical';
}

const SAMPLE_PATH: SimulatedEvent[] = [
  {
    id: 'EVT-101',
    source: 'radius_vpn.log',
    timestamp: '01:52:10 UTC',
    title: 'Tor Exit Node Auth Failure',
    type: 'auth_failed',
    risk: 65,
    ip: '185.220.101.44',
    user: 'r.sharma',
    status: 'suspicious'
  },
  {
    id: 'EVT-104',
    source: 'radius_vpn.log',
    timestamp: '02:01:05 UTC',
    title: 'Perimeter VPN Tunnel Granted',
    type: 'auth_success',
    risk: 92,
    ip: '185.220.101.44',
    user: 'r.sharma',
    status: 'critical'
  },
  {
    id: 'EVT-106',
    source: 'bastion_ssh.log',
    timestamp: '02:08:44 UTC',
    title: 'Bastion Interactive SSH Shell',
    type: 'auth_success',
    risk: 82,
    ip: '10.240.4.18',
    user: 'r.sharma',
    status: 'critical'
  },
  {
    id: 'EVT-108',
    source: 'auditd_sysmon.json',
    timestamp: '02:13:30 UTC',
    title: 'Sudo Heap Overflow (Root Elevation)',
    type: 'priv_esc',
    risk: 94,
    ip: '10.10.1.5',
    user: 'root',
    status: 'critical'
  },
  {
    id: 'EVT-112',
    source: 'vpc_netflow.csv',
    timestamp: '02:24:50 UTC',
    title: '452MB Exfiltration to C2 Host',
    type: 'exfiltration',
    risk: 96,
    ip: '194.26.29.112',
    user: 'system',
    status: 'critical'
  }
];

export const HeroVisualizer: React.FC<{ onLaunch: () => void }> = ({ onLaunch }) => {
  const [selectedIdx, setSelectedIdx] = useState(1);
  const activeEvt = SAMPLE_PATH[selectedIdx];

  return (
    <div className="relative rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-2xl backdrop-blur-xl">
      {/* Top Header of the Visualizer */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-cyan-950 text-cyan-400">
            <Activity className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-display">
            Live Reconstructed Chrono-Vector
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono-code">
          <span>SHA-256 Verified</span>
          <span aria-hidden="true">·</span>
          <span className="text-cyan-400">ISO/IEC 27037</span>
        </div>
      </div>

      {/* Path Sequence Stepper */}
      <div className="mt-4 grid grid-cols-5 gap-2">
        {SAMPLE_PATH.map((item, index) => {
          const isSelected = index === selectedIdx;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedIdx(index)}
              className={`group flex flex-col items-start rounded-lg p-2.5 text-left transition-all ${
                isSelected
                  ? 'border border-cyan-500/40 bg-slate-800 text-slate-100 shadow-sm'
                  : 'border border-slate-800/80 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex w-full items-center justify-between text-[11px] font-mono-code text-slate-500">
                <span className={isSelected ? 'text-cyan-400 font-medium' : ''}>{item.id}</span>
                <span className="text-[10px]">{item.timestamp.split(' ')[0]}</span>
              </div>
              <div className="mt-1 text-xs font-medium text-slate-200 line-clamp-1">{item.title}</div>
              <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-500 font-mono-code">
                <span>{item.source.split('.')[0]}</span>
                <span aria-hidden="true">·</span>
                <span className={item.risk >= 90 ? 'text-rose-400' : 'text-amber-400'}>
                  Risk {item.risk}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed Node Inspector Box */}
      <div className="mt-4 rounded-xl border border-slate-800/90 bg-slate-950/70 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-cyan-400 font-mono-code">{activeEvt.id}</span>
              <span className="text-xs text-slate-500">/</span>
              <h4 className="text-sm font-semibold text-slate-100 font-display">{activeEvt.title}</h4>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Evidence source: <span className="font-mono-code text-slate-300">{activeEvt.source}</span>
              {' · '}
              Normalized timestamp: <span className="font-mono-code text-slate-300">{activeEvt.timestamp}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono-code text-slate-400">Anomalous Score:</span>
            <span className="rounded bg-rose-950/60 border border-rose-800/60 px-2 py-0.5 text-xs font-semibold text-rose-300 font-mono-code">
              {activeEvt.risk}/100
            </span>
          </div>
        </div>

        {/* Forensic Metadata Grid */}
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 border-t border-slate-800/80 pt-3 text-xs font-mono-code">
          <div>
            <span className="text-slate-500 block text-[11px]">User Account</span>
            <span className="text-slate-300">{activeEvt.user}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">IP Entity</span>
            <span className="text-slate-300">{activeEvt.ip}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Correlation Chain</span>
            <span className="text-cyan-400">Killchain Seq #0{selectedIdx + 1}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">MITRE Tactic</span>
            <span className="text-slate-300">
              {selectedIdx === 0
                ? 'Credential Access'
                : selectedIdx === 1
                ? 'Initial Access'
                : selectedIdx === 2
                ? 'Lateral Movement'
                : selectedIdx === 3
                ? 'Privilege Escalation'
                : 'Exfiltration'}
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-slate-800/80 pt-3">
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            <span>Cryptographic hash immutable seal: Talfor DFIR verified</span>
          </div>
          <button
            onClick={onLaunch}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>Analyze in Workspace</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
