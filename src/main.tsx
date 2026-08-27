import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Gracefully handle cross-origin third-party script errors (e.g. Disqus / ad-blockers)
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    if (
      event.message === 'Script error.' ||
      (event.filename && (event.filename.includes('disqus') || event.filename.includes('disquscdn')))
    ) {
      // Prevent third-party script network/CORS errors from halting app execution
      event.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

