import React, { useState, useEffect } from 'react';
import ReelCard from './ReelCard';
import VerticalVideoFeed from './VerticalVideoFeed';
import { fallbackContent, savedContent } from './fallbackData';

const ReelFeed = ({ user, selectedInterests, selectedDuration, onBackToInterests }) => {
  const [activeTab, setActiveTab] = useState('recommended');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'vertical'
  const [likedReels, setLikedReels] = useState(new Set());
  const [savedReels, setSavedReels] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [error, setError] = useState(null);
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  // Fetch YouTube videos when component mounts or interests change
  useEffect(() => {
    if (selectedInterests && selectedInterests.length > 0) {
      fetchYouTubeVideos();
    }
  }, [selectedInterests]);

  const fetchYouTubeVideos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const topics = selectedInterests.join(',');
      const response = await fetch(`https://mind-scroll-production.up.railway.app/api/intellectual/recommendations?topics=${topics}&duration=${selectedDuration}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setYoutubeVideos(result.data);
        setQuotaExceeded(result.quota_exceeded || false);
      } else {
        throw new Error(result.message || 'Failed to fetch videos');
      }
    } catch (err) {
      console.error('Error fetching YouTube videos:', err);
      setError(err.message);
      // Fallback to dummy data
      setYoutubeVideos(fallbackContent.filter(reel => 
        selectedInterests.includes(reel.category)
      ));
    } finally {
      setIsLoading(false);
    }
  };

  // Filter content based on selected interests (fallback to demo data)
  const filteredContent = youtubeVideos.length > 0 ? youtubeVideos : fallbackContent.filter(reel => 
    selectedInterests.includes(reel.category)
  );

  const handleLike = (reelId) => {
    setLikedReels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reelId)) {
        newSet.delete(reelId);
      } else {
        newSet.add(reelId);
      }
      return newSet;
    });
  };

  const handleSave = (reelId) => {
    setSavedReels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reelId)) {
        newSet.delete(reelId);
      } else {
        newSet.add(reelId);
      }
      return newSet;
    });
  };

  const handleDiscoverMore = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const topics = selectedInterests.join(',');
      const response = await fetch(`https://mind-scroll-production.up.railway.app/api/intellectual/recommendations?topics=${topics}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        // Add new videos to existing ones
        setYoutubeVideos(prev => [...prev, ...result.data]);
      } else {
        throw new Error(result.message || 'Failed to fetch more videos');
      }
    } catch (err) {
      console.error('Error fetching more YouTube videos:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'recommended':
        return filteredContent;
      case 'saved':
        return filteredContent.filter(reel => savedReels.has(reel.id || reel.videoId));
      case 'videos':
        return filteredContent.filter(reel => likedReels.has(reel.id || reel.videoId));
      default:
        return filteredContent;
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <span className="text-4xl mr-3">💡</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {user ? `${user.nickname || user.name}'s ` : 'Your '}Study Feed
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                Personalized study content based on your academic interests
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setActiveTab('recommended')}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === 'recommended'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📚 Study Content
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === 'saved'
                  ? 'bg-green-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📖 Saved
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === 'videos'
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🎥 Study Videos
            </button>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📱 Grid View
            </button>
            <button
              onClick={() => setViewMode('vertical')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                viewMode === 'vertical'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📺 Scroll View
            </button>
          </div>
        </div>

        {/* Content Stats - Hidden in vertical view */}
        {viewMode === 'grid' && (
          <div className="text-center mb-8">
            <div className="card max-w-2xl mx-auto">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{filteredContent.length}</div>
                  <div className="text-sm text-gray-600">Recommended</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{savedReels.size}</div>
                  <div className="text-sm text-gray-600">Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{likedReels.size}</div>
                  <div className="text-sm text-gray-600">Liked</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quota Exceeded Message */}
        {quotaExceeded && (
          <div className="mb-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <span className="text-yellow-500 mr-2">⏰</span>
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">Study Video Limit Reached</h3>
                  <p className="text-sm text-yellow-600 mt-1">
                    We've reached our daily limit for educational video requests. Showing demo study content instead.
                  </p>
                  <p className="text-xs text-yellow-500 mt-1">
                    Real study videos will be available tomorrow when the limit resets.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && !quotaExceeded && (
          <div className="mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <span className="text-red-500 mr-2">⚠️</span>
                <div>
                  <h3 className="text-sm font-medium text-red-800">Error loading videos</h3>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                  <p className="text-xs text-red-500 mt-1">Showing dummy data as fallback</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && youtubeVideos.length === 0 && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Fetching YouTube videos...</p>
          </div>
        )}

        {/* Content Display */}
        {viewMode === 'vertical' ? (
          <VerticalVideoFeed
            videos={renderContent()}
            onLike={handleLike}
            onSave={handleSave}
            likedReels={likedReels}
            savedReels={savedReels}
          />
        ) : (
          !isLoading || youtubeVideos.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {renderContent().map((reel) => (
                <ReelCard
                  key={reel.id || reel.videoId}
                  reel={reel}
                  onLike={handleLike}
                  onSave={handleSave}
                  isLiked={likedReels.has(reel.id || reel.videoId)}
                  isSaved={savedReels.has(reel.id || reel.videoId)}
                />
              ))}
            </div>
          ) : null
        )}

        {/* Empty State */}
        {renderContent().length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">
              {activeTab === 'recommended' ? '📚' : activeTab === 'saved' ? '🔖' : '📺'}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {activeTab === 'recommended' ? 'No content yet' : 
               activeTab === 'saved' ? 'No saved videos' : 'No liked videos'}
            </h3>
            <p className="text-gray-600 mb-6">
              {activeTab === 'recommended' 
                ? 'Try selecting different interests to see more content'
                : activeTab === 'saved'
                ? 'Start saving videos you want to watch later'
                : 'Start liking videos to build your collection'
              }
            </p>
          </div>
        )}

        {/* Action Buttons - Hidden in vertical view */}
        {viewMode === 'grid' && (
          <div className="flex justify-center space-x-4">
            <button
              onClick={onBackToInterests}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              ← Change Interests
            </button>
            
            {activeTab === 'recommended' && (
              <button
                onClick={handleDiscoverMore}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Discovering...
                  </div>
                ) : (
                  'Discover More →'
                )}
              </button>
            )}
          </div>
        )}

        {/* Interest Tags - Hidden in vertical view */}
        {viewMode === 'grid' && (
          <div className="mt-8 text-center">
            <div className="card max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Interests</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {selectedInterests.map((interest) => (
                  <span
                    key={interest}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReelFeed;
