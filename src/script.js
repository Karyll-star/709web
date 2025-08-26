// 全局变量
let countdownTimers = {};



// 音效系统
class SoundSystem {
    constructor() {
        this.sounds = {
            click: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT',
            meow: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT',
            bark: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT',
            warning: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT',
            success: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'
        };
    }

    play(soundName) {
        try {
            const src = this.sounds[soundName];
            if (!src) return;
            const audio = new Audio(src);
            audio.volume = 0.3;
            const p = audio.play();
            if (p && typeof p.then === 'function') {
                p.catch(() => {});
            }
        } catch (error) {
            console.log('音效播放失败:', error);
        }
    }
}

const soundSystem = new SoundSystem();

// 工具函数
function playSound(soundName) {
    soundSystem.play(soundName);
}

function addShakeEffect(element) {
    element.classList.add('shake');
    setTimeout(() => element.classList.remove('shake'), 500);
}

function addFlashEffect(element) {
    element.classList.add('flash');
    setTimeout(() => element.classList.remove('flash'), 300);
}

// 舍友卡片功能
function initializeRoommateCards() {
    const cards = document.querySelectorAll('.roommate-card');
    
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            playSound('click');
            addShakeEffect(this);
            
            const roommateType = this.dataset.roommate;
            const nameEl = this.querySelector('h3');
            const statusEl = this.querySelector('.status');
            const quoteEl = this.querySelector('.card-quote p');
            const roommateName = nameEl ? nameEl.textContent : '未知';
            // 提取状态文本并移除可能重复的“状态：”前缀
            const rawStatus = statusEl ? statusEl.textContent : '';
            const cleanedStatus = rawStatus.replace(/^\s*状态\s*[:：]\s*/i, '').trim() || '未知';
            const quote = quoteEl ? quoteEl.textContent : '';

            // 解析能力值，仅展示两项
            const statSpans = Array.from(this.querySelectorAll('.power-stats span'));
            const stats = statSpans.map(s => {
                const txt = (s.textContent || '').trim();
                const parts = txt.split(/[:：]/);
                const key = (parts[0] || '').trim();
                const val = (parts[1] || '').trim();
                return { key, val };
            }).filter(x => x.key && x.val).slice(0, 2);

            const statsTable = stats.length ? `
                <table style="width:100%;border-collapse:separate;border-spacing:0 8px">
                  <thead>
                    <tr>
                      <th style="text-align:left;color:#6B7280;font-weight:600">指标</th>
                      <th style="text-align:right;color:#374151;font-weight:700">数值</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${stats.map(({key,val}) => `
                      <tr>
                        <td style="padding:8px 0;color:#374151;">${key}</td>
                        <td style="padding:8px 0;text-align:right;color:#111827;">${val}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
            ` : '<div style="color:#6B7280">暂无能力值</div>';
            
            showModal(`
                <h2>${roommateName}的详细信息</h2>
                <div class="roommate-detail">
                    <p><strong>类型:</strong> ${roommateType}</p>
                    <p><strong>状态:</strong> ${cleanedStatus}</p>
                    <p><strong>经典台词:</strong> ${quote}</p>
                    <div class="power-table">
                        <h3 style="margin:10px 0;color:#6B7280">能力值</h3>
                        ${statsTable}
                    </div>
                </div>
            `);
        });
    });
}

// 宠物功能
function initializePets() {
    // 选择所有宠物和植物元素
    const pets = document.querySelectorAll('.pet, .swim-fish, .plant');
    pets.forEach(pet => {
        pet.addEventListener('click', function(e) {
            // 若来自拖拽后的抑制，直接返回
            if (typeof window.__suppressPetClick === 'function' && window.__suppressPetClick(e, this)) {
                return;
            }
            const petType = this.dataset.pet || this.dataset.plant || this.id;
            const quote = this.querySelector('.pet-quote, .plant-quote')?.textContent || '';
            const realImg = this.dataset.real;
            
            if (petType === 'fish1' || petType === 'fish2') {
                showModal(`
                    <h2>鱼缸${petType === 'fish1' ? '1号' : '2号'} - 真实照片</h2>
                    <div style="text-align:center;">
                        <img src="${realImg || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}" alt="鱼缸真实图片" style="max-width:100%;border-radius:15px;box-shadow:0 4px 15px #B5EAD7;margin-bottom:15px;">
                        <div style="font-size:1.1rem;color:#4ECDC4;">${quote || '游来游去的小鱼'}</div>
                    </div>
                `);
                return;
            }
            
            if (petType === 'cat') {
                playSound('meow');
            } else if (petType === 'dog') {
                playSound('bark');
            }
            
            addShakeEffect(this);
            showModal(`
                <h2>宠物互动</h2>
                <div class="pet-interaction">
                    <p><strong>宠物类型:</strong> ${petType === 'cat' ? '猫咪' : '狗狗'}</p>
                    <p><strong>当前状态:</strong> 正在卖萌</p>
                    <p><strong>说的话:</strong> ${quote}</p>
                    <div class="pet-actions">
                        <button onclick="feedPet('${petType}')">喂食</button>
                        <button onclick="playWithPet('${petType}')">玩耍</button>
                        <button onclick="petPet('${petType}')">抚摸</button>
                    </div>
                </div>
            `);
        });
        
        // 只为非鱼类的元素添加漂移动画
        if (!pet.classList.contains('swim-fish')) {
            startPetDrift(pet);
        }
        
        // 为有眼睛的元素添加鼠标悬停效果
        const eyes = pet.querySelector('.eyes');
        if (eyes) {
            pet.addEventListener('mouseenter', function() {
                eyes.style.animationDuration = '1.2s';
            });
            
            pet.addEventListener('mouseleave', function() {
                eyes.style.animationDuration = '';
            });
        }
    });
}

// 宠物互动功能
function feedPet(petType) {
    playSound('success');
    showNotification(`${petType === 'cat' ? '猫咪' : '狗狗'}吃饱了！`);
}

function playWithPet(petType) {
    playSound('click');
    showNotification(`${petType === 'cat' ? '猫咪' : '狗狗'}很开心！`);
}

function petPet(petType) {
    playSound('success');
    showNotification(`${petType === 'cat' ? '猫咪' : '狗狗'}被摸得很舒服！`);
}

// 今日舍规数据池
const dormRulesPool = [
    { type: 'forbidden', icon: 'ban', text: '今天必须将袜子穿在手上' },
    { type: 'suggestion', icon: 'lightbulb', text: '每位舍友必须讲一句二次元台词' },
    { type: 'forbidden', icon: 'ban', text: '禁止与洗衣机谈恋爱' },
    { type: 'suggestion', icon: 'lightbulb', text: '建议以猫耳发卡作为今日通行证' },
    { type: 'forbidden', icon: 'ban', text: '禁止使用正常语气说话，必须角色扮演' },
    { type: 'suggestion', icon: 'lightbulb', text: '建议以Saber为榜样完成学习任务' },
    { type: 'forbidden', icon: 'ban', text: '禁止不对猫猫（或幻想中的猫猫）打招呼' },
    { type: 'suggestion', icon: 'lightbulb', text: '建议将宿舍命名为"裂缝研究所"' },
    { type: 'forbidden', icon: 'ban', text: '禁止忘记赞美初音未来' },
    { type: 'suggestion', icon: 'lightbulb', text: '建议对镜自拍并加二次元滤镜后群发' }
];

function getRandomRuleOfDay() {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const idx = seed % dormRulesPool.length;
    return dormRulesPool[idx];
}

function renderRuleOfDay() {
    const rule = getRandomRuleOfDay();
    const rulesList = document.querySelector('.rules-list');
    if (rulesList) {
        rulesList.innerHTML = `
            <div class="rule-item ${rule.type}">
                <i class="fas fa-${rule.icon}"></i>
                <span>${rule.text}</span>
            </div>
        `;
    }
}

function initializeRules() {
    renderRuleOfDay();
}

// 节日倒计时功能
function initializeCountdown() {
    const container = document.getElementById('countdown-list');
    if (!container) return;

    const year = new Date().getFullYear();
    const festivals = getFestivalsForYear(year);
    const upcoming = festivals.filter(f => new Date(f.date) > new Date());

    container.innerHTML = upcoming.map(renderCountdownItem).join('');

    // 启动所有计时器
    const countdownElements = container.querySelectorAll('.countdown-timer');
    countdownElements.forEach(element => startTimer(element));
}

function startTimer(element) {
    const targetDate = new Date(element.dataset.date);
    const timerId = setInterval(() => {
        const now = new Date();
        const timeLeft = targetDate - now;
        if (timeLeft <= 0) {
            clearInterval(timerId);
            const card = element.closest('.countdown-item');
            if (card && card.parentElement) card.parentElement.removeChild(card);
            showNotification('节日到了！');
            return;
        }
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        element.querySelector('.days').textContent = days.toString().padStart(2, '0');
        element.querySelector('.hours').textContent = hours.toString().padStart(2, '0');
        element.querySelector('.minutes').textContent = minutes.toString().padStart(2, '0');
        if (days <= 3) element.classList.add('urgent');
        if (days <= 1) element.classList.add('final-day');
    }, 1000);
    countdownTimers[element.dataset.date] = timerId;
}

function renderCountdownItem(f) {
    return `
      <div class="countdown-item p-6 rounded-3xl flex items-center gap-5 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl" style="background-color: #F8E1E9;">
        <div class="countdown-icon flex-shrink-0">
          <img src="${f.icon}" alt="${f.name}" class="w-15 h-15 rounded-full border-3 border-white shadow-lg">
        </div>
        <div class="countdown-info flex-1">
          <h3 class="mb-2.5 text-gray-800 text-xl">${f.name}</h3>
          <div class="countdown-timer flex gap-2.5 text-lg font-bold" style="color: #D4A5D6;" data-date="${f.date}">
            <span class="days bg-white px-2.5 py-1.5 rounded-lg min-w-10 text-center shadow-lg">00</span>天
            <span class="hours bg-white px-2.5 py-1.5 rounded-lg min-w-10 text-center shadow-lg">00</span>时
            <span class="minutes bg-white px-2.5 py-1.5 rounded-lg min-w-10 text-center shadow-lg">00</span>分
          </div>
        </div>
      </div>
    `;
}

function getFestivalsForYear(year) {
    // 简化：公历固定节日，农历节日用近似日期（可后续接入精确农历换算）
    const list = [
        { name: '初音未来日', month: 11, day: 11, icon: 'https://img.karyll.xn--6qq986b3xl/file/1756192416941_【哲风壁纸】公主殿下-初音.png' },
        { name: '元旦', month: 1, day: 1, icon: 'https://images.unsplash.com/photo-1519682577862-22b62b24e493?auto=format&fit=crop&w=60&q=80' },
        { name: '情人节', month: 2, day: 14, icon: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=60&q=80' },
        { name: '清明节', month: 4, day: 4, icon: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=60&q=80' },
        { name: '劳动节', month: 5, day: 1, icon: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=60&q=80' },
        { name: '儿童节', month: 6, day: 1, icon: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=60&q=80' },
        { name: '建军节', month: 8, day: 1, icon: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=60&q=80' },
        { name: '教师节', month: 9, day: 10, icon: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=60&q=80' },
        { name: '国庆节', month: 10, day: 1, icon: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=60&q=80' },
        { name: '圣诞节', month: 12, day: 25, icon: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=60&q=80' },
        // 近似/示例：春节、中秋节（可后续替换为精确农历换算结果）
        { name: '春节', month: 2, day: 10, icon: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=60&q=80' },
        { name: '中秋节', month: 9, day: 17, icon: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=60&q=80' },
    ];

    // 生成日期（若今年已过，则生成下一年）
    const now = new Date();
    return list.map(f => {
        let d = new Date(year, f.month - 1, f.day, 0, 0, 0);
        if (d < now) {
            d = new Date(year + 1, f.month - 1, f.day, 0, 0, 0);
        }
        return { name: f.name, date: d.toISOString().slice(0, 10), icon: f.icon };
    });
}

// 弹窗系统
function showModal(content) {
    const modal = document.getElementById('modal');
    const modalBody = modal.querySelector('.modal-body');
    
    modalBody.innerHTML = content;
    modal.style.display = 'block';
    modal.style.opacity = '0';
    
    setTimeout(() => modal.style.opacity = '1', 10);
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.opacity = '0';
    setTimeout(() => modal.style.display = 'none', 300);
}

// 通知系统
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

// 导航功能
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            playSound('click');
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// 漂移动画函数
function startPetDrift(pet) {
    if (pet.driftTimer) clearInterval(pet.driftTimer);
    pet.driftTimer = setInterval(() => {
        if (pet.classList.contains('dragging')) return;
        const randomX = Math.random() * 20 - 10;
        const randomY = Math.random() * 20 - 10;
        pet.style.transform = `translate(${randomX}px, ${randomY}px)`;
    }, 3000);
}

// 拖拽功能实现（Pointer Events + rAF + transform）
function enablePetDragDrop() {
    const draggables = document.querySelectorAll('.pet, .swim-fish, .plant');
    let draggingEl = null;
    let startPointerX = 0;
    let startPointerY = 0;
    let startTranslateX = 0;
    let startTranslateY = 0;
    let rafId = null;
    let nextX = 0;
    let nextY = 0;
    let pressTimer = null;
    let isPressing = false;
    let dragActivated = false;
    let suppressNextClick = false;
    const DRAG_ACTIVATE_DELAY_MS = 120; // 长按激活拖拽的延时
    const MOVE_THRESHOLD_PX = 6; // 移动阈值，避免轻点触发拖拽

    draggables.forEach((el) => {
        el.style.cursor = 'grab';
        el.style.touchAction = 'none';
        el.addEventListener('pointerdown', onPointerDown);
        // 抑制拖拽释放后产生的点击
        el.addEventListener('click', function(e) {
            if (suppressNextClick) {
                e.stopPropagation();
                e.preventDefault();
                suppressNextClick = false;
            }
        }, true);
    });

    // 提供一个全局辅助，便于点击处理时识别拖拽抑制
    window.__suppressPetClick = function(ev, target) {
        if (suppressNextClick) {
            suppressNextClick = false;
            return true;
        }
        return false;
    };

    function onPointerDown(e) {
        const el = e.currentTarget;
        draggingEl = el;
        isPressing = true;
        dragActivated = false;

        // 读取当前 transform 偏移
        const { x: tx, y: ty } = getCurrentTranslate(draggingEl);
        startTranslateX = tx;
        startTranslateY = ty;

        startPointerX = e.clientX;
        startPointerY = e.clientY;

        nextX = startTranslateX;
        nextY = startTranslateY;

        document.addEventListener('pointermove', onPointerMove, { passive: true });
        document.addEventListener('pointerup', onPointerUp, { passive: true });
        document.addEventListener('pointercancel', onPointerUp, { passive: true });

        // 延时激活拖拽
        pressTimer = setTimeout(() => {
            if (isPressing && !dragActivated) {
                activateDrag(e.pointerId);
            }
        }, DRAG_ACTIVATE_DELAY_MS);
    }

    function onPointerMove(e) {
        if (!draggingEl) return;
        const moveDx = Math.abs(e.clientX - startPointerX);
        const moveDy = Math.abs(e.clientY - startPointerY);
        if (!dragActivated && (moveDx > MOVE_THRESHOLD_PX || moveDy > MOVE_THRESHOLD_PX)) {
            activateDrag(e.pointerId);
        }
        if (!dragActivated) return;

        const dx = e.clientX - startPointerX;
        const dy = e.clientY - startPointerY;

        let targetX = startTranslateX + dx;
        let targetY = startTranslateY + dy;

        // 对鱼限制在鱼缸内
        if (draggingEl.classList.contains('swim-fish')) {
            const tank = draggingEl.closest('.fish-tank');
            if (tank) {
                const tankRect = tank.getBoundingClientRect();
                const elRect = draggingEl.getBoundingClientRect();
                const margin = 4;
                // 以当前 translate 应用后的新矩形进行简单夹取
                const width = elRect.width;
                const height = elRect.height;

                // 将 translate 空间下的 left/top 近似到父容器坐标系
                const baseRect = draggingEl.getBoundingClientRect();
                const baseLeft = baseRect.left - txGlobal(draggingEl);
                const baseTop = baseRect.top - tyGlobal(draggingEl);
                const futureLeft = baseLeft + targetX;
                const futureTop = baseTop + targetY;

                const minX = tankRect.left + margin - baseLeft;
                const maxX = tankRect.right - margin - width - baseLeft;
                const minY = tankRect.top + margin - baseTop;
                const maxY = tankRect.bottom - margin - height - baseTop;

                targetX = Math.min(Math.max(targetX, minX), maxX);
                targetY = Math.min(Math.max(targetY, minY), maxY);
            }
        }

        nextX = targetX;
        nextY = targetY;
    }

    function onPointerUp(e) {
        if (!draggingEl) return;
        isPressing = false;
        clearTimeout(pressTimer);

        if (dragActivated) {
            draggingEl.classList.remove('dragging');
            draggingEl.style.cursor = 'grab';
            try { draggingEl.releasePointerCapture(e.pointerId); } catch (_) {}
            suppressNextClick = true;
        }

        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerup', onPointerUp);
        document.removeEventListener('pointercancel', onPointerUp);

        draggingEl = null;

        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    }

    function activateDrag(pointerId) {
        dragActivated = true;
        clearTimeout(pressTimer);
        draggingEl.setPointerCapture(pointerId);
        draggingEl.classList.add('dragging');
        draggingEl.style.cursor = 'grabbing';
        if (draggingEl.driftTimer) clearInterval(draggingEl.driftTimer);
        if (!rafId) rafId = requestAnimationFrame(applyTransform);
    }

    function applyTransform() {
        if (draggingEl) {
            draggingEl.style.transform = setTranslateKeepingScale(draggingEl, nextX, nextY);
            rafId = requestAnimationFrame(applyTransform);
        } else {
            rafId = null;
        }
    }

    function getCurrentTranslate(el) {
        const cs = window.getComputedStyle(el);
        const tr = cs.transform;
        if (!tr || tr === 'none') return { x: 0, y: 0, a: 1, d: 1 };
        const m = new DOMMatrix(tr);
        return { x: m.m41, y: m.m42, a: m.a, d: m.d };
    }

    function setTranslateKeepingScale(el, x, y) {
        const { a, d } = getCurrentTranslate(el);
        const scaleX = a || 1;
        const scaleY = d || 1;
        // 保留已有的旋转/翻转（例如小鱼的 scaleX(-1/1)）
        const tr = window.getComputedStyle(el).transform;
        if (!tr || tr === 'none') {
            return `translate(${x}px, ${y}px)`;
        }
        // 将 translate 置换到矩阵末端：使用原始矩阵但替换平移分量
        try {
            const m = new DOMMatrix(tr);
            m.m41 = x;
            m.m42 = y;
            return `matrix(${m.a}, ${m.b}, ${m.c}, ${m.d}, ${m.m41}, ${m.m42})`;
        } catch (_) {
            return `translate(${x}px, ${y}px) scale(${scaleX}, ${scaleY})`;
        }
    }

    function txGlobal(el) {
        const { x } = getCurrentTranslate(el);
        return x;
    }

    function tyGlobal(el) {
        const { y } = getCurrentTranslate(el);
        return y;
    }
}

// 鱼缸小鱼动态游动动画
function animateFishTank() {
    const tank = document.querySelector('.fish-tank');
    if (!tank) {
        console.log('鱼缸元素未找到');
        return;
    }
    
    const fishes = [
        { el: document.getElementById('fish1'), dir: 1, y: 60, speed: 1.2, flip: false, lastX: 0 },
        { el: document.getElementById('fish2'), dir: -1, y: 120, speed: 0.9, flip: true, lastX: 0 }
    ];
    
    // 检查小鱼元素是否存在
    fishes.forEach((fish, i) => {
        if (!fish.el) {
            console.log(`小鱼${i+1}元素未找到`);
            return;
        }
        console.log(`小鱼${i+1}元素找到:`, fish.el);
    });
    
    const tankW = 320, tankH = 200, fishW = 48, fishH = 28, margin = 10;
    let t = 0;
    
    // 设置小鱼的初始位置
    fishes.forEach((fish, i) => {
        if (fish.el) {
            // 确保小鱼有正确的定位样式
            fish.el.style.position = 'absolute';
            fish.el.style.left = (margin + (i * 60)) + 'px';
            fish.el.style.top = fish.y + 'px';
            fish.el.style.transform = 'scaleX(1)';
            fish.el.style.zIndex = '20';
            fish.lastX = margin + (i * 60);
            
            console.log(`设置小鱼${i+1}初始位置:`, fish.el.style.left, fish.el.style.top);
        }
    });
    
    function moveFish() {
        t += 0.03;
        fishes.forEach((fish, i) => {
            if (!fish.el) return;
            
            let range = tankW - fishW - margin * 2;
            let x = Math.abs(Math.sin(t * fish.speed + i)) * range;
            if (fish.dir < 0) x = range - x;
            let y = fish.y + Math.sin(t * fish.speed + i * 1.5) * 10;
            
            let direction = (x > fish.lastX) ? 1 : -1;
            fish.el.style.left = (x + margin) + 'px';
            fish.el.style.top = y + 'px';
            fish.el.style.transform = `scaleX(${direction})`;
            fish.lastX = x;
        });
        requestAnimationFrame(moveFish);
    }
    
    // 延迟启动动画，确保DOM完全加载
    setTimeout(() => {
        console.log('启动小鱼游动动画');
        moveFish();
    }, 500);
}

// 通话模块辅助函数
function toggleFullscreenById(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;
    if (!document.fullscreenElement) {
        if (el.requestFullscreen) el.requestFullscreen();
    } else {
        if (document.exitFullscreen) document.exitFullscreen();
    }
}

function openInNewTab(url) {
    try {
        window.open(url, '_blank');
    } catch (e) {
        console.log('无法在新窗口打开:', e);
    }
}

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('modal');
    const closeBtn = modal.querySelector('.close-btn');
    
    closeBtn.addEventListener('click', function() {
        playSound('click');
        closeModal();
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
    });
    
    // 初始化所有功能
    initializeRoommateCards();
    initializePets();
    initializeRules();
    initializeCountdown();
    initializeNavigation();
    enablePetDragDrop();
    animateFishTank();
    
    // 页面加载动画
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    // 星星闪烁效果
    setInterval(() => {
        const stars = document.querySelectorAll('.star-effect');
        stars.forEach(star => {
            if (Math.random() < 0.3) {
                star.style.opacity = '1';
                setTimeout(() => star.style.opacity = '0.3', 200);
            }
        });
    }, 500);
    
    console.log('709寝室宇宙网页已加载完成！');
}); 