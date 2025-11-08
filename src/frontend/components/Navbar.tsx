import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface NavbarProps {
  title?: string;
  showUserControls?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ 
  title = "Mindscroll", 
  showUserControls = false 
}) => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    try {
      // Clear all user data
      localStorage.removeItem('user');
      localStorage.removeItem('userFoodData');
      localStorage.removeItem('userExerciseData');
      localStorage.removeItem('userLifestyleData');
      
      // Clear user state
      setUser(null);
      
      // Navigate to home page
      router.push('/').then(() => {
        // Force a page reload to ensure clean state
        window.location.reload();
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: just reload the page
      window.location.href = '/';
    }
  };

  const handleProfileEdit = () => {
    router.push('/profile');
  };

  const handleHomeClick = () => {
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={handleHomeClick}
              className="flex items-center space-x-3 hover:scale-105 transform duration-200 transition-all"
            >
              <img 
                src="/data/Logo.jpg" 
                alt="Mindscroll Logo" 
                className="h-8 sm:h-10 w-auto"
              />
              <span className="text-xl sm:text-2xl font-bold text-gradient hover:text-blue-600 transition-colors cursor-pointer">
                {title}
              </span>
            </button>
          </div>

          {/* Desktop controls */}
          <div className="hidden sm:flex items-center space-x-4">
            {showUserControls && user && (
              <>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{user.avatar || '💪'}</span>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {user.nickname || user.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user.nickname ? user.name : 'Health Warrior'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleProfileEdit}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                >
                  Logout
                </button>
              </>
            )}
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">AI Active</span>
          </div>

          {/* Mobile menu toggle */}
          <div className="sm:hidden flex items-center">
            <button
              aria-label="Toggle menu"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu content */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-3 space-y-2">
            {showUserControls && user ? (
              <>
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{user.avatar || '💪'}</span>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.nickname || user.name}</div>
                    <div className="text-xs text-gray-500">{user.nickname ? user.name : 'Health Warrior'}</div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button onClick={handleProfileEdit} className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm">Edit Profile</button>
                  <button onClick={handleLogout} className="flex-1 bg-red-500 text-white px-3 py-2 rounded-lg text-sm">Logout</button>
                </div>
              </>
            ) : (
              <div className="text-sm text-gray-600">Not signed in</div>
            )}

            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">AI Active</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
