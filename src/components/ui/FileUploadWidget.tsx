'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, X, Image as ImageIcon } from 'lucide-react';
import { uploadToSupabaseStorage, StorageUploadResult } from '@/lib/supabase/storage';

interface FileUploadWidgetProps {
  label: string;
  description?: string;
  bucket: 'public-media' | 'private-vault';
  folderPrefix: string;
  acceptedFileTypes?: string; // e.g. "image/*,.pdf"
  maxSizeMb?: number;
  value?: string;
  onUploadComplete: (result: StorageUploadResult) => void;
  className?: string;
}

export const FileUploadWidget: React.FC<FileUploadWidgetProps> = ({
  label,
  description,
  bucket,
  folderPrefix,
  acceptedFileTypes = 'image/*,.pdf',
  maxSizeMb = 5,
  value,
  onUploadComplete,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  const [fileName, setFileName] = useState<string | null>(value ? value.split('/').pop() || 'Existing file' : null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = async (file: File) => {
    setErrorMsg(null);

    // Validate size
    if (file.size > maxSizeMb * 1024 * 1024) {
      setErrorMsg(`File size exceeds maximum allowed size of ${maxSizeMb}MB.`);
      return;
    }

    setFileName(file.name);
    setUploading(true);

    // Generate local preview if image
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }

    try {
      const result = await uploadToSupabaseStorage(bucket, folderPrefix, file);
      if (result.ok) {
        if (result.publicUrl) {
          setPreviewUrl(result.publicUrl);
        }
        onUploadComplete(result);
      } else {
        setErrorMsg(result.error || 'Upload failed. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Upload error');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewUrl(null);
    setFileName(null);
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="block text-xs font-bold text-[#0B1E36]">
        {label}
      </label>
      {description && (
        <p className="text-[11px] text-slate-500">{description}</p>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-4 transition-all cursor-pointer flex flex-col items-center justify-center text-center ${
          isDragging
            ? 'border-blue-600 bg-blue-50/60'
            : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFileProcess(e.target.files[0]);
            }
          }}
          accept={acceptedFileTypes}
          className="hidden"
        />

        {uploading ? (
          <div className="py-4 flex flex-col items-center gap-2">
            <Loader2 className="w-7 h-7 animate-spin text-[#0B1E36]" />
            <span className="text-xs font-semibold text-slate-700">Uploading to encrypted vault...</span>
          </div>
        ) : previewUrl && acceptedFileTypes.includes('image') ? (
          <div className="relative group w-full flex flex-col items-center">
            <img
              src={previewUrl}
              alt="Uploaded preview"
              className="w-32 h-24 object-cover rounded-xl border border-slate-200 shadow-sm"
            />
            <span className="text-xs font-medium text-slate-600 mt-2 truncate max-w-[200px]">
              {fileName}
            </span>
            <button
              type="button"
              onClick={handleClear}
              className="mt-2 text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Change File
            </button>
          </div>
        ) : fileName ? (
          <div className="py-2 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="text-xs font-semibold text-[#0B1E36] truncate max-w-[220px]">
              {fileName}
            </span>
            <button
              type="button"
              onClick={handleClear}
              className="text-slate-400 hover:text-slate-600 ml-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="py-3 flex flex-col items-center gap-1.5">
            <div className="w-9 h-9 rounded-full bg-white shadow-2xs border border-slate-200/80 flex items-center justify-center text-slate-600">
              <Upload className="w-4 h-4 text-[#0B1E36]" />
            </div>
            <div className="text-xs font-semibold text-[#0B1E36]">
              Click to browse or drop file here
            </div>
            <div className="text-[10px] text-slate-400">
              Max {maxSizeMb}MB ({acceptedFileTypes})
            </div>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium pt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
