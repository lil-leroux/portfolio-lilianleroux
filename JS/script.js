// Performance detection
const isLowPerf = (navigator.deviceMemory && navigator.deviceMemory < 4) ||
    window.matchMedia('(max-width: 768px)').matches;

if (isLowPerf) {
    document.documentElement.classList.add('low-performance');
    const interactive = document.querySelector('.interactive');
    if (interactive) interactive.style.display = 'none';
}

/* Preloader */
window.addEventListener("load", function () {
    setTimeout(function () {
        document.body.classList.add("loaded");
    }, 1500);
});

document.addEventListener('DOMContentLoaded', () => {

    // Fullscreen image preview (in static context — inside popup is re-bound separately)
    const fullscreen = document.getElementById('fullscreen-preview');
    if (fullscreen) {
        fullscreen.addEventListener('click', () => {
            fullscreen.style.display = 'none';
        });
    }

    // Interactive bubble animation (only on capable devices)
    if (!isLowPerf) {
        const interBubble = document.querySelector('.interactive');
        if (interBubble) {
            let curX = 0;
            let curY = 0;
            let tgX = 0;
            let tgY = 0;
            let lastTime = 0;

            window.addEventListener('mousemove', (event) => {
                const now = performance.now();
                if (now - lastTime < 50) return;
                lastTime = now;
                tgX = event.clientX;
                tgY = event.clientY;
            });

            const move = () => {
                curX += (tgX - curX) / 20;
                curY += (tgY - curY) / 20;
                interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
                requestAnimationFrame(move);
            };
            move();
        }
    }

    // Popup references
    const projectDetailsPopup = document.querySelector('.project-details-popup');
    const projectDetailsContent = document.querySelector('.project-details-content');
    const closePopupButton = document.querySelector('.close-popup');

    // Toggle fullscreen popup
    document.addEventListener('click', function (e) {
        const btn = e.target.closest('.toggle-fullscreen');
        if (btn && projectDetailsPopup) {
            projectDetailsPopup.classList.toggle('fullscreen');
            const img = btn.querySelector('img');
            if (img) {
                img.src = projectDetailsPopup.classList.contains('fullscreen')
                    ? "image/retrecir.png"
                    : "image/plein-ecran.png";
            }
        }
    });

    // Filter projects by tags
    const filterButtons = document.querySelectorAll('.filter-button');
    const projects = document.querySelectorAll('.projet-item');

    // Set "Tous" active by default
    const allButton = document.querySelector('.filter-button[data-tag="all"]');
    if (allButton) allButton.classList.add('active');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            button.classList.add('active');

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
    if (projectDetailsPopup && projectDetailsContent && closePopupButton) {
        const bindZoomable = (container) => {
            container.querySelectorAll('img.zoomable').forEach(img => {
                img.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const preview = document.getElementById('fullscreen-preview');
                    if (preview) {
                        preview.querySelector('img').src = img.src;
                        preview.style.display = 'flex';
                    }
                });
            });
        };

        projects.forEach(project => {
            project.addEventListener('click', () => {
                const details = project.querySelector('.project-details');
                if (!details) return;
                projectDetailsContent.innerHTML = details.innerHTML;
                bindZoomable(projectDetailsContent);

                projectDetailsPopup.style.display = 'flex';
                requestAnimationFrame(() => {
                    projectDetailsPopup.classList.add('show');
                });
            });
        });

        closePopupButton.addEventListener('click', () => {
            projectDetailsPopup.classList.remove('show');
            setTimeout(() => {
                projectDetailsPopup.style.display = 'none';
            }, 400);
        });
    }

    // Typing animation in presentation section
    const typingEl = document.getElementById('typing-text');
    if (typingEl) {
        const phrases = ['Designer UX/UI', 'Chercheur UX', 'Prototypeur', 'Développeur Front', 'Étudiant Codux'];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        const type = () => {
            const current = phrases[phraseIndex];
            if (isDeleting) {
                typingEl.textContent = current.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingEl.textContent = current.substring(0, charIndex + 1);
                charIndex++;
            }

            let delay = isDeleting ? 60 : 110;

            if (!isDeleting && charIndex === current.length) {
                delay = 1800;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                delay = 300;
            }

            setTimeout(type, delay);
        };

        setTimeout(type, 800);
    }

    // 3D tilt effect on glass cards (only on capable devices)
    if (!isLowPerf) {
        const glassCards = document.querySelectorAll(
            '.fondsarriere, .competence-card, .presentation-box, .timeline-item .timeline-content'
        );
        glassCards.forEach(card => {
            card.style.willChange = 'transform';
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const cx = rect.width / 2;
                const cy = rect.height / 2;
                const rotX = ((y - cy) / cy) * -6;
                const rotY = ((x - cx) / cx) * 6;
                card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(4px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // Process steps highlight on hover
    document.querySelectorAll('.process-step-v').forEach(step => {
        step.addEventListener('mouseenter', () => step.classList.add('active-step'));
        step.addEventListener('mouseleave', () => step.classList.remove('active-step'));
    });
});
