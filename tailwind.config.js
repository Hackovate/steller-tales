/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from 'tailwindcss-animate';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Space theme colors
        'space-dark': '#0f0f23',
        'space-blue': '#1a1a2e', 
        'space-card': '#16213e',
        'accent-orange': '#ff6b35',
        'accent-yellow': '#ffd23f',
        'accent-blue': '#4ecdc4',
        'accent-purple': '#9b59b6',
        'text-light': '#ffffff',
        'text-gray': '#b3b3b3',
      },
      maxWidth: {
        'mobile': 'min(430px, 100vw)',
      },
      height: {
        'nav': '70px',
        'header': '80px',
      },
      spacing: {
        'nav': '70px',
        'header': '80px',
      },
      animation: {
        'twinkle': 'twinkle 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'rotate-slow': 'rotate-slow 20s linear infinite',
        'space-border-flow': 'space-border-flow 4s ease-in-out infinite',
        'float-icon': 'float-icon 3s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 107, 53, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(255, 107, 53, 0.6)' },
        },
        'rotate-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'space-border-flow': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'float-icon': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '25%': { transform: 'translateY(-3px) rotate(2deg)' },
          '50%': { transform: 'translateY(0px) rotate(0deg)' },
          '75%': { transform: 'translateY(-2px) rotate(-1deg)' },
        },
        'wiggle': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(3deg)' },
          '75%': { transform: 'rotate(-3deg)' },
        },
        'glow-pulse': {
          '0%, 100%': { 
            boxShadow: '0 0 5px rgba(255, 107, 53, 0.3)',
            transform: 'scale(1)',
          },
          '50%': { 
            boxShadow: '0 0 20px rgba(255, 107, 53, 0.7), 0 0 30px rgba(78, 205, 196, 0.3)',
            transform: 'scale(1.05)',
          },
        },
      },
      transitionTimingFunction: {
        'bounce-custom': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      backgroundSize: {
        '300': '300% 300%',
      },
    },
  },
  plugins: [tailwindcssAnimate],
}