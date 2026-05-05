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
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Reading progress indicator
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(progressBar);

    const updateProgress = () => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
        progressBar.style.setProperty('--progress', `${Math.min(Math.max(progress, 0), 100)}%`);
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    // Floating back-to-top action
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.type = 'button';
    backToTop.title = 'Retour en haut';
    backToTop.setAttribute('aria-label', 'Retour en haut');
    backToTop.textContent = '↑';
    document.body.appendChild(backToTop);

    const toggleBackToTop = () => {
        backToTop.classList.toggle('show', window.scrollY > 650);
    };
    toggleBackToTop();
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });

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
    const projectsContainer = document.querySelector('.all-projets');
    const filterButtonsContainer = document.querySelector('.filter-buttons');
    let filterFeedbackTimeout;
    let filterTransitionTimeout;
    let filterStatus;

    if (filterButtonsContainer) {
        filterStatus = document.createElement('div');
        filterStatus.className = 'filter-status';
        filterStatus.setAttribute('role', 'status');
        filterStatus.setAttribute('aria-live', 'polite');
        filterStatus.innerHTML = '<span class="filter-loader" aria-hidden="true"></span><span class="filter-status-text">Filtre appliqué</span>';
        filterButtonsContainer.insertAdjacentElement('afterend', filterStatus);
    }

    // Set "Tous" active by default
    const allButton = document.querySelector('.filter-button[data-tag="all"]');
    if (allButton) allButton.classList.add('active');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            window.clearTimeout(filterFeedbackTimeout);
            window.clearTimeout(filterTransitionTimeout);
            filterButtons.forEach(b => b.classList.remove('active'));
            button.classList.add('active');

            const tag = button.getAttribute('data-tag');
            const label = button.textContent.trim();
            const visibleProjects = Array.from(projects).filter(project => project.style.display !== 'none');

            if (projectsContainer) {
                projectsContainer.style.minHeight = `${projectsContainer.offsetHeight}px`;
                projectsContainer.classList.add('is-filtering');
            }
            if (filterStatus) {
                filterStatus.querySelector('.filter-status-text').textContent = `Filtre "${label}" appliqué`;
                filterStatus.classList.add('show');
            }

            visibleProjects.forEach(project => {
                project.classList.remove('project-appearing');
                project.classList.add('project-exiting');
            });

            filterTransitionTimeout = window.setTimeout(() => {
                const matchingProjects = [];

                projects.forEach(project => {
                    project.classList.remove('project-exiting', 'project-appearing');
                    const projectTags = (project.getAttribute('data-tag') || '').split(/\s+/);
                    const matches = tag === 'all' || projectTags.includes(tag) || project.classList.contains(tag);
                    project.style.display = matches ? 'flex' : 'none';
                    if (matches) matchingProjects.push(project);
                });

                matchingProjects.forEach((project, index) => {
                    project.style.setProperty('--project-delay', `${Math.min(index * 55, 420)}ms`);
                    requestAnimationFrame(() => project.classList.add('project-appearing'));
                });

                filterFeedbackTimeout = window.setTimeout(() => {
                    if (projectsContainer) {
                        projectsContainer.classList.remove('is-filtering');
                        projectsContainer.style.minHeight = '';
                    }
                    if (filterStatus) filterStatus.classList.remove('show');
                }, 950);
            }, 170);
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

    // Typing animation in accueil section
    const accueilTypingEl = document.getElementById('accueil-typing-text');
    if (accueilTypingEl) {
        const aPhases = ['Designer UX/UI', 'Chercheur UX', 'Prototypeur', 'Développeur Front'];
        let aIdx = 0, aChr = 0, aDel = false;
        const typeAccueil = () => {
            const cur = aPhases[aIdx];
            accueilTypingEl.textContent = aDel ? cur.substring(0, aChr - 1) : cur.substring(0, aChr + 1);
            if (!aDel) aChr++; else aChr--;
            let delay = aDel ? 60 : 110;
            if (!aDel && aChr === cur.length) { delay = 1800; aDel = true; }
            else if (aDel && aChr === 0) { aDel = false; aIdx = (aIdx + 1) % aPhases.length; delay = 300; }
            setTimeout(typeAccueil, delay);
        };
        setTimeout(typeAccueil, 3500);
    }

    const iconSvgs = {
        search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m16.5 16.5 4 4"></path><path d="M8.5 11h5"></path><path d="M11 8.5v5"></path></svg>',
        idea: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M8.5 14.5A6 6 0 1 1 15.5 14c-.9.7-1.5 1.7-1.5 3h-4c0-1.2-.5-1.9-1.5-2.5Z"></path></svg>',
        pen: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m16.8 3.2 4 4L8.5 19.5 3 21l1.5-5.5Z"></path><path d="m14 6 4 4"></path></svg>',
        test: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 2v6L4.5 18.5A2.4 2.4 0 0 0 6.6 22h10.8a2.4 2.4 0 0 0 2.1-3.5L14 8V2"></path><path d="M8 2h8"></path><path d="M7.5 16h9"></path></svg>',
        web: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="14" rx="2"></rect><path d="M8 20h8"></path><path d="M12 18v2"></path><path d="M7 8h10"></path></svg>',
        school: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 8 9-4 9 4-9 4Z"></path><path d="M7 10.5V16c1.7 1.3 3.3 2 5 2s3.3-.7 5-2v-5.5"></path><path d="M21 8v6"></path></svg>',
        code: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 9-4 3 4 3"></path><path d="m16 9 4 3-4 3"></path><path d="m14 5-4 14"></path></svg>',
        media: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="m10 9 5 3-5 3Z"></path></svg>',
        leaf: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4C12 4 6 8.5 6 15a5 5 0 0 0 5 5c6.5 0 9-8 9-16Z"></path><path d="M4 20c3-6 7-9 12-11"></path></svg>',
        briefcase: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2"></rect><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path><path d="M3 12h18"></path></svg>',
        sparkle: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5Z"></path><path d="M19 15l.8 2.7L22 18.5l-2.2.8L19 22l-.8-2.7-2.2-.8 2.2-.8Z"></path></svg>'
    };

    document.querySelectorAll('.process-icon').forEach((icon, index) => {
        const keys = ['search', 'idea', 'pen', 'test'];
        icon.classList.add('professional-icon');
        icon.innerHTML = iconSvgs[keys[index] || 'sparkle'];
    });

    // Interactive parcours timeline
    const timeline = document.querySelector('#parcours .timeline');
    const timelineItems = timeline ? Array.from(timeline.querySelectorAll('.timeline-item')) : [];
    if (timeline && timelineItems.length) {
        const parcoursShell = document.createElement('div');
        parcoursShell.className = 'parcours-interactive';

        const controls = document.createElement('div');
        controls.className = 'timeline-controls';
        controls.setAttribute('aria-label', 'Navigation du parcours');

        const progress = document.createElement('div');
        progress.className = 'timeline-progress';
        progress.setAttribute('aria-hidden', 'true');
        progress.innerHTML = '<span></span>';

        const detail = document.createElement('article');
        detail.className = 'timeline-detail';
        detail.setAttribute('aria-live', 'polite');

        timeline.parentNode.insertBefore(parcoursShell, timeline);
        parcoursShell.appendChild(controls);
        parcoursShell.appendChild(progress);
        parcoursShell.appendChild(detail);

        const timelineIcons = ['web', 'school', 'code', 'media', 'leaf', 'briefcase', 'sparkle'];
        let setActiveTimeline;
        const buttons = timelineItems.map((item, index) => {
            const content = item.querySelector('.timeline-content');
            const title = content?.querySelector('h2')?.textContent.trim() || `Etape ${index + 1}`;
            const text = content?.querySelector('p')?.innerHTML || '';
            const year = title.match(/\d{4}(?:\D+\d{4})?/)?.[0] || `0${index + 1}`;

            item.dataset.timelineIndex = index;
            item.dataset.timelineTitle = title;
            item.dataset.timelineText = text;
            item.style.setProperty('--timeline-delay', `${index * 70}ms`);

            const marker = document.createElement('span');
            marker.className = 'timeline-icon professional-icon';
            marker.innerHTML = iconSvgs[timelineIcons[index] || 'sparkle'];
            item.appendChild(marker);

            if (content) {
                content.setAttribute('tabindex', '0');
                content.setAttribute('role', 'button');
                content.setAttribute('aria-label', title);
            }

            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'timeline-control';
            button.innerHTML = `<span>${year}</span>`;
            button.setAttribute('aria-label', title);
            button.addEventListener('click', () => setActiveTimeline(index));
            controls.appendChild(button);

            item.addEventListener('click', () => setActiveTimeline(index));
            content?.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setActiveTimeline(index);
                }
            });

            return button;
        });

        setActiveTimeline = (activeIndex) => {
            timelineItems.forEach((item, index) => {
                const isActive = index === activeIndex;
                item.classList.toggle('active-timeline', isActive);
                item.querySelector('.timeline-content')?.setAttribute('aria-pressed', String(isActive));
                buttons[index].classList.toggle('active', isActive);
            });

            const activeItem = timelineItems[activeIndex];
            detail.innerHTML = `<span class="timeline-detail-label">Parcours actif</span><h2>${activeItem.dataset.timelineTitle || ''}</h2><p>${activeItem.dataset.timelineText || ''}</p>`;
            progress.querySelector('span').style.width = `${((activeIndex + 1) / timelineItems.length) * 100}%`;
        };

        setActiveTimeline(timelineItems.length - 1);
    }

    // Interactive competence cards and tools
    const competenceGrid = document.querySelector('.competence-grid');
    const competenceCards = competenceGrid ? Array.from(competenceGrid.querySelectorAll('.competence-card')) : [];
    if (competenceGrid && competenceCards.length) {
        const panel = document.createElement('article');
        panel.className = 'competence-focus-panel';
        panel.setAttribute('aria-live', 'polite');
        competenceGrid.insertAdjacentElement('afterend', panel);

        let setActiveCompetence;
        competenceCards.forEach((card, index) => {
            const level = card.dataset.level || '80';
            const title = card.querySelector('h2')?.textContent.trim() || `Competence ${index + 1}`;
            const text = card.querySelector('p')?.textContent.trim() || '';
            const tags = (card.dataset.tags || '').split(',').map(tag => tag.trim()).filter(Boolean);

            card.style.setProperty('--skill-level', `${level}%`);
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `${title}, niveau ${level} pour cent`);

            const meter = document.createElement('div');
            meter.className = 'skill-meter';
            meter.innerHTML = `<span style="width: ${level}%"></span>`;
            card.appendChild(meter);

            const tagList = document.createElement('div');
            tagList.className = 'competence-mini-tags';
            tagList.innerHTML = tags.map(tag => `<span>${tag}</span>`).join('');
            card.appendChild(tagList);

            card.addEventListener('click', () => setActiveCompetence(index));
            card.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setActiveCompetence(index);
                }
            });
            card.addEventListener('mouseenter', () => setActiveCompetence(index));

            card.dataset.skillTitle = title;
            card.dataset.skillText = text;
            card.dataset.skillTags = tags.join('|');
        });

        setActiveCompetence = (activeIndex) => {
            const activeCard = competenceCards[activeIndex];
            competenceCards.forEach((card, index) => card.classList.toggle('active-competence', index === activeIndex));
            const tags = (activeCard.dataset.skillTags || '').split('|').filter(Boolean);
            panel.innerHTML = `
                <span class="competence-focus-label">Competence active</span>
                <h2>${activeCard.dataset.skillTitle || ''}</h2>
                <p>${activeCard.dataset.skillText || ''}</p>
                <div class="competence-focus-tags">${tags.map(tag => `<span>${tag}</span>`).join('')}</div>
            `;
        };

        setActiveCompetence(0);
    }

    const toolsSection = document.querySelector('.logiciels-section');
    const toolLogos = toolsSection ? Array.from(toolsSection.querySelectorAll('.logiciels-logos img')) : [];
    if (toolsSection && toolLogos.length) {
        const toolPanel = document.createElement('div');
        toolPanel.className = 'tool-focus-panel';
        toolPanel.setAttribute('aria-live', 'polite');
        toolPanel.innerHTML = '<span>Outil selectionne</span><strong>Survolez un outil</strong>';
        toolsSection.appendChild(toolPanel);

        toolLogos.forEach((logo, index) => {
            const name = logo.getAttribute('title') || logo.getAttribute('alt') || `Outil ${index + 1}`;
            logo.setAttribute('tabindex', '0');
            logo.setAttribute('role', 'button');
            logo.setAttribute('aria-label', `Afficher ${name}`);

            const activateTool = () => {
                toolLogos.forEach(item => item.classList.remove('active-tool'));
                logo.classList.add('active-tool');
                toolPanel.innerHTML = `<span>Outil selectionne</span><strong>${name}</strong>`;
            };

            logo.addEventListener('mouseenter', activateTool);
            logo.addEventListener('focus', activateTool);
            logo.addEventListener('click', activateTool);
        });
    }

    // 3D tilt effect on glass cards (only on capable devices)
    if (!isLowPerf) {
        const glassCards = document.querySelectorAll(
            '.fondsarriere, .competence-card, .presentation-box, .timeline-item .timeline-content, #projets .projet-item, .logiciels-section'
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

    // Copy contact details directly from the contact cards
    const copyFeedback = document.createElement('div');
    copyFeedback.className = 'copy-feedback';
    copyFeedback.setAttribute('role', 'status');
    copyFeedback.setAttribute('aria-live', 'polite');
    document.body.appendChild(copyFeedback);
    let copyTimeout;

    const showCopyFeedback = (message) => {
        window.clearTimeout(copyTimeout);
        copyFeedback.textContent = message;
        copyFeedback.classList.add('show');
        copyTimeout = window.setTimeout(() => copyFeedback.classList.remove('show'), 1200);
    };

    document.querySelectorAll('#contact .contact-card').forEach(card => {
        const values = Array.from(card.querySelectorAll('.contact-info h2'))
            .map(item => item.textContent.trim())
            .filter(Boolean);
        if (!values.length) return;

        const copyButton = document.createElement('button');
        copyButton.type = 'button';
        copyButton.className = 'contact-copy';
        copyButton.textContent = 'Copier';
        copyButton.setAttribute('aria-label', `Copier ${values.join(', ')}`);
        card.appendChild(copyButton);

        copyButton.addEventListener('click', async (event) => {
            event.stopPropagation();
            const text = values.join('\n');
            try {
                await navigator.clipboard.writeText(text);
                showCopyFeedback('Information copiee');
            } catch (error) {
                showCopyFeedback('Copie indisponible');
            }
        });
    });
});
