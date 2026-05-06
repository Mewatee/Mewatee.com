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
    if (now < _pwLockUntil) return; // rate-limited
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
        // exponential back-off: 1s, 2s, 4s … capped at 30s
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

// =====================================================
// GAME — MEOW-TROPOLIS
// =====================================================

FONT['P'] = [[1,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0]];
FONT['N'] = [[1,0,0,0,1],[1,1,0,0,1],[1,0,1,0,1],[1,0,0,1,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1]];

// ── Constants ─────────────────────────────────────────
const SW = 640, SH = 272, FLY = 188;

// ── Palettes ──────────────────────────────────────────
const PAL = {
  player:    {fur:'#c8a46a',earIn:'#e88878',eye:'#1a0c06',eyeS:'#6a5040',nose:'#e07060',cheek:'#d4b890',shirt:'#1a2535',pants:'#1a1518',shoe:'#090909'},
  vandal:    {fur:'#9898a0',earIn:'#cc7090',eye:'#1a0c06',eyeS:'#706068',nose:'#cc7090',cheek:'#b0a8a8',shirt:'#cc3300',pants:'#2a3448',shoe:'#111111'},
  raccoon:   {fur:'#888888',earIn:'#bb9977',eye:'#0a0a0a',eyeS:'#444444',nose:'#bb9977',cheek:'#aaaaaa',shirt:'#445522',pants:'#222222',shoe:'#111111'},
  crow:      {fur:'#1a1a22',earIn:'#cc4444',eye:'#cc2222',eyeS:'#ff5555',nose:'#cc4444',cheek:'#252530',shirt:'#100f1a',pants:'#080810',shoe:'#050508'},
  syndicate: {fur:'#6a6a7a',earIn:'#888888',eye:'#222222',eyeS:'#555555',nose:'#888888',cheek:'#7a7a8a',shirt:'#1a1a20',pants:'#0a0a12',shoe:'#080808'},
  nova:      {fur:'#f0a0d0',earIn:'#ff88cc',eye:'#220022',eyeS:'#884488',nose:'#ff88cc',cheek:'#f4b8e0',shirt:'#441155',pants:'#220033',shoe:'#110022'},
};

// ── Customers ─────────────────────────────────────────
const CUSTOMERS = [
  {name:'VANDAL', role:'Street Skater Cat',      pal:PAL.vandal,    pref:'flash',   skateboard:true,
   line:'"Yo... something that pops under the streetlights. Gritty energy."'},
  {name:'SHADE',  role:'Graffiti Artist Raccoon', pal:PAL.raccoon,   pref:'stealth',
   line:'"Need something understated. You only notice it when you\'re close."'},
  {name:'VIBE',   role:'DJ Crow',                pal:PAL.crow,      pref:'classic',
   line:'"Performing tonight. Keep it clean. No distractions from the set."'},
  {name:'CIPHER', role:'Syndicate Runner',        pal:PAL.syndicate, pref:'stealth',
   line:'"Make it forgettable. Nothing that draws eyes. Don\'t ask questions."'},
  {name:'NOVA',   role:'Influencer Cat',          pal:PAL.nova,      pref:'flash',
   line:'"Maximum visual impact. My followers expect it. Make it viral."'},
];

// ── Map definitions ────────────────────────────────────
const MAP_DEFS = [
  { // Map 0: Neon District (Days 1–4)
    name:'Neon District', subtitle:'Laundromat Front — 23:14',
    bg:'#090910', gridCol:'#111118', dividerCol:'rgba(80,70,0,0.4)',
    wallFill:'#0c0d1c', wallStroke:'#1a1b2e',
    winLit:'rgba(255,195,70,0.45)', winDark:'#08080f', winGlow:'rgba(255,220,100,0.1)',
    lightGlow:'rgba(255,195,70,0.2)', lightPost:'rgba(255,210,80,0.9)',
    lights:[[148,20],[310,20],[490,20],[100,210],[340,210],[520,210]],
    blocks:[
      {x:38,y:32,w:105,h:82},{x:218,y:24,w:118,h:68},{x:428,y:32,w:152,h:96},
      {x:52,y:155,w:88,h:92},{x:343,y:148,w:112,h:96},
    ],
    hotspots:[
      {x:162,y:78, mat:'reflectiveInk',label:'DUMPSTER',  col:'#00d4ff',uses:2},
      {x:336,y:50, mat:'neonDye',      label:'NEON SIGN', col:'#ff00aa',uses:2},
      {x:462,y:200,mat:'rareDenim',    label:'ALLEY RACK',col:'#ffaa22',uses:1},
      {x:148,y:198,mat:'cyberThread',  label:'DRAIN PIPE',col:'#00ff88',uses:1},
      {x:522,y:175,mat:'reflectiveInk',label:'FIRE ESC.', col:'#00d4ff',uses:1},
      {x:390,y:130,mat:'stunners',     label:'SMOKE CAN', col:'#00ffcc',uses:2},
    ],
    shopPos:{x:600,y:180}, marketPos:{x:195,y:230}, playerStart:{x:300,y:195},
    basePatrols:[
      {x:265,y:100,dx:1.5,dy:0,  bDx:1.5,bDy:0,  minX:168,maxX:418,minY:0,  maxY:0  },
      {x:478,y:145,dx:0,  dy:1.2,bDx:0,  bDy:1.2,minX:0,  maxX:0,  minY:98, maxY:232},
      {x:570,y:175,dx:1.1,dy:0,  bDx:1.1,bDy:0,  minX:548,maxX:625,minY:0,  maxY:0,  _bouncer:true},
    ],
  },
  { // Map 1: Syndicate Quarter (Days 5–9)
    name:'Syndicate Quarter', subtitle:'Corp Tower Perimeter — 02:44',
    bg:'#07080f', gridCol:'#0d0e1a', dividerCol:'rgba(30,40,100,0.4)',
    wallFill:'#0a0b18', wallStroke:'#1a1a32',
    winLit:'rgba(80,140,255,0.5)', winDark:'#050510', winGlow:'rgba(80,120,255,0.1)',
    lightGlow:'rgba(80,140,255,0.18)', lightPost:'rgba(100,160,255,0.9)',
    lights:[[90,15],[310,10],[520,15],[90,175],[310,172],[522,178]],
    blocks:[
      {x:30,y:15,w:120,h:75},{x:255,y:8,w:110,h:72},{x:450,y:15,w:145,h:85},
      {x:30,y:175,w:105,h:90},{x:255,y:172,w:105,h:95},{x:490,y:178,w:118,h:85},
    ],
    hotspots:[
      {x:195,y:55, mat:'reflectiveInk',label:'VENT SHAFT', col:'#00d4ff',uses:2},
      {x:405,y:40, mat:'neonDye',      label:'CORP SIGN',  col:'#ff00aa',uses:2},
      {x:165,y:235,mat:'rareDenim',    label:'TRASH PILE', col:'#ffaa22',uses:1},
      {x:385,y:235,mat:'cyberThread',  label:'SEC PANEL',  col:'#00ff88',uses:1},
      {x:448,y:130,mat:'reflectiveInk',label:'FIRE EXIT',  col:'#00d4ff',uses:1},
      {x:220,y:130,mat:'stunners',     label:'SUPPLY BOX', col:'#00ffcc',uses:2},
    ],
    shopPos:{x:600,y:130}, marketPos:{x:152,y:130}, playerStart:{x:315,y:130},
    basePatrols:[
      {x:200,y:55, dx:1.6,dy:0, bDx:1.6,bDy:0, minX:150,maxX:245,minY:0,maxY:0},
      {x:400,y:40, dx:1.4,dy:0, bDx:1.4,bDy:0, minX:365,maxX:448,minY:0,maxY:0},
      {x:200,y:130,dx:1.5,dy:0, bDx:1.5,bDy:0, minX:135,maxX:245,minY:0,maxY:0},
      {x:380,y:130,dx:1.6,dy:0, bDx:1.6,bDy:0, minX:255,maxX:445,minY:0,maxY:0},
      {x:575,y:130,dx:1.1,dy:0, bDx:1.1,bDy:0, minX:555,maxX:610,minY:0,maxY:0, _bouncer:true},
    ],
  },
  { // Map 2: The Underground (Days 10–14)
    name:'The Underground', subtitle:'Tunnel Grid — Level B3',
    bg:'#060a06', gridCol:'#0a0f0a', dividerCol:'rgba(0,80,30,0.4)',
    wallFill:'#080f08', wallStroke:'#143214',
    winLit:'rgba(0,220,80,0.4)', winDark:'#030a03', winGlow:'rgba(0,200,80,0.1)',
    lightGlow:'rgba(0,200,80,0.18)', lightPost:'rgba(50,255,100,0.9)',
    lights:[[35,35],[175,28],[295,35],[445,28],[35,180],[175,162],[295,160],[445,160]],
    blocks:[
      {x:60,y:35,w:55,h:60},{x:230,y:28,w:55,h:65},{x:390,y:35,w:55,h:60},
      {x:60,y:160,w:55,h:80},{x:230,y:162,w:55,h:80},{x:390,y:160,w:55,h:80},
      {x:535,y:20,w:85,h:240},
    ],
    hotspots:[
      {x:168,y:65, mat:'reflectiveInk',label:'BARREL',      col:'#00d4ff',uses:2},
      {x:318,y:55, mat:'neonDye',      label:'GLOW TUBE',   col:'#ff00aa',uses:2},
      {x:470,y:65, mat:'rareDenim',    label:'CRATE STASH', col:'#ffaa22',uses:1},
      {x:168,y:210,mat:'cyberThread',  label:'WIRE COIL',   col:'#00ff88',uses:1},
      {x:318,y:210,mat:'reflectiveInk',label:'OIL DRUM',    col:'#00d4ff',uses:1},
      {x:30,y:220, mat:'stunners',     label:'TOOL BOX',    col:'#00ffcc',uses:2},
    ],
    shopPos:{x:520,y:130}, marketPos:{x:30,y:130}, playerStart:{x:310,y:130},
    basePatrols:[
      {x:168,y:18, dx:1.6,dy:0,  bDx:1.6,bDy:0,  minX:30, maxX:525,minY:0,  maxY:0  },
      {x:318,y:130,dx:1.5,dy:0,  bDx:1.5,bDy:0,  minX:30, maxX:525,minY:0,  maxY:0  },
      {x:168,y:255,dx:1.6,dy:0,  bDx:1.6,bDy:0,  minX:30, maxX:525,minY:0,  maxY:0  },
      {x:168,y:130,dx:0,  dy:1.5,bDx:0,  bDy:1.5,minX:0,  maxX:0,  minY:18, maxY:255},
      {x:495,y:130,dx:1.1,dy:0,  bDx:1.1,bDy:0,  minX:448,maxX:520,minY:0,  maxY:0,  _bouncer:true},
    ],
  },
  { // Map 3: Rooftop Circuit (Days 15+)
    name:'Rooftop Circuit', subtitle:'Sky Level — Grid Point 07',
    bg:'#05080c', gridCol:'#08090f', dividerCol:'rgba(0,100,120,0.4)',
    wallFill:'#08101a', wallStroke:'#102030',
    winLit:'rgba(0,220,255,0.45)', winDark:'#030508', winGlow:'rgba(0,200,255,0.1)',
    lightGlow:'rgba(0,200,255,0.18)', lightPost:'rgba(80,230,255,0.9)',
    lights:[[50,40],[200,20],[320,45],[480,25],[50,190],[200,195],[330,188],[480,195]],
    blocks:[
      {x:80,y:45,w:40,h:35},{x:200,y:20,w:35,h:30},{x:310,y:50,w:35,h:30},{x:430,y:25,w:40,h:35},
      {x:90,y:185,w:40,h:35},{x:215,y:195,w:35,h:30},{x:330,y:185,w:35,h:30},{x:450,y:192,w:40,h:35},
      {x:530,y:90,w:60,h:90},
    ],
    hotspots:[
      {x:148,y:65, mat:'reflectiveInk',label:'ANTENNA',     col:'#00d4ff',uses:2},
      {x:270,y:38, mat:'neonDye',      label:'SIGNAL BOX',  col:'#ff00aa',uses:2},
      {x:388,y:62, mat:'rareDenim',    label:'DUCT PANEL',  col:'#ffaa22',uses:1},
      {x:165,y:218,mat:'cyberThread',  label:'CABLE TRAY',  col:'#00ff88',uses:1},
      {x:285,y:218,mat:'reflectiveInk',label:'RELAY BOX',   col:'#00d4ff',uses:1},
      {x:498,y:218,mat:'stunners',     label:'GEAR LOCKER', col:'#00ffcc',uses:2},
    ],
    shopPos:{x:595,y:188}, marketPos:{x:40,y:140}, playerStart:{x:315,y:130},
    basePatrols:[
      {x:260,y:18, dx:1.8,dy:0,  bDx:1.8,bDy:0,  minX:30, maxX:525,minY:0,  maxY:0  },
      {x:260,y:260,dx:1.7,dy:0,  bDx:1.7,bDy:0,  minX:30, maxX:525,minY:0,  maxY:0  },
      {x:180,y:130,dx:0,  dy:1.8,bDx:0,  bDy:1.8,minX:0,  maxX:0,  minY:30, maxY:255},
      {x:400,y:130,dx:0,  dy:1.8,bDx:0,  bDy:1.8,minX:0,  maxX:0,  minY:30, maxY:255},
      {x:575,y:188,dx:1.1,dy:0,  bDx:1.1,bDy:0,  minX:555,maxX:610,minY:0,  maxY:0,  _bouncer:true},
    ],
  },
];
let currentMap = null;
function loadMap(idx){
  const def=MAP_DEFS[Math.min(idx,MAP_DEFS.length-1)];
  currentMap=def;
  MAP_BLOCKS=def.blocks;
  HOTSPOTS=def.hotspots.map(h=>({...h,taken:0}));
  MARKET_POS={...def.marketPos};
  SHOP_ENTER={...def.shopPos};
  G.playerX=def.playerStart.x; G.playerY=def.playerStart.y;
  PATROLS.splice(0,PATROLS.length,...def.basePatrols.map(p=>({
    ...p,frame:0,tick:0,state:'patrol',alertTimer:0,chaseTimer:0,searchTimer:0,stunned:0,eliminated:false
  })));
  updateDistrictSidebar(idx);
  const bs=document.getElementById('game-brand-sub');
  if(bs)bs.textContent='// Day '+G.day+' — '+def.name;
  const gs=document.getElementById('game-sub-line');
  if(gs)gs.textContent='// '+def.subtitle+' — Boutique Mode Active';
}
function updateDistrictSidebar(idx){
  MAP_DEFS.forEach((d,i)=>{
    const r=document.getElementById('dist-'+i);
    if(!r)return;
    r.className='district-row'+(i===idx?' active-district':i<idx?' visited-district':' locked-district');
    r.textContent=(i===idx?'> ':i<idx?'✓ ':'-- ')+d.name;
  });
}
function showMapBanner(name,sub){
  const el=document.getElementById('map-banner');if(!el)return;
  document.getElementById('mb-name').textContent=name;
  document.getElementById('mb-sub').textContent=sub;
  el.classList.add('active');
  setTimeout(()=>el.classList.remove('active'),3000);
}

// ── Map layout vars (set by loadMap) ──────────────────
let MAP_BLOCKS=[], HOTSPOTS=[];
const VISION_RANGE = 50;
const SLOW_RANGE = 95;
let PATROLS = [];
let MARKET_POS = {x:0,y:0};

// ── Boss system ────────────────────────────────────────
let bossData = null;
const BOSS_NAMES  = ['CAPTAIN VICE','ENFORCER ZERO','SYNDICATE PRIME','SHADOW KING','THE ARCHITECT'];
const BOSS_TITLES = ['Syndicate Captain','Elite Enforcer','District Overlord','Underground Legend','System Controller'];

function distToSegment(px,py,ax,ay,bx2,by2){
  const dx=bx2-ax,dy=by2-ay,lenSq=dx*dx+dy*dy;
  if(!lenSq)return Math.hypot(px-ax,py-ay);
  const t=Math.max(0,Math.min(1,((px-ax)*dx+(py-ay)*dy)/lenSq));
  return Math.hypot(px-(ax+t*dx),py-(ay+t*dy));
}

function spawnBoss(){
  const level=Math.floor(G.day/5);
  bossData={
    x:510,y:58,
    dx:0,dy:0,_wander:0,
    minX:40,maxX:610,minY:18,maxY:250,
    state:'patrol',alertTimer:0,chaseTimer:0,searchTimer:0,
    level, name:BOSS_NAMES[Math.min(level-1,4)], title:BOSS_TITLES[Math.min(level-1,4)],
    visionR:70+(level-1)*10, spd:3.8+(level-1)*0.4,
    frame:0,tick:0,
    stunned:0,
    scanTimer:320,scanActive:0,scanAngle:0,
    chargeTimer:520,chargeActive:0,chargeVx:0,chargeVy:0,
    backupTimer:680,backupSpawned:false,
    empTimer:740,empFired:false,
  };
}

function updateAndDrawBoss(ctx,ts){
  if(!bossData)return;
  const b=bossData;
  // Freeze boss while market is open
  if(G.marketOpen){
    const bx=Math.round(b.x),by=Math.round(b.y),ex=bx-6,ey=by-6;
    ctx.save();ctx.globalAlpha=0.22;
    ctx.fillStyle='#1a0000';ctx.fillRect(ex,ey,12,12);
    ctx.fillStyle='#ff1111';ctx.fillRect(ex+1,ey+1,3,3);ctx.fillRect(ex+8,ey+1,3,3);
    ctx.restore();
    return;
  }
  const dist=Math.hypot(b.x-G.playerX,b.y-G.playerY);
  const canSee=dist<b.visionR&&G.invisible===0&&G.spottedFlash===0;

  // ── Boss stun ──────────────────────────────────────
  if(b.stunned>0){
    b.stunned--;b.state='patrol';b.alertTimer=0;b.chaseTimer=0;
    const bx2=Math.round(b.x),by2=Math.round(b.y);
    const sc='#00ffcc',pulse2=0.5+Math.sin(ts*.02)*.2;
    ctx.save();ctx.globalAlpha=0.07;ctx.fillStyle=sc;
    ctx.beginPath();ctx.arc(bx2,by2,b.visionR,0,Math.PI*2);ctx.fill();ctx.restore();
    ctx.save();ctx.globalAlpha=pulse2;
    const ex2=bx2-6,ey2=by2-6;
    ctx.fillStyle='#003322';ctx.fillRect(ex2,ey2,12,12);
    ctx.fillStyle=sc;ctx.fillRect(ex2+1,ey2+1,3,3);ctx.fillRect(ex2+8,ey2+1,3,3);
    ctx.fillStyle='#006644';ctx.fillRect(ex2+3,ey2+6,6,4);
    ctx.shadowColor=sc;ctx.shadowBlur=12;
    ctx.font='bold 7px monospace';ctx.fillStyle=sc;ctx.textAlign='center';
    ctx.fillText('ZZZ',bx2,by2-16);
    ctx.fillStyle='#ffd700';ctx.font='bold 9px monospace';ctx.fillText('★',bx2,by2-b.visionR-7);
    ctx.fillStyle='#00ffcc';ctx.font='bold 7px monospace';ctx.fillText(b.name+' [STUNNED]',bx2,by2-25);
    // stun bar
    ctx.shadowBlur=0;ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(bx2-16,by2-35,32,3);
    ctx.fillStyle=sc;ctx.fillRect(bx2-16,by2-35,(b.stunned/130)*32,3);
    ctx.restore();
    return;
  }

  // ── ABILITY: Scan Laser (all levels) ──────────────
  b.scanTimer--;
  if(b.scanTimer<=0&&b.state!=='chase'&&b.chargeActive===0){
    b.scanActive=110; b.scanAngle=Math.atan2(G.playerY-b.y,G.playerX-b.x)-Math.PI/2;
    b.scanTimer=b.level===1?360:b.level===2?290:220;
    setMapStatus('★ BOSS SCANNING — stay out of the beam!');
  }
  if(b.scanActive>0){
    b.scanActive--;b.scanAngle+=0.030;
    const len=b.visionR+90;
    const ex=b.x+Math.cos(b.scanAngle)*len,ey=b.y+Math.sin(b.scanAngle)*len;
    ctx.save();
    ctx.globalAlpha=0.9*(b.scanActive/110);
    ctx.strokeStyle='#ff0033';ctx.lineWidth=2;ctx.shadowColor='#ff0033';ctx.shadowBlur=14;
    ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(ex,ey);ctx.stroke();
    const g2=ctx.createLinearGradient(b.x,b.y,ex,ey);
    g2.addColorStop(0,'rgba(255,0,50,0.18)');g2.addColorStop(1,'rgba(255,0,50,0)');
    ctx.fillStyle=g2;ctx.beginPath();ctx.moveTo(b.x,b.y);
    ctx.arc(b.x,b.y,len,b.scanAngle-0.14,b.scanAngle+0.14);ctx.closePath();ctx.fill();
    ctx.restore();
    if(G.invisible===0&&G.spottedFlash===0&&distToSegment(G.playerX,G.playerY,b.x,b.y,ex,ey)<9){
      if(b.state==='patrol'||b.state==='search'){b.state='alert';b.alertTimer=18;}
    }
  }

  // ── ABILITY: Charge Dash (level 2+) ───────────────
  if(b.level>=2){
    if(b.chargeActive>0){
      b.x+=b.chargeVx;b.y+=b.chargeVy;
      b.x=Math.max(6,Math.min(SW-6,b.x));b.y=Math.max(6,Math.min(SH-6,b.y));
      b.chargeActive--;spawnParticles(b.x,b.y,'#ff2200',4);
      if(b.chargeActive===0){b.state='search';b.searchTimer=70;}
    } else {
      b.chargeTimer--;
      if(b.chargeTimer<=0&&b.state==='patrol'&&b.scanActive===0){
        b.chargeActive=52;
        const ang=Math.atan2(G.playerY-b.y,G.playerX-b.x);
        b.chargeVx=Math.cos(ang)*7.8;b.chargeVy=Math.sin(ang)*7.8;
        b.chargeTimer=b.level===2?520:390;b.state='chase';
        setMapStatus('★ BOSS CHARGING — RUN!');shakeFrames=14;shakeAmp=5;
      }
    }
  }

  // ── ABILITY: Call Backup (level 3+) ───────────────
  if(b.level>=3&&!b.backupSpawned){
    b.backupTimer--;
    if(b.backupTimer<=0){
      b.backupSpawned=true;
      PATROLS.push({x:140,y:55,dx:2.2,dy:0,bDx:2.2,bDy:0,minX:38,maxX:400,minY:0,maxY:0,
        frame:0,tick:0,state:'patrol',alertTimer:0,chaseTimer:0,searchTimer:0,_temp:660});
      setMapStatus('★ BACKUP DEPLOYED — extra guard incoming!');
    }
  }
  for(let i=PATROLS.length-1;i>=0;i--){
    if(PATROLS[i]._temp!==undefined){PATROLS[i]._temp--;if(PATROLS[i]._temp<=0)PATROLS.splice(i,1);}
  }

  // ── ABILITY: EMP Pulse (level 4+) ─────────────────
  if(b.level>=4&&!b.empFired){
    b.empTimer--;
    if(b.empTimer<=0){
      b.empFired=true;G.empActive=480;
      if(G.invisible>0){G.invisible=0;G.invisCooldown=2200;}
      spawnParticles(b.x,b.y,'#ffff00',28);shakeFrames=32;shakeAmp=9;
      setMapStatus('★ EMP PULSE — GHOST ability disabled 8s!');
    }
  }
  if(G.empActive>0)G.empActive--;

  // ── State machine (skip when charge is active) ────
  if(b.chargeActive===0){
    if(b.state==='patrol'){
      // wander unpredictably
      b._wander++;
      if(b._wander>70+Math.random()*50){
        b._wander=0;const a=Math.random()*Math.PI*2;const s=1.8+(b.level-1)*0.2;
        b.dx=Math.cos(a)*s;b.dy=Math.sin(a)*s;
      }
      b.x=Math.max(b.minX,Math.min(b.maxX,b.x+b.dx));
      b.y=Math.max(b.minY,Math.min(b.maxY,b.y+b.dy));
      if(canSee){b.state='alert';b.alertTimer=45;}
    } else if(b.state==='alert'){
      b.alertTimer--;
      if(!canSee&&b.alertTimer>15)b.state='patrol';
      else if(b.alertTimer<=0){b.state='chase';b.chaseTimer=290;}
    } else if(b.state==='chase'){
      b.chaseTimer--;
      const ang=Math.atan2(G.playerY-b.y,G.playerX-b.x);
      b.x+=Math.cos(ang)*b.spd;b.y+=Math.sin(ang)*b.spd;
      if(G.invisible>0){b.state='search';b.searchTimer=80;}
      else if(b.chaseTimer<=0||dist>190){b.state='search';b.searchTimer=80;}
      // Boss catch = 2 strikes
      if(dist<16&&G.spottedFlash===0&&G.safeZone===0){
        G.strikes+=2;
        const fine=Math.min(G.cash,120);G.cash-=fine;
        const mats=['reflectiveInk','neonDye','rareDenim','cyberThread'].filter(m=>G[m]>0);
        if(mats.length>0){const m=mats[Math.floor(Math.random()*mats.length)];G[m]--;if(mats.length>1){const m2=mats.filter(x=>x!==m)[0];G[m2]--;}}
        G.spottedFlash=80;shakeFrames=72;shakeAmp=16;
        spawnParticles(G.playerX,G.playerY,'#ff0000',32);
        const bsp=currentMap?currentMap.playerStart:{x:300,y:195};
        G.playerX=bsp.x;G.playerY=bsp.y;G.safeZone=180;
        b.state='patrol';b.chaseTimer=0;
        updateGameHUD();updateMapUI();
        if(G.strikes>=3){setTimeout(()=>showGameOver(),1000);return;}
        setMapStatus(`★ BOSS CAUGHT YOU — -$${fine} -2 STRIKES [${3-G.strikes} left]`);
      }
    } else if(b.state==='search'){
      b.searchTimer--;
      if(canSee){b.state='chase';b.chaseTimer=290;}
      else if(b.searchTimer<=0)b.state='patrol';
    }
  }

  // ── Draw boss ──────────────────────────────────────
  const bx=Math.round(b.x),by=Math.round(b.y);
  const pulse=0.85+Math.sin(ts*.007)*.15;

  // Vision circle
  const vc={patrol:'#cc0033',alert:'#ff8800',chase:'#ff0000',search:'#ff8800'}[b.state];
  const vA={patrol:0.06,alert:0.18,chase:0.26,search:0.12}[b.state];
  ctx.save();
  ctx.globalAlpha=vA*pulse;ctx.fillStyle=vc;
  ctx.beginPath();ctx.arc(bx,by,b.visionR,0,Math.PI*2);ctx.fill();
  ctx.globalAlpha=b.state==='patrol'?0.30:0.80;
  ctx.strokeStyle=vc;ctx.lineWidth=b.state==='patrol'?1.5:2.5;
  if(b.state==='patrol')ctx.setLineDash([6,8]);
  ctx.beginPath();ctx.arc(bx,by,b.visionR,0,Math.PI*2);ctx.stroke();
  ctx.setLineDash([]);ctx.restore();

  // Body (12×12)
  const ex=bx-6,ey=by-6;
  ctx.save();ctx.shadowColor='#ff0033';ctx.shadowBlur=14*pulse;
  ctx.fillStyle='#1a0000';ctx.fillRect(ex,ey,12,12);
  ctx.fillStyle='#ff1111';ctx.fillRect(ex+1,ey+1,3,3);ctx.fillRect(ex+8,ey+1,3,3);
  ctx.fillStyle='#ff0000';ctx.fillRect(ex+3,ey+6,6,4);
  ctx.fillStyle='#ff5555';ctx.fillRect(ex+4,ey+3,4,3);
  ctx.fillStyle='#0a0000';ctx.fillRect(ex+2,ey+10,2,2);ctx.fillRect(ex+7,ey+10,2,2);
  ctx.restore();

  // Labels
  ctx.save();ctx.textAlign='center';
  ctx.fillStyle='#ffd700';ctx.font='bold 9px monospace';ctx.shadowColor='#ffd700';ctx.shadowBlur=10;
  ctx.fillText('★',bx,by-b.visionR-7);
  ctx.shadowBlur=0;
  ctx.fillStyle=b.state==='patrol'?'#ff6666':'#ffaa00';ctx.font='bold 7px monospace';
  ctx.fillText(b.name,bx,by-15);
  if(b.state!=='patrol'){
    const lbl={alert:'! ALERT',chase:'!! CHASING',search:'? SEARCH'}[b.state];
    ctx.fillStyle='#ff4444';ctx.font='bold 8px monospace';ctx.shadowColor='#ff0000';ctx.shadowBlur=8;
    ctx.fillText(lbl,bx,by-25);
  }
  ctx.restore();

  // EMP active warning on canvas
  if(G.empActive>0){
    ctx.save();ctx.globalAlpha=(G.empActive%30>15)?0.75:0.30;
    ctx.fillStyle='#ffff00';ctx.font='bold 7px monospace';ctx.textAlign='center';
    ctx.fillText('⚡ EMP — GHOST BLOCKED ⚡',SW/2,15);ctx.restore();
  }
}
const MARKET_ITEMS = [
  {id:'tee',    label:'Plain Tee',      price:45,  col:'cyan', desc:'1x crafting blank'},
  {id:'ink',    label:'Reflective Ink', price:75,  col:'cyan', desc:'Unlocks Stealth & Glitch'},
  {id:'dye',    label:'Neon Dye',       price:95,  col:'pink', desc:'Unlocks Neon Flash & Glitch'},
  {id:'denim',  label:'Rare Denim',     price:140, col:'gold', desc:'Unlocks Denim Collab'},
  {id:'thread', label:'Cyber Thread',   price:85,  col:'cyan', desc:'Experimental mat'},
  {id:'bribe',  label:'Guard Bribe',    price:175, col:'gold', desc:'Stuns all guards today'},
  {id:'promo',  label:'Street Promo',   price:160, col:'pink', desc:'+20 Street Cred now'},
  {id:'turn',    label:'Extra Turn',     price:220, col:'gold', desc:'+1 scavenge turn today'},
  {id:'stunner', label:'Stun Grenade x2',price:110, col:'cyan', desc:'[Q] stun nearest guard, [E] finish'},
];

// ── Craft definitions ─────────────────────────────────
const CRAFT_DEF = {
  stealth:{name:'STEALTH BOMBER',pref:'stealth',base:180,cred:15},
  glitch: {name:'GLITCH-MEW',   pref:'flash',  base:350,cred:28},
  neon:   {name:'NEON FLASH',   pref:'flash',  base:220,cred:18},
  denim:  {name:'DENIM COLLAB', pref:'classic',base:280,cred:22},
  classic:{name:'CLASSIC LOGO', pref:'classic',base:80, cred:5 },
};

// ── Global state ──────────────────────────────────────
let sceneAnimId=null, gameRainId=null, _kbBound=false;
let mapParticles=[], shakeFrames=0, shakeAmp=0;
let floatTexts=[];
function spawnFloatText(x,y,text,col){
  floatTexts.push({x,y,text,col,life:65,max:65,vy:-0.75});
}
function drawFloatTexts(ctx){
  floatTexts=floatTexts.filter(t=>t.life>0);
  floatTexts.forEach(t=>{
    t.y+=t.vy;t.life--;
    ctx.save();ctx.globalAlpha=Math.min(1,t.life/18)*Math.min(1,(t.max-t.life+1)/8);
    ctx.fillStyle=t.col;ctx.font='bold 10px monospace';ctx.textAlign='center';
    ctx.shadowColor=t.col;ctx.shadowBlur=10;ctx.fillText(t.text,t.x,t.y);
    ctx.restore();
  });
}
function flashScreen(col){
  const el=document.getElementById('game-screen');if(!el)return;
  const d=document.createElement('div');
  const c=col==='gold'?'rgba(255,215,0,0.18)':col==='green'?'rgba(0,255,100,0.16)':'rgba(0,200,255,0.16)';
  d.style.cssText=`position:absolute;inset:0;pointer-events:none;z-index:50;background:${c};animation:screen-flash .45s ease forwards;`;
  el.appendChild(d);setTimeout(()=>d.remove(),450);
}
const G={
  screen:'map',day:1,
  custQueue:[],custIdx:0,
  custWalkX:660,custArrived:false,custFrame:0,custFrameTick:0,
  turns:3,playerX:300,playerY:195,
  playerFrame:0,playerFrameTick:0,playerDir:'down',playerMoving:false,
  keys:new Set(),spottedFlash:0,_ct:null,
  tees:3,reflectiveInk:1,neonDye:0,rareDenim:0,cyberThread:0,cash:200,cred:12,
  stamina:100, comboStreak:0, guardsBribed:0,
  invisible:0, invisCooldown:0, invisUnlocked:false,
  slowAura:0, slowCooldown:0, slowUnlocked:false,
  strikes:0, empActive:0, stunners:0, marketOpen:false, roundStartTimer:0, safeZone:0,
};

const winDrops=Array.from({length:18},()=>({
  x:Math.random()*132,y:Math.random()*112,
  spd:Math.random()*2+1,len:Math.floor(Math.random()*7)+4,
}));

// ── Sprites ───────────────────────────────────────────

function drawPixelCat(ctx,ox,oy,s,pal,frame=0){
  const f=(c,x,y,w,h)=>{ctx.fillStyle=c;ctx.fillRect(ox+x*s,oy+y*s,w*s,h*s);};
  f(pal.fur,1,0,2,2);f(pal.earIn,1,0,1,1);
  f(pal.fur,7,0,2,2);f(pal.earIn,8,0,1,1);
  f(pal.fur,1,2,8,6);
  f(pal.eye,2,4,2,2);f(pal.eyeS,3,4,1,1);
  f(pal.eye,6,4,2,2);f(pal.eyeS,7,4,1,1);
  f(pal.nose,4,6,2,1);
  f(pal.cheek,1,6,1,1);f(pal.cheek,8,6,1,1);
  f(pal.shirt,2,8,6,5);f(pal.shirt,1,9,1,3);f(pal.shirt,8,9,1,3);
  f(pal.fur,0,11,1,1);f(pal.fur,9,11,1,1);
  if(frame===0){f(pal.pants,2,13,3,6);f(pal.pants,5,13,3,6);}
  else{f(pal.pants,2,14,3,5);f(pal.pants,5,12,3,5);f(pal.pants,2,13,1,2);f(pal.pants,7,13,1,1);}
  f(pal.shoe,1,19,3,1);f(pal.shoe,5,19,4,1);
}

function drawPixelTee(ctx, ox, oy, s, col, dark) {
    ctx.fillStyle = col;
    ctx.fillRect(ox+2*s, oy+2*s, 6*s, 8*s);
    ctx.fillRect(ox,     oy+2*s, 3*s, 3*s);
    ctx.fillRect(ox+7*s, oy+2*s, 3*s, 3*s);
    ctx.fillStyle = dark;
    ctx.fillRect(ox+2*s, oy+2*s, 1*s, 8*s);
    ctx.fillRect(ox+7*s, oy+2*s, 1*s, 8*s);
    ctx.fillRect(ox+2*s, oy+9*s, 6*s, 1*s);
    ctx.fillStyle = '#666677';
    ctx.fillRect(ox+4*s, oy,     2*s, 2*s);
}

function drawSkateboard(ctx, ox, oy, s) {
    ctx.fillStyle = '#5a3a1a'; ctx.fillRect(ox,      oy,    14*s, 2*s);
    ctx.fillStyle = '#888888'; ctx.fillRect(ox+s,    oy+2*s, 2*s,  s);
    ctx.fillRect(ox+10*s, oy+2*s, 2*s, s);
    ctx.fillStyle = '#555555'; ctx.fillRect(ox+s,    oy+3*s, 2*s, 2*s);
    ctx.fillRect(ox+10*s, oy+3*s, 2*s, 2*s);
}

function drawPixelSign(ctx, text, x, y, ps, color, glow) {
    if (glow) { ctx.shadowColor = glow; ctx.shadowBlur = 10; }
    ctx.fillStyle = color;
    let curX = x;
    for (let i = 0; i < text.length; i++) {
        const map = FONT[text[i]];
        if (!map) { curX += 4 * ps; continue; }
        const cw = map[0].length;
        for (let r = 0; r < 7; r++)
            for (let c = 0; c < cw; c++)
                if (map[r][c]) ctx.fillRect(curX + c*ps, y + r*ps, ps, ps);
        curX += (cw + 1) * ps;
    }
    ctx.shadowBlur = 0;
}

// ── Top-down overhead sprite ───────────────────────────
function drawPlayerTop(ctx,x,y,s,pal,frame){
  const f=(c,dx,dy,w,h)=>{ctx.fillStyle=c;ctx.fillRect(x+dx*s,y+dy*s,w*s,h*s);};
  ctx.fillStyle='rgba(0,0,0,0.25)';ctx.beginPath();ctx.ellipse(x+4*s,y+8*s,3*s,s,0,0,Math.PI*2);ctx.fill();
  f(pal.fur,2,0,4,3);f(pal.fur,1,1,6,2);
  f(pal.earIn,1,0,1,1);f(pal.earIn,6,0,1,1);
  f(pal.shirt,1,2,6,4);
  if(frame===0){f(pal.pants,1,6,2,2);f(pal.pants,5,6,2,2);}
  else{f(pal.pants,1,7,2,1);f(pal.pants,5,6,2,2);}
  f(pal.shoe,1,8,2,1);f(pal.shoe,5,8,2,1);
}

// ── Player movement ────────────────────────────────────
function updatePlayer(){
  if(G.roundStartTimer>0)return;
  const sprinting=(G.keys.has('ShiftLeft')||G.keys.has('ShiftRight'))&&G.stamina>2;
  const spd=sprinting?3.6:1.8;
  if(sprinting) G.stamina=Math.max(0,G.stamina-1.2);
  else G.stamina=Math.min(100,G.stamina+0.42);
  let dx=0,dy=0;
  if(G.keys.has('KeyA')||G.keys.has('ArrowLeft'))  dx=-spd;
  if(G.keys.has('KeyD')||G.keys.has('ArrowRight')) dx= spd;
  if(G.keys.has('KeyW')||G.keys.has('ArrowUp'))    dy=-spd;
  if(G.keys.has('KeyS')||G.keys.has('ArrowDown'))  dy= spd;
  G.playerMoving=dx!==0||dy!==0;
  if(G.playerMoving){G.playerFrameTick++;if(G.playerFrameTick>=(sprinting?4:8)){G.playerFrameTick=0;G.playerFrame=(G.playerFrame+1)%2;}}
  const nx=G.playerX+dx;if(!collidesBlocks(nx,G.playerY))G.playerX=nx;
  const ny=G.playerY+dy;if(!collidesBlocks(G.playerX,ny))G.playerY=ny;
  G.playerX=Math.max(6,Math.min(SW-6,G.playerX));
  G.playerY=Math.max(6,Math.min(SH-6,G.playerY));
  // sprint trail
  if(sprinting&&G.playerMoving)
    mapParticles.push({x:G.playerX+(Math.random()-.5)*4,y:G.playerY+(Math.random()-.5)*4,vx:(Math.random()-.5)*.6,vy:(Math.random()-.5)*.6,life:10,max:10,col:'rgba(0,212,255,0.5)',r:1.5});

  // invisibility tick
  if(G.invisible>0){
    G.invisible--;
    if(G.playerMoving)
      mapParticles.push({x:G.playerX+(Math.random()-.5)*5,y:G.playerY+(Math.random()-.5)*5,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4,life:22,max:22,col:'rgba(160,80,255,0.55)',r:2.5});
    if(G.invisible===0){G.invisCooldown=2200;setMapStatus('GHOST faded — cooldown 37s');}
  }
  if(G.invisCooldown>0) G.invisCooldown--;

  // slow aura tick
  if(G.slowAura>0){
    G.slowAura--;
    // icy ring particles around player
    if(Math.random()<0.35)
      mapParticles.push({x:G.playerX+(Math.random()-.5)*SLOW_RANGE*2,y:G.playerY+(Math.random()-.5)*SLOW_RANGE*2,vx:(Math.random()-.5)*.5,vy:(Math.random()-.5)*.5,life:28,max:28,col:'rgba(0,200,255,0.45)',r:1.5});
    if(G.slowAura===0){G.slowCooldown=2800;setMapStatus('SLOW AURA faded — cooldown 47s');}
  }
  if(G.slowCooldown>0) G.slowCooldown--;

  // unlock Ghost at KNOWN (50 cred)
  if(!G.invisUnlocked&&G.cred>=50){
    G.invisUnlocked=true;
    setMapStatus('★ GHOST PROTOCOL UNLOCKED — Press [F] to vanish');
  }
  // unlock Slow Aura at LEGEND (75 cred)
  if(!G.slowUnlocked&&G.cred>=75){
    G.slowUnlocked=true;
    setMapStatus('★ SLOW AURA UNLOCKED — Press [C] to freeze the field');
  }

  // activate invisibility
  if(G.keys.has('KeyF')&&G.invisUnlocked&&G.invisible===0&&G.invisCooldown===0&&G.empActive===0){
    G.invisible=220;
    spawnParticles(G.playerX,G.playerY,'#aa44ff',18);
    setMapStatus('GHOST ACTIVE — guards cannot see you');
  }

  // activate slow aura
  if(G.keys.has('KeyC')&&G.slowUnlocked&&G.slowAura===0&&G.slowCooldown===0){
    G.slowAura=300;
    spawnParticles(G.playerX,G.playerY,'#00d4ff',22);
    setMapStatus('SLOW AURA ACTIVE — guards in range crawl');
  }
}
function collidesBlocks(px,py){
  const r=6;return MAP_BLOCKS.some(b=>px+r>b.x&&px-r<b.x+b.w&&py+r>b.y&&py-r<b.y+b.h);
}

// ── Hotspot collection ─────────────────────────────────
let SHOP_ENTER={x:600,y:180};
function spawnParticles(x,y,col,count=14){
  for(let i=0;i<count;i++){
    const a=(Math.PI*2/count)*i+(Math.random()-.5)*.7;
    const spd=Math.random()*2.8+0.8;
    mapParticles.push({x,y,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,life:32,max:32,col,r:Math.random()*2+1});
  }
}
function drawParticles(ctx){
  mapParticles=mapParticles.filter(p=>p.life>0);
  mapParticles.forEach(p=>{
    p.x+=p.vx;p.y+=p.vy;p.vx*=0.88;p.vy*=0.88;p.life--;
    ctx.globalAlpha=(p.life/p.max)*0.9;ctx.fillStyle=p.col;
    ctx.shadowColor=p.col;ctx.shadowBlur=5;
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();
  });
  ctx.shadowBlur=0;ctx.globalAlpha=1;
}

function throwStunner(){
  if(G.screen!=='map')return;
  if(G.stunners<=0){setMapStatus('No stun grenades — find SMOKE CAN or buy from market');return;}
  const STUN_RANGE=80;
  let target=null,minD=STUN_RANGE;
  PATROLS.forEach(p=>{
    if(p.eliminated||p.stunned>0)return;
    const d=Math.hypot(p.x-G.playerX,p.y-G.playerY);
    if(d<minD){minD=d;target=p;}
  });
  if(bossData&&!bossData.eliminated){
    const d=Math.hypot(bossData.x-G.playerX,bossData.y-G.playerY);
    if(d<minD){minD=d;target=bossData;}
  }
  if(!target){setMapStatus('No guards in range (80px)!');return;}
  G.stunners--;
  const isBoss=target===bossData;
  target.stunned=isBoss?130:220;
  target.state='patrol';target.alertTimer=0;target.chaseTimer=0;
  // throw arc particles
  const steps=7;
  for(let i=0;i<=steps;i++){
    const t=i/steps;
    const px=G.playerX+(target.x-G.playerX)*t;
    const py=G.playerY+(target.y-G.playerY)*t-Math.sin(t*Math.PI)*22;
    mapParticles.push({x:px,y:py,vx:(Math.random()-.5)*.5,vy:(Math.random()-.5)*.5,life:18,max:18,col:'#00ffcc',r:2});
  }
  spawnParticles(target.x,target.y,'#00ffcc',18);
  setMapStatus(isBoss?`★ BOSS stunned for 2s! (cannot eliminate boss)`:`Guard stunned! Walk up + [E] to eliminate`);
  updateGameHUD();
}

function tryCollect(){
  if(G.screen!=='map')return;
  let collected=false;
  // Eliminate stunned guard
  PATROLS.forEach((p,idx)=>{
    if(!p.stunned||p.stunned<=0||p.eliminated)return;
    if(Math.hypot(G.playerX-p.x,G.playerY-p.y)>22)return;
    p.eliminated=true;p.stunned=0;collected=true;
    spawnParticles(p.x,p.y,'#00ff88',22);
    G.cred=Math.min(100,G.cred+4);
    updateGameHUD();setMapStatus('Guard eliminated for today! +4 cred');
  });
  if(collected)return;
  // Hotspot collect
  HOTSPOTS.forEach(h=>{
    if(h.taken>=h.uses||Math.hypot(G.playerX-h.x,G.playerY-h.y)>22)return;
    G[h.mat]=(G[h.mat]||0)+1;h.taken++;collected=true;
    spawnParticles(h.x,h.y,h.col,20);
    spawnFloatText(h.x,h.y-14,'+ '+h.label,h.col);
    setMapStatus('+ Picked up: '+h.label);updateGameHUD();updateMapUI();
  });
  if(!collected&&Math.hypot(G.playerX-SHOP_ENTER.x,G.playerY-SHOP_ENTER.y)<15)enterShop();
  if(!collected&&Math.hypot(G.playerX-MARKET_POS.x,G.playerY-MARKET_POS.y)<36)openMarket();
}

// ── Status helper ──────────────────────────────────────
let _mapStatusTimer=null;
function setMapStatus(msg){
  const el=document.getElementById('mapStatus');
  if(el){el.textContent=msg;clearTimeout(_mapStatusTimer);_mapStatusTimer=setTimeout(()=>el.textContent='',2500);}
}

// ── Map draw ───────────────────────────────────────────
function drawMap(ctx,ts){
  if(G.safeZone>0&&G.roundStartTimer===0) G.safeZone--;
  ctx.save();
  if(shakeFrames>0){shakeFrames--;shakeAmp*=0.88;ctx.translate((Math.random()-.5)*shakeAmp,(Math.random()-.5)*shakeAmp);}
  const CM=currentMap||MAP_DEFS[0];
  ctx.fillStyle=CM.bg;ctx.fillRect(0,0,SW,SH);
  ctx.strokeStyle=CM.gridCol;ctx.lineWidth=1;
  for(let x=0;x<SW;x+=24){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,SH);ctx.stroke();}
  for(let y=0;y<SH;y+=24){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(SW,y);ctx.stroke();}
  ctx.save();ctx.strokeStyle=CM.dividerCol;ctx.lineWidth=1;ctx.setLineDash([10,14]);
  ctx.beginPath();ctx.moveTo(0,136);ctx.lineTo(SW,136);ctx.stroke();ctx.setLineDash([]);ctx.restore();

  MAP_BLOCKS.forEach(b=>{
    ctx.fillStyle=CM.wallFill;ctx.fillRect(b.x,b.y,b.w,b.h);
    ctx.strokeStyle=CM.wallStroke;ctx.lineWidth=1;ctx.strokeRect(b.x,b.y,b.w,b.h);
    for(let wy=b.y+8;wy<b.y+b.h-10;wy+=16)
      for(let wx=b.x+8;wx<b.x+b.w-10;wx+=18){
        const lit=Math.sin(ts*0.0007+wx*0.05+wy*0.09)>0;
        ctx.fillStyle=lit?CM.winLit:CM.winDark;ctx.fillRect(wx,wy,7,9);
        if(lit){ctx.fillStyle=CM.winGlow;ctx.fillRect(wx-2,wy-2,11,13);}
      }
  });

  CM.lights.forEach(([lx,ly])=>{
    const gp=ctx.createRadialGradient(lx,ly,1,lx,ly+20,45);
    gp.addColorStop(0,CM.lightGlow);gp.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=gp;ctx.fillRect(lx-45,ly,90,90);
    ctx.fillStyle='#2a2a3a';ctx.fillRect(lx-1,ly,2,SH);
    ctx.fillStyle=CM.lightPost;ctx.fillRect(lx-3,ly-2,6,4);
  });

  // ── Spawn / Safe zone marker (always visible) ─────────
  const SP=currentMap?currentMap.playerStart:{x:300,y:195};
  const spPulse=0.35+Math.sin(ts*.004)*0.15;
  ctx.save();
  ctx.globalAlpha=spPulse*0.12;ctx.fillStyle='#00ff88';
  ctx.beginPath();ctx.arc(SP.x,SP.y,20,0,Math.PI*2);ctx.fill();
  ctx.globalAlpha=spPulse*0.4;ctx.strokeStyle='#00ff88';ctx.lineWidth=1;ctx.setLineDash([3,5]);
  ctx.beginPath();ctx.arc(SP.x,SP.y,20,0,Math.PI*2);ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha=spPulse*0.7;ctx.fillStyle='#00ff88';ctx.font='bold 6px monospace';ctx.textAlign='center';
  ctx.fillText('SPAWN',SP.x,SP.y+30);
  ctx.restore();

  const SE=SHOP_ENTER;
  const sg=ctx.createRadialGradient(SE.x,SE.y,2,SE.x,SE.y,50);
  sg.addColorStop(0,'rgba(0,255,136,0.3)');sg.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=sg;ctx.fillRect(SE.x-50,SE.y-50,100,100);
  ctx.fillStyle='#0a1a10';ctx.fillRect(SE.x-8,SE.y-25,22,25);
  ctx.strokeStyle='#00ff88';ctx.lineWidth=2;ctx.strokeRect(SE.x-8,SE.y-25,22,25);
  drawPixelSign(ctx,'OPEN',SE.x-5,SE.y-22,1,'#00ff88','#00ff88');

  // ── Street Market ─────────────────────────────────────
  const MK=MARKET_POS;
  const mkPulse=0.7+Math.sin(ts*0.003)*0.3;
  const mg=ctx.createRadialGradient(MK.x,MK.y,2,MK.x,MK.y,40);
  mg.addColorStop(0,'rgba(255,215,0,0.28)');mg.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=mg;ctx.fillRect(MK.x-40,MK.y-40,80,80);
  ctx.fillStyle='#1a1500';ctx.fillRect(MK.x-10,MK.y-26,24,26);
  ctx.strokeStyle=`rgba(255,215,0,${mkPulse})`;ctx.lineWidth=2;ctx.strokeRect(MK.x-10,MK.y-26,24,26);
  ctx.save();ctx.fillStyle='#ffd700';ctx.font='bold 6px monospace';ctx.textAlign='center';
  ctx.fillText('MARKET',MK.x+2,MK.y+10);ctx.restore();
  drawPixelSign(ctx,'N',MK.x-7,MK.y-23,1,'#ffd700','#ffd700');
  if(Math.hypot(G.playerX-MK.x,G.playerY-MK.y)<36){
    ctx.save();ctx.fillStyle='#ffd700';ctx.font='bold 8px monospace';ctx.textAlign='center';
    ctx.fillText('[E] Buy Items',MK.x+2,MK.y+22);ctx.restore();
  }

  HOTSPOTS.forEach(h=>{
    if(h.taken>=h.uses)return;
    const pulse=0.6+Math.sin(ts*0.004+h.x*0.02)*0.4;
    ctx.save();ctx.shadowColor=h.col;ctx.shadowBlur=8;
    ctx.globalAlpha=pulse*0.35;ctx.fillStyle=h.col;ctx.beginPath();ctx.arc(h.x,h.y,10,0,Math.PI*2);ctx.fill();
    ctx.globalAlpha=pulse;ctx.strokeStyle=h.col;ctx.lineWidth=1;ctx.beginPath();ctx.arc(h.x,h.y,6,0,Math.PI*2);ctx.stroke();
    ctx.restore();
    ctx.save();ctx.fillStyle=h.col;ctx.font='bold 6px monospace';ctx.textAlign='center';
    ctx.fillText(h.label,h.x,h.y-12);
    if(Math.hypot(G.playerX-h.x,G.playerY-h.y)<22){ctx.fillStyle='#fff';ctx.font='bold 7px monospace';ctx.fillText('[E]',h.x,h.y+18);}
    ctx.restore();
  });

  if(G.guardsBribed>0) G.guardsBribed--;
  const CHASE_SPD=2.8+(G.day-1)*0.18;

  PATROLS.forEach(p=>{
    if(p.eliminated)return;
    // Freeze during countdown or market
    if(G.roundStartTimer>0||G.marketOpen){
      const ex=Math.round(p.x)-4,ey=Math.round(p.y)-4;
      ctx.save();ctx.globalAlpha=0.25;
      ctx.fillStyle='#cc2222';ctx.fillRect(ex,ey,8,8);
      ctx.fillStyle='#ff5555';ctx.fillRect(ex+1,ey+1,2,2);ctx.fillRect(ex+5,ey+1,2,2);
      ctx.restore();
      return;
    }
    const bribed=G.guardsBribed>0;
    const stunned=bribed||p.stunned>0;
    const dist=Math.hypot(p.x-G.playerX,p.y-G.playerY);
    const canSee=dist<VISION_RANGE&&G.invisible===0&&G.spottedFlash===0;
    const slowed=G.slowAura>0&&dist<SLOW_RANGE;
    const slowMult=slowed?0.22:1;

    // ── State machine ──────────────────────────────────
    if(p.stunned>0)p.stunned--;
    if(stunned){
      p.state='patrol';p.alertTimer=0;p.chaseTimer=0;
    } else if(p.state==='patrol'){
      p.tick++;if(p.tick>=5){p.tick=0;p.frame=(p.frame+1)%2;}
      p.x+=p.dx*slowMult;p.y+=p.dy*slowMult;
      if(p.dx!==0&&(p.x<p.minX||p.x>p.maxX))p.dx=-p.dx;
      if(p.dy!==0&&(p.y<p.minY||p.y>p.maxY))p.dy=-p.dy;
      if(canSee){p.state='alert';p.alertTimer=55;}
    } else if(p.state==='alert'){
      p.alertTimer--;
      if(!canSee&&p.alertTimer>20){p.state='patrol';}
      else if(p.alertTimer<=0){p.state='chase';p.chaseTimer=220;}
    } else if(p.state==='chase'){
      p.chaseTimer--;
      const ang=Math.atan2(G.playerY-p.y,G.playerX-p.x);
      p.x+=Math.cos(ang)*CHASE_SPD*slowMult; p.y+=Math.sin(ang)*CHASE_SPD*slowMult;
      if(G.invisible>0){p.state='search';p.searchTimer=90;} // lost in ghost
      else if(p.chaseTimer<=0||dist>140){p.state='search';p.searchTimer=90;}
      // ── CAUGHT ────────────────────────────────────────
      if(dist<14&&G.spottedFlash===0&&G.turns>0&&G.safeZone===0){
        G.turns=Math.max(0,G.turns-1);
        G.strikes++;
        const fine=Math.min(G.cash,60); G.cash-=fine;
        const mats=['reflectiveInk','neonDye','rareDenim','cyberThread'].filter(m=>G[m]>0);
        let dropped=null;
        if(mats.length){const m=mats[Math.floor(Math.random()*mats.length)];G[m]--;dropped=m;}
        G.spottedFlash=65;shakeFrames=55;shakeAmp=13;
        spawnParticles(G.playerX,G.playerY,'#ff3535',26);
        const rsp=currentMap?currentMap.playerStart:{x:300,y:195};
        G.playerX=rsp.x;G.playerY=rsp.y;G.safeZone=180;
        p.state='patrol';p.chaseTimer=0;
        updateGameHUD();updateMapUI();
        const remaining=3-G.strikes;
        if(G.strikes>=3){setTimeout(()=>showGameOver(),900);return;}
        setMapStatus((dropped?`!! CAUGHT — -$${fine}, dropped ${dropped}!`:`!! CAUGHT — -$${fine}!`)+` [${remaining} strike${remaining===1?'':'s'} left]`);
      }
    } else if(p.state==='search'){
      p.searchTimer--;
      if(canSee){p.state='chase';p.chaseTimer=220;}
      else if(p.searchTimer<=0) p.state='patrol';
    }

    // ── Draw vision circle ─────────────────────────────
    const ex=Math.round(p.x)-4,ey=Math.round(p.y)-4;
    const vc={patrol:'#ff4444',alert:'#ffcc00',chase:'#ff0000',search:'#ffcc00'}[p.state];
    const vFill={patrol:0.045,alert:0.16,chase:0.22,search:0.10}[p.state];
    ctx.save();
    ctx.globalAlpha=vFill*(0.85+Math.sin(ts*.005)*0.15)*(slowed?0.35:1);
    ctx.fillStyle=slowed?'#0088aa':vc;ctx.beginPath();ctx.arc(p.x,p.y,VISION_RANGE,0,Math.PI*2);ctx.fill();
    ctx.globalAlpha=(p.state==='patrol'?0.20:0.65)*(slowed?0.4:1);
    ctx.strokeStyle=slowed?'#00aacc':vc;ctx.lineWidth=p.state==='patrol'?1:2;
    if(p.state==='patrol')ctx.setLineDash([4,6]);
    ctx.beginPath();ctx.arc(p.x,p.y,VISION_RANGE,0,Math.PI*2);ctx.stroke();
    ctx.setLineDash([]);ctx.restore();
    // slow indicator
    if(slowed){
      ctx.save();ctx.fillStyle='#00d4ff';ctx.font='bold 8px monospace';ctx.textAlign='center';
      ctx.shadowColor='#00d4ff';ctx.shadowBlur=8;
      ctx.globalAlpha=0.7+Math.sin(ts*.02)*0.3;
      ctx.fillText('❄',p.x,p.y-14);ctx.restore();
    }

    // ── Draw guard sprite ──────────────────────────────
    if(stunned){
      const isPersonalStun=p.stunned>0;
      const sc=isPersonalStun?'#00ffcc':'#aaaa00';
      ctx.save();ctx.globalAlpha=0.5+Math.sin(ts*.018)*0.2;
      ctx.fillStyle=isPersonalStun?'#003322':'#1a1a00';ctx.fillRect(ex,ey,8,8);
      ctx.fillStyle=sc;ctx.fillRect(ex+1,ey+1,2,2);ctx.fillRect(ex+5,ey+1,2,2);
      ctx.fillStyle=isPersonalStun?'#006644':'#888800';ctx.fillRect(ex+2,ey+4,4,2);
      if(isPersonalStun){ctx.shadowColor='#00ffcc';ctx.shadowBlur=8;}
      ctx.font='bold 6px monospace';ctx.fillStyle=sc;ctx.textAlign='center';
      ctx.fillText('ZZZ',p.x,p.y-12);
      // stun bar
      const barW=20,barFill=(p.stunned/220)*barW;
      ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(p.x-10,p.y-20,barW,3);
      ctx.fillStyle='#00ffcc';ctx.fillRect(p.x-10,p.y-20,barFill,3);
      ctx.restore();
      // [E] FINISH prompt
      if(isPersonalStun&&Math.hypot(G.playerX-p.x,G.playerY-p.y)<22){
        ctx.save();ctx.fillStyle='#00ff88';ctx.font='bold 7px monospace';ctx.textAlign='center';
        ctx.shadowColor='#00ff88';ctx.shadowBlur=6;
        ctx.fillText('[E] FINISH',p.x,p.y+18);ctx.restore();
      }
    } else {
      const gc={patrol:'#cc2222',alert:'#cc8800',chase:'#ff1111',search:'#cc8800'}[p.state];
      ctx.fillStyle=gc;ctx.fillRect(ex,ey,8,8);
      ctx.fillStyle='#fff';ctx.fillRect(ex+1,ey+1,2,2);ctx.fillRect(ex+5,ey+1,2,2);
      ctx.fillStyle=p.state==='patrol'?'#881111':'#ff6600';ctx.fillRect(ex+2,ey+4,4,2);
      if(p._bouncer){
        ctx.save();ctx.fillStyle='#ffd700';ctx.font='bold 6px monospace';ctx.textAlign='center';
        ctx.shadowColor='#ffd700';ctx.shadowBlur=6;ctx.fillText('B',p.x,p.y-11);ctx.restore();
      }
      if(p.state!=='patrol'){
        ctx.save();
        ctx.fillStyle=p.state==='chase'?'#ff4444':'#ffcc00';
        ctx.font='bold 7px monospace';ctx.textAlign='center';
        ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=6;
        ctx.fillText(p.state==='chase'?'!! CHASE':p.state==='alert'?'! ALERT':'? ...',p.x,p.y-14);
        ctx.restore();
      }
    }
  });

  if(G.spottedFlash>0){
    ctx.save();ctx.globalAlpha=(G.spottedFlash/45)*0.4;ctx.fillStyle='#ff0000';ctx.fillRect(0,0,SW,SH);ctx.restore();
    G.spottedFlash--;
    ctx.save();ctx.fillStyle='#ff4444';ctx.font='bold 12px monospace';ctx.textAlign='center';ctx.fillText('!! SPOTTED !!',SW/2,SH/2);ctx.restore();
  }

  // ── Safe zone visual ──────────────────────────────────
  if(G.safeZone>0&&G.roundStartTimer===0){
    const szRatio=G.safeZone/180;
    const szPulse=0.55+Math.sin(ts*.018)*.25;
    const szR=30;
    ctx.save();
    ctx.globalAlpha=szRatio*0.18;ctx.fillStyle='#00ff88';
    ctx.beginPath();ctx.arc(G.playerX,G.playerY,szR,0,Math.PI*2);ctx.fill();
    ctx.globalAlpha=szRatio*szPulse;ctx.strokeStyle='#00ff88';ctx.lineWidth=2;
    ctx.setLineDash([4,4]);ctx.lineDashOffset=-(ts*.05%8);
    ctx.beginPath();ctx.arc(G.playerX,G.playerY,szR,0,Math.PI*2);ctx.stroke();
    ctx.setLineDash([]);
    ctx.shadowColor='#00ff88';ctx.shadowBlur=12;
    ctx.fillStyle='#00ff88';ctx.font='bold 7px monospace';ctx.textAlign='center';
    ctx.globalAlpha=szRatio;ctx.fillText('SAFE ZONE',G.playerX,G.playerY-36);
    // timer bar
    ctx.shadowBlur=0;ctx.globalAlpha=0.4;ctx.fillStyle='rgba(0,0,0,.5)';
    ctx.fillRect(G.playerX-18,G.playerY-44,36,3);
    ctx.globalAlpha=szRatio;ctx.fillStyle='#00ff88';
    ctx.fillRect(G.playerX-18,G.playerY-44,szRatio*36,3);
    ctx.restore();
  }

  const ppx=Math.round(G.playerX)-8,ppy=Math.round(G.playerY)-8;
  const sprinting=(G.keys.has('ShiftLeft')||G.keys.has('ShiftRight'))&&G.stamina>2;
  const ghosting=G.invisible>0;
  const slowing=G.slowAura>0;

  // draw slow aura ring behind player
  if(slowing){
    const pulse=0.5+Math.sin(ts*.008)*0.18;
    const ringProgress=G.slowAura/300;
    ctx.save();
    // outer ring fill
    ctx.globalAlpha=0.07+Math.sin(ts*.006)*0.03;
    const ag=ctx.createRadialGradient(G.playerX,G.playerY,SLOW_RANGE*0.5,G.playerX,G.playerY,SLOW_RANGE);
    ag.addColorStop(0,'rgba(0,180,255,0)');ag.addColorStop(1,'rgba(0,180,255,0.35)');
    ctx.fillStyle=ag;ctx.beginPath();ctx.arc(G.playerX,G.playerY,SLOW_RANGE,0,Math.PI*2);ctx.fill();
    // ring border — dashed, rotating feel via lineDashOffset
    ctx.globalAlpha=0.55+Math.sin(ts*.01)*0.2;
    ctx.strokeStyle='#00d4ff';ctx.lineWidth=1.5;ctx.setLineDash([6,8]);
    ctx.lineDashOffset=-(ts*0.04%14);
    ctx.beginPath();ctx.arc(G.playerX,G.playerY,SLOW_RANGE,0,Math.PI*2);ctx.stroke();
    ctx.setLineDash([]);
    // timer arc (drains clockwise)
    ctx.globalAlpha=0.7;ctx.strokeStyle='#00ffff';ctx.lineWidth=2;
    ctx.beginPath();ctx.arc(G.playerX,G.playerY,SLOW_RANGE+4,-Math.PI/2,-Math.PI/2+Math.PI*2*ringProgress);ctx.stroke();
    ctx.restore();
  }

  ctx.save();
  if(ghosting){ctx.globalAlpha=0.22+Math.sin(ts*.025)*0.08;ctx.shadowColor='#aa44ff';ctx.shadowBlur=18;}
  else if(slowing){ctx.shadowColor='#00d4ff';ctx.shadowBlur=16;}
  else if(sprinting){ctx.shadowColor='#00d4ff';ctx.shadowBlur=14;}
  drawPlayerTop(ctx,ppx,ppy,2,PAL.player,G.playerFrame);
  ctx.restore();
  ctx.save();
  ctx.fillStyle=ghosting?'#aa44ff':slowing?'#00d4ff':sprinting?'#00d4ff':'rgba(200,164,106,0.7)';
  ctx.font='6px monospace';ctx.textAlign='center';
  ctx.fillText(ghosting?'GHOST':slowing?'SLOW':'YOU',G.playerX,G.playerY-12);
  ctx.restore();
  const shopDist=Math.hypot(G.playerX-SE.x,G.playerY-SE.y);
  if(shopDist<40){
    const hasMat=(G.reflectiveInk+G.neonDye+G.rareDenim+G.cyberThread)>0;
    const ready=G.tees>0&&hasMat&&shopDist<15;
    const hint=ready?'[E] Enter Shop':G.tees===0?'Need tees':!hasMat?'Need a material':'Get closer...';
    const hcol=ready?'#00ff88':shopDist<15?'#ff6b35':'rgba(255,255,255,.35)';
    ctx.save();ctx.fillStyle=hcol;ctx.font='bold 8px monospace';ctx.textAlign='center';
    ctx.fillText(hint,SE.x,SE.y+30);ctx.restore();
  }
  drawParticles(ctx);
  drawFloatTexts(ctx);
  updateAndDrawBoss(ctx,ts);

  // ── Round start countdown ──────────────────────────────
  if(G.roundStartTimer>0){
    G.roundStartTimer--;
    const t=G.roundStartTimer;
    const num=t>120?'3':t>60?'2':t>0?'1':null;
    const isBossDay=G.day%5===0;
    const accent=isBossDay?'#ff3535':'#00d4ff';
    // dim overlay
    ctx.save();
    ctx.globalAlpha=0.55;ctx.fillStyle='rgba(0,0,0,0.55)';ctx.fillRect(0,0,SW,SH);
    // big number with pulse scale
    const phase=(t%60)/60;
    const scale=1.4-phase*0.4;
    const numAlpha=0.9+Math.sin(phase*Math.PI)*0.1;
    ctx.globalAlpha=numAlpha;
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.shadowColor=accent;ctx.shadowBlur=30;
    ctx.font=`bold ${Math.round(64*scale)}px monospace`;
    ctx.fillStyle=accent;
    ctx.fillText(num||'GO!',SW/2,SH/2);
    // label below
    ctx.shadowBlur=0;ctx.globalAlpha=0.55;
    ctx.font='bold 8px monospace';ctx.fillStyle='rgba(255,255,255,0.6)';
    ctx.fillText(isBossDay?'★ BOSS DAY — PREPARE':'DAY '+G.day+' — GET READY',SW/2,SH/2+36);
    // spawn burst particles on number change
    if(t===120||t===60)spawnParticles(SW/2,SH/2,accent,20);
    if(t===1)spawnParticles(SW/2,SH/2,'#ffffff',28);
    ctx.textBaseline='alphabetic';
    ctx.restore();
  }

  ctx.restore();
}

// ── Shop draw ──────────────────────────────────────────
function drawShop(ctx,ts){
  ctx.clearRect(0,0,SW,SH);
  ctx.fillStyle='#0c0c18';ctx.fillRect(0,0,SW,FLY);
  ctx.strokeStyle='#121220';ctx.lineWidth=1;
  for(let y=12;y<FLY;y+=14){
    ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(SW,y);ctx.stroke();
    const off=((y/14|0)%2)*28;
    for(let x=off;x<SW;x+=56){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y+14);ctx.stroke();}
  }
  const WX=432,WY=22,WW=132,WH=112;
  const grd=ctx.createRadialGradient(WX+WW/2,WY+WH/2,6,WX+WW/2,WY+WH/2,WW);
  grd.addColorStop(0,'rgba(0,90,180,0.28)');grd.addColorStop(1,'rgba(0,0,20,0)');
  ctx.fillStyle=grd;ctx.fillRect(WX-35,WY-25,WW+70,WH+50);
  ctx.fillStyle='#080815';ctx.fillRect(WX,WY,WW,WH);
  const nhz=ctx.createLinearGradient(WX,WY,WX+WW,WY+WH);
  nhz.addColorStop(0,'rgba(0,55,120,0.45)');nhz.addColorStop(0.5,'rgba(70,0,110,0.3)');nhz.addColorStop(1,'rgba(0,55,120,0.45)');
  ctx.fillStyle=nhz;ctx.fillRect(WX,WY,WW,WH);
  ctx.save();ctx.beginPath();ctx.rect(WX,WY,WW,WH);ctx.clip();
  ctx.strokeStyle='rgba(100,185,255,0.45)';ctx.lineWidth=1;
  winDrops.forEach(d=>{ctx.beginPath();ctx.moveTo(WX+d.x,WY+d.y);ctx.lineTo(WX+d.x-1,WY+d.y+d.len);ctx.stroke();d.y+=d.spd;if(d.y>WH){d.y=-d.len;d.x=Math.random()*WW;}});
  ctx.restore();
  ctx.strokeStyle='#242448';ctx.lineWidth=3;ctx.strokeRect(WX,WY,WW,WH);ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(WX+WW/2,WY);ctx.lineTo(WX+WW/2,WY+WH);ctx.stroke();
  ctx.beginPath();ctx.moveTo(WX,WY+WH/2);ctx.lineTo(WX+WW,WY+WH/2);ctx.stroke();
  ctx.fillStyle='rgba(0,65,155,0.07)';ctx.beginPath();ctx.moveTo(WX,FLY);ctx.lineTo(WX-28,SH);ctx.lineTo(WX+WW+28,SH);ctx.lineTo(WX+WW,FLY);ctx.closePath();ctx.fill();
  const RX=20,RY=42,RW=168;
  ctx.fillStyle='#33334a';ctx.fillRect(RX,RY,3,FLY-RY);ctx.fillRect(RX+RW,RY,3,FLY-RY);
  ctx.fillStyle='#44445a';ctx.fillRect(RX,RY,RW+3,4);
  const teeC=['#1a1a2a','#2a1515','#0a1a15','#2a2a1a'],teeD=['#0f0f18','#1a0a0a','#050f0a','#1a1a0a'];
  for(let i=0;i<4;i++)drawPixelTee(ctx,RX+8+i*40,RY-4,3,teeC[i],teeD[i]);
  const flicker=Math.sin(ts*0.0031)>0.97?0.2:1;
  ctx.save();ctx.globalAlpha=flicker;ctx.fillStyle='rgba(55,0,45,0.65)';ctx.fillRect(200,14,115,18);
  ctx.strokeStyle='rgba(255,0,170,0.45)';ctx.lineWidth=1;ctx.strokeRect(200,14,115,18);
  drawPixelSign(ctx,'OPEN',206,17,2,'#ff00aa','#ff00aa');ctx.restore();
  drawPixelCat(ctx,232,FLY-80,4,PAL.player);
  const KX=186,KY=FLY-32,KW=154,KH=32;
  ctx.fillStyle='#10101a';ctx.fillRect(KX,KY,KW,KH);ctx.fillStyle='#1c1c2e';ctx.fillRect(KX,KY,KW,5);
  ctx.fillStyle='#0a0a12';ctx.fillRect(KX,KY+5,KW,KH-5);ctx.strokeStyle='#22223a';ctx.lineWidth=1;ctx.strokeRect(KX,KY,KW,KH);
  ctx.fillStyle='#18222e';ctx.fillRect(KX+KW-37,KY-17,30,17);
  ctx.fillStyle='rgba(0,175,120,0.75)';ctx.fillRect(KX+KW-31,KY-12,19,7);
  ctx.fillStyle='rgba(0,220,150,0.4)';ctx.fillRect(KX+KW-28,KY-10,12,4);
  ctx.fillStyle='#0c0908';ctx.fillRect(0,FLY,SW,SH-FLY);
  ctx.strokeStyle='#1a1410';ctx.lineWidth=1;
  for(let x=0;x<SW;x+=22){ctx.beginPath();ctx.moveTo(x,FLY);ctx.lineTo(x,SH);ctx.stroke();}
  ctx.strokeStyle='#161210';
  for(let i=1;i<5;i++){const fy=FLY+(SH-FLY)*(i/5);ctx.beginPath();ctx.moveTo(0,fy);ctx.lineTo(SW,fy);ctx.stroke();}
  ctx.fillStyle='rgba(0,90,200,0.05)';ctx.fillRect(WX-20,FLY,WW+40,SH-FLY);
  const cust=G.custQueue[G.custIdx];
  if(cust){
    if(!G.custArrived){G.custWalkX-=2.2;if(G.custWalkX<=390){G.custArrived=true;G.custWalkX=390;}}
    G.custFrameTick++;if(G.custFrameTick>=8){G.custFrameTick=0;G.custFrame=(G.custFrame+1)%2;}
    const frm=G.custArrived?0:G.custFrame;
    drawPixelCat(ctx,G.custWalkX,FLY-80,4,cust.pal,frm);
    if(cust.skateboard)drawSkateboard(ctx,G.custWalkX-8,FLY-13,3);
    if(G.custArrived){
      const bob=Math.sin(ts*0.004)*3;
      ctx.fillStyle='rgba(255,255,80,0.85)';ctx.beginPath();
      ctx.moveTo(G.custWalkX+20,FLY-86+bob);ctx.lineTo(G.custWalkX+15,FLY-96+bob);ctx.lineTo(G.custWalkX+25,FLY-96+bob);
      ctx.closePath();ctx.fill();
    }
  }
  drawParticles(ctx);
  drawFloatTexts(ctx);
}

// ── Game loop ──────────────────────────────────────────
let _staminaTick=0;
function gameLoop(ts){
  const gc=document.getElementById('game-canvas');if(!gc)return;
  const ctx=gc.getContext('2d');
  if(G.screen==='map'){
    updatePlayer();drawMap(ctx,ts);
    if(++_staminaTick>=6){_staminaTick=0;updateStaminaHUD();}
  }else drawShop(ctx,ts);
  sceneAnimId=requestAnimationFrame(gameLoop);
}
function updateStaminaHUD(){
  const sf=document.getElementById('stamina-fill');
  if(sf){sf.style.width=G.stamina+'%';sf.className='stamina-fill'+(G.stamina<25?' empty':G.stamina<55?' low':'');}
  const sn=document.getElementById('stamina-num');
  if(sn)sn.textContent=G.stamina>=90?'FRESH':G.stamina>=55?'HOLD SHIFT: SPRINT':G.stamina>=25?'LOW — REST':G.stamina>2?'CRITICAL':'EXHAUSTED';

  // ability HUD
  const is=document.getElementById('invis-status');
  const ibw=document.getElementById('invis-bar-wrap');
  const ib=document.getElementById('invis-bar');
  if(!is)return;
  if(!G.invisUnlocked){is.className='invis-status invis-locked';is.textContent='GHOST — Reach KNOWN (50 cred)';if(ibw)ibw.style.display='none';}
  else if(G.invisible>0){
    is.className='invis-status invis-active';
    is.textContent='GHOST ACTIVE — '+(Math.ceil(G.invisible/60))+'s';
    if(ibw)ibw.style.display='block';
    if(ib)ib.style.width=(G.invisible/220*100)+'%';
  } else if(G.invisCooldown>0){
    is.className='invis-status invis-cool';
    is.textContent='GHOST — cooldown '+Math.ceil(G.invisCooldown/60)+'s';
    if(ibw)ibw.style.display='block';
    if(ib)ib.style.width=((2200-G.invisCooldown)/2200*100)+'%';
  } else {
    is.className='invis-status invis-ready';
    is.textContent='GHOST — Press [F] to vanish';
    if(ibw)ibw.style.display='none';
  }

  // slow aura HUD
  const ss=document.getElementById('slow-status');
  const sbw=document.getElementById('slow-bar-wrap');
  const sb=document.getElementById('slow-bar');
  if(!ss)return;
  if(!G.slowUnlocked){ss.className='invis-status invis-locked';ss.textContent='SLOW AURA — Reach LEGEND (75 cred)';}
  else if(G.slowAura>0){
    ss.className='invis-status slow-active';
    ss.textContent='AURA ACTIVE — '+(Math.ceil(G.slowAura/60))+'s';
    if(sbw)sbw.style.display='block';
    if(sb)sb.style.width=(G.slowAura/300*100)+'%';
  } else if(G.slowCooldown>0){
    ss.className='invis-status slow-cool';
    ss.textContent='SLOW AURA — cooldown '+Math.ceil(G.slowCooldown/60)+'s';
    if(sbw)sbw.style.display='block';
    if(sb)sb.style.width=((2800-G.slowCooldown)/2800*100)+'%';
  } else {
    ss.className='invis-status slow-ready';
    ss.textContent='SLOW AURA — Press [C] to chill';
    if(sbw)sbw.style.display='none';
  }
}

// ── Keyboard ───────────────────────────────────────────
function onGameKey(e){
  G.keys.add(e.code);
  if(e.code==='KeyE')tryCollect();
  if(e.code==='KeyQ')throwStunner();
  if(e.code==='Escape')closeMarket();
  if((e.code==='Enter'||e.code==='NumpadEnter')&&G.screen==='map'&&Math.hypot(G.playerX-SHOP_ENTER.x,G.playerY-SHOP_ENTER.y)<40)enterShop();
  if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();
}
function onGameKeyUp(e){G.keys.delete(e.code);}

// ── Map UI update ──────────────────────────────────────
function updateMapUI(){
  const el=id=>document.getElementById(id);
  if(el('mapTurns'))el('mapTurns').textContent=G.turns;
  if(el('mapDay'))el('mapDay').textContent=G.day;
  const mats=[];
  if(G.reflectiveInk)mats.push('Ref.Ink x'+G.reflectiveInk);
  if(G.neonDye)mats.push('NeonDye x'+G.neonDye);
  if(G.rareDenim)mats.push('Denim x'+G.rareDenim);
  if(G.cyberThread)mats.push('Thread x'+G.cyberThread);
  if(el('mapMats'))el('mapMats').textContent=mats.length?mats.join(' | '):'--';
}

// ── Cred tier ──────────────────────────────────────────
function credTier(){
  if(G.cred>=75)return{mult:1.6,label:'LEGEND'};
  if(G.cred>=50)return{mult:1.35,label:'KNOWN'};
  if(G.cred>=25)return{mult:1.15,label:'RISING'};
  return{mult:1,label:'ROOKIE'};
}

// ── Build craft options ────────────────────────────────
function buildCraftOptions(){
  const opts=[];
  if(G.tees>0){
    if(G.reflectiveInk>0&&G.neonDye>0)opts.push({id:'glitch', def:CRAFT_DEF.glitch,  cost:'1 Tee + Ink + Dye',tag:'pink'});
    if(G.reflectiveInk>0)             opts.push({id:'stealth',def:CRAFT_DEF.stealth, cost:'1 Tee + 1 Ref.Ink',tag:'cyan'});
    if(G.neonDye>0)                   opts.push({id:'neon',   def:CRAFT_DEF.neon,    cost:'1 Tee + 1 NeonDye',tag:'pink'});
    if(G.rareDenim>0)                 opts.push({id:'denim',  def:CRAFT_DEF.denim,   cost:'1 Tee + 1 Denim',  tag:'gold'});
    opts.push({id:'classic',def:CRAFT_DEF.classic,cost:'1 Tee only',tag:'gold'});
  }
  const keys=['A','B','C','D','E'];
  const cust=G.custQueue[G.custIdx];
  const el=document.getElementById('craftOptions');if(!el)return;
  if(opts.length===0){el.innerHTML='<div class="craft-header">No tees — cannot craft.</div>';el.style.display='block';return;}
  const tier=credTier();
  el.innerHTML='<div class="craft-header">Choose your craft:</div><div class="craft-grid">'+
    opts.map((o,i)=>{
      const match=cust&&o.def.pref===cust.pref;
      const earn=Math.round(o.def.base*tier.mult*(match?1.25:1));
      return`<button class="craft-card${match?' match-card':''}" onclick="craft('${o.id}')">
        <div class="craft-key">${keys[i]}</div><div class="craft-name">${o.def.name}</div>
        <div class="craft-info">${o.cost}</div>
        <div class="craft-tags"><span class="ctag ctag-${o.tag}">~$${earn}</span>${match?'<span class="ctag ctag-cyan">MATCH</span>':''}</div>
      </button>`;
    }).join('')+'</div>';
  el.style.display='block';
}

// ── Craft resolution ───────────────────────────────────
function craft(id){
  const def=CRAFT_DEF[id];if(!def)return;
  const cust=G.custQueue[G.custIdx];
  const tier=credTier();
  let earn=Math.round(def.base*tier.mult),credEarn=def.cred,verdict,vcls;
  let comboLine='';
  if(cust&&def.pref===cust.pref){
    earn=Math.round(earn*1.25);credEarn=Math.round(credEarn*1.4);
    G.comboStreak++;
    if(G.comboStreak>1){
      const bonus=Math.round(earn*(G.comboStreak-1)*0.12);
      earn+=bonus;credEarn+=Math.round(credEarn*0.15);
      comboLine=`<div class="result-verdict verdict-crit" style="margin-bottom:8px">🔥 COMBO x${G.comboStreak} — Bonus +$${bonus}</div>`;
      showComboFlash(G.comboStreak);
    }
    verdict='PERFECT MATCH — They loved it!';vcls='verdict-crit';
  }else if(cust){
    G.comboStreak=0;
    earn=Math.round(earn*0.7);verdict='SOLD — Not quite their vibe.';vcls='verdict-ok';
  }
  else{G.comboStreak=0;verdict='SOLD';vcls='verdict-ok';}
  G.tees--;
  if(id==='stealth'||id==='glitch')G.reflectiveInk=Math.max(0,G.reflectiveInk-1);
  if(id==='neon'   ||id==='glitch')G.neonDye=Math.max(0,G.neonDye-1);
  if(id==='denim')G.rareDenim=Math.max(0,G.rareDenim-1);
  G.cash+=earn;G.cred=Math.min(100,G.cred+credEarn);
  updateGameHUD();
  const isMatch=cust&&def.pref===cust.pref;
  showSellEffect(earn,credEarn,isMatch);
  document.getElementById('craftOptions').style.display='none';
  document.getElementById('rpgBox').style.display='none';
  const res=document.getElementById('craftResult');res.style.display='block';
  const t2=credTier();
  res.innerHTML=`
    <div class="result-title">[ ${def.name} — CRAFTED ]</div>
    <div class="result-scene">${cust?cust.line:'Order fulfilled.'}</div>
    ${comboLine}
    <div class="result-verdict ${vcls}">${verdict} +$${earn} | +${credEarn} Cred</div>
    <div class="result-stats">
      <div class="rs-row"><span class="rs-lbl">Cash</span><span class="rs-val gold">$${G.cash}</span></div>
      <div class="rs-row"><span class="rs-lbl">Street Cred</span><span class="rs-val cyan">${G.cred}/100 — ${t2.label}</span></div>
      <div class="rs-row"><span class="rs-lbl">Tees Left</span><span class="rs-val">${G.tees}x</span></div>
    </div>
    <button class="btn-next-day" onclick="nextCustomer()">Next Customer --&gt;</button>`;
}

// ── Phase transitions ──────────────────────────────────
function nextCustomer(){
  G.custIdx++;
  if(G.custIdx>=G.custQueue.length||G.tees===0){endDay();return;}
  document.getElementById('craftResult').style.display='none';
  document.getElementById('rpgBox').style.display='block';
  const cust=G.custQueue[G.custIdx];
  const rn=document.getElementById('rpgName'),rt=document.getElementById('rpgText');
  if(rn)rn.textContent=cust.name+' — '+cust.role;
  if(rt)rt.innerHTML=cust.line+'<span class="rpg-cursor">_</span>';
  G.custArrived=false;G.custWalkX=660;G.custFrame=0;G.custFrameTick=0;
  buildCraftOptions();
}

function enterShop(){
  if(G.tees===0){setMapStatus('No tees — scavenge first!');return;}
  const mats=G.reflectiveInk+G.neonDye+G.rareDenim+G.cyberThread;
  if(mats===0){setMapStatus('Need at least 1 material — check DUMPSTER, NEON SIGN or market');return;}
  G.screen='shop';
  G.custQueue=generateQueue();G.custIdx=0;
  G.custWalkX=660;G.custArrived=false;G.custFrame=0;G.custFrameTick=0;
  document.getElementById('craftResult').style.display='none';
  document.getElementById('rpgBox').style.display='block';
  const cust=G.custQueue[0];
  const rn=document.getElementById('rpgName'),rt=document.getElementById('rpgText');
  if(rn)rn.textContent=cust.name+' — '+cust.role;
  if(rt)rt.innerHTML=cust.line+'<span class="rpg-cursor">_</span>';
  const mu=document.getElementById('mapUI');if(mu)mu.style.display='none';
  buildCraftOptions();updateGameHUD();
}

function generateQueue(){
  const pool=[...CUSTOMERS],count=Math.min(pool.length,2+Math.floor(G.cred/25)),q=[];
  while(q.length<count){const i=Math.floor(Math.random()*pool.length);q.push(pool.splice(i,1)[0]);}
  return q;
}

function endDay(){
  document.getElementById('craftOptions').style.display='none';
  document.getElementById('rpgBox').style.display='none';
  const res=document.getElementById('craftResult');res.style.display='block';
  const t=credTier();
  res.innerHTML=`
    <div class="result-title">[ DAY ${G.day} COMPLETE ]</div>
    <div class="result-scene">Sign flipped. Streets quiet. Rain still falls.<br><br>Cred: ${G.cred}/100 — ${t.label}. Cash: $${G.cash}.</div>
    <div class="result-verdict verdict-ok">Head back out tomorrow.</div>
    <button class="btn-next-day" onclick="startNextDay()">Day ${G.day+1} --&gt;</button>
    <button class="btn-next-day" onclick="closeGame()" style="margin-left:10px;opacity:.6">&lt;-- Exit</button>`;
}

function showBossBanner(name,title,level,abilities){
  const el=document.getElementById('boss-banner');if(!el)return;
  document.getElementById('bb-name').textContent=name;
  document.getElementById('bb-title').textContent=title;
  document.getElementById('bb-level').textContent='BOSS LEVEL '+level;
  document.getElementById('bb-abilities').textContent='Abilities: '+abilities;
  el.classList.add('active');
  setTimeout(()=>el.classList.remove('active'),3200);
}

function showComboFlash(streak){
  const el=document.createElement('div');
  el.className='combo-flash';
  el.textContent=streak+'x COMBO!';
  document.body.appendChild(el);
  setTimeout(()=>el.remove(),900);
}

function startNextDay(){
  const prevMapIdx=Math.floor((G.day-1)/5);
  G.day++;G.turns=3+Math.floor(G.cred/25);
  G.tees+=1;
  const newMapIdx=Math.floor((G.day-1)/5);
  if(newMapIdx!==prevMapIdx){
    // Entering a new district — full map reload
    loadMap(newMapIdx);
    showMapBanner(MAP_DEFS[Math.min(newMapIdx,MAP_DEFS.length-1)].name,
                  '// Day '+G.day+' — New district unlocked');
  } else {
    // Same district — restore some hotspot uses and reset patrol AI
    HOTSPOTS.forEach(h=>{h.taken=Math.max(0,h.taken-1);});
    PATROLS.forEach(p=>{p.state='patrol';p.alertTimer=0;p.chaseTimer=0;p.searchTimer=0;p.stunned=0;p.eliminated=false;p.dx=p.bDx||0;p.dy=p.bDy||0;});
    // Map 0 only: add extra guards on days 2 & 3
    if(G.day===2&&PATROLS.length<4){
      PATROLS.push({x:120,y:190,dx:1.6,dy:0,bDx:1.6,bDy:0,minX:38,maxX:330,minY:0,maxY:0,frame:0,tick:0,state:'patrol',alertTimer:0,chaseTimer:0,searchTimer:0,stunned:0,eliminated:false});
    }
    if(G.day===3&&PATROLS.length<5){
      PATROLS.push({x:350,y:220,dx:0,dy:1.8,bDx:0,bDy:1.8,minX:0,maxX:0,minY:148,maxY:260,frame:0,tick:0,state:'patrol',alertTimer:0,chaseTimer:0,searchTimer:0,stunned:0,eliminated:false});
    }
    const bs=document.getElementById('game-brand-sub');
    if(bs)bs.textContent='// Day '+G.day+' — '+(currentMap?currentMap.name:'Neon District');
  }
  document.getElementById('craftResult').style.display='none';startMap();
}

function startMap(){
  G.screen='map';
  ['craftResult','rpgBox','craftOptions'].forEach(id=>{const e=document.getElementById(id);if(e)e.style.display='none';});
  const mu=document.getElementById('mapUI');if(mu)mu.style.display='block';
  const CM=currentMap||MAP_DEFS[0];
  const bs=document.getElementById('game-brand-sub');if(bs)bs.textContent='// Day '+G.day+' — '+CM.name;
  const gs=document.getElementById('game-sub-line');if(gs)gs.textContent='// '+CM.subtitle+' — Boutique Mode Active';
  G.roundStartTimer=180;G.safeZone=180;floatTexts=[];
  updateMapUI();
  if(G.day>0&&G.day%5===0){
    spawnBoss();
    const lvl=Math.floor(G.day/5);
    const abilities=['Scan Laser','Scan + Charge','Scan + Charge + Backup','All + EMP'];
    const abl=abilities[Math.min(lvl-1,3)];
    showBossBanner(bossData.name,bossData.title,lvl,abl);
    setMapStatus(`★ BOSS DAY — ${bossData.name} is hunting you!`);
  } else {
    bossData=null;
    setMapStatus('Day '+G.day+' — Scavenge materials. Find the shop entrance.');
  }
}

// ── HUD update ─────────────────────────────────────────
function updateGameHUD(){
  const te=document.getElementById('inv-tees');if(te)te.textContent=G.tees+'x Plain Black Cotton Tee';
  const se=document.getElementById('inv-stun');
  if(se)se.innerHTML=G.stunners>0?`${G.stunners}x Stun Grenade <span class="inv-badge" style="border-color:#00ffcc44;color:#00ffcc">[Q]</span>`:'<span style="opacity:.3">-- No stun grenades</span>';
  const ie=document.getElementById('inv-ink');
  if(ie){
    const parts=[];
    if(G.reflectiveInk)parts.push('Ref.Ink x'+G.reflectiveInk);
    if(G.neonDye)parts.push('NeonDye x'+G.neonDye);
    if(G.rareDenim)parts.push('Denim x'+G.rareDenim);
    if(G.cyberThread)parts.push('Thread x'+G.cyberThread);
    ie.innerHTML=parts.length?parts.map(p=>p+' <span class="inv-badge">MAT</span>').join('<br>'):'<span style="opacity:.35">-- No materials</span>';
  }
  const ce=document.getElementById('inv-cash');if(ce)ce.textContent='$'+G.cash+' Cash';
  const cf=document.getElementById('cred-fill');if(cf)cf.style.width=G.cred+'%';
  const cn=document.getElementById('cred-num');if(cn)cn.textContent=G.cred+' / 100 — '+credTier().label;
  for(let i=0;i<3;i++){const d=document.getElementById('sd'+i);if(d)d.className='strike-dot'+(i<G.strikes?' strike-hit':'');}
  const sl=document.getElementById('strike-label');
  if(sl)sl.textContent=G.strikes===0?'CLEAN':G.strikes===1?'ONE STRIKE':'TWO STRIKES — LAST CHANCE';
  const sf=document.getElementById('stamina-fill');
  if(sf){sf.style.width=G.stamina+'%';sf.className='stamina-fill'+(G.stamina<25?' empty':G.stamina<55?' low':'');}
  const sn=document.getElementById('stamina-num');
  if(sn)sn.textContent=G.stamina>=90?'FRESH':G.stamina>=55?'HOLD SHIFT: SPRINT':G.stamina>=25?'LOW — REST':G.stamina>2?'CRITICAL':'EXHAUSTED';
}

// ── Street Market ─────────────────────────────────────
function openAbout(){  document.getElementById('about-overlay').classList.add('active'); }
function closeAbout(){ document.getElementById('about-overlay').classList.remove('active'); }

function openMarket(){
  G.marketOpen=true;
  buildMarketGrid();
  document.getElementById('market-overlay').classList.add('active');
}
function closeMarket(){
  G.marketOpen=false;
  document.getElementById('market-overlay').classList.remove('active');
}
function buildMarketGrid(){
  const cd=document.getElementById('mkt-cash-display');if(cd)cd.textContent='$'+G.cash;
  const grid=document.getElementById('market-grid');
  if(!grid)return;
  grid.innerHTML=MARKET_ITEMS.map(item=>{
    const canAfford=G.cash>=item.price;
    const colMap={cyan:'#00d4ff',pink:'#ff00aa',gold:'#ffd700'};
    const c=colMap[item.col]||'#00d4ff';
    return`<button class="mkt-card mkt-${item.col}${canAfford?'':' mkt-broke'}" onclick="buyItem('${item.id}')" ${canAfford?'':'disabled'}>
      <div class="mkt-price" style="color:${c}">$${item.price}</div>
      <div class="mkt-name">${item.label}</div>
      <div class="mkt-desc">${item.desc}</div>
      <div class="mkt-afford">${canAfford?'[ BUY ]':'Need $'+(item.price-G.cash)+' more'}</div>
    </button>`;
  }).join('');
}
function buyItem(id){
  const item=MARKET_ITEMS.find(i=>i.id===id);
  if(!item||G.cash<item.price)return;
  G.cash-=item.price;
  const matMap={tee:'tees',ink:'reflectiveInk',dye:'neonDye',denim:'rareDenim',thread:'cyberThread'};
  if(id==='stunner')   G.stunners+=2;
  else if(matMap[id])  G[matMap[id]]=(G[matMap[id]]||0)+1;
  else if(id==='bribe'){G.guardsBribed=240;setMapStatus('Guards bribed — move freely.');}
  else if(id==='promo'){G.cred=Math.min(100,G.cred+20);updateGameHUD();}
  else if(id==='turn') {G.turns++;updateMapUI();}
  setMapStatus('Bought: '+item.label);
  updateGameHUD();buildMarketGrid();
  showBuyToast(item.label,item.price,item.col);
  showBuyEffect(item);
}

function showBuyEffect(item){
  const colMap={cyan:'#00d4ff',pink:'#ff00aa',gold:'#ffd700'};
  const c=colMap[item.col]||'#ffd700';
  const ov=document.getElementById('market-overlay');if(!ov)return;
  // flash modal border
  const modal=ov.querySelector('.market-modal');
  if(modal){modal.classList.add('mkt-bought');setTimeout(()=>modal.classList.remove('mkt-bought'),600);}
  // big price tag that erupts from center
  const pop=document.createElement('div');
  pop.className='buy-pop';
  pop.style.cssText=`color:${c};text-shadow:0 0 24px ${c},0 0 48px ${c}44;border-color:${c}44;`;
  pop.innerHTML=`<span class="buy-pop-price">-$${item.price}</span><span class="buy-pop-name">${item.label}</span>`;
  ov.appendChild(pop);
  setTimeout(()=>pop.remove(),750);
  // coin burst — small abs divs that scatter
  for(let i=0;i<10;i++){
    const coin=document.createElement('div');
    const angle=Math.random()*360;
    const dist=50+Math.random()*80;
    coin.className='buy-coin';
    coin.style.cssText=`background:${c};--ax:${Math.cos(angle*Math.PI/180)*dist}px;--ay:${Math.sin(angle*Math.PI/180)*dist}px;`;
    ov.appendChild(coin);
    setTimeout(()=>coin.remove(),700);
  }
}

function showSellEffect(earn,credEarn,isMatch){
  const c=isMatch?'#00ff88':'#00d4ff';
  const gs=document.getElementById('game-screen');if(!gs)return;
  // big sell popup
  const pop=document.createElement('div');
  pop.className='sell-pop'+(isMatch?' sell-pop-match':'');
  pop.style.cssText=`color:${c};text-shadow:0 0 30px ${c},0 0 60px ${c}33;`;
  pop.innerHTML=`<div class="sp-cash">+$${earn}</div><div class="sp-cred">+${credEarn} CRED</div>${isMatch?'<div class="sp-match">PERFECT MATCH</div>':''}`;
  gs.appendChild(pop);
  setTimeout(()=>pop.remove(),1000);
  // flash the game-main area
  const flash=document.createElement('div');
  flash.className='sell-flash';
  flash.style.cssText=`background:${isMatch?'rgba(0,255,100,0.12)':'rgba(0,200,255,0.10)'};`;
  gs.appendChild(flash);
  setTimeout(()=>flash.remove(),450);
}

function showBuyToast(label,price,col){
  const colMap={cyan:'#00d4ff',pink:'#ff00aa',gold:'#ffd700'};
  const c=colMap[col]||'#00d4ff';
  const el=document.createElement('div');
  el.className='buy-toast';
  el.style.cssText=`border-color:${c};box-shadow:0 0 18px ${c}44;`;
  el.innerHTML=`<span class="bt-check" style="color:${c}">✓</span><span class="bt-label">${label}</span><span class="bt-price" style="color:${c}">-$${price}</span>`;
  document.getElementById('game-screen').appendChild(el);
  requestAnimationFrame(()=>el.classList.add('bt-show'));
  setTimeout(()=>{el.classList.add('bt-hide');setTimeout(()=>el.remove(),400);},2200);
}

function showGameOver(){
  if(sceneAnimId){cancelAnimationFrame(sceneAnimId);sceneAnimId=null;}
  const ov=document.getElementById('gameover-overlay');if(!ov)return;
  document.getElementById('go-days').textContent=G.day;
  document.getElementById('go-cash').textContent='$'+G.cash;
  document.getElementById('go-cred').textContent=G.cred+'/100';
  document.getElementById('go-rank').textContent=credTier().label;
  ov.classList.add('active');
}

function restartGame(){
  document.getElementById('gameover-overlay').classList.remove('active');
  openGame();
}

// ── Open / Close game ──────────────────────────────────
function openGame(){
  Object.assign(G,{screen:'map',day:1,custQueue:[],custIdx:0,custWalkX:660,custArrived:false,
    custFrame:0,custFrameTick:0,turns:3,playerX:300,playerY:195,playerFrame:0,playerFrameTick:0,
    playerDir:'down',playerMoving:false,spottedFlash:0,
    tees:3,reflectiveInk:1,neonDye:0,rareDenim:0,cyberThread:0,cash:200,cred:12,
    stamina:100,comboStreak:0,guardsBribed:0,invisible:0,invisCooldown:0,invisUnlocked:false,
    slowAura:0,slowCooldown:0,slowUnlocked:false,strikes:0,empActive:0,stunners:2,marketOpen:false,
    safeZone:0});
  bossData=null;
  G.keys.clear();
  loadMap(0);
  mapParticles=[];floatTexts=[];shakeFrames=0;shakeAmp=0;
  document.getElementById('game-screen').classList.add('active');
  const canvas=document.getElementById('game-canvas');canvas.width=SW;canvas.height=SH;
  if(!_kbBound){document.addEventListener('keydown',onGameKey);document.addEventListener('keyup',onGameKeyUp);_kbBound=true;}
  if(sceneAnimId)cancelAnimationFrame(sceneAnimId);
  sceneAnimId=requestAnimationFrame(gameLoop);
  const rc=document.getElementById('rain-canvas');rc.width=window.innerWidth;rc.height=window.innerHeight;
  startRain(rc);updateGameHUD();startMap();
}

function closeGame(){
  document.getElementById('game-screen').classList.remove('active');
  const ov=document.getElementById('gameover-overlay');if(ov)ov.classList.remove('active');
  if(sceneAnimId){cancelAnimationFrame(sceneAnimId);sceneAnimId=null;}
  if(gameRainId){cancelAnimationFrame(gameRainId);gameRainId=null;}
  if(_kbBound){document.removeEventListener('keydown',onGameKey);document.removeEventListener('keyup',onGameKeyUp);_kbBound=false;}
  G.keys.clear();
}


function startRain(canvas) {
    const ctx = canvas.getContext('2d');
    const drops = Array.from({length: 90}, () => ({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        len: Math.floor(Math.random() * 10) + 5,
        spd: Math.random() * 2.5 + 1.5,
        a: Math.random() * 0.22 + 0.05
    }));
    function frame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drops.forEach(d => {
            ctx.globalAlpha = d.a; ctx.strokeStyle = '#00d4ff'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x - d.len*0.15, d.y + d.len); ctx.stroke();
            d.y += d.spd;
            if (d.y > canvas.height + d.len) { d.y = -d.len; d.x = Math.random() * canvas.width; }
        });
        ctx.globalAlpha = 1; gameRainId = requestAnimationFrame(frame);
    }
    if (gameRainId) cancelAnimationFrame(gameRainId);
    frame();
}

// =====================================================
// TUTORIAL
// =====================================================
const TW=320,TH=200;
let _tutAnimId=null,_tutStep=0;

const TUT=[
  {title:'MOVE YOUR CHARACTER',
   desc:'WASD or arrow keys to move. Hold SHIFT to sprint — watch your stamina or you\'ll slow down.'},
  {title:'AVOID THE GUARDS',
   desc:'Guards patrol inside red circles. Get spotted: Alert → Chase → Caught = 1 strike & a cash fine.'},
  {title:'SCAVENGE MATERIALS',
   desc:'Walk up to glowing hotspots and press [E] to collect Ink, Dye, Denim & Thread for crafting.'},
  {title:'ENTER SHOP & CRAFT',
   desc:'Head to the green SHOP door and press [E]. Match what the customer wants for a PERFECT MATCH bonus.'},
  {title:'SURVIVE THE STREETS',
   desc:'3 strikes and it\'s game over. A boss spawns every 5 days. After dying, spawn inside the green safe zone.'},
];

function startGameFlow(){openTutorial();}

function openTutorial(){
  _tutStep=0;
  const ov=document.getElementById('tutorial-overlay');
  if(ov)ov.classList.add('active');
  _updateTutSlide();
  if(_tutAnimId)cancelAnimationFrame(_tutAnimId);
  _tutFrame(performance.now());
}

function closeTutorial(){
  const ov=document.getElementById('tutorial-overlay');
  if(ov)ov.classList.remove('active');
  if(_tutAnimId){cancelAnimationFrame(_tutAnimId);_tutAnimId=null;}
  openGame();
}

function tutNext(){
  if(_tutStep<TUT.length-1){_tutStep++;_updateTutSlide();}
  else closeTutorial();
}
function tutPrev(){if(_tutStep>0){_tutStep--;_updateTutSlide();}}
function tutJump(i){_tutStep=i;_updateTutSlide();}

function _updateTutSlide(){
  const s=TUT[_tutStep];
  const el=id=>document.getElementById(id);
  if(el('tutStepNum'))el('tutStepNum').textContent='STEP '+(_tutStep+1)+' / '+TUT.length;
  if(el('tutTitle'))el('tutTitle').textContent=s.title;
  if(el('tutDesc'))el('tutDesc').textContent=s.desc;
  const nb=el('tutNextBtn');
  if(nb){
    nb.textContent=_tutStep===TUT.length-1?'[ START GAME ]':'NEXT ▶';
    nb.className='tut-nav-btn'+(_tutStep===TUT.length-1?' tut-nav-start':' tut-nav-next');
  }
  const pb=el('tutPrevBtn');if(pb)pb.disabled=_tutStep===0;
  const dots=el('tutDots');
  if(dots)dots.innerHTML=TUT.map((_,i)=>
    `<div class="tut-dot${i===_tutStep?' active':''}" onclick="tutJump(${i})"></div>`
  ).join('');
}

function _tutFrame(ts){
  const cv=document.getElementById('tut-canvas');
  if(!cv){_tutAnimId=requestAnimationFrame(_tutFrame);return;}
  const ctx=cv.getContext('2d');
  ctx.fillStyle='#06070f';ctx.fillRect(0,0,TW,TH);
  ctx.strokeStyle='rgba(0,212,255,0.05)';ctx.lineWidth=1;
  for(let x=0;x<TW;x+=20){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,TH);ctx.stroke();}
  for(let y=0;y<TH;y+=20){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(TW,y);ctx.stroke();}
  [_drawTutMove,_drawTutGuard,_drawTutScavenge,_drawTutShop,_drawTutSurvive][_tutStep](ctx,ts);
  _tutAnimId=requestAnimationFrame(_tutFrame);
}

function _tKey(ctx,x,y,label,active){
  ctx.save();ctx.globalAlpha=active?1:0.22;
  ctx.strokeStyle=active?'#00d4ff':'#333';
  ctx.fillStyle=active?'rgba(0,212,255,0.15)':'rgba(255,255,255,0.03)';
  ctx.lineWidth=1;ctx.fillRect(x-10,y-10,20,20);ctx.strokeRect(x-10,y-10,20,20);
  if(active){ctx.shadowColor='#00d4ff';ctx.shadowBlur=10;}
  ctx.fillStyle=active?'#00d4ff':'#555';ctx.font='bold 9px monospace';ctx.textAlign='center';
  ctx.fillText(label,x,y+4);ctx.restore();
}
function _tLbl(ctx,text,x,y,col='rgba(0,212,255,0.4)'){
  ctx.save();ctx.fillStyle=col;ctx.font='8px monospace';ctx.textAlign='center';ctx.fillText(text,x,y);ctx.restore();
}

// ── Slide 1: Move ──────────────────────────────────────
function _drawTutMove(ctx,ts){
  const t=(ts%4000)/4000;
  let px, goRight=true, moving=true;
  if(t<0.42){px=40+(t/0.42)*240;}
  else if(t<0.52){px=280; moving=false;}
  else if(t<0.94){px=280-((t-0.52)/0.42)*240; goRight=false;}
  else{px=40; moving=false; goRight=false;}
  const frame=moving?Math.floor(ts/180)%2:0;
  const py=122;

  // WASD cluster (left)
  const kx=80, ky=46;
  _tKey(ctx,kx,    ky-22,'W',false);
  _tKey(ctx,kx-22, ky,   'A',moving&&!goRight);
  _tKey(ctx,kx,    ky,   'S',false);
  _tKey(ctx,kx+22, ky,   'D',moving&&goRight);
  _tLbl(ctx,'WASD',kx,ky+18,'rgba(0,212,255,0.35)');

  // Arrow keys (right)
  const ax=240, ay=46;
  _tKey(ctx,ax,    ay-22,'▲',false);
  _tKey(ctx,ax-22, ay,   '◄',moving&&!goRight);
  _tKey(ctx,ax,    ay,   '▼',false);
  _tKey(ctx,ax+22, ay,   '►',moving&&goRight);
  _tLbl(ctx,'ARROWS',ax,ay+18,'rgba(0,212,255,0.35)');

  // SHIFT bar (center)
  ctx.save();ctx.globalAlpha=0.28;ctx.strokeStyle='#00d4ff';ctx.fillStyle='rgba(0,212,255,0.06)';
  ctx.lineWidth=1;ctx.fillRect(TW/2-42,ky-10,82,16);ctx.strokeRect(TW/2-42,ky-10,82,16);
  ctx.fillStyle='rgba(0,212,255,0.5)';ctx.font='bold 7px monospace';ctx.textAlign='center';
  ctx.fillText('SHIFT — SPRINT',TW/2,ky+3);ctx.restore();

  // Ground track
  ctx.save();ctx.strokeStyle='rgba(0,212,255,0.07)';ctx.lineWidth=1;
  ctx.setLineDash([4,8]);ctx.beginPath();ctx.moveTo(20,py+12);ctx.lineTo(TW-20,py+12);ctx.stroke();
  ctx.setLineDash([]);ctx.restore();

  // Motion trail
  if(moving){
    for(let i=1;i<=5;i++){
      const tx=px-(goRight?1:-1)*(i*9);
      ctx.save();ctx.globalAlpha=0.18-i*0.03;ctx.fillStyle='#00d4ff';
      ctx.beginPath();ctx.arc(tx,py+2,2.5,0,Math.PI*2);ctx.fill();ctx.restore();
    }
  }

  drawPlayerTop(ctx,Math.round(px)-8,py-8,2,PAL.player,frame);
  _tLbl(ctx,'YOU',px,py-18,'rgba(200,164,106,0.9)');
  _tLbl(ctx,'WASD or Arrow Keys to move  ·  SHIFT to sprint',TW/2,TH-8,'rgba(0,212,255,0.5)');
}

// ── Slide 2: Guards ────────────────────────────────────
function _drawTutGuard(ctx,ts){
  const t=(ts%5000)/5000;
  const RANGE=50;

  const patrolPhase  = t<0.28;
  const approachPhase= t>=0.28&&t<0.62;
  const caughtPhase  = t>=0.62&&t<0.82;

  // Guard: patrols then holds at x=165
  let gx, gy=96;
  if(patrolPhase) gx=Math.round(90+(t/0.28)*75);
  else gx=165;

  // Player: stands at right, then walks left into patrol zone
  let px=275, py=96;
  if(approachPhase) px=Math.round(275-((t-0.28)/0.34)*210);
  else if(caughtPhase) px=65;

  const dist=Math.hypot(px-gx,py-gy);
  const spotted=approachPhase&&dist<RANGE+22;
  const chasing=approachPhase&&dist<RANGE;

  // Patrol path hint
  if(patrolPhase){
    ctx.save();ctx.strokeStyle='rgba(255,80,80,0.1)';ctx.lineWidth=1;
    ctx.setLineDash([3,8]);ctx.beginPath();ctx.moveTo(60,gy);ctx.lineTo(TW-60,gy);ctx.stroke();
    ctx.setLineDash([]);ctx.restore();
  }

  // Vision circle
  const vcCol=caughtPhase?'#ff6600':chasing?'#ff0000':'#ff4444';
  ctx.save();
  ctx.globalAlpha=(caughtPhase?0.28:chasing?0.22:0.07)*(0.9+Math.sin(ts*0.01)*0.1);
  ctx.fillStyle=vcCol;ctx.beginPath();ctx.arc(gx,gy,RANGE,0,Math.PI*2);ctx.fill();
  ctx.globalAlpha=caughtPhase?0.9:chasing?0.8:0.28;ctx.strokeStyle=vcCol;
  ctx.lineWidth=chasing||caughtPhase?2:1;
  if(!chasing&&!caughtPhase)ctx.setLineDash([4,6]);
  ctx.beginPath();ctx.arc(gx,gy,RANGE,0,Math.PI*2);ctx.stroke();
  ctx.setLineDash([]);ctx.restore();

  // Guard sprite
  const gc=caughtPhase?'#ff6600':chasing?'#ff1111':'#cc2222';
  ctx.fillStyle=gc;ctx.fillRect(gx-5,gy-5,10,10);
  ctx.fillStyle='#fff';ctx.fillRect(gx-4,gy-4,3,2);ctx.fillRect(gx+1,gy-4,3,2);
  ctx.fillStyle=caughtPhase?'#ff8800':chasing?'#ff4400':'#881111';ctx.fillRect(gx-2,gy+1,4,3);
  _tLbl(ctx,'GUARD',gx,gy-14,'rgba(255,80,80,0.8)');

  // State label
  if(caughtPhase){
    ctx.save();ctx.fillStyle='#ff8800';ctx.font='bold 9px monospace';ctx.textAlign='center';
    ctx.shadowColor='#ff6600';ctx.shadowBlur=10;ctx.fillText('!! STOP!',gx,gy-25);ctx.restore();
  } else if(chasing){
    ctx.save();ctx.fillStyle='#ff2222';ctx.font='bold 9px monospace';ctx.textAlign='center';
    ctx.shadowColor='#ff0000';ctx.shadowBlur=10;ctx.fillText('!! CHASING',gx,gy-25);ctx.restore();
  } else if(spotted){
    ctx.save();ctx.fillStyle='#ffcc00';ctx.font='bold 9px monospace';ctx.textAlign='center';
    ctx.shadowColor='#ffaa00';ctx.shadowBlur=8;ctx.fillText('! SPOTTED',gx,gy-25);ctx.restore();
  } else if(patrolPhase){
    ctx.save();ctx.fillStyle='rgba(255,80,80,0.35)';ctx.font='7px monospace';ctx.textAlign='center';
    ctx.fillText('PATROLLING',gx,gy-25);ctx.restore();
  }

  // Player (hide during caught phase)
  if(!caughtPhase){
    drawPlayerTop(ctx,Math.round(px)-8,py-8,2,PAL.player,approachPhase?Math.floor(ts/180)%2:0);
    _tLbl(ctx,'YOU',px,py-18,'rgba(200,164,106,0.9)');
  }

  // Caught result panel
  if(caughtPhase){
    const fade=Math.min(1,(t-0.62)*12)*Math.min(1,(0.82-t)*12);
    ctx.save();ctx.globalAlpha=fade;
    ctx.fillStyle='rgba(0,0,0,0.9)';ctx.strokeStyle='#ff3535';ctx.lineWidth=1;
    ctx.fillRect(TW/2-74,gy-30,148,54);ctx.strokeRect(TW/2-74,gy-30,148,54);
    ctx.fillStyle='#ff3535';ctx.font='bold 14px monospace';ctx.textAlign='center';
    ctx.shadowColor='#ff0000';ctx.shadowBlur=16;ctx.fillText('CAUGHT!',TW/2,gy-8);
    ctx.shadowBlur=0;ctx.fillStyle='rgba(255,180,180,0.8)';ctx.font='8px monospace';
    ctx.fillText('–$50 FINE  ·  1 STRIKE ADDED',TW/2,gy+9);ctx.restore();
  }

  _tLbl(ctx,'Avoid red patrol zones — caught = cash fine + 1 strike',TW/2,TH-8,'rgba(0,212,255,0.5)');
}

// ── Slide 3: Scavenge ──────────────────────────────────
function _drawTutScavenge(ctx,ts){
  const t=(ts%3600)/3600;
  const hx=160, hy=100;
  const pulse=0.55+Math.sin(ts*0.006)*0.45;

  // Secondary hotspots (subtle background context)
  [{x:72,y:68,col:'#ff00aa',lbl:'NEO DYE'},{x:264,y:124,col:'#ffaa22',lbl:'DENIM'}].forEach(h=>{
    const ep=0.35+Math.sin(ts*0.004+h.x)*0.25;
    ctx.save();ctx.globalAlpha=ep*0.45;ctx.fillStyle=h.col;
    ctx.beginPath();ctx.arc(h.x,h.y,5,0,Math.PI*2);ctx.fill();
    ctx.globalAlpha=ep*0.7;ctx.strokeStyle=h.col;ctx.lineWidth=1;
    ctx.beginPath();ctx.arc(h.x,h.y,8,0,Math.PI*2);ctx.stroke();
    ctx.fillStyle=h.col;ctx.font='5px monospace';ctx.textAlign='center';
    ctx.fillText(h.lbl,h.x,h.y-12);ctx.restore();
  });

  // Main hotspot (center)
  ctx.save();ctx.shadowColor='#00d4ff';ctx.shadowBlur=12;
  ctx.globalAlpha=pulse*0.28;ctx.fillStyle='#00d4ff';
  ctx.beginPath();ctx.arc(hx,hy,18,0,Math.PI*2);ctx.fill();
  ctx.globalAlpha=pulse;ctx.strokeStyle='#00d4ff';ctx.lineWidth=2;
  ctx.beginPath();ctx.arc(hx,hy,10,0,Math.PI*2);ctx.stroke();ctx.restore();
  _tLbl(ctx,'DUMPSTER',hx,hy-22,'rgba(0,212,255,0.9)');

  // Player walks toward hotspot
  let px;
  const py=100;
  if(t<0.40) px=Math.round(30+(t/0.40)*(hx-50));
  else px=hx-18;
  drawPlayerTop(ctx,px-8,py-8,2,PAL.player,t<0.40?Math.floor(ts/180)%2:0);
  _tLbl(ctx,'YOU',px,py-18,'rgba(200,164,106,0.9)');

  // [E] prompt when near
  if(t>0.36&&Math.hypot(px+8-hx,py-hy)<42){
    const ep=0.7+Math.sin(ts*0.022)*0.3;
    ctx.save();ctx.globalAlpha=ep;
    ctx.strokeStyle='#ffffff';ctx.fillStyle='rgba(255,255,255,0.14)';ctx.lineWidth=1;
    ctx.fillRect(hx-13,hy+13,26,16);ctx.strokeRect(hx-13,hy+13,26,16);
    ctx.fillStyle='#ffffff';ctx.font='bold 9px monospace';ctx.textAlign='center';
    ctx.shadowColor='#fff';ctx.shadowBlur=6;ctx.fillText('[E]',hx,hy+24);ctx.restore();
  }

  // Burst particles
  if(t>0.42&&t<0.68){
    const prog=(t-0.42)/0.26;
    for(let i=0;i<8;i++){
      const a=(Math.PI*2/8)*i, r=prog*38;
      ctx.save();ctx.globalAlpha=(1-prog)*0.9;ctx.fillStyle='#00d4ff';
      ctx.beginPath();ctx.arc(hx+Math.cos(a)*r,hy+Math.sin(a)*r,2.5,0,Math.PI*2);ctx.fill();ctx.restore();
    }
  }

  // Float text
  if(t>0.44&&t<0.76){
    const prog=(t-0.44)/0.32;
    const alpha=Math.min(1,(t-0.44)*14)*Math.min(1,(0.76-t)*8);
    ctx.save();ctx.globalAlpha=alpha;
    ctx.fillStyle='#00d4ff';ctx.font='bold 11px monospace';ctx.textAlign='center';
    ctx.shadowColor='#00d4ff';ctx.shadowBlur=12;
    ctx.fillText('+ REFLECTIVE INK',hx,hy-22-prog*32);ctx.restore();
  }

  _tLbl(ctx,'Press [E] near glowing hotspots to collect crafting materials',TW/2,TH-8,'rgba(0,212,255,0.5)');
}

// ── Slide 4: Shop & Craft ──────────────────────────────
function _drawTutShop(ctx,ts){
  const t=(ts%5000)/5000;

  // Shop door (right side)
  const sx=258, sy=100;
  const sg=ctx.createRadialGradient(sx,sy,2,sx,sy,34);
  sg.addColorStop(0,'rgba(0,255,136,0.18)');sg.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=sg;ctx.fillRect(sx-34,sy-34,68,68);
  ctx.fillStyle='#091a0f';ctx.fillRect(sx-10,sy-22,20,24);
  ctx.strokeStyle='#00ff88';ctx.lineWidth=2;ctx.strokeRect(sx-10,sy-22,20,24);
  ctx.save();ctx.fillStyle='#00ff88';ctx.font='bold 7px monospace';ctx.textAlign='center';
  ctx.shadowColor='#00ff88';ctx.shadowBlur=8;ctx.fillText('SHOP',sx,sy-7);ctx.restore();

  // Player walks to shop
  const walking=t<0.30;
  let px=40;
  if(t<0.30) px=Math.round(40+(t/0.30)*(sx-62));
  else px=sx-22;

  if(t<0.55){
    drawPlayerTop(ctx,px-8,100-8,2,PAL.player,walking?Math.floor(ts/180)%2:0);
    _tLbl(ctx,'YOU',px,82,'rgba(200,164,106,0.9)');
    if(!walking&&t<0.50){
      ctx.save();ctx.fillStyle='#00ff88';ctx.font='bold 8px monospace';ctx.textAlign='center';
      ctx.shadowColor='#00ff88';ctx.shadowBlur=8;ctx.fillText('[E] ENTER',sx,sy+22);ctx.restore();
    }
  }

  // Customer walks in from the right
  if(t>0.44){
    const cprog=Math.min(1,(t-0.44)/0.28);
    const cust=CUSTOMERS[2];
    const custX=TW+8-cprog*175;
    if(custX<TW-2){
      drawPixelCat(ctx,Math.round(custX)-12,68,3,cust.pal,Math.floor(ts/220)%2);
      _tLbl(ctx,'CUSTOMER',custX,62,'rgba(255,200,100,0.8)');
    }
    // Style preference bubble
    if(cprog>0.80&&custX<TW-2){
      const bx=Math.min(custX,TW-92), by=52;
      ctx.save();
      ctx.fillStyle='rgba(0,0,0,0.85)';ctx.strokeStyle=cust.pal.eyeS;ctx.lineWidth=1;
      ctx.fillRect(bx-46,by-14,92,16);ctx.strokeRect(bx-46,by-14,92,16);
      ctx.fillStyle='rgba(255,255,255,0.65)';ctx.font='6px monospace';ctx.textAlign='center';
      ctx.fillText('Vibe: CLEAN  ·  MINIMAL',bx,by-2);ctx.restore();
    }
  }

  // Craft result popup
  if(t>0.70){
    const fade=Math.min(1,(t-0.70)*5)*Math.min(1,(1-t)*6+0.25);
    ctx.save();ctx.globalAlpha=fade;
    ctx.fillStyle='rgba(0,0,0,0.9)';ctx.strokeStyle='rgba(0,255,136,0.5)';ctx.lineWidth=1;
    ctx.fillRect(TW/2-62,TH/2-30,124,58);ctx.strokeRect(TW/2-62,TH/2-30,124,58);
    ctx.fillStyle='#00ff88';ctx.font='bold 22px monospace';ctx.textAlign='center';
    ctx.shadowColor='#00ff88';ctx.shadowBlur=18;ctx.fillText('+$280',TW/2,TH/2+4);
    ctx.shadowBlur=0;ctx.fillStyle='rgba(0,212,255,0.85)';ctx.font='7px monospace';
    ctx.fillText('PERFECT MATCH  +22 CRED',TW/2,TH/2+18);ctx.restore();
  }

  _tLbl(ctx,'Walk to green SHOP · [E] to enter · match customer style for bonus',TW/2,TH-8,'rgba(0,212,255,0.5)');
}

// ── Slide 5: Survive ───────────────────────────────────
function _drawTutSurvive(ctx,ts){
  const t=(ts%5200)/5200;

  // Left: Strikes
  const strikes=Math.min(3,Math.floor(t*4.2));
  const sdx=72, sdy=54;
  _tLbl(ctx,'STRIKES',sdx,sdy-26,'rgba(255,255,255,0.25)');
  for(let i=0;i<3;i++){
    const lit=i<strikes;
    ctx.save();
    if(lit){ctx.fillStyle='#ff3535';ctx.shadowColor='#ff3535';ctx.shadowBlur=14;
      ctx.beginPath();ctx.arc(sdx-22+i*22,sdy,9,0,Math.PI*2);ctx.fill();}
    else{ctx.strokeStyle='rgba(255,255,255,0.18)';ctx.lineWidth=2;
      ctx.beginPath();ctx.arc(sdx-22+i*22,sdy,9,0,Math.PI*2);ctx.stroke();}
    ctx.restore();
  }
  if(strikes===3){
    const fade=Math.min(1,(t-0.70)*12);
    ctx.save();ctx.globalAlpha=fade;ctx.fillStyle='#ff3535';ctx.font='bold 11px monospace';
    ctx.textAlign='center';ctx.shadowColor='#ff0000';ctx.shadowBlur=14;
    ctx.fillText('GAME OVER',sdx,sdy+26);ctx.restore();
  }

  // Center: Safe zone + player
  const szx=162, szy=142;
  const szPulse=0.45+Math.sin(ts*0.015)*0.3;
  ctx.save();
  ctx.globalAlpha=0.12;ctx.fillStyle='#00ff88';ctx.beginPath();ctx.arc(szx,szy,26,0,Math.PI*2);ctx.fill();
  ctx.globalAlpha=szPulse*0.55;ctx.strokeStyle='#00ff88';ctx.lineWidth=1.5;ctx.setLineDash([3,5]);
  ctx.beginPath();ctx.arc(szx,szy,26,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
  ctx.globalAlpha=0.75;ctx.fillStyle='#00ff88';ctx.font='bold 7px monospace';ctx.textAlign='center';
  ctx.fillText('SAFE ZONE',szx,szy+38);ctx.restore();
  drawPlayerTop(ctx,szx-8,szy-8,2,PAL.player,0);
  _tLbl(ctx,'YOU',szx,szy-18,'rgba(200,164,106,0.9)');

  // Right: Boss
  const bx=258, by=72;
  const bPulse=0.88+Math.sin(ts*0.009)*0.12;
  ctx.save();ctx.shadowColor='#ff0033';ctx.shadowBlur=12*bPulse;
  ctx.fillStyle='#1a0000';ctx.fillRect(bx-7,by-7,14,14);
  ctx.fillStyle='#ff1111';ctx.fillRect(bx-6,by-6,3,3);ctx.fillRect(bx+3,by-6,3,3);
  ctx.fillStyle='#ff3300';ctx.fillRect(bx-3,by+1,6,4);ctx.restore();
  ctx.save();ctx.fillStyle='#ffd700';ctx.font='bold 9px monospace';ctx.textAlign='center';
  ctx.shadowColor='#ffd700';ctx.shadowBlur=10;ctx.fillText('★ BOSS',bx,by-16);
  ctx.shadowBlur=0;ctx.fillStyle='rgba(255,80,80,0.65)';ctx.font='7px monospace';
  ctx.fillText('every 5 days',bx,by-4);ctx.restore();
  ctx.save();ctx.globalAlpha=0.07*(0.9+Math.sin(ts*0.007)*0.1);ctx.fillStyle='#cc0033';
  ctx.beginPath();ctx.arc(bx,by,48,0,Math.PI*2);ctx.fill();
  ctx.globalAlpha=0.25;ctx.strokeStyle='#cc0033';ctx.lineWidth=1;ctx.setLineDash([5,7]);
  ctx.beginPath();ctx.arc(bx,by,48,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);ctx.restore();

  // Day ticker (below boss)
  const dayNum=Math.floor(t*7)+1;
  ctx.save();
  ctx.fillStyle=dayNum%5===0?'#ff3535':'rgba(0,212,255,0.5)';
  ctx.font='bold 8px monospace';ctx.textAlign='center';
  ctx.shadowColor=dayNum%5===0?'#ff0000':'transparent';
  ctx.shadowBlur=dayNum%5===0?8:0;
  ctx.fillText('DAY '+dayNum+(dayNum%5===0?' — BOSS!':''),bx,by+56);ctx.restore();

  // Divider
  ctx.save();ctx.strokeStyle='rgba(255,255,255,0.05)';ctx.lineWidth=1;
  ctx.setLineDash([3,7]);ctx.beginPath();ctx.moveTo(TW/2,22);ctx.lineTo(TW/2,TH-22);ctx.stroke();
  ctx.setLineDash([]);ctx.restore();

  _tLbl(ctx,'3 strikes = game over · boss every 5 days · respawn in green zone',TW/2,TH-8,'rgba(0,212,255,0.5)');
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
