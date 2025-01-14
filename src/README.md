# Tech Pulse Aggregator - Source Code Architecture

## Core Principles
- **Modularity**: Each module is self-contained with clear boundaries
- **Scalability**: Architecture supports growth in features and data
- **Maintainability**: Consistent patterns and documentation
- **Performance**: Optimized for speed and resource usage

## Directory Structure

### `/app` - Application Core
- `/(routes)` - Next.js app router pages
- `/api` - API route handlers
- `layout.tsx` - Root layout with providers
- `page.tsx` - Home page implementation

### `/components` - UI Components
- `/common` - Reusable Core Components
  - `/buttons` - Button variants
  - `/cards` - Card components
  - `/inputs` - Form inputs
  - `/layout` - Layout primitives
  - `/typography` - Text components
  
- `/features` - Feature-specific Components
  - `/articles` - Article-related components
  - `/filters` - Filter components
  - `/trends` - Trend visualization
  - `/search` - Search interface
  
- `/layout` - Page Layout Components
  - `Header.tsx` - Main navigation
  - `Footer.tsx` - Site footer
  - `Sidebar.tsx` - Navigation sidebar
  - `LoadingStates.tsx` - Loading UI

### `/lib` - Core Libraries
- `/db` - Database Operations
  - `client.ts` - Database client
  - `migrations/` - Schema migrations
  - `queries/` - SQL queries
  - `models/` - Data models
  
- `/api` - API Integration
  - `client.ts` - API client setup
  - `endpoints.ts` - API endpoints
  - `types.ts` - API types
  
- `/config` - Configuration
  - `constants.ts` - App constants
  - `env.ts` - Environment config
  - `logger.ts` - Logging setup
  
- `/validation` - Data Validation
  - `schemas/` - Zod schemas
  - `guards/` - Type guards

### `/services` - Business Logic
- `/scraper` - Content Scraping
  - `telegram/` - Telegram integration
  - `processor/` - Content processing
  - `scheduler/` - Scraping scheduler
  
- `/trends` - Trend Analysis
  - `analyzer/` - Trend detection
  - `ai/` - AI processing
  - `metrics/` - Analytics
  
- `/auth` - Authentication (Future)
  - `providers/` - Auth providers
  - `middleware/` - Auth middleware

### `/hooks` - React Hooks
- `useArticles.ts` - Article data hooks
- `useFilters.ts` - Filter state hooks
- `useTrends.ts` - Trend data hooks
- `useAuth.ts` - Authentication hooks

### `/styles` - Styling
- `globals.css` - Global styles
- `themes/` - Theme configurations
- `animations/` - CSS animations
- `utilities/` - Style utilities

### `/types` - TypeScript Types
- `articles.ts` - Article types
- `trends.ts` - Trend types
- `common.ts` - Shared types
- `api.ts` - API types

## Code Organization

### Naming Conventions
- **Files**: 
  - Components: `PascalCase.tsx`
  - Utilities: `camelCase.ts`
  - Types: `camelCase.types.ts`
  - Tests: `*.test.ts`, `*.spec.tsx`

### Import Organization
```typescript
// 1. External imports
import { useState } from 'react'
import { z } from 'zod'

// 2. Internal absolute imports
import { type Article } from '@/types'
import { useArticles } from '@/hooks'

// 3. Internal relative imports
import { ArticleCard } from './components'
import styles from './styles.module.css'
```

### Component Structure
```typescript
// 1. Types/Interfaces
interface Props {
  // ...
}

// 2. Constants
const ITEMS_PER_PAGE = 10

// 3. Component
export function Component({ prop1, prop2 }: Props) {
  // 3.1 Hooks
  // 3.2 Derived State
  // 3.3 Effects
  // 3.4 Event Handlers
  // 3.5 Render
}
```

## Testing Strategy
- Unit tests for utilities and hooks
- Integration tests for features
- E2E tests for critical flows
- Performance testing for data operations

## Documentation Requirements
- Component props documentation
- Function JSDoc comments
- Complex logic explanation
- Usage examples in README

## Performance Guidelines
- Implement proper memoization
- Optimize bundle size
- Use proper loading states
- Implement caching strategies

## Security Practices
- Input validation
- Data sanitization
- Proper error handling
- Secure API calls

## Deployment Process
- Automated testing
- Preview deployments
- Database migrations
- Cache invalidation 