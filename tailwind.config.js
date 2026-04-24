export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Source Sans 3"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Source Serif 4"', 'ui-serif', 'Georgia', 'serif'],
      },
      colors: {
        cream: '#FDFBF7',
        parchment: '#F5F0E8',
        ink: '#1E293B',
        owl: {
          purple: '#865595',
          green: '#699940',
        },
      },
    },
  },
  plugins: [],
}
