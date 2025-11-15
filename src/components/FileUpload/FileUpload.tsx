import { useState, useRef } from 'react';
import './FileUpload.css';

interface FileUploadProps {
  label: string;
  value: string; // Base64 string
  onChange: (base64: string) => void;
  error?: string;
  accept?: string;
  maxSizeMB?: number;
}

function FileUpload({
  label,
  value,
  onChange,
  error,
  accept = 'image/*',
  maxSizeMB = 5,
}: FileUploadProps) {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const validateFile = (file: File): string | null => {
    // Check file type
    if (accept && !file.type.match(accept.replace('*', '.*'))) {
      return 'Invalid file type. Please upload an image.';
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File size exceeds ${maxSizeMB}MB limit.`;
    }

    return null;
  };

  const handleFileSelect = async (file: File) => {
    setUploadError(null);

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setUploadError(validationError);
      return;
    }

    try {
      const base64 = await convertToBase64(file);
      onChange(base64);
    } catch (err) {
      setUploadError('Failed to process image. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemove = () => {
    onChange('');
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="file-upload">
      <label className="file-upload__label">{label}</label>

      <input
        ref={fileInputRef}
        type="file"
        className="file-upload__input"
        accept={accept}
        onChange={handleInputChange}
        aria-label={label}
      />

      {!value ? (
        <div
          className={`file-upload__dropzone ${isDragging ? 'file-upload__dropzone--dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        >
          <div className="file-upload__dropzone-content">
            <svg
              className="file-upload__icon"
              xmlns="http://www.w3.org/2000/svg"
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
            <p className="file-upload__text">
              <span className="file-upload__text-primary">Click to upload</span> or drag and drop
            </p>
            <p className="file-upload__hint">PNG, JPG, GIF up to {maxSizeMB}MB</p>
          </div>
        </div>
      ) : (
        <div className="file-upload__preview">
          <img src={value} alt="Preview" className="file-upload__preview-image" />
          <button
            type="button"
            className="file-upload__remove-btn"
            onClick={handleRemove}
            aria-label="Remove image"
          >
            ✕
          </button>
        </div>
      )}

      {(error || uploadError) && (
        <div className="file-upload__error">{error || uploadError}</div>
      )}
    </div>
  );
}

export default FileUpload;
