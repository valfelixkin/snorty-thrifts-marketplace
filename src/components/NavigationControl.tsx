
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function NavigationControl() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // ESC key triggers "go back"
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // Don't go back if we're on the home page
        if (location.pathname !== '/') {
          navigate(-1); // go back one page
        }
      }
    };

    // Handle browser back navigation
    const handlePopState = () => {
      // This ensures proper handling of browser back button
      console.log('Navigation event detected');
    };

    window.addEventListener('keydown', handleEsc);
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location, navigate]);

  return null;
}
