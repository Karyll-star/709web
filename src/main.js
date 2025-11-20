import './style.css';
import './script.js'; 

console.log('Main script loaded');

// --- 二次元壁纸轮播逻辑 ---
function initAnimeWallpaper() {
  const bgContainer = document.getElementById('anime-bg-slider');
  if (!bgContainer) return;

  // API 地址，添加随机参数防止缓存
  const getApiUrl = () => `https://www.loliapi.com/acg/?t=${Date.now()}`;

  // 预加载图片函数
  const preloadImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = reject;
      img.src = url;
    });
  };

  const updateWallpaper = async () => {
    try {
      const url = getApiUrl();
      await preloadImage(url); // 等待加载完成
      
      // 设置新背景
      bgContainer.style.backgroundImage = `url('${url}')`;
      
      // 这里可以添加淡入淡出效果的逻辑，但由于 API 每次随机，
      // 简单的定时替换配合 CSS transition-opacity 已经足够好
    } catch (error) {
      console.error('Failed to load anime wallpaper:', error);
    }
  };

  // 初始化：仅在加载时更新一次，不自动轮播
  updateWallpaper();
}

// 启动壁纸加载
document.addEventListener('DOMContentLoaded', initAnimeWallpaper);
// initAnimeWallpaper(); // DOMContentLoaded 已包含，无需重复调用
