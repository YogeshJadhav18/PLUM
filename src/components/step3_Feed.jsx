import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import ArticleModal from './ArticleModal';
import { useFetchArticles, useSummaries } from '../hooks/userArticles';

export default function Screen3Feed() {
  const { data: articles } = useFetchArticles();
  const { getSummaryFromCache, generate } = useSummaries();
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [pending, setPending] = useState({});
  const containerRef = useRef(null);
  const startYRef = useRef(0);
  const refreshingRef = useRef(false);
  const pageSize = 4;

  const paged = useMemo(() => {
    if (!articles) return [];
    return articles.slice(page * pageSize, (page + 1) * pageSize);
  }, [articles, page]);

  const totalPages = useMemo(() => {
    if (!articles) return 0;
    return Math.ceil(articles.length / pageSize);
  }, [articles]);

  const isRefreshing = Object.keys(pending).length > 0;

  const handleRefresh = useCallback(() => {
    if (refreshingRef.current || !articles) return;
    refreshingRef.current = true;
    const pageItems = articles.slice(page * pageSize, (page + 1) * pageSize);

    const newPending = {};
    pageItems.forEach(a => newPending[a.id] = true);
    setPending(newPending);

    Promise.all(
      pageItems.map(a => generate.mutateAsync(a).catch(() => {}))
    ).finally(() => {
      setPending({});
      refreshingRef.current = false;
    });
  }, [articles, page, generate]);

  const handleGenerateSummary = useCallback((a) => {
    setPending(p => ({ ...p, [a.id]: true }));
    generate.mutateAsync(a).finally(() => {
      setPending(p => {
        const _ = { ...p };
        delete _[a.id];
        return _;
      });
    });
  }, [generate]);

  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;

    let localPull = 0;

    const start = e => {
      if (c.scrollTop === 0) startYRef.current = e.touches[0].clientY;
    };

    const move = e => {
      if (c.scrollTop === 0 && startYRef.current > 0) {
        const dist = e.touches[0].clientY - startYRef.current;
        if (dist > 0) {
          localPull = Math.min(dist, 100);
          setPullDistance(localPull);
        }
      }
    };

    const end = () => {
      const refresh = localPull > 50;
      setPullDistance(0);
      startYRef.current = 0;
      localPull = 0;
      if (refresh) handleRefresh();
    };

    c.addEventListener('touchstart', start, { passive: true });
    c.addEventListener('touchmove', move, { passive: true });
    c.addEventListener('touchend', end, { passive: true });

    return () => {
      c.removeEventListener('touchstart', start);
      c.removeEventListener('touchmove', move);
      c.removeEventListener('touchend', end);
    };
  }, [handleRefresh]);

  if (!articles) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-500 to-blue-600 px-4 py-5 flex items-center justify-center">
        <div className="flex flex-col items-center text-white">
          <div className="w-10 h-10 border-4 border-white/40 border-t-white animate-spin rounded-full" />
          <p className="text-base mt-4">Loading articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-teal-500 to-blue-600 px-4 py-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="relative bg-white rounded-2xl shadow-xl flex overflow-hidden mb-8">
          <div className="w-3 bg-teal-600"></div>
          <div className="flex-1 px-8 py-10 text-center">
            <span className="px-4 py-1.5 text-xs bg-teal-100 text-teal-700 rounded-full font-bold shadow-sm mb-4 inline-block">
              Step 3 / 3
            </span>
            <h1 className="text-3xl font-extrabold text-gray-900">🏥 Daily Digest</h1>
            <p className="text-sm text-amber-800 mt-2">Your personalized health insight panel</p>
          </div>
        </div>

        {pullDistance > 0 && (
          <div
            style={{ transform: `translateY(${Math.min(pullDistance, 80)}px)` }}
            className="text-center text-white text-sm font-semibold py-1"
          >
            {pullDistance > 50 ? 'Release to Refresh' : 'Pull to Refresh'}
          </div>
        )}

        {/* REFRESH BUTTON */}
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={`w-full mb-8 px-8 py-3 rounded-xl text-white font-bold shadow-lg transition-all
            ${isRefreshing
              ? "bg-gray-400 opacity-75 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:scale-[0.97]"
            }`}>
          {isRefreshing ? "Refreshing..." : "🔄 Refresh Summaries"}
        </button>

        {/* ARTICLE CARDS */}
        <div className="flex flex-col gap-6 mb-10">
          {paged.map(article => {
            const summary = getSummaryFromCache(article.id);
            const waiting = !!pending[article.id];

            return (
              <div key={article.id} className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all flex overflow-hidden">
                <div className="w-2 bg-teal-600"></div>

                <div className="flex-1 p-6">
                  <h3 className="text-xl font-semibold text-amber-900 mb-2">{article.title}</h3>
                  <div className="text-xs text-gray-500 flex gap-3 mb-4">
                    <span className="text-amber-700">{article.publishedAt}</span>
                    <span className="text-teal-600 font-medium">{article.source}</span>
                  </div>

                  {!summary && (
                    <div className="text-sm text-gray-400 items-center justify-center text-center bg-gray-50 py-3 rounded-lg mb-4">
                      No summary yet
                    </div>
                  )}

                  {summary && (
                    <div className="bg-gray-50 border-l-4 border-teal-600 text-sm text-gray-700 px-4 py-3 rounded-lg mb-4">
                      {summary}
                    </div>
                  )}

                  <button
                    onClick={() => handleGenerateSummary(article)}
                    disabled={waiting}
                    className={`px-4 py-2 rounded-lg shadow-md font-medium text-sm transition-all
                      ${waiting
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white active:scale-[0.97]"
                      }`}>
                    {waiting ? "Generating..." : summary ? "Refresh Summary" : "✨ Generate Summary"}
                  </button>

                  <button
                    onClick={() => setSelected(article)}
                    className="w-full mt-3 py-2.5 rounded-lg bg-teal-600 text-white font-semibold shadow-md active:scale-[0.97] transition-all hover:bg-teal-700">
                    Read Full Article →
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* PAGINATION */}
        <div className="bg-white shadow-md rounded-2xl p-4 flex justify-between items-center">
          <button onClick={() => setPage(p => p - 1)} disabled={page === 0}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all
            ${page === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.97]"
            }`}>
            ← Previous
          </button>

          <span className="text-gray-700 font-medium text-sm">
            Page {page + 1} of {totalPages}
          </span>

          <button
            disabled={(page + 1) * pageSize >= articles.length}
            onClick={() => setPage(p => p + 1)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all
            ${(page + 1) * pageSize >= articles.length
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.97]"
            }`}>
            Next →
          </button>
        </div>
      </div>

      {selected && (
        <ArticleModal article={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
