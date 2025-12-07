import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ARTICLES from "../mock/articles";
import { summarizeArticle, rewriteArticleSimpler } from "../lib/ai";

// Simulated API (Mock DB fetch)
function fetchMockArticles() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(ARTICLES), 500);
  });
}


// fetch Articles
export function useFetchArticles() {
  return useQuery({
    queryKey: ["articles"],
    queryFn: fetchMockArticles,
    staleTime: 5 * 60 * 1000, // cache 5 minutes
    refetchOnWindowFocus: false,
  });
}

// Generate / Cache Summaries
export function useSummaries() {
  const qc = useQueryClient();

  const generate = useMutation({
    mutationFn: async (article) => {
      try {
        const summaryText = await summarizeArticle(article);
        return { id: article.id, summaryText };
      } catch (err) {
        console.error("Error summarizing:", err);
        throw err;
      }
    },
    onSuccess: (data) => {
      qc.setQueryData(["summary", data.id], data.summaryText);
    },
  });

  const getSummaryFromCache = (id) =>
    qc.getQueryData(["summary", id]) || null;

  return { generate, getSummaryFromCache };
}

// ─────────────────────────────────────────────
export function useRewrite() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (article) => {
      try {
        const rewrittenText = await rewriteArticleSimpler(article);
        return { id: article.id, rewrittenText };
      } catch (err) {
        console.error("Rewrite error:", err);
        throw err;
      }
    },
    onSuccess: (data) => {
      qc.setQueryData(["rewrite", data.id], data.rewrittenText);
    },
  });
}
