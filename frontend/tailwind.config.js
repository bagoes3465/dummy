export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0F4FF',
          100: '#E0E9FF',
          300: '#BFDBFE',
          400: '#93C5FD',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
        },
        secondary: '#F3F4F6',
        accent: '#DBEAFE',
        success: '#10B981',
        processing: '#F59E0B',
        error: '#EF4444',
        neutral: '#6B7280',
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
      },
      spacing: {
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
      },
      fontSize: {
        'heading-xl': ['3.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        'heading-lg': ['2.25rem', { lineHeight: '1.3', fontWeight: '600' }],
        'heading-md': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.5', fontWeight: '400' }],
        'body-md': ['1rem', { lineHeight: '1.5', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
      },
      fontFamily: {
        sans: ['Inter, SF Pro Display, Poppins, system-ui, sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        'card-lg': '0 10px 25px 0 rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}
