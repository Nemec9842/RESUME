/* ==========================================================================
   ИНТЕРАКТИВНОСТЬ
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  
  // --- Мобильное меню ---
  const burgerBtn = document.getElementById('burger-btn');
  const closeMenuBtn = document.getElementById('close-menu');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function toggleMenu() {
    const isExpanded = burgerBtn.getAttribute('aria-expanded') === 'true';
    burgerBtn.setAttribute('aria-expanded', !isExpanded);
    mobileMenu.classList.toggle('active');
    document.body.classList.toggle('overflow-hidden');
  }

  if (burgerBtn) {
    burgerBtn.addEventListener('click', toggleMenu);
    closeMenuBtn.addEventListener('click', toggleMenu);
    mobileLinks.forEach(link => link.addEventListener('click', toggleMenu));
  }

  // --- Intersection Observer для анимаций ---
  const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));

  // --- Маска телефона ---
  const phoneInput = document.getElementById('phone');
  function maskPhone(event) {
    let matrix = "+7 (___) ___-__-__",
        i = 0,
        def = matrix.replace(/\D/g, ""),
        val = event.target.value.replace(/\D/g, "");
    
    if (def.length >= val.length) val = def;
    
    event.target.value = matrix.replace(/./g, function(a) {
      return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? "" : a;
    });
    
    if (event.type === "blur" && val.length < 2) {
      event.target.value = "";
    }
  }
  
  if (phoneInput) {
    phoneInput.addEventListener("input", maskPhone, false);
    phoneInput.addEventListener("focus", maskPhone, false);
    phoneInput.addEventListener("blur", maskPhone, false);
  }

  // --- Валидация формы ---
  const form = document.getElementById('booking-form');
  if (form) {
    const successMessage = document.getElementById('success-message');
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      let isValid = true;

      document.querySelectorAll('.form-error').forEach(el => el.classList.remove('visible'));
      document.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(el => el.classList.remove('error'));

      const name = document.getElementById('name');
      if (name.value.trim().length < 2) {
        document.getElementById('name-error').classList.add('visible');
        name.classList.add('error');
        isValid = false;
      }

      const phone = document.getElementById('phone');
      if (phone.value.length < 18) {
        document.getElementById('phone-error').classList.add('visible');
        phone.classList.add('error');
        isValid = false;
      }

      const consent = document.getElementById('consent');
      if (!consent.checked) {
        document.getElementById('consent-error').classList.add('visible');
        isValid = false;
      }

      if (isValid) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка...';
        
        setTimeout(() => {
          console.log('Form Data:', {
            name: name.value,
            phone: phone.value,
            service: document.getElementById('service').value,
            comment: document.getElementById('comment').value
          });
          
          form.reset();
          submitBtn.disabled = false;
          submitBtn.textContent = 'Записаться на приём';
          successMessage.classList.add('visible');
          
          setTimeout(() => successMessage.classList.remove('visible'), 5000);
        }, 1000);
      }
    });
  }

  // --- Слайдер отзывов ---
  const track = document.getElementById('reviews-track');
  const container = document.getElementById('reviews-container');
  
  if (track && container) {
    let scrollAmount = 0;
    let slideInterval;
    const isMobile = window.innerWidth < 768;
    const gap = 24;
    const cardWidth = track.children[0].offsetWidth + gap;
    const maxScroll = track.scrollWidth - container.offsetWidth;

    function startAutoScroll() {
      slideInterval = setInterval(() => {
        scrollAmount += cardWidth;
        if (scrollAmount >= maxScroll) {
          scrollAmount = 0;
          track.style.transition = 'none';
          track.style.transform = `translateX(0)`;
          track.offsetHeight;
          track.style.transition = 'transform 0.5s ease';
        } else {
          track.style.transform = `translateX(-${scrollAmount}px)`;
        }
      }, 4000);
    }

    function stopAutoScroll() {
      clearInterval(slideInterval);
    }

    if (maxScroll > 0) {
      startAutoScroll();
      container.addEventListener('mouseenter', stopAutoScroll);
      container.addEventListener('mouseleave', startAutoScroll);
    }
  }

  // --- Скрытие fallback карты ---
  const iframe = document.querySelector('iframe');
  if (iframe) {
    iframe.addEventListener('load', () => {
      const fallback = document.getElementById('map-fallback');
      if (fallback) fallback.style.display = 'none';
    });
  }
});