/* TIKO TEKO — plataforma educativa
   Conquistas, missão diária e jogos. Tudo fica guardado no navegador do aluno. */
const $ = id => document.getElementById(id);
const TOTAL = 12, TOTAL_GAMES = 20;
const PROFILE = 'tikoTekoSessionProfileV2', PROFILE_INDEX = 'tikoTekoBrowserProfilesV1';
const GAME_IDS = ['keys', 'memory', 'pairs', 'safety', 'sequence', 'typing', 'wordsearch', 'pixelart', 'truefalse', 'maze', 'internet-run', 'workshop', 'search', 'word', 'excel', 'ppt', 'files', 'network', 'virusrush', 'ergo'];
const OFFICE_IDS = ['word', 'excel', 'ppt', 'files'], NEW_IDS = ['files', 'network', 'virusrush', 'ergo'];
const A = {
    keys: ['⌨️', 'À Procura das Teclas', 'Descobre teclas e atalhos.'],
    memory: ['🧠', 'Memória TIC', 'Encontra todos os pares.'],
    pairs: ['🔗', 'Liga os Pares', 'Relaciona equipamentos e funções.'],
    safety: ['🛡️', 'Segurança Digital', 'Escolhe a atitude mais segura.'],
    sequence: ['🔢', 'Sequências', 'Descobre o elemento seguinte.'],
    typing: ['✍️', 'Soletra', 'Ouve, lê a pista e escreve a palavra.'],
    wordsearch: ['🔎', 'Sopa de Letras', 'Encontra palavras TIC.'],
    pixelart: ['🎨', 'Pixel Art TIC — Edição Especial', 'Pinta píxeis e reproduz modelos.'],
    truefalse: ['✅', 'Verdadeiro ou Falso', 'Testa os teus conhecimentos.'],
    maze: ['🧭', 'TICO MAZE', 'Encontra a saída do labirinto.'],
    'internet-run': ['⚡', 'Danger Zone', 'Aventura de plataformas: salta, esmaga vírus, recolhe moedas e resgata mini-bots!'],
    workshop: ['🛠️', 'Oficina do Tiko', 'Monta o computador e descobre o que cada peça faz.'],
    search: ['🕵️', 'Detetive da Pesquisa', 'Aprende a pesquisar e a escolher fontes fiáveis.'],
    word: ['📝', 'Word Explorer', 'Formata documentos e corrige textos.'],
    excel: ['📊', 'Excel Detetive', 'Células, fórmulas e gráficos.'],
    ppt: ['📽️', 'PowerPoint Studio', 'Cria apresentações com boas práticas.'],
    files: ['🗂️', 'Ficheiros e Pastas', 'Arruma ficheiros e reconhece as extensões.'],
    network: ['🛜', 'Redes', 'Segue o caminho de uma mensagem pela rede.'],
    virusrush: ['🦠', 'Vírus Rush', 'Salta, desliza nas paredes e foge de vírus e hackers!'],
    ergo: ['🪑', 'Postura Perfeita', 'Aprende as regras de ergonomia e cuida do teu corpo.']
};
const desc = {
    keys: 'Lê o desafio e escolhe a resposta correta.',
    memory: 'Vira duas cartas de cada vez para encontrar os pares.',
    pairs: 'Seleciona um conceito e depois a sua definição.',
    safety: 'Escolhe a atitude mais segura para cada situação.',
    sequence: 'Observa o padrão e escolhe o elemento que falta.',
    typing: 'Lê a pista (ou carrega em 🔊 para ouvir a palavra) e escreve-a corretamente.',
    wordsearch: 'Clica na primeira e na última letra de cada palavra (ou arrasta com o rato).',
    pixelart: 'Escolhe pintura livre para criar ou reproduzir modelo para copiar a imagem píxel a píxel.',
    truefalse: 'Decide se cada afirmação é verdadeira ou falsa.',
    maze: 'Usa as setas para levar o Tiko até à saída.',
    'internet-run': 'Move o Tiko com ← → (ou A / D) e salta com Espaço ou ↑. Podes saltar duas vezes no ar! Esmaga os vírus por cima, foge dos espinhos, recolhe moedas e resgata os 3 mini-bots até ao portal final.',
    workshop: 'Arrasta cada peça para o sítio certo (ou toca na peça e depois na zona). Também podes usar o teclado: escolhe a peça e carrega Enter na zona.',
    search: 'Explora um navegador simulado: não precisas de Internet. Clica, escolhe e descobre como pesquisar com segurança.',
    word: 'Usa o mini-Word: clica no texto para o selecionar e depois usa os botões da barra. Também funcionam os atalhos Ctrl+B, I, U, S e Z.',
    excel: 'Usa a folha de cálculo: clica nas células, nas letras das colunas ou nos números das linhas e escreve fórmulas.',
    ppt: 'Escolhe esquemas, ordena diapositivos e descobre as boas práticas de uma apresentação.',
    files: 'Arrasta cada ficheiro para a pasta certa (ou toca no ficheiro e depois na pasta). Repara na extensão: é o que vem depois do ponto.',
    network: 'Toca nos passos pela ordem em que a mensagem viaja, ou liga cada equipamento à sua função.',
    virusrush: 'Setas ou A/D para andar, Espaço/↑/W para saltar. Encosta-te a uma parede e salta para saltar da parede. Morres e voltas logo: tenta outra vez!',
    ergo: 'Escolhe as boas práticas para o teu corpo: postura, ecrã, luz e pausas. Em alguns níveis regulas o posto de trabalho e carregas em Verificar.'
};

let p = null, act = '', lvl = 1, g = {}, helper = '', mistakes = 0, achFilter = 'all';

function makeId() { try { return 'tt-' + crypto.randomUUID() } catch { return 'tt-' + Math.random().toString(36).slice(2) + Date.now().toString(36) } }
function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])) }
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 } }
function selectAvatar(button) { document.querySelectorAll('.avatar-choice').forEach(x => x.classList.toggle('selected', x === button)); $('selectedAvatar').value = button.dataset.avatar }
function loadProfiles() { try { return JSON.parse(localStorage.getItem(PROFILE_INDEX) || '{}') } catch { return {} } }

/* ===== Perfil ===== */
function normalizeProfile(x) {
    x.completed = x.completed || {}; x.points = Object.keys(x.completed).length * 10;
    x.ach = x.ach || {}; x.days = x.days || []; x.flawless = x.flawless || 0; x.botSet = x.botSet || {};
    x.coinBest = x.coinBest || {}; x.noHit = x.noHit || 0; x.bestStreak = x.bestStreak || 0;
    x.daily = x.daily || { date: '', n: 0 }; x.missions = x.missions || 0;
    x.look = x.look || { avatar: '', frame: '' };
    return x;
}
function save() {
    sessionStorage.setItem(PROFILE, JSON.stringify(p));
    const profiles = loadProfiles(); profiles[p.name.toLocaleLowerCase('pt-PT') + '|' + (p.avatar || '🤖')] = p;
    try { localStorage.setItem(PROFILE_INDEX, JSON.stringify(profiles)) } catch { }
    update();
}
async function init() {
    try { p = JSON.parse(sessionStorage.getItem(PROFILE) || 'null') } catch { p = null }
    try { localStorage.removeItem('tikoTekoLocalRankingV2') } catch { }
    document.querySelectorAll('.avatar-choice').forEach(b => b.addEventListener('click', () => selectAvatar(b)));
    if (p) { normalizeProfile(p); checkAchievements(true); show('home'); update() } else show('profile');
    $('profileForm').onsubmit = e => {
        e.preventDefault();
        const nickname = $('name').value.trim(), avatar = $('selectedAvatar').value || '🤖';
        if (nickname.length < 2 || nickname.length > 18) return;
        const profiles = loadProfiles(), key = nickname.toLocaleLowerCase('pt-PT') + '|' + avatar;
        p = profiles[key] || { id: makeId(), name: nickname, avatar };
        p.name = nickname; p.avatar = avatar; normalizeProfile(p); checkAchievements(true); save(); dashboard();
    };
    $('level').onchange = () => { lvl = +$('level').value; start() };
    $('chatForm').onsubmit = e => { e.preventDefault(); chatAsk($('chatInput').value) };
    $('copyrightYear').textContent = new Date().getFullYear();
    // Teclado: um único ouvinte para o labirinto e a Danger Zone
    ['keydown', 'keyup'].forEach(type => document.addEventListener(type, e => {
        const down = type === 'keydown';
        if ($('activity').classList.contains('hidden')) return;
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
        if (act === 'maze' && down) { const d = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', W: 'up', s: 'down', S: 'down', a: 'left', A: 'left', d: 'right', D: 'right' }[e.key]; if (d) { e.preventDefault(); move(d) } }
        if ((act === 'internet-run' || act === 'virusrush') && window._dzKey) window._dzKey(e, down);
    }));
    loadAccessibility();
}
function show(id) { document.querySelectorAll('.screen').forEach(x => x.classList.add('hidden')); $(id).classList.remove('hidden'); scrollTo(0, 0) }
function stopRunner() { if (g && g.raf) cancelAnimationFrame(g.raf); window._dzKey = null }
function dashboard() { stopRunner(); if (!p) { show('profile'); return } show('home'); update() }
function changeProfile() { stopRunner(); sessionStorage.removeItem(PROFILE); p = null; $('name').value = ''; show('profile') }

/* ===== Conquistas ===== */
const TITLES = [[0, 'Explorador Curioso', '🌱'], [30, 'Aprendiz Digital', '🧩'], [100, 'Ajudante TIC', '🛠️'], [220, 'Craque do Teclado', '⌨️'], [400, 'Mestre Digital', '🎓'], [700, 'Herói da Internet', '🦸'], [1000, 'Lenda do Tiko Teko', '👑']];
function dayKey(d = new Date()) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') }
function totalDone() { return Object.keys(p.completed).length }
function doneIn(id) { return Object.keys(p.completed).filter(k => k.startsWith(id + '-')).length }
function gamesStarted() { return GAME_IDS.filter(id => doneIn(id) > 0).length }
function currentStreak() { const set = new Set(p.days || []); let d = new Date(), n = 0; if (!set.has(dayKey(d))) d.setDate(d.getDate() - 1); while (set.has(dayKey(d))) { n++; d.setDate(d.getDate() - 1) } return n }
function bestStreak() { return Math.max(p.bestStreak || 0, currentStreak()) }
function botsTotal() { return Object.keys(p.botSet || {}).length }
function coinsTotal() { return Object.values(p.coinBest || {}).reduce((a, b) => a + b, 0) }
function titleInfo() { const pts = p.points || 0; let i = 0; TITLES.forEach((t, k) => { if (pts >= t[0]) i = k }); return { cur: TITLES[i], next: TITLES[i + 1] || null } }
function shortName(id) { return A[id][1].split(' — ')[0] }

function achievementList() {
    const L = [], add = (cat, id, icon, name, desc, goal, val) => L.push({ cat, id, icon, name, desc, goal, val });
    [[1, '🚀', 'Primeiros Passos', 'Conclui o teu primeiro nível.'], [5, '🔥', 'Em Aquecimento', 'Conclui 5 níveis.'], [15, '⚡', 'Imparável', 'Conclui 15 níveis.'],
    [60, '🌟', 'Um Quarto da Aventura', 'Conclui 60 níveis.'], [120, '🏅', 'Meio Caminho Andado', 'Conclui 120 níveis.'], [180, '💎', 'Quase Lá!', 'Conclui 180 níveis.'], [240, '👑', 'Lenda Tiko Teko', 'Conclui os 240 níveis!']]
        .forEach(([n, i, nm, d]) => add('Aventura', 'lv' + n, i, nm, d, n, totalDone));
    GAME_IDS.forEach(id => add('Mestre dos Jogos', 'master-' + id, A[id][0], 'Mestre: ' + shortName(id), 'Conclui os 12 níveis de ' + shortName(id) + '.', 12, () => doneIn(id)));
    add('Mestre dos Jogos', 'office', '🏢', 'Mestre do Escritório', 'Torna-te Mestre do Word Explorer, do Excel Detetive, do PowerPoint Studio e de Ficheiros e Pastas.', OFFICE_IDS.length, () => OFFICE_IDS.filter(id => doneIn(id) === 12).length);
    [[3, '🧭', 'Curioso', 'Experimenta 3 jogos diferentes.'], [6, '🗺️', 'Explorador', 'Conclui níveis em 6 jogos diferentes.'], [11, '🌍', 'Grande Explorador', 'Conclui níveis em 11 jogos diferentes.'], [20, '🧑‍🚀', 'Aventureiro Completo', 'Conclui níveis nos 20 jogos.']]
        .forEach(([n, i, nm, d]) => add('Exploração', 'ex' + n, i, nm, d, n, gamesStarted));
    [[2, '📅', 'Voltaste!', 'Joga 2 dias seguidos.'], [3, '🔥', 'Três em Linha', 'Joga 3 dias seguidos.'], [5, '⚡', 'Rotina de Campeão', 'Joga 5 dias seguidos.'], [7, '🏆', 'Semana Perfeita', 'Joga 7 dias seguidos.']]
        .forEach(([n, i, nm, d]) => add('Hábitos', 'st' + n, i, nm, d, n, bestStreak));
    add('Hábitos', 'mi1', '🎯', 'Missão Cumprida', 'Completa a missão do dia (3 níveis num dia).', 1, () => p.missions || 0);
    add('Hábitos', 'mi5', '🎖️', 'Missões em Série', 'Completa 5 missões do dia.', 5, () => p.missions || 0);
    [[1, '✨', 'Sem Falhas', 'Conclui um nível sem errar.'], [10, '🎯', 'Mira Certeira', 'Conclui 10 níveis sem errar.'], [30, '💫', 'Precisão Total', 'Conclui 30 níveis sem errar.']]
        .forEach(([n, i, nm, d]) => add('Perícia', 'fl' + n, i, nm, d, n, () => p.flawless || 0));
    [[3, '🤖', 'Amigo dos Bots', 'Resgata 3 mini-bots na Danger Zone.'], [12, '🦸', 'Resgatador', 'Resgata 12 mini-bots.'], [36, '🚀', 'Salvador de Bots', 'Resgata os 36 mini-bots!']]
        .forEach(([n, i, nm, d]) => add('Danger Zone', 'bot' + n, i, nm, d, n, botsTotal));
    [[50, '🪙', 'Caçador de Moedas', 'Recolhe 50 moedas na Danger Zone.'], [150, '💰', 'Tesouro Digital', 'Recolhe 150 moedas.'], [300, '👑', 'Rei das Moedas', 'Recolhe 300 moedas.']]
        .forEach(([n, i, nm, d]) => add('Danger Zone', 'coin' + n, i, nm, d, n, coinsTotal));
    [[1, '🛡️', 'Intocável', 'Termina uma missão da Danger Zone sem perder corações.'], [6, '🌈', 'Corrida Perfeita', 'Termina 6 missões sem perder corações.']]
        .forEach(([n, i, nm, d]) => add('Danger Zone', 'nh' + n, i, nm, d, n, () => p.noHit || 0));
    return L;
}
/* ===== Prémios: mascotes e molduras ===== */
const BASE_AVATARS = [['🤖', 'Robô'], ['🦊', 'Raposa'], ['🐼', 'Panda'], ['🐸', 'Sapo'], ['🦄', 'Unicórnio'], ['🐯', 'Tigre'], ['🐙', 'Polvo'], ['🐧', 'Pinguim']];
const MASCOTS = { keys: ['🐱', 'Gato Teclista'], memory: ['🐘', 'Elefante Memória'], pairs: ['🦦', 'Lontra Parceira'], safety: ['🦁', 'Leão Protetor'], sequence: ['🐍', 'Cobra das Sequências'], typing: ['🦉', 'Coruja Soletra'], wordsearch: ['🦅', 'Águia Caçadora'], pixelart: ['🦋', 'Borboleta Pixel'], truefalse: ['🐺', 'Lobo Verdadeiro'], maze: ['🐭', 'Rato do Labirinto'], 'internet-run': ['🚀', 'Foguetão Danger Zone'], workshop: ['🦫', 'Castor Construtor'], search: ['🕵️', 'Detetive Secreto'], word: ['🦢', 'Cisne Word'], excel: ['🐊', 'Crocodilo Excel'], ppt: ['🦩', 'Flamingo Studio'], files: ['🐿️', 'Esquilo Arquivista'], network: ['🐝', 'Abelha da Rede'], virusrush: ['🦖', 'Dino Anti-Vírus'], ergo: ['🦒', 'Girafa Postura'] };
const FRAMES = { bronze: ['Bronze', 'lv5'], prata: ['Prata', 'st3'], ouro: ['Ouro', 'fl10'], neon: ['Neon', 'bot3'], fogo: ['Fogo', 'st7'], arcoiris: ['Arco-íris', 'nh6'], diamante: ['Diamante', 'lv240'] };
function rewardFor(achId) {
    if (achId.startsWith('master-')) { const m = MASCOTS[achId.slice(7)]; if (m) return { kind: 'mascot', icon: m[0], name: m[1], text: 'Mascote ' + m[0] + ' ' + m[1] } }
    for (const k in FRAMES) if (FRAMES[k][1] === achId) return { kind: 'frame', key: k, name: FRAMES[k][0], text: 'Moldura ' + FRAMES[k][0] };
    return null;
}
function hasMascot(id) { return !!(p.ach && p.ach['master-' + id]) }
function hasFrame(k) { return !!(p.ach && p.ach[FRAMES[k][1]]) }
function lookAvatar() { const a = p.look && p.look.avatar; if (a && (BASE_AVATARS.some(x => x[0] === a) || Object.keys(MASCOTS).some(id => MASCOTS[id][0] === a && hasMascot(id)))) return a; return p.avatar || '🤖' }
function lookFrame() { const f = p.look && p.look.frame; return f && FRAMES[f] && hasFrame(f) ? f : '' }
function avatarHTML(av, fr, size) { return `<span class="avatar-frame frame-${fr || 'none'} ${size || ''}" aria-hidden="true"><span>${av}</span></span>` }
function isUnlocked(a) { return !!p.ach[a.id] }
function checkAchievements(silent) {
    p.ach = p.ach || {}; const fresh = [];
    achievementList().forEach(a => { if (!p.ach[a.id] && a.val() >= a.goal) { p.ach[a.id] = dayKey(); fresh.push(a) } });
    if (fresh.length) { try { sessionStorage.setItem(PROFILE, JSON.stringify(p)) } catch { } if (!silent) fresh.forEach((a, i) => setTimeout(() => toast(a), 900 + i * 1700)) }
    return fresh;
}
function toast(a) {
    const el = document.createElement('div'); el.className = 'toast';
    el.innerHTML = `<span class="toast-icon" aria-hidden="true">${a.icon}</span><div><small>${a.mission ? 'MISSÃO CUMPRIDA' : 'NOVA CONQUISTA'} 🎉</small><b>${esc(a.name)}</b><span>${esc(a.desc)}</span>${a.id && rewardFor(a.id) ? `<em class="toast-prize">🎁 Prémio: ${esc(rewardFor(a.id).text)}</em>` : ''}</div>`;
    $('toastStack').appendChild(el); setTimeout(() => el.classList.add('out'), 4300); setTimeout(() => el.remove(), 5000);
}
function recordActivity() {
    const today = dayKey(); p.days = p.days || []; if (!p.days.includes(today)) p.days.push(today); p.days = p.days.slice(-60);
    p.bestStreak = Math.max(p.bestStreak || 0, currentStreak());
    if (!p.daily || p.daily.date !== today) p.daily = { date: today, n: 0 };
    p.daily.n++;
    if (p.daily.n === 3) { p.missions = (p.missions || 0) + 1; setTimeout(() => toast({ mission: true, icon: '🎯', name: 'Missão do dia cumprida!', desc: 'Concluíste 3 níveis hoje. Volta amanhã para mais uma!' }), 400) }
}
function dailyCount() { const t = dayKey(); return p.daily && p.daily.date === t ? p.daily.n : 0 }

function progressBar(v, goal) { const pct = Math.min(100, Math.round(Math.min(v, goal) / goal * 100)); return `<div class="ach-bar" role="progressbar" aria-valuemin="0" aria-valuemax="${goal}" aria-valuenow="${Math.min(v, goal)}"><span style="width:${pct}%"></span></div>` }
function renderHomeAch() {
    const list = achievementList(), done = list.filter(isUnlocked).length, t = titleInfo(), pts = p.points || 0;
    $('achCount').textContent = done + '/' + list.length;
    const toNext = t.next ? t.next[0] - pts : 0, span = t.next ? t.next[0] - t.cur[0] : 1;
    $('titleCard').innerHTML = `<div class="title-icon" aria-hidden="true">${t.cur[2]}</div><div class="title-body"><small>O TEU TÍTULO</small><b>${esc(t.cur[1])}</b>${t.next ? progressBar(pts - t.cur[0], span) + `<span>Faltam <b>${toNext}</b> pontos para «${esc(t.next[1])}» ${t.next[2]}</span>` : '<span>Chegaste ao título máximo! És uma lenda! 👑</span>'}</div>`;
    const n = Math.min(3, dailyCount()), streak = currentStreak(), complete = dailyCount() >= 3;
    $('missionCard').innerHTML = `<small>🎯 MISSÃO DO DIA</small><b>${complete ? 'Missão cumprida! ✅' : 'Conclui 3 níveis hoje'}</b><div class="mission-dots" aria-label="${n} de 3 níveis">${[0, 1, 2].map(i => `<span class="${i < n ? 'on' : ''}">${i < n ? '⭐' : ''}</span>`).join('')}</div><span class="streak">🔥 ${streak} ${streak === 1 ? 'dia seguido' : 'dias seguidos'}${streak === 0 ? ' — joga hoje para começar!' : ''}</span>`;
    const locked = list.filter(a => !isUnlocked(a)).map(a => ({ a, r: Math.min(a.val(), a.goal) / a.goal })).sort((x, y) => y.r - x.r || x.a.goal - y.a.goal);
    const seen = new Set(), picks = [];
    for (const x of locked) { if (!seen.has(x.a.cat) && picks.length < 3) { seen.add(x.a.cat); picks.push(x.a) } }
    $('nextAch').innerHTML = picks.length ? `<div class="next-head"><b>🎯 Próximas conquistas</b><button onclick="showAchievements()">Ver todas →</button></div><div class="next-grid">${picks.map(a => `<div class="next-item"><span class="next-icon" aria-hidden="true">${a.icon}</span><div><b>${esc(a.name)}</b><small>${esc(a.desc)}</small>${progressBar(a.val(), a.goal)}<em>${Math.min(a.val(), a.goal)} / ${a.goal}</em></div></div>`).join('')}</div>` : '<div class="next-head"><b>🏆 Desbloqueaste todas as conquistas! Parabéns!</b></div>';
}
function setAchFilter(f) { achFilter = f; document.querySelectorAll('.ach-filters button').forEach(b => b.classList.toggle('active', b.dataset.filter === f)); renderAchievements() }
let achTab = 'medals';
function setAchTab(t) {
    achTab = t; document.querySelectorAll('.ach-tabs button').forEach(b => { const on = b.dataset.tab === t; b.classList.toggle('active', on); b.setAttribute('aria-selected', String(on)) });
    $('achMedals').classList.toggle('hidden', t !== 'medals'); $('achLook').classList.toggle('hidden', t !== 'look');
    if (t === 'look') renderLook(); else setAchFilter(achFilter);
}
function showAchievements(tab) { if (!p) { show('profile'); return } stopRunner(); show('achScreen'); setAchTab(tab === 'look' ? 'look' : 'medals') }
function setLook(kind, value) { p.look = p.look || { avatar: '', frame: '' }; p.look[kind] = value; save(); renderLook() }
function renderLook() {
    const av = lookAvatar(), fr = lookFrame(), frName = fr ? FRAMES[fr][0] : 'Sem moldura';
    const missing = id => { const a = achievementList().find(x => x.id === id); return a ? a.name : '' };
    const mascotBtn = (icon, name, ok, need, sel, onclick) => `<button class="look-item ${sel ? 'selected' : ''} ${ok ? '' : 'locked'}" ${ok ? `onclick="${onclick}"` : 'disabled'} aria-pressed="${sel}" aria-label="${esc(name)}${ok ? '' : ' (bloqueada)'}"><span class="look-icon">${ok ? icon : '🔒'}</span><b>${esc(name)}</b>${ok ? '' : `<small>Falta: ${esc(need)}</small>`}</button>`;
    const base = BASE_AVATARS.map(([i, n]) => mascotBtn(i, n, true, '', av === i, `setLook('avatar','${i}')`)).join('');
    const prizes = Object.keys(MASCOTS).map(id => { const [i, n] = MASCOTS[id], ok = hasMascot(id); return mascotBtn(i, n, ok, missing('master-' + id), ok && av === i, `setLook('avatar','${i}')`) }).join('');
    const frames = [mascotBtn('⚪', 'Sem moldura', true, '', !fr, "setLook('frame','')")].concat(Object.keys(FRAMES).map(k => { const ok = hasFrame(k); return `<button class="look-item ${fr === k ? 'selected' : ''} ${ok ? '' : 'locked'}" ${ok ? `onclick="setLook('frame','${k}')"` : 'disabled'} aria-pressed="${fr === k}" aria-label="Moldura ${FRAMES[k][0]}${ok ? '' : ' (bloqueada)'}"><span class="look-icon">${ok ? avatarHTML(av, k, 'sm') : '🔒'}</span><b>Moldura ${esc(FRAMES[k][0])}</b>${ok ? '' : `<small>Falta: ${esc(missing(FRAMES[k][1]))}</small>`}</button>` })).join('');
    const nM = Object.keys(MASCOTS).filter(hasMascot).length, nF = Object.keys(FRAMES).filter(hasFrame).length;
    $('achLook').innerHTML = `<div class="look-preview">${avatarHTML(av, fr, 'xl')}<div><small>O TEU VISUAL</small><b>${esc(p.name)}</b><span>Moldura: ${esc(frName)}</span><em>O visual é só enfeite: não muda os teus pontos nem as tuas medalhas.</em></div></div>
    <h2 class="ach-cat">Mascotes <span class="look-count">${nM}/${Object.keys(MASCOTS).length} prémios</span></h2><p class="look-note">Cada medalha «Mestre» desbloqueia uma mascote nova.</p><div class="look-grid">${base}${prizes}</div>
    <h2 class="ach-cat">Molduras <span class="look-count">${nF}/${Object.keys(FRAMES).length} prémios</span></h2><p class="look-note">As molduras vêm das medalhas de aventura, hábitos, perícia e Danger Zone.</p><div class="look-grid">${frames}</div>`;
}
function renderAchievements() {
    const list = achievementList(), done = list.filter(isUnlocked).length, t = titleInfo();
    $('achSummary').innerHTML = `<div class="sum-title"><span aria-hidden="true">${t.cur[2]}</span><div><small>O TEU TÍTULO</small><b>${esc(t.cur[1])}</b></div></div><div class="sum-count"><b>${done}</b> de ${list.length} conquistas${progressBar(done, list.length)}</div>`;
    const cats = [...new Set(list.map(a => a.cat))]; let html = '';
    cats.forEach(cat => {
        const items = list.filter(a => a.cat === cat && (achFilter === 'all' || (achFilter === 'done') === isUnlocked(a)));
        if (!items.length) return;
        html += `<h2 class="ach-cat">${esc(cat)}</h2><div class="ach-grid">${items.map(a => { const ok = isUnlocked(a), v = Math.min(a.val(), a.goal); return `<article class="ach-card ${ok ? 'unlocked' : 'locked'}"><div class="ach-medal" aria-hidden="true">${ok ? a.icon : '🔒'}</div><div class="ach-text"><b>${esc(a.name)}</b><small>${esc(a.desc)}</small>${ok ? `<em class="ach-done">✅ Desbloqueada${p.ach[a.id] ? ' em ' + p.ach[a.id].split('-').reverse().join('/') : ''}</em>` : progressBar(v, a.goal) + `<em>${v} / ${a.goal}</em>`}${rewardFor(a.id) ? `<span class="ach-prize">🎁 Prémio: ${esc(rewardFor(a.id).text)}</span>` : ''}</div></article>` }).join('')}</div>`;
    });
    $('achList').innerHTML = html || '<p>Ainda não há conquistas neste filtro. Continua a jogar! 🚀</p>';
}

/* ===== Ecrã inicial e navegação ===== */
function update() { if (!p) return; $('welcome').textContent = p.name; $('homeAvatar').innerHTML = avatarHTML(lookAvatar(), lookFrame()); $('gamesCount').textContent = TOTAL_GAMES + ' jogos · ' + (TOTAL * TOTAL_GAMES) + ' níveis'; $('points').textContent = p.points || 0; $('completed').textContent = totalDone() + '/' + (TOTAL * TOTAL_GAMES); renderHomeAch(); drawGames() }
function drawGames() { $('games').innerHTML = GAME_IDS.map(id => { const n = doneIn(id); return `<button class="gamecard ${id === 'pixelart' ? 'special' : ''} ${NEW_IDS.includes(id) ? 'is-new' : ''}" onclick="openGame('${id}')">${id === 'pixelart' ? '<span class="ribbon">✦ ESPECIAL</span>' : NEW_IDS.includes(id) ? '<span class="ribbon new">✦ NOVO</span>' : ''}<span class="gicon">${A[id][0]}</span><h3>${A[id][1]}</h3><p>${A[id][2]}</p><div class="gprogress" aria-label="${n} de 12 níveis concluídos"><span style="width:${n / 12 * 100}%"></span></div><strong>${n}/12 níveis · ${n === 12 ? '🏅 Mestre!' : id === 'pixelart' ? 'Criar →' : 'Jogar →'}</strong></button>` }).join('') }
function openGame(id) { stopRunner(); act = id; lvl = 1; $('icon').textContent = A[id][0]; $('title').textContent = A[id][1]; $('desc').textContent = A[id][2]; $('eyebrow').textContent = id === 'pixelart' ? '✦ ATIVIDADE ESPECIAL' : OFFICE_IDS.includes(id) ? 'ESCRITÓRIO TIC' : 'DESAFIO TIC'; $('level').innerHTML = Array.from({ length: 12 }, (_, i) => `<option value="${i + 1}">Nível ${i + 1}${p.completed[id + '-' + (i + 1)] ? ' ✓' : ''}</option>`).join(''); show('activity'); start() }
function start() { stopRunner(); g = {}; mistakes = 0; if (document.activeElement && document.activeElement.tagName === 'SELECT') document.activeElement.blur(); $('level').value = lvl; $('levelText').textContent = `${lvl} de 12`; $('progress').style.width = (lvl / 12 * 100) + '%'; $('instructions').textContent = desc[act]; $('feedback').textContent = ''; $('feedback').className = ''; $('prev').disabled = lvl === 1; $('next').textContent = lvl === 12 ? 'Voltar aos jogos' : 'Seguinte →'; ({ keys: gameKeys, memory: gameMemory, pairs: gamePairs, safety: gameSafety, sequence: gameSequence, typing: gameTyping, wordsearch: gameWords, pixelart: gamePixel, truefalse: gameTF, maze: gameMaze, 'internet-run': gameInternetRun, workshop: gameWorkshop, search: gameSearch, word: gameWord, excel: gameExcel, ppt: gamePpt, files: gameFiles, network: gameNetwork, virusrush: gameVirusRush, ergo: gameErgo })[act]() }
function feedback(t, err = false, count = true) { $('feedback').textContent = t; $('feedback').className = err ? 'error' : ''; helper = t; if (err && count) mistakes++ }
function finish(t = 'Muito bem! Nível concluído! ⭐') {
    if (g.finished) return; g.finished = true;
    const k = act + '-' + lvl, fresh = !p.completed[k]; let extra = '';
    if (fresh) { p.completed[k] = true; p.points = totalDone() * 10; if (mistakes === 0) { p.flawless = (p.flawless || 0) + 1; extra = ' ✨ Sem erros!' } const o = $('level').querySelector(`option[value="${lvl}"]`); if (o) o.textContent = `Nível ${lvl} ✓` }
    recordActivity(); save(); checkAchievements(false);
    $('next').textContent = lvl === 12 ? 'Voltar aos jogos' : 'Seguinte →'; feedback(t + extra);
}
function changeLevel(n) { if (n === 1 && lvl === 12) { dashboard(); return } if (lvl + n < 1 || lvl + n > 12) return; lvl += n; start() }
/* ===== Dados dos jogos (mantidos) ===== */
const keys = [['Que tecla cria um espaço?', ['Enter', 'Espaço', 'Shift', 'Esc'], 1], ['Que tecla apaga à esquerda?', ['Backspace', 'Caps Lock', 'Tab', 'Alt'], 0], ['Que tecla confirma uma ação?', ['Esc', 'Ctrl', 'Enter', 'Alt'], 2], ['Que tecla ativa maiúsculas?', ['Tab', 'Caps Lock', 'Delete', 'F1'], 1], ['Que tecla costuma cancelar uma ação?', ['Esc', 'Espaço', 'Enter', 'Shift'], 0], ['Que tecla apaga à direita?', ['Delete', 'Backspace', 'Tab', 'Caps Lock'], 0], ['Que tecla ajuda a escrever símbolos superiores?', ['Shift', 'Esc', 'Enter', 'Num Lock'], 0], ['Que tecla avança para o campo seguinte?', ['Tab', 'Delete', 'Esc', 'F2'], 0], ['Que combinação copia?', ['Ctrl+V', 'Ctrl+C', 'Ctrl+X', 'Ctrl+Z'], 1], ['Que combinação cola?', ['Ctrl+Z', 'Ctrl+S', 'Ctrl+V', 'Ctrl+A'], 2], ['Que combinação desfaz uma ação?', ['Ctrl+P', 'Ctrl+Z', 'Ctrl+C', 'Ctrl+F'], 1], ['Que combinação seleciona tudo?', ['Ctrl+A', 'Ctrl+X', 'Ctrl+N', 'Ctrl+V'], 0]];
const safety = [['Uma pessoa desconhecida pede a tua palavra-passe.', ['Enviar', 'Não partilhar e avisar um adulto', 'Enviar o endereço'], 1], ['Um site pede dados pessoais sem explicar porquê.', ['Preencher tudo', 'Parar e pedir ajuda', 'Inventar dados'], 1], ['Alguém conhecido apenas online pede para te encontrar.', ['Ir sozinho', 'Pedir dinheiro', 'Não ir e falar com um adulto'], 2], ['Encontras uma foto embaraçosa de um colega.', ['Partilhar', 'Não partilhar e pedir ajuda', 'Publicar anonimamente'], 1], ['Recebes um anexo inesperado.', ['Abrir', 'Reencaminhar', 'Não abrir e confirmar'], 2], ['Uma palavra-passe segura deve ser…', ['123456', 'Difícil de adivinhar e privada', 'Igual para todos'], 1], ['Há insultos repetidos num chat.', ['Guardar segredo', 'Insultar também', 'Guardar provas e pedir ajuda'], 2], ['Uma aplicação pede acesso desnecessário ao microfone.', ['Aceitar sempre', 'Verificar e pedir ajuda', 'Dar acesso a tudo'], 1], ['Vês uma notícia surpreendente.', ['Partilhar logo', 'Verificar fontes', 'Acreditar na imagem'], 1], ['É seguro publicar a morada de casa?', ['Sim', 'Com emojis', 'Não, é privada'], 2], ['Alguém usa a tua conta sem autorização.', ['Mudar palavra-passe e pedir ajuda', 'Deixar ficar', 'Partilhar a palavra-passe'], 0], ['Um site pede instalar um ficheiro desconhecido para ganhar um prémio.', ['Instalar', 'Não instalar e pedir ajuda', 'Desativar segurança'], 1]];
const tf = [['Usar a mesma palavra-passe em todas as contas é boa ideia.', false], ['Devemos pedir autorização antes de publicar uma foto de outra pessoa.', true], ['Tudo na Internet é verdadeiro.', false], ['O teclado é um dispositivo de entrada.', true], ['Uma cópia de segurança ajuda a recuperar ficheiros.', true], ['É seguro partilhar a palavra-passe com desconhecidos.', false], ['O rato controla o ponteiro no ecrã.', true], ['Devemos respeitar os direitos de autor.', true], ['Um antivírus garante que nunca há riscos.', false], ['Podemos bloquear e denunciar abusos online.', true], ['Um navegador permite visitar páginas web.', true], ['Devemos pensar antes de publicar.', true]];
const pairData = [['Monitor', 'Mostra imagens'], ['Teclado', 'Permite escrever'], ['Rato', 'Controla o ponteiro'], ['Colunas', 'Reproduzem som'], ['Impressora', 'Passa documentos para papel'], ['Webcam', 'Capta imagem'], ['Microfone', 'Capta sons'], ['Disco/SSD', 'Guarda ficheiros'], ['Navegador', 'Visita páginas web'], ['Pasta', 'Organiza ficheiros'], ['Antivírus', 'Ajuda a detetar software malicioso'], ['Palavra-passe', 'Protege uma conta']];
const seq = [['🔴', '🔵', '🔴', '🔵', '🔴', ['🔵', '🟢', '🟡'], '🔵'], ['1', '2', '3', '4', '5', ['6', '7', '8'], '6'], ['⭐', '⭐', '🌙', '⭐', '⭐', ['🌙', '⭐', '☀️'], '🌙'], ['2', '4', '6', '8', '10', ['11', '12', '14'], '12'], ['🟩', '🟨', '🟨', '🟩', '🟨', ['🟩', '🟨', '🟥'], '🟨'], ['A', 'B', 'C', 'A', 'B', ['A', 'B', 'C'], 'C'], ['5', '10', '15', '20', '', ['22', '25', '30'], '25'], ['🔺', '🔵', '🔵', '🔺', '🔵', ['🔺', '🔵', '🟩'], '🔵'], ['1', '2', '4', '8', '', ['10', '12', '16'], '16'], ['🖥️', '⌨️', '🖥️', '⌨️', '', ['🖱️', '⌨️', '🖥️'], '🖥️'], ['3', '6', '9', '12', '', ['14', '15', '18'], '15'], ['A', 'C', 'E', 'G', '', ['H', 'I', 'J'], 'I']];
const pixel = [
    ['Monitor', ['..........', '..BBBBBB..', '..BCCCCB..', '..BCCCCB..', '..BBBBBB..', '....BB....', '...GGGG...', '..GGGGGG..', '..........', '..........']],
    ['Rato', ['....BB....', '...BGGB...', '..BGCCGB..', '..BGCCGB..', '..BGCCGB..', '...BGGB...', '...BYYB...', '....BB....', '..........', '..........']],
    ['Teclado', ['..........', '..BBBBBB..', '..BGGGGB..', '..BGGGGB..', '..BGGGGB..', '..BBBBBB..', '..........', '..........', '..........', '..........']],
    ['Computador', ['..BBBBBB..', '..BCCCCB..', '..BCCCCB..', '..BBBBBB..', '....BB....', '...GGGG...', '..GGGGGG..', '..BB..GG..', '..BG..GG..', '..BBBBBB..']],
    ['Pasta', ['..........', '..YYYY....', '..YYYYYY..', '.YOOOOOOY.', '.YOOOOOOY.', '.YOOOOOOY.', '..YYYYYYY.', '..........', '..........', '..........']],
    ['Disquete', ['..BBBBBB..', '..BGGGGB..', '..BGGCCB..', '..BGGCCB..', '..BBBBBB..', '..BYYYYB..', '..BYYYYB..', '..BBBBBB..', '..........', '..........']],
    ['Cadeado', ['...BBBB...', '..B....B..', '..B....B..', '..B....B..', '..BBBBBB..', '..BYYYYB..', '..BYYBYB..', '..BYYYYB..', '..BBBBBB..', '..........']],
    ['Rede', ['..CC....CC', '..BC....CB', '...B....B.', '....BBBB..', '....BYYB..', '....BBBB..', '...B....B.', '..BC....CB', '..CC....CC', '..........']],
    ['Impressora', ['...CCCC...', '...CWWC...', '...CCCC...', '..BBBBBB..', '..BGGGGB..', '..BGGGGB..', '..BBBBBB..', '...BYYB...', '...BBBB...', '..........']],
    ['Portátil', ['..BBBBBB..', '..BCCCCB..', '..BCCCCB..', '..BBBBBB..', '...BBBB...', '..BBBBBB..', '.BBBBBBBB.', '..........', '..........', '..........']],
    ['Wi-Fi', ['....C.....', '...C.C....', '..C...C...', '..........', '...BBBB...', '..B....B..', '.B..YY..B.', '....YY....', '....YY....', '..........']],
    ['Escudo digital', ['....BBBB..', '...BCCCCB.', '..BCLLLCB.', '..BCLLLCB.', '...BCLCB..', '....BCB...', '.....B....', '..........', '..........', '..........']]
];
const colors = { '.': ['Borracha', '#fff'], 'B': ['Roxo escuro', '#343354'], 'G': ['Cinzento', '#9aa0b3'], 'C': ['Azul', '#56c7e8'], 'Y': ['Amarelo', '#ffd166'], 'R': ['Vermelho', '#ff6b6b'], 'P': ['Roxo', '#9c7af5'], 'O': ['Laranja', '#ff9f43'], 'L': ['Verde', '#6dd5a5'], 'W': ['Branco', '#fff'] };
/* ===== Quizzes (Teclas, Segurança, V/F) ===== */
function quiz(q, opts, ans) {
    $('game').innerHTML = `<div class="question">${esc(q)}</div><div class="options">${opts.map((x, i) => `<button class="answer" data-i="${i}">${esc(x)}</button>`).join('')}</div>`;
    $('game').querySelectorAll('[data-i]').forEach(b => b.onclick = () => {
        if (g.finished) return;
        if (+b.dataset.i === ans) { b.classList.add('correct'); $('game').querySelectorAll('[data-i]').forEach(x => x.disabled = true); finish('Correto! Excelente trabalho! ⭐') }
        else { b.classList.add('wrong'); b.disabled = true; feedback('Ainda não! Lê as opções com atenção e tenta novamente.', true) }
    });
}

/* ===== Liga os Pares ===== */
function gamePairs() {
    const n = Math.min(pairData.length, 2 + lvl), off = (lvl * 2) % pairData.length;
    const items = pairData.slice(off).concat(pairData.slice(0, off)).slice(0, n);
    const shuffle = a => a.map(x => [Math.random(), x]).sort((x, y) => x[0] - y[0]).map(x => x[1]);
    const left = shuffle(items.map((x, i) => ({ t: x[0], i, s: 'l' }))), right = shuffle(items.map((x, i) => ({ t: x[1], i, s: 'r' })));
    g = { items, sel: null, done: [] };
    const col = arr => `<div class="pcol">${arr.map(x => `<button class="pair" data-i="${x.i}" data-s="${x.s}">${esc(x.t)}</button>`).join('')}</div>`;
    $('game').innerHTML = `<div class="pairs two">${col(left)}${col(right)}</div>`;
    $('game').querySelectorAll('.pair').forEach(b => b.onclick = () => {
        if (b.classList.contains('done') || g.finished) return;
        if (!g.sel) { g.sel = b; b.classList.add('selected'); return }
        const a = g.sel;
        if (a === b) { b.classList.remove('selected'); g.sel = null; return }
        a.classList.remove('selected');
        if (a.dataset.i === b.dataset.i && a.dataset.s !== b.dataset.s) {
            a.classList.add('done'); b.classList.add('done'); g.done.push(b.dataset.i); g.sel = null;
            if (g.done.length === items.length) finish('Todos os pares estão ligados! 🔗'); else feedback('Boa! Ligaste ' + g.done.length + ' de ' + items.length + '. ✔️')
        } else if (a.dataset.s === b.dataset.s) { b.classList.add('selected'); g.sel = b; feedback('Escolhe um conceito e depois a sua definição.') }
        else { g.sel = null; feedback('Não correspondem. Procura a relação correta.', true) }
    });
}

/* ===== Soletra ===== */
const SPELL = [
    ['RATO', '🖱️', 'Controla a setinha (o ponteiro) no ecrã.'],
    ['REDE', '🕸️', 'Liga computadores e telemóveis para partilharem informação.'],
    ['PASTA', '📁', 'Serve para organizar os ficheiros no computador.'],
    ['PIXEL', '🟦', 'O quadradinho minúsculo que forma as imagens no ecrã.'],
    ['DADOS', '📊', 'Informação que os computadores guardam e usam.'],
    ['TECLADO', '⌨️', 'Tem muitas teclas e serve para escrever letras e números.'],
    ['MONITOR', '🖥️', 'É o ecrã que mostra as imagens do computador.'],
    ['DIGITAL', '💻', 'Tudo o que funciona com computadores e tecnologia.'],
    ['FICHEIRO', '📄', 'Um documento, uma imagem ou um jogo guardado no computador.'],
    ['INTERNET', '🌐', 'A rede mundial que liga milhões de computadores.'],
    ['SEGURANÇA', '🛡️', 'Proteger as nossas contas e a nossa informação online.'],
    ['IMPRESSORA', '🖨️', 'Passa documentos do computador para o papel.']
];
const normWord = s => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z]/g, '').toUpperCase();
function speakText(t) { if ('speechSynthesis' in window) { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); u.lang = 'pt-PT'; u.rate = .85; speechSynthesis.speak(u); return true } return false }
function gameTyping() {
    const [shown, emoji, clue] = SPELL[lvl - 1], word = normWord(shown), hideEmoji = lvl >= 7;
    g = { word, shown, reveal: 0, emoji, hideEmoji };
    $('game').innerHTML = `<div class="typing-card"><div class="typing-icon" id="spellEmoji" aria-hidden="true">${hideEmoji ? '❓' : emoji}</div><p class="typing-clue"><b>Pista:</b> ${esc(clue)}</p><p class="typing-count">A palavra tem <b>${word.length}</b> letras.</p><div class="spelling-hint" id="spellSlots" aria-hidden="true"></div><div class="typing-actions"><button type="button" id="spellListen">🔊 Ouvir a palavra</button></div><form id="spellForm" class="textform" novalidate><label class="sr-only" for="spellInput">A tua resposta</label><input id="spellInput" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="${word.length + 3}" placeholder="Escreve aqui a palavra"><button class="primary" id="spellCheck" type="submit">Verificar ✓</button></form><p class="typing-help">Podes escrever em maiúsculas ou minúsculas. Não te preocupes com os acentos.${hideEmoji ? ' Neste nível o desenho está escondido: usa a dica do Tiko Teko!' : ''}</p></div>`;
    const input = $('spellInput');
    const render = () => { const typed = normWord(input.value); $('spellSlots').innerHTML = Array.from(word).map((c, i) => typed[i] ? `<span class="letter-slot filled">${typed[i]}</span>` : (i < g.reveal ? `<span class="letter-slot ghost">${c}</span>` : '<span class="letter-slot">_</span>')).join('') };
    input.addEventListener('input', render); render();
    $('spellListen').onclick = () => { if (!speakText(shown)) feedback('A leitura em voz alta não está disponível neste navegador.', false); input.focus() };
    if (!('speechSynthesis' in window)) $('spellListen').hidden = true;
    $('spellForm').addEventListener('submit', e => {
        e.preventDefault(); if (g.finished) return;
        const answer = normWord(input.value);
        if (!answer) { feedback('Escreve primeiro a tua resposta.', true, false); input.focus(); return }
        if (answer === word) { $('spellSlots').innerHTML = Array.from(word).map(c => `<span class="letter-slot filled ok">${c}</span>`).join(''); $('spellEmoji').textContent = emoji; input.disabled = true; finish('Muito bem! Soletraste ' + shown + ' corretamente! ✍️') }
        else { const right = Array.from(answer).filter((c, i) => c === word[i]).length; feedback(answer.length !== word.length ? `Quase! A palavra tem ${word.length} letras e escreveste ${answer.length}. Tenta outra vez!` : `Quase! Tens ${right} de ${word.length} letras no sítio certo. Tenta outra vez!`, true); input.focus(); input.select() }
    });
    input.focus();
}
function hintSpell() {
    if (!g.word || g.finished) return;
    if (g.hideEmoji && $('spellEmoji').textContent === '❓') { $('spellEmoji').textContent = g.emoji; feedback('💡 Aqui tens o desenho da palavra!'); return }
    if (g.reveal < g.word.length - 1) { g.reveal++; $('spellInput').dispatchEvent(new Event('input')); feedback(`💡 A palavra começa por «${g.word.slice(0, g.reveal)}». Carrega em 🔊 para a ouvir!`) }
    else feedback('💡 Já só falta uma letra! Carrega em 🔊 para ouvir a palavra.')
}

/* ===== Sopa de Letras ===== */
const WS_WORDS = ['TECLADO', 'MONITOR', 'INTERNET', 'PASTA', 'RATO', 'FICHEIRO', 'REDE', 'PIXEL', 'DADOS', 'SEGURO', 'DIGITAL', 'SENHA'];
function gameWords() {
    const count = Math.min(3 + Math.floor((lvl - 1) / 2), 8), off = ((lvl - 1) * 3) % WS_WORDS.length;
    const target = WS_WORDS.slice(off).concat(WS_WORDS.slice(0, off)).slice(0, count), size = lvl <= 6 ? 10 : 12;
    const dirs = lvl <= 3 ? [[0, 1], [1, 0]] : lvl <= 7 ? [[0, 1], [1, 0], [1, 1]] : [[0, 1], [1, 0], [1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1], [-1, 1]];
    let grid, placed, ok = false;
    for (let attempt = 0; attempt < 200 && !ok; attempt++) {
        grid = Array.from({ length: size }, () => Array(size).fill('')); placed = []; ok = true;
        for (const w of [...target].sort((a, b) => b.length - a.length)) {
            let found = false;
            for (let t = 0; t < 300 && !found; t++) {
                const [dr, dc] = dirs[Math.floor(Math.random() * dirs.length)], r = Math.floor(Math.random() * size), c = Math.floor(Math.random() * size);
                let fits = true;
                for (let k = 0; k < w.length; k++) { const rr = r + dr * k, cc = c + dc * k; if (rr < 0 || rr >= size || cc < 0 || cc >= size || (grid[rr][cc] && grid[rr][cc] !== w[k])) { fits = false; break } }
                if (fits) { const cells = []; for (let k = 0; k < w.length; k++) { const rr = r + dr * k, cc = c + dc * k; grid[rr][cc] = w[k]; cells.push(rr * size + cc) } placed.push({ word: w, cells }); found = true }
            }
            if (!found) { ok = false; break }
        }
    }
    if (!ok) { // garantia: uma palavra por linha
        grid = Array.from({ length: size }, () => Array(size).fill('')); placed = [];
        target.forEach((w, i) => { const cells = []; for (let k = 0; k < w.length; k++) { grid[i][k] = w[k]; cells.push(i * size + k) } placed.push({ word: w, cells }) });
    }
    const abc = 'ABCDEFGHIJKLMNOPQRSTUVXZ';
    for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) if (!grid[r][c]) grid[r][c] = abc[Math.floor(Math.random() * abc.length)];
    g = { target, grid, size, placed, selected: [], found: [], foundCells: new Set(), down: null };
    $('game').innerHTML = `<div class="wordlist" aria-label="Palavras a encontrar">${target.map(w => `<span class="chip" id="w${w}">${w}</span>`).join('')}</div><p class="ws-count" id="wsCount">Encontradas: 0 de ${target.length}</p><div class="letters wordsearch-grid" id="wsGrid" style="grid-template-columns:repeat(${size},minmax(0,1fr));max-width:${size * 42}px" role="group" aria-label="Grelha da sopa de letras">${grid.flat().map((ch, i) => `<button type="button" class="letter" data-l="${i}" aria-label="Letra ${ch}, linha ${Math.floor(i / size) + 1}, coluna ${i % size + 1}">${ch}</button>`).join('')}</div><p class="pixel-note">Clica na <b>primeira</b> letra e depois na <b>última</b> letra da palavra${lvl <= 3 ? ' (da esquerda para a direita ou de cima para baixo)' : lvl <= 7 ? ' (também na diagonal)' : ' (em qualquer direção, até ao contrário)'}. Também podes arrastar com o rato.</p><div class="ws-actions"><button type="button" id="clearWordSelection">Limpar seleção</button></div>`;
    const grd = $('wsGrid');
    grd.addEventListener('pointerdown', e => { const b = e.target.closest('.letter'); g.down = b ? Number(b.dataset.l) : null; g.dragType = e.pointerType });
    grd.addEventListener('pointerup', e => {
        const el = document.elementFromPoint(e.clientX, e.clientY), b = el && el.closest ? el.closest('.letter') : null; if (!b) { g.down = null; return }
        const up = Number(b.dataset.l);
        if (g.dragType === 'mouse' && g.down !== null && g.down !== up) { g.selected = [g.down]; wordSelect(up) } else wordSelect(up);
        g.down = null;
    });
    grd.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { const b = e.target.closest('.letter'); if (b) { e.preventDefault(); wordSelect(Number(b.dataset.l)) } } });
    $('clearWordSelection').addEventListener('click', () => { g.selected = []; renderWordSelection(); feedback('Seleção limpa. Escolhe uma nova palavra.') });
}
function wordSelect(index) {
    if (!g || !g.grid || g.found.length === g.target.length) return;
    if (!Number.isInteger(index) || index < 0 || index >= g.size * g.size) return;
    if (g.selected.length === 0) { g.selected = [index]; renderWordSelection(); feedback('Agora seleciona a última letra da palavra.'); return }
    const first = g.selected[0]; if (index === first) { g.selected = []; renderWordSelection(); return }
    const hit = g.placed.find(it => !g.found.includes(it.word) && ((it.cells[0] === first && it.cells[it.cells.length - 1] === index) || (it.cells[0] === index && it.cells[it.cells.length - 1] === first)));
    if (hit) {
        g.found.push(hit.word); hit.cells.forEach(i => g.foundCells.add(i)); const chip = $('w' + hit.word); if (chip) chip.classList.add('found');
        g.selected = []; renderWordSelection(); $('wsCount').textContent = `Encontradas: ${g.found.length} de ${g.target.length}`;
        if (g.found.length === g.target.length) finish('Excelente! Encontraste todas as palavras! 🏆'); else feedback('Encontraste ' + hit.word + '! 🔎 Faltam ' + (g.target.length - g.found.length) + '.');
        return;
    }
    g.selected = [index]; renderWordSelection(); feedback('Isso não é uma palavra da lista. Escolhe outra última letra ou recomeça.', true, false);
}
function renderWordSelection() { if (!g || !g.grid) return; $('game').querySelectorAll('[data-l]').forEach(b => { const i = Number(b.dataset.l); b.classList.toggle('selected-letter', g.selected.includes(i)); b.classList.toggle('found', g.foundCells.has(i)); b.classList.remove('hinted') }) }
function hintWords() {
    if (!g.placed || g.finished) return;
    const left = g.placed.filter(x => !g.found.includes(x.word)); if (!left.length) return;
    const w = left[Math.floor(Math.random() * left.length)], b = $('game').querySelector(`[data-l="${w.cells[0]}"]`);
    if (b) { b.classList.add('hinted'); setTimeout(() => b.classList.remove('hinted'), 3500) }
    feedback(`💡 Procura «${w.word}»: começa na letra que está a piscar!`);
}

/* ===== TICO MAZE ===== */
function genMaze(cols, rows, seed) {
    const W = cols * 2 + 1, H = rows * 2 + 1, m = Array.from({ length: H }, () => Array(W).fill('#')), rnd = mulberry32(seed), vis = new Set(['0,0']), st = [[0, 0]]; m[1][1] = '.';
    while (st.length) {
        const [cx, cy] = st[st.length - 1], nb = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([dx, dy]) => [cx + dx, cy + dy, dx, dy]).filter(([x, y]) => x >= 0 && y >= 0 && x < cols && y < rows && !vis.has(x + ',' + y));
        if (!nb.length) { st.pop(); continue }
        const [nx, ny, dx, dy] = nb[Math.floor(rnd() * nb.length)]; m[cy * 2 + 1 + dy][cx * 2 + 1 + dx] = '.'; m[ny * 2 + 1][nx * 2 + 1] = '.'; vis.add(nx + ',' + ny); st.push([nx, ny]);
    }
    m[H - 2][W - 2] = 'E'; return m;
}
function gameMaze() {
    const n = 3 + Math.floor((lvl - 1) / 2), map = genMaze(n, n, lvl * 977 + 13), N = n * 2 + 1;
    g = { map, pos: [1, 1], moves: 0, finished: false, seen: new Set(['1,1']), N };
    $('game').innerHTML = `<p class="pixel-note">Leva o Tiko até à bandeira. Usa as setas do teclado ou WASD (no telemóvel aparecem os botões por baixo do labirinto). Não precisas de ser rápido!</p><div class="maze-container"><div id="maze" class="maze dyn" style="--n:${N}" role="img" aria-label="Labirinto ${N} por ${N}"></div></div><div class="maze-controls"><button data-dir="up" aria-label="Cima">⬆️</button><div><button data-dir="left" aria-label="Esquerda">⬅️</button><button data-dir="down" aria-label="Baixo">⬇️</button><button data-dir="right" aria-label="Direita">➡️</button></div></div><p id="mazeMoves" class="pixel-note">Movimentos: 0</p><button id="restartMaze">↻ Recomeçar labirinto</button>`;
    $('game').querySelectorAll('[data-dir]').forEach(b => b.onclick = () => move(b.dataset.dir));
    $('restartMaze').onclick = () => gameMaze(); renderMaze();
}
function renderMaze() {
    const el = $('maze'); if (!el || !g.map) return; el.innerHTML = '';
    g.map.forEach((row, r) => row.forEach((cell, c) => {
        const s = document.createElement('span'); s.className = 'cell';
        if (cell === '#') s.classList.add('wall'); else if (g.seen.has(r + ',' + c)) s.classList.add('trail');
        if (cell === 'E') { s.classList.add('exit'); s.textContent = '🏁' }
        if (r === g.pos[0] && c === g.pos[1]) { s.classList.add('player'); s.textContent = '🤖' }
        el.appendChild(s);
    }));
    const m = $('mazeMoves'); if (m) m.textContent = 'Movimentos: ' + g.moves;
}
function move(dir) {
    if (!g || !g.map || g.finished) return;
    const d = { up: [-1, 0], down: [1, 0], left: [0, -1], right: [0, 1] }[dir]; if (!d) return;
    const r = g.pos[0] + d[0], c = g.pos[1] + d[1];
    if (r < 0 || r >= g.map.length || c < 0 || c >= g.map[r].length || g.map[r][c] === '#') return;
    g.pos = [r, c]; g.moves++; g.seen.add(r + ',' + c); renderMaze();
    if (g.map[r][c] === 'E') finish('Encontraste a saída em ' + g.moves + ' movimentos! 🧭');
}
/* ===== Jogos e funções mantidos ===== */
function gameKeys() { let q = keys[lvl - 1]; quiz(q[0], q[1], q[2]) }
function gameSafety() { let q = safety[lvl - 1]; quiz(q[0], q[1], q[2]) }
function gameTF() { let q = tf[lvl - 1]; quiz(q[0], ['Verdadeiro', 'Falso'], q[1] ? 0 : 1) }
function gameSequence() { let q = seq[lvl - 1], s = q.slice(0, 5).filter(Boolean); $('game').innerHTML = `<div class="sequence">${s.map(x => `<span>${x}</span>`).join('')}<span>?</span></div><p class="question">Qual é o próximo elemento?</p><div class="options">${q[5].map(x => `<button class="answer" data-s="${x}">${x}</button>`).join('')}</div>`; $('game').querySelectorAll('[data-s]').forEach(b => b.onclick = () => b.dataset.s === q[6] ? finish('Padrão descoberto! 🔢') : feedback('Observa a sequência mais uma vez.', true)) }
function gameMemory() { let icons = ['⌨️', '🖥️', '🖱️', '📁', '🔒', '🌐', '🖨️', '💾'], n = Math.min(4 + Math.floor((lvl - 1) / 3), 8), cards = [...icons.slice(0, n), ...icons.slice(0, n)].sort(() => Math.random() - .5); g = { cards, open: [], matched: [], busy: false }; $('game').innerHTML = `<p class="question">Pares: <span id="pc">0/${n}</span></p><div class="memory">${cards.map((_, i) => `<button data-card="${i}">?</button>`).join('')}</div>`; $('game').querySelectorAll('[data-card]').forEach(b => b.onclick = () => flip(+b.dataset.card)) }
function flip(i) { if (g.busy || g.matched.includes(i) || g.open.includes(i)) return; g.open.push(i); let b = $('game').querySelector(`[data-card="${i}"]`); b.textContent = g.cards[i]; b.classList.add('revealed'); if (g.open.length === 2) { let [a, c] = g.open; if (g.cards[a] === g.cards[c]) { g.matched.push(a, c);[a, c].forEach(j => $('game').querySelector(`[data-card="${j}"]`).classList.add('matched')); g.open = []; $('pc').textContent = g.matched.length / 2 + '/' + g.cards.length / 2; if (g.matched.length === g.cards.length) finish('Encontraste todos os pares! 🧠') } else { g.busy = true; setTimeout(() => { [a, c].forEach(j => { let x = $('game').querySelector(`[data-card="${j}"]`); if (x) { x.textContent = '?'; x.classList.remove('revealed') } }); g.open = []; g.busy = false }, 650) } } }
function gamePixel() { let t = pixel[lvl - 1]; g = { template: t, mode: 'model', color: 'B', grid: Array(100).fill('.') }; $('game').innerHTML = `<div class="pixel-wrap"><div class="modes"><button class="mode" data-mode="free">🎨 Pintura livre</button><button class="mode active" data-mode="model">🧩 Reproduzir modelo</button></div><b id="pixelTitle">Desafio ${lvl}: ${t[0]}</b><div class="pixel-layout"><div class="reference" id="ref"><b>Modelo de referência</b><div class="refgrid">${t[1].join('').split('').map(ch => `<span style="background:${colors[ch][1]}"></span>`).join('')}</div></div><div class="pixelgrid" id="pixelGrid">${g.grid.map((ch, i) => px(ch, i)).join('')}</div></div><p class="pixel-note" id="pixelNote">Escolhe uma cor e reproduz o modelo píxel a píxel.</p><div class="palette" id="palette">${Object.entries(colors).filter(([k]) => k !== '.').map(([k, v]) => `<button class="swatch ${k === 'B' ? 'selected' : ''}" data-color="${k}" title="${v[0]}" aria-label="${v[0]}" style="background:${v[1]}"></button>`).join('')}<button class="swatch eraser" data-color="." aria-label="Borracha" title="Borracha">⌫</button></div><div class="pixel-tools"><button id="clearPx">🧹 Limpar desenho</button><button id="checkPx" class="primary">Verificar desenho ✓</button></div><section class="pixel-vocabulary"><b>💻 Vocabulário digital</b><div class="pixel-vocabulary-list">${['CPU', 'Memória RAM', 'Disco SSD', 'Pen USB', 'Router', 'Servidor', 'Nuvem digital', 'Base de dados', 'Código QR', 'Bluetooth', 'Sistema operativo', 'Aplicação', 'Navegador web', 'Endereço IP', 'Firewall', 'Cópia de segurança', 'Ficheiro', 'Pasta', 'Wi-Fi', 'Algoritmo', 'Inteligência artificial'].map(x => `<span>${x}</span>`).join('')}</div></section></div>`; $('game').querySelectorAll('[data-mode]').forEach(b => b.onclick = () => setMode(b.dataset.mode)); $('palette').querySelectorAll('[data-color]').forEach(b => b.onclick = () => chooseColor(b.dataset.color)); $('clearPx').onclick = () => { g.grid = Array(100).fill('.'); renderPx(); feedback('Desenho limpo. Podes recomeçar!') }; $('checkPx').onclick = checkPx; renderPx() }
function px(ch, i) { return `<button class="px" data-px="${i}" aria-label="Píxel ${i + 1}" style="background:${colors[ch][1]}"></button>` }
function renderPx() { $('pixelGrid').innerHTML = g.grid.map((ch, i) => px(ch, i)).join(''); $('pixelGrid').querySelectorAll('[data-px]').forEach(b => b.onclick = () => { g.grid[+b.dataset.px] = g.color; b.style.background = colors[g.color][1] }) }
function chooseColor(c) { g.color = c; $('palette').querySelectorAll('[data-color]').forEach(b => b.classList.toggle('selected', b.dataset.color === c)); feedback(c === '.' ? 'Borracha selecionada.' : 'Cor selecionada: ' + colors[c][0] + '.') }
function setMode(m) { g.mode = m; g.grid = Array(100).fill('.'); $('game').querySelectorAll('[data-mode]').forEach(b => b.classList.toggle('active', b.dataset.mode === m)); $('ref').classList.toggle('hidden', m === 'free'); $('pixelTitle').textContent = m === 'free' ? 'Ateliê livre: cria o teu desenho' : `Desafio ${lvl}: ${g.template[0]}`; $('pixelNote').textContent = m === 'free' ? 'Cria uma imagem à tua maneira. Pinta pelo menos 8 píxeis para guardar.' : 'Escolhe uma cor e pinta os quadradinhos para reproduzir o modelo.'; $('checkPx').textContent = m === 'free' ? 'Guardar criação ✓' : 'Verificar desenho ✓'; renderPx(); feedback(m === 'free' ? 'Modo de pintura livre. Diverte-te!' : 'Modo de reprodução. Compara com o modelo.') }
function checkPx() { if (g.mode === 'free') { let n = g.grid.filter(x => x !== '.').length; if (n < 8) return feedback('Pinta pelo menos 8 píxeis para guardar a tua criação.', true); return finish('Criação guardada! Tens imaginação de artista digital! 🎨') } let target = g.template[1].join('').split(''), errors = target.filter((x, i) => g.grid[i] !== x).length; if (!errors) finish('Perfeito! Reproduziste o modelo píxel a píxel! 🏆'); else feedback(`Estás quase! Há ${errors} píxel${errors === 1 ? '' : 's'} para corrigir. Compara com o modelo.`, true) }
function toggleHelp() { $('help').classList.toggle('hidden'); $('mascot').setAttribute('aria-expanded', String(!$('help').classList.contains('hidden'))); if (!$('help').classList.contains('hidden')) $('chatInput').focus() }
function chatQuick(text) { chatAsk(text) }
function toggleAccessibility() { const panel = $('accessibilityPanel'); panel.classList.toggle('hidden'); $('accessibilityToggle').setAttribute('aria-expanded', String(!panel.classList.contains('hidden'))) }
function accessibilitySettings() { try { return JSON.parse(localStorage.getItem('tikoTekoAccessibility') || '{}') } catch { return {} } }
function storeAccessibility(a) { localStorage.setItem('tikoTekoAccessibility', JSON.stringify(a)); loadAccessibility() }
function loadAccessibility() { const a = accessibilitySettings(); document.documentElement.style.setProperty('--text-scale', a.scale || 1); document.body.classList.toggle('high-contrast', !!a.contrast); document.body.classList.toggle('reduce-motion', !!a.motion); document.body.classList.toggle('dyslexia-friendly', !!a.dyslexia); $('contrastButton').setAttribute('aria-pressed', String(!!a.contrast)); $('motionButton').setAttribute('aria-pressed', String(!!a.motion)); $('fontButton').setAttribute('aria-pressed', String(!!a.dyslexia)) }
function changeTextSize(delta) { const a = accessibilitySettings(); a.scale = Math.max(.85, Math.min(1.4, Number(a.scale || 1) + delta * .1)); storeAccessibility(a) }
function toggleContrast() { const a = accessibilitySettings(); a.contrast = !a.contrast; storeAccessibility(a) }
function toggleReducedMotion() { const a = accessibilitySettings(); a.motion = !a.motion; storeAccessibility(a) }
function toggleDyslexiaFont() { const a = accessibilitySettings(); a.dyslexia = !a.dyslexia; storeAccessibility(a) }
function resetAccessibility() { storeAccessibility({ scale: 1, contrast: false, motion: false, dyslexia: false }) }
/* ===== DANGER ZONE — aventura de plataformas (inspirada em jogos como o Astro Bot) =====
   Salta, esmaga vírus, recolhe moedas e resgata 3 mini-bots em cada missão. */
const DZ_THEMES = [
    { name: 'Nuvem Digital', skyTop: '#3fa9ff', skyBot: '#d4f3ff', far: '#9fdcff', near: '#7ccdf5', ground: '#2f9e6e', top: '#7ee59b', dirt: '#1f7a56', plat: '#ffd166', edge: '#e0a82e', deco: 'cloud' },
    { name: 'Cidade Wi-Fi', skyTop: '#2a1b6e', skyBot: '#ff8fb1', far: '#5b49b0', near: '#3d2e80', ground: '#4a4e8f', top: '#8fa0ff', dirt: '#2c2e63', plat: '#5ce4ef', edge: '#2fb3c0', deco: 'city' },
    { name: 'Espaço Binário', skyTop: '#050a24', skyBot: '#243a8f', far: '#2d4699', near: '#1a2a6c', ground: '#5a4aa8', top: '#a28cff', dirt: '#33276e', plat: '#ff9fd6', edge: '#d963a8', deco: 'stars' },
    { name: 'Servidor em Chamas', skyTop: '#3a0f1f', skyBot: '#ff8a4d', far: '#8a3040', near: '#561a32', ground: '#7b4b3a', top: '#ffb347', dirt: '#4a2a22', plat: '#ffe66d', edge: '#d9a21e', deco: 'servers' }
];
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) { r = Math.min(Array.isArray(r) ? r[0] : r || 0, w / 2, h / 2); this.moveTo(x + r, y); this.arcTo(x + w, y, x + w, y + h, r); this.arcTo(x + w, y + h, x, y + h, r); this.arcTo(x, y + h, x, y, r); this.arcTo(x, y, x + w, y, r); this.closePath() }
}
const DZ = { W: 900, H: 360, GY: 300, PW: 26, PH: 46, GRAV: .62, JUMP: 12.4 };

function buildDZWorld(L) {
    const rnd = mulberry32(L * 7919 + 101), R = (a, b) => a + rnd() * (b - a), GY = DZ.GY;
    const plats = [], enemies = [], spikes = [], coins = [], bots = [];
    let x = 0, cp = null;
    const len = 2000 + L * 220;
    const ground = w => { const s = x; plats.push({ x: s, y: GY, w, ground: true }); x += w; return s };
    const coinRow = (sx, w, y, n) => { for (let i = 0; i < n; i++) coins.push({ x: sx + (i + .5) * w / n, y }) };
    const coinArc = (sx, w, y, n, h) => { for (let i = 0; i < n; i++) { const t = (i + .5) / n; coins.push({ x: sx + t * w, y: y - Math.sin(t * Math.PI) * h }) } };
    const first = ground(460); coinRow(first + 160, 220, GY - 32, 4);
    const botAt = [.18, .42, .72]; let botIdx = 0;
    while (x < len) {
        const prog = x / len;
        if (!cp && prog > .5) { const s = ground(320); cp = { x: s + 130, y: GY }; coinRow(s + 190, 100, GY - 32, 2); continue }
        if (botIdx < 3 && prog >= botAt[botIdx]) {
            const s = ground(440), a = { x: s + 70, y: GY - 70, w: 90 }, b = { x: s + 190, y: GY - 130, w: 90 }, c = { x: s + 310, y: GY - 185, w: 90 };
            plats.push(a, b, c); coinRow(a.x + 10, 70, a.y - 26, 2); coinRow(b.x + 10, 70, b.y - 26, 2);
            bots.push({ x: c.x + 45, y: c.y - 24, idx: botIdx }); coinRow(c.x - 10, 50, c.y - 50, 1); botIdx++; continue;
        }
        const types = ['run', 'run', 'gap', 'float', 'enemy']; if (L >= 2) types.push('spikes', 'enemy'); if (L >= 4) types.push('bridge', 'gap'); if (L >= 7) types.push('spikes', 'bridge');
        const t = types[Math.floor(rnd() * types.length)];
        if (t === 'run') { const w = R(220, 330), s = ground(w); coinRow(s + 30, w - 60, GY - 32, Math.floor(w / 55)) }
        else if (t === 'gap') { ground(R(130, 200)); const gw = R(60, Math.min(125, 78 + L * 4)); coinArc(x, gw, GY - 60, 4, 55); x += gw; ground(R(180, 260)) }
        else if (t === 'spikes') { const w = R(320, 400), s = ground(w), sw = Math.min(90, Math.floor(R(38, 42 + L * 4))); spikes.push({ x: s + w / 2 - sw / 2, y: GY - 22, w: sw, h: 22 }); coinArc(s + w / 2 - sw / 2 - 15, sw + 30, GY - 34, 5, 70) }
        else if (t === 'enemy') { const w = R(320, 430), s = ground(w), n = L >= 6 ? 2 : 1; for (let i = 0; i < n; i++) enemies.push({ x: s + 90 + i * 140, y: GY - 30, w: 34, h: 30, vx: (.7 + L * .06) * (i % 2 ? -1 : 1), minX: s + 30, maxX: s + w - 64, alive: true }); coinRow(s + 80, w - 160, GY - 100, 3) }
        else if (t === 'float') { const w = R(340, 420), s = ground(w); plats.push({ x: s + 60, y: GY - 80, w: 100 }, { x: s + 220, y: GY - 130, w: 100 }); coinRow(s + 70, 80, GY - 106, 3); coinRow(s + 230, 80, GY - 156, 3) }
        else if (t === 'bridge') { ground(140); const ps = x; for (let i = 0; i < 3; i++) { plats.push({ x: ps + 35 + i * 140, y: GY - 14 - (i % 2) * 34, w: 84 }); coinRow(ps + 45 + i * 140, 64, GY - 60 - (i % 2) * 34, 2) } x = ps + 35 + 3 * 140; ground(200) }
    }
    const fin = ground(520), goal = { x: fin + 300, y: GY };
    if (!cp) cp = { x: 400, y: GY };
    return { plats, enemies, spikes, coins: coins.map((c, i) => ({ ...c, id: i, got: false })), bots, cp, goal, width: x, total: coins.length };
}

function gameInternetRun() {
    stopRunner();
    const theme = DZ_THEMES[Math.min(3, Math.floor((lvl - 1) / 3))], world = buildDZWorld(lvl), { W, H, GY, PW, PH } = DZ;
    const sprite = new Image(); sprite.src = 'TIKO_TECO.png';
    const S = { x: 70, y: GY - PH, px: 70, py: GY - PH, vx: 0, vy: 0, onGround: true, jumps: 0, coyote: 0, face: 1, inv: 0, hearts: 4, coins: 0, bots: new Set(), hits: 0, started: false, over: false, paused: false, raf: 0, last: 0, cam: 0, t: 0, left: false, right: false, cpOn: false, spawn: { x: 70, y: GY - PH }, parts: [], msgT: 0 };
    g = S; S.raf = 0; S.world = world;
    $('game').innerHTML = `<div class="runner-wrap danger-zone"><div class="runner-title"><span class="danger-kicker">MISSÃO ${lvl}/12 · ${theme.name.toUpperCase()}</span><h2>⚡ DANGER <em>ZONE</em></h2><p>Atravessa a Internet em segurança: esmaga vírus, foge dos espinhos e resgata os mini-bots!</p></div><div class="runner-hud" aria-live="off"><b id="dzHearts" aria-label="Corações">❤️❤️❤️❤️</b><span id="dzCoins">🪙 0</span><span id="dzBots">🤖 0/3</span><span id="dzProg">PERCURSO: 0%</span></div><div class="runner-stage"><canvas id="runnerCanvas" width="${W}" height="${H}" role="img" aria-label="Jogo Danger Zone: jogo de plataformas. Salta, esmaga vírus, recolhe moedas e resgata mini-bots."></canvas><div class="runner-start" id="runnerStart"><div class="runner-start-art"><span class="orbit orbit-a">🪙</span><span class="orbit orbit-b">🤖</span><img class="runner-mascot" src="TIKO_TECO.png" alt="Tiko Teko"><span class="orbit orbit-c">🦠</span></div><h3>Estás preparado?</h3><p>Corre, salta duas vezes no ar e esmaga os vírus por cima. Resgata 3 mini-bots e chega ao portal!</p><button id="runnerPlay" class="runner-play">▶ PLAY</button><small>O jogo só começa quando carregares em PLAY.</small></div></div><div class="runner-instruction"><span>⌨️ ← → ou A / D</span><span>⬆ ESPAÇO / ↑ = saltar (2×)</span><span>🦠 Esmaga por cima</span><span>🤖 Resgata 3 bots</span></div><div class="runner-controls"><button id="runnerLeft" aria-label="Mover para a esquerda" disabled>◀</button><button id="runnerRight" aria-label="Mover para a direita" disabled>▶</button><button id="runnerJump" class="primary" disabled>⬆ SALTAR</button><button id="runnerPause" disabled>Ⅱ PAUSA</button><button id="runnerRestart">↻ RECOMEÇAR</button></div><p id="runnerMessage" role="status" aria-live="polite">Lê as instruções e carrega em PLAY quando estiveres pronto.</p></div>`;
    const canvas = $('runnerCanvas'), ctx = canvas.getContext('2d'), msg = t => { $('runnerMessage').textContent = t };
    function tone(f, d = .07) { try { const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return; const ac = new AC(), o = ac.createOscillator(), v = ac.createGain(); o.type = 'triangle'; o.frequency.value = f; o.connect(v); v.connect(ac.destination); v.gain.value = .04; o.start(); o.stop(ac.currentTime + d); o.onended = () => ac.close() } catch { } }
    const burst = (x, y, c, n = 8) => { for (let i = 0; i < n; i++) S.parts.push({ x, y, vx: (Math.random() - .5) * 5, vy: -Math.random() * 4 - 1, life: 28 + Math.random() * 14, c, s: 2 + Math.random() * 3 }) };
    function jump() {
        if (!S.started || S.over || S.paused) return;
        if (S.onGround || S.coyote > 0) { S.vy = -DZ.JUMP; S.onGround = false; S.coyote = 0; S.jumps = 1; tone(520); burst(S.x + PW / 2, S.y + PH, '#fff', 5) }
        else if (S.jumps < 2) { S.vy = -DZ.JUMP * .9; S.jumps = 2; tone(700); burst(S.x + PW / 2, S.y + PH, '#9ff', 8) }
    }
    function hurt(fall) {
        if (S.inv > 0 && !fall) return;
        S.hearts--; S.hits++; tone(180, .18); burst(S.x + PW / 2, S.y + PH / 2, '#ff5578', 12);
        if (S.hearts <= 0) { endRun(false); return }
        S.inv = 110;
        if (fall) { S.x = S.spawn.x; S.y = S.spawn.y; S.vx = 0; S.vy = 0; S.onGround = true; msg('Cuidado com o vazio! Voltaste ao último ponto seguro. 🚩') }
        else { S.vy = -7; S.vx = -S.face * 4; msg('Ai! Perdeste um coração. Esmaga os vírus por cima! 💥') }
    }
    function update(dt) {
        S.t += dt; S.px = S.x; S.py = S.y;
        const acc = .6 * dt, maxV = 3.7 + lvl * .06;
        if (S.left) { S.vx -= acc; S.face = -1 } if (S.right) { S.vx += acc; S.face = 1 }
        if (!S.left && !S.right) S.vx *= Math.pow(S.onGround ? .78 : .95, dt);
        S.vx = Math.max(-maxV, Math.min(maxV, S.vx));
        S.x = Math.max(0, S.x + S.vx * dt); S.vy += DZ.GRAV * dt; S.y += S.vy * dt;
        S.onGround = false;
        for (const pl of world.plats) {
            if (S.vy >= 0 && S.py + PH <= pl.y + 8 && S.y + PH >= pl.y && S.x + PW > pl.x + 3 && S.x < pl.x + pl.w - 3) { S.y = pl.y - PH; S.vy = 0; S.onGround = true; S.jumps = 0; break }
        }
        S.coyote = S.onGround ? 7 : Math.max(0, S.coyote - dt);
        if (S.inv > 0) S.inv -= dt;
        if (S.y > H + 60) { hurt(true); return }
        const bx = S.x + 2, by = S.y + 4, bw = PW - 4, bh = PH - 4;
        for (const e of world.enemies) {
            if (!e.alive) continue;
            e.x += e.vx * dt; if (e.x < e.minX || e.x > e.maxX) { e.vx *= -1; e.x = Math.max(e.minX, Math.min(e.maxX, e.x)) }
            if (bx < e.x + e.w && bx + bw > e.x && by < e.y + e.h && by + bh > e.y) {
                if (S.vy > 0 && S.py + PH <= e.y + 14) { e.alive = false; S.vy = -9; S.jumps = 1; tone(880, .1); burst(e.x + e.w / 2, e.y + 10, '#b46cff', 14); msg('Vírus esmagado! 💥') }
                else hurt(false);
            }
        }
        for (const sp of world.spikes) { if (bx < sp.x + sp.w - 4 && bx + bw > sp.x + 4 && by + bh > sp.y + 4 && by < sp.y + sp.h) hurt(false) }
        for (const c of world.coins) { if (!c.got && Math.abs(c.x - (S.x + PW / 2)) < 24 && Math.abs(c.y - (S.y + PH / 2)) < 30) { c.got = true; S.coins++; tone(990, .05); burst(c.x, c.y, '#ffd84a', 5) } }
        for (const b of world.bots) { if (!S.bots.has(b.idx) && Math.abs(b.x - (S.x + PW / 2)) < 30 && Math.abs(b.y - (S.y + PH / 2)) < 40) { S.bots.add(b.idx); tone(660, .12); setTimeout(() => tone(990, .15), 110); burst(b.x, b.y, '#7ef0ff', 20); msg(`Resgataste um mini-bot! 🤖 (${S.bots.size}/3)`) } }
        if (!S.cpOn && S.x > world.cp.x) { S.cpOn = true; S.spawn = { x: world.cp.x, y: GY - PH }; tone(760, .15); msg('Ponto de controlo ativado! 🚩 Se caíres, voltas aqui.') }
        if (S.x + PW > world.goal.x + 10) { endRun(true); return }
        S.parts = S.parts.filter(p => (p.life -= dt) > 0); S.parts.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += .25 * dt });
        const target = Math.max(0, Math.min(world.width - W, S.x - 300)); S.cam += (target - S.cam) * .12;
    }
    function hud() {
        $('dzHearts').textContent = '❤️'.repeat(Math.max(0, S.hearts)) + '🤍'.repeat(Math.max(0, 4 - S.hearts)); $('dzCoins').textContent = '🪙 ' + S.coins; $('dzBots').textContent = '🤖 ' + S.bots.size + '/3';
        $('dzProg').textContent = 'PERCURSO: ' + Math.min(100, Math.floor(S.x / world.goal.x * 100)) + '%';
    }
    /* ---------- desenho ---------- */
    function hills(color, par, amp, base, freq) { ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(0, H); for (let x = 0; x <= W; x += 20) ctx.lineTo(x, base - Math.sin((x + S.cam * par) * freq) * amp - Math.cos((x + S.cam * par) * freq * 2.3) * amp * .4); ctx.lineTo(W, H); ctx.fill() }
    function drawBg() {
        const sky = ctx.createLinearGradient(0, 0, 0, GY); sky.addColorStop(0, theme.skyTop); sky.addColorStop(1, theme.skyBot); ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
        if (theme.deco === 'cloud') { ctx.fillStyle = 'rgba(255,255,255,.85)'; for (let i = 0; i < 7; i++) { const x = ((i * 190 - S.cam * .2 - S.t * .15) % 1330 + 1330) % 1330 - 200, y = 30 + (i * 47) % 110; ctx.beginPath(); ctx.moveTo(x + 46, y); ctx.ellipse(x, y, 46, 17, 0, 0, 7); ctx.moveTo(x + 58, y - 11); ctx.ellipse(x + 28, y - 11, 30, 18, 0, 0, 7); ctx.moveTo(x - 2, y - 6); ctx.ellipse(x - 28, y - 6, 26, 14, 0, 0, 7); ctx.fill() } }
        if (theme.deco === 'stars') { for (let i = 0; i < 46; i++) { const x = ((i * 83 - S.cam * .12) % 980 + 980) % 980 - 40, y = 10 + (i * 61) % 230; ctx.fillStyle = i % 5 === 0 ? '#9ff' : 'rgba(255,255,255,.75)'; if (i % 7 === 0) { ctx.font = 'bold 14px monospace'; ctx.fillText(i % 2 ? '1' : '0', x, y) } else ctx.fillRect(x, y, 2 + i % 3, 2 + i % 3) } }
        hills(theme.far, .25, 26, 235, .006);
        if (theme.deco === 'city') { for (let i = 0; i < 12; i++) { const x = ((i * 120 - S.cam * .35) % 1440 + 1440) % 1440 - 120, h = 70 + (i * 37) % 90; ctx.fillStyle = theme.near; ctx.fillRect(x, GY - h, 66, h); ctx.fillStyle = '#ffe9a8'; for (let y = GY - h + 10; y < GY - 14; y += 18) { ctx.fillRect(x + 10, y, 8, 8); ctx.fillRect(x + 32, y, 8, 8) } } }
        if (theme.deco === 'servers') { for (let i = 0; i < 9; i++) { const x = ((i * 150 - S.cam * .35) % 1350 + 1350) % 1350 - 100; ctx.fillStyle = theme.near; ctx.fillRect(x, GY - 130 - (i % 3) * 20, 62, 160); for (let y = GY - 118 - (i % 3) * 20, k = 0; y < GY - 8; y += 18, k++) { ctx.fillStyle = (Math.floor(S.t / 20) + k + i) % 3 ? '#55e08a' : '#ff6b6b'; ctx.fillRect(x + 8, y, 6, 6); ctx.fillStyle = '#2b1020'; ctx.fillRect(x + 22, y, 30, 6) } } }
        hills(theme.near, .5, 18, 270, .009);
    }
    function drawPlat(pl) {
        const x = pl.x - S.cam; if (x > W + 20 || x + pl.w < -20) return;
        if (pl.ground) { ctx.fillStyle = theme.dirt; ctx.fillRect(x, pl.y, pl.w, H - pl.y); ctx.fillStyle = theme.ground; ctx.fillRect(x, pl.y, pl.w, 22); ctx.fillStyle = theme.top; ctx.fillRect(x, pl.y, pl.w, 8); ctx.fillStyle = 'rgba(255,255,255,.12)'; for (let k = 20; k < pl.w - 10; k += 46) ctx.fillRect(x + k, pl.y + 34, 14, 5) }
        else { ctx.fillStyle = theme.edge; ctx.beginPath(); ctx.roundRect(x, pl.y, pl.w, 20, 9); ctx.fill(); ctx.fillStyle = theme.plat; ctx.beginPath(); ctx.roundRect(x, pl.y, pl.w, 14, 9); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.fillRect(x + 10, pl.y + 3, pl.w - 20, 3) }
    }
    function drawCoin(c) { const x = c.x - S.cam; if (c.got || x < -20 || x > W + 20) return; const sc = Math.abs(Math.cos(S.t / 14 + c.id)) * .8 + .2; ctx.fillStyle = '#ffb703'; ctx.beginPath(); ctx.ellipse(x, c.y, 11 * sc, 11, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#ffe066'; ctx.beginPath(); ctx.ellipse(x, c.y, 8 * sc, 8, 0, 0, 7); ctx.fill() }
    function drawBot(b) {
        const x = b.x - S.cam, got = S.bots.has(b.idx); if (x < -40 || x > W + 40) return; const y = b.y + Math.sin(S.t / 12 + b.idx) * 3;
        ctx.save(); ctx.translate(x, y); if (got) ctx.globalAlpha = .35;
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, -17); ctx.lineTo(0, -24); ctx.stroke(); ctx.fillStyle = '#ff5fa2'; ctx.beginPath(); ctx.arc(0, -26, 3.5, 0, 7); ctx.fill();
        ctx.fillStyle = '#f4fbff'; ctx.beginPath(); ctx.roundRect(-13, -17, 26, 24, 9); ctx.fill(); ctx.fillStyle = '#12306e'; ctx.beginPath(); ctx.roundRect(-9, -13, 18, 12, 6); ctx.fill();
        ctx.fillStyle = '#5ce4ef'; ctx.fillRect(-5, -9, 3, 4); ctx.fillRect(2, -9, 3, 4);
        ctx.fillStyle = '#2a6cf0'; ctx.beginPath(); ctx.roundRect(-9, 7, 18, 8, 4); ctx.fill();
        const w = Math.sin(S.t / 6) * 5; ctx.strokeStyle = '#f4fbff'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(13, -5); ctx.lineTo(21, -12 + w); ctx.stroke();
        if (!got) { ctx.font = 'bold 12px Arial'; ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.fillText('SOS', 0, -34) }
        ctx.restore();
    }
    function drawEnemy(e) {
        const x = e.x - S.cam; if (!e.alive || x < -50 || x > W + 50) return; const cx = x + e.w / 2, cy = e.y + e.h / 2;
        ctx.fillStyle = '#7b2fd0'; for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2 + S.t / 40; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a - .15) * 16, cy + Math.sin(a - .15) * 16); ctx.lineTo(cx + Math.cos(a) * 24, cy + Math.sin(a) * 24); ctx.lineTo(cx + Math.cos(a + .15) * 16, cy + Math.sin(a + .15) * 16); ctx.fill() }
        ctx.fillStyle = '#9b5cf0'; ctx.beginPath(); ctx.arc(cx, cy, 17, 0, 7); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(cx - 6, cy - 3, 5, 0, 7); ctx.arc(cx + 6, cy - 3, 5, 0, 7); ctx.fill();
        ctx.fillStyle = '#1a1038'; ctx.beginPath(); ctx.arc(cx - 5 + Math.sign(e.vx) * 1.5, cy - 3, 2.4, 0, 7); ctx.arc(cx + 7 + Math.sign(e.vx) * 1.5, cy - 3, 2.4, 0, 7); ctx.fill();
        ctx.strokeStyle = '#1a1038'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(cx - 11, cy - 10); ctx.lineTo(cx - 2, cy - 7); ctx.moveTo(cx + 11, cy - 10); ctx.lineTo(cx + 2, cy - 7); ctx.stroke();
    }
    function drawSpike(sp) {
        const x = sp.x - S.cam; if (x < -100 || x > W + 100) return; const n = Math.max(2, Math.round(sp.w / 22)), w = sp.w / n;
        for (let i = 0; i < n; i++) { ctx.fillStyle = '#ff4d6d'; ctx.beginPath(); ctx.moveTo(x + i * w, sp.y + sp.h); ctx.lineTo(x + i * w + w / 2, sp.y); ctx.lineTo(x + (i + 1) * w, sp.y + sp.h); ctx.fill(); ctx.fillStyle = '#ffd1da'; ctx.beginPath(); ctx.moveTo(x + i * w + w * .4, sp.y + sp.h); ctx.lineTo(x + i * w + w / 2, sp.y + 5); ctx.lineTo(x + i * w + w * .55, sp.y + sp.h); ctx.fill() }
        ctx.font = 'bold 13px Arial'; ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.fillText('⚠️ POP-UP', x + sp.w / 2, sp.y - 6);
    }
    function drawCheckpoint() { const x = world.cp.x - S.cam; if (x < -40 || x > W + 40) return; ctx.fillStyle = '#e8e8f4'; ctx.fillRect(x, GY - 70, 4, 70); ctx.fillStyle = S.cpOn ? '#33d17a' : '#9aa0b8'; ctx.beginPath(); ctx.moveTo(x + 4, GY - 70); ctx.lineTo(x + 38, GY - 58 + Math.sin(S.t / 10) * 2); ctx.lineTo(x + 4, GY - 44); ctx.fill() }
    function drawGoal() {
        const x = world.goal.x - S.cam; if (x < -120 || x > W + 120) return; const cy = GY - 60, r = 52 + Math.sin(S.t / 12) * 3;
        const gr = ctx.createRadialGradient(x, cy, 6, x, cy, r + 26); gr.addColorStop(0, 'rgba(255,255,255,.95)'); gr.addColorStop(.5, 'rgba(92,228,239,.55)'); gr.addColorStop(1, 'rgba(92,228,239,0)'); ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(x, cy, r + 26, 0, 7); ctx.fill();
        ctx.strokeStyle = '#ffd84a'; ctx.lineWidth = 8; ctx.beginPath(); ctx.ellipse(x, cy, 34, r, 0, 0, 7); ctx.stroke(); ctx.strokeStyle = '#5ce4ef'; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(x, cy, 24, r - 12, 0, 0, 7); ctx.stroke();
        ctx.font = 'bold 14px Arial'; ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.fillText('🏁 META', x, GY - 125);
    }
    function drawPlayer() {
        if (S.inv > 0 && Math.floor(S.inv / 5) % 2 === 0) return;
        const cx = S.x + PW / 2 - S.cam, st = S.onGround ? 1 : 1 + Math.min(.1, Math.abs(S.vy) * .008), h = 54 * st, w = 37 / st;
        if (S.onGround) { ctx.fillStyle = 'rgba(0,0,0,.22)'; ctx.beginPath(); ctx.ellipse(cx, S.y + PH + 3, 16, 4, 0, 0, 7); ctx.fill() }
        ctx.save(); ctx.translate(cx, S.y + PH + 4); ctx.scale(S.face, 1);
        if (sprite.complete && sprite.naturalWidth) ctx.drawImage(sprite, -w / 2, -h, w, h);
        else { ctx.fillStyle = '#2a6cf0'; ctx.beginPath(); ctx.roundRect(-14, -50, 28, 50, 10); ctx.fill() }
        ctx.restore();
    }
    function draw() {
        drawBg(); world.plats.forEach(drawPlat); drawCheckpoint(); world.spikes.forEach(drawSpike); world.coins.forEach(drawCoin); world.bots.forEach(drawBot); world.enemies.forEach(drawEnemy); drawGoal(); drawPlayer();
        S.parts.forEach(p => { ctx.globalAlpha = Math.max(0, p.life / 30); ctx.fillStyle = p.c; ctx.fillRect(p.x - S.cam, p.y, p.s, p.s) }); ctx.globalAlpha = 1;
    }
    /* ---------- ciclo de jogo ---------- */
    function loop(ts) {
        if (g !== S || S.over || S.paused || !S.started) return;
        if (!S.last) S.last = ts; const dt = Math.min((ts - S.last) / 16.67, 2); S.last = ts;
        update(dt); if (g !== S || S.over) return; draw(); hud(); S.raf = requestAnimationFrame(loop);
    }
    function endRun(won) {
        S.over = true; cancelAnimationFrame(S.raf);['runnerLeft', 'runnerRight', 'runnerJump', 'runnerPause'].forEach(i => $(i).disabled = true); S.left = S.right = false; draw(); hud();
        if (won) {
            tone(880, .12); setTimeout(() => tone(1175, .2), 130);
            p.coinBest = p.coinBest || {}; p.coinBest[lvl] = Math.max(p.coinBest[lvl] || 0, S.coins); p.botSet = p.botSet || {}; S.bots.forEach(i => { p.botSet[lvl + '-' + i] = true }); if (S.hits === 0) p.noHit = (p.noHit || 0) + 1;
            const m = `Missão concluída! 🪙 ${S.coins}/${world.total} moedas · 🤖 ${S.bots.size}/3 mini-bots${S.hits === 0 ? ' · 🛡️ Sem perder corações!' : ''}${S.bots.size < 3 ? ' Volta para resgatar todos os bots!' : ' Perfeito!'}`;
            msg('🏆 ' + m); finish(m);
        } else {
            msg('💥 Ficaste sem corações. Não faz mal, tenta outra vez!'); $('runnerMessage').insertAdjacentHTML('beforeend', ' <button id="runnerTry" class="primary">Tentar novamente</button>'); $('runnerTry').onclick = () => gameInternetRun(); $('runnerTry').focus();
        }
    }
    function startRun() { if (S.started) return; S.started = true; $('runnerStart').classList.add('hidden');['runnerLeft', 'runnerRight', 'runnerJump', 'runnerPause'].forEach(i => $(i).disabled = false); msg('Boa sorte! Resgata os bots e chega à meta! 🚀'); S.last = 0; S.raf = requestAnimationFrame(loop) }
    $('runnerPlay').onclick = startRun;
    $('runnerJump').addEventListener('pointerdown', e => { e.preventDefault(); jump() });
    const hold = (id, key) => { const b = $(id), on = v => e => { e.preventDefault(); S[key] = v }; b.addEventListener('pointerdown', on(true));['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => b.addEventListener(ev, on(false))) };
    hold('runnerLeft', 'left'); hold('runnerRight', 'right');
    $('runnerPause').onclick = () => { if (!S.started || S.over) return; S.paused = !S.paused; S.left = S.right = false; $('runnerPause').textContent = S.paused ? '▶ CONTINUAR' : 'Ⅱ PAUSA'; $('runnerPause').blur(); if (!S.paused) { S.last = 0; S.raf = requestAnimationFrame(loop) } else { cancelAnimationFrame(S.raf); msg('Jogo em pausa.') } };
    $('runnerRestart').onclick = () => gameInternetRun();
    window._dzKey = (e, down) => {
        const k = e.key;
        if (['ArrowLeft', 'a', 'A'].includes(k)) { if (S.started) { e.preventDefault(); S.left = down } }
        else if (['ArrowRight', 'd', 'D'].includes(k)) { if (S.started) { e.preventDefault(); S.right = down } }
        else if ([' ', 'ArrowUp', 'w', 'W'].includes(k)) { if (S.started) { e.preventDefault(); if (down && !e.repeat) jump(); if (!down && S.vy < -4) S.vy *= .5 } }
    };
    draw(); hud();
}

/* ===== Dicas e chatbot ===== */
function hint() {
    if (act === 'typing' && g.word) { hintSpell(); return }
    if (act === 'wordsearch' && g.placed) { hintWords(); return }
    const h = {
        keys: 'Lê a função de cada tecla e elimina as opções.', memory: 'Vira duas cartas e memoriza a posição dos símbolos.', pairs: 'Procura a função que combina com cada equipamento.',
        safety: 'Protege os teus dados e pede ajuda a um adulto de confiança.', sequence: 'Observa o padrão e vê o que se repete.', pixelart: 'Escolhe uma cor e pinta os quadradinhos. No modo de modelo, compara com a referência. Podes usar a borracha ou limpar.',
        truefalse: 'Pensa no que aprendeste sobre dispositivos e segurança digital.', maze: 'Experimenta uma direção de cada vez. O caminho que já percorreste fica marcado a amarelo-claro. As setas do teclado também funcionam.',
        workshop: 'Pensa na função de cada peça: o processador “pensa”, a RAM é a memória rápida e o disco guarda tudo. Se arrastar custar, toca na peça e depois na zona.',
        search: 'Lê a pergunta com calma. Nos resultados, desconfia de títulos com «!!!», de anúncios e de sites sem fonte.',
        word: 'Primeiro clica no texto para o selecionar (fica com uma moldura) e só depois carrega no botão da barra.',
        excel: 'A célula é a coluna (letra) + a linha (número). Uma fórmula começa sempre por = e o intervalo escreve-se assim: B2:B5.',
        ppt: 'Poucas palavras, letra grande e bom contraste: esse é o segredo de uma boa apresentação.',
        files: 'A extensão é o que vem depois do ponto: .docx é Word, .xlsx é Excel e .pptx é PowerPoint.',
        network: 'A mensagem sai do teu dispositivo, passa pelo Wi-Fi e pelo router, viaja pela Internet e chega ao servidor.',
        virusrush: 'Salta antes de chegares à borda! Encostado a uma parede, carrega em saltar para dares um salto de parede. Segura o salto para ires mais alto.',
        ergo: 'Pensa no conforto: costas apoiadas, pés no chão, ecrã à altura dos olhos e pausas frequentes (regra 20-20-20).',
        'internet-run': 'Carrega em PLAY para começar. Move com ← → e salta com Espaço — salta outra vez no ar para um duplo salto! Esmaga os vírus caindo em cima deles e foge dos espinhos. Os mini-bots estão em plataformas altas.'
    };
    helper = h[act] || 'Continua a tentar! Cada tentativa ajuda-te a aprender.'; $('helpText').textContent = helper; $('help').classList.remove('hidden'); $('mascot').setAttribute('aria-expanded', 'true'); feedback('💡 ' + helper, false);
}
function chatAsk(raw) {
    const q = String(raw || '').trim(); if (!q) return; const s = q.toLocaleLowerCase('pt-PT');
    let answer = 'Estou aqui para ajudar! Escolhe um jogo, lê as instruções e experimenta. Se precisares, carrega em “Dica do Tiko Teko”.';
    if (s.includes('ficheiro') || s.includes('pasta') || s.includes('extens')) answer = 'Em Ficheiros e Pastas arrastas cada ficheiro para a pasta certa. A extensão vem depois do ponto: .docx (Word), .xlsx (Excel), .pptx (PowerPoint), .jpg e .png (imagens).';
    else if (s.includes('rede') || s.includes('router') || s.includes('wi-fi') || s.includes('wifi')) answer = 'Em Redes segues o caminho de uma mensagem: dispositivo → Wi-Fi → router → Internet → servidor. O router distribui a ligação e o servidor guarda sites e ficheiros.';
    else if (s.includes('vírus') || s.includes('virus') || s.includes('hacker') || s.includes('rush')) answer = 'No Vírus Rush usas as setas ou A/D para andar e Espaço, ↑ ou W para saltar. Encosta-te a uma parede e salta para saltares da parede. Se um vírus ou hacker te apanhar, voltas logo ao início!';
    else if (s.includes('ergonomia') || s.includes('postura') || s.includes('costas')) answer = 'Em Postura Perfeita aprendes a ergonomia: costas apoiadas, pés no chão, ecrã à altura dos olhos, pulsos retos e pausas. Lembra-te da regra 20-20-20 para os olhos!';
    else if (s.includes('visual') || s.includes('moldura') || s.includes('mascote')) answer = 'Em 🏅 Conquistas → 🎨 O meu visual escolhes a mascote e a moldura. Cada medalha «Mestre» dá uma mascote nova e as medalhas de aventura, hábitos, perícia e Danger Zone dão molduras. O visual não muda os teus pontos!';
    else if (s.includes('oficina') || s.includes('peça') || s.includes('peca') || s.includes('hardware') || s.includes('componente')) answer = 'Na Oficina do Tiko arrastas as peças do computador para o sítio certo. Se preferires, toca na peça e depois na zona. Lembra-te: processador = cérebro, RAM = memória rápida, disco = guarda ficheiros.';
    else if (s.includes('pesquis') || s.includes('detetive') || s.includes('navegador')) answer = 'No Detetive da Pesquisa aprendes as partes do navegador, os endereços e como escolher fontes fiáveis. Tudo é simulado, por isso não precisas de Internet. Desconfia de anúncios e de títulos com «!!!».';
    else if (s.includes('word') || s.includes('texto')) answer = 'No Word Explorer clica primeiro no título ou no parágrafo para o selecionar e depois usa os botões: N (negrito), I (itálico), S (sublinhado), alinhamentos, guardar e imagem.';
    else if (s.includes('excel') || s.includes('fórmula') || s.includes('formula') || s.includes('célula') || s.includes('celula')) answer = 'No Excel Detetive, uma célula é coluna + linha (por exemplo B3). As fórmulas começam por = , como =SOMA(B2:B5) ou =MÉDIA(B2:B5).';
    else if (s.includes('powerpoint') || s.includes('diapositivo') || s.includes('apresenta')) answer = 'No PowerPoint Studio escolhes esquemas, ordenas diapositivos e aprendes boas práticas: pouco texto, letra grande e bom contraste. A transição é entre diapositivos; a animação é dentro de um diapositivo.';
    else if (s.includes('danger') || s.includes('runner') || s.includes('plataforma') || s.includes('saltar') || s.includes('bot')) answer = 'Na Danger Zone, carrega em PLAY. Move o Tiko com as setas ← →, salta com Espaço e salta outra vez no ar. Esmaga os vírus por cima, foge dos espinhos, recolhe moedas e resgata 3 mini-bots até ao portal!';
    else if (s.includes('conquista') || s.includes('medalha') || s.includes('título') || s.includes('titulo') || s.includes('missão') || s.includes('missao') || s.includes('ranking') || s.includes('pontos') || s.includes('recorde')) answer = 'Cada nível novo dá 10 pontos e os pontos mudam o teu título. Desbloqueia medalhas e prémios (mascotes e molduras) em 🏅 Conquistas: termina jogos, joga dias seguidos, completa a missão do dia (3 níveis) e resolve níveis sem erros!';
    else if (s.includes('como jogo') || s.includes('começar') || s.includes('jogar')) answer = 'Escolhe um dos 20 jogos. Cada jogo tem 12 níveis. Lê a pergunta, escolhe ou escreve a resposta e recebe feedback. Podes avançar ou voltar entre níveis!';
    else if (s.includes('dica') || s.includes('ajuda')) answer = act ? ('Dica para ' + (A[act]?.[1] || 'este jogo') + ': ' + (desc[act] || 'lê as instruções com calma') + ' Usa o botão “Dica do Tiko Teko” para uma pista específica.') : 'Escolhe primeiro um jogo e depois carrega no botão “Dica do Tiko Teko”. Estou aqui para ajudar!';
    else if (s.includes('acessibilidade') || s.includes('letra') || s.includes('contraste') || s.includes('anima')) answer = 'Abre o menu ♿ Acessibilidade no topo. Podes aumentar ou diminuir o texto, ativar alto contraste, reduzir animações ou escolher uma letra fácil de ler.';
    else if (s.includes('soletra') || s.includes('palavra')) answer = 'No Soletra, lê a pista e carrega em 🔊 para ouvir a palavra. Escreve-a nos quadradinhos. Não precisas de acentos!';
    else if (s.includes('sopa')) answer = 'Na Sopa de Letras, clica na primeira e depois na última letra de cada palavra da lista. Também podes arrastar com o rato. A dica faz uma letra piscar!';
    else if (s.includes('pixel') || s.includes('desenho')) answer = 'No Pixel Art TIC, escolhe uma cor e pinta os quadradinhos. Podes criar livremente ou reproduzir um modelo. Usa a borracha para apagar.';
    else if (s.includes('internet') || s.includes('segurança') || s.includes('palavra-passe')) answer = 'Na Internet, protege os teus dados pessoais, não partilhes palavras-passe e pede ajuda a um adulto de confiança se algo te deixar desconfortável.';
    helper = answer; $('helpText').textContent = answer; $('chatInput').value = ''; $('help').classList.remove('hidden'); $('mascot').setAttribute('aria-expanded', 'true');
}
function speak() { if (!speakText(helper || 'Olá! Eu sou o Tiko Teko. Vamos aprender a jogar!')) feedback('A leitura em voz alta não está disponível neste navegador.') }
document.addEventListener('DOMContentLoaded', init);
