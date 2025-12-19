import type React from 'react';
import { useState } from 'react';
import { Users, Hash, Building, Award, Calendar } from 'lucide-react';
import type { DashboardWelderInfo } from './WelderDashboard';

interface DashboardLoginProps {
  onLogin: (info: DashboardWelderInfo) => void;
}

const DashboardLogin: React.FC<DashboardLoginProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    certificationLevel: '',
    employer: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const certificationLevels = [
    'CWI - Certified Welding Inspector',
    'CWE - Certified Welding Educator',
    'CWS - Certified Welding Supervisor',
    'SCWI - Senior Certified Welding Inspector',
    'Level I - Visual Testing',
    'Level II - Advanced Testing',
    'AWS D1.1 Qualified',
    'ASME IX Qualified',
    'API 1104 Qualified'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.employeeId.trim()) {
      newErrors.employeeId = 'Employee ID is required';
    }

    if (!formData.certificationLevel) {
      newErrors.certificationLevel = 'Certification level is required';
    }

    if (!formData.employer.trim()) {
      newErrors.employer = 'Employer is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const welderInfo: DashboardWelderInfo = {
        id: `welder_${Date.now()}`,
        ...formData,
        loginDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      onLogin(welderInfo);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Welder Dashboard</h2>
            <p className="text-slate-300">Access your performance metrics and compliance tracking</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.name ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
            </div>

            {/* Employee ID */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Employee ID *
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={formData.employeeId}
                  onChange={(e) => handleInputChange('employeeId', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.employeeId ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder="e.g., WLD-001"
                />
              </div>
              {errors.employeeId && <p className="mt-1 text-sm text-red-400">{errors.employeeId}</p>}
            </div>

            {/* Certification Level */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Certification Level *
              </label>
              <div className="relative">
                <Award className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <select
                  value={formData.certificationLevel}
                  onChange={(e) => handleInputChange('certificationLevel', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none ${
                    errors.certificationLevel ? 'border-red-500' : 'border-slate-600'
                  }`}
                >
                  <option value="">Select certification level</option>
                  {certificationLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
              {errors.certificationLevel && <p className="mt-1 text-sm text-red-400">{errors.certificationLevel}</p>}
            </div>

            {/* Employer */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Employer *
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={formData.employer}
                  onChange={(e) => handleInputChange('employer', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.employer ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder="Enter employer name"
                />
              </div>
              {errors.employer && <p className="mt-1 text-sm text-red-400">{errors.employer}</p>}
            </div>

            {/* Current Date Display */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Login Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <div className="w-full pl-10 pr-4 py-3 bg-slate-600 border border-slate-600 rounded-lg text-slate-300">
                  {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800"
            >
              Access Dashboard
            </button>
          </form>

          <div className="mt-6 p-4 bg-orange-900/30 border border-orange-700 rounded-lg">
            <h3 className="text-sm font-medium text-orange-300 mb-2">Dashboard Features</h3>
            <ul className="text-xs text-orange-200 space-y-1">
              <li>• WPS/PQR Assignment Tracking</li>
              <li>• Defect Logging & Analysis</li>
              <li>• Certification Management</li>
              <li>• Performance Analytics</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLogin;
