// Audio player constants and configurations
export const AUDIO_FORMATS = [
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/ogg',
  'audio/aac',
  'audio/m4a'
];

export const FILE_EXTENSIONS = ['.mp3', '.wav', '.ogg', '.aac', '.m4a'];

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const STORAGE_KEYS = {
  PLAYLIST: 'audioPlayer_playlist',
  CURRENT_TRACK: 'audioPlayer_currentTrack',
  VOLUME: 'audioPlayer_volume',
  REPEAT_MODE: 'audioPlayer_repeatMode',
  SHUFFLE: 'audioPlayer_shuffle'
};

export const REPEAT_MODES = {
  OFF: 'off',
  ALL: 'all',
  ONE: 'one'
};

export const PLAYER_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  PLAYING: 'playing',
  PAUSED: 'paused',
  ERROR: 'error'
};

export const DEFAULT_VOLUME = 0.8;

export const SEEK_STEP = 10; // seconds

export const FADE_DURATION = 300; // milliseconds

export const UPDATE_INTERVAL = 100; // milliseconds for progress updates

export const SUPPORTED_FORMATS_TEXT = FILE_EXTENSIONS.join(', ');

export const ERROR_MESSAGES = {
  UNSUPPORTED_FORMAT: 'Unsupported audio format. Please upload MP3, WAV, OGG, AAC, or M4A files.',
  FILE_TOO_LARGE: `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit.`,
  LOAD_ERROR: 'Failed to load audio file. Please try again.',
  PLAYBACK_ERROR: 'Playback error occurred. Please try another file.',
  STORAGE_ERROR: 'Failed to save to local storage. Storage may be full.',
  NO_TRACKS: 'No tracks in playlist.',
  INVALID_TRACK: 'Invalid track selected.'
};

export const KEYBOARD_SHORTCUTS = {
  PLAY_PAUSE: ' ', // spacebar
  NEXT_TRACK: 'ArrowRight',
  PREV_TRACK: 'ArrowLeft',
  VOLUME_UP: 'ArrowUp',
  VOLUME_DOWN: 'ArrowDown',
  MUTE: 'm',
  SHUFFLE: 's',
  REPEAT: 'r'
};

export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
  },
  slideIn: {
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 100, opacity: 0 },
    transition: { duration: 0.2 }
  },
  scaleIn: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
    transition: { duration: 0.2 }
  }
};

export const THEME_COLORS = {
  primary: 'from-purple-600 to-blue-600',
  secondary: 'from-pink-500 to-rose-500',
  accent: 'from-emerald-500 to-teal-500',
  dark: 'from-gray-800 to-gray-900',
  glass: 'bg-white/10 backdrop-blur-md border border-white/20'
};