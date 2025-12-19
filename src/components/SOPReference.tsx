import type React from 'react';
import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronRight, AlertTriangle, CheckCircle, Camera, FileText, Eye, Shield, Phone } from 'lucide-react';

const SOPReference: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['quick-start']));

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const sopSections = [
    {
      id: 'quick-start',
      title: 'Quick Start Guide',
      icon: <BookOpen className="w-4 h-4" />,
      priority: 'high',
      content: (
        <div className="space-y-4">
          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
            <h4 className="text-blue-300 font-medium mb-3">⚡ Essential Steps for Every Inspection</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs text-white font-bold">1</span>
                <div>
                  <p className="text-blue-200 font-medium">Verify Documentation</p>
                  <p className="text-xs text-blue-300">WPS, PQR, WPQR, MTRs must be available and qualified</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-xs text-white font-bold">2</span>
                <div>
                  <p className="text-green-200 font-medium">Prepare Environment</p>
                  <p className="text-xs text-green-300">1000+ lux lighting, clean weld area, proper access</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center text-xs text-white font-bold">3</span>
                <div>
                  <p className="text-amber-200 font-medium">Follow Inspection Sequence</p>
                  <p className="text-xs text-amber-300">Systematic order: Undercut → Cracks → Porosity → Overlap → Fusion → Arc Strikes → Profile → Base Metal</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs text-white font-bold">4</span>
                <div>
                  <p className="text-purple-200 font-medium">Document Everything</p>
                  <p className="text-xs text-purple-300">Photos + measurements + detailed notes for all findings</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'acceptance-criteria',
      title: 'AWS D1.1 Acceptance Criteria',
      icon: <CheckCircle className="w-4 h-4" />,
      priority: 'critical',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
              <h4 className="text-red-300 font-medium mb-3 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                CRITICAL REJECTION CRITERIA
              </h4>
              <div className="space-y-2 text-xs">
                <div className="bg-red-800/50 rounded p-2">
                  <p className="text-red-200 font-medium">❌ CRACKS: ANY crack = IMMEDIATE REJECTION</p>
                  <p className="text-red-300">Includes crater, longitudinal, transverse, base metal cracks</p>
                </div>
                <div className="bg-red-800/50 rounded p-2">
                  <p className="text-red-200 font-medium">❌ OVERLAP: ANY overlap = IMMEDIATE REJECTION</p>
                </div>
                <div className="bg-red-800/50 rounded p-2">
                  <p className="text-red-200 font-medium">❌ INCOMPLETE FUSION: ANY = IMMEDIATE REJECTION</p>
                </div>
                <div className="bg-red-800/50 rounded p-2">
                  <p className="text-red-200 font-medium">❌ ARC STRIKES: Outside weld area = REJECTION</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-900/30 border border-orange-700 rounded-lg p-4">
              <h4 className="text-orange-300 font-medium mb-3">📏 DIMENSIONAL LIMITS</h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-orange-800/50 rounded p-2">
                  <p className="text-orange-200 font-medium">Undercut Limits:</p>
                  <p className="text-orange-300">✅ ≤ 1/32" (0.8mm) depth</p>
                  <p className="text-orange-300">❌ &gt; 1/32" (0.8mm) depth</p>
                  <p className="text-orange-300">❌ &gt; 2" (50mm) continuous</p>
                </div>
                <div className="bg-orange-800/50 rounded p-2">
                  <p className="text-orange-200 font-medium">Porosity Limits:</p>
                  <p className="text-orange-300">✅ Individual ≤ 3/32" (2.4mm)</p>
                  <p className="text-orange-300">✅ Sum ≤ 3/8" (9.5mm)/inch</p>
                  <p className="text-orange-300">❌ Cluster porosity</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'photo-standards',
      title: 'Photography Standards',
      icon: <Camera className="w-4 h-4" />,
      priority: 'high',
      content: (
        <div className="space-y-4">
          <div className="bg-purple-900/30 border border-purple-700 rounded-lg p-4">
            <h4 className="text-purple-300 font-medium mb-3">📸 Required Photo Standards</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h5 className="text-purple-200 font-medium text-sm">Technical Requirements:</h5>
                <ul className="text-xs text-purple-200 space-y-1">
                  <li>• <strong>Resolution:</strong> Minimum 8MP, prefer 12MP+</li>
                  <li>• <strong>Focus:</strong> Sharp, clear defect details</li>
                  <li>• <strong>Lighting:</strong> 1000+ lux, avoid shadows</li>
                  <li>• <strong>Scale:</strong> Include measurement reference</li>
                  <li>• <strong>Multiple angles</strong> for complex defects</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h5 className="text-green-200 font-medium text-sm">Required Photos:</h5>
                <ul className="text-xs text-green-200 space-y-1">
                  <li>• Overview shot of entire weld</li>
                  <li>• Close-up of ALL defects</li>
                  <li>• Measurement verification shots</li>
                  <li>• Before/after remedial work</li>
                  <li>• Final acceptance photos</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-amber-900/30 border border-amber-700 rounded-lg p-4">
            <h4 className="text-amber-300 font-medium mb-2">⚠️ MANDATORY Photography</h4>
            <p className="text-xs text-amber-200">
              <strong>ALL FAIL conditions</strong> and high-priority defects MUST be photographed with proper scale reference and clear defect identification.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'documentation',
      title: 'Documentation Requirements',
      icon: <FileText className="w-4 h-4" />,
      priority: 'high',
      content: (
        <div className="space-y-4">
          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
            <h4 className="text-blue-300 font-medium mb-3">📝 Note Requirements</h4>
            <div className="space-y-3 text-xs">
              <div className="bg-blue-800/50 rounded p-3">
                <h5 className="text-blue-200 font-medium mb-2">Required Information:</h5>
                <ul className="text-blue-200 space-y-1">
                  <li>• <strong>Location:</strong> Precise defect position (clock position, joint ID)</li>
                  <li>• <strong>Dimensions:</strong> Actual measurements with tolerances</li>
                  <li>• <strong>Severity:</strong> Impact on structural integrity</li>
                  <li>• <strong>Recommendations:</strong> Specific remedial actions</li>
                  <li>• <strong>Code References:</strong> Applicable AWS D1.1 sections</li>
                </ul>
              </div>
              <div className="bg-green-800/50 rounded p-3">
                <h5 className="text-green-200 font-medium mb-2">Example Professional Notes:</h5>
                <div className="text-green-200 font-mono text-xs space-y-1">
                  <p>"Undercut 3/64" deep x 1.5" long at 6 o'clock position, weld joint A-1"</p>
                  <p>"Porosity cluster: 5 pores totaling 7/16" per inch, exceeds 3/8" limit"</p>
                  <p>"No defects observed, weld meets AWS D1.1 Table 8.1 criteria"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'inspection-sequence',
      title: 'Systematic Inspection Order',
      icon: <Eye className="w-4 h-4" />,
      priority: 'high',
      content: (
        <div className="space-y-4">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <h4 className="text-slate-200 font-medium mb-3">🔍 MANDATORY Inspection Sequence</h4>
            <p className="text-xs text-slate-300 mb-4">
              Follow this exact order to ensure systematic coverage and prevent missed defects:
            </p>

            <div className="space-y-2">
              {[
                { num: 1, name: 'UNDERCUT', priority: 'HIGH', description: 'Groove melted into base metal' },
                { num: 2, name: 'CRACKS', priority: 'HIGH', description: 'ANY crack = immediate rejection' },
                { num: 3, name: 'POROSITY', priority: 'MED', description: 'Gas pockets in weld metal' },
                { num: 4, name: 'OVERLAP', priority: 'MED', description: 'Unfused weld metal extension' },
                { num: 5, name: 'INCOMPLETE FUSION', priority: 'HIGH', description: 'Lack of fusion with base metal' },
                { num: 6, name: 'ARC STRIKES', priority: 'HIGH', description: 'Outside weld area strikes' },
                { num: 7, name: 'WELD PROFILE', priority: 'HIGH', description: 'Size, contour, reinforcement' },
                { num: 8, name: 'BASE METAL', priority: 'MED', description: 'Preparation and condition' }
              ].map((item) => (
                <div key={item.num} className="flex items-center space-x-3 p-2 bg-slate-700/50 rounded">
                  <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs text-white font-bold">
                    {item.num}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium text-xs">{item.name}</span>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        item.priority === 'HIGH'
                          ? 'bg-red-600 text-white'
                          : 'bg-amber-600 text-white'
                      }`}>
                        {item.priority}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'pre-inspection',
      title: 'Pre-Inspection Checklist',
      icon: <Shield className="w-4 h-4" />,
      priority: 'critical',
      content: (
        <div className="space-y-4">
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
            <h4 className="text-red-300 font-medium mb-3 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              MANDATORY Pre-Inspection Verification
            </h4>
            <p className="text-xs text-red-200 mb-3">
              <strong>STOP:</strong> Do not begin inspection until ALL items are verified ✓
            </p>

            <div className="space-y-3">
              <div className="bg-red-800/50 rounded p-3">
                <h5 className="text-red-200 font-medium mb-2">📋 Required Documents:</h5>
                <div className="space-y-1 text-xs">
                  <label className="flex items-center space-x-2 text-red-200">
                    <input type="checkbox" className="rounded" />
                    <span>Qualified Welding Procedure Specification (WPS)</span>
                  </label>
                  <label className="flex items-center space-x-2 text-red-200">
                    <input type="checkbox" className="rounded" />
                    <span>Supporting Procedure Qualification Record (PQR)</span>
                  </label>
                  <label className="flex items-center space-x-2 text-red-200">
                    <input type="checkbox" className="rounded" />
                    <span>Welder Performance Qualification Records (WPQR)</span>
                  </label>
                  <label className="flex items-center space-x-2 text-red-200">
                    <input type="checkbox" className="rounded" />
                    <span>Material Test Reports (MTRs)</span>
                  </label>
                  <label className="flex items-center space-x-2 text-red-200">
                    <input type="checkbox" className="rounded" />
                    <span>Joint detail drawings</span>
                  </label>
                </div>
              </div>

              <div className="bg-amber-800/50 rounded p-3">
                <h5 className="text-amber-200 font-medium mb-2">🔧 Equipment & Environment:</h5>
                <div className="space-y-1 text-xs">
                  <label className="flex items-center space-x-2 text-amber-200">
                    <input type="checkbox" className="rounded" />
                    <span>Lighting ≥ 1000 lux (100 foot-candles)</span>
                  </label>
                  <label className="flex items-center space-x-2 text-amber-200">
                    <input type="checkbox" className="rounded" />
                    <span>Weld area cleaned (no slag, spatter, coating)</span>
                  </label>
                  <label className="flex items-center space-x-2 text-amber-200">
                    <input type="checkbox" className="rounded" />
                    <span>Clear visual access to all weld surfaces</span>
                  </label>
                  <label className="flex items-center space-x-2 text-amber-200">
                    <input type="checkbox" className="rounded" />
                    <span>Calibrated measuring devices available</span>
                  </label>
                  <label className="flex items-center space-x-2 text-amber-200">
                    <input type="checkbox" className="rounded" />
                    <span>High-resolution camera ready (8MP+ minimum)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'emergency',
      title: 'Emergency Procedures',
      icon: <Phone className="w-4 h-4" />,
      priority: 'critical',
      content: (
        <div className="space-y-4">
          <div className="bg-red-900/40 border-2 border-red-600 rounded-lg p-4">
            <h4 className="text-red-300 font-bold mb-3 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              CRITICAL DEFECT DISCOVERY PROTOCOL
            </h4>

            <div className="space-y-3">
              <div className="bg-red-800/50 rounded p-3">
                <h5 className="text-red-200 font-bold mb-2">🚨 IMMEDIATE ACTIONS for Cracks or Safety Issues:</h5>
                <ol className="text-xs text-red-200 space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-xs text-white font-bold">1</span>
                    <div>
                      <p className="font-bold">STOP</p>
                      <p>Halt all welding operations immediately</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-xs text-white font-bold">2</span>
                    <div>
                      <p className="font-bold">NOTIFY</p>
                      <p>Alert supervision and safety personnel</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-xs text-white font-bold">3</span>
                    <div>
                      <p className="font-bold">DOCUMENT</p>
                      <p>Photograph and measure defect immediately</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-xs text-white font-bold">4</span>
                    <div>
                      <p className="font-bold">SECURE</p>
                      <p>Isolate affected area from further work</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-xs text-white font-bold">5</span>
                    <div>
                      <p className="font-bold">REPORT</p>
                      <p>Generate immediate inspection report</p>
                    </div>
                  </li>
                </ol>
              </div>

              <div className="bg-amber-800/50 rounded p-3">
                <h5 className="text-amber-200 font-bold mb-2">⚠️ System Failure Backup:</h5>
                <ul className="text-xs text-amber-200 space-y-1">
                  <li>• Continue inspection using backup paper forms</li>
                  <li>• Take photos with backup device/camera</li>
                  <li>• Transfer data when system restored</li>
                  <li>• Report system issues to support immediately</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3 mb-4">
          <BookOpen className="w-6 h-6 text-blue-400" />
          <h2 className="text-lg font-bold text-white">WeldTrack™ SOP Quick Reference</h2>
        </div>
        <p className="text-sm text-slate-300 mb-4">
          Standard Operating Procedures for AWS D1.1 Clause 6 Visual Inspections
        </p>
        <div className="bg-amber-900/30 border border-amber-700 rounded-lg p-3">
          <p className="text-xs text-amber-200">
            <strong>Document:</strong> WTI-SOP-001 v1.0 | <strong>Effective:</strong> September 26, 2025
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {sopSections.map((section) => {
          const isExpanded = expandedSections.has(section.id);
          const priorityColor = section.priority === 'critical'
            ? 'border-red-700 bg-red-900/20'
            : section.priority === 'high'
            ? 'border-amber-700 bg-amber-900/20'
            : 'border-slate-700 bg-slate-800/20';

          return (
            <div key={section.id} className={`border rounded-lg ${priorityColor}`}>
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-700/30 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {section.icon}
                  <div>
                    <h3 className="text-sm font-medium text-white">{section.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        section.priority === 'critical'
                          ? 'bg-red-600 text-white'
                          : section.priority === 'high'
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-600 text-slate-200'
                      }`}>
                        {section.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {isExpanded && (
                <div className="p-4 border-t border-slate-600">
                  {section.content}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-6 border-t border-slate-700">
        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
          <h4 className="text-blue-300 font-medium mb-2">📞 Emergency Contacts</h4>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-blue-200 font-medium">Quality Control Manager</p>
              <p className="text-blue-300">Ext: 1234 | Cell: Available in emergency</p>
            </div>
            <div>
              <p className="text-blue-200 font-medium">Technical Support</p>
              <p className="text-blue-300">support@clausemesh.com | 24/7 Available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SOPReference;
