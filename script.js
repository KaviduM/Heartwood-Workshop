

document.addEventListener('DOMContentLoaded', function () {

/* 1. MOBILE NAVIGATION */
  var navToggle = document.querySelector('.nav-toggle');
  var navMenu = document.querySelector('.nav-menu');
  var navScrim = document.querySelector('.nav-scrim');

  function openNav() {
    navMenu.classList.add('is-open');
    navScrim.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    navMenu.classList.remove('is-open');
    navScrim.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      var isOpen = navMenu.classList.contains('is-open');
      isOpen ? closeNav() : openNav();
    });

    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    if (navScrim) navScrim.addEventListener('click', closeNav);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 900) closeNav();
    });
  }

  /* 2. ACTIVE NAVGATION */
  var currentPage = (window.location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav-menu a').forEach(function (link) {
    var linkPage = link.getAttribute('href');
    if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    }
  });

  var siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    window.addEventListener('scroll', function () {
      siteHeader.classList.toggle('is-scrolled', window.scrollY > 12);
    }, { passive: true });
  }

  /* SCROLL REVEAL ANIMATIONS */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* BACK TO TOP BUTTON */
  var backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.classList.toggle('is-visible', window.scrollY > 500);
    }, { passive: true });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* DESIGNS PAGE */
  var filterBar = document.querySelector('.filter-bar');
  if (filterBar) {
    var filterButtons = filterBar.querySelectorAll('.filter-btn');
    var galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterButtons.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');

        var category = btn.getAttribute('data-filter');

        galleryItems.forEach(function (item) {
          var matches = category === 'all' || item.getAttribute('data-category') === category;
          item.classList.toggle('is-hidden', !matches);
        });
      });
    });
  }

/* HOME PAGE*/
  (function initProjectCarousel() {
    var carousel = document.getElementById('projects-carousel');
    if (!carousel) return; 

    var viewport = carousel.querySelector('.carousel-viewport');
    var track = carousel.querySelector('.carousel-track');
    var allSlides = Array.prototype.slice.call(track.children); // Clone කිරීම් ඉවත් කරන ලදී
    var prevBtn = carousel.querySelector('.carousel-arrow--prev');
    var nextBtn = carousel.querySelector('.carousel-arrow--next');
    var dotsWrap = document.getElementById('projects-dots');

    var currentIndex = 0; 

    allSlides.forEach(function (slide, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Go to photo ' + (i + 1));
      if (i === 0) dot.classList.add('is-active');
      
      dot.addEventListener('click', function () {
        goToSlide(i, true); 
      });
      dotsWrap.appendChild(dot);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    function setActiveDot(index) {
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    function getOffset(index) {
      var target = allSlides[index];
      if (!target) return 0;
      return target.offsetLeft - (viewport.clientWidth - target.clientWidth) / 2;
    }

    requestAnimationFrame(function() {
      viewport.style.scrollSnapType = 'none'; 
      viewport.scrollTo({ left: getOffset(currentIndex), behavior: 'auto' });
      requestAnimationFrame(function() { viewport.style.scrollSnapType = 'x mandatory'; });
    });

    function goToSlide(index, smooth) {
      if (index < 0) index = 0; 
      if (index >= allSlides.length) index = allSlides.length - 1; 
      
      currentIndex = index;
      setActiveDot(currentIndex);
      
      viewport.scrollTo({
        left: getOffset(currentIndex),
        behavior: smooth ? 'smooth' : 'auto'
      });
    }

    prevBtn.addEventListener('click', function () { goToSlide(currentIndex - 1, true); });
    nextBtn.addEventListener('click', function () { goToSlide(currentIndex + 1, true); });
 
    var scrollTimeout;
    viewport.addEventListener('scroll', function() {
      clearTimeout(scrollTimeout);
      
      scrollTimeout = setTimeout(function() {
        var center = viewport.scrollLeft + viewport.clientWidth / 2;
        var minDiff = Infinity;
        var closestIndex = currentIndex;
        
        allSlides.forEach(function(slide, i) {
          var slideCenter = slide.offsetLeft + slide.clientWidth / 2;
          var diff = Math.abs(center - slideCenter);
          if (diff < minDiff) {
            minDiff = diff;
            closestIndex = i;
          }
        });
        
        currentIndex = closestIndex;
        setActiveDot(currentIndex);
      }, 150); 
    });

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        viewport.style.scrollSnapType = 'none';
        viewport.scrollTo({ left: getOffset(currentIndex), behavior: 'auto' });
        setTimeout(function() { viewport.style.scrollSnapType = 'x mandatory'; }, 50);
      }, 100);
    });
  })();

    function goToSlide(index, smooth) {
      if (index < 0 || index >= allSlides.length) return;
      currentIndex = index;
      setActiveDot(currentIndex);
      
      viewport.scrollTo({
        left: getOffset(currentIndex),
        behavior: smooth ? 'smooth' : 'auto'
      });
    }

    prevBtn.addEventListener('click', function () { goToSlide(currentIndex - 1, true); });
    nextBtn.addEventListener('click', function () { goToSlide(currentIndex + 1, true); });

    var scrollTimeout;
    
  /* MATERIALS PAGE */
  var accordionTriggers = document.querySelectorAll('.accordion-trigger');
  accordionTriggers.forEach(function (trigger) {
    var panel = document.getElementById(trigger.getAttribute('aria-controls'));
    if (!panel) return;

    trigger.addEventListener('click', function () {
      var isOpen = trigger.getAttribute('aria-expanded') === 'true';

      /* Close the panel */
      if (isOpen) {
        trigger.setAttribute('aria-expanded', 'false');
        panel.style.maxHeight = null;
        return;
      }

      trigger.setAttribute('aria-expanded', 'true');
      panel.style.maxHeight = panel.scrollHeight + 'px';
    });
  });

  /* CONTACT PAGE — FORM VALIDATION */
  var orderForm = document.getElementById('order-form');
  if (orderForm) {
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setError(field, message) {
      var wrapper = field.closest('.field');
      var errorEl = wrapper.querySelector('.field-error');
      wrapper.classList.toggle('has-error', Boolean(message));
      if (errorEl) errorEl.textContent = message || '';
    }

    function validateField(field) {
      var value = field.value.trim();

      if (field.hasAttribute('required') && value === '') {
        setError(field, 'This field is required.');
        return false;
      }
      if (field.type === 'email' && value !== '' && !emailPattern.test(value)) {
        setError(field, 'Please enter a valid email address.');
        return false;
      }
      setError(field, '');
      return true;
    }

    orderForm.querySelectorAll('input, select, textarea').forEach(function (field) {
      field.addEventListener('blur', function () { validateField(field); });
    });

    orderForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var fields = orderForm.querySelectorAll('input, select, textarea');
      var isFormValid = true;

      fields.forEach(function (field) {
        if (!validateField(field)) isFormValid = false;
      });

      var statusEl = document.getElementById('form-status');

      if (isFormValid) {
        statusEl.textContent = 'Thank you! Your request has been received. We will reply within two workshop days.';
        statusEl.classList.add('is-visible');
        orderForm.reset();
        fields.forEach(function (field) { setError(field, ''); });
      } else {
        statusEl.textContent = 'Please fix the highlighted fields and try again.';
        statusEl.classList.add('is-visible');
        statusEl.style.color = '#a3372b';
        statusEl.style.borderColor = '#a3372b';
        statusEl.style.backgroundColor = 'rgba(163, 55, 43, 0.08)';
      }
    });
  }

  /* FOOTER */
  var yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});