import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetchArticles, useSummaries } from '../hooks/userArticles';

export default function Screen2Summaries() {
  const navigate = useNavigate();
  const { data: articles } = useFetchArticles();
  const { generate, getSummaryFromCache } = useSummaries();
  const [pending, setPending] = useState({});
  const processedRef = useRef(new Set());

  useEffect(() => {
    if (articles) {
      const toGenerate = articles.slice(0, 3).filter(article => {
        const cached = getSummaryFromCache(article.id);
        const alreadyProcessed = processedRef.current.has(article.id);
        return !cached && !alreadyProcessed && !pending[article.id];
      });
      
      if (toGenerate.length > 0) {
        toGenerate.forEach(article => {
          processedRef.current.add(article.id);
        });
        
        setPending(prev => ({
          ...prev,
          ...Object.fromEntries(toGenerate.map(a => [a.id, true]))
        }));
        
        toGenerate.forEach(article => {
          generate.mutateAsync(article).finally(() => {
            setPending(prev => {
              const updated = { ...prev };
              delete updated[article.id];
              return updated;
            });
          });
        });
      }
    }
  }, [articles, generate, getSummaryFromCache]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 to-blue-600 px-4 py-6">
      <div className="max-w-4xl mx-auto">

        {/* HEADER CARD */}
        <div className="relative bg-white rounded-2xl shadow-xl flex overflow-hidden mb-6 sm:mb-10">
          <div className="w-3 sm:w-4 bg-teal-600"></div>

          <div className="flex-1 text-center px-6 py-6 sm:px-10 sm:py-10">
            <span className="px-4 py-1.5 text-xs font-bold bg-teal-100 text-teal-700 rounded-full shadow-sm mb-3 inline-block">
              Step 2 / 3
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
               AI Summaries
            </h1>
            <p className="text-sm text-amber-800 mt-2">


              Generating quick essential summaries...
            </p>
          </div>
        </div>

        {/* FEED BUTTON */}
        <button
          onClick={() => navigate('/feed')}
          className="block mx-auto mb-8 px-10 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.97] text-white text-sm font-bold shadow-lg transition-all"
        >
          Go to News Stream →
        </button>

        {/* ARTICLE CARDS */}
        <div className="flex flex-col gap-5">
          {articles?.map(article => {
            const cached = getSummaryFromCache(article.id);
            const loading = !!pending[article.id];

            return (
              <div key={article.id} className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all flex overflow-hidden">
                {/* LEFT ACCENT STRIP */}
                <div className="w-2 sm:w-3 bg-teal-600"></div>

                {/* CONTENT */}
                <div className="flex-1 p-5 sm:p-7">
                  <h3 className="text-lg sm:text-xl font-semibold text-amber-900 leading-snug mb-2">
                    {article.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-500 mb-4">
                    <span className="font-medium text-teal-600">
                      {article.source}
                    </span>
                    <span className="text-gray-400">
                      {article.publishedAt}
                    </span>
                  </div>

                  {/* Loading Summary */}
                  {loading && (
                    <div className="flex items-center gap-3 bg-blue-50 text-blue-600 px-4 py-3 rounded-lg text-sm mb-4">
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-teal-500 rounded-full animate-spin" />
                      ⏳ Creating summary...
                    </div>
                  )}

                  {/* Show Cached Summary */}
                  {cached && !loading && (
                    <div className="bg-gray-50 border-l-4 border-teal-500 text-gray-700 px-4 py-3 rounded-lg text-sm whitespace-pre-wrap mb-4">
                      {cached}
                    </div>
                  )}

                  {/* Generate / Regenerate Button */}
                  <button
                    onClick={() => {
                      setPending(prev => ({ ...prev, [article.id]: true }));
                      generate.mutateAsync(article).finally(() => {
                        setPending(prev => {
                          const updated = { ...prev };
                          delete updated[article.id];
                          return updated;
                        });
                      });
                    }}
                    disabled={loading}
                    className={`px-4 py-2 rounded-lg text-sm font-medium shadow-md transition-all ${
                      loading
                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed shadow-none'
                        : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-[0.97]'
                    }`}
                  >
                    {cached ? '🔄 Refresh ' : ' Generate Overall Summary'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
