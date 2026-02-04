/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Design token fallbacks mapped to CSS variables.
        border: 'var(--border)',
        background: 'var(--background)',
        primary: 'var(--primary)',
        accent: 'var(--accent)',
        card: 'var(--card)',
        'muted-foreground': 'var(--muted-foreground)',
        'navy-medium': 'var(--navy-medium)',
        'coral-alert': 'var(--coral-alert)',
        'teal-glow': 'var(--teal-glow)',
        'slate-surface': 'var(--slate-surface)',
        // Add any other tokens you use in components here as needed.
      },
    },
  },
  plugins: [],
}
