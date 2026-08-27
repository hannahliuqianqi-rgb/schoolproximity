import React, { useEffect, useState } from 'react';

interface DisqusCommentsProps {
  url?: string;
  identifier: string;
  title: string;
  description?: string;
}

declare global {
  interface Window {
    DISQUS?: {
      reset: (options: {
        reload: boolean;
        config?: () => void;
      }) => void;
    };
    disqus_config?: () => void;
  }
}

export const DisqusComments: React.FC<DisqusCommentsProps> = ({
  url,
  identifier,
  title,
  description,
}) => {
  const [loadError, setLoadError] = useState<boolean>(false);

  useEffect(() => {
    try {
      const canonicalUrl = url || (typeof window !== 'undefined' ? window.location.href.split('#')[0] : '');
      const cleanIdentifier = (identifier || 'schoolproximity-general').replace(/[^a-zA-Z0-9-_]/g, '-');

      // Set up disqus_config callback
      const setupConfig = function (this: { page: { identifier: string; url: string; title: string } }) {
        this.page.identifier = cleanIdentifier;
        this.page.url = canonicalUrl;
        this.page.title = title;
      };

      window.disqus_config = setupConfig as unknown as () => void;

      // If DISQUS is already initialized on the page, safely reset it with new thread params
      if (typeof window !== 'undefined' && window.DISQUS && typeof window.DISQUS.reset === 'function') {
        try {
          const container = document.getElementById('disqus_thread');
          if (container) {
            window.DISQUS.reset({
              reload: true,
              config: function () {
                this.page.identifier = cleanIdentifier;
                this.page.url = canonicalUrl;
                this.page.title = title;
              },
            });
          }
        } catch (resetErr) {
          console.warn('Disqus reset non-critical notice:', resetErr);
        }
        return;
      }

      // Inject embed.js script safely if not already present
      const existingScript = document.getElementById('disqus-embed-script');
      if (!existingScript) {
        const d = document;
        const s = d.createElement('script');
        s.id = 'disqus-embed-script';
        s.src = 'https://hannah-18.disqus.com/embed.js';
        s.setAttribute('data-timestamp', String(+new Date()));
        s.async = true;
        s.crossOrigin = 'anonymous';
        s.onerror = () => {
          console.warn('Disqus embed script could not be loaded directly (possibly blocked by ad-blocker or sandbox).');
          setLoadError(true);
        };
        (d.head || d.body).appendChild(s);
      }
    } catch (err) {
      console.warn('Disqus initialization error:', err);
    }
  }, [url, identifier, title]);

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 shadow-xs p-5 md:p-6 mt-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <span className="material-symbols-outlined text-[18px]">forum</span>
          </div>
          <div>
            <h3 className="text-sm md:text-base font-bold text-slate-900">
              Community & Parent Discussions
            </h3>
            <p className="text-xs text-slate-500">
              {description || (
                <>Share balloting experiences, HDB feedback, and proximity advice for <span className="font-semibold text-slate-700">{title}</span></>
              )}
            </p>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Live Forum
        </span>
      </div>

      <div id="disqus_thread" className="min-h-[160px]"></div>
      
      {loadError && (
        <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200 mt-2">
          Note: If the discussion box is blocked by your browser or extensions, visit{' '}
          <a
            href="https://hannah-18.disqus.com"
            target="_blank"
            rel="noreferrer"
            className="text-indigo-600 font-medium underline"
          >
            hannah-18.disqus.com
          </a>{' '}
          to participate directly.
        </div>
      )}

      <noscript>
        Please enable JavaScript to view the{' '}
        <a href="https://disqus.com/?ref_noscript" rel="noreferrer" target="_blank" className="text-indigo-600 underline">
          comments powered by Disqus.
        </a>
      </noscript>
    </div>
  );
};
