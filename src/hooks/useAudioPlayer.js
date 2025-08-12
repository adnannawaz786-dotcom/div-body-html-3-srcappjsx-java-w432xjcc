import { useState, useRef, useEffect, useCallback } from 'react';
import { saveToStorage, loadFromStorage, generateId } from '../utils/audioUtils';
import { STORAGE_KEYS, AUDIO_EVENTS } from '../lib/constants';

export const useAudioPlayer = () => {
  const audioRef = useRef(null);
  const [playlist, setPlaylist] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('none'); // 'none', 'one', 'all'
  const [error, setError] = useState(null);

  // Load playlist from localStorage on mount
  useEffect(() => {
    const savedPlaylist = loadFromStorage(STORAGE_KEYS.PLAYLIST);
    const savedCurrentTrackIndex = loadFromStorage(STORAGE_KEYS.CURRENT_TRACK_INDEX);
    const savedVolume = loadFromStorage(STORAGE_KEYS.VOLUME);
    const savedRepeatMode = loadFromStorage(STORAGE_KEYS.REPEAT_MODE);
    const savedIsShuffled = loadFromStorage(STORAGE_KEYS.IS_SHUFFLED);

    if (savedPlaylist && savedPlaylist.length > 0) {
      setPlaylist(savedPlaylist);
      
      if (savedCurrentTrackIndex !== null && savedCurrentTrackIndex >= 0 && savedCurrentTrackIndex < savedPlaylist.length) {
        setCurrentTrackIndex(savedCurrentTrackIndex);
        setCurrentTrack(savedPlaylist[savedCurrentTrackIndex]);
      }
    }

    if (savedVolume !== null) {
      setVolume(savedVolume);
    }

    if (savedRepeatMode) {
      setRepeatMode(savedRepeatMode);
    }

    if (savedIsShuffled !== null) {
      setIsShuffled(savedIsShuffled);
    }
  }, []);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      handleNext();
    };

    const handleError = (e) => {
      setError('Failed to load audio file');
      setIsLoading(false);
      setIsPlaying(false);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
      setError(null);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [currentTrack]);

  // Update audio volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Save state to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PLAYLIST, playlist);
  }, [playlist]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CURRENT_TRACK_INDEX, currentTrackIndex);
  }, [currentTrackIndex]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.VOLUME, volume);
  }, [volume]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.REPEAT_MODE, repeatMode);
  }, [repeatMode]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.IS_SHUFFLED, isShuffled);
  }, [isShuffled]);

  const addToPlaylist = useCallback((files) => {
    const newTracks = Array.from(files).map(file => ({
      id: generateId(),
      name: file.name.replace(/\.[^/.]+$/, ''),
      file: file,
      url: URL.createObjectURL(file),
      duration: 0,
      artist: 'Unknown Artist',
      album: 'Unknown Album'
    }));

    setPlaylist(prev => [...prev, ...newTracks]);
    
    // If no current track, set the first new track as current
    if (currentTrackIndex === -1 && newTracks.length > 0) {
      setCurrentTrackIndex(playlist.length);
      setCurrentTrack(newTracks[0]);
    }
  }, [playlist.length, currentTrackIndex]);

  const removeFromPlaylist = useCallback((trackId) => {
    setPlaylist(prev => {
      const newPlaylist = prev.filter(track => track.id !== trackId);
      const removedTrackIndex = prev.findIndex(track => track.id === trackId);
      
      // Adjust current track index if necessary
      if (removedTrackIndex === currentTrackIndex) {
        // If current track is removed, stop playing
        setIsPlaying(false);
        setCurrentTrack(null);
        setCurrentTrackIndex(-1);
      } else if (removedTrackIndex < currentTrackIndex) {
        // If removed track is before current track, adjust index
        setCurrentTrackIndex(prev => prev - 1);
      }
      
      return newPlaylist;
    });
  }, [currentTrackIndex]);

  const playTrack = useCallback((trackIndex) => {
    if (trackIndex >= 0 && trackIndex < playlist.length) {
      const track = playlist[trackIndex];
      setCurrentTrack(track);
      setCurrentTrackIndex(trackIndex);
      setIsPlaying(true);
      setError(null);
    }
  }, [playlist]);

  const togglePlayPause = useCallback(() => {
    if (!currentTrack) return;

    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play().catch(err => {
        setError('Failed to play audio');
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  }, [currentTrack, isPlaying]);

  const handleNext = useCallback(() => {
    if (playlist.length === 0) return;

    let nextIndex;
    
    if (repeatMode === 'one') {
      nextIndex = currentTrackIndex;
    } else if (isShuffled) {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } else {
      nextIndex = currentTrackIndex + 1;
      
      if (nextIndex >= playlist.length) {
        if (repeatMode === 'all') {
          nextIndex = 0;
        } else {
          setIsPlaying(false);
          return;
        }
      }
    }

    playTrack(nextIndex);
  }, [playlist.length, currentTrackIndex, repeatMode, isShuffled, playTrack]);

  const handlePrevious = useCallback(() => {
    if (playlist.length === 0) return;

    let prevIndex;
    
    if (repeatMode === 'one') {
      prevIndex = currentTrackIndex;
    } else if (isShuffled) {
      prevIndex = Math.floor(Math.random() * playlist.length);
    } else {
      prevIndex = currentTrackIndex - 1;
      
      if (prevIndex < 0) {
        if (repeatMode === 'all') {
          prevIndex = playlist.length - 1;
        } else {
          prevIndex = 0;
        }
      }
    }

    playTrack(prevIndex);
  }, [playlist.length, currentTrackIndex, repeatMode, isShuffled, playTrack]);

  const seekTo = useCallback((time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const setVolumeLevel = useCallback((newVolume) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    if (clampedVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffled(prev => !prev);
  }, []);

  const cycleRepeatMode = useCallback(() => {
    setRepeatMode(prev => {
      switch (prev) {
        case 'none':
          return 'all';
        case 'all':
          return 'one';
        case 'one':
          return 'none';
        default:
          return 'none';
      }
    });
  }, []);

  const clearPlaylist = useCallback(() => {
    setPlaylist([]);
    setCurrentTrack(null);
    setCurrentTrackIndex(-1);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setError(null);
  }, []);

  return {
    // Audio element ref
    audioRef,
    
    // State
    playlist,
    currentTrack,
    currentTrackIndex,
    isPlaying,
    isLoading,
    duration,
    currentTime,
    volume,
    isMuted,
    isShuffled,
    repeatMode,
    error,
    
    // Actions
    addToPlaylist,
    removeFromPlaylist,
    playTrack,
    togglePlayPause,
    handleNext,
    handlePrevious,
    seekTo,
    setVolumeLevel,
    toggleMute,
    toggleShuffle,
    cycleRepeatMode,
    clearPlaylist
  };
};