import type React from 'react';
import { CheckCircle, Eye, FileText, Camera, Download, Play, User, Building, Calendar, ArrowRight } from 'lucide-react';

interface InspectionIntroProps {
  welderInfo: {
    name: string;
    certId: string;
    company: string;
    date: string;
  };
  onStartInspection: () => void;
  onBackToLogin: () => void;
}

const InspectionIntro: React.FC<InspectionIntroProps> = ({
  welderInfo,
  onStartInspection,
  onBackToLogin
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-sm rounded-2xl p-8 border border-blue-700/50">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to WeldTrack™ Inspector
          </h1>
          <p className="text-xl text-blue-200 mb-6">
            Professional AWS D1.1 Clause 6 Visual Inspection Platform
          </p>
          <div className="bg-blue-800/30 rounded-lg p-4 inline-block">
            <p className="text-blue-200 text-sm">
              Streamline your welding inspections with digital documentation,
              code compliance checks, and professional PDF reporting.
            </p>
          </div>
        </div>

        {/* Inspector Info Card */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-400" />
            Inspector Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Inspector</p>
                <p className="text-white font-medium">{welderInfo.name}</p>
                <p className="text-xs text-blue-300">Cert: {welderInfo.certId}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Company</p>
                <p className="text-white font-medium">{welderInfo.company}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-600/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Inspection Date</p>
                <p className="text-white font-medium">{welderInfo.date}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What You'll Do Section */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Your AWS D1.1 Clause 6 Visual Inspection Process
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-400">1</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Visual Inspection</h3>
            <p className="text-sm text-slate-300">
              Systematically examine each weld for defects per AWS D1.1 Clause 6.12 criteria
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Photo Documentation</h3>
            <p className="text-sm text-slate-300">
              Capture high-quality photos of defects and overall weld condition
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-amber-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Document Findings</h3>
            <p className="text-sm text-slate-300">
              Record detailed notes and compliance status for each inspection point
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Generate Report</h3>
            <p className="text-sm text-slate-300">
              Create professional PDF inspection report with findings and photos
            </p>
          </div>
        </div>
      </div>

      {/* Inspection Checklist Preview */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-6">
          AWS D1.1 Clause 6.12 Inspection Points
        </h2>
        <p className="text-slate-300 mb-6">
          You'll inspect each weld for the following critical defects and conditions:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-red-900/20 border border-red-700/50 rounded-lg">
              <div className="w-2 h-2 bg-red-400 rounded-full" />
              <div>
                <h4 className="text-white font-medium">Undercut</h4>
                <p className="text-xs text-red-200">Depth ≤ 1/32" acceptable</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-red-900/20 border border-red-700/50 rounded-lg">
              <div className="w-2 h-2 bg-red-400 rounded-full" />
              <div>
                <h4 className="text-white font-medium">Cracks</h4>
                <p className="text-xs text-red-200">ANY crack is cause for rejection</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-orange-900/20 border border-orange-700/50 rounded-lg">
              <div className="w-2 h-2 bg-orange-400 rounded-full" />
              <div>
                <h4 className="text-white font-medium">Porosity</h4>
                <p className="text-xs text-orange-200">Individual pores ≤ 3/32" acceptable</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-red-900/20 border border-red-700/50 rounded-lg">
              <div className="w-2 h-2 bg-red-400 rounded-full" />
              <div>
                <h4 className="text-white font-medium">Overlap</h4>
                <p className="text-xs text-red-200">ANY overlap is cause for rejection</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-red-900/20 border border-red-700/50 rounded-lg">
              <div className="w-2 h-2 bg-red-400 rounded-full" />
              <div>
                <h4 className="text-white font-medium">Incomplete Fusion</h4>
                <p className="text-xs text-red-200">ANY incomplete fusion is rejection</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-400 rounded-full" />
              <div>
                <h4 className="text-white font-medium">Arc Strikes</h4>
                <p className="text-xs text-yellow-200">Outside weld area not permitted</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-blue-900/20 border border-blue-700/50 rounded-lg">
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              <div>
                <h4 className="text-white font-medium">Weld Profile</h4>
                <p className="text-xs text-blue-200">Size, contour, and reinforcement</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-green-900/20 border border-green-700/50 rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <div>
                <h4 className="text-white font-medium">Base Metal Condition</h4>
                <p className="text-xs text-green-200">Preparation and surface condition</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 backdrop-blur-sm rounded-xl p-6 border border-green-700/50">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
          Quick Tips for Success
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ul className="space-y-2 text-sm text-green-200">
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
              <span>Use the Code Reference sidebar for instant AWS D1.1 lookup</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
              <span>Take clear, well-lit photos from multiple angles</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
              <span>Document all findings with detailed notes</span>
            </li>
          </ul>
          <ul className="space-y-2 text-sm text-blue-200">
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
              <span>Mark high-priority defects for immediate attention</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
              <span>Review all items before generating final report</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
              <span>Your data auto-saves as you work</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onStartInspection}
          className="flex-1 flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Play className="w-6 h-6" />
          <span className="text-lg font-semibold">Start AWS D1.1 Inspection</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <button
          onClick={onBackToLogin}
          className="px-6 py-4 bg-slate-600 hover:bg-slate-700 text-white rounded-xl transition-colors"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default InspectionIntro;
