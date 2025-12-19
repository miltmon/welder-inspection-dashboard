import type React from 'react';
import { useState, useRef } from 'react';
import { Download, FileText, ArrowLeft, RotateCcw, PenTool, Check } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';
import jsPDF from 'jspdf';
import type { WelderInfo, InspectionItem } from '../App';

interface ReportGeneratorProps {
  welderInfo: WelderInfo;
  inspectionData: InspectionItem[];
  onBack: () => void;
  onNewInspection: () => void;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  welderInfo,
  inspectionData,
  onBack,
  onNewInspection
}) => {
  const [signature, setSignature] = useState<string>('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const signatureRef = useRef<SignatureCanvas>(null);

  const saveSignature = () => {
    if (signatureRef.current) {
      const signatureData = signatureRef.current.toDataURL();
      setSignature(signatureData);
    }
  };

  const clearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
    setSignature('');
  };

  const getOverallResult = () => {
    const hasFailures = inspectionData.some(item => item.status === 'fail');
    return hasFailures ? 'FAILED' : 'PASSED';
  };

  const generatePDF = async () => {
    setIsGeneratingPDF(true);

    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let yPosition = margin;

      // Header
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('AWS D1.1 Clause 6 Visual Inspection Report', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      // Inspector Information
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Inspector: ${welderInfo.name}`, margin, yPosition);
      yPosition += 8;
      pdf.text(`Certification ID: ${welderInfo.certId}`, margin, yPosition);
      yPosition += 8;
      pdf.text(`Company: ${welderInfo.company}`, margin, yPosition);
      yPosition += 8;
      pdf.text(`Date: ${welderInfo.date}`, margin, yPosition);
      yPosition += 15;

      // Overall Result
      const overallResult = getOverallResult();
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      if (overallResult === 'PASSED') {
        pdf.setTextColor(0, 128, 0);
      } else {
        pdf.setTextColor(255, 0, 0);
      }
      pdf.text(`Overall Result: ${overallResult}`, margin, yPosition);
      pdf.setTextColor(0, 0, 0);
      yPosition += 20;

      // Inspection Results Table
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Inspection Results:', margin, yPosition);
      yPosition += 10;

      // Table Header
      pdf.setFontSize(10);
      pdf.text('Item', margin, yPosition);
      pdf.text('Status', margin + 80, yPosition);
      pdf.text('Notes', margin + 120, yPosition);
      yPosition += 8;

      // Draw line under header
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 5;

      // Table Content
      pdf.setFont('helvetica', 'normal');
      inspectionData.forEach((item) => {
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          yPosition = margin;
        }

        // Item name
        const itemName = item.name.length > 25 ? item.name.substring(0, 25) + '...' : item.name;
        pdf.text(itemName, margin, yPosition);

        // Status
        if (item.status === 'pass') {
          pdf.setTextColor(0, 128, 0);
        } else if (item.status === 'fail') {
          pdf.setTextColor(255, 0, 0);
        } else {
          pdf.setTextColor(255, 165, 0);
        }
        pdf.text(item.status.toUpperCase(), margin + 80, yPosition);
        pdf.setTextColor(0, 0, 0);

        // Notes (truncated)
        const notes = item.notes.length > 30 ? item.notes.substring(0, 30) + '...' : item.notes;
        pdf.text(notes, margin + 120, yPosition);

        yPosition += 8;
      });

      yPosition += 10;

      // Summary
      const passCount = inspectionData.filter(item => item.status === 'pass').length;
      const failCount = inspectionData.filter(item => item.status === 'fail').length;
      const pendingCount = inspectionData.filter(item => item.status === 'pending').length;

      pdf.setFont('helvetica', 'bold');
      pdf.text('Summary:', margin, yPosition);
      yPosition += 8;
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Total Items: ${inspectionData.length}`, margin, yPosition);
      yPosition += 6;
      pdf.text(`Passed: ${passCount}`, margin, yPosition);
      yPosition += 6;
      pdf.text(`Failed: ${failCount}`, margin, yPosition);
      yPosition += 6;
      pdf.text(`Pending: ${pendingCount}`, margin, yPosition);
      yPosition += 15;

      // Signature
      if (signature) {
        pdf.text('Inspector Signature:', margin, yPosition);
        yPosition += 10;
        try {
          pdf.addImage(signature, 'PNG', margin, yPosition, 60, 20);
          yPosition += 25;
        } catch (error) {
          console.warn('Could not add signature to PDF:', error);
          yPosition += 5;
        }
      }

      // Footer
      pdf.setFontSize(8);
      pdf.text(`Generated: ${new Date().toLocaleString()}`, margin, pageHeight - 10);
      pdf.text('AWS D1.1 Clause 6 Visual Inspection Report', pageWidth - margin, pageHeight - 10, { align: 'right' });

      // Save PDF
      const fileName = `AWS_D1.1_Inspection_${welderInfo.certId}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF report. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const passCount = inspectionData.filter(item => item.status === 'pass').length;
  const failCount = inspectionData.filter(item => item.status === 'fail').length;
  const overallResult = getOverallResult();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Inspection</span>
          </button>

          <h2 className="text-2xl font-bold text-white">Inspection Complete</h2>
        </div>

        <div className={`text-center p-6 rounded-xl border-2 ${
          overallResult === 'PASSED' ? 'bg-green-900/30 border-green-500' : 'bg-red-900/30 border-red-500'
        }`}>
          <div className={`text-4xl font-bold mb-2 ${
            overallResult === 'PASSED' ? 'text-green-400' : 'text-red-400'
          }`}>
            {overallResult}
          </div>
          <p className="text-slate-300">
            {passCount} of {inspectionData.length} items passed inspection
            {failCount > 0 && ` • ${failCount} items failed`}
          </p>
        </div>
      </div>

      {/* Inspection Summary */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-4">Inspection Summary</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-3">Inspector Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Name:</span>
                <span className="text-white">{welderInfo.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Cert ID:</span>
                <span className="text-white">{welderInfo.certId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Company:</span>
                <span className="text-white">{welderInfo.company}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date:</span>
                <span className="text-white">{welderInfo.date}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-3">Results Breakdown</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-green-900/20 border border-green-700 rounded">
                <span className="text-green-300">Passed</span>
                <span className="text-green-300 font-bold">{passCount}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-red-900/20 border border-red-700 rounded">
                <span className="text-red-300">Failed</span>
                <span className="text-red-300 font-bold">{failCount}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-700 border border-slate-600 rounded">
                <span className="text-slate-300">Total Items</span>
                <span className="text-white font-bold">{inspectionData.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Failed Items (if any) */}
      {failCount > 0 && (
        <div className="bg-red-900/20 border border-red-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-red-300 mb-4">Failed Items Requiring Attention</h3>
          <div className="space-y-3">
            {inspectionData.filter(item => item.status === 'fail').map((item) => (
              <div key={item.id} className="bg-red-900/30 border border-red-600 rounded-lg p-4">
                <h4 className="text-red-300 font-medium">{item.name}</h4>
                <p className="text-red-200 text-sm mt-1">{item.description}</p>
                {item.notes && (
                  <p className="text-red-100 text-sm mt-2 italic">Notes: {item.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Signature */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-4">Inspector Signature</h3>

        <div className="space-y-4">
          <div className="border-2 border-dashed border-slate-600 rounded-lg p-4 bg-white">
            <SignatureCanvas
              ref={signatureRef}
              canvasProps={{
                width: 400,
                height: 150,
                className: 'signature-canvas w-full h-full'
              }}
              backgroundColor="white"
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={saveSignature}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Save Signature</span>
            </button>

            <button
              onClick={clearSignature}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Clear</span>
            </button>
          </div>

          {signature && (
            <div className="text-sm text-green-400 flex items-center space-x-2">
              <Check className="w-4 h-4" />
              <span>Signature saved</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={generatePDF}
          disabled={isGeneratingPDF || !signature}
          className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          {isGeneratingPDF ? (
            <>
              <FileText className="w-5 h-5 animate-pulse" />
              <span>Generating PDF...</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span>Download PDF Report</span>
            </>
          )}
        </button>

        <button
          onClick={onNewInspection}
          className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <PenTool className="w-5 h-5" />
          <span>Start New Inspection</span>
        </button>
      </div>

      <div className="text-center text-sm text-slate-400">
        <p>Report generated in compliance with AWS D1.1 Clause 6 requirements</p>
      </div>
    </div>
  );
};

export default ReportGenerator;
