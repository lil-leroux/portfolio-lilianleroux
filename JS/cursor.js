const updateProperties = (elem, state) => {
  elem.style.setProperty('--x', `${state.x}px`)
  elem.style.setProperty('--y', `${state.y}px`)
  elem.style.setProperty('--width', `${state.width}px`)
  elem.style.setProperty('--height', `${state.height}px`)
  elem.style.setProperty('--radius', state.radius)
  elem.style.setProperty('--scale', state.scale)
}

document.querySelectorAll('.cursor').forEach(cursor => {
  let onElement

  const createState = e => {
    const defaultState = {
      x: e.clientX,
      y: e.clientY,
      width: 40,
      height: 40,
      radius: '50%'
    }

    const computedState = {}

    if (onElement != null) {
      const { top, left, width, height } = onElement.getBoundingClientRect()
      const radius = window.getComputedStyle(onElement).borderTopLeftRadius

      computedState.x = left + width / 2
      computedState.y = top + height / 2
      computedState.width = width
      computedState.height = height
      computedState.radius = radius
    }

    return {
      ...defaultState,
      ...computedState
    }
  }

  const updateCursor = e => {
    const state = createState(e)
    updateProperties(cursor, state)
  }

  document.addEventListener('mousemove', updateCursor)
  document.addEventListener('scroll', () => {
    if (onElement) {
      const rect = onElement.getBoundingClientRect()
      const state = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        width: rect.width,
        height: rect.height,
        radius: window.getComputedStyle(onElement).borderTopLeftRadius,
        scale: cursor.style.getPropertyValue('--scale')
      }
      updateProperties(cursor, state)
    } else {
      const state = {
        x: parseFloat(cursor.style.getPropertyValue('--x')),
        y: parseFloat(cursor.style.getPropertyValue('--y')),
        width: 40,
        height: 40,
        radius: '50%',
        scale: cursor.style.getPropertyValue('--scale')
      }
      updateProperties(cursor, state)
    }
  })

  document.querySelectorAll('a, button,.mousey,.contact-item,.projet-item').forEach(elem => {
    elem.addEventListener('mouseenter', () => (onElement = elem))
    elem.addEventListener('mouseleave', () => (onElement = undefined))
  })

  if (navigator.deviceMemory && navigator.deviceMemory < 4 || window.matchMedia("(max-width: 768px)").matches) {
    document.querySelectorAll('.cursor').forEach(cursor => cursor.style.display = 'none');
    return; // Stoppe l'exécution du script
  }
})
