// Audio file validation and processing utilities
const SUPPORTED_AUDIO_FORMATS = ['mp3', 'wav', 'ogg', 'm4a', 'aac'];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

// Local storage keys
const STORAGE_KEYS = {
  AUDIO_FILES: 'audioPlayer_files',
  CURRENT_PLAYLIST: 'audioPlayer_playlist',
  PLAYER_SETTINGS: 'audioPlayer_settings'
};

// Validate audio file
export const validateAudioFile = (file) => {
  const errors = [];
  
  if (!file) {
    errors.push('No file provided');
    return { isValid: false, errors };
  }
  
  // Check file type
  const fileExtension = file.name.split('.').pop().toLowerCase();
  if (!SUPPORTED_AUDIO_FORMATS.includes(fileExtension)) {
    errors.push(`Unsupported format. Supported: ${SUPPORTED_AUDIO_FORMATS.join(', ')}`);
  }
  
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    errors.push(`File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`);
  }
  
  // Check MIME type
  if (!file.type.startsWith('audio/')) {
    errors.push('Invalid audio file');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Convert file to base64 for storage
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Extract audio metadata
export const extractAudioMetadata = (file) => {
  return new Promise((resolve) => {
    const audio = new Audio();
    const objectUrl = URL.createObjectURL(file);
    
    audio.addEventListener('loadedmetadata', () => {
      const metadata = {
        duration: audio.duration,
        title: file.name.replace(/\.[^/.]+$/, ''),
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      };
      
      URL.revokeObjectURL(objectUrl);
      resolve(metadata);
    });
    
    audio.addEventListener('error', () => {
      URL.revokeObjectURL(objectUrl);
      resolve({
        duration: 0,
        title: file.name.replace(/\.[^/.]+$/, ''),
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      });
    });
    
    audio.src = objectUrl;
  });
};

// Format duration in MM:SS format
export const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

// Save audio files to localStorage
export const saveAudioFiles = (files) => {
  try {
    const serializedFiles = JSON.stringify(files);
    localStorage.setItem(STORAGE_KEYS.AUDIO_FILES, serializedFiles);
    return true;
  } catch (error) {
    console.error('Error saving audio files:', error);
    return false;
  }
};

// Load audio files from localStorage
export const loadAudioFiles = () => {
  try {
    const serializedFiles = localStorage.getItem(STORAGE_KEYS.AUDIO_FILES);
    return serializedFiles ? JSON.parse(serializedFiles) : [];
  } catch (error) {
    console.error('Error loading audio files:', error);
    return [];
  }
};

// Save current playlist
export const savePlaylist = (playlist) => {
  try {
    const serializedPlaylist = JSON.stringify(playlist);
    localStorage.setItem(STORAGE_KEYS.CURRENT_PLAYLIST, serializedPlaylist);
    return true;
  } catch (error) {
    console.error('Error saving playlist:', error);
    return false;
  }
};

// Load current playlist
export const loadPlaylist = () => {
  try {
    const serializedPlaylist = localStorage.getItem(STORAGE_KEYS.CURRENT_PLAYLIST);
    return serializedPlaylist ? JSON.parse(serializedPlaylist) : [];
  } catch (error) {
    console.error('Error loading playlist:', error);
    return [];
  }
};

// Save player settings
export const savePlayerSettings = (settings) => {
  try {
    const serializedSettings = JSON.stringify(settings);
    localStorage.setItem(STORAGE_KEYS.PLAYER_SETTINGS, serializedSettings);
    return true;
  } catch (error) {
    console.error('Error saving player settings:', error);
    return false;
  }
};

// Load player settings
export const loadPlayerSettings = () => {
  try {
    const serializedSettings = localStorage.getItem(STORAGE_KEYS.PLAYER_SETTINGS);
    return serializedSettings ? JSON.parse(serializedSettings) : {
      volume: 0.8,
      shuffle: false,
      repeat: 'none', // 'none', 'one', 'all'
      currentTrackIndex: 0
    };
  } catch (error) {
    console.error('Error loading player settings:', error);
    return {
      volume: 0.8,
      shuffle: false,
      repeat: 'none',
      currentTrackIndex: 0
    };
  }
};

// Clear all stored data
export const clearAllData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};

// Generate unique ID for audio files
export const generateFileId = () => {
  return `audio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Create audio file object
export const createAudioFileObject = async (file) => {
  const validation = validateAudioFile(file);
  if (!validation.isValid) {
    throw new Error(validation.errors.join(', '));
  }
  
  const [base64Data, metadata] = await Promise.all([
    fileToBase64(file),
    extractAudioMetadata(file)
  ]);
  
  return {
    id: generateFileId(),
    name: file.name,
    title: metadata.title,
    duration: metadata.duration,
    size: metadata.size,
    type: metadata.type,
    data: base64Data,
    addedAt: new Date().toISOString(),
    lastModified: metadata.lastModified
  };
};

// Shuffle array utility
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Get next track index based on repeat mode
export const getNextTrackIndex = (currentIndex, playlistLength, repeatMode, isNext = true) => {
  if (playlistLength === 0) return 0;
  
  switch (repeatMode) {
    case 'one':
      return currentIndex;
    case 'all':
      if (isNext) {
        return (currentIndex + 1) % playlistLength;
      } else {
        return currentIndex === 0 ? playlistLength - 1 : currentIndex - 1;
      }
    default: // 'none'
      if (isNext) {
        return currentIndex < playlistLength - 1 ? currentIndex + 1 : currentIndex;
      } else {
        return currentIndex > 0 ? currentIndex - 1 : 0;
      }
  }
};

// Check if there's enough storage space
export const checkStorageSpace = () => {
  try {
    const testKey = 'storage_test';
    const testData = 'x'.repeat(1024); // 1KB test
    localStorage.setItem(testKey, testData);
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};

// Get storage usage information
export const getStorageInfo = () => {
  let totalSize = 0;
  let audioFilesSize = 0;
  
  try {
    // Calculate total localStorage usage
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length;
        if (key === STORAGE_KEYS.AUDIO_FILES) {
          audioFilesSize = localStorage[key].length;
        }
      }
    }
    
    return {
      totalSize: totalSize * 2, // Each character is 2 bytes in UTF-16
      audioFilesSize: audioFilesSize * 2,
      totalSizeFormatted: formatFileSize(totalSize * 2),
      audioFilesSizeFormatted: formatFileSize(audioFilesSize * 2)
    };
  } catch (error) {
    console.error('Error calculating storage info:', error);
    return {
      totalSize: 0,
      audioFilesSize: 0,
      totalSizeFormatted: '0 B',
      audioFilesSizeFormatted: '0 B'
    };
  }
};