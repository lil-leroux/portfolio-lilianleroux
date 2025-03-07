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

    // Filter projects by tags
    const filterButtons = document.querySelectorAll('.filter-button');
    const projects = document.querySelectorAll('.projet-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tag = button.getAttribute('data-tag');
            projects.forEach(project => {
                if (tag === 'all' || project.classList.contains(tag)) {
                    project.style.display = 'flex';
                } else {
                    project.style.display = 'none';
                }
            });
        });
    });

    // Show project details in a popup
    const projectDetailsPopup = document.querySelector('.project-details-popup');
    const projectDetailsContent = document.querySelector('.project-details-content');
    const closePopupButton = document.querySelector('.close-popup');

    projects.forEach(project => {
        project.addEventListener('click', () => {
            const details = project.querySelector('.project-details').innerHTML;
            projectDetailsContent.innerHTML = details;
            projectDetailsPopup.style.display = 'flex';
            projectDetailsPopup.classList.add('show');
        });
    });

    closePopupButton.addEventListener('click', () => {
        projectDetailsPopup.style.display = 'none';
        projectDetailsPopup.classList.remove('show');
    });
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
