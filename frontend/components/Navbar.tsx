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
              className="text-2xl font-bold text-gradient hover:text-blue-600 transition-colors cursor-pointer hover:scale-105 transform duration-200"
            >
              {title}
            </button>
          </div>
          <div className="flex items-center space-x-4">
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
