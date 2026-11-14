import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
    server: {
        host: '0.0.0.0',
        port: 5173,
    },
    build: {
        assetsInlineLimit: 0,
        // без явного списка vite собирает только корневой index.html, и остальные страницы в dist не попадут
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                about: resolve(__dirname, 'about/index.html'),
                privacy: resolve(__dirname, 'privacy/index.html'),
                consent: resolve(__dirname, 'consent/index.html'),
                // github pages отдаёт /404.html на любой неизвестный адрес, поэтому файл должен лежать в корне dist
                notFound: resolve(__dirname, '404.html'),
            },
        },
    },
})
