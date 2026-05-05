document.querySelectorAll('.cursor').forEach(cursor => {
  if (navigator.deviceMemory && navigator.deviceMemory < 4 || window.matchMedia("(max-width: 768px)").matches) {
    cursor.style.display = 'none';
    return;
  }

  let hoverElem = null;

  const update = (x, y) => {
    cursor.style.setProperty('--x', `${x}px`);
    cursor.style.setProperty('--y', `${y}px`);
    cursor.style.setProperty('--scale', '1');

    if (hoverElem) {
      const cs = window.getComputedStyle(hoverElem);
      const r = hoverElem.getBoundingClientRect();
      cursor.style.setProperty('--width', `${Math.min(r.width + 14, 180)}px`);
      cursor.style.setProperty('--height', `${Math.min(r.height + 14, 72)}px`);
      cursor.style.setProperty('--radius', cs.borderRadius || cs.borderTopLeftRadius || '10px');
    } else {
      cursor.style.setProperty('--width', '40px');
      cursor.style.setProperty('--height', '40px');
      cursor.style.setProperty('--radius', '50%');
    }
  };

  document.addEventListener('mousemove', e => {
    update(e.clientX, e.clientY);
  });

  const interactiveSelector = 'a, button, .mousey, .contact-item, .projet-item, .filter-button, .timeline-content, .timeline-control, .competence-card, .logiciels-logos img';

  document.querySelectorAll(interactiveSelector).forEach(elem => {
    elem.addEventListener('mouseenter', () => { hoverElem = elem; });
    elem.addEventListener('mouseleave', () => { hoverElem = null; });
  });

  document.addEventListener('mouseover', e => {
    const target = e.target.closest(interactiveSelector);
    if (target) hoverElem = target;
  });

  document.addEventListener('mouseout', e => {
    if (hoverElem && !hoverElem.contains(e.relatedTarget)) hoverElem = null;
  });
});
