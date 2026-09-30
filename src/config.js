// 图床域名统一配置
// 以后再换图床，只需要改下面这一行 IMG_HOST 即可（HTML 中的 {{IMG_HOST}} 与 JS 中的 img() 都会同步生效）
export const IMG_HOST = 'https://img.karyll.fun';

// 备用域名：Cloudflare Pages 的原始域名，只要项目还在就不会变
// 主域名挂了会自动降级到它，避免图片全裂
export const IMG_HOST_FALLBACK = 'https://3e7f1bcd.cloudflare-imgbed-bj3.pages.dev';

// 拼接图床地址，例如 img('/file/xxx.png')
export function img(path) {
    return `${IMG_HOST}${path.startsWith('/') ? '' : '/'}${path}`;
}

// 图片加载失败时自动切换到备用域名（只切换一次，避免死循环）
export function installImgFallback() {
    window.addEventListener('error', (event) => {
        const el = event.target;
        if (!(el instanceof HTMLImageElement)) return;
        if (!el.src.startsWith(IMG_HOST) || el.dataset.imgFallback) return;
        el.dataset.imgFallback = '1';
        el.src = el.src.replace(IMG_HOST, IMG_HOST_FALLBACK);
    }, true);
}
