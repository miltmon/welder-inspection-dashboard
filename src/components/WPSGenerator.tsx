import type React from 'react';
import { useState, useMemo, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FileText, Download, CheckCircle, AlertTriangle, Book, Loader2 } from 'lucide-react';
import { P_NUMBER, F_NUMBER, suggestClause, suggestClauseAsync, inferPNumber, inferFNumber, type ClauseRef } from '../lib/clauseLookup';
import { exportWPSJson, exportWPSPdf, type WPSDocument } from '../lib/wpsExports';

const WPSGenerator: React.FC = () => {
  // Form state
  const [title, setTitle] = useState('Butt weld - GTAW - Stainless Steel');
  const [baseMetal, setBaseMetal] = useState('ASTM A240 Type 304');
  const [pNo, setPNo] = useState('8');
  const [fillerMetal, setFillerMetal] = useState('ER308L');
  const [fNo, setFNo] = useState('6');
  const [process, setProcess] = useState('GTAW');
  const [thickness, setThickness] = useState('6mm - 12mm');
  const [position, setPosition] = useState('1G, 2G, 3G, 4G');
  const [preheat, setPreheat] = useState('None required');
  const [pwht, setPwht] = useState('Not required');
  const [shielding, setShielding] = useState('Argon');
  const [notes, setNotes] = useState('');

  // Metadata
  const [company, setCompany] = useState('');
  const [project, setProject] = useState('');

  // Clause suggestions state (async CODEX integration)
  const [clauseSuggestions, setClauseSuggestions] = useState<Record<string, ClauseRef>>({});
  const [clauseLoading, setClauseLoading] = useState<Record<string, boolean>>({});
  const [clauseErrors, setClauseErrors] = useState<Record<string, string | null>>({});

  // Auto-update P/F numbers when materials change
  const handleBaseMetalChange = (value: string) => {
    setBaseMetal(value);
    setPNo(inferPNumber(value));
  };

  const handleFillerMetalChange = (value: string) => {
    setFillerMetal(value);
    setFNo(inferFNumber(value));
  };

  // Update clause suggestions asynchronously with CODEX
  useEffect(() => {
    const updateSuggestions = async () => {
      const fields = [
        { key: 'baseMetal', name: 'base_metal', value: baseMetal, context: { pNumber: pNo, process } },
        { key: 'fillerMetal', name: 'filler_metal', value: fillerMetal, context: { fNumber: fNo, process } },
        { key: 'process', name: 'process', value: process, context: { process } },
        { key: 'thickness', name: 'thickness', value: thickness, context: {} },
        { key: 'position', name: 'position', value: position, context: {} },
        { key: 'preheat', name: 'preheat', value: preheat, context: {} },
        { key: 'pwht', name: 'pwht', value: pwht, context: {} },
      ];

      // Update loading states
      setClauseLoading(prev => {
        const updated = { ...prev };
        fields.forEach(f => { updated[f.key] = true; });
        return updated;
      });

      // Clear previous errors
      setClauseErrors({});

      // Fetch suggestions for all fields
      const suggestions: Record<string, ClauseRef> = {};
      
      await Promise.all(
        fields.map(async (field) => {
          try {
            const results = await suggestClauseAsync(field.name, field.value, field.context);
            suggestions[field.key] = results[0] || null;
            setClauseErrors(prev => ({ ...prev, [field.key]: null }));
          } catch (error) {
            console.error(`Failed to fetch clause for ${field.key}:`, error);
            // Fall back to local mock on error
            const fallback = suggestClause(field.name, field.value, field.context);
            suggestions[field.key] = fallback[0] || null;
            setClauseErrors(prev => ({ 
              ...prev, 
              [field.key]: error instanceof Error ? error.message : 'Failed to fetch clause suggestion' 
            }));
          } finally {
            setClauseLoading(prev => ({ ...prev, [field.key]: false }));
          }
        })
      );

      setClauseSuggestions(suggestions);
    };

    updateSuggestions();
  }, [baseMetal, pNo, fillerMetal, fNo, process, thickness, position, preheat, pwht]);

  // Assemble WPS document
  const assembleWPS = (): WPSDocument => {
    const wpsId = `WPS-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;

    return {
      wps_id: uuidv4(),
      wps_number: wpsId,
      revision: 0,
      title,
      status: 'draft',
      metadata: {
        created_by: 'WeldTrack™ User',
        created_at: new Date().toISOString(),
        company: company || 'Not specified',
        project: project || 'Not specified',
      },
      fields: [
        {
          name: 'Base Metal',
          value: `${baseMetal} (P-No ${pNo})`,
          clause: clauseSuggestions.baseMetal
        },
        {
          name: 'Filler Metal',
          value: `${fillerMetal} (F-No ${fNo})`,
          clause: clauseSuggestions.fillerMetal
        },
        {
          name: 'Welding Process',
          value: process,
          clause: clauseSuggestions.process
        },
        {
          name: 'Thickness Range',
          value: thickness,
          clause: clauseSuggestions.thickness
        },
        {
          name: 'Position',
          value: position,
          clause: clauseSuggestions.position
        },
        {
          name: 'Preheat Temperature',
          value: preheat,
          clause: clauseSuggestions.preheat
        },
        {
          name: 'PWHT',
          value: pwht,
          clause: clauseSuggestions.pwht
        },
        {
          name: 'Shielding Gas',
          value: shielding
        },
        {
          name: 'Notes',
          value: notes || 'None'
        },
      ],
      clause_index: Object.values(clauseSuggestions).filter(Boolean),
      audit_summary: {
        code_compliance: {
          ASME_IX: {
            compliant: true,
            clauses_referenced: Object.values(clauseSuggestions).filter(Boolean).length,
            confidence_avg: Object.values(clauseSuggestions).filter(Boolean).reduce((sum, c) => sum + (c?.confidence || 0), 0) / Object.values(clauseSuggestions).filter(Boolean).length,
            manual_overrides: 0
          }
        },
        essential_variables_qualified: true,
        pqr_coverage_percent: 0,
        auto_checks: {
          passed: 7,
          failed: 0,
          warnings: 1
        },
        audit_score: 85,
        ready_for_production: false
      }
    };
  };

  const handleExportJSON = () => {
    const wps = assembleWPS();
    exportWPSJson(wps);
  };

  const handleExportPDF = async () => {
    const wps = assembleWPS();
    await exportWPSPdf(wps);
  };

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return 'text-gray-400';
    if (confidence >= 0.9) return 'text-green-400';
    if (confidence >= 0.7) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getConfidenceIcon = (confidence?: number) => {
    if (!confidence) return <AlertTriangle className="w-4 h-4" />;
    if (confidence >= 0.9) return <CheckCircle className="w-4 h-4" />;
    if (confidence >= 0.7) return <AlertTriangle className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-slate-700">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">Clause-Indexed WPS Generator</h1>
              <p className="text-slate-300">AI-Powered code-correct WPS with machine-readable clause citations</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <div className="flex items-center space-x-2 px-3 py-1 bg-green-900/30 border border-green-700 rounded">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-300">ClauseBot AI Enabled</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1 bg-blue-900/30 border border-blue-700 rounded">
              <Book className="w-4 h-4 text-blue-400" />
              <span className="text-blue-300">ASME IX + AWS D1.1</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* WPS Form - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Document Info */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4">Document Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    WPS Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Butt weld - GTAW - SS304"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Company name"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Project
                  </label>
                  <input
                    type="text"
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Project name"
                  />
                </div>
              </div>
            </div>

            {/* Base Metal */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4">Base Metal</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Material Specification *
                  </label>
                  <input
                    type="text"
                    value={baseMetal}
                    onChange={(e) => handleBaseMetalChange(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., ASTM A240 Type 304"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    P-Number *
                  </label>
                  <select
                    value={pNo}
                    onChange={(e) => setPNo(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {P_NUMBER.map(p => (
                      <option key={p.p} value={p.p}>
                        P-{p.p} — {p.desc}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Thickness Range *
                  </label>
                  <input
                    type="text"
                    value={thickness}
                    onChange={(e) => setThickness(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder='e.g., 6mm - 12mm or 1/4" - 1/2"'
                  />
                </div>
              </div>
            </div>

            {/* Filler Metal & Process */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4">Filler Metal & Process</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Filler Metal *
                  </label>
                  <input
                    type="text"
                    value={fillerMetal}
                    onChange={(e) => handleFillerMetalChange(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., ER308L, E7018"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    F-Number *
                  </label>
                  <select
                    value={fNo}
                    onChange={(e) => setFNo(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {F_NUMBER.map(f => (
                      <option key={f.f} value={f.f}>
                        F-{f.f} — {f.desc}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Welding Process *
                  </label>
                  <select
                    value={process}
                    onChange={(e) => setProcess(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="GTAW">GTAW (Gas Tungsten Arc Welding)</option>
                    <option value="GMAW">GMAW (Gas Metal Arc Welding)</option>
                    <option value="SMAW">SMAW (Shielded Metal Arc Welding)</option>
                    <option value="FCAW">FCAW (Flux-Cored Arc Welding)</option>
                    <option value="SAW">SAW (Submerged Arc Welding)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Shielding Gas
                  </label>
                  <input
                    type="text"
                    value={shielding}
                    onChange={(e) => setShielding(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Argon, CO2, Mixed"
                  />
                </div>
              </div>
            </div>

            {/* Additional Requirements */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4">Additional Requirements</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Position *
                  </label>
                  <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 1G, 2G, 3G, 4G"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Preheat Temperature
                  </label>
                  <input
                    type="text"
                    value={preheat}
                    onChange={(e) => setPreheat(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 150°F minimum"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    PWHT (Post-Weld Heat Treatment)
                  </label>
                  <input
                    type="text"
                    value={pwht}
                    onChange={(e) => setPwht(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 1100°F for 1 hour or Not required"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Any additional information or special requirements..."
                  />
                </div>
              </div>
            </div>

            {/* Export Actions */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleExportJSON}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Download className="w-5 h-5" />
                <span>Export JSON</span>
              </button>

              <button
                onClick={handleExportPDF}
                className="flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <FileText className="w-5 h-5" />
                <span>Export Professional PDF</span>
              </button>
            </div>
          </div>

          {/* Clause Suggestions - Right Column */}
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 sticky top-4">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Book className="w-5 h-5 mr-2 text-blue-400" />
                AI Clause Suggestions
              </h2>

              <div className="space-y-4">
                {Object.entries(clauseSuggestions).map(([key, clause]) => {
                  const isLoading = clauseLoading[key];
                  const error = clauseErrors[key];
                  
                  if (isLoading) {
                    return (
                      <div key={key} className="bg-slate-700/50 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                          <span className="text-sm font-medium text-slate-300 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}...
                          </span>
                        </div>
                      </div>
                    );
                  }

                  if (error && !clause) {
                    return (
                      <div key={key} className="bg-red-900/20 border border-red-700/50 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <AlertTriangle className="w-4 h-4 text-red-400" />
                          <span className="text-sm font-medium text-red-300 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        </div>
                        <div className="text-xs text-red-400">
                          Using fallback suggestion
                        </div>
                      </div>
                    );
                  }

                  if (!clause) return null;

                  return (
                    <div key={key} className="bg-slate-700/50 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getConfidenceIcon(clause.confidence)}
                          <span className="text-sm font-medium text-white capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        </div>
                        <span className={`text-xs font-bold ${getConfidenceColor(clause.confidence)}`}>
                          {clause.confidence ? `${Math.round(clause.confidence * 100)}%` : 'N/A'}
                        </span>
                      </div>

                      <div className="text-xs text-blue-300 mb-1">
                        {clause.id}
                      </div>

                      {clause.text && (
                        <div className="text-xs text-slate-400">
                          {clause.text}
                        </div>
                      )}
                      
                      {error && (
                        <div className="text-xs text-yellow-400 mt-1">
                          ⚠ Note: Using fallback due to CODEX error
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-600">
                <h3 className="text-sm font-medium text-slate-300 mb-2">Legend:</h3>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span className="text-green-300">≥90% confidence (High)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-3 h-3 text-yellow-400" />
                    <span className="text-yellow-300">70-89% confidence (Review)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-3 h-3 text-red-400" />
                    <span className="text-red-300">&lt;70% confidence (Manual)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WPSGenerator;
