import { useState, useEffect, useCallback } from 'react'
import { logger } from '@/lib/config/logger'

interface UseDataOptions<T> {
  initialData?: T
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  enabled?: boolean
}

interface UseDataResult<T> {
  data: T | undefined
  error: Error | null
  isLoading: boolean
  isError: boolean
  refetch: () => Promise<void>
}

export function useData<T>(
  fetcher: () => Promise<T>,
  options: UseDataOptions<T> = {}
): UseDataResult<T> {
  const {
    initialData,
    onSuccess,
    onError,
    enabled = true
  } = options

  const [data, setData] = useState<T | undefined>(initialData)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const result = await fetcher()
      setData(result)
      onSuccess?.(result)
      
      logger.info('Data fetched successfully')
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred')
      setError(error)
      onError?.(error)
      
      logger.error(`Data fetch error: ${error.message}`)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [fetcher, onSuccess, onError])

  const refetch = useCallback(async () => {
    if (enabled) {
      await fetchData()
    }
  }, [enabled, fetchData])

  useEffect(() => {
    if (enabled) {
      fetchData()
    }
  }, [enabled, fetchData])

  return {
    data,
    error,
    isLoading,
    isError: error !== null,
    refetch
  }
}

// Utility type for paginated data
export interface PaginatedData<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// Hook for fetching paginated data
export function usePaginatedData<T>(
  fetcher: (page: number, pageSize: number) => Promise<PaginatedData<T>>,
  pageSize: number = 10,
  options: UseDataOptions<PaginatedData<T>> = {}
): UseDataResult<PaginatedData<T>> & {
  loadMore: () => Promise<void>
  hasMore: boolean
} {
  const [page, setPage] = useState(1)
  
  const fetchPage = useCallback(async () => {
    return fetcher(page, pageSize)
  }, [fetcher, page, pageSize])

  const {
    data,
    error,
    isLoading,
    isError,
    refetch
  } = useData(fetchPage, options)

  const loadMore = useCallback(async () => {
    if (data?.hasMore && !isLoading) {
      setPage(prev => prev + 1)
      await refetch()
    }
  }, [data?.hasMore, isLoading, refetch])

  return {
    data,
    error,
    isLoading,
    isError,
    refetch,
    loadMore,
    hasMore: data?.hasMore ?? false
  }
} 