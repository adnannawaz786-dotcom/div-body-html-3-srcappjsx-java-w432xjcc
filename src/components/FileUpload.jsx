import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Music, X, AlertCircle } from 'lucide-react';
import { saveAudioFile } from '../utils/audioUtils';

const FileUpload = ({ onFilesUploaded, className = '' }) => {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const supportedFormats = ['mp3', 'wav', 'ogg', 'm4a', 'aac'];
  const maxFileSize = 50 * 1024 * 1024; // 50MB

  const validateFile = (file) => {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (!supportedFormats.includes(fileExtension)) {
      return `Unsupported format. Please use: ${supportedFormats.join(', ')}`;
    }
    
    if (file.size > maxFileSize) {
      return 'File size too large. Maximum size is 50MB.';
    }
    
    return null;
  };

  const processFiles = async (files) => {
    setIsUploading(true);
    setUploadError('');
    
    const fileArray = Array.from(files);
    const validFiles = [];
    const errors = [];

    // Validate all files first
    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    }

    if (errors.length > 0) {
      setUploadError(errors.join('\n'));
      setIsUploading(false);
      return;
    }

    try {
      const processedFiles = [];
      
      for (const file of validFiles) {
        const audioData = await saveAudioFile(file);
        processedFiles.push(audioData);
      }

      onFilesUploaded(processedFiles);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error processing files:', error);
      setUploadError('Failed to process files. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const clearError = () => {
    setUploadError('');
  };

  return (
    <div className={`w-full ${className}`}>
      <motion.div
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-300 backdrop-blur-sm
          ${isDragOver 
            ? 'border-blue-400 bg-blue-500/10' 
            : 'border-gray-300 dark:border-gray-600 bg-white/5 hover:bg-white/10'
          }
          ${isUploading ? 'pointer-events-none opacity-50' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={supportedFormats.map(format => `.${format}`).join(',')}
          multiple
          onChange={handleFileSelect}
          className="hidden"
          aria-label="Upload audio files"
        />

        <div className="flex flex-col items-center space-y-4">
          <motion.div
            className={`
              p-4 rounded-full
              ${isDragOver ? 'bg-blue-500/20' : 'bg-gray-100/20 dark:bg-gray-800/20'}
            `}
            animate={{ 
              rotate: isUploading ? 360 : 0,
              scale: isDragOver ? 1.1 : 1
            }}
            transition={{ 
              rotate: { duration: 2, repeat: isUploading ? Infinity : 0, ease: "linear" },
              scale: { duration: 0.2 }
            }}
          >
            {isUploading ? (
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-gray-600 dark:text-gray-400" />
            )}
          </motion.div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {isUploading ? 'Processing Files...' : 'Upload Audio Files'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {isDragOver 
                ? 'Drop your files here' 
                : 'Drag and drop files here, or click to browse'
              }
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Supported formats: {supportedFormats.join(', ').toUpperCase()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Maximum file size: 50MB
            </p>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <Music className="w-4 h-4" />
            <span>Multiple files supported</span>
          </div>
        </div>

        {isDragOver && (
          <motion.div
            className="absolute inset-0 bg-blue-500/10 rounded-xl border-2 border-blue-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </motion.div>

      {uploadError && (
        <motion.div
          className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                Upload Error
              </h4>
              <pre className="text-sm text-red-700 dark:text-red-300 whitespace-pre-wrap">
                {uploadError}
              </pre>
            </div>
            <button
              onClick={clearError}
              className="text-red-500 hover:text-red-700 transition-colors"
              aria-label="Clear error"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      <div className="mt-4 text-center">
        <button
          onClick={openFileDialog}
          disabled={isUploading}
          className="
            px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400
            text-white rounded-lg font-medium transition-colors
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            disabled:cursor-not-allowed
          "
        >
          {isUploading ? 'Processing...' : 'Choose Files'}
        </button>
      </div>
    </div>
  );
};

export default FileUpload;