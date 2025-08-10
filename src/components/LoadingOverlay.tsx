
import React from 'react';
import OrbitalLoader from './OrbitalLoader';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isVisible, 
  message = "Loading..." 
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-purple-900 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-6">
        <OrbitalLoader size={300} />
        <p className="text-white text-lg font-orbitron tracking-wider animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
