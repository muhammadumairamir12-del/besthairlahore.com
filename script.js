// ── CURSOR
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
let mx = 0, my = 0, fx = 0, fy = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  if (cursor) { cursor.style.left = mx + 'px'; cursor.style.top = my + 'px'; }
});
function animFollower() {
  if (follower) {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top = fy + 'px';
  }
  requestAnimationFrame(animFollower);
}
animFollower();

// ── LOADER
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) { loader.classList.add('hidden'); setTimeout(() => loader.remove(), 700); }
  }, 2000);
});

// ── NAV SCROLL
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ── HAMBURGER
const ham = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
if (ham && mobileMenu) {
  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      ham.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });
}

// ── LEAVES ANIMATION
function spawnLeaf() {
  const emojis = ['🌿','🍃','🌱','🌾','🪴'];
  const hero = document.getElementById('hero');
  if (!hero) return;
  const leaf = document.createElement('span');
  leaf.className = 'leaf';
  leaf.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  leaf.style.left = Math.random() * 100 + '%';
  leaf.style.animationDuration = (6 + Math.random() * 8) + 's';
  leaf.style.animationDelay = (Math.random() * 3) + 's';
  leaf.style.fontSize = (1.2 + Math.random() * 1.5) + 'rem';
  hero.appendChild(leaf);
  setTimeout(() => leaf.remove(), 18000);
}
setInterval(spawnLeaf, 1200);

// ── PARTICLES (Canvas)
const canvas = document.getElementById('particles-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  for (let i = 0; i < 40; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 1 + Math.random() * 2,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      a: 0.3 + Math.random() * 0.4
    });
  }
  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(108,207,151,${p.a})`;
      ctx.fill();
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });
    requestAnimationFrame(drawParticles);
  }
  drawParticles();
}

// ── COUNTER ANIMATION
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const suffix = el.getAttribute('data-suffix') || '';
  let current = 0;
  const step = Math.ceil(target / 60);
  const interval = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current.toLocaleString() + suffix;
    if (current >= target) clearInterval(interval);
  }, 30);
}
const countersStarted = new Set();
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !countersStarted.has(e.target)) {
      countersStarted.add(e.target);
      animateCounter(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('[data-target]').forEach(el => counterObs.observe(el));

// ── REVEAL ON SCROLL
const revealObs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      e.target.style.transitionDelay = (e.target.dataset.delay || 0) + 'ms';
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── PLANTS DATA
const plants = [
  { id:1, name:'Areca Palm', cat:'palm', icon:'🌴', price:'Rs. 1,200', size:'3-4 ft', sun:'Full Sun', water:'Weekly', stock:true },
  { id:2, name:'Money Plant', cat:'indoor', icon:'🪴', price:'Rs. 350', size:'1-2 ft', sun:'Low Light', water:'Every 10 days', stock:true },
  { id:3, name:'Mango Tree', cat:'fruit', icon:'🥭', price:'Rs. 800', size:'2-3 ft', sun:'Full Sun', water:'Twice/week', stock:true },
  { id:4, name:'Rose Bush', cat:'flower', icon:'🌹', price:'Rs. 500', size:'1-2 ft', sun:'Partial Sun', water:'Daily', stock:true },
  { id:5, name:'Bamboo Plant', cat:'outdoor', icon:'🎋', price:'Rs. 650', size:'4-6 ft', sun:'Full Sun', water:'Weekly', stock:false },
  { id:6, name:'Date Palm', cat:'palm', icon:'🌴', price:'Rs. 3,500', size:'5-7 ft', sun:'Full Sun', water:'Weekly', stock:true },
  { id:7, name:'Peace Lily', cat:'indoor', icon:'🌸', price:'Rs. 450', size:'1-1.5 ft', sun:'No Direct', water:'Weekly', stock:true },
  { id:8, name:'Guava Tree', cat:'fruit', icon:'🍈', price:'Rs. 600', size:'2-4 ft', sun:'Full Sun', water:'Twice/week', stock:true },
  { id:9, name:'Jasmine', cat:'flower', icon:'🌼', price:'Rs. 280', size:'1 ft', sun:'Partial Sun', water:'Daily', stock:true },
  { id:10, name:'Ficus Tree', cat:'outdoor', icon:'🌳', price:'Rs. 900', size:'4-5 ft', sun:'Full Sun', water:'Weekly', stock:true },
  { id:11, name:'Snake Plant', cat:'indoor', icon:'🌿', price:'Rs. 380', size:'1-2 ft', sun:'Low Light', water:'Bi-weekly', stock:true },
  { id:12, name:'Lemon Tree', cat:'fruit', icon:'🍋', price:'Rs. 750', size:'2-3 ft', sun:'Full Sun', water:'Twice/week', stock:false },
];

let activeFilter = 'all';
let searchQuery = '';

function renderPlants() {
  const grid = document.getElementById('plants-grid');
  if (!grid) return;
  const filtered = plants.filter(p => {
    const matchCat = activeFilter === 'all' || p.cat === activeFilter;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.cat.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });
  grid.innerHTML = filtered.length ? filtered.map(p => `
    <div class="plant-card reveal" onclick="openPlant(${p.id})">
      <div class="plant-thumb">
        ${p.icon}
        <span class="plant-badge ${p.stock ? 'badge-in' : 'badge-out'}">${p.stock ? 'In Stock' : 'Out of Stock'}</span>
      </div>
      <div class="plant-info">
        <div class="plant-name">${p.name}</div>
        <div class="plant-meta">
          <span>☀️ ${p.sun}</span>
          <span>💧 ${p.water}</span>
        </div>
        <div class="plant-price">${p.price} <small>/ plant</small></div>
      </div>
    </div>
  `).join('') : '<p style="color:rgba(255,255,255,0.5);grid-column:1/-1;text-align:center;padding:40px">No plants found. Try a different search.</p>';
  // Re-observe reveals
  grid.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = (i * 80) + 'ms';
    revealObs.observe(el);
  });
}

window.openPlant = function(id) {
  const p = plants.find(x => x.id === id);
  if (!p) return;
  document.getElementById('modal-icon').textContent = p.icon;
  document.getElementById('modal-name').textContent = p.name;
  document.getElementById('modal-price').textContent = p.price;
  document.getElementById('modal-size').textContent = p.size;
  document.getElementById('modal-sun').textContent = p.sun;
  document.getElementById('modal-water').textContent = p.water;
  document.getElementById('modal-stock').textContent = p.stock ? '✅ In Stock' : '❌ Out of Stock';
  document.getElementById('modal-wa-btn').onclick = () => {
    window.open(`https://wa.me/923188791637?text=Hi! I'm interested in ${p.name} (${p.price}). Please share more details.`, '_blank');
  };
  document.getElementById('plant-modal').classList.add('open');
};

window.closePlant = function() {
  document.getElementById('plant-modal').classList.remove('open');
};

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    renderPlants();
  });
});

// Search
const searchInput = document.getElementById('plant-search');
if (searchInput) {
  searchInput.addEventListener('input', e => {
    searchQuery = e.target.value;
    renderPlants();
  });
}

// Init
renderPlants();

// Close modal on backdrop
document.getElementById('plant-modal')?.addEventListener('click', function(e) {
  if (e.target === this) closePlant();
});

// ── INQUIRY FORM
const inquiryForm = document.getElementById('inquiry-form');
if (inquiryForm) {
  inquiryForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = inquiryForm.querySelector('[name=name]').value;
    const phone = inquiryForm.querySelector('[name=phone]').value;
    const service = inquiryForm.querySelector('[name=service]').value;
    const msg = inquiryForm.querySelector('[name=message]').value;
    const waMsg = encodeURIComponent(`*New Inquiry from Website*\n\nName: ${name}\nPhone: ${phone}\nService: ${service}\nMessage: ${msg}`);
    window.open(`https://wa.me/923188791637?text=${waMsg}`, '_blank');
    inquiryForm.style.display = 'none';
    document.getElementById('form-success').classList.add('show');
  });
}

// ── 3D TILT on Category Cards
document.querySelectorAll('.cat-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-8px) scale(1.02) rotateX(${-y * 12}deg) rotateY(${x * 12}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});