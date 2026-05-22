// General site interactivity: theme, navigation, scroll progress, typing animation.
const body = document.body;
const themeToggle = document.getElementById('theme-toggle');
const menuToggle = document.getElementById('menu-toggle');
const navbar = document.getElementById('navbar');
const scrollProgress = document.getElementById('scroll-progress');
const pageLoader = document.getElementById('page-loader');

function initTheme() {
  const savedTheme = localStorage.getItem('portfolioTheme');
  const preferredTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  body.dataset.theme = preferredTheme;
  if (themeToggle) themeToggle.textContent = preferredTheme === 'dark' ? '☾' : '☼';
}

function toggleTheme() {
  const theme = body.dataset.theme === 'dark' ? 'light' : 'dark';
  body.dataset.theme = theme;
  localStorage.setItem('portfolioTheme', theme);
  if (themeToggle) themeToggle.textContent = theme === 'dark' ? '☾' : '☼';
}

function handleMenuToggle() {
  if (navbar) navbar.classList.toggle('open');
}

function closeMenu() {
  if (navbar) navbar.classList.remove('open');
}

function updateScrollProgress() {
  const scrollY = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const progress = height ? (scrollY / height) * 100 : 0;
  if (scrollProgress) scrollProgress.style.width = `${progress}%`;
}

function setActiveLink() {
  const links = document.querySelectorAll('.nav-link');
  const path = window.location.pathname.split('/').pop();
  links.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === path || (path === '' && link.getAttribute('href') === 'index.html'));
  });
}

function typewriterText() {
  const target = document.getElementById('typewriter');
  if (!target) return;
  const phrases = [
    'Frontend Developer',
    'UI/UX Enthusiast',
    'Java Programming',
    'Problem Solver',
    'Modern Web Designer'
  ];
  let index = 0;
  let char = 0;
  let direction = 1;

  function type() {
    const current = phrases[index];
    target.textContent = current.slice(0, char);
    char += direction;

    if (char > current.length) {
      direction = -1;
      setTimeout(type, 1200);
      return;
    }

    if (char < 0) {
      direction = 1;
      index = (index + 1) % phrases.length;
      char = 0;
    }
    setTimeout(type, direction === 1 ? 100 : 50);
  }
  type();
}

function initSkillCharts() {
  const charts = document.querySelectorAll('.skill-chart');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const chart = entry.target;
      const value = Number(chart.dataset.value) || 0;
      chart.style.background = `conic-gradient(var(--accent) ${value * 3.6}deg, rgba(255,255,255,0.08) 0deg)`;
      entry.unobserve(chart);
    });
  }, { threshold: 0.4 });

  charts.forEach(chart => observer.observe(chart));
}

/* ==================================================
   ULTRA-PREMIUM INTERACTIVE FEATURES LOGIC
   ================================================== */

function initBackgroundParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const mouse = { x: null, y: null, radius: 120 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.5;
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = (Math.random() * 25) + 8;
      this.opacity = Math.random() * 0.4 + 0.15;
      this.color = Math.random() > 0.5 ? '#7c5cff' : '#38bdf8';
    }
    draw() {
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }
    update() {
      this.baseY -= 0.15;
      if (this.baseY < 0) {
        this.baseY = height;
        this.baseX = Math.random() * width;
      }

      if (mouse.x != null && mouse.y != null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < mouse.radius) {
          this.x -= directionX;
          this.y -= directionY;
        } else {
          if (this.x !== this.baseX) {
            let dx = this.x - this.baseX;
            this.x -= dx / 15;
          }
          if (this.y !== this.baseY) {
            let dy = this.y - this.baseY;
            this.y -= dy / 15;
          }
        }
      } else {
        if (this.x !== this.baseX) {
          let dx = this.x - this.baseX;
          this.x -= dx / 15;
        }
        if (this.y !== this.baseY) {
          let dy = this.y - this.baseY;
          this.y -= dy / 15;
        }
      }
    }
  }

  function init() {
    particles = [];
    const numberOfParticles = Math.min((width * height) / 10000, 100);
    for (let i = 0; i < numberOfParticles; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    requestAnimationFrame(animate);
  }

  init();
  animate();
}

function initCursorTrail() {
  const canvas = document.getElementById('trail-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  let spots = [];
  let hue = 250;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const mouse = { x: undefined, y: undefined };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    for (let i = 0; i < 2; i++) {
      spots.push(new TrailParticle(mouse.x, mouse.y));
    }
  });

  class TrailParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 4 + 1;
      this.speedX = Math.random() * 1.2 - 0.6;
      this.speedY = Math.random() * 1.2 - 0.6;
      this.color = `hsla(${hue}, 100%, 72%, 0.75)`;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.size > 0.08) this.size -= 0.04;
    }
    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function handleParticles() {
    for (let i = 0; i < spots.length; i++) {
      spots[i].update();
      spots[i].draw();
      for (let j = i; j < spots.length; j++) {
        let dx = spots[i].x - spots[j].x;
        let dy = spots[i].y - spots[j].y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 45) {
          ctx.beginPath();
          ctx.strokeStyle = spots[i].color;
          ctx.lineWidth = spots[i].size / 12;
          ctx.moveTo(spots[i].x, spots[i].y);
          ctx.lineTo(spots[j].x, spots[j].y);
          ctx.stroke();
        }
      }
      if (spots[i].size <= 0.08) {
        spots.splice(i, 1);
        i--;
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    hue += 0.6;
    handleParticles();
    requestAnimationFrame(animate);
  }

  animate();
}

let bgAudio = null;
let synthInterval = null;
let synthOscillators = [];
let audioCtx = null;

function playSynthAmbient() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  const chords = [
    [130.81, 164.81, 196.00, 261.63], // C maj 9
    [174.61, 220.00, 261.63, 349.23], // F maj 9
    [146.83, 174.61, 220.00, 293.66], // D min 7
    [196.00, 246.94, 293.66, 392.00]  // G maj
  ];
  let chordIdx = 0;
  
  function triggerChord() {
    const chord = chords[chordIdx];
    chordIdx = (chordIdx + 1) % chords.length;
    const now = audioCtx.currentTime;
    
    chord.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.15);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.015, now + 1);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 5);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 5);
      synthOscillators.push(osc);
    });
  }
  
  triggerChord();
  synthInterval = setInterval(triggerChord, 5000);
}

function stopSynthAmbient() {
  if (synthInterval) {
    clearInterval(synthInterval);
    synthInterval = null;
  }
  synthOscillators.forEach(osc => {
    try { osc.stop(); } catch(e) {}
  });
  synthOscillators = [];
}

function initMusicToggle() {
  const musicBtn = document.getElementById('music-btn');
  const musicWaves = document.getElementById('music-waves');
  if (!musicBtn) return;
  
  bgAudio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3');
  bgAudio.loop = true;
  bgAudio.volume = 0.25;

  musicBtn.addEventListener('click', () => {
    if (bgAudio.paused && !synthInterval) {
      bgAudio.play().then(() => {
        musicBtn.textContent = '⏸';
        musicWaves.classList.add('playing');
      }).catch(err => {
        console.warn("Audio play failed, playing synthesizer fallback instead.", err);
        playSynthAmbient();
        musicBtn.textContent = '⏸';
        musicWaves.classList.add('playing');
      });
    } else {
      bgAudio.pause();
      stopSynthAmbient();
      musicBtn.textContent = '▶';
      musicWaves.classList.remove('playing');
    }
  });
}

function initAIChatbot() {
  const toggle = document.getElementById('chatbot-toggle');
  const windowEl = document.getElementById('chatbot-window');
  const close = document.getElementById('chatbot-close');
  const form = document.getElementById('chatbot-form');
  const input = document.getElementById('chatbot-input');
  const messages = document.getElementById('chatbot-messages');
  const chips = document.querySelectorAll('.suggestion-chip');

  if (!toggle || !windowEl) return;

  toggle.addEventListener('click', () => {
    windowEl.classList.toggle('active');
  });

  close.addEventListener('click', () => {
    windowEl.classList.remove('active');
  });

  document.addEventListener('click', (e) => {
    if (!windowEl.contains(e.target) && !toggle.contains(e.target)) {
      windowEl.classList.remove('active');
    }
  });

  function botReply(text) {
    const bubble = document.createElement('div');
    bubble.className = 'chat-message bot';
    bubble.textContent = "...";
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;

    setTimeout(() => {
      bubble.textContent = text;
      messages.scrollTop = messages.scrollHeight;
    }, 600);
  }

  function handleUserMessage(msgText) {
    if (!msgText.trim()) return;
    const bubble = document.createElement('div');
    bubble.className = 'chat-message user';
    bubble.textContent = msgText;
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;

    const query = msgText.toLowerCase();
    let reply = "I'm Chala's AI Assistant. I can tell you about his computer science skills, university, degree, or projects! Try asking: 'What skills do you have?' or 'Tell me about your projects.'";

    if (query.includes('skill') || query.includes('technolog') || query.includes('language')) {
      reply = "Chala has solid skills in Frontend Development (HTML, CSS, Vanilla JavaScript) and Backend/Systems languages including C++ and Advanced Java. He also builds database solutions with Firebase!";
    } else if (query.includes('university') || query.includes('study') || query.includes('oda bultum') || query.includes('degree') || query.includes('education')) {
      reply = "Chala is pursuing a Bachelor Degree in Computer Science at Oda Bultum University. He focuses on software engineering, OOP design, and algorithmic problem-solving.";
    } else if (query.includes('project') || query.includes('portfolio') || query.includes('work')) {
      reply = "Chala has built a responsive Portfolio Landing Page, an academic University App Prototype, dynamic UI designs, and real-time database apps with Firebase Firestore.";
    } else if (query.includes('contact') || query.includes('hire') || query.includes('email') || query.includes('reach')) {
      reply = "You can contact Chala directly by filling out the form on the 'Contact' page, or by emailing him at chala@example.com!";
    } else if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
      reply = "Hello! Welcome to Chala's personal website. How can I help you today?";
    }

    botReply(reply);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = input.value;
    input.value = '';
    handleUserMessage(val);
  });

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      handleUserMessage(chip.textContent);
    });
  });
}

async function initVisitorCounter() {
  const container = document.getElementById('visitor-counter-container');
  const textEl = document.getElementById('visitor-count');
  if (!container || !textEl || !window.db) return;

  const sessionKey = 'hasVisitedChalaPortfolio';
  const hasVisited = sessionStorage.getItem(sessionKey);

  const docRef = db.collection('stats').doc('visitors');

  try {
    if (!hasVisited) {
      await db.runTransaction(async (transaction) => {
        const doc = await transaction.get(docRef);
        if (!doc.exists) {
          transaction.set(docRef, { count: 1 });
        } else {
          const newCount = (doc.data().count || 0) + 1;
          transaction.update(docRef, { count: newCount });
        }
      });
      sessionStorage.setItem(sessionKey, 'true');
    }

    const doc = await docRef.get();
    if (doc.exists) {
      textEl.textContent = doc.data().count || 0;
      container.style.display = 'inline-flex';
    }
  } catch (error) {
    console.warn("Unable to sync visitor statistics.", error);
  }
}

function initPage() {
  initTheme();
  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  if (menuToggle) menuToggle.addEventListener('click', handleMenuToggle);
  document.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', closeMenu));
  window.addEventListener('scroll', updateScrollProgress);
  setActiveLink();
  typewriterText();
  initSkillCharts();
  updateScrollProgress();
  
  // Interactive Custom Particles, Music, Chatbot & Stats Counters
  initBackgroundParticles();
  initCursorTrail();
  initMusicToggle();
  initAIChatbot();
  initVisitorCounter();

  if (pageLoader) {
    setTimeout(() => pageLoader.classList.add('hidden'), 800);
  }
}

window.addEventListener('DOMContentLoaded', initPage);
