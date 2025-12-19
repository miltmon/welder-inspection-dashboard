import type React from 'react';
import { useState } from 'react';
import { Camera, Check, X, AlertTriangle, FileText, Upload, Trash2 } from 'lucide-react';
import type { InspectionItem } from '../App';

interface InspectionChecklistProps {
  items: InspectionItem[];
  onUpdateItem: (id: string, updates: Partial<InspectionItem>) => void;
}

const InspectionChecklist: React.FC<InspectionChecklistProps> = ({ items, onUpdateItem }) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [photoUploading, setPhotoUploading] = useState<string | null>(null);

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleStatusChange = (id: string, status: 'pass' | 'fail') => {
    onUpdateItem(id, { status });
  };

  const handleNotesChange = (id: string, notes: string) => {
    onUpdateItem(id, { notes });
  };

  const handlePhotoUpload = async (id: string, file: File) => {
    setPhotoUploading(id);

    try {
      // Convert file to base64 for storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        const currentItem = items.find(item => item.id === id);
        const newPhotos = [...(currentItem?.photos || []), base64];
        onUpdateItem(id, { photos: newPhotos });
        setPhotoUploading(null);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Failed to upload photo:', error);
      setPhotoUploading(null);
    }
  };

  const removePhoto = (itemId: string, photoIndex: number) => {
    const currentItem = items.find(item => item.id === itemId);
    if (currentItem) {
      const newPhotos = currentItem.photos.filter((_, index) => index !== photoIndex);
      onUpdateItem(itemId, { photos: newPhotos });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 border-red-500';
      case 'medium': return 'text-yellow-400 border-yellow-500';
      case 'low': return 'text-green-400 border-green-500';
      default: return 'text-slate-400 border-slate-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <Check className="w-5 h-5 text-green-400" />;
      case 'fail': return <X className="w-5 h-5 text-red-400" />;
      default: return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-4">AWS D1.1 Clause 6 Visual Inspection</h3>
        <p className="text-slate-300 text-sm">
          Complete each inspection point below. Mark as Pass or Fail, add notes, and upload photos as needed.
        </p>
      </div>

      {items.map((item) => {
        const isExpanded = expandedItems.has(item.id);

        return (
          <div
            key={item.id}
            className={`bg-slate-800/50 backdrop-blur-sm rounded-xl border transition-all ${
              item.status === 'pass' ? 'border-green-500/50 bg-green-900/10' :
              item.status === 'fail' ? 'border-red-500/50 bg-red-900/10' :
              'border-slate-700'
            }`}
          >
            {/* Header */}
            <div
              className="p-6 cursor-pointer"
              onClick={() => toggleExpanded(item.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-2 h-8 rounded-full border-2 ${getPriorityColor(item.priority)}`}></div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">{item.name}</h4>
                    <p className="text-sm text-slate-300">{item.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {getStatusIcon(item.status)}
                  <span className={`text-sm font-medium ${
                    item.status === 'pass' ? 'text-green-400' :
                    item.status === 'fail' ? 'text-red-400' :
                    'text-yellow-400'
                  }`}>
                    {item.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="px-6 pb-6 border-t border-slate-700">
                <div className="pt-6 space-y-6">
                  {/* Pass/Fail Buttons */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      Inspection Result *
                    </label>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleStatusChange(item.id, 'pass')}
                        className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg border transition-colors ${
                          item.status === 'pass'
                            ? 'bg-green-600 border-green-500 text-white'
                            : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-green-600/20 hover:border-green-500'
                        }`}
                      >
                        <Check className="w-5 h-5" />
                        <span>PASS</span>
                      </button>
                      <button
                        onClick={() => handleStatusChange(item.id, 'fail')}
                        className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg border transition-colors ${
                          item.status === 'fail'
                            ? 'bg-red-600 border-red-500 text-white'
                            : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-red-600/20 hover:border-red-500'
                        }`}
                      >
                        <X className="w-5 h-5" />
                        <span>FAIL</span>
                      </button>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      Inspection Notes
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                      <textarea
                        value={item.notes}
                        onChange={(e) => handleNotesChange(item.id, e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-24"
                        placeholder="Add detailed notes about this inspection point..."
                      />
                    </div>
                  </div>

                  {/* Photo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      Documentation Photos
                    </label>

                    {/* Upload Button */}
                    <div className="mb-4">
                      <label className="flex items-center justify-center w-full py-3 px-4 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-900/10 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            files.forEach(file => handlePhotoUpload(item.id, file));
                          }}
                          className="hidden"
                          disabled={photoUploading === item.id}
                        />
                        <div className="flex items-center space-x-2">
                          {photoUploading === item.id ? (
                            <>
                              <Upload className="w-5 h-5 text-blue-400 animate-pulse" />
                              <span className="text-blue-400">Uploading...</span>
                            </>
                          ) : (
                            <>
                              <Camera className="w-5 h-5 text-slate-400" />
                              <span className="text-slate-400">Click to upload photos</span>
                            </>
                          )}
                        </div>
                      </label>
                    </div>

                    {/* Photo Grid */}
                    {item.photos && item.photos.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {item.photos.map((photo, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={photo}
                              alt={`${item.name} documentation ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-slate-600"
                            />
                            <button
                              onClick={() => removePhoto(item.id, index)}
                              className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default InspectionChecklist;
