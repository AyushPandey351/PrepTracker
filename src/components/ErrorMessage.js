import React from 'react';
import { RefreshCw, WifiOff } from 'lucide-react';

// Error Component
function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-container">
      <WifiOff size={40} />
      <h3>Connection Error</h3>
      <p>{message}</p>
      {onRetry && (
        <button className="btn btn-primary" onClick={onRetry}>
          <RefreshCw size={16} style={{ marginRight: 8 }} />
          Retry
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
