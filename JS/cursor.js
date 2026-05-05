document.querySelectorAll('.cursor').forEach(cursor => {
  const isLowPerfCursor = window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    (navigator.deviceMemory && navigator.deviceMemory <= 6) ||
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
    (navigator.connection && navigator.connection.saveData) ||
    window.matchMedia("(max-width: 768px)").matches;

  if (isLowPerfCursor) {
    cursor.style.display = 'none';
    return;
  }

  let hoverElem = null;
  let hoverRect = null;

  const prioritySelector = [
    '.competence-card',
    '.contact-item',
    '.timeline-content',
    //'.fondsarriere',
    '.timeline-control',
    '.filter-button',
    'button',
    'a',
    '.mousey'
  ].join(', ');

  const excludedSelector = [
    '.fondsarriere',
    '#projets .projet-item',
    '#contact .contact-form-panel',
    '.logiciels-section',
    '.parcours-interactive',
    '#presentation .presentation-box',
    '#presentation .fondsarrierepresentation'
  ].join(', ');

  const resolveHoverElement = (target) => {
    if (!target || !target.closest) return null;
    if (target.closest(excludedSelector)) return null;

    for (const selector of [
      '.competence-card',
      '.contact-item',
      '.timeline-content',
      //'.fondsarriere'
    ]) {
      const parent = target.closest(selector);
      if (parent) return parent;
    }

    return target.closest(prioritySelector);
  };

  const update = (x, y) => {
    cursor.style.setProperty('--x', `${x}px`);
    cursor.style.setProperty('--y', `${y}px`);
    cursor.style.setProperty('--scale', '1');

    if (hoverElem) {
      const cs = window.getComputedStyle(hoverElem);
      const r = hoverRect || hoverElem.getBoundingClientRect();
      cursor.style.setProperty('--width', `${Math.min(r.width + 18, window.innerWidth - 24)}px`);
      cursor.style.setProperty('--height', `${Math.min(r.height + 18, window.innerHeight - 24)}px`);
      cursor.style.setProperty('--radius', cs.borderRadius || cs.borderTopLeftRadius || '10px');
    } else {
      cursor.style.setProperty('--width', '40px');
      cursor.style.setProperty('--height', '40px');
      cursor.style.setProperty('--radius', '50%');
    }
  };

  let mouseX = 0;
  let mouseY = 0;
  let cursorTicking = false;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursorTicking) return;
    cursorTicking = true;
    requestAnimationFrame(() => {
      update(mouseX, mouseY);
      cursorTicking = false;
    });
  }, { passive: true });

  const setHover = (elem) => {
    if (!elem || elem === hoverElem) return;
    hoverElem = elem;
    const previousTransform = elem.style.transform;
    elem.style.transform = '';
    hoverRect = elem.getBoundingClientRect();
    elem.style.transform = previousTransform;
  };

  const clearHover = () => {
    hoverElem = null;
    hoverRect = null;
  };

  document.querySelectorAll(prioritySelector).forEach(elem => {
    elem.addEventListener('mouseenter', () => { setHover(elem); });
    elem.addEventListener('mouseleave', clearHover);
  });

  document.addEventListener('mouseover', e => {
    const target = resolveHoverElement(e.target);
    if (target) {
      setHover(target);
    } else if (e.target.closest && e.target.closest(excludedSelector)) {
      clearHover();
    }
  });

  document.addEventListener('mouseout', e => {
    if (hoverElem && !hoverElem.contains(e.relatedTarget)) clearHover();
  });

  window.addEventListener('scroll', () => {
    if (hoverElem) {
      const previousTransform = hoverElem.style.transform;
      hoverElem.style.transform = '';
      hoverRect = hoverElem.getBoundingClientRect();
      hoverElem.style.transform = previousTransform;
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (hoverElem) {
      const previousTransform = hoverElem.style.transform;
      hoverElem.style.transform = '';
      hoverRect = hoverElem.getBoundingClientRect();
      hoverElem.style.transform = previousTransform;
    }
  });
});
