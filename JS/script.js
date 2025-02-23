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
/* Preloader */
window.addEventListener("load", function () {
    setTimeout(function () {
        document.body.classList.add("loaded");
    }, 1500); // Délai de 1.5 seconde avant la disparition
});


const stack = document.querySelector(".stack");
const cards = Array.from(stack.children)
    .reverse()
    .filter((child) => child.classList.contains("card"));

cards.forEach((card) => stack.appendChild(card));

function moveCard() {
    const lastCard = stack.lastElementChild;
    if (lastCard.classList.contains("card")) {
        lastCard.classList.add("swap");

        setTimeout(() => {
            lastCard.classList.remove("swap");
            stack.insertBefore(lastCard, stack.firstElementChild);
        }, 1200);
    }
}

let autoplayInterval = setInterval(moveCard, 4000);

stack.addEventListener("click", function (e) {
    const card = e.target.closest(".card");
    if (card && card === stack.lastElementChild) {
        card.classList.add("swap");

        setTimeout(() => {
            card.classList.remove("swap");
            stack.insertBefore(card, stack.firstElementChild);
        }, 1200);
    }
});
