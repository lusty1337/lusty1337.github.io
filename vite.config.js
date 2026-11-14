import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
    server: {
        host: '0.0.0.0',
        port: 5173,
    },
    build: {
        assetsInlineLimit: 0,
        // без явного списка vite собирает только корневой index.html, и /about/ в dist не попадёт
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                about: resolve(__dirname, 'about/index.html'),
            },
        },
    },
})
