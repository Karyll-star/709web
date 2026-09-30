import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { IMG_HOST } from './src/config.js'

// 把 HTML 里的 {{IMG_HOST}} 替换成 src/config.js 中配置好的图床域名
const imgHostPlugin = () => ({
    name: 'img-host-replace',
    transformIndexHtml: {
        order: 'pre',
        handler: (html) => html.replaceAll('{{IMG_HOST}}', IMG_HOST)
    }
})

export default defineConfig({
    plugins: [
        tailwindcss(),
        imgHostPlugin(),
    ],
    build: {
        rollupOptions: {
            input: {
                main: './index.html',
                luya: './luya.html',
                aim: './aim.html',
                electricity: './electricity.html'
            }
        }
    }
})
