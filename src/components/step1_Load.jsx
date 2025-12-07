import React from "react";
import { useNavigate } from "react-router-dom";
import { useFetchArticles } from "../hooks/userArticles";

export default function Screen1Load() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useFetchArticles();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-500 to-blue-600 px-4 py-8">
     <div className="relative bg-white rounded-2xl shadow-xl flex overflow-hidden max-w-2xl w-full min-h-[480px] sm:min-h-[520px]">


        {/* SIDE ACCENT STRIP */}
        <div className="w-3 sm:w-4 bg-teal-600"></div>

        <div className="flex-1 px-6 py-8 sm:px-10 sm:py-12">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-amber-900">
              📰 AI-Based Health News Curator
            </h1>
            <p className="text-sm text-gray-500">
              Smart AI-based health article summary system
            </p>
          </div>

          <div className="text-center mb-6">
            <span className="px-4 py-1.5 text-xs font-bold bg-teal-100 text-teal-700 rounded-full shadow-sm">
              Step 1 / 3
            </span>
            <h2 className="text-xl font-semibold text-gray-900 mt-4">
              Fetching Articles
            </h2>
            <p className="text-sm text-gray-600">
              Collecting the latest health updates for you...
            </p>
          </div>

          {/* CONTENT BOX */}
          <div className="min-h-[140px] flex items-center justify-center">
            
            {isLoading && (
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-gray-300 border-t-teal-500 rounded-full animate-spin"></div>
                <p className="text-gray-600 text-sm mt-3">Loading articles...</p>
              </div>
            )}

            {error && (
              <div className="text-center text-sm text-red-600">
                ❌ Failed to load: {error.message}
              </div>
            )}

            {data && (
              <div className="text-center w-full">
                <div className="w-16 h-16 bg-teal-500 text-white rounded-full flex items-center justify-center text-3xl mx-auto shadow-md">
                  ✓
                </div>

                <p className="text-gray-700 text-sm mt-4 mb-6">
                  Successfully loaded{" "}
                  <span className="font-bold text-teal-600">{data.length}</span>{" "}
                  articles!
                </p>

                <button
                  onClick={() => navigate("/summaries")}
                  className="px-10 py-3 w-full rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.97] text-white text-sm font-bold shadow-md transition-all"
                >
                  Continue →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
