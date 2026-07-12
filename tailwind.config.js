/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            screens: {
                'xs': '480px',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                sand: '#FDFBF9',
                pebble: '#F7F5F0',
                // нужны для корректной обработки novafi через vite postcss
                dark: { border: '#2A3143' },
            },
            backgroundImage: {
                'glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
                'glass-hover': 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
            },
            transitionDuration: {
                '700': '700ms',
            },
            transitionTimingFunction: {
                'out-slow': 'cubic-bezier(0.16, 1, 0.3, 1)',
            },
        },
    },
    plugins: [],
}
