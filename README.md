# Tech Pulse 🚀

A modern, AI-powered tech news aggregator built with Next.js 13, React, and Tailwind CSS. Tech Pulse curates the best content from multiple tech sources and provides a beautiful, performant interface to explore them.

![Tech Pulse Screenshot](screenshot.png)

## ✨ Features

### Core Functionality
- 🔄 Multi-source news aggregation (Hacker News, Dev.to, Reddit)
- 🤖 AI-powered article summaries
- 🎯 Smart categorization and filtering
- 🔍 Full-text search capabilities
- 💭 Sentiment analysis for articles

### Technical Features
- ⚡ Optimized performance with local caching
- 🌙 Dark mode support
- 🎨 Modern UI with glassmorphism effects
- 📱 Fully responsive design
- 🔄 Smart cache invalidation
- ⌛ Last updated indicators
- 🚦 Loading states and error handling

### UI Components
- 🎴 Beautiful article cards with hover effects
- 🏷️ Interactive tag system
- 🔄 Smooth animations and transitions
- 📊 Source badges with custom styling
- 🎯 Filter system with visual feedback

## 🛠️ Tech Stack

- **Framework**: Next.js 13 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Data Fetching**: Native Fetch API
- **Caching**: LocalStorage with smart invalidation
- **Animations**: CSS Animations & Transitions

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/tech-pulse.git
   cd tech-pulse
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your API keys and configuration

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables
```env
NEXT_PUBLIC_API_URL=your_api_url
# Add other necessary environment variables
```

### Cache Configuration
The app uses local storage caching with the following defaults:
- Cache Duration: 5 minutes
- Cache Key: 'techpulse_cache'

You can modify these in `src/app/page.tsx`:
```typescript
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const CACHE_KEY = 'techpulse_cache';
```

## 📦 Project Structure

```
tech-pulse/
├── src/
│   ├── app/
│   │   ├── page.tsx        # Main page component
│   │   └── layout.tsx      # Root layout
│   ├── components/
│   │   └── news/
│   │       ├── NewsCard.tsx    # Article card component
│   │       ├── NewsGrid.tsx    # Grid layout component
│   │       └── NewsFilters.tsx # Filtering component
│   └── types/
│       └── index.ts        # TypeScript definitions
├── public/
│   └── ...                 # Static assets
└── ...                     # Config files
```

## 🎨 Customization

### Styling
The project uses Tailwind CSS for styling. You can customize the theme in `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      // Add your custom theme configuration
    }
  }
}
```

### Adding New Sources
To add a new news source:
1. Update the `NewsSource` type in `src/types/index.ts`
2. Add source configuration in `NewsCard.tsx`
3. Implement the API integration in your backend

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Various news sources for their content
- Open source community for inspiration and tools

---

Built with ❤️ by [Your Name] 