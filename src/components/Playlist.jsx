import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Music, Trash2, Clock, FileAudio } from 'lucide-react';

const Playlist = ({ 
  tracks, 
  currentTrack, 
  isPlaying, 
  onTrackSelect, 
  onTrackDelete,
  className = '' 
}) => {
  const formatDuration = (duration) => {
    if (!duration || isNaN(duration)) return '--:--';
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '--';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  if (!tracks || tracks.length === 0) {
    return (
      <div className={`bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 ${className}`}>
        <div className="text-center text-white/70">
          <FileAudio className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No tracks in playlist</h3>
          <p className="text-sm">Upload some audio files to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden ${className}`}>
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Music className="w-6 h-6 text-purple-300" />
          <h2 className="text-xl font-bold text-white">Playlist</h2>
          <span className="text-sm text-white/60 bg-white/10 px-2 py-1 rounded-full">
            {tracks.length} tracks
          </span>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20">
        <AnimatePresence>
          {tracks.map((track, index) => {
            const isCurrentTrack = currentTrack && currentTrack.id === track.id;
            
            return (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`
                  flex items-center gap-4 p-4 border-b border-white/5 hover:bg-white/5 
                  transition-all duration-200 cursor-pointer group
                  ${isCurrentTrack ? 'bg-purple-500/20 border-purple-400/30' : ''}
                `}
                onClick={() => onTrackSelect(track)}
              >
                {/* Play/Pause Button */}
                <div className="flex-shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      transition-all duration-200
                      ${isCurrentTrack 
                        ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30' 
                        : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                      }
                    `}
                  >
                    {isCurrentTrack && isPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4 ml-0.5" />
                    )}
                  </motion.button>
                </div>

                {/* Track Info */}
                <div className="flex-grow min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-grow">
                      <h3 className={`
                        font-semibold truncate text-sm
                        ${isCurrentTrack ? 'text-purple-200' : 'text-white'}
                      `}>
                        {track.name || track.file?.name || 'Unknown Track'}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-white/60">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDuration(track.duration)}
                        </span>
                        {track.file?.size && (
                          <span>{formatFileSize(track.file.size)}</span>
                        )}
                      </div>
                    </div>

                    {/* Delete Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTrackDelete(track.id);
                      }}
                      className="
                        opacity-0 group-hover:opacity-100 transition-opacity duration-200
                        w-8 h-8 rounded-full flex items-center justify-center
                        hover:bg-red-500/20 hover:text-red-400 text-white/50
                      "
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Current Track Indicator */}
                {isCurrentTrack && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex-shrink-0"
                  >
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{
                            height: isPlaying ? [4, 12, 4] : 4,
                          }}
                          transition={{
                            duration: 0.8,
                            repeat: isPlaying ? Infinity : 0,
                            delay: i * 0.1,
                          }}
                          className="w-1 bg-purple-400 rounded-full"
                          style={{ height: 4 }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Playlist Stats */}
      <div className="p-4 bg-black/20 border-t border-white/10">
        <div className="flex justify-between items-center text-xs text-white/60">
          <span>
            Total: {tracks.length} track{tracks.length !== 1 ? 's' : ''}
          </span>
          <span>
            Duration: {formatDuration(
              tracks.reduce((total, track) => total + (track.duration || 0), 0)
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Playlist;