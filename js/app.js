
  /* ── Navbar scroll ── */
  const navbar = document.getElementById('navbar');
  const backTop = document.getElementById('backTop');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 60);
    backTop.classList.toggle('show', y > 400);
  });

  /* ── Mobile menu ── */
  function toggleMenu() {
    const ham = document.getElementById('hamburger');
    const menu = document.getElementById('mobileMenu');
    ham.classList.toggle('open');
    menu.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  }

  /* ── Scroll reveal ── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  revealEls.forEach(el => observer.observe(el));

  /* ── Counter animation ── */
  function animateCounter(el, target, duration = 1800) {
    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + (target === 4 ? '' : target > 10 ? '+' : '+');
    };
    requestAnimationFrame(step);
  }

  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const nums = e.target.querySelectorAll('[data-target]');
        nums.forEach(el => {
          const target = parseInt(el.getAttribute('data-target'));
          animateCounter(el, target);
        });
        counterObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) counterObs.observe(heroStats);

  /* ── Calculadora IVA ── */
  function formatCOP(val) {
    return '$ ' + Math.round(val).toLocaleString('es-CO');
  }

  function calcularIVA() {
    const base = parseFloat(document.getElementById('ivaBase').value);
    const tarifa = parseFloat(document.getElementById('ivaTarifa').value);
    if (isNaN(base) || base <= 0) {
      document.getElementById('ivaBase').classList.add('error');
      setTimeout(() => document.getElementById('ivaBase').classList.remove('error'), 2000);
      return;
    }
    const iva = base * tarifa;
    const total = base + iva;
    document.getElementById('ivaBaseOut').textContent = formatCOP(base);
    document.getElementById('ivaMontoOut').textContent = formatCOP(iva);
    document.getElementById('ivaTotalOut').textContent = formatCOP(total);
    const res = document.getElementById('ivaResult');
    res.classList.add('show');
  }

  /* ── Calculadora Retención ── */
  function calcularRetencion() {
    const base = parseFloat(document.getElementById('retBase').value);
    const tarifa = parseFloat(document.getElementById('retConcepto').value);
    if (isNaN(base) || base <= 0) {
      document.getElementById('retBase').classList.add('error');
      setTimeout(() => document.getElementById('retBase').classList.remove('error'), 2000);
      return;
    }
    const retencion = base * tarifa;
    const neto = base - retencion;
    document.getElementById('retBaseOut').textContent = formatCOP(base);
    document.getElementById('retMontoOut').textContent = formatCOP(retencion);
    document.getElementById('retNetOut').textContent = formatCOP(neto);
    const res = document.getElementById('retResult');
    res.classList.add('show');
  }

  /* ── Formulario de contacto ── */
  function validarCampo(id, errId, validFn) {
    const el = document.getElementById(id);
    const err = document.getElementById(errId);
    const valid = validFn(el.value);
    el.classList.toggle('error', !valid);
    el.classList.toggle('success', valid);
    err.classList.toggle('show', !valid);
    return valid;
  }

  function enviarFormulario() {
    const nombreOk   = validarCampo('nombre',   'nombreErr',  v => v.trim().length >= 2);
    const emailOk    = validarCampo('email',     'emailErr',   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
    const servicioOk = validarCampo('servicio',  'servicioErr',v => v !== '');
    const mensajeOk  = validarCampo('mensaje',   'mensajeErr', v => v.trim().length >= 10);

    if (!nombreOk || !emailOk || !servicioOk || !mensajeOk) return;

    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.innerHTML = '<span>Enviando...</span>';

    // Simulated async submit
    setTimeout(() => {
      document.getElementById('formContent').style.display = 'none';
      document.getElementById('successMsg').classList.add('show');
    }, 1500);
  }

  /* ── Real-time form validation ── */
  ['nombre', 'email', 'servicio', 'mensaje'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => {
      if (el.classList.contains('error')) {
        el.classList.remove('error');
        document.getElementById(id + 'Err').classList.remove('show');
      }
    });
  });

  /* ── Smooth scroll for nav links ── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Active nav link ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinksAll.forEach(a => {
      a.style.color = a.getAttribute('href') === '#' + current
        ? 'var(--white)'
        : 'rgba(255,255,255,0.75)';
    });
  });

  /* ── Enter key on calculators ── */
  document.getElementById('ivaBase').addEventListener('keydown', e => { if (e.key === 'Enter') calcularIVA(); });
  document.getElementById('retBase').addEventListener('keydown', e => { if (e.key === 'Enter') calcularRetencion(); });