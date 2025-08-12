import React from 'react';
import { motion } from 'framer-motion';
import AudioPlayer from './components/AudioPlayer';
import Playlist from './components/Playlist';
import FileUpload from './components/FileUpload';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import './styles/globals.css';

function App() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    playlist,
    playTrack,
    togglePlay,
    skipToNext,
    skipToPrevious,
    seekTo,
    setVolume,
    addToPlaylist,
    removeFromPlaylist,
    clearPlaylist
  } = useAudioPlayer();

  const handleFileUpload = (files) => {
    Array.from(files).forEach(file => {
      if (file.type.startsWith('audio/')) {
        const audioUrl = URL.createObjectURL(file);
        const track = {
          id: Date.now() + Math.random(),
          title: file.name.replace(/\.[^/.]+$/, ""),
          artist: 'Unknown Artist',
          duration: 0,
          url: audioUrl,
          file: file
        };
        addToPlaylist(track);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Audio Player
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Upload your favorite MP3 files and enjoy a premium listening experience with our modern audio player
          </p>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* File Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="glass-card rounded-2xl p-6 backdrop-blur-lg bg-white/10 border border-white/20">
              <h2 className="text-2xl font-semibold mb-6 text-center">Upload Music</h2>
              <FileUpload onFileUpload={handleFileUpload} />
              
              {playlist.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearPlaylist}
                  className="w-full mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-lg transition-all duration-200 text-red-300 hover:text-red-200"
                >
                  Clear Playlist
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Playlist Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="glass-card rounded-2xl p-6 backdrop-blur-lg bg-white/10 border border-white/20 h-full">
              <h2 className="text-2xl font-semibold mb-6">Playlist</h2>
              <Playlist
                tracks={playlist}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                onTrackSelect={playTrack}
                onTrackRemove={removeFromPlaylist}
              />
            </div>
          </motion.div>
        </div>

        {/* Audio Player Section */}
        {currentTrack && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8"
          >
            <div className="glass-card rounded-2xl p-6 backdrop-blur-lg bg-white/10 border border-white/20">
              <AudioPlayer
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                currentTime={currentTime}
                duration={duration}
                volume={volume}
                onPlayPause={togglePlay}
                onNext={skipToNext}
                onPrevious={skipToPrevious}
                onSeek={seekTo}
                onVolumeChange={setVolume}
              />
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {playlist.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-16"
          >
            <div className="glass-card rounded-2xl p-12 backdrop-blur-lg bg-white/5 border border-white/10 max-w-md mx-auto">
              <div className="text-6xl mb-4">🎵</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-300">No Music Yet</h3>
              <p className="text-gray-400">Upload your first MP3 file to get started!</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
    </div>
  );
}

export default App;