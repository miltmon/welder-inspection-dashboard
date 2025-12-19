import type React from 'react';
import { useState } from 'react';
import { Book, ChevronDown, ChevronRight, AlertTriangle, CheckCircle, X, Search, FileText, Users, Wrench, Eye, Zap } from 'lucide-react';

const CodeReference: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['clause6']));
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'clauses' | 'annexes' | 'all'>('clauses');

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

  const awsD11Structure = [
    {
      id: 'clause1',
      category: 'clauses',
      title: 'Clause 1: General Requirements',
      icon: <FileText className="w-4 h-4" />,
      description: 'Scope, responsibilities, units, and safety requirements',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Establishes the foundation for structural welding operations, defining scope, responsibilities, and basic safety requirements.
          </p>
          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
            <h4 className="text-blue-300 font-medium mb-2">Key Topics:</h4>
            <ul className="text-xs text-blue-200 space-y-1">
              <li>• Scope of application and limitations</li>
              <li>• Responsibilities of contractor, engineer, and inspector</li>
              <li>• Units of measurement and conversions</li>
              <li>• Safety requirements and precautions</li>
              <li>• Code compliance and enforcement</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'clause2',
      category: 'clauses',
      title: 'Clause 2: Normative References',
      icon: <Book className="w-4 h-4" />,
      description: 'Referenced codes and standards',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Lists all external codes, standards, and specifications referenced throughout AWS D1.1.
          </p>
          <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
            <h4 className="text-green-300 font-medium mb-2">Referenced Standards Include:</h4>
            <ul className="text-xs text-green-200 space-y-1">
              <li>• AWS A5 series (Filler Metal Specifications)</li>
              <li>• ASTM Standards for materials and testing</li>
              <li>• ASME codes for pressure vessels</li>
              <li>• AISC specifications for structural steel</li>
              <li>• API standards for petroleum industry</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'clause3',
      category: 'clauses',
      title: 'Clause 3: Terms and Definitions',
      icon: <FileText className="w-4 h-4" />,
      description: 'Welding terminology and definitions',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Standardizes welding terminology to ensure consistent understanding across all stakeholders.
          </p>
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-purple-900/30 border border-purple-700 rounded-lg p-3">
              <h5 className="text-purple-300 font-medium text-sm">Common Terms:</h5>
              <div className="text-xs text-purple-200 mt-2 space-y-1">
                <div><strong>Weld Leg:</strong> Distance from root to face along member surface</div>
                <div><strong>Throat:</strong> Shortest distance through weld cross-section</div>
                <div><strong>Root Opening:</strong> Gap between members at weld root</div>
                <div><strong>Porosity:</strong> Gas pockets trapped in weld metal</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'clause4',
      category: 'clauses',
      title: 'Clause 4: Design of Welded Connections',
      icon: <Wrench className="w-4 h-4" />,
      description: 'Engineering design requirements for welded joints',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Provides design requirements for welded connections, including strength calculations and joint configurations.
          </p>
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-orange-900/30 border border-orange-700 rounded-lg p-3">
              <h5 className="text-orange-300 font-medium text-sm">Design Considerations:</h5>
              <ul className="text-xs text-orange-200 mt-2 space-y-1">
                <li>• Effective area calculations</li>
                <li>• Load path analysis</li>
                <li>• Fatigue resistance</li>
                <li>• Connection types and applications</li>
                <li>• Material compatibility</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'clause5',
      category: 'clauses',
      title: 'Clause 5: Prequalification of WPSs',
      icon: <CheckCircle className="w-4 h-4" />,
      description: 'Pre-approved welding procedures without testing',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Defines conditions under which Welding Procedure Specifications are automatically qualified without testing.
          </p>
          <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
            <h4 className="text-green-300 font-medium mb-2">Prequalification Requirements:</h4>
            <ul className="text-xs text-green-200 space-y-1">
              <li>• Base metal must be prequalified</li>
              <li>• Filler metal must meet AWS specifications</li>
              <li>• Joint details must conform to code figures</li>
              <li>• Welding positions must be within limits</li>
              <li>• Preheat and interpass temperatures specified</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'clause6',
      category: 'clauses',
      title: 'Clause 6: Qualification',
      icon: <Users className="w-4 h-4" />,
      description: 'WPS and welder qualification through testing',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Covers qualification of Welding Procedure Specifications (WPS) and welder performance when prequalification is not applicable.
          </p>

          {/* Visual Inspection Criteria - Enhanced */}
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
            <h4 className="text-red-300 font-medium mb-2 flex items-center">
              <Eye className="w-4 h-4 mr-2" />
              Visual Inspection Acceptance Criteria (6.12):
            </h4>

            <div className="grid grid-cols-1 gap-4">
              <div className="bg-red-900/50 rounded-lg p-3">
                <h5 className="text-red-200 font-medium mb-2">6.12.1 Undercut</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <h6 className="text-red-300 text-xs font-medium mb-1">❌ Rejection:</h6>
                    <ul className="text-xs text-red-200 space-y-1">
                      <li>• Depth &gt; 1/32&quot; (0.8mm)</li>
                      <li>• Reduces throat below minimum</li>
                      <li>• Continuous length &gt; 2&quot; (50mm)</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="text-green-300 text-xs font-medium mb-1">✅ Acceptable:</h6>
                    <ul className="text-xs text-green-200 space-y-1">
                      <li>• Depth ≤ 1/32&quot; (0.8mm)</li>
                      <li>• Does not reduce effective throat</li>
                      <li>• Intermittent, within length limits</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-red-900/50 rounded-lg p-3">
                <h5 className="text-red-200 font-medium mb-2">6.12.2 Cracks</h5>
                <div className="bg-red-800/50 rounded p-2">
                  <p className="text-red-200 text-xs font-medium">❌ ANY crack is cause for rejection</p>
                  <ul className="text-xs text-red-200 mt-1 space-y-1">
                    <li>• Crater cracks</li>
                    <li>• Longitudinal cracks</li>
                    <li>• Transverse cracks</li>
                    <li>• Base metal cracks</li>
                  </ul>
                </div>
              </div>

              <div className="bg-red-900/50 rounded-lg p-3">
                <h5 className="text-red-200 font-medium mb-2">6.12.3 Porosity</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <h6 className="text-red-300 text-xs font-medium mb-1">❌ Rejection:</h6>
                    <ul className="text-xs text-red-200 space-y-1">
                      <li>• Individual pore &gt; 3/32&quot; (2.4mm)</li>
                      <li>• Sum of pores &gt; 3/8&quot; (9.5mm) per linear inch</li>
                      <li>• Cluster porosity</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="text-green-300 text-xs font-medium mb-1">✅ Acceptable:</h6>
                    <ul className="text-xs text-green-200 space-y-1">
                      <li>• Individual pores ≤ 3/32&quot; (2.4mm)</li>
                      <li>• Sum ≤ 3/8&quot; (9.5mm) per linear inch</li>
                      <li>• Scattered distribution</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-red-900/50 rounded-lg p-3">
                <h5 className="text-red-200 font-medium mb-2">6.12.4 Overlap & 6.12.5 Incomplete Fusion</h5>
                <div className="bg-red-800/50 rounded p-2">
                  <p className="text-red-200 text-xs font-medium">❌ ANY overlap or incomplete fusion is cause for rejection</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
            <h4 className="text-blue-300 font-medium mb-2">Qualification Testing Requirements:</h4>
            <ul className="text-xs text-blue-200 space-y-1">
              <li>• Guided bend tests for groove welds</li>
              <li>• Macro etch examination</li>
              <li>• Fillet weld break tests</li>
              <li>• Visual inspection requirements</li>
              <li>• Radiographic testing when required</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'clause7',
      category: 'clauses',
      title: 'Clause 7: Fabrication',
      icon: <Wrench className="w-4 h-4" />,
      description: 'Welding execution, techniques, and workmanship',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Covers all aspects of welding execution including preparation, fit-up, welding techniques, and workmanship standards.
          </p>
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4">
              <h4 className="text-yellow-300 font-medium mb-2">Fabrication Requirements:</h4>
              <ul className="text-xs text-yellow-200 space-y-1">
                <li>• Material preparation and cleaning</li>
                <li>• Fit-up tolerances and procedures</li>
                <li>• Preheat and interpass temperature control</li>
                <li>• Welding sequence and technique</li>
                <li>• Post-weld treatment requirements</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'clause8',
      category: 'clauses',
      title: 'Clause 8: Inspection',
      icon: <Eye className="w-4 h-4" />,
      description: 'Visual inspection, NDT methods, and acceptance criteria',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            <strong>Your bread and butter as a CWI!</strong> Details visual inspection, NDT methods like UT and RT, acceptance criteria, and documentation.
          </p>
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
              <h4 className="text-green-300 font-medium mb-2">Inspection Methods:</h4>
              <ul className="text-xs text-green-200 space-y-1">
                <li>• Visual Testing (VT) - 100% required</li>
                <li>• Radiographic Testing (RT)</li>
                <li>• Ultrasonic Testing (UT)</li>
                <li>• Magnetic Particle Testing (MT)</li>
                <li>• Liquid Penetrant Testing (PT)</li>
              </ul>
            </div>
            <div className="bg-orange-900/30 border border-orange-700 rounded-lg p-4">
              <h4 className="text-orange-300 font-medium mb-2">Documentation Requirements:</h4>
              <ul className="text-xs text-orange-200 space-y-1">
                <li>• Inspection reports and certificates</li>
                <li>• Non-conformance documentation</li>
                <li>• Repair procedures and records</li>
                <li>• Inspector qualifications</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'clause9',
      category: 'clauses',
      title: 'Clause 9: Stud Welding',
      icon: <Zap className="w-4 h-4" />,
      description: 'Specific requirements for welding studs',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Covers materials, equipment, procedures, and inspection requirements specific to stud welding operations.
          </p>
          <div className="bg-purple-900/30 border border-purple-700 rounded-lg p-4">
            <h4 className="text-purple-300 font-medium mb-2">Stud Welding Requirements:</h4>
            <ul className="text-xs text-purple-200 space-y-1">
              <li>• Stud materials and specifications</li>
              <li>• Welding equipment requirements</li>
              <li>• Base material preparation</li>
              <li>• Welding procedures and parameters</li>
              <li>• Inspection and testing methods</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'clause10',
      category: 'clauses',
      title: 'Clause 10: Tubular Structures',
      icon: <Wrench className="w-4 h-4" />,
      description: 'Requirements for welding round tubes (T, Y, K connections)',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Specific requirements for welding round tubes used in offshore platforms, trusses, and other tubular structures.
          </p>
          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
            <h4 className="text-blue-300 font-medium mb-2">Tubular Connection Types:</h4>
            <ul className="text-xs text-blue-200 space-y-1">
              <li>• T-connections (branch perpendicular to chord)</li>
              <li>• Y-connections (angled branch connections)</li>
              <li>• K-connections (multiple branches)</li>
              <li>• X-connections (opposing branches)</li>
              <li>• Gap and overlap joints</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'clause11',
      category: 'clauses',
      title: 'Clause 11: Strengthening and Repair',
      icon: <Wrench className="w-4 h-4" />,
      description: 'Repair and reinforcement of existing structures',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Guidelines for strengthening and repairing existing welded structures when modifications or damage occur.
          </p>
          <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
            <h4 className="text-green-300 font-medium mb-2">Repair Considerations:</h4>
            <ul className="text-xs text-green-200 space-y-1">
              <li>• Assessment of existing conditions</li>
              <li>• Repair procedure development</li>
              <li>• Material compatibility verification</li>
              <li>• Strengthening design requirements</li>
              <li>• Post-repair inspection and testing</li>
            </ul>
          </div>
        </div>
      )
    },

    // ASME Section IX Critical Requirements
    {
      id: 'asme-qw200',
      category: 'clauses',
      title: 'ASME Section IX: QW-200 WPS Requirements',
      icon: <FileText className="w-4 h-4" />,
      description: 'Welding Procedure Specifications - Your roadmap to quality welds',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            <strong>Critical CWI Knowledge:</strong> WPS documentation ensuring procedures yield acceptable welds when followed.
          </p>

          <div className="grid grid-cols-1 gap-4">
            <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
              <h4 className="text-blue-300 font-medium mb-2">🎯 WPS Purpose & Content:</h4>
              <ul className="text-xs text-blue-200 space-y-1">
                <li>• <strong>Purpose:</strong> Formal written document providing direction for making production welds to code requirements</li>
                <li>• <strong>Content:</strong> Must describe all essential, nonessential, and supplementary essential variables</li>
                <li>• <strong>Format:</strong> Flexible format (written/tabular) as long as QW-250 through QW-280 requirements are included</li>
                <li>• <strong>Availability:</strong> Must be available for AI review at fabrication site</li>
              </ul>
            </div>

            <div className="bg-orange-900/30 border border-orange-700 rounded-lg p-4">
              <h4 className="text-orange-300 font-medium mb-2">⚡ Essential vs. Nonessential Variables:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <h5 className="text-orange-200 text-xs font-medium mb-1">🔴 Essential Variables:</h5>
                  <ul className="text-xs text-orange-200 space-y-1">
                    <li>• Affect mechanical properties</li>
                    <li>• Changes require requalification</li>
                    <li>• Must be documented on WPS</li>
                  </ul>
                </div>
                <div>
                  <h5 className="text-green-200 text-xs font-medium mb-1">🟢 Nonessential Variables:</h5>
                  <ul className="text-xs text-green-200 space-y-1">
                    <li>• Don't affect mechanical properties</li>
                    <li>• No requalification required</li>
                    <li>• Must be documented and updated</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-purple-900/30 border border-purple-700 rounded-lg p-4">
              <h4 className="text-purple-300 font-medium mb-2">🔬 Supplementary Essential Variables:</h4>
              <ul className="text-xs text-purple-200 space-y-1">
                <li>• Required when notch-toughness testing (CVN) is specified</li>
                <li>• Changes require requalification when toughness is required</li>
                <li>• Must be listed on WPS when required</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },

    {
      id: 'asme-qw300',
      category: 'clauses',
      title: 'ASME Section IX: QW-300 Welder Performance',
      icon: <Users className="w-4 h-4" />,
      description: 'Welder Performance Qualification - Proving the skillset',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            <strong>CWI Focus:</strong> Determining welder's ability to deposit sound weld metal and execute qualified WPS.
          </p>

          <div className="grid grid-cols-1 gap-4">
            <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
              <h4 className="text-green-300 font-medium mb-2">👨‍🔧 WPQ Documentation & Testing:</h4>
              <ul className="text-xs text-green-200 space-y-1">
                <li>• <strong>Documentation:</strong> Results on WPQ/WQTR (QW-484 format suggested)</li>
                <li>• <strong>Supervision:</strong> Test coupon welded under Code user supervision</li>
                <li>• <strong>WPS Direction:</strong> Following qualified WPS direction</li>
                <li>• <strong>Examination:</strong> Visual exam required prior to mechanical testing</li>
              </ul>
            </div>

            <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4">
              <h4 className="text-yellow-300 font-medium mb-2">🔧 Essential Variables (QW-350 & QW-360):</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <h5 className="text-yellow-200 text-xs font-medium mb-1">Welder Variables (QW-350):</h5>
                  <ul className="text-xs text-yellow-200 space-y-1">
                    <li>• Process-specific variables</li>
                    <li>• SMAW: backing deletion in single welds</li>
                    <li>• Pipe diameter and position</li>
                  </ul>
                </div>
                <div>
                  <h5 className="text-orange-200 text-xs font-medium mb-1">Operator Variables (QW-360):</h5>
                  <ul className="text-xs text-orange-200 space-y-1">
                    <li>• Different from welder variables</li>
                    <li>• Mechanical ability to operate equipment</li>
                    <li>• Per QW-492 definition</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
              <h4 className="text-red-300 font-medium mb-2">🔄 Requalification Requirements:</h4>
              <ul className="text-xs text-red-200 space-y-1">
                <li>• Inspector has cause to question welder ability</li>
                <li>• Continuity requirements per QW-322</li>
                <li>• Essential variable changes beyond qualified range</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },

    {
      id: 'asme-qw400',
      category: 'clauses',
      title: 'ASME Section IX: QW-400 Welding Data',
      icon: <Wrench className="w-4 h-4" />,
      description: 'Variables and numbers - The details that drive quality',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            <strong>Critical for CWI:</strong> Defines welding variables, P/S/F/A numbers, testing requirements, and limits.
          </p>

          <div className="grid grid-cols-1 gap-4">
            <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
              <h4 className="text-blue-300 font-medium mb-2">🔢 Material Classification Numbers:</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <h5 className="text-blue-200 text-xs font-medium mb-1">P-Numbers (QW-420):</h5>
                  <ul className="text-xs text-blue-200 space-y-1">
                    <li>• Base metals by metallurgical characteristics</li>
                    <li>• Essential for WPS and PQR</li>
                    <li>• QW/QB-422 detailed listing</li>
                  </ul>
                </div>
                <div>
                  <h5 className="text-slate-200 text-xs font-medium mb-1">S-Numbers (QW-420):</h5>
                  <ul className="text-xs text-slate-200 space-y-1">
                    <li>• Ferrous metals not in P-Numbers</li>
                    <li>• Acceptable for B31 Code construction</li>
                    <li>• Piping applications</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
              <h4 className="text-green-300 font-medium mb-2">🧵 Filler Metal Classification:</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <h5 className="text-green-200 text-xs font-medium mb-1">F-Numbers (QW-430):</h5>
                  <ul className="text-xs text-green-200 space-y-1">
                    <li>• Filler metals by usability characteristics</li>
                    <li>• Essential variable for WPS</li>
                    <li>• Essential limitation for welder qualification</li>
                  </ul>
                </div>
                <div>
                  <h5 className="text-emerald-200 text-xs font-medium mb-1">A-Numbers (QW-440):</h5>
                  <ul className="text-xs text-emerald-200 space-y-1">
                    <li>• Ferrous weld metal by chemical composition</li>
                    <li>• Essential for WPS and PQR</li>
                    <li>• Assignment basis must be documented</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-orange-900/30 border border-orange-700 rounded-lg p-4">
              <h4 className="text-orange-300 font-medium mb-2">🌡️ Temperature Requirements:</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <h5 className="text-orange-200 text-xs font-medium mb-1">Preheat (QW-406):</h5>
                  <ul className="text-xs text-orange-200 space-y-1">
                    <li>• &gt;100°F decrease = essential variable</li>
                    <li>• Production ≥ WPS minimum</li>
                    <li>• &gt;100°F interpass increase = essential</li>
                  </ul>
                </div>
                <div>
                  <h5 className="text-yellow-200 text-xs font-medium mb-1">PWHT (QW-407):</h5>
                  <ul className="text-xs text-yellow-200 space-y-1">
                    <li>• Temperature/time changes essential</li>
                    <li>• No PWHT to PWHT = essential</li>
                    <li>• P-Number specific requirements</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    {
      id: 'clause8-inspection',
      category: 'clauses',
      title: 'AWS D1.1 Clause 8: Critical Inspection Requirements',
      icon: <Eye className="w-4 h-4" />,
      description: 'CWI bread and butter - Your job as inspector',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            <strong>Your Job, CWI!</strong> Critical inspection requirements you MUST know for field work and certification.
          </p>

          <div className="grid grid-cols-1 gap-4">
            <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
              <h4 className="text-red-300 font-medium mb-2">🌡️ Temperature Verification (Critical #28):</h4>
              <ul className="text-xs text-red-200 space-y-1">
                <li>• <strong>Preheat:</strong> Verify base metal at/above minimum WPS temperature before welding</li>
                <li>• <strong>Interpass:</strong> Maintain throughout welding for 3" or 1.5x thickness from weld</li>
                <li>• <strong>Timing:</strong> Check just prior to initiating arc for each pass</li>
                <li>• <strong>Purpose:</strong> Hydrogen control and crack prevention</li>
              </ul>
            </div>

            <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
              <h4 className="text-green-300 font-medium mb-2">👁️ Visual Inspection (Critical #29):</h4>
              <ul className="text-xs text-green-200 space-y-1">
                <li>• <strong>Mandatory:</strong> Required for ALL welds before other NDT</li>
                <li>• <strong>Examine for:</strong> Cracks, undercut, overlap, surface porosity, slag, weld size, contour</li>
                <li>• <strong>Acceptance:</strong> Per AWS D1.1 Table 8.1 criteria</li>
                <li>• <strong>Cracks:</strong> ANY crack is unacceptable, regardless of size</li>
              </ul>
            </div>

            <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
              <h4 className="text-blue-300 font-medium mb-2">🔬 NDT Requirements (Critical #30):</h4>
              <ul className="text-xs text-blue-200 space-y-1">
                <li>• <strong>Personnel:</strong> Qualified per ASNT SNT-TC-1A or ISO 9712</li>
                <li>• <strong>Methods:</strong> RT, UT, MT, PT per code clauses and procedures</li>
                <li>• <strong>Equipment:</strong> UT equipment qualification and calibration mandatory</li>
                <li>• <strong>PAUT:</strong> Advanced methods per Annex H requirements</li>
                <li>• <strong>Acceptance:</strong> Per D1.1 Clause 8, Clause 10 for tubulars</li>
              </ul>
            </div>

            <div className="bg-purple-900/30 border border-purple-700 rounded-lg p-4">
              <h4 className="text-purple-300 font-medium mb-2">🧪 Mechanical Testing (Critical #31):</h4>
              <ul className="text-xs text-purple-200 space-y-1">
                <li>• <strong>Required Tests:</strong> Tension, bend, impact per code requirements</li>
                <li>• <strong>Witness:</strong> Inspector must witness and document results</li>
                <li>• <strong>Critical for:</strong> WPS and welder qualification testing</li>
                <li>• <strong>Acceptance:</strong> Must meet code acceptance criteria</li>
              </ul>
            </div>

            <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4">
              <h4 className="text-yellow-300 font-medium mb-2">📋 Documentation Review (Critical #32):</h4>
              <ul className="text-xs text-yellow-200 space-y-1">
                <li>• <strong>Before Welding:</strong> Verify qualified WPS and WPQ in place</li>
                <li>• <strong>WPS Review:</strong> All essential variables listed and supported by PQR</li>
                <li>• <strong>PQR Review:</strong> Accuracy, recorded variables, test results</li>
                <li>• <strong>WPQ Review:</strong> Welders qualified for specific process, position, materials</li>
                <li>• <strong>Records:</strong> Maintaining documentation is essential</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },

    {
      id: 'aws-d11-2025',
      category: 'clauses',
      title: 'AWS D1.1:2025 Strategic Preparation - ClauseMesh Ready',
      icon: <Zap className="w-4 h-4" />,
      description: 'Strategic CWI preparation framework for the 2025 edition revolution',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            <strong>ClauseMesh Strategic Update:</strong> Comprehensive preparation for AWS D1.1:2025 across the entire ecosystem - ClauseBot, LMS, Flashcards, and Exam DB.
          </p>

          <div className="grid grid-cols-1 gap-4">
            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-700 rounded-lg p-4">
              <h4 className="text-blue-300 font-medium mb-2 flex items-center">
                <Zap className="w-4 h-4 mr-2" />
                🎯 Strategic Edition Roadmap:
              </h4>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-800/50 rounded p-2 text-center">
                  <div className="text-slate-400">D1.1:2015</div>
                  <div className="text-amber-300">Foundation Era</div>
                </div>
                <div className="bg-blue-800/50 rounded p-2 text-center">
                  <div className="text-blue-200">D1.1:2020</div>
                  <div className="text-blue-300">Current Platform</div>
                </div>
                <div className="bg-purple-800/50 rounded p-2 text-center">
                  <div className="text-purple-200">D1.1:2025</div>
                  <div className="text-purple-300">Strategic Target</div>
                </div>
              </div>
            </div>

            <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
              <h4 className="text-red-300 font-medium mb-2">🔥 Clause 4: WPS Refinements & Rigor (HIGH IMPACT)</h4>
              <div className="space-y-3">
                <p className="text-xs text-red-200">
                  <strong>CWI Focus:</strong> "WPS integrity is non-negotiable. Every parameter must be bulletproof."
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-red-800/50 rounded p-3">
                    <h5 className="text-red-200 text-xs font-medium mb-1">2025 Enhancements:</h5>
                    <ul className="text-xs text-red-200 space-y-1">
                      <li>• Enhanced documentation precision</li>
                      <li>• Stricter PQR correlation requirements</li>
                      <li>• Digital WPS management protocols</li>
                      <li>• Essential variable change control</li>
                    </ul>
                  </div>
                  <div className="bg-orange-800/50 rounded p-3">
                    <h5 className="text-orange-200 text-xs font-medium mb-1">CWI Training Impact:</h5>
                    <ul className="text-xs text-orange-200 space-y-1">
                      <li>• Advanced WPS analysis techniques</li>
                      <li>• Digital documentation verification</li>
                      <li>• Non-conformance response protocols</li>
                      <li>• Essential variable impact assessment</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
              <h4 className="text-green-300 font-medium mb-2">🌡️ Clause 5: Enhanced Preheat Strategies (HIGH IMPACT)</h4>
              <div className="space-y-3">
                <p className="text-xs text-green-200">
                  <strong>CWI Focus:</strong> "Advanced materials demand advanced thermal management strategies."
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-800/50 rounded p-3">
                    <h5 className="text-green-200 text-xs font-medium mb-1">Strategic Enhancements:</h5>
                    <ul className="text-xs text-green-200 space-y-1">
                      <li>• Material-specific thermal regimes</li>
                      <li>• Digital monitoring integration</li>
                      <li>• Environmental compensation methods</li>
                      <li>• Interpass temperature control</li>
                    </ul>
                  </div>
                  <div className="bg-teal-800/50 rounded p-3">
                    <h5 className="text-teal-200 text-xs font-medium mb-1">Field Applications:</h5>
                    <ul className="text-xs text-teal-200 space-y-1">
                      <li>• High-strength steel thermal windows</li>
                      <li>• Multi-pass thermal management</li>
                      <li>• Cold weather emergency protocols</li>
                      <li>• Digital monitoring validation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-purple-900/30 border border-purple-700 rounded-lg p-4">
              <h4 className="text-purple-300 font-medium mb-2">👁️ Clause 6: Phased Inspection Revolution (BREAKTHROUGH)</h4>
              <div className="space-y-3">
                <p className="text-xs text-purple-200">
                  <strong>Revolutionary Concept:</strong> "Quality built in, not inspected out. The future of CWI work."
                </p>
                <div className="bg-purple-800/50 rounded p-3">
                  <h5 className="text-purple-200 text-xs font-medium mb-2">Formal Phased Structure:</h5>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs text-white">1</span>
                      <span className="text-xs text-blue-200">Pre-Welding: Joint prep, WPS validation, material certification</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 bg-yellow-600 rounded-full flex items-center justify-center text-xs text-white">2</span>
                      <span className="text-xs text-yellow-200">In-Process: Real-time monitoring, interpass inspection</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-xs text-white">3</span>
                      <span className="text-xs text-green-200">Post-Welding: Final visual, NDT coordination, documentation</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-orange-900/30 border border-orange-700 rounded-lg p-4">
              <h4 className="text-orange-300 font-medium mb-2">🔬 Clause 8: Digital NDT Transformation (TECH REVOLUTION)</h4>
              <div className="space-y-3">
                <p className="text-xs text-orange-200">
                  <strong>Technology Focus:</strong> "PAUT standardization, AI-assisted analysis, blockchain-level data integrity."
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-orange-800/50 rounded p-3">
                    <h5 className="text-orange-200 text-xs font-medium mb-1">Technology Integration:</h5>
                    <ul className="text-xs text-orange-200 space-y-1">
                      <li>• PAUT as primary method</li>
                      <li>• Digital record integrity protocols</li>
                      <li>• AI-assisted defect detection</li>
                      <li>• Real-time digital reporting</li>
                    </ul>
                  </div>
                  <div className="bg-red-800/50 rounded p-3">
                    <h5 className="text-red-200 text-xs font-medium mb-1">CWI Skills Revolution:</h5>
                    <ul className="text-xs text-red-200 space-y-1">
                      <li>• PAUT data interpretation mastery</li>
                      <li>• Digital record validation</li>
                      <li>• AI oversight competencies</li>
                      <li>• Cybersecurity awareness</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border border-emerald-700 rounded-lg p-4">
              <h4 className="text-emerald-300 font-medium mb-2">🛠️ ClauseMesh Ecosystem Integration Strategy:</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="bg-emerald-800/50 rounded p-2">
                    <h5 className="text-emerald-200 text-xs font-medium">🤖 ClauseBot™ 2025:</h5>
                    <p className="text-xs text-emerald-200">Cross-edition comparison, phased inspection guidance, PAUT technical support</p>
                  </div>
                  <div className="bg-blue-800/50 rounded p-2">
                    <h5 className="text-blue-200 text-xs font-medium">📚 LMS Evolution:</h5>
                    <p className="text-xs text-blue-200">Virtual phased inspection simulator, PAUT interpretation lab, WPS digital validation</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="bg-purple-800/50 rounded p-2">
                    <h5 className="text-purple-200 text-xs font-medium">⚡ Flashcard System:</h5>
                    <p className="text-xs text-purple-200">Phased inspection protocols, PAUT technical mastery, enhanced WPS validation</p>
                  </div>
                  <div className="bg-amber-800/50 rounded p-2">
                    <h5 className="text-amber-200 text-xs font-medium">🎯 Exam Database:</h5>
                    <p className="text-xs text-amber-200">25% new questions focused on 2025 changes, real-world case studies</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-900/30 to-red-900/30 border border-amber-700 rounded-lg p-4">
              <h4 className="text-amber-300 font-medium mb-2">🚀 Implementation Timeline & Strategic Advantage:</h4>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-amber-800/50 rounded p-2 text-center">
                    <div className="text-amber-200 text-xs font-medium">Q4 2025</div>
                    <div className="text-xs text-amber-200">Foundation Phase</div>
                  </div>
                  <div className="bg-orange-800/50 rounded p-2 text-center">
                    <div className="text-orange-200 text-xs font-medium">Q1 2026</div>
                    <div className="text-xs text-orange-200">Integration Phase</div>
                  </div>
                  <div className="bg-red-800/50 rounded p-2 text-center">
                    <div className="text-red-200 text-xs font-medium">Q2 2026</div>
                    <div className="text-xs text-red-200">Launch Phase</div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 rounded p-3">
                  <p className="text-xs text-yellow-200 text-center font-medium">
                    🔥 "First to 2025, First in Excellence, First Choice for CWI Professionals!"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Practical Application FAQ
    {
      id: 'practical-faq',
      category: 'clauses',
      title: 'Practical Application FAQ',
      icon: <Book className="w-4 h-4" />,
      description: 'Real-world answers for welding standards, testing, and applications',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            <strong>Field-Ready Knowledge:</strong> Practical answers bridging code theory with real-world application.
          </p>

          <div className="grid grid-cols-1 gap-4">
            <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
              <h4 className="text-blue-300 font-medium mb-2">🏛️ Q1: Primary Standards Organizations</h4>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-800/40 rounded p-3">
                    <h5 className="text-blue-200 text-xs font-medium mb-1">AWS (American Welding Society):</h5>
                    <ul className="text-xs text-blue-200 space-y-1">
                      <li>• A5.2, A5.5 - Welding consumables</li>
                      <li>• B4.0 - Mechanical testing of welds</li>
                      <li>• A2.4 - Welding symbols</li>
                      <li>• D1.1 - Structural steel welding</li>
                    </ul>
                  </div>
                  <div className="bg-green-800/40 rounded p-3">
                    <h5 className="text-green-200 text-xs font-medium mb-1">ASME:</h5>
                    <ul className="text-xs text-green-200 space-y-1">
                      <li>• B31.1 - Power Piping design</li>
                      <li>• Section IX - Welding qualifications</li>
                      <li>• BPVC - Boiler & Pressure Vessel</li>
                      <li>• Fabrication, inspection, testing</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded p-3">
                  <h5 className="text-slate-200 text-xs font-medium mb-1">Supporting Organizations:</h5>
                  <div className="grid grid-cols-4 gap-2 text-xs text-slate-300">
                    <span>• ASTM (Materials)</span>
                    <span>• ANSI (Standards)</span>
                    <span>• ISO (International)</span>
                    <span>• API (Petroleum)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-orange-900/30 border border-orange-700 rounded-lg p-4">
              <h4 className="text-orange-300 font-medium mb-2">⚡ Q2: Electrode Classification System</h4>
              <div className="space-y-3">
                <div className="bg-orange-800/40 rounded p-3">
                  <h5 className="text-orange-200 text-sm font-medium mb-2">EXXX-X Designation (SMAW):</h5>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <ul className="text-xs text-orange-200 space-y-1">
                        <li>• <strong>E70XX:</strong> 70 ksi tensile strength</li>
                        <li>• <strong>Position:</strong> Flat, horizontal, vertical, overhead</li>
                        <li>• <strong>Current:</strong> AC/DC polarity specifications</li>
                      </ul>
                    </div>
                    <div>
                      <ul className="text-xs text-orange-200 space-y-1">
                        <li>• <strong>Covering:</strong> Low hydrogen, rutile, iron powder</li>
                        <li>• <strong>H4/H8:</strong> Diffusible hydrogen content</li>
                        <li>• <strong>Properties:</strong> Chemical composition, mechanics</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-700 rounded p-3">
                  <h5 className="text-yellow-200 text-xs font-medium mb-1">AWS A5.5 Hydrogen Classifications:</h5>
                  <div className="grid grid-cols-2 gap-2 text-xs text-yellow-200">
                    <span>• <strong>H4:</strong> ≤4 mL/100g diffusible hydrogen</span>
                    <span>• <strong>H8:</strong> ≤8 mL/100g diffusible hydrogen</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
              <h4 className="text-green-300 font-medium mb-2">🔬 Q3: Key Mechanical Tests for Welds</h4>
              <div className="grid grid-cols-1 gap-3">
                <div className="bg-green-800/40 rounded p-3">
                  <h5 className="text-green-200 text-sm font-medium mb-2">Primary Tests:</h5>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <h6 className="text-green-100 text-xs font-medium mb-1">Tension Tests:</h6>
                      <ul className="text-xs text-green-200 space-y-1">
                        <li>• Ultimate tensile strength</li>
                        <li>• Yield strength</li>
                        <li>• Elongation & reduction</li>
                      </ul>
                    </div>
                    <div>
                      <h6 className="text-blue-100 text-xs font-medium mb-1">Bend Tests:</h6>
                      <ul className="text-xs text-blue-200 space-y-1">
                        <li>• Ductility assessment</li>
                        <li>• Soundness evaluation</li>
                        <li>• Crack resistance</li>
                      </ul>
                    </div>
                    <div>
                      <h6 className="text-yellow-100 text-xs font-medium mb-1">Hardness Tests:</h6>
                      <ul className="text-xs text-yellow-200 space-y-1">
                        <li>• Indentation hardness</li>
                        <li>• HAZ properties</li>
                        <li>• Deformation resistance</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="bg-green-800/40 rounded p-3">
                  <h5 className="text-green-200 text-sm font-medium mb-2">Specialized Tests:</h5>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <h6 className="text-purple-100 text-xs font-medium mb-1">Break Tests:</h6>
                      <ul className="text-xs text-purple-200 space-y-1">
                        <li>• Nick and fillet weld breaks</li>
                        <li>• Gross imperfection detection</li>
                        <li>• Slag, fusion, porosity evaluation</li>
                      </ul>
                    </div>
                    <div>
                      <h6 className="text-red-100 text-xs font-medium mb-1">Fracture Toughness:</h6>
                      <ul className="text-xs text-red-200 space-y-1">
                        <li>• Charpy V-notch impact</li>
                        <li>• Dynamic tear tests</li>
                        <li>• Compact tension tests</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-purple-900/30 border border-purple-700 rounded-lg p-4">
              <h4 className="text-purple-300 font-medium mb-2">🧪 Q4: Weldability Testing Importance</h4>
              <div className="space-y-3">
                <div className="bg-purple-800/40 rounded p-3">
                  <h5 className="text-purple-200 text-sm font-medium mb-2">Purpose & Critical Assessment:</h5>
                  <p className="text-xs text-purple-200 mb-2">
                    Assesses material's capacity to be welded under imposed fabrication conditions for specific structure performance.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <h6 className="text-red-100 text-xs font-medium mb-1">Hydrogen-Assisted Cracking:</h6>
                      <ul className="text-xs text-red-200 space-y-1">
                        <li>• Controlled Thermal Severity (CTS)</li>
                        <li>• Cruciform test</li>
                        <li>• Implant test</li>
                        <li>• Lehigh Restraint test</li>
                      </ul>
                    </div>
                    <div>
                      <h6 className="text-orange-100 text-xs font-medium mb-1">Hot Cracking:</h6>
                      <ul className="text-xs text-orange-200 space-y-1">
                        <li>• Varestraint test</li>
                        <li>• Oblique Y-Groove test</li>
                        <li>• Cracking susceptibility</li>
                        <li>• Procedure optimization</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
              <h4 className="text-blue-300 font-medium mb-2">📐 Q5: Welding Symbol Information</h4>
              <div className="bg-blue-800/40 rounded p-3">
                <h5 className="text-blue-200 text-sm font-medium mb-2">Symbol Components:</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h6 className="text-blue-100 text-xs font-medium mb-1">Basic Elements:</h6>
                    <ul className="text-xs text-blue-200 space-y-1">
                      <li>• <strong>Reference Line:</strong> Horizontal baseline</li>
                      <li>• <strong>Arrow:</strong> Points to joint location</li>
                      <li>• <strong>Basic Symbol:</strong> Weld type indicator</li>
                      <li>• <strong>Tail:</strong> Process/specification info</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="text-green-100 text-xs font-medium mb-1">Specifications:</h6>
                    <ul className="text-xs text-green-200 space-y-1">
                      <li>• <strong>Dimensions:</strong> Size, length, pitch</li>
                      <li>• <strong>Groove:</strong> Angle, root opening</li>
                      <li>• <strong>Contour:</strong> Flush, convex, concave</li>
                      <li>• <strong>Finish:</strong> Grind, chip, machine</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-3 p-2 bg-yellow-900/30 border border-yellow-700 rounded">
                  <h6 className="text-yellow-200 text-xs font-medium mb-1">Special Symbols:</h6>
                  <div className="grid grid-cols-3 gap-2 text-xs text-yellow-200">
                    <span>• <strong>Circle:</strong> Weld all-around</span>
                    <span>• <strong>Flag:</strong> Field weld</span>
                    <span>• <strong>Position:</strong> Arrow/other side</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
              <h4 className="text-slate-200 font-medium mb-2">🏗️ Q6-8: Materials, Joints & Fabrication</h4>
              <div className="grid grid-cols-1 gap-3">
                <div className="bg-slate-600/40 rounded p-3">
                  <h5 className="text-slate-100 text-sm font-medium mb-2">Q6: Structural Steel Materials</h5>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <ul className="text-xs text-slate-200 space-y-1">
                        <li>• <strong>ASTM Compliance:</strong> Specified designations</li>
                        <li>• <strong>Unidentified Steel:</strong> Test for properties</li>
                        <li>• <strong>Heavy Shapes:</strong> Dimensional requirements</li>
                      </ul>
                    </div>
                    <div>
                      <ul className="text-xs text-slate-200 space-y-1">
                        <li>• <strong>Consumables:</strong> AWS A5 specifications</li>
                        <li>• <strong>Properties:</strong> Tensile, yield, chemistry</li>
                        <li>• <strong>Special:</strong> Creep, corrosion resistance</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-600/40 rounded p-3">
                  <h5 className="text-slate-100 text-sm font-medium mb-2">Q7: Common Joint Types</h5>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <h6 className="text-blue-100 text-xs font-medium mb-1">Piping Joints:</h6>
                      <ul className="text-xs text-blue-200 space-y-1">
                        <li>• Welded, flanged, threaded</li>
                        <li>• Expanded, bell end, compression</li>
                        <li>• Brazed, soldered, sleeve coupled</li>
                      </ul>
                    </div>
                    <div>
                      <h6 className="text-green-100 text-xs font-medium mb-1">Structural Joints:</h6>
                      <ul className="text-xs text-green-200 space-y-1">
                        <li>• Butt: Square, V, bevel, U, J groove</li>
                        <li>• Corner, T, lap, edge joints</li>
                        <li>• High-strength bolted connections</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-600/40 rounded p-3">
                  <h5 className="text-slate-100 text-sm font-medium mb-2">Q8: Design, Fabrication & Erection</h5>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <h6 className="text-yellow-100 text-xs font-medium mb-1">Design Phase:</h6>
                      <ul className="text-xs text-yellow-200 space-y-1">
                        <li>• Pressure/temperature conditions</li>
                        <li>• Component criteria & limitations</li>
                        <li>• LRFD/ASD strength design</li>
                        <li>• Expansion, flexibility, supports</li>
                      </ul>
                    </div>
                    <div>
                      <h6 className="text-orange-100 text-xs font-medium mb-1">Fabrication & QC:</h6>
                      <ul className="text-xs text-orange-200 space-y-1">
                        <li>• Welding procedures & PWHT</li>
                        <li>• NDT: RT, UT, VT examination</li>
                        <li>• Pressure testing systems</li>
                        <li>• Mechanical testing verification</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Annexes
    {
      id: 'annexA',
      category: 'annexes',
      title: 'Annex A: Effective Throats of Fillet Welds',
      icon: <FileText className="w-4 h-4" />,
      description: 'Normative - Specifics for skewed T-joints',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Provides calculation methods for effective throat dimensions in fillet welds with skewed T-joint configurations.
          </p>
        </div>
      )
    },
    {
      id: 'annexB',
      category: 'annexes',
      title: 'Annex B: Alternative Preheat Methods',
      icon: <Zap className="w-4 h-4" />,
      description: 'Normative - Alternative preheat determination methods',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Guidelines for alternative methods of determining preheat requirements based on material properties and environmental conditions.
          </p>
        </div>
      )
    },
    {
      id: 'annexD',
      category: 'annexes',
      title: 'Annex D: Temperature-Moisture Charts',
      icon: <FileText className="w-4 h-4" />,
      description: 'Normative - Low-hydrogen electrode handling',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Charts and guidelines for proper handling, storage, and reconditioning of low-hydrogen welding electrodes.
          </p>
        </div>
      )
    },
    {
      id: 'annexH',
      category: 'annexes',
      title: 'Annex H: Phased Array Ultrasonic Testing',
      icon: <Eye className="w-4 h-4" />,
      description: 'Normative - Advanced UT method requirements',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Specific requirements and procedures for Phased Array Ultrasonic Testing (PAUT) as an advanced NDT method.
          </p>
        </div>
      )
    }
  ];

  const filteredSections = awsD11Structure.filter(section => {
    const matchesCategory = activeCategory === 'all' || section.category === activeCategory;
    const matchesSearch = searchTerm === '' ||
      section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3 mb-4">
          <Book className="w-6 h-6 text-blue-400" />
          <h2 className="text-lg font-bold text-white">AWS D1.1:2020 Code Reference</h2>
        </div>
        <p className="text-sm text-slate-300 mb-4">
          Complete structural welding code reference with visual inspection criteria and acceptance standards.
        </p>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search code sections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category Filter */}
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              activeCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveCategory('clauses')}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              activeCategory === 'clauses'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Clauses
          </button>
          <button
            onClick={() => setActiveCategory('annexes')}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              activeCategory === 'annexes'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Annexes
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {filteredSections.map((section) => {
          const isExpanded = expandedSections.has(section.id);

          return (
            <div key={section.id} className="border border-slate-700 rounded-lg">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {section.icon}
                  <div>
                    <h3 className="text-sm font-medium text-white">{section.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{section.description}</p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {isExpanded && (
                <div className="p-4 border-t border-slate-700">
                  {section.content}
                </div>
              )}
            </div>
          );
        })}

        {filteredSections.length === 0 && (
          <div className="text-center text-slate-400 py-8">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No sections found matching your search.</p>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-slate-700">
        <div className="bg-slate-700/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-slate-300 mb-2">📖 Pro Tip</h4>
          <p className="text-xs text-slate-400">
            Always refer to the latest version of AWS D1.1 for complete specifications. This reference covers key sections for field inspection work.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CodeReference;
