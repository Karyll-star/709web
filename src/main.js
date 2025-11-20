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

// --- 开场弹幕逻辑 ---
function initWelcomeDanmaku() {
    const baseMessages = [
        "欢迎来到709寝室！🌸",
        "二次元浓度过高警告！⚠",
        "今天是摸鱼的一天吗？🐟",
        "记得查看今日舍规哦！📋",
        "路亚佬又空军了吗？🎣",
        "被子是不是还在睡觉？💤",
        "Sakana~ 🐟",
        "✨✨✨",
        "好耶！是新访客！🎉",
        "这个网站好可爱！💖",
        "CSS写得头秃了吗？👩‍🦲",
        "我要看猫猫！🐱"
    ];
    
    // 通过重复和随机组合生成更多弹幕
    let messages = [];
    for (let i = 0; i < 3; i++) { // 重复3轮
        messages = messages.concat(baseMessages);
    }
    // 打乱顺序
    messages.sort(() => Math.random() - 0.5);

    const container = document.createElement('div');
    container.className = 'danmaku-container';
    document.body.appendChild(container);

    messages.forEach((msg, index) => {
        // 大幅缩短间隔，增加密度
        setTimeout(() => {
            const item = document.createElement('div');
            item.className = 'danmaku-item';
            item.textContent = msg;
            
            // 随机样式
            const top = Math.random() * 90 + 5; // 5% - 95% 高度，利用率更高
            const fontSize = Math.random() * 12 + 18; // 18px - 30px
            const duration = Math.random() * 6 + 6; // 6s - 12s 飘过时间，稍微快一点
            const color = ['#FFB7C5', '#A0D8EF', '#FF8FAB', '#4A4A4A', '#98FB98'][Math.floor(Math.random() * 5)];

            item.style.top = `${top}%`;
            item.style.fontSize = `${fontSize}px`;
            item.style.color = color;
            item.style.animationDuration = `${duration}s`;
            // 随机 z-index 防止文字重叠时太丑
            item.style.zIndex = Math.floor(Math.random() * 10);

            container.appendChild(item);

            item.addEventListener('animationend', () => {
                item.remove();
                if (container.children.length === 0) {
                    container.remove();
                }
            });
        }, index * 200 + Math.random() * 300); // 间隔缩短到 200ms - 500ms
    });
}

// 页面加载完成后启动弹幕
window.addEventListener('load', initWelcomeDanmaku);

// --- 音乐播放器逻辑 ---
function initMusicPlayer() {
    // 播放列表：请将 .mp3 文件放入 public/music/ 文件夹
    // 并在此处修改文件名
    const playlist = [
        { title: "Sakura Pop Theme", file: "theme.mp3" },
        { title: "Dormitory Daily", file: "daily.mp3" },
        // 添加更多...
    ];

    let currentIndex = 0;
    let isPlaying = false;
    const audio = new Audio();
    audio.volume = 0; // 初始音量为 0，用于渐入

    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const songTitle = document.getElementById('song-title');
    const disc = document.querySelector('.player-disc');
    const playIcon = playBtn.querySelector('i');

    // 音量渐入函数
    function fadeInAudio() {
        let vol = 0;
        const targetVol = 0.5; // 目标音量 50%
        const interval = 200; // 每 200ms 增加一次
        const step = 0.05;   // 每次增加 5%

        const fadeTimer = setInterval(() => {
            if (vol < targetVol) {
                vol += step;
                // 确保不超过 1 或目标值
                audio.volume = Math.min(vol, targetVol);
            } else {
                clearInterval(fadeTimer);
            }
        }, interval);
    }

    // 加载歌曲
    function loadSong(index) {
        const song = playlist[index];
        audio.src = `/music/${song.file}`;
        songTitle.textContent = song.title;
    }

    // 尝试播放（带自动处理）
    function tryPlay() {
        if (playlist.length === 0) return;

        // 如果未加载源
        if (!audio.src || audio.src === window.location.href) {
            loadSong(currentIndex);
        }

        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // 播放成功
                isPlaying = true;
                playIcon.className = 'fas fa-pause';
                disc.classList.add('playing');
                // 开始淡入音量
                fadeInAudio();
            }).catch(error => {
                // 自动播放被拦截
                console.log("自动播放被拦截，等待用户交互:", error);
                songTitle.textContent = "点击页面播放音乐 🎵";
                // 添加一次性全局点击监听来启动播放
                const oneClickStart = () => {
                    tryPlay();
                    document.removeEventListener('click', oneClickStart);
                };
                document.addEventListener('click', oneClickStart);
            });
        }
    }

    // 播放/暂停切换
    function togglePlay() {
        if (playlist.length === 0) {
            songTitle.textContent = "请添加音乐文件";
            return;
        }
        
        if (isPlaying) {
            audio.pause();
            playIcon.className = 'fas fa-play';
            disc.classList.remove('playing');
            isPlaying = false;
        } else {
            // 手动点击播放时直接设为目标音量，或者也渐入
            audio.volume = 0.5; 
            tryPlay(); 
        }
    }

    // 下一首
    function nextSong() {
        currentIndex = (currentIndex + 1) % playlist.length;
        loadSong(currentIndex);
        // 切歌时保持音量
        audio.volume = 0.5; 
        audio.play();
        isPlaying = true;
        playIcon.className = 'fas fa-pause';
        disc.classList.add('playing');
    }

    // 上一首
    function prevSong() {
        currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
        loadSong(currentIndex);
        audio.volume = 0.5;
        audio.play();
        isPlaying = true;
        playIcon.className = 'fas fa-pause';
        disc.classList.add('playing');
    }

    // 自动播放下一首 (循环模式)
    audio.addEventListener('ended', nextSong);

    // 绑定事件
    playBtn.addEventListener('click', togglePlay);
    nextBtn.addEventListener('click', nextSong);
    prevBtn.addEventListener('click', prevSong);

    // 初始化显示
    if (playlist.length > 0) {
        songTitle.textContent = playlist[0].title;
        // 尝试自动播放
        setTimeout(tryPlay, 1000); // 延迟 1 秒后尝试，给页面一点加载时间
    } else {
        songTitle.textContent = "暂无音乐";
    }
}

// 启动音乐播放器
document.addEventListener('DOMContentLoaded', initMusicPlayer);
// initAnimeWallpaper(); // DOMContentLoaded 已包含，无需重复调用
