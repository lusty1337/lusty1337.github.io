export default {
    content: ['./index.html', './*.js'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Outfit', 'sans-serif'],
            },
            colors: {
                dark: {
                    bg: '#0B0E14',
                    surface: '#151A23',
                    border: '#2A3143'
                },
                accent: {
                    cyan: '#38BDF8',
                    purple: '#818CF8',
                    green: '#34D399',
                    red: '#F87171',
                    yellow: '#FBBF24'
                }
            },
            backgroundImage: {
                'glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
                'glass-hover': 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
            }
        }
    }
}
