// ===================================================
// ЗАКУЛИСЬЕ — интерактив сайта
// ===================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Мобильное меню ---------- */
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileNav = document.getElementById('mobileNav');

  if (burgerBtn && mobileNav) {
    burgerBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      burgerBtn.classList.toggle('active');
    });
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        burgerBtn.classList.remove('active');
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('in'), i * 50);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- Счётчики статистики ---------- */
  const statNums = document.querySelectorAll('.stat-num');
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const isDecimal = el.dataset.count.includes('.');
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = isDecimal ? value.toFixed(1) : Math.round(value).toLocaleString('ru-RU');
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString('ru-RU');
    }
    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window && statNums.length) {
    const statIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statNums.forEach(el => statIo.observe(el));
  }

  /* ---------- Форма брони -> WhatsApp ---------- */
  const BAR_WHATSAPP = '79181008117'; // без плюса и пробелов, формат wa.me

  const reserveForm = document.getElementById('reserveForm');
  if (reserveForm) {
    reserveForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = new FormData(reserveForm);
      const name = (data.get('name') || '').trim();
      const phone = (data.get('phone') || '').trim();
      const date = data.get('date') || '';
      const time = data.get('time') || '';
      const guests = data.get('guests') || '';
      const comment = (data.get('comment') || '').trim();

      const dateFormatted = date
        ? new Date(date + 'T00:00:00').toLocaleDateString('ru-RU', { day: '2-digit', month: 'long' })
        : '';

      let message = `Здравствуйте! Хочу забронировать стол в Закулисье.\n`;
      message += `Имя: ${name}\n`;
      message += `Телефон: ${phone}\n`;
      if (dateFormatted) message += `Дата: ${dateFormatted}\n`;
      if (time) message += `Время: ${time}\n`;
      if (guests) message += `Гостей: ${guests}\n`;
      if (comment) message += `Комментарий: ${comment}\n`;

      const url = `https://wa.me/${BAR_WHATSAPP}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank', 'noopener');
    });
  }

  /* ---------- Скрытие / появление хедера при скролле вниз ---------- */
  const header = document.getElementById('siteHeader');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (header) {
      header.style.transition = 'transform .3s ease, background .3s ease';
      header.style.transform = (current > 140 && current > lastScroll) ? 'translateY(-100%)' : 'translateY(0)';
      header.style.background = current > 40 ? 'rgba(20,16,15,.94)' : 'rgba(20,16,15,.85)';
    }
    lastScroll = current;
  }, { passive: true });

});
