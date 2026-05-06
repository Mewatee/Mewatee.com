// =====================================================
// PIXEL LOGO ANIMATION
// =====================================================
const FONT = {
    'M': [[1,0,0,0,1],[1,1,0,1,1],[1,0,1,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1]],
    'E': [[1,1,1,1,1],[1,0,0,0,0],[1,1,1,1,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,1]],
    'W': [[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,1,0,1],[1,0,1,0,1],[1,0,1,0,1],[0,1,0,1,0]],
    'A': [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1]],
    'T': [[1,1,1,1,1],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0]],
    '.': [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,1,0]],
    'C': [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,1],[0,1,1,1,0]],
    'O': [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]]
};

const L1 = 'MEWATEE', L2 = '.COM';
const CHAR_GAP = 2, GAP = 2, PAD = 20, LINE_GAP = 3;

function lineUnits(t) {
    let w = 0;
    for (let i = 0; i < t.length; i++) {
        w += FONT[t[i]][0].length;
        if (i < t.length - 1) w += CHAR_GAP;
    }
    return w;
}

const W1 = lineUnits(L1), W2 = lineUnits(L2);
const avail = Math.max(280, window.innerWidth - 60);
const STEP  = Math.min(14, Math.max(7, Math.floor((avail - PAD * 2 + GAP) / W1)));
const PIXEL = STEP - GAP;
const CW = PAD * 2 + W1 * STEP - GAP;
const CH = PAD * 2 + 7 * STEP - GAP + LINE_GAP * STEP + 7 * STEP - GAP;

const cv = document.getElementById('c'), cx = cv.getContext('2d');
cv.width = CW; cv.height = CH;
const T0 = performance.now();

function alpha(px, ts) {
    const el = ts - T0, t = Math.max(0, px - PAD) / (CW - PAD * 2);
    const ra = t * 1600, fm = 200;
    if (el < ra) return 0;
    if (el < ra + fm) return (el - ra) / fm;
    return 1;
}

function pxColor(px, row, ts) {
    const w = (Math.sin(ts * .0009 + px * .025 + row * .08) + 1) / 2;
    return `hsl(${38 - w * 18},95%,${52 + w * 22}%)`;
}

function drawLine(text, xOff, yTop, ts) {
    let xu = 0;
    for (let ci = 0; ci < text.length; ci++) {
        const map = FONT[text[ci]], cw = map[0].length;
        for (let r = 0; r < 7; r++) {
            for (let c = 0; c < cw; c++) {
                if (!map[r][c]) continue;
                const px = xOff + (xu + c) * STEP, py = yTop + r * STEP;
                const a = alpha(px, ts);
                if (a <= 0) continue;
                const col = pxColor(px, r, ts);
                cx.globalAlpha = a;
                cx.shadowColor = col;
                cx.shadowBlur  = 6 + (Math.sin(ts * .0012 + px * .03) + 1) * 5;
                cx.fillStyle   = col;
                cx.fillRect(px, py, PIXEL, PIXEL);
            }
        }
        xu += cw + CHAR_GAP;
    }
}

function draw(ts) {
    cx.clearRect(0, 0, CW, CH);
    drawLine(L1, PAD, PAD, ts);
    drawLine(L2, PAD + Math.round((W1 - W2) / 2) * STEP, PAD + (7 + LINE_GAP) * STEP, ts);
    cx.shadowBlur = 0; cx.globalAlpha = 1;
    requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

// =====================================================
// PARTICLES
// =====================================================
const pc = document.getElementById('particles'), pctx = pc.getContext('2d');
pc.width = window.innerWidth; pc.height = window.innerHeight;

const pts = Array.from({ length: 55 }, () => ({
    x:  Math.random() * pc.width,
    y:  Math.random() * pc.height,
    r:  Math.random() * 1.4 + .3,
    vx: (Math.random() - .5) * .28,
    vy: (Math.random() - .5) * .28,
    a:  Math.random() * .35 + .08
}));

function drawPts(ts) {
    pctx.clearRect(0, 0, pc.width, pc.height);
    pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = pc.width;  if (p.x > pc.width)  p.x = 0;
        if (p.y < 0) p.y = pc.height; if (p.y > pc.height) p.y = 0;
        pctx.globalAlpha = p.a * (.5 + .5 * Math.sin(ts * .001 + p.x * .01));
        pctx.fillStyle = '#ff6b35';
        pctx.shadowColor = '#ff6b35'; pctx.shadowBlur = 4;
        pctx.beginPath(); pctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); pctx.fill();
    });
    pctx.shadowBlur = 0; pctx.globalAlpha = 1;
    requestAnimationFrame(drawPts);
}
requestAnimationFrame(drawPts);

window.addEventListener('resize', () => {
    pc.width = window.innerWidth; pc.height = window.innerHeight;
});

// =====================================================
// AUTH
// =====================================================
const HASH = 'fc666fc9e4122a2d0c5477a9ecd4ea9f0335308acf5f5ae4449aa8b5ec2b3b2d';

async function sha256(str) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function openModal() {
    document.getElementById('overlay').classList.add('active');
    const inp = document.getElementById('pwInput');
    inp.value = '';
    inp.classList.remove('err');
    document.getElementById('modalErr').classList.remove('show');
    updateDots(0);
    setTimeout(() => inp.focus(), 60);
}

function closeModal() {
    document.getElementById('overlay').classList.remove('active');
}

function updateDots(n) {
    for (let i = 0; i < 6; i++)
        document.getElementById('d' + i).classList.toggle('filled', i < n);
}

function onInput() {
    const v = document.getElementById('pwInput').value;
    updateDots(Math.min(v.length, 6));
    document.getElementById('pwInput').classList.remove('err');
    document.getElementById('modalErr').classList.remove('show');
}

function onKey(e) {
    if (e.key === 'Enter')  submitPw();
    if (e.key === 'Escape') closeModal();
}

let loginTime;
let _uptimeInterval = null;
let _pwAttempts = 0, _pwLockUntil = 0;

async function submitPw() {
    const now = Date.now();
    if (now < _pwLockUntil) return;
    const val = document.getElementById('pwInput').value;
    if (!val) return;
    const h = await sha256(val);
    if (h === HASH) {
        _pwAttempts = 0;
        loginTime = new Date();
        closeModal();
        openDash();
    } else {
        _pwAttempts++;
        const delay = Math.min(30000, 1000 * Math.pow(2, _pwAttempts - 1));
        _pwLockUntil = Date.now() + delay;
        const inp = document.getElementById('pwInput');
        inp.classList.add('err');
        document.getElementById('modalErr').classList.add('show');
        inp.value = ''; updateDots(0);
        setTimeout(() => inp.classList.remove('err'), 450);
    }
}

// =====================================================
// DASHBOARD
// =====================================================
function openDash() {
    document.getElementById('dashboard').classList.add('active');
    const now = new Date();
    document.getElementById('dashUser').textContent =
        'Logged in at ' + now.toTimeString().slice(0, 8);
    buildLog(now);
    updateUptime();
    if (_uptimeInterval) clearInterval(_uptimeInterval);
    _uptimeInterval = setInterval(updateUptime, 1000);
}

function lockDash() {
    document.getElementById('dashboard').classList.remove('active');
}

function updateUptime() {
    if (!loginTime) return;
    const s = Math.floor((Date.now() - loginTime) / 1000);
    const m = Math.floor(s / 60), sec = s % 60;
    document.getElementById('uptimeVal').textContent =
        (m > 0 ? m + 'm ' : '') + sec + 's';
}

function buildLog(now) {
    const entries = [
        { type: 'ok',   msg: 'Authorization successful — session started' },
        { type: 'ok',   msg: 'Dashboard loaded successfully' },
        { type: 'warn', msg: 'Secure context verified' },
        { type: '',     msg: 'System integrity check passed' },
        { type: 'ok',   msg: 'mewatee.com — all services online' },
        { type: '',     msg: 'Pixel renderer active' },
    ];
    document.getElementById('actLog').innerHTML = entries.map((e, i) => {
        const d  = new Date(now - i * 300000);
        const ts = d.toTimeString().slice(0, 8);
        return `<div class="log-row"><span class="log-ts">${ts}</span><span class="log-txt ${e.type}">${e.msg}</span></div>`;
    }).join('');
}

// =====================================================
// PROJECTS
// =====================================================
const PROJECTS = [
    {
        id: 'meow-tropolis',
        title: 'MEOW-TROPOLIS',
        sub: 'Streetwear Simulation',
        desc: 'Scavenge materials, craft gear, and sell to customers in a neon cat city. Dodge guards, build street cred, survive the syndicate.',
        tags: ['GAME', 'PIXEL ART'],
        status: 'LIVE',
    },
];

function openProjects() {
    document.getElementById('projects-overlay').classList.add('active');
    _buildProjectsGrid();
}

function closeProjects() {
    document.getElementById('projects-overlay').classList.remove('active');
}

function _buildProjectsGrid() {
    document.getElementById('projectsGrid').innerHTML = PROJECTS.map(p => {
        const live = p.status === 'LIVE';
        const tags = p.tags.map(t => `<span class="proj-tag">${t}</span>`).join('');
        const action = live
            ? `<span class="proj-play">▶ LAUNCH</span>`
            : `<span class="proj-wip">// Coming soon</span>`;
        return `
        <div class="proj-card ${live ? 'proj-live' : 'proj-soon'}" ${live ? `onclick="launchProject('${p.id}')"` : ''}>
            <div class="proj-card-top">
                <div class="proj-card-tags">${tags}</div>
                <span class="proj-status ${live ? 'proj-status-live' : 'proj-status-soon'}">${p.status}</span>
            </div>
            <div class="proj-card-title">${p.title}</div>
            <div class="proj-card-sub">${p.sub}</div>
            <div class="proj-card-desc">${p.desc}</div>
            <div class="proj-card-action">${action}</div>
        </div>`;
    }).join('');
}

function launchProject(id) {
    closeProjects();
    if (id === 'meow-tropolis') startGameFlow();
}
