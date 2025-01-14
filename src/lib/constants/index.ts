// Pagination
export const ITEMS_PER_PAGE = 10
export const MAX_PAGES = 100

// Content Categories
export const CATEGORIES = {
  TECH: 'tech',
  STARTUP: 'startup',
  AI: 'ai',
  BUSINESS: 'business',
  PRODUCT: 'product',
} as const

// Languages
export const LANGUAGES = {
  EN: 'en',
  RU: 'ru',
} as const

// Content Types
export const CONTENT_TYPES = {
  ARTICLE: 'article',
  NEWS: 'news',
  ANALYSIS: 'analysis',
  TUTORIAL: 'tutorial',
} as const

// Cache Keys
export const CACHE_KEYS = {
  ARTICLES: 'articles',
  TRENDS: 'trends',
  CHANNELS: 'channels',
} as const

// Time Constants
export const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
} as const

// Cache Duration
export const CACHE_DURATION = {
  SHORT: TIME.MINUTE * 5,
  MEDIUM: TIME.HOUR,
  LONG: TIME.DAY,
} as const

// API Endpoints
export const API_ENDPOINTS = {
  ARTICLES: '/api/articles',
  TRENDS: '/api/trends',
  CHANNELS: '/api/channels',
} as const

// Error Messages
export const ERROR_MESSAGES = {
  FETCH_FAILED: 'Failed to fetch data',
  INVALID_REQUEST: 'Invalid request parameters',
  NOT_FOUND: 'Resource not found',
  SERVER_ERROR: 'Internal server error',
} as const

// Analytics Events
export const ANALYTICS_EVENTS = {
  PAGE_VIEW: 'page_view',
  ARTICLE_VIEW: 'article_view',
  FILTER_CHANGE: 'filter_change',
  SEARCH: 'search',
} as const

// Type exports
export type Category = typeof CATEGORIES[keyof typeof CATEGORIES]
export type Language = typeof LANGUAGES[keyof typeof LANGUAGES]
export type ContentType = typeof CONTENT_TYPES[keyof typeof CONTENT_TYPES]
export type CacheKey = typeof CACHE_KEYS[keyof typeof CACHE_KEYS]
export type AnalyticsEvent = typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS] 