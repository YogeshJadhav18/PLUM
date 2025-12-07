import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRewrite, useSummaries } from '../hooks/userArticles';

export default function ArticleModal({ article, onClose }) {
  const queryClient = useQueryClient();
  const { getSummaryFromCache, generate } = useSummaries();
  const rewrite = useRewrite();
  const summary = getSummaryFromCache(article.id);
  const rewritten = queryClient.getQueryData(['rewrite', article.id]) || null;

  const isGenerating = generate.isPending;
  const isRewriting = rewrite.isPending;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto"
      >
        {/* LEFT ACCENT STRIP */}
        <div className="absolute left-0 w-2 sm:w-3 bg-teal-600 h-full rounded-l-3xl"></div>

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center text-lg font-bold shadow-md hover:bg-red-600 active:scale-95 transition"
        >
          ✕
        </button>

        {/* HEADER */}
        <div className="px-8 pt-8 pb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">
            {article.title}
          </h2>
          <p className="text-sm text-amber-800 font-medium mt-2">
            {article.source} • {article.publishedAt}
          </p>
        </div>

        <div className="px-8 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            📋 Summary & Takeaways
          </h3>

          {isGenerating ? (
            <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-3 rounded-lg text-sm mb-4">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-teal-600 rounded-full animate-spin" />
              Generating summary...
            </div>
          ) : summary ? (
            <div className="bg-gray-50 border-l-4 border-teal-600 text-gray-800 text-sm leading-relaxed whitespace-pre-wrap px-4 py-3 rounded-lg mb-4">
              {summary}
            </div>
          ) : (
            <p className="text-sm italic text-gray-400 mb-4">
              No summary generated yet
            </p>
          )}

          <button
            onClick={() => generate.mutate(article)}
            disabled={isGenerating}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition shadow-md
              ${isGenerating
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white active:scale-95"
              }`}
          >
            {isGenerating ? "Processing..." : "🔄 Regenerate Summary"}
          </button>
        </div>

        {/* ORIGINAL CONTENT */}
        <div className="px-8 py-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            📄 Original News Content
          </h3>

          <div className="max-h-56 overflow-y-auto bg-gray-50 px-4 py-3 rounded-lg text-sm text-gray-700 border border-gray-200 whitespace-pre-line">
            {article.content || "No article content available"}
          </div>
        </div>

        {/* REWRITE SECTION */}
        <div className="px-8 py-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
            ✍️ Simplified Version
            {isRewriting && <span className="text-xs text-gray-500">(Processing...)</span>}
          </h3>

          {isRewriting ? (
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-3 rounded-lg text-sm mb-4">
              <div className="w-5 h-5 border-2 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
              Rewriting in simpler words...
            </div>
          ) : rewritten ? (
            <div className="bg-emerald-50 border-l-4 border-emerald-600 text-emerald-900 text-sm whitespace-pre-wrap px-4 py-3 rounded-lg mb-4">
              {rewritten}
            </div>
          ) : (
            <p className="text-sm italic text-gray-400 mb-4">
              Not rewritten yet — click below to simplify the article.
            </p>
          )}

          <button
            onClick={() => rewrite.mutate(article)}
            disabled={isRewriting}
            className={`px-5 py-2 rounded-lg text-sm font-semibold shadow-md transition
              ${isRewriting
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-700 text-white active:scale-95"
              }`}
          >
            {isRewriting ? "Rewriting..." : " Simplify Article"}
          </button>
        </div>
      </div>
    </div>
  );
}
