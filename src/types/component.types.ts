import { ReactNode, HTMLAttributes } from 'react'

// Base component props
export interface BaseProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode
  className?: string
}

// Component with loading state
export interface LoadingProps extends BaseProps {
  isLoading?: boolean
  loadingText?: string
}

// Component with error state
export interface ErrorProps extends BaseProps {
  error?: Error | string | null
  onRetry?: () => void
}

// Component with data
export interface DataProps<T> extends BaseProps {
  data?: T
  isLoading?: boolean
  error?: Error | string | null
}

// Component with selection
export interface SelectableProps<T> extends BaseProps {
  selected?: T
  onSelect?: (value: T) => void
}

// Component with pagination
export interface PaginationProps extends BaseProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

// Component with filtering
export interface FilterProps<T> extends BaseProps {
  filters: T
  onFilterChange: (filters: Partial<T>) => void
}

// Component with sorting
export interface SortProps<T extends string> extends BaseProps {
  sortBy?: T
  sortOrder?: 'asc' | 'desc'
  onSort?: (field: T) => void
}

// Component with search
export interface SearchProps extends BaseProps {
  searchQuery: string
  onSearch: (query: string) => void
  placeholder?: string
}

// Component with infinite scroll
export interface InfiniteScrollProps extends BaseProps {
  hasMore: boolean
  onLoadMore: () => void
  isLoading?: boolean
}

// Component with modal
export interface ModalProps extends BaseProps {
  isOpen: boolean
  onClose: () => void
  title?: string
}

// Component with form
export interface FormProps<T> extends BaseProps {
  onSubmit: (data: T) => void | Promise<void>
  initialData?: Partial<T>
  isSubmitting?: boolean
}

// Component with animation
export interface AnimationProps extends BaseProps {
  animate?: boolean
  duration?: number
  delay?: number
}

// Component with theme
export interface ThemeProps extends BaseProps {
  theme?: 'light' | 'dark'
  variant?: 'primary' | 'secondary' | 'tertiary'
}

// Component with responsive props
export interface ResponsiveProps extends BaseProps {
  isMobile?: boolean
  isTablet?: boolean
  isDesktop?: boolean
} 