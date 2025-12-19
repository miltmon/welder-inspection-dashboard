import React, { useState, useEffect } from 'react';
import { Wrench, FileText, CheckCircle, BarChart3, LogOut, BookOpen, Sparkles } from 'lucide-react';
import WelderLogin from './components/WelderLogin';
import InspectionIntro from './components/InspectionIntro';
import InspectionChecklist from './components/InspectionChecklist';
import CodeReference from './components/CodeReference';
import SOPReference from './components/SOPReference';
import ReportGenerator from './components/ReportGenerator';
import WelderDashboard from './components/dashboard/WelderDashboard';
import WPSGenerator from './components/WPSGenerator';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import OfflineIndicator from './components/OfflineIndicator';
import { useAuth } from './hooks/useAuth';
import { migrateLocalStorageToFirestore } from './services/firestore';
import { notificationService } from './services/notificationService';

export interface WelderInfo {
  name: string;
  certId: string;
  company: string;
  date: string;
}

export interface InspectionItem {
  id: string;
  name: string;
  description: string;
  status: 'pass' | 'fail' | 'pending';
  notes: string;
  photos: string[];
  priority: 'high' | 'medium' | 'low';
}

type AppMode = 'inspection' | 'dashboard' | 'wps';
type InspectionStep = 'login' | 'intro' | 'inspection' | 'review';

function App() {
  const { currentUser, logout } = useAuth();
  const [appMode, setAppMode] = useState<AppMode>('inspection');
  const [currentStep, setCurrentStep] = useState<InspectionStep>('login');
  const [welderInfo, setWelderInfo] = useState<WelderInfo | null>(null);
  const [inspectionData, setInspectionData] = useState<InspectionItem[]>([]);
  const [showCodeReference, setShowCodeReference] = useState(false);
  const [activeReference, setActiveReference] = useState<'code' | 'sop'>('code');
  const [migrationDone, setMigrationDone] = useState(false);

  // Initialize inspection items based on AWS D1.1 Clause 6
  useEffect(() => {
    const initialInspectionItems: InspectionItem[] = [
      {
        id: 'undercut',
        name: 'Undercut',
        description: 'Check for groove melted into base metal at weld toe',
        status: 'pending',
        notes: '',
        photos: [],
        priority: 'high'
      },
      {
        id: 'cracks',
        name: 'Cracks',
        description: 'Check for any linear discontinuities in weld or base metal',
        status: 'pending',
        notes: '',
        photos: [],
        priority: 'high'
      },
      {
        id: 'porosity',
        name: 'Porosity',
        description: 'Check for gas pockets or voids in weld metal',
        status: 'pending',
        notes: '',
        photos: [],
        priority: 'medium'
      },
      {
        id: 'overlap',
        name: 'Overlap',
        description: 'Check for weld metal extending beyond weld toe without fusion',
        status: 'pending',
        notes: '',
        photos: [],
        priority: 'medium'
      },
      {
        id: 'incomplete-fusion',
        name: 'Incomplete Fusion',
        description: 'Check for lack of fusion between weld and base metal',
        status: 'pending',
        notes: '',
        photos: [],
        priority: 'high'
      },
      {
        id: 'arc-strikes',
        name: 'Arc Strikes',
        description: 'Check for arc strikes outside of weld area',
        status: 'pending',
        notes: '',
        photos: [],
        priority: 'high'
      },
      {
        id: 'weld-profile',
        name: 'Weld Profile',
        description: 'Check weld size, contour, and reinforcement',
        status: 'pending',
        notes: '',
        photos: [],
        priority: 'high'
      },
      {
        id: 'base-metal',
        name: 'Base Metal Condition',
        description: 'Check base metal for proper preparation and condition',
        status: 'pending',
        notes: '',
        photos: [],
        priority: 'medium'
      }
    ];
    setInspectionData(initialInspectionItems);
  }, []);

  // Migrate localStorage data to Firestore when user logs in
  useEffect(() => {
    if (currentUser && !migrationDone) {
      migrateLocalStorageToFirestore(currentUser.uid)
        .then(() => {
          console.log('Data migration completed');
          setMigrationDone(true);
        })
        .catch((error) => {
          console.error('Migration failed:', error);
        });
    }
  }, [currentUser, migrationDone]);

  // Save data to localStorage whenever inspection data changes (fallback)
  useEffect(() => {
    if (welderInfo && inspectionData.length > 0 && appMode === 'inspection') {
      const saveData = {
        welderInfo,
        inspectionData,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('current-inspection', JSON.stringify(saveData));
    }
  }, [welderInfo, inspectionData, appMode]);

  const handleWelderLogin = (info: WelderInfo) => {
    setWelderInfo(info);
    setCurrentStep('intro');
  };

  const updateInspectionItem = (id: string, updates: Partial<InspectionItem>) => {
    setInspectionData(prev =>
      prev.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };

  const getInspectionProgress = () => {
    const completed = inspectionData.filter(item => item.status !== 'pending').length;
    return (completed / inspectionData.length) * 100;
  };

  const getOverallStatus = () => {
    const hasFailures = inspectionData.some(item => item.status === 'fail');
    const allCompleted = inspectionData.every(item => item.status !== 'pending');

    if (!allCompleted) return 'In Progress';
    return hasFailures ? 'FAILED' : 'PASSED';
  };

  const handleLogout = async () => {
    try {
      await logout();
      setWelderInfo(null);
      setCurrentStep('login');
      setAppMode('inspection');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800" style={{backgroundImage: 'linear-gradient(to bottom right, #0f172a, #1e3a8a, #1e40af)'}}>
        {/* Header */}
        <header className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <Wrench className="w-8 h-8 text-orange-400" />
                <div>
                  <h1 className="text-xl font-bold text-white">
                    WeldTrack™ {appMode === 'inspection' ? 'Inspector' : 'Dashboard'}
                  </h1>
                  <p className="text-sm text-amber-300">
                    {appMode === 'inspection'
                      ? currentStep === 'intro'
                        ? 'AWS D1.1 Inspection Overview & Guidance'
                        : 'AWS D1.1 Professional Inspection Platform'
                      : 'Performance & Compliance Management'}
                  </p>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex items-center space-x-1 bg-slate-700/50 rounded-lg p-1">
                <button
                  onClick={() => setAppMode('inspection')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                    appMode === 'inspection'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-slate-300 hover:text-white hover:bg-slate-600/50'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Inspection</span>
                </button>
                <button
                  onClick={() => setAppMode('wps')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                    appMode === 'wps'
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-slate-300 hover:text-white hover:bg-slate-600/50'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden sm:inline">WPS AI</span>
                </button>
                <button
                  onClick={() => setAppMode('dashboard')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                    appMode === 'dashboard'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-slate-300 hover:text-white hover:bg-slate-600/50'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </button>
              </div>

              {/* Right side controls */}
              <div className="flex items-center space-x-4">
                {appMode === 'inspection' && welderInfo && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setActiveReference('code');
                        setShowCodeReference(true);
                      }}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                        showCodeReference && activeReference === 'code'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                      <span className="hidden sm:inline">Code</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveReference('sop');
                        setShowCodeReference(true);
                      }}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                        showCodeReference && activeReference === 'sop'
                          ? 'bg-green-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                      <span className="hidden sm:inline">SOP</span>
                    </button>
                    {showCodeReference && (
                      <button
                        onClick={() => setShowCodeReference(false)}
                        className="p-2 text-slate-400 hover:text-white transition-colors"
                        title="Close Reference"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                )}

                {/* User Info and Logout */}
                {currentUser && (
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">
                        {currentUser.displayName || currentUser.email}
                      </p>
                      <p className="text-xs text-slate-300">
                        {migrationDone ? 'Cloud Sync Active' : 'Syncing...'}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-2 text-slate-400 hover:text-white transition-colors"
                      title="Logout"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-1">
          {/* Reference Sidebar - Only for inspection mode */}
          {appMode === 'inspection' && showCodeReference && (
            <div className="w-80 bg-slate-800 border-r border-slate-700 overflow-y-auto">
              {activeReference === 'code' ? <CodeReference /> : <SOPReference />}
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {appMode === 'inspection' ? (
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {currentStep === 'login' && (
                  <WelderLogin onLogin={handleWelderLogin} />
                )}

                {currentStep === 'intro' && welderInfo && (
                  <InspectionIntro
                    welderInfo={welderInfo}
                    onStartInspection={() => setCurrentStep('inspection')}
                    onBackToLogin={() => {
                      setCurrentStep('login');
                      setWelderInfo(null);
                    }}
                  />
                )}

                {currentStep === 'inspection' && welderInfo && (
                  <>
                    {/* Progress Header */}
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-slate-700">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h2 className="text-2xl font-bold text-white">WeldTrack™ Inspection Progress</h2>
                          <p className="text-slate-300">{welderInfo.company} - {welderInfo.date}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-white">
                            {Math.round(getInspectionProgress())}%
                          </div>
                          <div className={`text-sm font-medium ${
                            getOverallStatus() === 'PASSED' ? 'text-green-400' :
                            getOverallStatus() === 'FAILED' ? 'text-red-400' : 'text-yellow-400'
                          }`}>
                            {getOverallStatus()}
                          </div>
                        </div>
                      </div>

                      <div className="w-full bg-slate-700 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${getInspectionProgress()}%` }}
                        />
                      </div>
                    </div>

                    {/* Inspection Checklist */}
                    <InspectionChecklist
                      items={inspectionData}
                      onUpdateItem={updateInspectionItem}
                    />

                    {/* Action Buttons */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={() => setCurrentStep('review')}
                        disabled={getInspectionProgress() < 100}
                        className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                      >
                        <CheckCircle className="w-5 h-5" />
                        <span>Complete Inspection</span>
                      </button>

                      <button
                        onClick={() => setCurrentStep('intro')}
                        className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
                      >
                        <span>Back to Overview</span>
                      </button>
                    </div>
                  </>
                )}

                {currentStep === 'review' && welderInfo && (
                  <ReportGenerator
                    welderInfo={welderInfo}
                    inspectionData={inspectionData}
                    onBack={() => setCurrentStep('inspection')}
                    onNewInspection={() => {
                      setCurrentStep('intro');
                      // Keep welderInfo so they can start a new inspection without re-entering details
                      localStorage.removeItem('current-inspection');
                      // Reset inspection data for new inspection
                      const initialInspectionItems: InspectionItem[] = [
                        {
                          id: 'undercut',
                          name: 'Undercut',
                          description: 'Check for groove melted into base metal at weld toe',
                          status: 'pending',
                          notes: '',
                          photos: [],
                          priority: 'high'
                        },
                        {
                          id: 'cracks',
                          name: 'Cracks',
                          description: 'Check for any linear discontinuities in weld or base metal',
                          status: 'pending',
                          notes: '',
                          photos: [],
                          priority: 'high'
                        },
                        {
                          id: 'porosity',
                          name: 'Porosity',
                          description: 'Check for gas pockets or voids in weld metal',
                          status: 'pending',
                          notes: '',
                          photos: [],
                          priority: 'medium'
                        },
                        {
                          id: 'overlap',
                          name: 'Overlap',
                          description: 'Check for weld metal extending beyond weld toe without fusion',
                          status: 'pending',
                          notes: '',
                          photos: [],
                          priority: 'medium'
                        },
                        {
                          id: 'incomplete-fusion',
                          name: 'Incomplete Fusion',
                          description: 'Check for lack of fusion between weld and base metal',
                          status: 'pending',
                          notes: '',
                          photos: [],
                          priority: 'high'
                        },
                        {
                          id: 'arc-strikes',
                          name: 'Arc Strikes',
                          description: 'Check for arc strikes outside of weld area',
                          status: 'pending',
                          notes: '',
                          photos: [],
                          priority: 'high'
                        },
                        {
                          id: 'weld-profile',
                          name: 'Weld Profile',
                          description: 'Check weld size, contour, and reinforcement',
                          status: 'pending',
                          notes: '',
                          photos: [],
                          priority: 'high'
                        },
                        {
                          id: 'base-metal',
                          name: 'Base Metal Condition',
                          description: 'Check base metal for proper preparation and condition',
                          status: 'pending',
                          notes: '',
                          photos: [],
                          priority: 'medium'
                        }
                      ];
                      setInspectionData(initialInspectionItems);
                    }}
                  />
                )}
              </div>
            ) : appMode === 'wps' ? (
              // WPS Generator Mode
              <WPSGenerator />
            ) : (
              // Dashboard Mode
              <WelderDashboard />
            )}
          </main>
        </div>
      </div>

      {/* PWA Components */}
      <PWAInstallPrompt />
      <OfflineIndicator />
    </ProtectedRoute>
  );
}

export default App;
