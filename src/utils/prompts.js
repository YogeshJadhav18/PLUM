export function summarizePrompt(article) {
  return `You are a medical news summarizer. Create a clear and concise structured summary.

OUTPUT REQUIREMENTS:
1️⃣ "Section → Only 2 **very short** lines. No long sentences.
2️⃣ "Key Takeaways" Section → 3 bullet points with simple language.
3️⃣ Avoid opinions or assumptions. Stick to article facts only.
4️⃣ Tone: professional, easy-to-read health information.

ARTICLE DETAILS:
- Title: ${article.title}
- Source: ${article.source}
- Date: ${article.publishedAt}

ARTICLE CONTENT:
${article.content}`;
}

export function rewritePrompt(article) {
  return `Rewrite the news article below using:
✔ Simple conversational language (10th–12th grade level)
✔ Short sentences and clear structure
✔ 3–4 short paragraphs
✔ Explain any medical/scientific terms briefly in brackets
✔ Preserve all facts and original meaning
✔ Avoid adding opinions or fake info
✔ Friendly tone like a health educator

Rewrite the following:

Title: ${article.title}

Content:
${article.content}`;
}
