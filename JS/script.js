if (navigator.deviceMemory && navigator.deviceMemory < 4) {
    document.documentElement.classList.add('low-performance');
    document.querySelector('.interactive').style.display = 'none';
}
let lastTime = 0;
window.addEventListener('mousemove', (event) => {
    let now = performance.now();
    if (now - lastTime < 50) return; // Limite à 20 FPS
    lastTime = now;
    
    tgX = event.clientX;
    tgY = event.clientY;
});
document.addEventListener('DOMContentLoaded', () => {
    const interBubble = document.querySelector('.interactive');
    let curX = 0;
    let curY = 0;
    let tgX = 0;
    let tgY = 0;

    const move = () => {
        curX += (tgX - curX) / 20;
        curY += (tgY - curY) / 20;
        interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
        requestAnimationFrame(move);
    };

    window.addEventListener('mousemove', (event) => {
        tgX = event.clientX;
        tgY = event.clientY;
    });

    move();
});