/**
 * Sakura Rain Background
 * 日式二次元风格 - 樱花飘落效果
 */

const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let petals = [];

const CONFIG = {
    count: 60, // 花瓣数量
    gravity: 0.5, // 下落速度
    wind: 0, // 风向
    colors: [
        'rgba(255, 183, 197, 0.6)', // 经典樱花粉
        'rgba(255, 228, 225, 0.8)', // 浅粉白
        'rgba(255, 105, 180, 0.4)'  // 深粉点缀
    ]
};

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

class Petal {
    constructor() {
        this.reset(true);
    }

    reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : -20;
        this.size = Math.random() * 10 + 5; // 花瓣大小 5-15
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 1 + 0.5;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 2 - 1;
        this.color = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
        
        // 摆动参数
        this.oscillation = Math.random() * 20 + 20; // 摆动幅度
        this.oscSpeed = Math.random() * 0.02 + 0.01;
        this.oscOffset = Math.random() * Math.PI * 2;
        this.time = 0;
    }

    update() {
        this.time += 1;
        
        // 垂直下落 + 左右摇摆
        this.y += this.speedY + CONFIG.gravity;
        this.x += Math.sin(this.time * this.oscSpeed + this.oscOffset) * 0.5 + this.speedX;
        
        // 旋转
        this.rotation += this.rotationSpeed;

        // 边界检查
        if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
            this.reset();
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        
        // 绘制花瓣形状 (贝塞尔曲线模拟)
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.moveTo(0, 0);
        // 简单的椭圆/花瓣形状
        ctx.bezierCurveTo(this.size / 2, -this.size / 2, this.size, 0, 0, this.size);
        ctx.bezierCurveTo(-this.size, 0, -this.size / 2, -this.size / 2, 0, 0);
        ctx.fill();
        
        ctx.restore();
    }
}

function init() {
    resize();
    petals = [];
    for (let i = 0; i < CONFIG.count; i++) {
        petals.push(new Petal());
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height); // 清空画布，保持清新
    
    petals.forEach(p => {
        p.update();
        p.draw();
    });

    requestAnimationFrame(animate);
}

window.addEventListener('resize', resize);
init();
animate();