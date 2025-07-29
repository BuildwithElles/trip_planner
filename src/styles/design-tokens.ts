// TripTogether Design System Tokens
export const designTokens = {
  colors: {
    // Primary Brand Colors
    primary: {
      50: '#EFF6FF',  // blue-50
      100: '#DBEAFE', // blue-100  
      600: '#3B82F6', // blue-600 (Primary Blue)
      700: '#1D4ED8', // blue-700
    },
    secondary: {
      50: '#F0FDF4',  // green-50
      100: '#DCFCE7', // green-100
      600: '#059669', // green-600 (Secondary Green)
      700: '#047857', // green-700
    },
    accent: {
      50: '#FAF5FF',  // purple-50
      100: '#F3E8FF', // purple-100
      600: '#8B5CF6', // purple-600 (Accent Purple)
      700: '#7C3AED', // purple-700
    },
    // Gradient System
    gradients: {
      primary: 'bg-gradient-to-r from-blue-600 to-purple-600',
      success: 'bg-gradient-to-r from-green-600 to-blue-600', 
      background: 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    },
    // Semantic Colors
    semantic: {
      success: {
        light: '#DCFCE7', // green-100
        DEFAULT: '#059669', // green-600
      },
      info: {
        light: '#DBEAFE', // blue-100
        DEFAULT: '#3B82F6', // blue-600
      },
      warning: {
        light: '#F3E8FF', // purple-100
        DEFAULT: '#8B5CF6', // purple-600
      }
    },
    // Neutral Colors
    neutral: {
      50: '#F9FAFB',   // gray-50
      100: '#F3F4F6',  // gray-100
      200: '#E5E7EB',  // gray-200
      300: '#D1D5DB',  // gray-300
      500: '#6B7280',  // gray-500
      600: '#4B5563',  // gray-600
      800: '#1F2937',  // gray-800
      white: '#FFFFFF',
    }
  },
  typography: {
    fontFamily: {
      sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],     // 12px
      sm: ['0.875rem', { lineHeight: '1.25rem' }], // 14px
      base: ['0.875rem', { lineHeight: '1.25rem' }], // 14px (base)
      lg: ['1.125rem', { lineHeight: '1.75rem' }], // 18px
      xl: ['1.25rem', { lineHeight: '1.75rem' }],  // 20px
      '2xl': ['1.5rem', { lineHeight: '2rem' }],   // 24px
    },
    fontWeight: {
      normal: '400',
      medium: '500', 
      semibold: '600',
    }
  },
  spacing: {
    xs: '0.5rem',  // 8px
    sm: '1rem',    // 16px  
    md: '1.5rem',  // 24px
    lg: '2rem',    // 32px
    xl: '3rem',    // 48px
  },
  borderRadius: {
    DEFAULT: '0.5rem',    // 8px
    lg: '0.75rem',        // 12px
    xl: '0.75rem',        // 12px (for components)
    '2xl': '1rem',        // 16px (for cards)
    full: '9999px',
  },
  shadows: {
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  },
  height: {
    button: '3rem',       // h-12 (48px)
    'button-lg': '3.5rem', // h-14 (56px) 
    input: '3rem',        // h-12 (48px)
  }
} as const

export type DesignTokens = typeof designTokens