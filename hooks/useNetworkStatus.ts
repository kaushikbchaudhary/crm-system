import React from 'react';

export const useNetworkStatus = () => {
  const [status, setStatus] = React.useState(true);

  React.useEffect(() => {
    function changeStatus() {
      setStatus(navigator.onLine);
    }
    window.addEventListener('online', changeStatus);
    window.addEventListener('offline', changeStatus);
    return () => {
      window.removeEventListener('online', changeStatus);
      window.removeEventListener('offline', changeStatus);
    };
  }, []);

  return status ? 'Online' : 'Offline';
};
