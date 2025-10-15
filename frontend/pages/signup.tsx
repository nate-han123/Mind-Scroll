import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

const Signup: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to essential signup
    router.push('/essential-signup');
  }, [router]);

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to signup form...</p>
      </div>
    </div>
  );
};

export default Signup;