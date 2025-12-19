import type React from 'react';
import { useState, useEffect } from 'react';
import { Users, FileText, AlertTriangle, BarChart3, Settings, LogOut } from 'lucide-react';
import DashboardLogin from './DashboardLogin';
import WPSPQRTracker from './WPSPQRTracker';
import DefectLogger from './DefectLogger';
import CertTracker from './CertTracker';
import PerformanceDashboard from './PerformanceDashboard';

export interface DashboardWelderInfo {
  id: string;
  name: string;
  employeeId: string;
  certificationLevel: string;
  employer: string;
  loginDate: string;
}

type DashboardView = 'login' | 'wps' | 'defects' | 'certs' | 'performance';

const WelderDashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<DashboardView>('login');
  const [welderInfo, setWelderInfo] = useState<DashboardWelderInfo | null>(null);

  // Load saved welder info on component mount
  useEffect(() => {
    const savedWelder = localStorage.getItem('dashboard-welder');
    if (savedWelder) {
      try {
        const parsed = JSON.parse(savedWelder);
        setWelderInfo(parsed);
        setCurrentView('wps'); // Start with WPS view if already logged in
      } catch (error) {
        console.error('Error loading saved welder info:', error);
        localStorage.removeItem('dashboard-welder');
      }
    }
  }, []);

  const handleWelderLogin = (info: DashboardWelderInfo) => {
    setWelderInfo(info);
    setCurrentView('wps');
    localStorage.setItem('dashboard-welder', JSON.stringify(info));
  };

  const handleLogout = () => {
    setWelderInfo(null);
    setCurrentView('login');
    localStorage.removeItem('dashboard-welder');
  };

  const navigationItems = [
    { id: 'wps' as DashboardView, label: 'WPS/PQR', icon: FileText, description: 'Welding Procedures' },
    { id: 'defects' as DashboardView, label: 'Defects', icon: AlertTriangle, description: 'Defect Logging' },
    { id: 'certs' as DashboardView, label: 'Certifications', icon: Users, description: 'Cert Tracking' },
    { id: 'performance' as DashboardView, label: 'Performance', icon: BarChart3, description: 'Analytics' }
  ];

  if (currentView === 'login') {
    return <DashboardLogin onLogin={handleWelderLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-slate-800/90 backdrop-blur-sm border-r border-slate-700 min-h-screen">
          <div className="p-6">
            {/* Welder Info */}
            <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium">{welderInfo?.name}</h3>
                  <p className="text-slate-300 text-sm">ID: {welderInfo?.employeeId}</p>
                </div>
              </div>
              <div className="text-xs text-slate-400 space-y-1">
                <p>Level: {welderInfo?.certificationLevel}</p>
                <p>Employer: {welderInfo?.employer}</p>
                <p>Session: {welderInfo?.loginDate}</p>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-left ${
                      currentView === item.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <div>
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs opacity-75">{item.description}</div>
                    </div>
                  </button>
                );
              })}
            </nav>

            {/* Logout Button */}
            <div className="mt-8 pt-6 border-t border-slate-700">
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-red-600/20 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {currentView === 'wps' && <WPSPQRTracker welderInfo={welderInfo} />}
            {currentView === 'defects' && <DefectLogger welderInfo={welderInfo} />}
            {currentView === 'certs' && <CertTracker welderInfo={welderInfo} />}
            {currentView === 'performance' && <PerformanceDashboard welderInfo={welderInfo} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelderDashboard;
