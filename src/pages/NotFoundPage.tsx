import React from 'react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#060818] px-4 py-6 sm:px-6 md:px-8">
      <div className="text-center">
        <h1 className="text-6xl sm:text-8xl font-bold text-gray-900 dark:text-white mb-4 animate__animated animate__fadeIn">
          404
        </h1>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Page Not Found
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Sorry, the page you are looking for does not exist. Please check the URL or try again later.
        </p>
      </div>
    </div>
  );
};

export default NotFound;