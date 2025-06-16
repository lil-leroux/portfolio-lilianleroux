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
    document.querySelectorAll('img.zoomable').forEach(img => {
        img.addEventListener('click', () => {
            const preview = document.getElementById('fullscreen-preview');
            preview.querySelector('img').src = img.src;
            preview.style.display = 'flex';
        });
    });

    const fullscreen = document.getElementById('fullscreen-preview');
    if (fullscreen) {
        fullscreen.addEventListener('click', () => {
            fullscreen.style.display = 'none';
        });
    }

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

    document.addEventListener('click', function (e) {
        const btn = e.target.closest('.toggle-fullscreen');
        if (btn) {
            projectDetailsPopup.classList.toggle('fullscreen');
            const img = btn.querySelector('img');
            if (projectDetailsPopup.classList.contains('fullscreen')) {
                img.src = "../image/retrecir.png"; // nouvelle icône
            } else {
                img.src = "../image/plein-ecran.png"; // retour à l’icône d’origine
            }
        }
    });



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

            // Affiche le popup
            projectDetailsPopup.style.display = 'flex';

            // Attend un "tick" pour que display soit pris en compte, puis ajoute .show
            requestAnimationFrame(() => {
                projectDetailsPopup.classList.add('show');
            });
        });
    });


    closePopupButton.addEventListener('click', () => {
        projectDetailsPopup.classList.remove('show');
        setTimeout(() => {
            projectDetailsPopup.style.display = 'none';
        }, 400); // doit correspondre à la durée CSS
    });


    const projectsContainer = document.querySelector('.all-projets');

    gridButton.addEventListener('click', () => {
        projectsContainer.classList.add('grid-layout');
        projectsContainer.classList.remove('default-layout');
        // Ensure grid layout styles are applied with higher priority
        const projectInfos = document.querySelectorAll('.projet-info');
        projectInfos.forEach(info => {
            info.style.padding = '15px';
            info.style.height = 'auto';
            info.style.display = 'flex';
            info.style.flexDirection = 'column';
            info.style.justifyContent = 'center';
            info.style.alignItems = 'center';
            info.style.textAlign = 'center';
        });
        // Modify image dimensions for grid layout
        const projectImages = document.querySelectorAll('.projet-img img');
        projectImages.forEach(img => {
            img.style.width = '100px';
            img.style.height = '100px';
        });
    });

    fullWidthButton.addEventListener('click', () => {
        projectsContainer.classList.add('default-layout');
        projectsContainer.classList.remove('grid-layout');
        // Reset styles for full-width layout
        const projectInfos = document.querySelectorAll('.projet-info');
        projectInfos.forEach(info => {
            info.style.padding = '';
            info.style.height = '';
            info.style.display = '';
            info.style.flexDirection = '';
            info.style.justifyContent = '';
            info.style.alignItems = '';
            info.style.textAlign = '';
        });
        // Reset image dimensions for full-width layout
        const projectImages = document.querySelectorAll('.projet-img img');
        projectImages.forEach(img => {
            img.style.width = '';
            img.style.height = '';
        });
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
