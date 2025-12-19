import type React from 'react';
import { useState, useEffect } from 'react';
import { Plus, Award, Calendar, AlertTriangle, CheckCircle, Bell } from 'lucide-react';
import type { DashboardWelderInfo } from './WelderDashboard';

interface Certification {
  id: string;
  type: string;
  certificationBody: string;
  certNumber: string;
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'expiring' | 'expired';
  daysRemaining: number;
  reminderSent: boolean;
  notes: string;
}

interface CertTrackerProps {
  welderInfo: DashboardWelderInfo | null;
}

const CertTracker: React.FC<CertTrackerProps> = ({ welderInfo }) => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [reminderSettings, setReminderSettings] = useState({
    firstReminder: 60,
    secondReminder: 30,
    finalReminder: 7
  });
  const [formData, setFormData] = useState({
    type: '',
    certificationBody: '',
    certNumber: '',
    issueDate: '',
    expiryDate: '',
    notes: ''
  });

  const certificationTypes = [
    'WPQ - Welder Performance Qualification',
    'CWI - Certified Welding Inspector',
    'CWE - Certified Welding Educator',
    'CWS - Certified Welding Supervisor',
    'SCWI - Senior Certified Welding Inspector',
    'AWS D1.1 Structural Welding',
    'ASME Section IX',
    'API 1104 Pipeline Welding',
    'AWS D1.5 Bridge Welding',
    'AWS D1.3 Structural Welding Sheet Steel',
    'ASNT Level II VT',
    'ASNT Level II PT',
    'ASNT Level II MT',
    'ASNT Level II RT',
    'ASNT Level II UT',
    'Other Certification'
  ];

  const certificationBodies = [
    'AWS - American Welding Society',
    'ASME - American Society of Mechanical Engineers',
    'API - American Petroleum Institute',
    'ASNT - American Society for Nondestructive Testing',
    'CWB - Canadian Welding Bureau',
    'CSWIP - Certification Scheme for Welding and Inspection Personnel',
    'IIW - International Institute of Welding',
    'Other'
  ];

  // Calculate certification status and days remaining
  const calculateCertStatus = (expiryDate: string): { status: 'active' | 'expiring' | 'expired', daysRemaining: number } => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (daysRemaining < 0) return { status: 'expired', daysRemaining: 0 };
    if (daysRemaining <= reminderSettings.secondReminder) return { status: 'expiring', daysRemaining };
    return { status: 'active', daysRemaining };
  };

  // Load certifications from localStorage
  useEffect(() => {
    if (welderInfo) {
      const saved = localStorage.getItem(`certifications-${welderInfo.id}`);
      if (saved) {
        try {
          const certs = JSON.parse(saved);
          const updatedCerts = certs.map((cert: Certification) => {
            const { status, daysRemaining } = calculateCertStatus(cert.expiryDate);
            return { ...cert, status, daysRemaining };
          });
          setCertifications(updatedCerts);
        } catch (error) {
          console.error('Error loading certifications:', error);
        }
      } else {
        // Add some dummy data for testing
        const dummyCerts: Certification[] = [
          {
            id: '1',
            type: 'AWS D1.1 Structural Welding',
            certificationBody: 'AWS - American Welding Society',
            certNumber: 'AWS-D11-2024-001',
            issueDate: '2024-01-15',
            expiryDate: '2025-01-15',
            status: 'active',
            daysRemaining: 0,
            reminderSent: false,
            notes: 'Structural steel welding certification'
          },
          {
            id: '2',
            type: 'CWI - Certified Welding Inspector',
            certificationBody: 'AWS - American Welding Society',
            certNumber: 'CWI-12345',
            issueDate: '2023-06-01',
            expiryDate: '2025-06-01',
            status: 'active',
            daysRemaining: 0,
            reminderSent: false,
            notes: 'Level II Visual Testing certification'
          },
          {
            id: '3',
            type: 'ASNT Level II VT',
            certificationBody: 'ASNT - American Society for Nondestructive Testing',
            certNumber: 'VT-789',
            issueDate: '2022-03-15',
            expiryDate: '2025-03-15',
            status: 'expiring',
            daysRemaining: 0,
            reminderSent: false,
            notes: 'Visual testing certification - renewal required'
          }
        ];

        const updatedCerts = dummyCerts.map(cert => {
          const { status, daysRemaining } = calculateCertStatus(cert.expiryDate);
          return { ...cert, status, daysRemaining };
        });

        setCertifications(updatedCerts);
        localStorage.setItem(`certifications-${welderInfo.id}`, JSON.stringify(updatedCerts));
      }
    }
  }, [welderInfo, reminderSettings]);

  const saveRecords = (certs: Certification[]) => {
    if (welderInfo) {
      localStorage.setItem(`certifications-${welderInfo.id}`, JSON.stringify(certs));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { status, daysRemaining } = calculateCertStatus(formData.expiryDate);

    const newCertification: Certification = {
      id: `cert_${Date.now()}`,
      ...formData,
      status,
      daysRemaining,
      reminderSent: false
    };

    const updatedCerts = [...certifications, newCertification];
    setCertifications(updatedCerts);
    saveRecords(updatedCerts);

    // Reset form
    setFormData({
      type: '',
      certificationBody: '',
      certNumber: '',
      issueDate: '',
      expiryDate: '',
      notes: ''
    });
    setShowAddForm(false);
  };

  const sendReminder = (certId: string) => {
    const updatedCerts = certifications.map(cert =>
      cert.id === certId ? { ...cert, reminderSent: true } : cert
    );
    setCertifications(updatedCerts);
    saveRecords(updatedCerts);

    // In a real app, this would send an actual email/notification
    alert('Reminder notification sent!');
  };

  const renewCertification = (certId: string) => {
    const cert = certifications.find(c => c.id === certId);
    if (cert) {
      setFormData({
        type: cert.type,
        certificationBody: cert.certificationBody,
        certNumber: '',
        issueDate: new Date().toISOString().split('T')[0],
        expiryDate: '',
        notes: `Renewal of ${cert.certNumber}`
      });
      setShowAddForm(true);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-900/30 border-green-700';
      case 'expiring': return 'text-yellow-400 bg-yellow-900/30 border-yellow-700';
      case 'expired': return 'text-red-400 bg-red-900/30 border-red-700';
      default: return 'text-slate-400 bg-slate-900/30 border-slate-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'expiring': case 'expired': return <AlertTriangle className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };

  const getCertStats = () => {
    return {
      total: certifications.length,
      active: certifications.filter(c => c.status === 'active').length,
      expiring: certifications.filter(c => c.status === 'expiring').length,
      expired: certifications.filter(c => c.status === 'expired').length
    };
  };

  const stats = getCertStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Certification Tracker</h2>
          <p className="text-slate-300">Monitor certification status and renewal dates</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Certification</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">Total Certs</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <Award className="w-8 h-8 text-slate-400" />
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">Active</p>
              <p className="text-2xl font-bold text-green-400">{stats.active}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">Expiring Soon</p>
              <p className="text-2xl font-bold text-yellow-400">{stats.expiring}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">Expired</p>
              <p className="text-2xl font-bold text-red-400">{stats.expired}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Reminder Settings */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Bell className="w-5 h-5 mr-2" />
          Reminder Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-slate-300 mb-2">First Reminder (days)</label>
            <input
              type="number"
              value={reminderSettings.firstReminder}
              onChange={(e) => setReminderSettings(prev => ({ ...prev, firstReminder: Number.parseInt(e.target.value) }))}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-2">Second Reminder (days)</label>
            <input
              type="number"
              value={reminderSettings.secondReminder}
              onChange={(e) => setReminderSettings(prev => ({ ...prev, secondReminder: Number.parseInt(e.target.value) }))}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-2">Final Reminder (days)</label>
            <input
              type="number"
              value={reminderSettings.finalReminder}
              onChange={(e) => setReminderSettings(prev => ({ ...prev, finalReminder: Number.parseInt(e.target.value) }))}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
              min="1"
            />
          </div>
        </div>
      </div>

      {/* Certifications List */}
      <div className="space-y-4">
        {certifications.map((cert) => (
          <div key={cert.id} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">{cert.type}</h3>
                  <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(cert.status)}`}>
                    {getStatusIcon(cert.status)}
                    <span className="capitalize">{cert.status}</span>
                  </span>
                  {cert.status === 'expiring' && (
                    <span className="text-yellow-400 text-sm font-medium">
                      {cert.daysRemaining} days remaining
                    </span>
                  )}
                  {cert.status === 'expired' && (
                    <span className="text-red-400 text-sm font-medium">
                      Expired
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-slate-400 text-sm">Certification Body</p>
                    <p className="text-slate-300">{cert.certificationBody}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Certificate Number</p>
                    <p className="text-slate-300 font-mono">{cert.certNumber}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Issue Date</p>
                    <p className="text-slate-300">{new Date(cert.issueDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Expiry Date</p>
                    <p className="text-slate-300">{new Date(cert.expiryDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {cert.notes && (
                  <div className="bg-slate-700/50 rounded-lg p-3 mb-3">
                    <p className="text-slate-300 text-sm">{cert.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col space-y-2 ml-4">
                {(cert.status === 'expiring' || cert.status === 'expired') && !cert.reminderSent && (
                  <button
                    onClick={() => sendReminder(cert.id)}
                    className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded-lg transition-colors flex items-center space-x-1"
                  >
                    <Bell className="w-3 h-3" />
                    <span>Send Reminder</span>
                  </button>
                )}

                {cert.status === 'expiring' && (
                  <button
                    onClick={() => renewCertification(cert.id)}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                  >
                    Renew
                  </button>
                )}

                {cert.status === 'expired' && (
                  <button
                    onClick={() => renewCertification(cert.id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                  >
                    Re-certify
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {certifications.length === 0 && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700 text-center">
            <Award className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400">No certifications tracked yet. Add your first certification to get started.</p>
          </div>
        )}
      </div>

      {/* Add Certification Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-6">Add New Certification</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Certification Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  required
                >
                  <option value="">Select certification type</option>
                  {certificationTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Certification Body *</label>
                <select
                  value={formData.certificationBody}
                  onChange={(e) => setFormData({ ...formData, certificationBody: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  required
                >
                  <option value="">Select certification body</option>
                  {certificationBodies.map(body => (
                    <option key={body} value={body}>{body}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Certificate Number *</label>
                <input
                  type="text"
                  value={formData.certNumber}
                  onChange={(e) => setFormData({ ...formData, certNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  placeholder="e.g., CWI-12345"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Issue Date *</label>
                  <input
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Expiry Date *</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white h-24 resize-none"
                  placeholder="Additional notes about this certification..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Add Certification
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setFormData({
                      type: '',
                      certificationBody: '',
                      certNumber: '',
                      issueDate: '',
                      expiryDate: '',
                      notes: ''
                    });
                  }}
                  className="flex-1 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertTracker;
