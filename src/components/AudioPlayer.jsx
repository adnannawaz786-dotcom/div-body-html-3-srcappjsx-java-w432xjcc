import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { formatTime } from '../utils/audioUtils';

const AudioPlayer = ({ playlist, currentTrackIndex, onTrackChange }) => {
  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    isShuffled,
    isRepeated,
    togglePlay,
    seek,
    setVolume,
    toggleShuffle,
    toggleRepeat
  } = useAudioPlayer();

  const currentTrack = playlist[currentTrackIndex];

  const handlePrevious = () => {
    const newIndex = currentTrackIndex > 0 ? currentTrackIndex - 1 : playlist.length - 1;
    onTrackChange(newIndex);
  };

  const handleNext = () => {
    const newIndex = currentTrackIndex < playlist.length - 1 ? currentTrackIndex + 1 : 0;
    onTrackChange(newIndex);
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    seek(percent * duration);
  };

  const handleVolumeChange = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    setVolume(Math.max(0, Math.min(1, percent)));
  };

  if (!currentTrack) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-t border-white/10 p-4">
        <div className="max-w-4xl mx-auto text-center text-gray-400">
          No track selected
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-900/90 to-pink-900/90 backdrop-blur-lg border-t border-white/10"
    >
      <div className="max-w-4xl mx-auto p-4">
        {/* Progress Bar */}
        <div className="mb-4">
          <div 
            className="w-full h-1 bg-white/20 rounded-full cursor-pointer group"
            onClick={handleSeek}
          >
            <div 
              className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full relative transition-all group-hover:h-1.5"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-300 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {/* Track Info */}
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
              <Volume2 className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-white font-medium truncate">{currentTrack.name}</h3>
              <p className="text-gray-300 text-sm truncate">
                {currentTrack.artist || 'Unknown Artist'}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4 mx-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleShuffle}
              className={`p-2 rounded-full transition-colors ${
                isShuffled ? 'text-purple-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Shuffle className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrevious}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <SkipBack className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePlay}
              className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-0.5" />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNext}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <SkipForward className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleRepeat}
              className={`p-2 rounded-full transition-colors ${
                isRepeated ? 'text-purple-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Repeat className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-2 flex-1 justify-end">
            <Volume2 className="w-4 h-4 text-gray-400" />
            <div 
              className="w-20 h-1 bg-white/20 rounded-full cursor-pointer group"
              onClick={handleVolumeChange}
            >
              <div 
                className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full relative transition-all group-hover:h-1.5"
                style={{ width: `${volume * 100}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AudioPlayer;