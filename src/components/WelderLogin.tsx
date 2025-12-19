import type React from 'react';
import { useState } from 'react';
import { User, Building, Hash, Calendar } from 'lucide-react';
import type { WelderInfo } from '../App';

interface WelderLoginProps {
  onLogin: (info: WelderInfo) => void;
}

const WelderLogin: React.FC<WelderLoginProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    certId: '',
    company: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Welder name is required';
    }

    if (!formData.certId.trim()) {
      newErrors.certId = 'Certification ID is required';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const welderInfo: WelderInfo = {
        ...formData,
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
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
    <div className="max-w-md mx-auto">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Inspector Login</h2>
          <p className="text-slate-300">Enter your information to begin AWS D1.1 Clause 6 inspection</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Welder Name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Inspector Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
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

          {/* Certification ID */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Certification ID *
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={formData.certId}
                onChange={(e) => handleInputChange('certId', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.certId ? 'border-red-500' : 'border-slate-600'
                }`}
                placeholder="e.g., CWI-12345"
              />
            </div>
            {errors.certId && <p className="mt-1 text-sm text-red-400">{errors.certId}</p>}
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Company/Organization *
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.company ? 'border-red-500' : 'border-slate-600'
                }`}
                placeholder="Enter company name"
              />
            </div>
            {errors.company && <p className="mt-1 text-sm text-red-400">{errors.company}</p>}
          </div>

          {/* Current Date Display */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Inspection Date
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
            Begin Inspection
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
          <h3 className="text-sm font-medium text-blue-300 mb-2">AWS D1.1 Clause 6 Coverage</h3>
          <p className="text-xs text-blue-200">
            This inspection covers visual examination criteria including undercut, cracks, porosity,
            overlap, incomplete fusion, arc strikes, weld profile, and base metal condition.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelderLogin;
