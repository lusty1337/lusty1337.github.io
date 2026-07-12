export default {
    content: ['./index.html', './*.js'],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                dark: '#0f0f0f',
                light: '#fafafa',
                accent: '#3b82f6',
            },
            transitionTimingFunction: {
                'expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
            }
        }
    }
}
