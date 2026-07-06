import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, AlertCircle, Loader2 } from 'lucide-react';
import { cn, formatFileSize } from '@/lib/utils';
import { validateFile } from '@/lib/documentParser';

interface FileUploaderProps {
  onFileAccepted: (file: File) => void;
  disabled?: boolean;
}

export default function FileUploader({ onFileAccepted, disabled }: FileUploaderProps) {
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);
      const file = acceptedFiles[0];
      if (!file) return;

      const validation = validateFile(file);
      if (!validation.valid) {
        setError(validation.error ?? 'File tidak valid.');
        return;
      }

      setSelectedFile(file);
      onFileAccepted(file);
    },
    [onFileAccepted],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    maxSize: 20 * 1024 * 1024,
    disabled,
  });

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setError(null);
  };

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={cn(
          'relative flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200',
          isDragActive && !isDragReject && 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 scale-[1.01]',
          isDragReject && 'border-red-400 bg-red-50 dark:bg-red-900/20',
          !isDragActive && !selectedFile && 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 hover:border-brand-400 hover:bg-brand-50/40',
          selectedFile && 'border-green-400 bg-green-50 dark:bg-green-900/20',
          disabled && 'opacity-50 pointer-events-none',
        )}
      >
        <input {...getInputProps()} />

        {selectedFile ? (
          <div className="flex items-center gap-3 w-full max-w-sm">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg shrink-0">
              <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{selectedFile.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(selectedFile.size)}</p>
            </div>
            <button
              onClick={removeFile}
              className="p-1.5 rounded-full hover:bg-red-100 text-gray-400 hover:text-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center gap-3">
            <div
              className={cn(
                'flex items-center justify-center w-14 h-14 rounded-xl transition-colors',
                isDragActive ? 'bg-brand-100 dark:bg-brand-900/30' : 'bg-gray-100 dark:bg-gray-800',
              )}
            >
              {isDragActive ? (
                <Loader2 className="w-7 h-7 text-brand-600 dark:text-brand-400 animate-spin" />
              ) : (
                <Upload className="w-7 h-7 text-gray-400 dark:text-gray-500" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {isDragActive ? 'Lepaskan file di sini' : 'Seret & lepas atau klik untuk memilih file'}
              </p>
              <p className="text-xs text-gray-500 mt-1">PDF, DOCX, atau TXT • Maks. 20MB</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
