import React, { useState, useEffect } from 'react';

const VerticalVideoFeed = ({ videos, onLike, onSave, likedReels, savedReels }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-play current video when index changes
  useEffect(() => {
    if (videos.length > 0 && currentIndex < videos.length) {
      const currentVideo = videos[currentIndex];
      if (currentVideo && isPlaying) {
        setIsLoading(true);
        // Simulate loading time for smooth transition
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }
    }
  }, [currentIndex, videos, isPlaying]);

  // Handle navigation
  const handleNext = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (videos.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold mb-2">No videos available</h3>
          <p className="text-gray-400">Try selecting different interests</p>
        </div>
      </div>
    );
  }

  const currentVideo = videos[currentIndex];

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      {/* Video Player */}
      <div className="relative w-full h-full">
        {isLoading ? (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-sm">Loading video...</p>
            </div>
          </div>
        ) : currentVideo.videoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${currentVideo.videoId}?autoplay=${isPlaying ? 1 : 0}&rel=0&modestbranding=1&controls=1&showinfo=0`}
            title={currentVideo.title}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="text-6xl mb-4">▶️</div>
              <p className="text-lg font-semibold">{currentVideo.title}</p>
            </div>
          </div>
        )}
      </div>

      {/* Video Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-6">
        <div className="max-w-md">
          <h3 className="text-white text-lg font-semibold mb-2 line-clamp-2">
            {currentVideo.title}
          </h3>
          <p className="text-gray-300 text-sm mb-3 line-clamp-2">
            {currentVideo.description}
          </p>
          <div className="flex items-center text-sm text-gray-400 mb-4">
            <span className="mr-4">📺 {currentVideo.channelTitle || 'Unknown Channel'}</span>
            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
              {currentVideo.category}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute right-4 bottom-20 flex flex-col space-y-4">
        {/* Like Button */}
        <button
          onClick={() => onLike(currentVideo.id || currentVideo.videoId)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            likedReels.has(currentVideo.id || currentVideo.videoId)
              ? 'bg-red-500 text-white'
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
        >
          <span className="text-xl">
            {likedReels.has(currentVideo.id || currentVideo.videoId) ? '❤️' : '🤍'}
          </span>
        </button>

        {/* Save Button */}
        <button
          onClick={() => onSave(currentVideo.id || currentVideo.videoId)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            savedReels.has(currentVideo.id || currentVideo.videoId)
              ? 'bg-blue-500 text-white'
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
        >
          <span className="text-xl">
            {savedReels.has(currentVideo.id || currentVideo.videoId) ? '🔖' : '📌'}
          </span>
        </button>

        {/* Play/Pause Button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-12 h-12 rounded-full bg-white/20 text-white hover:bg-white/30 flex items-center justify-center transition-all"
        >
          <span className="text-xl">
            {isPlaying ? '⏸️' : '▶️'}
          </span>
        </button>
      </div>

      {/* Progress Indicator */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-1">
          {videos.map((_, index) => (
            <div
              key={index}
              className={`h-1 w-8 rounded-full transition-all ${
                index === currentIndex ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="w-12 h-12 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ↑
        </button>
      </div>

      <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
        <button
          onClick={handleNext}
          disabled={currentIndex === videos.length - 1}
          className="w-12 h-12 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ↓
        </button>
      </div>

      {/* Video Counter */}
      <div className="absolute top-4 right-4 text-white/70 text-sm">
        {currentIndex + 1} / {videos.length}
      </div>
    </div>
  );
};

export default VerticalVideoFeed;
