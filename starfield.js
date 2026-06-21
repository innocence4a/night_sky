// ===== 役職タイプ定義 =====
const TYPES = {
  ceo: {
    icon: 'ti-crown', label: 'CEO', title: 'Chief Executive Officer',
    color: 'rgba(255,200,0,0.3)', border: 'rgba(255,230,80,0.7)', text: '#ffe060',
    hp: 999, rarity: '&#9733;&#9733;&#9733; LEGENDARY',
  },
  cto: {
    icon: 'ti-settings', label: 'CTO', title: 'Chief Technology Officer',
    color: 'rgba(0,180,255,0.25)', border: 'rgba(80,200,255,0.6)', text: '#60d0ff',
    hp: 320, rarity: '&#9733;&#9733; ULTRA RARE',
  },
  engineer: {
    icon: 'ti-code', label: 'ENGINEER', title: 'Software Engineer',
    color: 'rgba(0,220,120,0.25)', border: 'rgba(80,255,160,0.6)', text: '#60ff90',
    hp: 280, rarity: '&#9733;&#9733; ULTRA RARE',
  },
  designer: {
    icon: 'ti-brush', label: 'DESIGNER', title: 'Creative Designer',
    color: 'rgba(220,80,255,0.25)', border: 'rgba(200,120,255,0.6)', text: '#d080ff',
    hp: 260, rarity: '&#9733; RARE',
  },
  sales: {
    icon: 'ti-briefcase', label: 'SALES', title: 'Sales Executive',
    color: 'rgba(255,120,0,0.25)', border: 'rgba(255,180,60,0.6)', text: '#ffb040',
    hp: 300, rarity: '&#9733; RARE',
  },
  founder: {
    icon: 'ti-rocket', label: 'FOUNDER', title: 'Co-Founder',
    color: 'rgba(255,50,100,0.25)', border: 'rgba(255,100,150,0.6)', text: '#ff80a0',
    hp: 500, rarity: '&#9733;&#9733; ULTRA RARE',
  },
};

// ===== DOM参照 =====
const card       = document.getElementById('card');
const wrapper    = document.getElementById('cardWrapper');
const holoShimmer = document.getElementById('holoShimmer');
const typeIcon   = document.getElementById('typeIcon');
const typeLabel  = document.getElementById('typeLabel');
const typeBadge  = document.getElementById('typeBadge');
const dispTitle  = document.getElementById('dispTitle');
const hpVal      = document.getElementById('hpVal');
const rarityLabel = document.getElementById('rarityLabel');
const buttons    = document.querySelectorAll('.ctrl-btn');
let isTouchActive = false;

// ===== 役職切り替え =====
function setType(typeKey) {
  const d = TYPES[typeKey];
  if (!d) return;

  typeIcon.className         = `ti ${d.icon}`;
  typeLabel.textContent      = d.label;
  dispTitle.textContent      = d.title;
  hpVal.textContent          = d.hp;
  rarityLabel.innerHTML      = d.rarity;

  typeBadge.style.background = d.color;
  typeBadge.style.border     = `1px solid ${d.border}`;
  typeBadge.style.color      = d.text;

  buttons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.type === typeKey);
  });
}

// ===== ボタンイベント =====
buttons.forEach(btn => {
  btn.addEventListener('click', () => setType(btn.dataset.type));
});

// ===== 3D傾き & ホログラム =====
function updateTiltFromPoint(clientX, clientY) {
  const r    = wrapper.getBoundingClientRect();
  const x    = clientX - r.left;
  const y    = clientY - r.top;
  const rotY = ((x - r.width  / 2) / (r.width  / 2)) * 12;
  const rotX = -((y - r.height / 2) / (r.height / 2)) * 12;

  card.style.transform = `rotateY(${rotY}deg) rotateX(${rotX}deg)`;

  const px = (x / r.width)  * 100;
  const py = (y / r.height) * 100;
  // backgroundごと上書きしてCSSのconic-gradientと競合させない
  holoShimmer.style.background = `conic-gradient(
    from ${rotY * 5}deg at ${px}% ${py}%,
    rgba(255,0,128,0.85),
    rgba(255,128,0,0.85),
    rgba(255,255,0,0.85),
    rgba(0,255,128,0.85),
    rgba(0,128,255,0.85),
    rgba(128,0,255,0.85),
    rgba(255,0,128,0.85)
  )`;
  holoShimmer.style.opacity = '1';
  holoShimmer.style.animation = 'none';
}

function resetTilt() {
  card.style.transform = 'rotateY(0deg) rotateX(0deg)';
  holoShimmer.style.background  = '';
  holoShimmer.style.opacity     = '';
  holoShimmer.style.animation   = '';
}

function handlePointerMove(e) {
  if (e.pointerType === 'touch' && !isTouchActive) return;
  updateTiltFromPoint(e.clientX, e.clientY);
}

wrapper.addEventListener('pointerdown', e => {
  if (e.pointerType === 'touch') {
    isTouchActive = true;
    e.preventDefault();
  }
  updateTiltFromPoint(e.clientX, e.clientY);
});

wrapper.addEventListener('pointermove', handlePointerMove);
wrapper.addEventListener('pointerup', () => {
  isTouchActive = false;
  resetTilt();
});
wrapper.addEventListener('pointercancel', () => {
  isTouchActive = false;
  resetTilt();
});
wrapper.addEventListener('pointerleave', e => {
  if (e.pointerType !== 'touch') {
    resetTilt();
  }
});
