# AI-Based Health News Curator

An intelligent web application that summarizes and simplifies health news articles into a daily digestible feed using AI-powered summarization and rewriting.

## 🚀 Project Setup & Demo

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API Key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd plum
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_GEMINI_API_KEY=your_api_key_here
```

**Note:** For Vite, environment variables must be prefixed with `VITE_` to be accessible in the browser.

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

### Demo
- **Web**: Run `npm install && npm run dev` to launch locally
- For a live demo, deploy to Vercel, Netlify, or any static hosting service

## 📋 Problem Understanding

### Problem Statement
The application addresses the challenge of information overload in health news by:
1. **Curating** health news articles from various sources
2. **Summarizing** complex articles into digestible 2-line TL;DRs with 3 key takeaways
3. **Simplifying** technical content into friendly, accessible language for general audiences
4. **Organizing** summaries into a paginated, refreshable feed

### Assumptions Made
- Articles are provided via mock data (can be extended to RSS feeds or API)
- AI summarization focuses on health-related content
- Users prefer concise summaries over full articles
- Simplified rewrites target high school reading level
- Mobile-first responsive design for accessibility

## 🤖 AI Prompts & Iterations

### Initial Prompts

**Summarization Prompt:**
```
Summarize the following news article into a very short format:
1) Two-line TL;DR (each line short).
2) Three bullet 'Key takeaways' (explicit bullets).
Do not add any extra commentary.
```

**Rewriting Prompt:**
```
Rewrite the article below in a friendly, simple tone for a general audience (high school reading level).
- Keep it short: about 4-5 short paragraphs.
- Use plain language, explain medical terms in parentheses.
- Keep the facts intact.
```

### Issues Faced & Refinements

1. **Issue**: AI responses were inconsistent in format
   - **Solution**: Added explicit formatting instructions and system instructions

2. **Issue**: Summaries were too verbose
   - **Solution**: Emphasized "very short" and "concise" in prompts

3. **Issue**: Medical terms weren't explained
   - **Solution**: Added explicit instruction to explain terms in parentheses

4. **Issue**: Rewrites lost important facts
   - **Solution**: Added "Keep the facts intact" instruction

### Final Prompts
Located in `src/utils/prompts.js` with system instructions in `src/lib/ai.js`:
- Summarization: Expert health-news editor persona
- Rewriting: Friendly journalist persona

## 🏗️ Architecture & Code Structure

### Technology Stack
- **Frontend**: React 19, Vite
- **Routing**: React Router DOM v7
- **State Management**: TanStack Query (React Query)
- **AI Service**: Google Gemini 2.5 Flash
- **Styling**: CSS Modules with modern gradients and animations

### Project Structure

```
plum/
├── src/
│   ├── components/
│   │   ├── Screen1_Load.jsx          # Step 1: Load articles
│   │   ├── Screen1_Load.css
│   │   ├── Screen2_summaryList.jsx   # Step 2: Generate summaries
│   │   ├── Screen2_summaryList.css
│   │   ├── Screen3_Feed.jsx          # Step 3: Display feed
│   │   ├── Screen3_Feed.css
│   │   ├── ArticleModal.jsx          # Expanded article view
│   │   └── ArticleModal.css
│   ├── hooks/
│   │   └── userArticles.js           # React Query hooks
│   ├── lib/
│   │   └── ai.js                     # AI service wrapper
│   ├── mock/
│   │   └── articles.js               # Mock article data
│   ├── utils/
│   │   └── prompts.js                # AI prompt templates
│   ├── App.jsx                       # Main app with routing
│   ├── App.css
│   ├── main.jsx                      # Entry point
│   └── index.css                     # Global styles
├── .env                              # Environment variables
├── package.json
└── README.md
```

### Key Components

#### Navigation Flow
- `App.jsx` manages routing with React Router
- Three main routes: `/`, `/summaries`, `/feed`
- Navigation handled via `useNavigate()` hook

#### Screen 1: Load Articles (`Screen1_Load.jsx`)
- Fetches mock articles using `useFetchArticles()` hook
- Displays loading, error, and success states
- Navigates to summaries screen on success

#### Screen 2: Generate Summaries (`Screen2_summaryList.jsx`)
- Auto-generates summaries for first 3 articles
- Shows loading states per article
- Allows manual regeneration of summaries
- Uses `useSummaries()` hook for AI calls

#### Screen 3: Feed Display (`Screen3_Feed.jsx`)
- Paginated article feed (4 per page)
- Pull-to-refresh functionality (mobile)
- Displays summaries with fallback to generate button
- Opens ArticleModal on "Read More" click

#### Article Modal (`ArticleModal.jsx`)
- Displays full article details
- Shows summary, original content, and simplified rewrite
- Allows regeneration of summary and rewrite
- Smooth animations and modern UI

### State Management

**React Query (TanStack Query)**:
- `useQuery` for fetching articles (cached, 5min stale time)
- `useMutation` for AI operations (summarize, rewrite)
- Query cache stores summaries and rewrites by article ID
- Automatic refetching and error handling

**State Flow**:
```
Articles → Cache → Summaries → Feed Display → Modal → Rewrite
```

### AI Service (`src/lib/ai.js`)

- Wraps Google Gemini API
- Handles errors gracefully
- Returns formatted text responses
- Uses system instructions for consistent output

## 📸 Screenshots / Screen Recording
https://github.com/user-attachments/assets/cdece586-a926-41dc-a155-3c7c4cd2263d
### Screen 1: Load Articles
- Gradient background with centered card
- Loading spinner animation
- Success state with article count
- Smooth navigation button

### Screen 2: AI Summaries
- List of article cards
- Per-article loading indicators
- Summary display with formatted text
- Regenerate buttons

### Screen 3: Daily Feed
- Paginated article feed
- Pull-to-refresh indicator
- Refresh button with loading state
- Article cards with summaries
- Pagination controls

### Article Modal
- Overlay with blur effect
- Scrollable content sections
- Summary, original, and rewrite sections
- Action buttons for regeneration

## 🐛 Known Issues / Improvements

### Current Limitations
1. **API Key Security**: API key is exposed in client-side code (Vite env vars)
   - **Improvement**: Use a backend proxy to hide API keys

2. **Error Handling**: Basic error messages
   - **Improvement**: Add retry logic and user-friendly error messages

3. **Caching**: No persistence across page refreshes
   - **Improvement**: Add localStorage persistence

4. **RSS Integration**: Currently uses mock data
   - **Improvement**: Integrate real RSS feeds or news APIs

5. **Mobile Pull-to-Refresh**: Only works on touch devices
   - **Improvement**: Add mouse drag support for desktop

### Planned Improvements
- [ ] Backend API for secure AI calls
- [ ] User authentication and personalized feeds
- [ ] Bookmarking and favorites
- [ ] Search and filtering
- [ ] Dark mode toggle
- [ ] Export summaries (PDF, email)
- [ ] Real-time RSS feed integration
- [ ] Progressive Web App (PWA) support
- [ ] Accessibility improvements (ARIA labels, keyboard navigation)
- [ ] Unit and integration tests

## ✨ Bonus Work

### UI/UX Enhancements
- ✅ **Modern Gradient Backgrounds**: Purple gradient theme throughout
- ✅ **Smooth Animations**: Fade-in, slide-up, hover effects
- ✅ **Loading States**: Spinners and skeleton screens
- ✅ **Responsive Design**: Mobile-first, works on all screen sizes
- ✅ **Pull-to-Refresh**: Native-feeling refresh on mobile
- ✅ **Card Hover Effects**: Subtle lift animations
- ✅ **Modal Animations**: Smooth overlay and content transitions
- ✅ **Color-Coded Sections**: Visual distinction between content types
- ✅ **Typography**: Modern font stack with proper hierarchy
- ✅ **Custom Scrollbars**: Styled scrollbars for better aesthetics

### Code Quality
- ✅ **Component Separation**: Each screen in its own component
- ✅ **CSS Modules**: Scoped styling per component
- ✅ **Error Boundaries**: Graceful error handling
- ✅ **Loading States**: Comprehensive loading indicators
- ✅ **Accessibility**: Semantic HTML and ARIA considerations

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_GEMINI_API_KEY=your_google_gemini_api_key_here
```

Get your API key from: https://makersuite.google.com/app/apikey

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style
- ES6+ JavaScript
- Functional components with hooks
- CSS modules for styling
- React Query for data fetching

## 📄 License

This project is open source and available under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with ❤️ using React, Vite, and Google Gemini AI**
