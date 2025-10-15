import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

const PathSelection: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        router.push('/login');
      }
      setIsLoading(false);
    };

    loadUserData();

    // Listen for storage changes (when user data is updated in another tab/window)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user' && e.newValue) {
        setUser(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for focus events to refresh data when returning to the page
    const handleFocus = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [router]);

  const handlePathSelection = (path: string) => {
    if (path === 'health') {
      router.push('/goal-homepage');
    } else if (path === 'intellectual') {
      router.push('/intellectual');
    }
  };

  const handleRefresh = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar showUserControls={true} />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <span className="text-6xl mr-4">{user.avatar || '👋'}</span>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome back, {user.nickname || user.name}!
              </h1>
              <p className="text-xl text-gray-600">
                Choose your student path to continue your learning journey
              </p>
            </div>
          </div>
        </div>

        {/* Path Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Health Path Card */}
          <div className="card hover:shadow-xl transition-all duration-300 cursor-pointer group" onClick={() => handlePathSelection('health')}>
            <div className="text-center p-8">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">💪</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Student Health</h2>
              <p className="text-gray-600 mb-6 text-lg">
                Track your student lifestyle, manage stress, and maintain healthy habits during your studies
              </p>
              
              {/* Health Goal Preview */}
              {user.goal && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-blue-900 mb-2">Your Health Goal:</h3>
                  <p className="text-blue-800 text-sm">
                    {user.goal.goal_description}
                  </p>
                  <div className="mt-2 text-xs text-blue-600">
                    {user.goal.goal_type.replace(/_/g, ' ').toUpperCase()}
                  </div>
                </div>
              )}

              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center justify-center">
                  <span className="mr-2">📊</span> Study-Life Balance Tracking
                </div>
                <div className="flex items-center justify-center">
                  <span className="mr-2">🤖</span> AI Study Insights
                </div>
                <div className="flex items-center justify-center">
                  <span className="mr-2">🎯</span> Student Health Goals
                </div>
              </div>

              <button className="w-full mt-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300">
                Continue Health Journey →
              </button>
            </div>
          </div>

          {/* Intellectual Path Card */}
          <div className="card hover:shadow-xl transition-all duration-300 cursor-pointer group" onClick={() => handlePathSelection('intellectual')}>
            <div className="text-center p-8">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">📚</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Study Path</h2>
              <p className="text-gray-600 mb-6 text-lg">
                Explore educational content, discover new subjects, and expand your academic knowledge
              </p>
              
              {/* Intellectual Interests Preview */}
              {user.intellectual_interests && user.intellectual_interests.length > 0 && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-purple-900 mb-2">Your Interests:</h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    {user.intellectual_interests.slice(0, 3).map((interest: string, index: number) => (
                      <span key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                        {interest}
                      </span>
                    ))}
                    {user.intellectual_interests.length > 3 && (
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                        +{user.intellectual_interests.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center justify-center">
                  <span className="mr-2">📚</span> Study Materials
                </div>
                <div className="flex items-center justify-center">
                  <span className="mr-2">🎯</span> Personalized Learning
                </div>
                <div className="flex items-center justify-center">
                  <span className="mr-2">🔍</span> Discover New Subjects
                </div>
              </div>

              <button className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300">
                Explore Study Path →
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-12">
          <div className="card max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Your Student Profile</h3>
              <button
                onClick={handleRefresh}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                <span className="mr-1">🔄</span> Refresh
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{user.profile?.age || user.age}</div>
                <div className="text-sm text-gray-600">Years Old</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{user.profile?.weight || user.weight}kg</div>
                <div className="text-sm text-gray-600">Weight</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{user.profile?.intellectual_interests?.length || user.intellectual_interests?.length || 0}</div>
                <div className="text-sm text-gray-600">Interests</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{user.profile?.learning_style || user.learning_style}</div>
                <div className="text-sm text-gray-600">Learning Style</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Need to update your profile?</p>
          <button
            onClick={() => router.push('/profile')}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default PathSelection;
