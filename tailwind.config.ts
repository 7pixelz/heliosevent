import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ADC905',
        'primary-dark': '#8FA004',
        cta: '#FF6A00',
        'cta-hover': '#E55F00',
        dark: '#0F0F0F',
        light: '#FAFAFA',
        'text-dark': '#1A1A1A',
        muted: '#6B7280',
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 60px rgba(173, 201, 5, 0.35)',
        card: '0 25px 60px rgba(0, 0, 0, 0.35)',
      },
      backgroundImage: {
        'grid-dots': 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
        'beam': 'linear-gradient(120deg, rgba(173,201,5,0.15), rgba(255,106,0,0.15))',
        'noise-texture': 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'300\' height=\'300\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
      },
      animation: {
        bp: 'bp 3.5s ease-in-out infinite alternate',
        sg: 'sg 4s ease-in-out infinite alternate',
      },
      keyframes: {
        bp: {
          'from': { opacity: '0.2' },
          'to': { opacity: '0.55' },
        },
        sg: {
          'from': { color: 'rgba(255,255,255,.03)' },
          'to': { color: 'rgba(173,201,5,.1)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
