import { useState, useRef } from 'react';
import { uploadClientDocument } from '@/lib/documentService';
import { ClientDocument } from '@/types';

interface DocumentUploadProps {
  clientId: string;
  onUploadComplete: (document: ClientDocument) => void;
  onUploadError: (error: Error) => void;
}

export default function DocumentUpload({ clientId, onUploadComplete, onUploadError }: DocumentUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    // Kontrollera att det är en PDF-fil
    if (file.type !== 'application/pdf') {
      onUploadError(new Error('Endast PDF-filer är tillåtna'));
      return;
    }

    setIsUploading(true);
    try {
      const uploadedDocument = await uploadClientDocument(clientId, file);
      onUploadComplete(uploadedDocument);
    } catch (error) {
      onUploadError(error instanceof Error ? error : new Error('Fel vid uppladdning'));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mb-4">
      <div 
        className={`p-4 border-2 border-dashed rounded-lg text-center cursor-pointer 
        ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8 text-gray-500 mb-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
            />
          </svg>
          <p className="text-sm text-gray-600">
            {isUploading 
              ? 'Laddar upp fil...' 
              : 'Dra och släpp PDF-fil eller klicka för att välja'}
          </p>
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="application/pdf"
        style={{ display: 'none' }}
      />
    </div>
  );
} 