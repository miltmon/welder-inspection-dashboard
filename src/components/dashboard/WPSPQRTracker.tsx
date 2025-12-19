import type React from 'react';
import { useState, useEffect } from 'react';
import { Plus, FileText, Calendar, AlertTriangle, CheckCircle, Edit, Trash2 } from 'lucide-react';
import type { DashboardWelderInfo } from './WelderDashboard';

interface WPSRecord {
  id: string;
  wpsId: string;
  process: string;
  materialSpec: string;
  thickness: string;
  position: string;
  issueDate: string;
  expirationDate: string;
  status: 'active' | 'expiring' | 'expired';
  notes: string;
}

interface WPSPQRTrackerProps {
  welderInfo: DashboardWelderInfo | null;
}

const WPSPQRTracker: React.FC<WPSPQRTrackerProps> = ({ welderInfo }) => {
  const [wpsRecords, setWpsRecords] = useState<WPSRecord[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<WPSRecord | null>(null);
  const [formData, setFormData] = useState({
    wpsId: '',
    process: '',
    materialSpec: '',
    thickness: '',
    position: '',
    issueDate: '',
    expirationDate: '',
    notes: ''
  });

  const processes = [
    'SMAW - Shielded Metal Arc Welding',
    'GMAW - Gas Metal Arc Welding',
    'GTAW - Gas Tungsten Arc Welding',
    'FCAW - Flux Cored Arc Welding',
    'SAW - Submerged Arc Welding',
    'PAW - Plasma Arc Welding'
  ];

  const positions = ['1G', '2G', '3G', '4G', '5G', '6G', '1F', '2F', '3F', '4F'];

  // Load WPS records from localStorage
  useEffect(() => {
    if (welderInfo) {
      const saved = localStorage.getItem(`wps-records-${welderInfo.id}`);
      if (saved) {
        try {
          const records = JSON.parse(saved);
          setWpsRecords(records.map((record: WPSRecord) => ({
            ...record,
            status: getWPSStatus(record.expirationDate)
          })));
        } catch (error) {
          console.error('Error loading WPS records:', error);
        }
      } else {
        // Add some dummy data for testing
        const dummyRecords: WPSRecord[] = [
          {
            id: '1',
            wpsId: 'GMAW-CS-001',
            process: 'GMAW - Gas Metal Arc Welding',
            materialSpec: 'ASTM A36',
            thickness: '1/4" - 1"',
            position: '1G, 2G, 3G, 4G',
            issueDate: '2024-01-15',
            expirationDate: '2025-01-15',
            status: 'active',
            notes: 'Qualified for structural steel welding'
          },
          {
            id: '2',
            wpsId: 'SMAW-CS-002',
            process: 'SMAW - Shielded Metal Arc Welding',
            materialSpec: 'ASTM A572',
            thickness: '3/8" - 2"',
            position: '3G, 4G',
            issueDate: '2024-02-01',
            expirationDate: '2025-01-01',
            status: 'expiring',
            notes: 'Requires renewal within 30 days'
          }
        ];
        setWpsRecords(dummyRecords);
        localStorage.setItem(`wps-records-${welderInfo.id}`, JSON.stringify(dummyRecords));
      }
    }
  }, [welderInfo]);

  const getWPSStatus = (expirationDate: string): 'active' | 'expiring' | 'expired' => {
    const expiry = new Date(expirationDate);
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    if (expiry < today) return 'expired';
    if (expiry < thirtyDaysFromNow) return 'expiring';
    return 'active';
  };

  const saveRecords = (records: WPSRecord[]) => {
    if (welderInfo) {
      localStorage.setItem(`wps-records-${welderInfo.id}`, JSON.stringify(records));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newRecord: WPSRecord = {
      id: editingRecord ? editingRecord.id : `wps_${Date.now()}`,
      ...formData,
      status: getWPSStatus(formData.expirationDate)
    };

    let updatedRecords: WPSRecord[];
    if (editingRecord) {
      updatedRecords = wpsRecords.map(record =>
        record.id === editingRecord.id ? newRecord : record
      );
    } else {
      updatedRecords = [...wpsRecords, newRecord];
    }

    setWpsRecords(updatedRecords);
    saveRecords(updatedRecords);

    // Reset form
    setFormData({
      wpsId: '',
      process: '',
      materialSpec: '',
      thickness: '',
      position: '',
      issueDate: '',
      expirationDate: '',
      notes: ''
    });
    setShowAddForm(false);
    setEditingRecord(null);
  };

  const handleEdit = (record: WPSRecord) => {
    setFormData({
      wpsId: record.wpsId,
      process: record.process,
      materialSpec: record.materialSpec,
      thickness: record.thickness,
      position: record.position,
      issueDate: record.issueDate,
      expirationDate: record.expirationDate,
      notes: record.notes
    });
    setEditingRecord(record);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this WPS record?')) {
      const updatedRecords = wpsRecords.filter(record => record.id !== id);
      setWpsRecords(updatedRecords);
      saveRecords(updatedRecords);
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
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">WPS/PQR Tracking</h2>
          <p className="text-slate-300">Manage welding procedure specifications and qualifications</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add WPS</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">Active WPS</p>
              <p className="text-2xl font-bold text-green-400">
                {wpsRecords.filter(r => r.status === 'active').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">Expiring Soon</p>
              <p className="text-2xl font-bold text-yellow-400">
                {wpsRecords.filter(r => r.status === 'expiring').length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">Expired</p>
              <p className="text-2xl font-bold text-red-400">
                {wpsRecords.filter(r => r.status === 'expired').length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* WPS Records Table */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white">WPS Records</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="text-left p-4 text-slate-300 font-medium">WPS ID</th>
                <th className="text-left p-4 text-slate-300 font-medium">Process</th>
                <th className="text-left p-4 text-slate-300 font-medium">Material</th>
                <th className="text-left p-4 text-slate-300 font-medium">Position</th>
                <th className="text-left p-4 text-slate-300 font-medium">Expiration</th>
                <th className="text-left p-4 text-slate-300 font-medium">Status</th>
                <th className="text-left p-4 text-slate-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {wpsRecords.map((record) => (
                <tr key={record.id} className="border-t border-slate-700 hover:bg-slate-700/25">
                  <td className="p-4 text-white font-medium">{record.wpsId}</td>
                  <td className="p-4 text-slate-300">{record.process.split(' - ')[0]}</td>
                  <td className="p-4 text-slate-300">{record.materialSpec}</td>
                  <td className="p-4 text-slate-300">{record.position}</td>
                  <td className="p-4 text-slate-300">
                    {new Date(record.expirationDate).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(record.status)}`}>
                      {getStatusIcon(record.status)}
                      <span className="capitalize">{record.status}</span>
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(record)}
                        className="p-1 text-blue-400 hover:text-blue-300"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="p-1 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {wpsRecords.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No WPS records found. Click "Add WPS" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-6">
              {editingRecord ? 'Edit WPS Record' : 'Add New WPS Record'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">WPS ID *</label>
                  <input
                    type="text"
                    value={formData.wpsId}
                    onChange={(e) => setFormData({ ...formData, wpsId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    placeholder="e.g., GMAW-CS-001"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Process *</label>
                  <select
                    value={formData.process}
                    onChange={(e) => setFormData({ ...formData, process: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    required
                  >
                    <option value="">Select process</option>
                    {processes.map(process => (
                      <option key={process} value={process}>{process}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Material Spec *</label>
                  <input
                    type="text"
                    value={formData.materialSpec}
                    onChange={(e) => setFormData({ ...formData, materialSpec: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    placeholder="e.g., ASTM A36"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Thickness Range *</label>
                  <input
                    type="text"
                    value={formData.thickness}
                    onChange={(e) => setFormData({ ...formData, thickness: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    placeholder="e.g., 1/4&quot; - 1&quot;"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Position *</label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    placeholder="e.g., 1G, 2G, 3G, 4G"
                    required
                  />
                </div>

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
                  <label className="block text-sm font-medium text-slate-300 mb-2">Expiration Date *</label>
                  <input
                    type="date"
                    value={formData.expirationDate}
                    onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
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
                  placeholder="Additional notes or qualifications..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  {editingRecord ? 'Update Record' : 'Add Record'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingRecord(null);
                    setFormData({
                      wpsId: '',
                      process: '',
                      materialSpec: '',
                      thickness: '',
                      position: '',
                      issueDate: '',
                      expirationDate: '',
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

export default WPSPQRTracker;
