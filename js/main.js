(() => {
  'use strict';

  const nav = document.getElementById('mainNav');
  const backToTop = document.getElementById('backToTop');
  const navCollapse = document.getElementById('navbarMenu');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleScroll = () => {
    const scrolled = window.scrollY > 24;
    nav?.classList.toggle('scrolled', scrolled);
    backToTop?.classList.toggle('show', window.scrollY > 550);
  };
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });

  document.querySelectorAll('#navbarMenu a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 992 && navCollapse?.classList.contains('show')) {
        bootstrap.Collapse.getOrCreateInstance(navCollapse).hide();
      }
    });
  });

  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' }));

  const revealItems = document.querySelectorAll('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(item => item.classList.add('visible'));
  } else {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const delay = Number(entry.target.dataset.delay || 0);
        window.setTimeout(() => entry.target.classList.add('visible'), delay);
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => revealObserver.observe(item));
  }

  const counters = document.querySelectorAll('[data-count]');
  const animateCounter = element => {
    const target = Number(element.dataset.count);
    const duration = 1000;
    const start = performance.now();
    const frame = now => {
      const progress = Math.min((now - start) / duration, 1);
      element.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };
  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      });
    }, { threshold: .7 });
    counters.forEach(counter => counterObserver.observe(counter));
  } else {
    counters.forEach(counter => { counter.textContent = counter.dataset.count; });
  }

  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('#navbarMenu .nav-link')];
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { rootMargin: '-35% 0px -58%', threshold: 0 });
    sections.forEach(section => sectionObserver.observe(section));
  }

  const chatLauncher = document.getElementById('chatLauncher');
  const chatPanel = document.getElementById('chatPanel');
  const chatClose = document.getElementById('chatClose');
  const chatBody = document.getElementById('chatBody');

  const answers = {
    what: 'DRIP AI — datchiklar, SX1278 LoRa va AI yordamida sug‘orishni kuzatish hamda boshqarishga mo‘ljallangan AgriTech platforma.',
    work: 'Datchiklar ma’lumotni ESP32 ga beradi, SX1278 LoRa uni Gateway orqali MQTT serveriga uzatadi. Platforma ma’lumotni ko‘rsatadi va boshqaruv buyruqlarini Rele, Nasos yoki Klapanga yuboradi.',
    offline: 'Mahalliy boshqaruv ssenariylari internetsiz ishlashi mumkin. Masofaviy monitoring va cloud sinxronlash internet tiklangach davom etadi.',
    sensors: 'Tuproq namligi, havo harorati va namligi, pH, suv sathi hamda suv sarfi datchiklari ishlatiladi.',
    lora: 'SX1278 LoRa kam quvvat bilan uzoq masofaga ma’lumot uzatgani uchun katta dala va bog‘larda qulay.',
    ai: 'AI qatlami datchik ma’lumotlarini tahlil qilib tavsiya va avtomatik boshqaruv qarorlarini shakllantirishga mo‘ljallangan. Hozir bu imkoniyat R&D bosqichida.',
    saving: 'Tizim 60% gacha suvni tejash imkoniyatini maqsad qiladi. Aniq natija dala, ekin, iqlim va sug‘orish sharoitiga bog‘liq.',
    live: 'Ishlayotgan platformani www.drip-ai.uz manzilida ko‘rishingiz mumkin.'
  };

  const toggleChat = open => {
    chatPanel?.classList.toggle('open', open);
    chatPanel?.setAttribute('aria-hidden', String(!open));
    chatLauncher?.setAttribute('aria-expanded', String(open));
    if (open) chatClose?.focus();
  };
  chatLauncher?.addEventListener('click', () => toggleChat(!chatPanel?.classList.contains('open')));
  chatClose?.addEventListener('click', () => { toggleChat(false); chatLauncher?.focus(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') toggleChat(false); });

  document.getElementById('quickQuestions')?.addEventListener('click', event => {
    const button = event.target.closest('button[data-question]');
    if (!button || !chatBody) return;
    const userMessage = document.createElement('div');
    userMessage.className = 'user-message';
    userMessage.textContent = button.textContent;
    chatBody.appendChild(userMessage);
    const botMessage = document.createElement('div');
    botMessage.className = 'bot-message';
    botMessage.textContent = answers[button.dataset.question];
    window.setTimeout(() => {
      chatBody.appendChild(botMessage);
      chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: reducedMotion ? 'auto' : 'smooth' });
    }, 250);
  });
})();
