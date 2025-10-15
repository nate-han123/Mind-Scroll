import React, { useState } from 'react';

const ReelCard = ({ reel, onLike, onSave, isLiked = false, isSaved = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePlay = () => {
    if (!isPlaying) {
      setIsLoading(true);
      // Small delay to show loading state
      setTimeout(() => {
        setIsLoading(false);
        setIsPlaying(true);
      }, 300);
    } else {
      setIsPlaying(false);
    }
  };

  const handleLike = () => {
    onLike(reel.id || reel.videoId);
  };

  const handleSave = () => {
    onSave(reel.id || reel.videoId);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Video Thumbnail/Player */}
      <div className="relative aspect-video bg-gray-200">
        {isLoading ? (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-sm">Loading video...</p>
            </div>
          </div>
        ) : isPlaying && reel.videoId ? (
          <div className="relative w-full h-full">
            <iframe
              src={`https://www.youtube.com/embed/${reel.videoId}?autoplay=1&rel=0&modestbranding=1`}
              title={reel.title}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <button
              onClick={handlePlay}
              className="absolute top-2 right-2 bg-black bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-90 transition-all"
              title="Close video"
            >
              ✕
            </button>
          </div>
        ) : reel.thumbnail ? (
          <div className="relative w-full h-full">
            <img 
              src={reel.thumbnail} 
              alt={reel.title}
              className="w-full h-full object-cover"
            />
            <div 
              className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center cursor-pointer hover:bg-opacity-40 transition-all"
              onClick={handlePlay}
            >
              <div className="text-white text-center">
                <div className="text-6xl mb-2">▶️</div>
                <p className="text-sm font-medium">Play Video</p>
              </div>
            </div>
          </div>
        ) : (
          <div 
            className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center cursor-pointer"
            onClick={handlePlay}
          >
            <div className="text-white text-center">
              <div className="text-6xl mb-4">▶️</div>
              <p className="text-lg font-semibold">{reel.title}</p>
              <p className="text-sm opacity-90">{reel.duration || 'Short Video'}</p>
            </div>
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            {reel.category}
          </span>
        </div>
        
        {/* Duration Badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
            {reel.duration}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {reel.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {reel.description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            {reel.views && (
              <span className="flex items-center">
                <span className="mr-1">👁️</span>
                {reel.views}
              </span>
            )}
            {reel.likes && (
              <span className="flex items-center">
                <span className="mr-1">❤️</span>
                {reel.likes}
              </span>
            )}
            {reel.channelTitle && (
              <span className="flex items-center">
                <span className="mr-1">📺</span>
                {reel.channelTitle}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleLike}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isLiked 
                  ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className="mr-1">{isLiked ? '❤️' : '🤍'}</span>
              {isLiked ? 'Liked' : 'Like'}
            </button>
            
            <button
              onClick={handleSave}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isSaved 
                  ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className="mr-1">{isSaved ? '🔖' : '📌'}</span>
              {isSaved ? 'Saved' : 'Save'}
            </button>
          </div>
          
          <button
            onClick={handlePlay}
            disabled={isLoading}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : (isPlaying ? 'Pause' : 'Play Video')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReelCard;
