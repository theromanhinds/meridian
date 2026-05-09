/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  future: {
    // Make `hover:` only apply on devices that actually support hover (no sticky-hover on mobile taps)
    hoverOnlyWhenSupported: true,
  },
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      sm:  '480px',
      md:  '800px',   // mobile breakpoint per spec
      lg:  '1100px',
      xl:  '1400px',
      '2xl': '1700px',
    },
    extend: {
      colors: {
        // Single near-black canvas + raised whites for everything elevated
        bg: {
          app:      'var(--bg-app)',
          canvas:   'var(--bg-canvas)',
          panel:    'var(--bg-panel)',
        },
        layer: {
          1: 'var(--layer-1)',
          2: 'var(--layer-2)',
          3: 'var(--layer-3)',
          4: 'var(--layer-4)',
        },
        line: {
          DEFAULT: 'var(--line)',
          hi:      'var(--line-hi)',
        },
        ink: {
          1: 'var(--ink-1)',
          2: 'var(--ink-2)',
          3: 'var(--ink-3)',
          4: 'var(--ink-4)',
          5: 'var(--ink-5)',
        },
        ok:     { DEFAULT: 'var(--ok)',     soft: 'var(--ok-soft)' },
        warn:   { DEFAULT: 'var(--warn)',   soft: 'var(--warn-soft)' },
        danger: { DEFAULT: 'var(--danger)', soft: 'var(--danger-soft)' },
        focus:  'var(--focus-ring)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Lora', 'Charter', 'Georgia', 'serif'],
        mono: ['ui-monospace', 'SF Mono', 'Menlo', 'Consolas', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.75rem',  { lineHeight: '1rem' }],          // 12
        xs:    ['0.8125rem',{ lineHeight: '1.125rem' }],      // 13
        sm:    ['0.875rem', { lineHeight: '1.25rem' }],       // 14
        base:  ['0.9375rem',{ lineHeight: '1.55rem' }],       // 15 — Linear/Notion-ish
        md:    ['1rem',     { lineHeight: '1.6rem' }],        // 16
        lg:    ['1.0625rem',{ lineHeight: '1.65rem' }],       // 17
        xl:    ['1.25rem',  { lineHeight: '1.75rem' }],       // 20
        '2xl': ['1.5rem',   { lineHeight: '1.95rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      },
      borderRadius: {
        xs:      '6px',
        sm:      '8px',
        DEFAULT: '10px',
        md:      '12px',
        lg:      '14px',
        xl:      '18px',
        '2xl':   '22px',
      },
      boxShadow: {
        sm:   'var(--shadow-sm)',
        md:   'var(--shadow-md)',
        lg:   'var(--shadow-lg)',
        xl:   'var(--shadow-xl)',
        pop:  'var(--shadow-pop)',
      },
      transitionDuration: {
        instant: '50ms',
        fast:    '140ms',
        normal:  '200ms',
        slow:    '300ms',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      },
      backdropBlur: {
        xs: '4px',
      },
    },
  },
  plugins: [],
};
