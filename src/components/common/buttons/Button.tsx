import { forwardRef } from 'react'
import { LoadingProps, ThemeProps } from '@/types/component.types'
import { cn } from '@/lib/utils'

export interface ButtonProps extends LoadingProps, ThemeProps {
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  className,
  variant = 'primary',
  size = 'md',
  theme = 'light',
  fullWidth = false,
  isLoading = false,
  loadingText = 'Loading...',
  disabled = false,
  type = 'button',
  onClick,
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
  
  const variants = {
    primary: {
      light: 'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500',
      dark: 'bg-primary-500 text-white hover:bg-primary-600 focus-visible:ring-primary-400'
    },
    secondary: {
      light: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500',
      dark: 'bg-gray-700 text-white hover:bg-gray-600 focus-visible:ring-gray-400'
    },
    tertiary: {
      light: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus-visible:ring-gray-500',
      dark: 'text-gray-300 hover:text-white hover:bg-gray-700 focus-visible:ring-gray-400'
    }
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        baseStyles,
        variants[variant][theme],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  )
})

Button.displayName = 'Button'

export default Button 