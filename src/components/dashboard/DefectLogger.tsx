import type React from 'react';
import { useState, useEffect } from 'react';
import { Plus, AlertTriangle, Camera, Calendar, TrendingUp, Filter } from 'lucide-react';
import type { DashboardWelderInfo } from './WelderDashboard';

interface DefectRecord {
  id: string;
  jointId: string;
  defectType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location: string;
  detectionMethod: string;
  photos: string[];
  reportedDate: string;
  status: 'open' | 'repaired' | 'accepted';
  notes: string;
  linkedInspectionId?: string;
}

interface DefectLoggerProps {
  welderInfo: DashboardWelderInfo | null;
}

const DefectLogger: React.FC<DefectLoggerProps> = ({ welderInfo }) => {
  const [defectRecords, setDefectRecords] = useState<DefectRecord[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [photoUploading, setPhotoUploading] = useState(false);
  const [formData, setFormData] = useState({
    jointId: '',
    defectType: '',
    severity: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    description: '',
    location: '',
    detectionMethod: '',
    photos: [] as string[],
    notes: ''
  });

  const defectTypes = [
    'Undercut',
    'Porosity',
    'Slag Inclusion',
    'Lack of Fusion',
    'Lack of Penetration',
    'Cracks',
    'Overlap',
    'Burn Through',
    'Arc Strike',
    'Incomplete Joint Penetration',
    'Excessive Reinforcement',
    'Underfill',
    'Misalignment',
    'Root Concavity'
  ];

  const detectionMethods = [
    'Visual Testing (VT)',
    'Liquid Penetrant Testing (PT)',
    'Magnetic Particle Testing (MT)',
    'Radiographic Testing (RT)',
    'Ultrasonic Testing (UT)',
    'Other NDT Method'
  ];

  // Load defect records from localStorage
  useEffect(() => {
    if (welderInfo) {
      const saved = localStorage.getItem(`defect-records-${welderInfo.id}`);
      if (saved) {
        try {
          setDefectRecords(JSON.parse(saved));
        } catch (error) {
          console.error('Error loading defect records:', error);
        }
      } else {
        // Add some dummy data for testing
        const dummyRecords: DefectRecord[] = [
          {
            id: '1',
            jointId: 'J-001',
            defectType: 'Undercut',
            severity: 'medium',
            description: 'Minor undercut detected at weld toe',
            location: 'Weld toe, 6 inches from start',
            detectionMethod: 'Visual Testing (VT)',
            photos: [],
            reportedDate: new Date().toISOString().split('T')[0],
            status: 'open',
            notes: 'Requires grinding and repair'
          },
          {
            id: '2',
            jointId: 'J-003',
            defectType: 'Porosity',
            severity: 'low',
            description: 'Small gas pockets in weld face',
            location: 'Center of weld, pass 2',
            detectionMethod: 'Visual Testing (VT)',
            photos: [],
            reportedDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
            status: 'repaired',
            notes: 'Repaired by removing and rewelding affected area'
          }
        ];
        setDefectRecords(dummyRecords);
        localStorage.setItem(`defect-records-${welderInfo.id}`, JSON.stringify(dummyRecords));
      }
    }
  }, [welderInfo]);

  const saveRecords = (records: DefectRecord[]) => {
    if (welderInfo) {
      localStorage.setItem(`defect-records-${welderInfo.id}`, JSON.stringify(records));
    }
  };

  const handlePhotoUpload = async (file: File) => {
    setPhotoUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setFormData(prev => ({
          ...prev,
          photos: [...prev.photos, base64]
        }));
        setPhotoUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Failed to upload photo:', error);
      setPhotoUploading(false);
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newRecord: DefectRecord = {
      id: `defect_${Date.now()}`,
      ...formData,
      reportedDate: new Date().toISOString().split('T')[0],
      status: 'open'
    };

    const updatedRecords = [...defectRecords, newRecord];
    setDefectRecords(updatedRecords);
    saveRecords(updatedRecords);

    // Reset form
    setFormData({
      jointId: '',
      defectType: '',
      severity: 'medium',
      description: '',
      location: '',
      detectionMethod: '',
      photos: [],
      notes: ''
    });
    setShowAddForm(false);
  };

  const updateDefectStatus = (id: string, status: 'open' | 'repaired' | 'accepted') => {
    const updatedRecords = defectRecords.map(record =>
      record.id === id ? { ...record, status } : record
    );
    setDefectRecords(updatedRecords);
    saveRecords(updatedRecords);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-blue-400 bg-blue-900/30 border-blue-700';
      case 'medium': return 'text-yellow-400 bg-yellow-900/30 border-yellow-700';
      case 'high': return 'text-orange-400 bg-orange-900/30 border-orange-700';
      case 'critical': return 'text-red-400 bg-red-900/30 border-red-700';
      default: return 'text-slate-400 bg-slate-900/30 border-slate-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-red-400 bg-red-900/30 border-red-700';
      case 'repaired': return 'text-green-400 bg-green-900/30 border-green-700';
      case 'accepted': return 'text-blue-400 bg-blue-900/30 border-blue-700';
      default: return 'text-slate-400 bg-slate-900/30 border-slate-700';
    }
  };

  const filteredRecords = defectRecords.filter(record => {
    const statusMatch = filterStatus === 'all' || record.status === filterStatus;
    const typeMatch = filterType === 'all' || record.defectType === filterType;
    return statusMatch && typeMatch;
  });

  const getDefectStats = () => {
    return {
      total: defectRecords.length,
      open: defectRecords.filter(r => r.status === 'open').length,
      repaired: defectRecords.filter(r => r.status === 'repaired').length,
      critical: defectRecords.filter(r => r.severity === 'critical').length
    };
  };

  const stats = getDefectStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Defect Logger</h2>
          <p className="text-slate-300">Track and manage welding defects and repairs</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Log Defect</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">Total Defects</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-slate-400" />
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">Open Defects</p>
              <p className="text-2xl font-bold text-red-400">{stats.open}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">Repaired</p>
              <p className="text-2xl font-bold text-green-400">{stats.repaired}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">Critical</p>
              <p className="text-2xl font-bold text-red-400">{stats.critical}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-slate-400" />
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="repaired">Repaired</option>
                <option value="accepted">Accepted</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1">Defect Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
              >
                <option value="all">All Types</option>
                {defectTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Defect Records */}
      <div className="space-y-4">
        {filteredRecords.map((record) => (
          <div key={record.id} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">Joint {record.jointId}</h3>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${getSeverityColor(record.severity)}`}>
                    {record.severity.toUpperCase()}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${getStatusColor(record.status)}`}>
                    {record.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-blue-400 font-medium mb-1">{record.defectType}</p>
                <p className="text-slate-300 text-sm mb-2">{record.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-400">
                  <div>
                    <span className="font-medium">Location:</span> {record.location}
                  </div>
                  <div>
                    <span className="font-medium">Detection:</span> {record.detectionMethod}
                  </div>
                  <div>
                    <span className="font-medium">Reported:</span> {new Date(record.reportedDate).toLocaleDateString()}
                  </div>
                </div>
                {record.notes && (
                  <div className="mt-3 p-3 bg-slate-700/50 rounded-lg">
                    <p className="text-slate-300 text-sm">{record.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 ml-4">
                {record.status === 'open' && (
                  <>
                    <button
                      onClick={() => updateDefectStatus(record.id, 'repaired')}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                    >
                      Mark Repaired
                    </button>
                    <button
                      onClick={() => updateDefectStatus(record.id, 'accepted')}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                    >
                      Accept
                    </button>
                  </>
                )}
                {record.status === 'repaired' && (
                  <button
                    onClick={() => updateDefectStatus(record.id, 'open')}
                    className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded-lg transition-colors"
                  >
                    Reopen
                  </button>
                )}
              </div>
            </div>

            {/* Photos */}
            {record.photos && record.photos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                {record.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Defect ${record.defectType} ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border border-slate-600"
                  />
                ))}
              </div>
            )}
          </div>
        ))}

        {filteredRecords.length === 0 && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700 text-center">
            <AlertTriangle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400">No defects found matching the current filters.</p>
          </div>
        )}
      </div>

      {/* Add Defect Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-6">Log New Defect</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Joint ID *</label>
                  <input
                    type="text"
                    value={formData.jointId}
                    onChange={(e) => setFormData({ ...formData, jointId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    placeholder="e.g., J-001"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Defect Type *</label>
                  <select
                    value={formData.defectType}
                    onChange={(e) => setFormData({ ...formData, defectType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    required
                  >
                    <option value="">Select defect type</option>
                    {defectTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Severity *</label>
                  <select
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value as typeof formData.severity })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    required
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Detection Method *</label>
                  <select
                    value={formData.detectionMethod}
                    onChange={(e) => setFormData({ ...formData, detectionMethod: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    required
                  >
                    <option value="">Select method</option>
                    {detectionMethods.map(method => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white h-20 resize-none"
                  placeholder="Describe the defect..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Location *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  placeholder="e.g., Weld toe, 6 inches from start"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Photos</label>
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-4">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      files.forEach(file => handlePhotoUpload(file));
                    }}
                    className="hidden"
                    id="defect-photos"
                    disabled={photoUploading}
                  />
                  <label
                    htmlFor="defect-photos"
                    className="flex items-center justify-center space-x-2 cursor-pointer text-slate-400 hover:text-white"
                  >
                    <Camera className="w-5 h-5" />
                    <span>{photoUploading ? 'Uploading...' : 'Click to upload photos'}</span>
                  </label>

                  {formData.photos.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      {formData.photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={photo}
                            alt={`Defect photo ${index + 1}`}
                            className="w-full h-20 object-cover rounded border border-slate-600"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Additional Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white h-20 resize-none"
                  placeholder="Additional notes, repair instructions, etc..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Log Defect
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setFormData({
                      jointId: '',
                      defectType: '',
                      severity: 'medium',
                      description: '',
                      location: '',
                      detectionMethod: '',
                      photos: [],
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

export default DefectLogger;
