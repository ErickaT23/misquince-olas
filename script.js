// script.js
// Lógica de invitación basada en el array estático `guests` definido en loads.js

let invitacionAbierta = false;
let bubbleIntervalId = null;
const MOTION_PROFILE = 'intenso-showpiece';
// Cambia a false para volver rapido al estado anterior.
const UX_REFINEMENT_ENABLED = true;
const LOW_POWER_DEVICE = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

// Al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.setAttribute('data-motion-profile', MOTION_PROFILE);
  if (UX_REFINEMENT_ENABLED) {
    document.documentElement.setAttribute('data-ux-refined', 'true');
  }
  iniciarContador();
  cargarDatosInvitado();
  prepararAnimacionesDinamicas();
  initFadeInObserver();
  initParallaxDecorativo();
  initFeedbackInteracciones();
  initVisibilityBubbleHandling();
  document.getElementById('seal')?.addEventListener('click', abrirInvitacion, { once: true });
});
  
  // 1. Función para abrir la invitación y reproducir música
// Lógica de apertura: la invitación solo se abre con click en el sello.
function abrirInvitacion() {
  if (invitacionAbierta) return;

  const envelope = document.getElementById('envelope');
  const invitacion = document.getElementById('invitacion');
  if (!envelope || !invitacion) return;

  invitacionAbierta = true;
  envelope.classList.add('open');

  // Activación de burbujas después del click en el sello.
  activarBurbujas();

  setTimeout(() => {
    envelope.style.display = 'none';
    invitacion.style.display = 'block';

    const audio = document.getElementById('musica');
    if (audio) {
      const playIntent = audio.play();
      if (playIntent && typeof playIntent.catch === 'function') {
        playIntent.catch(() => {});
      }
    }
  }, 1000);
}
  
  // 2. Contador regresivo hasta la fecha del evento
function iniciarContador() {
  const fechaEvento = new Date('August 02, 2026 00:00:00').getTime();
  setInterval(() => {
    const ahora = Date.now();
    const diff = fechaEvento - ahora;
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('dias').innerText = dias;
    document.getElementById('horas').innerText = horas;
    document.getElementById('minutos').innerText = minutos;
    document.getElementById('segundos').innerText = segundos;
  }, 1000);
}
  
// 3. Cargar datos del invitado por ?id= sin abrir automáticamente.
function cargarDatosInvitado() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) return;

  const invitado = window.guests?.find((g) => g.id === id);
  if (!invitado) {
    console.warn(`Invitado con id=${id} no encontrado`);
    return;
  }

  const invitText = invitado.passes > 1
    ? `¡${invitado.name}, estan invitados!`
    : `¡${invitado.name}, estas invitado!`;

  document.getElementById('nombreInvitado').textContent = invitText;
  document.getElementById('nombreInvitado').dataset.guestName = invitado.name;
  document.getElementById('cantidadPases').textContent =
    `${invitado.passes} ${invitado.passes === 1 ? 'pase' : 'pases'}`;
}
  
// Nuevas animaciones de entrada y scroll en bloques de contenido.
function initFadeInObserver() {
  const elems = document.querySelectorAll('.fade-in-element');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    });
  }, UX_REFINEMENT_ENABLED
    ? { threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
    : { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

  elems.forEach((el) => observer.observe(el));
}

function prepararAnimacionesDinamicas() {
  const titleElements = document.querySelectorAll(
    '.section h1, .section h2, .section h3, .section-b h1, .section-b h2, .section-b h3, .section-countdown h1, .section-countdown h2, .section-quote h1'
  );

  const bodyElements = document.querySelectorAll(
    '.section p, .section span, .section-b p, .section-countdown p, .section-playlist p'
  );

  if (!UX_REFINEMENT_ENABLED) {
    const legacyTextElements = document.querySelectorAll(
      '.section h1, .section h2, .section h3, .section p, .section span, .section-b h1, .section-b h2, .section-b h3, .section-b p, .section-countdown h1, .section-countdown h2, .section-countdown p, .section-playlist p, .section-quote h1'
    );

    legacyTextElements.forEach((el, index) => {
      el.classList.add('soft-float', 'text-entrance');
      el.style.setProperty('--text-reveal-delay', `${(index % 6) * 0.07}s`);
    });
  } else {
    titleElements.forEach((el, index) => {
      el.classList.add('soft-float', 'text-entrance');
      el.style.setProperty('--text-reveal-delay', `${(index % 5) * 0.06}s`);
    });

    bodyElements.forEach((el, index) => {
      el.classList.add('text-entrance');
      el.style.setProperty('--text-reveal-delay', `${0.1 + (index % 4) * 0.05}s`);
    });
  }

  document.querySelectorAll('button, .section-calendar').forEach((el) => {
    el.classList.add('luxury-interactive');
  });

  document.querySelectorAll('.section-cerezo, .section-cerezo0').forEach((el) => {
    el.classList.add('decorative-parallax', 'fade-in-element');
  });
}

function initParallaxDecorativo() {
  const decorativos = document.querySelectorAll('.decorative-parallax');
  if (!decorativos.length) return;

  let ticking = false;

  const updateParallax = () => {
    const vh = window.innerHeight || 1;

    decorativos.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const progress = (rect.top + rect.height * 0.5 - vh * 0.5) / vh;
      const shift = Math.max(-18, Math.min(18, -progress * 20));
      el.style.setProperty('--decorative-shift', `${shift.toFixed(2)}px`);
    });

    ticking = false;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateParallax);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  updateParallax();
}

function activarBurbujas() {
  if (bubbleIntervalId) return;

  const layer = crearCapaBurbujas();
  if (!layer) return;

  layer.classList.add('active');

  const isMobile = window.matchMedia('(max-width: 767px)').matches;
  const config = getBubbleConfig(isMobile);

  for (let i = 0; i < config.burst; i += 1) {
    setTimeout(() => crearBurbuja(layer, config.maxBubbles), i * config.burstStep);
  }

  bubbleIntervalId = window.setInterval(() => {
    crearBurbuja(layer, config.maxBubbles);
  }, config.interval);
}

function detenerBurbujas() {
  if (!bubbleIntervalId) return;
  clearInterval(bubbleIntervalId);
  bubbleIntervalId = null;
}

function initVisibilityBubbleHandling() {
  if (!UX_REFINEMENT_ENABLED) return;

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      detenerBurbujas();
      return;
    }

    if (invitacionAbierta) {
      activarBurbujas();
    }
  });
}

function crearCapaBurbujas() {
  let layer = document.getElementById('bubble-layer');
  if (layer) return layer;

  layer = document.createElement('div');
  layer.id = 'bubble-layer';
  document.body.appendChild(layer);
  return layer;
}

function crearBurbuja(layer, maxBubbles) {
  if (!layer) return;

  if (layer.children.length >= maxBubbles) {
    layer.firstElementChild?.remove();
  }

  const bubble = document.createElement('span');
  bubble.className = 'bubble';

  const size = randomInRange(9, 38);
  const left = randomInRange(2, 98);
  const isShowpiece = MOTION_PROFILE === 'intenso-showpiece';
  const duration = isShowpiece ? randomInRange(7.4, 14.8) : randomInRange(8.2, 16.5);
  const drift = isShowpiece ? randomInRange(-58, 58) : randomInRange(-46, 46);
  const opacity = isShowpiece ? randomInRange(0.26, 0.62) : randomInRange(0.22, 0.52);
  const hue = isShowpiece ? randomInRange(188, 228) : randomInRange(190, 224);
  const glowDuration = isShowpiece ? randomInRange(3.1, 5.8) : randomInRange(3.8, 6.6);
  const tint = isShowpiece ? randomInRange(1.08, 1.48) : randomInRange(0.8, 1.25);

  bubble.style.setProperty('--bubble-size', `${size.toFixed(1)}px`);
  bubble.style.setProperty('--bubble-left', `${left.toFixed(2)}%`);
  bubble.style.setProperty('--bubble-duration', `${duration.toFixed(2)}s`);
  bubble.style.setProperty('--bubble-drift', `${drift.toFixed(2)}px`);
  bubble.style.setProperty('--bubble-opacity', opacity.toFixed(2));
  bubble.style.setProperty('--bubble-hue', hue.toFixed(1));
  bubble.style.setProperty('--bubble-glow-duration', `${glowDuration.toFixed(2)}s`);
  bubble.style.setProperty('--bubble-tint', tint.toFixed(2));

  bubble.addEventListener('animationend', () => {
    bubble.remove();
  });

  layer.appendChild(bubble);
}

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

function getBubbleConfig(isMobile) {
  if (UX_REFINEMENT_ENABLED && LOW_POWER_DEVICE) {
    return isMobile
      ? { interval: 760, maxBubbles: 20, burst: 8, burstStep: 120 }
      : { interval: 520, maxBubbles: 34, burst: 12, burstStep: 100 };
  }

  if (MOTION_PROFILE === 'intenso-showpiece') {
    return isMobile
      ? { interval: 480, maxBubbles: 36, burst: 14, burstStep: 85 }
      : { interval: 280, maxBubbles: 72, burst: 24, burstStep: 72 };
  }

  if (MOTION_PROFILE === 'intenso-premium') {
    return isMobile
      ? { interval: 620, maxBubbles: 30, burst: 11, burstStep: 105 }
      : { interval: 360, maxBubbles: 58, burst: 18, burstStep: 90 };
  }

  return isMobile
    ? { interval: 900, maxBubbles: 22, burst: 8, burstStep: 150 }
    : { interval: 520, maxBubbles: 44, burst: 14, burstStep: 120 };
}

function initFeedbackInteracciones() {
  if (!UX_REFINEMENT_ENABLED) return;

  const seal = document.getElementById('seal');
  seal?.addEventListener('pointerdown', () => {
    seal.classList.add('is-pressed');
  });
  seal?.addEventListener('pointerup', () => {
    window.setTimeout(() => seal.classList.remove('is-pressed'), 120);
  });

  document.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.classList.add('is-busy');
      window.setTimeout(() => btn.classList.remove('is-busy'), 480);
    });
  });
}
  
  // (Opcionales) Puedes mantener funciones de lightbox, mapas y confirmación si las necesitas:
  
  function changePhoto(element) {
    const modal = document.getElementById('photo-modal');
    const img   = document.getElementById('main-photo-modal');
    if (img) img.src = element.src;
    if (modal) modal.style.display = 'flex';
  }
  function closeModal(event) {
    if (!event || event.target.id === 'photo-modal' || event.target.classList.contains('close')) {
      document.getElementById('photo-modal').style.display = 'none';
    }
  }
  
  function confirmarAsistencia() {
    const nombreElem = document.getElementById('nombreInvitado');
    const pasesElem  = document.getElementById('cantidadPases');
    const nombre = nombreElem?.dataset.guestName || nombreElem?.innerText || '';
    const pasesTexto = pasesElem?.innerText || '';
    const pasesNumero = pasesTexto.match(/\d+/)?.[0] || pasesTexto;
    const etiquetaPases = pasesNumero === '1' ? 'pase' : 'pases';
    const msg = `Hola, soy ${nombre} y confirmo mi asistencia con ${pasesNumero} ${etiquetaPases} para la fiesta de quince años.`;
    window.open(`https://api.whatsapp.com/send?phone=50236011737&text=${encodeURIComponent(msg)}`, '_blank');
  }
  
  function elegirAplicacion() {
    window.open('https://maps.app.goo.gl/ngvZ8P1KsVggQqAJ6','_blank');
    setTimeout(() => window.open('https://www.waze.com/en/live-map/directions/iglesia-yurrita-ruta-6-zona-4,-guatemala?place=w.176619666.1766065590.408410','_blank'),1000);
  }
  function elegirAplicacionOtraDireccion() {
    window.open('https://maps.app.goo.gl/x1VEyzHxdwP7FMkX6','_blank');
    setTimeout(() => window.open('https://ul.waze.com/ul?venue_id=176619666.1766065588.2060019','_blank'),1000);
  }
  
