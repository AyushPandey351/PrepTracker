import React from 'react';
import { Loader2 } from 'lucide-react';

// Loading Spinner Component
function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="loading-container">
      <Loader2 className="loading-spinner" size={40} />
      <p>{message}</p>
    </div>
  );
}

export default LoadingSpinner;
