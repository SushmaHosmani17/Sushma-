import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { DashboardLayout } from './components/DashboardLayout';
import { AppointmentModal } from './components/AppointmentModal';
import { api } from './services/api';
import type { BusinessProfile } from './types/forensics';

// Fallback verified business profile in case of server bootstrapping delay
const DEFAULT_BUSINESS_PROFILE: BusinessProfile = {
  name: 'Talfor Digital Forensics',
  category: 'Forensic Consultant / Digital Forensics & Incident Response (DFIR)',
  legalEntity: 'Talfor Digital Forensics Private Limited',
  tagline: 'Precision Cyber Forensics, Evidence Reconstruction & Event Correlation',
  address: '#43, 2nd Main Rd, Ramachandrapura, Rajajinagar',
  landmark: 'Near Ramachandrapura Main Junction',
  city: 'Bengaluru',
  state: 'Karnataka',
  country: 'India',
  pincode: '560021',
  phoneIndia: '+91 82-17-30-41-05',
  phoneUAE: '+97 15-01-44-40-55',
  email: 'info@talfor.in',
  website: 'https://talfor.in',
  operatingHours: 'Monday – Saturday: 09:30 AM – 06:30 PM IST (Emergency 24/7 DFIR Hotline)',
  emergencyResponse: '24/7 Rapid Incident Response & Live Memory Acquisition Team',
  services: [
    'Cyber Forensic Investigations',
    'Timeline Reconstruction & Multi-Source Event Correlation',
    'Data Recovery Forensics (SSD, RAID, CCTV/DVR, NAND Flash)',
    'Electronic Data Discovery (EDD) & Legal Litigation Support',
    'Incident Response & Threat Hunting (DFIR)',
    'Mobile Device & IoT Forensic Extractions',
    'Network Packet & Cloud Log Deep Analysis',
    'Corporate Fraud & Insider Threat Investigations',
    'Accredited Law Enforcement & Enterprise Forensics Training'
  ],
  certifications: ['ISO/IEC 27037 Digital Evidence Compliance', 'EnCE Certified', 'GIAC Certified Incident Handler (GCIH)'],
  googleMapsUrl: 'https://maps.app.goo.gl/2woyir9KjeJUNXfi9',
  coordinates: {
    lat: 12.9829375,
    lng: 77.5628125
  }
};

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [business, setBusiness] = useState<BusinessProfile>(DEFAULT_BUSINESS_PROFILE);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  useEffect(() => {
    api.getBusinessProfile()
      .then(data => {
        if (data) setBusiness(data);
      })
      .catch(() => {
        // Uses verified default profile
      });
  }, []);

  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      {currentView === 'landing' ? (
        <>
          <Navbar
            currentView={currentView}
            onNavigateView={setCurrentView}
            onNavigateSection={handleNavigateSection}
            onBookAppointment={() => setShowAppointmentModal(true)}
          />
          <main>
            <LandingPage
              business={business}
              onLaunchInvestigation={() => setCurrentView('dashboard')}
              onBookAppointment={() => setShowAppointmentModal(true)}
            />
          </main>
        </>
      ) : (
        <DashboardLayout
          business={business}
          onBackToLanding={() => setCurrentView('landing')}
          onBookAppointment={() => setShowAppointmentModal(true)}
        />
      )}

      {showAppointmentModal && (
        <AppointmentModal
          onClose={() => setShowAppointmentModal(false)}
        />
      )}
    </div>
  );
}

