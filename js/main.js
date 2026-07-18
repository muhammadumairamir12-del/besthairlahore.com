document.addEventListener('DOMContentLoaded', () => {

  // 1. NAVBAR SCROLL
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 2. MOBILE MENU TOGGLE
  const hamburger = document.querySelector('.hamburger');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const drawerOverlay = document.querySelector('.drawer-overlay');
  const closeDrawer = document.querySelector('.close-drawer');

  function openMenu() {
    mobileDrawer.classList.add('active');
    drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  function closeMenu() {
    mobileDrawer.classList.remove('active');
    drawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', openMenu);
  if (closeDrawer) closeDrawer.addEventListener('click', closeMenu);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeMenu);

  // Close menu if a drawer link is clicked
  const drawerLinks = document.querySelectorAll('.drawer-links a:not(.drawer-dropdown-toggle)');
  drawerLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // 3. DROPDOWN MENUS (MOBILE DRAWER CLICK)
  const drawerDropdownToggles = document.querySelectorAll('.drawer-dropdown-toggle');
  drawerDropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const parent = toggle.parentElement;
      const submenu = parent.querySelector('.drawer-submenu');
      if (submenu) {
        submenu.classList.toggle('active');
        const arrow = toggle.querySelector('.arrow');
        if (arrow) {
          arrow.textContent = submenu.classList.contains('active') ? '▴' : '▾';
        }
      }
    });
  });

  // 4. INTERSECTION OBSERVER (Scroll Reveal)
  const revealElements = document.querySelectorAll('.reveal, .reveal-left');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // 5. STATS COUNTER
  const statsSection = document.querySelector('.stats-section');
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  function animateCounter(el, target, duration) {
    const start = performance.now();
    const suffix = el.dataset.suffix || '';
    
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      
      const currentVal = Math.floor(eased * target);
      el.textContent = currentVal.toLocaleString() + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  if (statsSection && statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          statNumbers.forEach(num => {
            if (!num.dataset.target) return;
            const target = parseInt(num.dataset.target, 10);
            if (isNaN(target)) return;
            animateCounter(num, target, 2000);
          });
          statsObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2
    });
    statsObserver.observe(statsSection);
  }

  // 6. FLOATING PARTICLES (HERO)
  const hero = document.getElementById('hero');
  if (hero) {
    const particleCount = 12;
    const particles = [];

    // Colors: Goldish, White, Gold-light
    const colors = ['#C9A84C', '#E8D5A3', '#FFFFFF'];

    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      
      const size = Math.random() * 14 + 6; // 6px to 20px
      const baseX = Math.random() * 100; // in percentage
      const baseY = Math.random() * 100; // in percentage
      const color = colors[Math.floor(Math.random() * colors.length)];
      const opacity = Math.random() * 0.5 + 0.2; // 0.2 to 0.7

      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.backgroundColor = color;
      p.style.opacity = opacity;
      p.style.left = `${baseX}%`;
      p.style.top = `${baseY}%`;

      hero.appendChild(p);

      particles.push({
        element: p,
        x: (baseX / 100) * hero.offsetWidth,
        y: (baseY / 100) * hero.offsetHeight,
        baseX: (baseX / 100) * hero.offsetWidth,
        speed: Math.random() * 0.6 + 0.2, // 0.2 to 0.8
        amplitude: Math.random() * 60 + 20, // 20 to 80
        frequency: Math.random() * 0.005 + 0.002,
        size: size
      });
    }

    // Resize handler to update particle bases
    window.addEventListener('resize', () => {
      particles.forEach(p => {
        const leftPercent = parseFloat(p.element.style.left);
        p.baseX = (leftPercent / 100) * hero.offsetWidth;
      });
    });

    let lastTime = 0;
    function animateParticles(time) {
      particles.forEach(p => {
        // Drift upward
        p.y -= p.speed;
        
        // Horizontal oscillation
        p.x = p.baseX + Math.sin(time * p.frequency) * p.amplitude;

        // Reset to bottom if drifted off-screen top
        if (p.y < -20) {
          p.y = hero.offsetHeight + 20;
          p.baseX = Math.random() * hero.offsetWidth;
        }

        p.element.style.transform = `translate3d(${p.x - p.baseX}px, ${p.y - parseFloat(p.element.style.top) / 100 * hero.offsetHeight}px, 0)`;
      });
      requestAnimationFrame(animateParticles);
    }
    requestAnimationFrame(animateParticles);
  }

  // 7. 3D CARD PARALLAX
  const heroCard = document.querySelector('.hero-card-3d');
  if (heroCard) {
    document.addEventListener('mousemove', (e) => {
      const rect = heroCard.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate rotation offset based on mouse proximity
      const rotY = ((e.clientX - centerX) / window.innerWidth) * 12;
      const rotX = -((e.clientY - centerY) / window.innerHeight) * 8;
      
      // Base rotation is rotateY(-8deg) rotateX(3deg)
      heroCard.style.transform = `perspective(1000px) rotateY(${-8 + rotY}deg) rotateX(${3 + rotX}deg)`;
    });

    // Reset card on mouse leave
    document.addEventListener('mouseleave', () => {
      heroCard.style.transform = `perspective(1000px) rotateY(-8deg) rotateX(3deg)`;
    });
  }

  // 8. BEFORE/AFTER SLIDER
  const sliders = document.querySelectorAll('.ba-container');
  sliders.forEach(slider => {
    const after = slider.querySelector('.ba-after');
    const handle = slider.querySelector('.ba-handle');
    let isDragging = false;

    function startDrag(e) {
      isDragging = true;
      e.stopPropagation();
    }

    function stopDrag() {
      isDragging = false;
    }

    function doDrag(e) {
      if (!isDragging) return;
      
      const rect = slider.getBoundingClientRect();
      let clientX = e.clientX;
      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
      }
      
      let x = clientX - rect.left;
      x = Math.max(0, Math.min(x, rect.width));
      
      const pct = (x / rect.width) * 100;
      
      // Update clip-path and handle position
      // clip-path: inset(top right bottom left) -> we reveal from the left side (which is AFTER or BEFORE?)
      // Let's look at CSS: .ba-after has clip-path: inset(0 0 0 50%) (meaning left half is clipped out, showing before).
      // So if we inset the left coordinate, we show AFTER.
      // So if handle is at 30%, we want to clip left 30% of AFTER.
      after.style.clipPath = `inset(0 0 0 ${pct}%)`;
      handle.style.left = `${pct}%`;
    }

    // Attach listeners
    handle.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', stopDrag);

    // Touch support
    handle.addEventListener('touchstart', startDrag, { passive: true });
    document.addEventListener('touchmove', doDrag, { passive: true });
    document.addEventListener('touchend', stopDrag);
  });

  // 9. TESTIMONIAL CAROUSEL
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.carousel-dots .dot');
  let currentSlide = 0;
  let carouselInterval;

  function showSlide(index) {
    if (slides.length === 0) return;
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
  }

  function startCarousel() {
    carouselInterval = setInterval(() => {
      showSlide(currentSlide + 1);
    }, 4000);
  }

  function stopCarousel() {
    clearInterval(carouselInterval);
  }

  if (slides.length > 0 && dots.length > 0) {
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        stopCarousel();
        showSlide(idx);
        startCarousel();
      });
    });
    startCarousel();
  }

  // 10. FAQ ACCORDION
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('active');
      
      // Close all other items
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-answer').style.maxHeight = '0px';
      });

      if (!isOpen) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        item.classList.remove('active');
        answer.style.maxHeight = '0px';
      }
    });
  });

  // 11. MULTI-STEP APPOINTMENT FORM
  const form = document.getElementById('multi-step-form');
  if (form) {
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const lineFill = document.querySelector('.progress-line-fill');
    
    let currentStepIdx = 0; // 0 = Step 1, 1 = Step 2, 2 = Step 3, 3 = Success

    function updateFormProgress() {
      // Line fill calculations
      const percent = (currentStepIdx / (progressSteps.length - 1)) * 100;
      if (lineFill) lineFill.style.width = percent + '%';

      // Update progress points active/completed states
      progressSteps.forEach((step, idx) => {
        if (idx < currentStepIdx) {
          step.className = 'progress-step completed';
          step.innerHTML = '✓<span class="step-label">' + step.dataset.label + '</span>';
        } else if (idx === currentStepIdx) {
          step.className = 'progress-step active';
          step.innerHTML = (idx + 1) + '<span class="step-label">' + step.dataset.label + '</span>';
        } else {
          step.className = 'progress-step';
          step.innerHTML = (idx + 1) + '<span class="step-label">' + step.dataset.label + '</span>';
        }
      });

      // Toggle visible steps
      steps.forEach((step, idx) => {
        step.classList.toggle('active', idx === currentStepIdx);
      });
    }

    // Step 1 Validation
    function validateStep1() {
      let isValid = true;
      const name = document.getElementById('fullname');
      const phone = document.getElementById('phone');
      const city = document.getElementById('city');

      if (!name.value.trim()) {
        showError(name, 'Full Name is required');
        isValid = false;
      } else {
        clearError(name);
      }

      const phoneVal = phone.value.trim();
      const phoneRegex = /^\+?92\d{9,10}$|^03\d{9}$/; // simple PK phone validation
      if (!phoneVal) {
        showError(phone, 'Phone number is required');
        isValid = false;
      } else if (!phoneRegex.test(phoneVal.replace(/\s+/g, ''))) {
        showError(phone, 'Please enter a valid Pakistani phone number (+923XXXXXXXXX or 03XXXXXXXXX)');
        isValid = false;
      } else {
        clearError(phone);
      }

      if (!city.value) {
        showError(city, 'Please select your city');
        isValid = false;
      } else {
        clearError(city);
      }

      return isValid;
    }

    // Step 2 Validation
    function validateStep2() {
      const selectedService = document.querySelector('input[name="service_selection"]:checked');
      const serviceError = document.getElementById('service-error-msg');
      if (!selectedService) {
        if (serviceError) serviceError.style.display = 'block';
        return false;
      }
      if (serviceError) serviceError.style.display = 'none';
      return true;
    }

    // Step 3 Validation
    function validateStep3() {
      let isValid = true;
      const date = document.getElementById('pref-date');
      const timeSlot = document.querySelector('input[name="time_slot"]:checked');
      const consent = document.getElementById('consent-check');

      if (!date.value) {
        showError(date, 'Preferred date is required');
        isValid = false;
      } else {
        clearError(date);
      }

      const timeError = document.getElementById('time-error-msg');
      if (!timeSlot) {
        if (timeError) timeError.style.display = 'block';
        isValid = false;
      } else {
        if (timeError) timeError.style.display = 'none';
      }

      if (!consent.checked) {
        const consentError = document.getElementById('consent-error-msg');
        if (consentError) consentError.style.display = 'block';
        isValid = false;
      } else {
        const consentError = document.getElementById('consent-error-msg');
        if (consentError) consentError.style.display = 'none';
      }

      return isValid;
    }

    function showError(inputEl, msg) {
      const parent = inputEl.parentElement;
      let error = parent.querySelector('.error-msg');
      if (!error) {
        error = document.createElement('div');
        error.className = 'error-msg';
        parent.appendChild(error);
      }
      error.textContent = msg;
      error.style.display = 'block';
      inputEl.style.borderColor = 'var(--error)';
    }

    function clearError(inputEl) {
      const parent = inputEl.parentElement;
      const error = parent.querySelector('.error-msg');
      if (error) error.style.display = 'none';
      inputEl.style.borderColor = '';
    }

    // Next Buttons
    const nextButtons = document.querySelectorAll('.btn-next');
    nextButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentStepIdx === 0 && validateStep1()) {
          currentStepIdx = 1;
          updateFormProgress();
        } else if (currentStepIdx === 1 && validateStep2()) {
          currentStepIdx = 2;
          updateFormProgress();
        }
      });
    });

    // Back Buttons
    const backButtons = document.querySelectorAll('.btn-back');
    backButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentStepIdx > 0) {
          currentStepIdx--;
          updateFormProgress();
        }
      });
    });

    // Radio select styling helper
    const radioCards = document.querySelectorAll('.radio-card');
    radioCards.forEach(card => {
      const radio = card.querySelector('input[type="radio"]');
      card.addEventListener('click', () => {
        radioCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        if (radio) radio.checked = true;
      });
    });

    const timePills = document.querySelectorAll('.time-pill');
    timePills.forEach(pill => {
      const radio = pill.querySelector('input[type="radio"]');
      pill.addEventListener('click', () => {
        timePills.forEach(p => p.classList.remove('selected'));
        pill.classList.add('selected');
        if (radio) radio.checked = true;
      });
    });

    // Form Submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateStep3()) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Submitting... <span class="spinner"></span>';

        // Simulate API call
        setTimeout(() => {
          currentStepIdx = 3; // Move to success step index
          
          // Hide progress indicator, replace form contents
          const wrapper = document.querySelector('.booking-form-wrapper');
          wrapper.innerHTML = `
            <div class="success-step active">
              <div class="success-icon">
                <span class="success-checkmark">✓</span>
              </div>
              <h2>Booking Received!</h2>
              <p>Thank you! Our team will contact you at your provided number within 24 hours. Your confidence journey starts now.</p>
              <a href="index.html" class="btn-primary">Return to Home</a>
            </div>
          `;
        }, 1500);
      }
    });

    // Initialize date picker min value to today
    const dateInput = document.getElementById('pref-date');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.min = today;
    }
  }

  // 12. SMOOTH SCROLL FOR ANCHOR LINKS
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        closeMenu(); // Close mobile menu if open
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Contact form general validation (contact.html)
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      const name = document.getElementById('c-name');
      const email = document.getElementById('c-email');
      const phone = document.getElementById('c-phone');
      const msg = document.getElementById('c-msg');

      if (!name.value.trim()) {
        showFormError(name, 'Name is required');
        isValid = false;
      } else {
        clearFormError(name);
      }

      if (!email.value.trim()) {
        showFormError(email, 'Email is required');
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        showFormError(email, 'Please enter a valid email address');
        isValid = false;
      } else {
        clearFormError(email);
      }

      if (!phone.value.trim()) {
        showFormError(phone, 'Phone number is required');
        isValid = false;
      } else {
        clearFormError(phone);
      }

      if (!msg.value.trim()) {
        showFormError(msg, 'Message cannot be empty');
        isValid = false;
      } else {
        clearFormError(msg);
      }

      if (isValid) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending... <span class="spinner"></span>';
        
        setTimeout(() => {
          const card = contactForm.parentElement;
          card.innerHTML = `
            <div class="success-step active" style="padding: 40px 0;">
              <div class="success-icon">
                <span class="success-checkmark">✓</span>
              </div>
              <h2>Message Sent!</h2>
              <p>Thank you for reaching out. We have received your inquiry and will get back to you shortly.</p>
              <a href="index.html" class="btn-primary">Back to Home</a>
            </div>
          `;
        }, 1500);
      }
    });

    function showFormError(input, msg) {
      const parent = input.parentElement;
      let err = parent.querySelector('.error-msg');
      if (!err) {
        err = document.createElement('div');
        err.className = 'error-msg';
        parent.appendChild(err);
      }
      err.textContent = msg;
      err.style.display = 'block';
      input.style.borderColor = 'var(--error)';
    }

    function clearFormError(input) {
      const parent = input.parentElement;
      const err = parent.querySelector('.error-msg');
      if (err) err.style.display = 'none';
      input.style.borderColor = '';
    }
  }

});
