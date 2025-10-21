import React, { useState, useEffect } from 'react';
import InterestSelector from './InterestSelector';
import ReelFeed from './ReelFeed';
import DurationSelector from './DurationSelector';

const IntellectualPath = ({ user }) => {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [hasSelectedInterests, setHasSelectedInterests] = useState(false);
  const [showDurationSelector, setShowDurationSelector] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState('short');

  useEffect(() => {
    // Use user's intellectual interests from their profile
    if (user && user.intellectual_interests && user.intellectual_interests.length > 0) {
      setSelectedInterests(user.intellectual_interests);
      setHasSelectedInterests(true);
    } else {
      // Check if user has previously selected interests
      const savedInterests = localStorage.getItem('intellectualInterests');
      if (savedInterests) {
        setSelectedInterests(JSON.parse(savedInterests));
        setHasSelectedInterests(true);
      }
    }
  }, [user]);

  const handleInterestsSelected = (interests) => {
    setSelectedInterests(interests);
    setShowDurationSelector(true);
    localStorage.setItem('intellectualInterests', JSON.stringify(interests));
  };

  const handleDurationSelected = (duration) => {
    setSelectedDuration(duration);
    setShowDurationSelector(false);
    setHasSelectedInterests(true);
    localStorage.setItem('selectedDuration', duration);
  };

  const handleDurationCancel = () => {
    setShowDurationSelector(false);
  };

  const handleBackToInterests = () => {
    setHasSelectedInterests(false);
  };

  const handleResetInterests = () => {
    setSelectedInterests([]);
    setHasSelectedInterests(false);
    localStorage.removeItem('intellectualInterests');
  };

  return (
    <div className="min-h-screen">
      {!hasSelectedInterests ? (
        <InterestSelector 
          user={user}
          onInterestsSelected={handleInterestsSelected} 
        />
      ) : (
        <ReelFeed 
          user={user}
          selectedInterests={selectedInterests}
          selectedDuration={selectedDuration}
          onBackToInterests={handleBackToInterests}
          onResetInterests={handleResetInterests}
        />
      )}
      
      {showDurationSelector && (
        <DurationSelector
          onDurationSelected={handleDurationSelected}
          onCancel={handleDurationCancel}
        />
      )}
    </div>
  );
};

export default IntellectualPath;
