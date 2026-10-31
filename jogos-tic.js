/* TIKO TEKO — jogos novos
   Oficina do Tiko · Detetive da Pesquisa · Word Explorer · Excel Detetive · PowerPoint Studio
   Depende de script.js: $, esc, g, lvl, finish, feedback, quiz. */

const shuffled = a => a.map(x => [Math.random(), x]).sort((x, y) => x[0] - y[0]).map(x => x[1]);

/* ===== Ajudantes partilhados ===== */
// Pergunta de escolha múltipla com as opções misturadas
function quizShuffled(q, opts, ans) {
    const order = shuffled(opts.map((t, i) => [t, i]));
    quiz(q, order.map(x => x[0]), order.findIndex(x => x[1] === ans));
}
// Várias perguntas seguidas; o nível conclui-se à última resposta certa
function mcqSeq(list) {
    const me = g; me.qi = 0;
    const draw = () => {
        const [q, opts, ans] = list[me.qi], order = shuffled(opts.map((t, i) => [t, i])), right = order.findIndex(x => x[1] === ans);
        $('game').innerHTML = `<p class="seq-count">Pergunta ${me.qi + 1} de ${list.length}</p><div class="question">${esc(q)}</div><div class="options">${order.map((x, i) => `<button class="answer" data-i="${i}">${esc(x[0])}</button>`).join('')}</div>`;
        $('game').querySelectorAll('[data-i]').forEach(b => b.onclick = () => {
            if (me.finished || g !== me) return;
            if (+b.dataset.i === right) {
                b.classList.add('correct'); $('game').querySelectorAll('[data-i]').forEach(x => x.disabled = true);
                if (me.qi === list.length - 1) finish('Correto! Excelente trabalho! ⭐');
                else { feedback('Correto! Vamos à próxima. ✔️'); setTimeout(() => { if (g === me && !me.finished) { me.qi++; draw() } }, 900) }
            } else { b.classList.add('wrong'); b.disabled = true; feedback('Ainda não! Lê com atenção e tenta de novo.', true) }
        });
    };
    draw();
}

/* ===== Arrastar e soltar (rato, toque ou teclado: escolher a peça e depois a zona) ===== */
function dropGame(q, targets, pieces) {
    g.total = pieces.length; g.placed = 0; g.sel = null;
    $('game').innerHTML = `<div class="question">${esc(q)}</div>
    <div class="drop-targets">${targets.map(([k, l]) => `<div class="drop-slot" data-drop="${k}" role="button" tabindex="0" aria-label="Zona: ${esc(l)}"><b>${esc(l)}</b><div class="drop-held"></div></div>`).join('')}</div>
    <p class="drop-tip">Arrasta cada peça para a zona certa — ou toca na peça e depois na zona.</p>
    <div class="drop-tray">${shuffled(pieces).map(([t, k]) => `<button class="chip" data-piece="${k}">${esc(t)}</button>`).join('')}</div>`;
    const root = $('game'), me = g, chips = [...root.querySelectorAll('.chip')], slots = [...root.querySelectorAll('.drop-slot')];
    const place = (chip, slot) => {
        if (me.finished || chip.classList.contains('placed')) return;
        if (chip.dataset.piece === slot.dataset.drop) {
            chip.classList.remove('picked'); chip.classList.add('placed'); chip.disabled = true;
            slot.querySelector('.drop-held').appendChild(chip); slot.classList.add('ok'); me.sel = null; me.placed++;
            if (me.placed === me.total) finish('Tudo no sítio certo! 🛠️');
            else feedback('Boa! ✔️ Faltam ' + (me.total - me.placed) + '.');
        } else {
            slot.classList.add('bad'); chip.classList.add('bad'); setTimeout(() => { slot.classList.remove('bad'); chip.classList.remove('bad') }, 500);
            feedback('Essa peça não pertence aí. Pensa na função!', true);
        }
    };
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            if (chip.classList.contains('placed')) return;
            if (me.suppress) return;
            const on = !chip.classList.contains('picked');
            chips.forEach(c => c.classList.remove('picked')); chip.classList.toggle('picked', on); me.sel = on ? chip : null;
        });
        chip.addEventListener('pointerdown', e => {
            if (chip.classList.contains('placed') || (e.pointerType === 'mouse' && e.button !== 0)) return;
            const sx = e.clientX, sy = e.clientY; let ghost = null, over = null;
            const move = ev => {
                if (!ghost && Math.hypot(ev.clientX - sx, ev.clientY - sy) > 8) {
                    ghost = chip.cloneNode(true); ghost.className = 'chip ghost'; ghost.style.width = chip.offsetWidth + 'px';
                    document.body.appendChild(ghost); chip.classList.add('dragging');
                }
                if (ghost) {
                    ghost.style.left = ev.clientX + 'px'; ghost.style.top = ev.clientY + 'px';
                    const el = document.elementFromPoint(ev.clientX, ev.clientY), s = el && el.closest('[data-drop]');
                    if (s !== over) { if (over) over.classList.remove('over'); over = s; if (over) over.classList.add('over') }
                }
            };
            const up = ev => {
                document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', up); document.removeEventListener('pointercancel', up);
                if (!ghost) return;
                ghost.remove(); chip.classList.remove('dragging'); if (over) over.classList.remove('over');
                me.suppress = true; setTimeout(() => { me.suppress = false }, 80);
                const el = document.elementFromPoint(ev.clientX, ev.clientY), s = el && el.closest('[data-drop]');
                if (s && ev.type === 'pointerup') place(chip, s);
            };
            document.addEventListener('pointermove', move); document.addEventListener('pointerup', up); document.addEventListener('pointercancel', up);
        });
    });
    slots.forEach(s => {
        s.onclick = e => { if (e.target.closest('.chip')) return; if (me.sel) place(me.sel, s) };
        s.onkeydown = e => { if ((e.key === 'Enter' || e.key === ' ') && me.sel) { e.preventDefault(); place(me.sel, s) } };
    });
}
const dropPairs = pairs => [pairs.map((x, i) => ['k' + i, x[1]]), pairs.map((x, i) => [x[0], 'k' + i])];
const dropSort = (bins, items) => [bins.map((b, i) => ['b' + i, b]), items.map(([t, b]) => [t, 'b' + b])];

/* ===== Slides e janelas simuladas ===== */
function slideMock(s) {
    const lines = (s.lines || []).map(l => { const [t, c, f] = Array.isArray(l) ? l : [l]; return `<span style="font-size:${s.fs || 12}px;${c ? 'color:' + c + ';' : ''}${f ? 'font-family:' + f + ';' : ''}">${esc(t)}</span>` }).join('');
    return `<span class="slide-mock" style="background:${s.bg || '#fff'};color:${s.fg || '#1f2a44'}"><b style="font-size:${s.tfs || 18}px">${esc(s.title || '')}</b>${lines}${s.img ? '<i class="sm-img">🖼️</i>' : ''}</span>`;
}

/* =====================================================================
   OFICINA DO TIKO — componentes do computador
   ===================================================================== */
const WORKSHOP = [
    { t: 'pairs', q: 'Monta o computador: liga cada peça à sua função.', p: [['🧠 Processador', 'O cérebro do computador'], ['🧩 Memória RAM', 'Memória rápida, só enquanto está ligado'], ['💾 Disco', 'Guarda os ficheiros para sempre']] },
    { t: 'pairs', q: 'Falta uma peça! Monta o computador.', p: [['🧠 Processador', 'O cérebro do computador'], ['🧩 Memória RAM', 'Memória rápida, só enquanto está ligado'], ['💾 Disco', 'Guarda os ficheiros para sempre'], ['🟩 Placa-mãe', 'A placa onde todas as peças se ligam']] },
    { t: 'pairs', q: 'Computador completo: não te esqueças da energia!', p: [['🧠 Processador', 'O cérebro do computador'], ['🧩 Memória RAM', 'Memória rápida, só enquanto está ligado'], ['💾 Disco', 'Guarda os ficheiros para sempre'], ['🟩 Placa-mãe', 'A placa onde todas as peças se ligam'], ['🔌 Fonte de alimentação', 'Dá energia a todo o computador']] },
    { t: 'pairs', q: 'Que equipamento faz cada trabalho?', p: [['⌨️ Teclado', 'Escrever letras e números'], ['🖱️ Rato', 'Mover o ponteiro'], ['🖥️ Monitor', 'Mostrar imagens'], ['🔊 Colunas', 'Reproduzir som'], ['🖨️ Impressora', 'Passar para o papel']] },
    { t: 'pairs', q: 'Mais peças, mais funções! Liga cada uma.', p: [['🎮 Placa gráfica', 'Cria as imagens do ecrã'], ['📡 Placa de rede', 'Liga o computador à rede'], ['🌀 Ventoinha', 'Arrefece o processador'], ['📷 Webcam', 'Capta vídeo'], ['🎤 Microfone', 'Capta a voz']] },
    { t: 'sort', q: 'Separa os equipamentos: entrada, saída ou armazenamento?', bins: ['⬇️ Entrada', '⬆️ Saída', '💽 Armazenamento'], items: [['⌨️ Teclado', 0], ['🖱️ Rato', 0], ['🖥️ Monitor', 1], ['🔊 Colunas', 1], ['🔌 Pen USB', 2], ['💽 Disco externo', 2]] },
    { t: 'sort', q: 'Mais um desafio: entrada, saída ou armazenamento?', bins: ['⬇️ Entrada', '⬆️ Saída', '💽 Armazenamento'], items: [['🎤 Microfone', 0], ['🖼️ Scanner', 0], ['🕹️ Joystick', 0], ['🖨️ Impressora', 1], ['🎧 Auscultadores', 1], ['📽️ Projetor', 1], ['💳 Cartão SD', 2], ['💿 CD/DVD', 2], ['⚡ Disco SSD', 2]] },
    { t: 'pairs', q: 'Ordena as unidades de memória, da mais pequena para a maior.', p: [['KB', '1.º — a mais pequena'], ['MB', '2.º'], ['GB', '3.º'], ['TB', '4.º — a maior']] },
    { t: 'seq', qs: [['Mais ou menos quantos MB tem 1 GB?', ['10 MB', '100 MB', '1000 MB', '10 000 MB'], 2], ['Qual destes guarda mais ficheiros?', ['Pen de 8 GB', 'Disco de 1 TB', 'Cartão de 512 MB', 'CD de 700 MB'], 1]] },
    { t: 'seq', qs: [['O computador não liga e não tem nenhuma luz. O que deves verificar primeiro?', ['O cabo e a fonte de alimentação', 'O teclado', 'As colunas', 'A impressora'], 0], ['O computador está muito lento quando abres vários programas. Que peça ajuda?', ['Mais memória RAM', 'Mais colunas', 'Uma impressora nova', 'Um rato melhor'], 0]] },
    { t: 'seq', qs: [['O computador aquece muito e desliga sozinho. O que verificar?', ['A ventoinha e o arrefecimento', 'A webcam', 'O rato', 'O microfone'], 0], ['Não há som, mas as imagens aparecem bem. O que verificar?', ['As colunas e o volume', 'A fonte de alimentação', 'O disco', 'O processador'], 0], ['O monitor está ligado mas sem imagem. O que verificar?', ['O cabo do monitor', 'As colunas', 'O rato', 'A impressora'], 0]] },
    { t: 'pairs', q: 'Avarias! Que peça resolve cada problema?', p: [['🔌 Fonte de alimentação', 'Não liga e não tem luzes'], ['🧩 Memória RAM', 'Fica muito lento com vários programas'], ['🌀 Ventoinha', 'Aquece e desliga sozinho'], ['🔊 Colunas', 'Não se ouve nenhum som']] }
];
function gameWorkshop() {
    const d = WORKSHOP[lvl - 1];
    if (d.t === 'seq') return mcqSeq(d.qs);
    if (d.t === 'pairs') { const [t, p] = dropPairs(d.p); return dropGame(d.q, t, p) }
    const [t, p] = dropSort(d.bins, d.items); dropGame(d.q, t, p);
}

/* =====================================================================
   DETETIVE DA PESQUISA — navegadores e pesquisa segura (tudo simulado)
   ===================================================================== */
const ZONE_NAMES = { address: 'a barra de endereço', back: 'o botão «voltar atrás»', reload: 'o botão «recarregar»', star: 'a estrela dos favoritos', history: 'o botão do histórico', newtab: 'o botão de novo separador', tab: 'o separador da página aberta', page: 'o conteúdo da página' };
function mockBrowser({ url = 'https://www.escola.pt/jogos', tab = 'Escola Digital', body = '', live = true }) {
    const z = n => live ? `data-zone="${n}"` : 'disabled aria-hidden="true" tabindex="-1"';
    return `<div class="mock-win browser"><div class="mw-tabs"><button class="mw-tab active" ${z('tab')}>🌐 ${esc(tab)}</button><button class="mw-plus" ${z('newtab')} aria-label="Novo separador">＋</button></div>
    <div class="mw-bar"><button ${z('back')} aria-label="Voltar atrás">←</button><button ${z('reload')} aria-label="Recarregar página">⟳</button><div class="mw-address" ${live ? 'data-zone="address" role="button" tabindex="0"' : ''} aria-label="Barra de endereço">🔒 ${esc(url)}</div><button ${z('star')} aria-label="Favoritos">☆</button><button ${z('history')} aria-label="Histórico">🕘</button></div>
    <div class="mw-page" ${live ? 'data-zone="page"' : ''}>${body}</div></div>`;
}
const SEARCH = [
    { t: 'zone', q: 'Clica na barra onde se escreve o endereço de um site.', z: 'address' },
    { t: 'zone', q: 'Queres voltar à página que viste antes. Clica no botão certo.', z: 'back' },
    { t: 'zone', q: 'Queres abrir outra página sem fechar esta. Clica no botão de novo separador.', z: 'newtab' },
    { t: 'zone', q: 'Queres guardar esta página para a encontrares depressa. Clica na estrela dos favoritos.', z: 'star' },
    { t: 'zone', q: 'Visitaste um site ontem e já não te lembras do nome. Clica no botão do histórico.', z: 'history' },
    { t: 'url', q: 'Clica no domínio: o nome do site.', parts: [['https://', 'o protocolo (liga-te ao site)'], ['www.escola.pt', 'o domínio (o nome do site)'], ['/jogos', 'o caminho (a página dentro do site)'], ['?nivel=2', 'informação extra para o site']], a: 1 },
    { t: 'url', q: 'Que parte do endereço mostra que a ligação é segura?', parts: [['https://', 'o protocolo seguro'], ['www.banco.pt', 'o domínio (o nome do site)'], ['/conta', 'o caminho (a página dentro do site)']], a: 0 },
    { t: 'seq', qs: [['Queres saber quantos ossos tem o corpo humano. Qual é a melhor pesquisa?', ['quantos ossos tem o corpo humano', 'ajuda ossos por favor!!!', 'corpo', 'o meu trabalho de ciências está difícil e não sei o que fazer'], 0], ['Qual destas pesquisas é mais específica?', ['animais', 'coisas', 'animais que vivem no mar profundo', 'pesquisa'], 2]] },
    { t: 'seq', qs: [['Queres só resultados com a frase exata «jogos educativos grátis». Como a escreves?', ['"jogos educativos grátis" (entre aspas)', 'jogos / educativos / grátis ???', '(jogos educativos grátis)', 'JOGOS!!! EDUCATIVOS!!!'], 0], ['Pesquisaste «rato» e aparecem animais. Queres o do computador. O que acrescentas?', ['a palavra computador', 'a palavra bonito', 'a palavra muito', 'três pontos de exclamação'], 0]] },
    {
        t: 'serp', q: 'Qual destes resultados é um anúncio?', query: 'jogos educativos grátis', good: 'Encontraste! O anúncio tem a etiqueta «Anúncio» e quer que descarregues ou compres algo.', r: [
            { ad: true, ok: true, url: 'www.jogos-turbo.com', title: 'JOGOS TURBO — Joga já, é grátis!', snip: 'Descarrega o novo pacote de jogos. Oferta só hoje!' },
            { url: 'www.escola-digital.pt/jogos', title: 'Jogos educativos para o 5.º ano', snip: 'Atividades de matemática, português e TIC organizadas por nível.', why: 'Este resultado não tem a etiqueta «Anúncio».' },
            { url: 'www.biblioteca-escolar.pt/atividades', title: 'Atividades e jogos da biblioteca', snip: 'Propostas para fazer na escola ou em casa.', why: 'Este resultado não tem a etiqueta «Anúncio».' },
            { url: 'www.museu-da-ciencia.pt/criancas', title: 'Museu da Ciência: jogos para crianças', snip: 'Experiências e jogos online sobre ciência.', why: 'Este resultado não tem a etiqueta «Anúncio».' }]
    },
    {
        t: 'serp', q: 'Precisas de uma resposta para o trabalho. Qual é a fonte mais fiável?', query: 'quantos planetas tem o sistema solar', good: 'Boa escolha! Uma agência oficial tem especialistas, dados atualizados e fontes.', r: [
            { ok: true, url: 'www.agencia-espacial.pt/sistema-solar', title: 'Sistema Solar: os 8 planetas', snip: 'Dados oficiais, revistos por especialistas e atualizados.' },
            { url: 'www.forum-curiosos.com/topico/8721', title: 'Acho que são 9?? Alguém confirma?', snip: 'Respostas dos utilizadores do fórum.', why: 'Num fórum qualquer pessoa pode escrever. Não há especialistas nem fontes.' },
            { url: 'www.planetas-secretos.blog', title: 'OS 12 PLANETAS QUE ESCONDEM DE TI!!!', snip: 'Descobre o segredo que ninguém te conta!', why: 'Título exagerado, cheio de «!!!» — típico de sites pouco fiáveis.' },
            { url: 'www.videos-malucos.net/10-factos', title: '10 factos que NÃO vais acreditar', snip: 'Clica para ver o que acontece a seguir…', why: 'Quer só cliques: não explica nem indica fontes.' }]
    },
    {
        t: 'serp', q: 'Atenção, detetive! Qual é a notícia provavelmente FALSA?', query: 'notícias da escola', good: 'Muito bem! As notícias falsas gritam «URGENTE», pedem para partilhares e não têm fonte.', r: [
            { ok: true, url: 'www.partilha-ja.net/urgente', title: 'URGENTE!!! Escolas fecham amanhã e ninguém te avisou! Partilha com 10 amigos!', snip: 'Não pesquises mais. Partilha já ou vais perder tudo!!!' },
            { url: 'www.jornal-da-regiao.pt/educacao', title: 'Escola organiza feira do livro na próxima semana', snip: 'Notícia assinada pelo jornalista, com data e declarações da direção.', why: 'Tem autor, data e fonte, e o tom é calmo.' },
            { url: 'www.agrupamento-escolas.pt/avisos', title: 'Aviso: reunião de pais marcada para quinta-feira', snip: 'Comunicado oficial da direção do agrupamento.', why: 'É um comunicado oficial, publicado no site da escola.' },
            { url: 'www.radio-local.pt/noticias', title: 'Obras na escola terminam no fim do período', snip: 'Reportagem com entrevistas à direção e à associação de pais.', why: 'Tem entrevistas e fontes identificadas.' }]
    }
];
function gameSearch() {
    const d = SEARCH[lvl - 1], root = $('game');
    if (d.t === 'seq') return mcqSeq(d.qs);
    if (d.t === 'zone') {
        root.innerHTML = `<div class="question">${esc(d.q)}</div>` + mockBrowser({ body: '<h3>Escola Digital</h3><p>Bem-vindo ao site da escola! Aqui encontras jogos, notícias e atividades.</p><p class="mw-links"><span>🎮 Jogos</span><span>📰 Notícias</span><span>📚 Biblioteca</span></p>' });
        root.querySelectorAll('[data-zone]').forEach(el => {
            const go = () => {
                if (g.finished) return; const z = el.dataset.zone;
                if (z === d.z) { el.classList.add('hit'); finish('Boa! Encontraste ' + ZONE_NAMES[z] + '. 🕵️') }
                else { el.classList.add('miss'); setTimeout(() => el.classList.remove('miss'), 500); feedback('Isso é ' + ZONE_NAMES[z] + '. Procura outra vez!', true) }
            };
            el.addEventListener('click', e => { e.stopPropagation(); go() });
            el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); go() } });
        });
        return;
    }
    if (d.t === 'url') {
        root.innerHTML = `<div class="question">${esc(d.q)}</div><div class="url-parts" role="group" aria-label="Partes do endereço">${d.parts.map((x, i) => `<button class="url-part" data-i="${i}">${esc(x[0])}</button>`).join('')}</div><p class="drop-tip">Um endereço (URL) tem várias partes. Clica na parte certa.</p>`;
        root.querySelectorAll('.url-part').forEach(b => b.onclick = () => {
            if (g.finished) return; const i = +b.dataset.i;
            if (i === d.a) { b.classList.add('ok'); finish('Correto! Essa parte é ' + d.parts[i][1] + '. 🔎') }
            else { b.classList.add('bad'); setTimeout(() => b.classList.remove('bad'), 500); feedback('Essa parte é ' + d.parts[i][1] + '. Tenta outra!', true) }
        });
        return;
    }
    const items = shuffled(d.r);
    root.innerHTML = `<div class="question">${esc(d.q)}</div>` + mockBrowser({ url: 'https://www.pesquisa.pt/resultados', tab: 'Pesquisa', live: false, body: `<div class="serp-box">🔎 <span>${esc(d.query)}</span></div>${items.map((r, i) => `<button class="serp-item" data-i="${i}">${r.ad ? '<span class="serp-ad">Anúncio</span>' : ''}<span class="serp-url">${esc(r.url)}</span><b class="serp-title">${esc(r.title)}</b><span class="serp-snip">${esc(r.snip)}</span></button>`).join('')}` });
    root.querySelectorAll('.serp-item').forEach(b => b.onclick = () => {
        if (g.finished) return; const r = items[+b.dataset.i];
        if (r.ok) { b.classList.add('ok'); finish(d.good) } else { b.classList.add('bad'); b.disabled = true; feedback(r.why + ' Procura melhor.', true) }
    });
}

/* =====================================================================
   WORD EXPLORER — mini-simulador de processador de texto
   ===================================================================== */
const W_SIZES = [14, 18, 22, 28, 36];
const WORD_TASKS = [
    ['Seleciona o título (clica nele) e põe-no em negrito com o botão N.', d => d.title.b],
    ['Centra o título: seleciona-o e usa o botão «Centrar».', d => d.title.al === 'center'],
    ['Seleciona o parágrafo e põe-no em itálico com o botão I.', d => d.para.i],
    ['Aumenta o tamanho da letra do título com o botão A+.', d => d.title.sz > 2],
    ['Guarda o documento com o botão 💾 Guardar.', d => d.saved],
    ['Insere uma imagem no documento com o botão 🖼️ Imagem.', d => d.img],
    ['Formata o título: negrito, centrado e com a letra maior.', d => d.title.b && d.title.al === 'center' && d.title.sz > 2],
    ['Sublinha o título (S) e justifica o parágrafo («Justificar»).', d => d.title.u && d.para.al === 'justify']
];
const WORD_FIX = [
    [{ w: 'o', r: 'O', alt: ['o.', 'ó'] }, 'Tiko', 'gosta', 'de', { w: 'aprender', r: 'aprender.', alt: ['aprender,', 'aprender!!'] }],
    ['O', 'Tiko', 'usa', 'o', { w: 'computdor', r: 'computador', alt: ['compotador', 'computadro'] }, 'para', 'fazer', { w: 'pesqisas', r: 'pesquisas', alt: ['pesquizas', 'pesqusas'] }, 'na', { w: 'internete.', r: 'internet.', alt: ['internett.', 'internete,'] }],
    [{ w: 'os', r: 'Os', alt: ['ós', 'oS'] }, 'alunos', 'escrevem', { w: 'trabaljos', r: 'trabalhos', alt: ['trabalios', 'trabalhus'] }, 'no', 'Word', 'e', 'guardam', 'o', { w: 'fixeiro', r: 'ficheiro', alt: ['fichero', 'ficheiro,'] }, 'no', { w: 'computador', r: 'computador.', alt: ['computador,', 'computador!!'] }]
];
const wordWin = (inner, name) => `<div class="mock-win word-win"><div class="mw-title"><span>📝 ${esc(name)} — Word</span><span class="mw-dots" aria-hidden="true">— ▢ ✕</span></div>${inner}</div>`;
function gameWord() {
    if (lvl === 9) return mcqSeq([['Qual é o atalho para guardar um documento?', ['Ctrl + S', 'Ctrl + X', 'Ctrl + P', 'Ctrl + N'], 0], ['Qual é o atalho para copiar?', ['Ctrl + C', 'Ctrl + V', 'Ctrl + Z', 'Ctrl + A'], 0], ['Escreveste uma palavra por engano. Que atalho desfaz a última ação?', ['Ctrl + Z', 'Ctrl + S', 'Ctrl + B', 'Ctrl + E'], 0]]);
    if (lvl >= 10) return wordFix(WORD_FIX[lvl - 10]);
    g.doc = { title: { b: 0, i: 0, u: 0, al: 'left', sz: 2 }, para: { b: 0, i: 0, u: 0, al: 'left', sz: 1 }, img: false, saved: false };
    g.sel = null; g.undo = []; renderWord(WORD_TASKS[lvl - 1][0]);
}
function renderWord(task) {
    const d = g.doc, sel = g.sel, T = d.title, P = d.para;
    const rb = (a, label, tip) => `<button class="rb" data-wa="${a}" title="${tip || label}" aria-label="${tip || label}">${label}</button>`;
    const st = x => `font-size:${W_SIZES[x.sz]}px;font-weight:${x.b ? 800 : 400};font-style:${x.i ? 'italic' : 'normal'};text-decoration:${x.u ? 'underline' : 'none'};text-align:${x.al}`;
    const inner = `<div class="wribbon" role="toolbar" aria-label="Separador Base">${rb('b', '<b>N</b>', 'Negrito (Ctrl+B)')}${rb('i', '<i>I</i>', 'Itálico (Ctrl+I)')}${rb('u', '<u>S</u>', 'Sublinhado (Ctrl+U)')}<span class="rsep"></span>${rb('smaller', 'A−', 'Diminuir letra')}${rb('bigger', 'A+', 'Aumentar letra')}<span class="rsep"></span>${rb('left', 'Esquerda')}${rb('center', 'Centrar')}${rb('right', 'Direita')}${rb('justify', 'Justificar')}<span class="rsep"></span>${rb('save', '💾 Guardar', 'Guardar (Ctrl+S)')}${rb('img', '🖼️ Imagem', 'Inserir imagem')}${rb('undo', '↩ Desfazer', 'Desfazer (Ctrl+Z)')}</div>
    <div class="paper"><div class="doc-block ${sel === 'title' ? 'sel' : ''}" data-sel="title" tabindex="0" role="button" aria-label="Título do documento" style="${st(T)}">A Minha Escola Digital</div>
    <div class="doc-block ${sel === 'para' ? 'sel' : ''}" data-sel="para" tabindex="0" role="button" aria-label="Parágrafo" style="${st(P)}">O Tiko Teko adora aprender. Hoje descobri como se escreve, se formata e se guarda um documento no computador.</div>
    ${d.img ? `<div class="doc-block doc-img ${sel === 'img' ? 'sel' : ''}" data-sel="img" tabindex="0" role="button" aria-label="Imagem inserida">🖼️<small>Imagem inserida</small></div>` : ''}</div>
    <div class="statusbar">Página 1 de 1 · ${d.saved ? 'Guardado ✔' : 'Por guardar'}</div>`;
    $('game').innerHTML = `<div class="question">${esc(task)}</div>` + wordWin(inner, d.saved ? 'Escola.docx' : 'Documento1');
    const win = $('game').querySelector('.word-win');
    win.querySelectorAll('[data-wa]').forEach(b => b.onclick = () => wAct(b.dataset.wa));
    win.querySelectorAll('[data-sel]').forEach(b => { const go = () => { if (g.finished) return; g.sel = b.dataset.sel; renderWord(task); const n = $('game').querySelector(`[data-sel="${g.sel}"]`); if (n) n.focus() }; b.onclick = go; b.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go() } } });
    win.onkeydown = e => {
        if (!(e.ctrlKey || e.metaKey)) return;
        const m = { b: 'b', i: 'i', u: 'u', s: 'save', z: 'undo' }[e.key.toLowerCase()];
        if (m) { e.preventDefault(); wAct(m) }
    };
    g.task = task;
}
function wAct(a) {
    if (g.finished) return;
    const snap = () => { g.undo.push(JSON.stringify(g.doc)); if (g.undo.length > 20) g.undo.shift() };
    if (a === 'undo') { if (!g.undo.length) { feedback('Não há nada para desfazer.', false, false); return } g.doc = JSON.parse(g.undo.pop()) }
    else if (a === 'save') { snap(); g.doc.saved = true }
    else if (a === 'img') { if (!g.doc.img) { snap(); g.doc.img = true; g.sel = 'img' } }
    else {
        const t = (g.sel === 'title' || g.sel === 'para') ? g.doc[g.sel] : null;
        if (!t) { feedback('Primeiro seleciona o texto: clica no título ou no parágrafo.', false, false); return }
        snap();
        if (a === 'b' || a === 'i' || a === 'u') t[a] = t[a] ? 0 : 1;
        else if (a === 'bigger') t.sz = Math.min(4, t.sz + 1);
        else if (a === 'smaller') t.sz = Math.max(0, t.sz - 1);
        else t.al = a;
    }
    renderWord(g.task);
    const f = $('game').querySelector(`[data-wa="${a}"]`); if (f) f.focus();
    if (WORD_TASKS[lvl - 1][1](g.doc)) finish('Documento formatado como um profissional! 📝');
}
function wordFix(tokens) {
    const me = g, errors = tokens.filter(t => typeof t !== 'string').length;
    me.fixed = {}; me.open = null;
    const draw = () => {
        const opt = me.open !== null ? tokens[me.open] : null;
        const inner = `<div class="paper fix-paper"><p class="fix-text">${tokens.map((t, i) => {
            const w = typeof t === 'string' ? t : (me.fixed[i] ? t.r : t.w), cls = me.fixed[i] ? 'tok fixed' : (me.open === i ? 'tok open' : 'tok');
            return `<button class="${cls}" data-t="${i}">${esc(w)}</button>`;
        }).join(' ')}</p>${opt ? `<div class="fix-options" role="group" aria-label="Como se escreve corretamente?"><b>Como se escreve corretamente?</b>${shuffled([opt.r, ...opt.alt]).map(o => `<button class="fix-opt" data-o="${esc(o)}">${esc(o)}</button>`).join('')}</div>` : ''}</div>
        <div class="statusbar">Erros por corrigir: ${errors - Object.keys(me.fixed).length}</div>`;
        $('game').innerHTML = `<div class="question">Encontra e corrige os ${errors} erros do texto (letras maiúsculas, ortografia e pontuação).</div>` + wordWin(inner, 'Texto do Tiko');
        $('game').querySelectorAll('[data-t]').forEach(b => b.onclick = () => {
            if (me.finished || g !== me) return; const i = +b.dataset.t, t = tokens[i];
            if (typeof t === 'string' || me.fixed[i]) { feedback('Esta palavra está certa. ✔️', false, false); me.open = null }
            else me.open = i;
            draw(); const n = $('game').querySelector(`[data-t="${i}"]`); if (n) n.focus();
        });
        $('game').querySelectorAll('[data-o]').forEach(b => b.onclick = () => {
            if (me.finished || g !== me) return; const t = tokens[me.open];
            if (b.dataset.o === t.r) {
                me.fixed[me.open] = true; me.open = null; draw();
                if (Object.keys(me.fixed).length === errors) finish('Texto sem erros! Bom trabalho de revisão! 📝'); else feedback('Corrigido! ✔️ Continua a procurar.');
            } else { b.classList.add('bad'); b.disabled = true; feedback('Ainda não. Compara com a palavra original.', true) }
        });
    };
    draw();
}

/* =====================================================================
   EXCEL DETETIVE — folha de cálculo
   ===================================================================== */
const XL_COLS = ['A', 'B', 'C', 'D', 'E'], XL_ROWS = 7;
const XL_DATA = { A1: 'Fruta', B1: 'Quantidade', C1: 'Preço (€)', A2: 'Maçãs', B2: 12, C2: '0,50', A3: 'Peras', B3: 8, C3: '0,60', A4: 'Uvas', B4: 15, C4: '1,20', A5: 'Laranjas', B5: 5, C5: '0,40' };
const XL_FN = { SOMA: 'SUM', SUM: 'SUM', MEDIA: 'AVG', AVERAGE: 'AVG', MAXIMO: 'MAX', MAX: 'MAX', MINIMO: 'MIN', MIN: 'MIN' };
const XL_LEVELS = [
    { t: 'cell', q: 'Clica na célula B3 (coluna B, linha 3).', a: 'B3' },
    { t: 'cell', q: 'Clica na célula D5.', a: 'D5' },
    { t: 'col', q: 'Clica no cabeçalho da coluna C (a letra, no topo).', a: 'C' },
    { t: 'row', q: 'Clica no cabeçalho da linha 4 (o número, à esquerda).', a: 4 },
    { t: 'range', q: 'Seleciona o intervalo A1:B3: clica na primeira célula (A1) e depois na última (B3).', a: 'A1:B3' },
    { t: 'seq', qs: [['Com que símbolo começa sempre uma fórmula?', ['=', '#', '@', '&'], 0], ['O que faz a função SOMA?', ['Soma os valores', 'Calcula a média', 'Apaga células', 'Mostra o maior valor'], 0]] },
    { t: 'seq', qs: [['O que faz =MÉDIA(A1:A4)?', ['Calcula a média dos valores', 'Soma os valores', 'Apaga as células', 'Mostra o maior valor'], 0], ['Que função mostra o valor mais alto de um intervalo?', ['MÁXIMO', 'SOMA', 'MÉDIA', 'MÍNIMO'], 0]] },
    { t: 'formula', q: 'Na célula B6, calcula o total das quantidades (B2 a B5). Escreve a fórmula com SOMA.', fn: 'SUM', rng: 'B2:B5', label: 'Total', ex: '=SOMA(B2:B5)' },
    { t: 'formula', q: 'Na célula B6, calcula a média das quantidades (B2 a B5). Usa a função MÉDIA.', fn: 'AVG', rng: 'B2:B5', label: 'Média', ex: '=MÉDIA(B2:B5)' },
    { t: 'formula', q: 'Na célula B6, mostra a quantidade mais alta (B2 a B5). Usa a função MÁXIMO.', fn: 'MAX', rng: 'B2:B5', label: 'Mais alto', ex: '=MÁXIMO(B2:B5)' },
    { t: 'seq', qs: [['Queres comparar quantas maçãs, peras e uvas há em cada cesto. Que gráfico escolhes?', ['📊 Gráfico de colunas', '📈 Gráfico de linhas', '🥧 Gráfico circular', '🗺️ Mapa'], 0], ['Queres mostrar como a tua altura mudou ao longo de 5 anos. Que gráfico escolhes?', ['📈 Gráfico de linhas', '📊 Gráfico de colunas', '🥧 Gráfico circular', '🗺️ Mapa'], 0], ['Queres mostrar que parte da turma gosta de cada desporto (o todo é 100%). Que gráfico escolhes?', ['🥧 Gráfico circular', '📈 Gráfico de linhas', '📊 Gráfico de colunas', '🗺️ Mapa'], 0]] },
    { t: 'seq', qs: [['Onde fica a célula C4?', ['Coluna C, linha 4', 'Linha C, coluna 4', 'Coluna 4, linha C', 'No canto A1'], 0], ['Qual é a fórmula certa para somar de B2 a B5?', ['=SOMA(B2:B5)', 'SOMA(B2:B5)', '=B2:B5', '=SOMA B2-B5'], 0], ['Quantas células tem o intervalo A1:B3?', ['6', '3', '4', '2'], 0], ['O que acontece se mudares um número usado numa fórmula?', ['O resultado atualiza sozinho', 'Nada, fica igual', 'A folha fecha', 'A fórmula apaga-se'], 0]] }
];
function xlFmt(n) { return Number.isInteger(n) ? String(n) : n.toFixed(2).replace('.', ',') }
function xlCells(range) {
    const m = /^([A-Z]+)(\d+):([A-Z]+)(\d+)$/.exec(range); if (!m) return [];
    const c1 = Math.min(m[1].charCodeAt(0), m[3].charCodeAt(0)), c2 = Math.max(m[1].charCodeAt(0), m[3].charCodeAt(0)), r1 = Math.min(+m[2], +m[4]), r2 = Math.max(+m[2], +m[4]), out = [];
    for (let c = c1; c <= c2; c++)for (let r = r1; r <= r2; r++)out.push(String.fromCharCode(c) + r);
    return out;
}
function xlParse(text) {
    const s = String(text).toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '').replace(/;/g, ',');
    const m = /^=([A-Z]+)\(([A-Z]+\d+):([A-Z]+\d+)\)$/.exec(s);
    if (!m) return { err: 'syntax' };
    if (!XL_FN[m[1]]) return { err: 'fn' };
    const vals = xlCells(m[2] + ':' + m[3]).map(c => XL_DATA[c]).filter(v => typeof v === 'number');
    if (!vals.length) return { err: 'empty', fn: XL_FN[m[1]], rng: m[2] + ':' + m[3] };
    const fn = XL_FN[m[1]], v = fn === 'SUM' ? vals.reduce((a, b) => a + b, 0) : fn === 'AVG' ? vals.reduce((a, b) => a + b, 0) / vals.length : fn === 'MAX' ? Math.max(...vals) : Math.min(...vals);
    return { fn, rng: m[2] + ':' + m[3], v };
}
function gameExcel() {
    const d = XL_LEVELS[lvl - 1];
    if (d.t === 'seq') return mcqSeq(d.qs);
    g.cells = []; g.col = null; g.row = null; g.anchor = null; g.name = '';
    const showRes = d.t === 'formula';
    let head = `<tr><th class="xl-corner"></th>${XL_COLS.map(c => `<th><button class="xl-ch" data-col="${c}" aria-label="Coluna ${c}">${c}</button></th>`).join('')}</tr>`, body = '';
    for (let r = 1; r <= XL_ROWS; r++) {
        body += `<tr><th><button class="xl-rh" data-row="${r}" aria-label="Linha ${r}">${r}</button></th>${XL_COLS.map(c => { const id = c + r; let v = XL_DATA[id]; if (showRes && id === 'A6') v = d.label; return `<td><button class="xl-c ${showRes && id === 'B6' ? 'target' : ''}" data-cell="${id}" aria-label="Célula ${id}">${v === undefined ? '' : esc(v)}</button></td>` }).join('')}</tr>`;
    }
    $('game').innerHTML = `<div class="question">${esc(d.q)}</div><div class="mock-win excel-win"><div class="mw-title"><span>📊 Folha de cálculo — Excel</span><span class="mw-dots" aria-hidden="true">— ▢ ✕</span></div>
    <div class="xl-formula"><span class="xl-name" id="xlName" aria-label="Caixa de nomes">&nbsp;</span><span class="xl-fxlabel">fx</span>${showRes ? `<input id="xlFx" value="=" autocomplete="off" spellcheck="false" aria-label="Fórmula para a célula B6"><button class="primary" id="xlEnter">Enter ↵</button>` : '<span class="xl-fxhint">Seleciona uma célula para ver o nome dela na caixa à esquerda.</span>'}</div>
    <div class="xl-wrap"><table class="xl-table"><thead>${head}</thead><tbody>${body}</tbody></table></div></div>`;
    const root = $('game'), me = g;
    const paint = () => {
        root.querySelectorAll('.xl-c').forEach(b => b.classList.toggle('sel', me.cells.includes(b.dataset.cell) || b.dataset.cell === me.anchor));
        root.querySelectorAll('.xl-ch').forEach(b => b.classList.toggle('sel', b.dataset.col === me.col));
        root.querySelectorAll('.xl-rh').forEach(b => b.classList.toggle('sel', +b.dataset.row === me.row));
        $('xlName').innerHTML = me.name || '&nbsp;';
    };
    root.querySelectorAll('.xl-c').forEach(b => b.onclick = () => {
        if (me.finished) return; const id = b.dataset.cell;
        if (d.t === 'range') {
            if (!me.anchor) { me.anchor = id; me.cells = [id]; me.name = id; paint(); feedback('Primeira célula: ' + id + '. Agora clica na última.'); return }
            const r = id === me.anchor ? id : me.anchor + ':' + id, cells = xlCells(me.anchor + ':' + id); me.cells = cells; me.name = r; paint();
            const norm = xlCells(d.a).join() === cells.join();
            if (norm) { finish('Intervalo A1:B3 selecionado! 📊') } else { feedback('Isso selecionou ' + r + '. Procura a célula A1 e a B3.', true); me.anchor = null }
            return;
        }
        me.cells = [id]; me.col = null; me.row = null; me.name = id; paint();
        if (d.t === 'cell') { if (id === d.a) finish('Encontraste a célula ' + id + '! 🔎'); else feedback('Essa é a célula ' + id + '. A que procuras está na coluna ' + d.a[0] + ', linha ' + d.a.slice(1) + '.', true) }
        else if (d.t === 'col') feedback('Clica na letra da coluna, no topo da folha.', false, false)
        else if (d.t === 'row') feedback('Clica no número da linha, à esquerda da folha.', false, false)
    });
    root.querySelectorAll('.xl-ch').forEach(b => b.onclick = () => {
        if (me.finished) return; me.col = b.dataset.col; me.row = null; me.cells = XL_ROWS && Array.from({ length: XL_ROWS }, (_, i) => me.col + (i + 1)); me.name = 'Coluna ' + me.col; paint();
        if (d.t === 'col') { if (me.col === d.a) finish('Essa é a coluna ' + d.a + '! As colunas têm letras. 🔠'); else feedback('Essa é a coluna ' + me.col + '. Procura a coluna ' + d.a + '.', true) }
    });
    root.querySelectorAll('.xl-rh').forEach(b => b.onclick = () => {
        if (me.finished) return; me.row = +b.dataset.row; me.col = null; me.cells = XL_COLS.map(c => c + me.row); me.name = 'Linha ' + me.row; paint();
        if (d.t === 'row') { if (me.row === d.a) finish('Essa é a linha ' + d.a + '! As linhas têm números. 🔢'); else feedback('Essa é a linha ' + me.row + '. Procura a linha ' + d.a + '.', true) }
    });
    if (showRes) {
        const enter = () => {
            if (me.finished) return; const r = xlParse($('xlFx').value), cell = root.querySelector('[data-cell="B6"]');
            if (r.err === 'syntax') { cell.textContent = ''; feedback('Uma fórmula começa por = e leva o intervalo entre parênteses, assim: ' + d.ex, true); return }
            if (r.err === 'fn') { cell.textContent = '#NOME?'; feedback('Essa função não existe. Experimenta a que o desafio pede.', true); return }
            if (r.err === 'empty') { cell.textContent = '0'; feedback('Esse intervalo não tem números. Os números estão entre B2 e B5.', true); return }
            cell.textContent = xlFmt(r.v);
            if (r.fn !== d.fn) feedback('A fórmula funciona, mas faz outro cálculo. Relê o desafio.', true);
            else if (r.rng !== d.rng) feedback('Quase! Confirma o intervalo: os números começam em B2 e acabam em B5.', true);
            else finish('Fórmula certa! O resultado é ' + xlFmt(r.v) + '. 🧮');
        };
        $('xlEnter').onclick = enter; $('xlFx').onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); enter() } };
    }
}

/* =====================================================================
   POWERPOINT STUDIO — apresentações
   ===================================================================== */
const LAYOUTS = {
    title: ['Diapositivo de Título', '<i class="lt-big"></i><i class="lt-line short"></i>'],
    content: ['Título e Conteúdo', '<i class="lt-bar"></i><i class="lt-line"></i><i class="lt-line"></i><i class="lt-line"></i>'],
    two: ['Dois Conteúdos', '<i class="lt-bar"></i><span class="lt-cols"><i class="lt-box"></i><i class="lt-box"></i></span>'],
    blank: ['Em Branco', '']
};
const PPT = [
    { t: 'layout', q: 'É o primeiro diapositivo: tem o título do trabalho e o teu nome. Que esquema escolhes?', a: 'title' },
    { t: 'layout', q: 'Queres um título e uma lista de ideias por baixo. Que esquema escolhes?', a: 'content' },
    { t: 'layout', q: 'Queres comparar duas coisas lado a lado (vantagens e desvantagens). Que esquema escolhes?', a: 'two' },
    { t: 'order', q: 'Ordena os diapositivos da apresentação «Os Animais do Mar».', items: ['Capa: Os Animais do Mar', 'Introdução: O que vamos ver', 'Baleias e tubarões', 'Conclusão: Obrigado! Perguntas?'] },
    { t: 'order', q: 'Ordena os diapositivos do trabalho sobre o Sistema Solar.', items: ['Capa: O Sistema Solar', 'Índice: O que vamos ver', 'Planetas rochosos', 'Planetas gasosos', 'Conclusão e fontes'] },
    { t: 'seq', qs: [['O que é uma transição?', ['O efeito ao passar de um diapositivo para o seguinte', 'Um texto que se move dentro do diapositivo', 'Um novo diapositivo', 'Uma imagem'], 0], ['E o que é uma animação?', ['Um efeito num objeto dentro do diapositivo (texto ou imagem)', 'Mudar a cor do fundo', 'Guardar a apresentação', 'Apagar um diapositivo'], 0]] },
    { t: 'sort', q: 'Transição ou animação? Separa cada efeito.', bins: ['🎞️ Transição', '✨ Animação'], items: [['Desvanecer ao mudar de diapositivo', 0], ['Texto que entra pela esquerda', 1], ['Cortina ao passar ao diapositivo seguinte', 0], ['Imagem que gira dentro do diapositivo', 1], ['Empurrar para o diapositivo seguinte', 0], ['Título que aparece letra a letra', 1]] },
    {
        t: 'cmp', q: 'Qual diapositivo está melhor? Pensa na quantidade de texto.', why: 'poucas palavras e ideias curtas são mais fáceis de ler e lembrar.',
        good: { title: 'Os vulcões', tfs: 20, fs: 15, lines: ['🌋 Saem lava e cinzas', '🌍 Existem em todo o mundo', '⚠️ Podem ser perigosos'] },
        bad: { title: 'Os vulcões', tfs: 12, fs: 7, lines: ['Um vulcão é uma abertura na crosta terrestre pela qual saem lava, gases e cinzas quando o magma sobe do interior da Terra até à superfície.', 'Existem vulcões ativos, adormecidos e extintos e podem ser encontrados em muitas zonas do planeta, em terra e debaixo do mar.', 'Quando um vulcão entra em erupção pode lançar cinzas muito alto e a lava pode destruir tudo à sua volta durante muitos dias.'] }
    },
    {
        t: 'cmp', q: 'Qual diapositivo está melhor? Pensa no contraste entre a letra e o fundo.', why: 'texto escuro em fundo claro lê-se bem; amarelo em fundo branco quase desaparece.',
        good: { title: 'Reciclar', tfs: 20, fs: 14, bg: '#ffffff', fg: '#1f2a44', lines: ['♻️ Separar o lixo', '🟦 Papel no azul', '🟩 Vidro no verde'] },
        bad: { title: 'Reciclar', tfs: 20, fs: 14, bg: '#ffffff', fg: '#ffe066', lines: ['♻️ Separar o lixo', '🟦 Papel no azul', '🟩 Vidro no verde'] }
    },
    {
        t: 'cmp', q: 'Qual diapositivo está melhor? Pensa no tamanho da letra.', why: 'a letra tem de ser grande para se ler de longe.',
        good: { title: 'A Internet', tfs: 20, fs: 16, lines: ['🌐 Liga milhões de computadores', '🔒 Usa com segurança'] },
        bad: { title: 'A Internet', tfs: 11, fs: 6, lines: ['🌐 Liga milhões de computadores', '🔒 Usa com segurança'] }
    },
    {
        t: 'cmp', q: 'Qual diapositivo está melhor? Pensa nas cores e nos tipos de letra.', why: 'poucas cores e um só tipo de letra deixam tudo mais limpo e fácil de ler.',
        good: { title: 'Os meus jogos', tfs: 20, fs: 14, bg: '#e8f1ff', fg: '#12355b', lines: ['🎮 Danger Zone', '🧭 Tico Maze', '🧠 Memória TIC'] },
        bad: { title: 'Os meus jogos', tfs: 20, fs: 14, bg: '#00e5ff', fg: '#222', lines: [['🎮 Danger Zone', '#e91e63', 'Comic Sans MS, cursive'], ['🧭 Tico Maze', '#4caf50', 'Times New Roman, serif'], ['🧠 Memória TIC', '#ff9800', 'Courier New, monospace']] }
    },
    { t: 'sort', q: 'Boa ou má prática? Separa as ideias para uma apresentação.', bins: ['👍 Boa prática', '👎 Má prática'], items: [['Poucas palavras por diapositivo', 0], ['Letra grande e fácil de ler', 0], ['Texto escuro em fundo claro', 0], ['Imagens que têm a ver com o tema', 0], ['Parágrafos inteiros copiados da internet', 1], ['Texto amarelo em fundo branco', 1], ['Muitas animações diferentes em tudo', 1], ['Muitas cores e tipos de letra misturados', 1]] }
];
function gamePpt() {
    const d = PPT[lvl - 1], root = $('game');
    if (d.t === 'seq') return mcqSeq(d.qs);
    if (d.t === 'sort') { const [t, p] = dropSort(d.bins, d.items); return dropGame(d.q, t, p) }
    if (d.t === 'layout') {
        const keys = shuffled(Object.keys(LAYOUTS));
        root.innerHTML = `<div class="question">${esc(d.q)}</div><div class="layout-grid">${keys.map(k => `<button class="layout-card" data-k="${k}"><span class="lt-thumb">${LAYOUTS[k][1]}</span><b>${LAYOUTS[k][0]}</b></button>`).join('')}</div>`;
        root.querySelectorAll('.layout-card').forEach(b => b.onclick = () => {
            if (g.finished) return; const k = b.dataset.k;
            if (k === d.a) { b.classList.add('ok'); finish('Esse esquema é o ideal! 📽️') } else { b.classList.add('bad'); b.disabled = true; feedback('O esquema «' + LAYOUTS[k][0] + '» não é o mais indicado. Tenta outro.', true) }
        });
        return;
    }
    if (d.t === 'order') {
        g.next = 0; const list = shuffled(d.items.map((t, i) => [t, i]));
        root.innerHTML = `<div class="question">${esc(d.q)}</div><p class="drop-tip">Toca nos diapositivos pela ordem certa: do primeiro ao último.</p><div class="order-grid">${list.map(([t, i]) => `<button class="order-card" data-n="${i}"><span class="order-num" aria-hidden="true"></span>${slideMock({ title: t, tfs: 13, bg: '#fff' })}</button>`).join('')}</div>`;
        root.querySelectorAll('.order-card').forEach(b => b.onclick = () => {
            if (g.finished || b.classList.contains('done')) return;
            if (+b.dataset.n === g.next) {
                b.classList.add('done'); b.querySelector('.order-num').textContent = g.next + 1; g.next++;
                if (g.next === d.items.length) finish('Apresentação bem organizada! 📽️'); else feedback('Certo! Qual vem a seguir?');
            } else feedback('Ainda não é esse. Pensa: o que vem primeiro numa apresentação?', true);
        });
        return;
    }
    const opts = shuffled([[d.good, true], [d.bad, false]]);
    root.innerHTML = `<div class="question">${esc(d.q)}</div><div class="cmp">${opts.map(([s, ok], i) => `<button class="cmp-card" data-ok="${ok ? 1 : 0}" aria-label="Diapositivo ${'AB'[i]}"><span class="cmp-tag">${'AB'[i]}</span>${slideMock(s)}</button>`).join('')}</div>`;
    root.querySelectorAll('.cmp-card').forEach(b => b.onclick = () => {
        if (g.finished) return;
        if (b.dataset.ok === '1') { b.classList.add('ok'); finish('Boa escolha! ' + d.why[0].toUpperCase() + d.why.slice(1)) }
        else { b.classList.add('bad'); b.disabled = true; feedback('Olha com atenção: ' + d.why, true) }
    });
}

/* =====================================================================
   FICHEIROS E PASTAS — extensões e organização (liga ao Escritório TIC)
   ===================================================================== */
const FILES = [
    { t: 'sort', q: 'Arruma cada ficheiro na pasta do programa certo.', bins: ['📝 Pasta Word', '📊 Pasta Excel', '📽️ Pasta PowerPoint'], items: [['trabalho.docx', 0], ['carta.docx', 0], ['notas.xlsx', 1], ['orcamento.xlsx', 1], ['aula.pptx', 2], ['festa.pptx', 2]] },
    { t: 'pairs', q: 'Liga cada extensão ao tipo de ficheiro.', p: [['.docx', 'Documento de texto (Word)'], ['.xlsx', 'Folha de cálculo (Excel)'], ['.pptx', 'Apresentação (PowerPoint)'], ['.txt', 'Texto simples (Bloco de notas)']] },
    { t: 'sort', q: 'Imagens, música ou vídeos? Arruma cada ficheiro.', bins: ['🖼️ Imagens', '🎵 Música', '🎬 Vídeos'], items: [['praia.jpg', 0], ['logo.png', 0], ['cancao.mp3', 1], ['som.wav', 1], ['filme.mp4', 2], ['gravacao.avi', 2]] },
    { t: 'seq', qs: [['Que extensão tem um ficheiro do Word?', ['.docx', '.xlsx', '.pptx', '.jpg'], 0], ['Que extensão tem uma folha do Excel?', ['.xlsx', '.docx', '.mp3', '.pptx'], 0], ['Que extensão tem uma apresentação do PowerPoint?', ['.pptx', '.docx', '.png', '.xlsx'], 0]] },
    { t: 'sort', q: 'Organiza a pasta da turma: quatro tipos de ficheiros.', bins: ['📝 Textos', '📊 Tabelas', '📽️ Apresentações', '🖼️ Imagens'], items: [['resumo.docx', 0], ['poema.docx', 0], ['notas_turma.xlsx', 1], ['horario.xlsx', 1], ['projeto.pptx', 2], ['feira.pptx', 2], ['mascote.png', 3], ['foto_turma.jpg', 3]] },
    { t: 'sort', q: 'Pasta «Escola»: coloca cada ficheiro na subpasta certa.', bins: ['🔢 Matemática', '📖 Português', '💻 TIC'], items: [['fracoes_exercicios.xlsx', 0], ['tabuada.xlsx', 0], ['resumo_livro.docx', 1], ['poema_outono.docx', 1], ['seguranca_online.pptx', 2], ['atalhos_teclado.docx', 2]] },
    { t: 'seq', qs: [['Qual destes nomes de ficheiro é válido?', ['trabalho_final.docx', 'trabalho: final?.docx', 'trabalho/final.docx', 'trabalho*final.docx'], 0], ['Qual é a melhor pasta para guardares um trabalho de TIC?', ['Escola > TIC', 'Ambiente de trabalho, junto a tudo', 'Num ficheiro sem nome', 'Na Reciclagem'], 0], ['Qual é o melhor nome para um ficheiro?', ['relatorio_ciencias_5A.docx', 'novo1.docx', 'asdfgh.docx', 'sem titulo.docx'], 0]] },
    { t: 'pairs', q: 'Que formato escolhes em cada situação?', p: [['.pdf', 'Para ler sem alterar'], ['.docx', 'Texto que se pode editar'], ['.xlsx', 'Tabela com fórmulas'], ['.pptx', 'Diapositivos para apresentar'], ['.zip', 'Vários ficheiros num só, comprimidos']] },
    { t: 'sort', q: 'Word, Excel ou PowerPoint? Escolhe o programa para cada tarefa.', bins: ['📝 Word', '📊 Excel', '📽️ PowerPoint'], items: [['Escrever uma carta', 0], ['Corrigir um texto', 0], ['Fazer uma tabela com somas', 1], ['Criar um gráfico de barras', 1], ['Apresentar um trabalho à turma', 2], ['Criar diapositivos com imagens', 2]] },
    { t: 'seq', qs: [['Qual é o atalho para copiar um ficheiro?', ['Ctrl + C', 'Ctrl + V', 'Ctrl + Z', 'Ctrl + P'], 0], ['E para colar?', ['Ctrl + V', 'Ctrl + C', 'Ctrl + S', 'Ctrl + A'], 0], ['Apagaste um ficheiro sem querer. Onde o podes encontrar?', ['Na Reciclagem', 'No teclado', 'Na impressora', 'Na webcam'], 0], ['Qual é a diferença entre copiar e mover?', ['Copiar deixa o original; mover tira-o do sítio antigo', 'São a mesma coisa', 'Copiar apaga o ficheiro', 'Mover duplica o ficheiro'], 0]] },
    { t: 'pairs', q: 'No caminho C:\\Escola\\TIC\\trabalho.docx, o que é cada parte?', p: [['C:', 'A unidade (o disco)'], ['Escola', 'A pasta principal'], ['TIC', 'A subpasta'], ['trabalho.docx', 'O ficheiro (nome + extensão)']] },
    { t: 'sort', q: 'Desafio final: arruma tudo na pasta certa!', bins: ['📝 Word', '📊 Excel', '📽️ PowerPoint', '🖼️ Imagens'], items: [['diario.docx', 0], ['redacao.docx', 0], ['contas.xlsx', 1], ['medias.xlsx', 1], ['reciclagem.pptx', 2], ['tic_nas_escolas.pptx', 2], ['robot.png', 3], ['paisagem.jpg', 3], ['ata.docx', 0], ['gastos.xlsx', 1]] }
];
function gameFiles() {
    const d = FILES[lvl - 1];
    if (d.t === 'seq') return mcqSeq(d.qs);
    if (d.t === 'pairs') { const [t, p] = dropPairs(d.p); return dropGame(d.q, t, p) }
    const [t, p] = dropSort(d.bins, d.items); dropGame(d.q, t, p);
}

/* =====================================================================
   REDES — o caminho de uma mensagem
   ===================================================================== */
function orderCards(q, items, tip) {
    g.next = 0; const root = $('game'), me = g, list = shuffled(items.map((x, i) => [x, i]));
    root.innerHTML = `<div class="question">${esc(q)}</div><p class="drop-tip">${tip || 'Toca nos passos pela ordem certa: do primeiro ao último.'}</p><div class="order-grid net-grid">${list.map(([x, i]) => `<button class="order-card net-card" data-n="${i}"><span class="order-num" aria-hidden="true"></span><span class="net-ico">${x[0]}</span><b>${esc(x[1])}</b></button>`).join('')}</div><div class="net-path" id="netPath" aria-live="polite"></div>`;
    root.querySelectorAll('.order-card').forEach(b => b.onclick = () => {
        if (me.finished || g !== me || b.classList.contains('done')) return;
        if (+b.dataset.n === me.next) {
            b.classList.add('done'); b.querySelector('.order-num').textContent = me.next + 1;
            $('netPath').textContent = (me.next ? $('netPath').textContent + ' → ' : '') + items[me.next][0]; me.next++;
            if (me.next === items.length) finish('A mensagem chegou ao destino! 📨'); else feedback('Certo! E depois?');
        } else feedback('Ainda não é esse passo. Pensa no caminho da mensagem.', true);
    });
}
const NETWORK = [
    { t: 'order', q: 'Segue o caminho: do teu tablet até à Internet.', items: [['📱', 'Tablet'], ['📶', 'Wi-Fi'], ['📡', 'Router'], ['🌐', 'Internet']] },
    { t: 'order', q: 'Agora a viagem completa até ao servidor.', items: [['💻', 'O teu computador'], ['📶', 'Wi-Fi'], ['📡', 'Router'], ['🌐', 'Internet'], ['🖥️', 'Servidor do site']] },
    { t: 'pairs', q: 'Liga cada equipamento da rede à sua função.', p: [['📡 Router', 'Distribui a ligação pela casa ou escola'], ['📶 Wi-Fi', 'Liga sem fios'], ['🖥️ Servidor', 'Guarda sites e ficheiros e responde aos pedidos'], ['🔌 Cabo de rede', 'Liga com fios, de forma estável']] },
    { t: 'seq', qs: [['O que faz o router?', ['Encaminha as mensagens entre os dispositivos e a Internet', 'Imprime documentos', 'Grava vídeos', 'Aumenta o volume'], 0], ['O que é um servidor?', ['Um computador que guarda sites e responde a pedidos', 'Um tipo de teclado', 'Um jogo', 'Um cabo'], 0]] },
    { t: 'order', q: 'Envia um email a um amigo: ordena a viagem.', items: [['✍️', 'Escreves o email'], ['📤', 'Carregas em Enviar'], ['📡', 'O router envia'], ['🖥️', 'Servidor de email'], ['📥', 'O teu amigo recebe']] },
    { t: 'sort', q: 'Ligação com fios ou sem fios?', bins: ['🔌 Com fios', '📶 Sem fios'], items: [['Cabo Ethernet', 0], ['Fibra ótica', 0], ['Cabo de rede', 0], ['Wi-Fi', 1], ['Bluetooth', 1], ['Dados móveis (4G/5G)', 1]] },
    { t: 'seq', qs: [['Qual é a melhor palavra-passe para o Wi-Fi de casa?', ['Uma longa, com letras, números e símbolos', '123456', 'O teu nome', 'wifi'], 0], ['Num Wi-Fi público, o que NÃO deves fazer?', ['Fazer compras ou introduzir palavras-passe', 'Ver o horário do autocarro', 'Ler uma notícia', 'Ver o mapa'], 0]] },
    { t: 'orderText', q: 'O Wi-Fi deixou de funcionar. Ordena o que deves fazer.', items: ['Ver se o Wi-Fi está ligado no dispositivo', 'Aproximar-te do router', 'Reiniciar o router (com um adulto)', 'Pedir ajuda a um adulto ou ao técnico'] },
    { t: 'pairs', q: 'Liga cada sigla ao seu significado.', p: [['IP', 'Endereço de um dispositivo na rede'], ['URL', 'Endereço de uma página web'], ['LAN', 'Rede local (casa ou escola)'], ['Wi-Fi', 'Rede sem fios']] },
    { t: 'order', q: 'Ver um vídeo online: ordena a viagem do pedido.', items: [['👆', 'Clicas em «ver vídeo»'], ['📶', 'Wi-Fi'], ['📡', 'Router'], ['🌐', 'Internet'], ['🖥️', 'Servidor do vídeo'], ['🎬', 'O vídeo chega ao ecrã']] },
    { t: 'seq', qs: [['Qual é a unidade da velocidade da Internet?', ['Mbps (megabits por segundo)', 'Kg', 'Litros', 'Pixels'], 0], ['Porque é que o cabo costuma ser mais estável que o Wi-Fi?', ['Tem menos interferências', 'Porque é mais bonito', 'Porque é mais curto', 'Porque não tem router'], 0], ['O que é uma rede?', ['Dispositivos ligados entre si para partilhar informação', 'Um tipo de cabo', 'Um programa de desenho', 'Um jogo'], 0]] },
    { t: 'sort', q: 'Rede local ou Internet? Separa cada exemplo.', bins: ['🏠 Rede local (casa/escola)', '🌐 Internet (longe)'], items: [['Impressora da escola', 0], ['Computador da sala ao lado', 0], ['Router de casa', 0], ['Servidor de um site no estrangeiro', 1], ['Loja online', 1], ['Rede social', 1]] }
];
function gameNetwork() {
    const d = NETWORK[lvl - 1];
    if (d.t === 'seq') return mcqSeq(d.qs);
    if (d.t === 'pairs') { const [t, p] = dropPairs(d.p); return dropGame(d.q, t, p) }
    if (d.t === 'sort') { const [t, p] = dropSort(d.bins, d.items); return dropGame(d.q, t, p) }
    if (d.t === 'orderText') return orderCards(d.q, d.items.map((x, i) => [i + 1 + '.', x]));
    orderCards(d.q, d.items);
}

/* =====================================================================
   ERGONOMIA — postura, pausas e saúde digital
   ===================================================================== */
function ergoSetup(q, groups) {
    const me = g;
    $('game').innerHTML = `<div class="question">${esc(q)}</div><div class="ergo-box">${groups.map((gr, i) => `<fieldset class="ergo-group" data-g="${i}"><legend>${esc(gr[0])}</legend>${shuffled(gr[1].map((t, k) => [t, k])).map(([t, k]) => `<label class="ergo-opt"><input type="radio" name="eg${i}" value="${k}"><span>${esc(t)}</span></label>`).join('')}</fieldset>`).join('')}</div><div class="ergo-actions"><button class="primary" id="ergoCheck">✔ Verificar</button></div>`;
    $('ergoCheck').onclick = () => {
        if (me.finished || g !== me) return; let bad = 0, empty = 0;
        groups.forEach((gr, i) => {
            const fs = $('game').querySelector(`[data-g="${i}"]`), v = fs.querySelector('input:checked');
            fs.classList.remove('bad', 'ok');
            if (!v) { empty++; return }
            if (+v.value === gr[2]) fs.classList.add('ok'); else { fs.classList.add('bad'); bad++ }
        });
        if (empty) feedback('Escolhe uma opção em todas as regulações.', false, false);
        else if (bad) feedback('Ainda há ' + bad + (bad > 1 ? ' regulações' : ' regulação') + ' para rever. Pensa no conforto do corpo!', true);
        else finish('Posto de trabalho perfeito! O teu corpo agradece. 🪑');
    };
}
const ERGO = [
    { t: 'sort', q: 'Boa ou má postura? Separa cada hábito.', bins: ['👍 Boa prática', '👎 Má prática'], items: [['Costas encostadas à cadeira', 0], ['Pés apoiados no chão', 0], ['Ecrã à altura dos olhos', 0], ['Curvar o pescoço para ver o telemóvel', 1], ['Sentar com as costas curvadas', 1], ['Mochila pesada num só ombro', 1]] },
    { t: 'setup', q: 'Regula o posto de trabalho do computador.', g: [['Onde fica o ecrã?', ['À altura dos olhos', 'Muito abaixo dos olhos', 'Acima da cabeça'], 0], ['A que distância estás do ecrã?', ['Cerca de um braço (50–70 cm)', 'Colado ao ecrã', 'A mais de 2 metros'], 0], ['Onde estão os pés?', ['Apoiados no chão', 'No ar, sem apoio', 'Presos debaixo da cadeira'], 0]] },
    { t: 'seq', qs: [['Como devem estar as costas ao usar o computador?', ['Direitas e apoiadas no encosto', 'Muito curvadas para a frente', 'Deitadas de lado', 'Sem apoio nenhum'], 0], ['Como devem estar os joelhos e os cotovelos?', ['Dobrados cerca de 90°', 'Totalmente esticados', 'Cruzados com força', 'Encostados à mesa com o corpo torcido'], 0]] },
    { t: 'pairs', q: 'Liga cada parte do corpo ao conselho certo.', p: [['👀 Olhos', 'Descansar a cada 20 minutos'], ['🦴 Costas', 'Encostadas ao encosto da cadeira'], ['✋ Pulsos', 'Retos ao escrever'], ['🦶 Pés', 'Apoiados no chão'], ['🦒 Pescoço', 'Direito, sem se curvar']] },
    { t: 'seq', qs: [['Em que consiste a regra 20-20-20?', ['A cada 20 minutos, olhar 20 segundos para algo longe', 'Usar o computador 20 horas', 'Fazer 20 flexões', 'Escrever 20 palavras por minuto'], 0], ['Porque é importante piscar os olhos?', ['Para os manter hidratados e menos cansados', 'Para o ecrã ficar mais brilhante', 'Para escrever mais depressa', 'Não serve para nada'], 0]] },
    { t: 'setup', q: 'Regula o teclado e o rato.', g: [['Como ficam os pulsos ao escrever?', ['Retos, sem dobrar', 'Muito dobrados para cima', 'Muito dobrados para baixo'], 0], ['Onde fica o rato?', ['Perto do teclado, ao alcance', 'Muito longe, com o braço esticado', 'No colo'], 0], ['Como estão os cotovelos?', ['Dobrados a cerca de 90°', 'Esticados', 'Muito levantados'], 0]] },
    { t: 'sort', q: 'Pausas e hábitos saudáveis: bons ou maus?', bins: ['👍 Bom hábito', '👎 Mau hábito'], items: [['Levantar-me e esticar de hora a hora', 0], ['Olhar para longe de vez em quando', 0], ['Beber água', 0], ['Jogar às escuras com brilho no máximo', 1], ['Usar o computador 4 horas sem parar', 1], ['Comer sempre em frente ao ecrã', 1], ['Fazer pausas para andar', 0], ['Ficar sempre na mesma posição', 1]] },
    { t: 'seq', qs: [['Como deve ser a luz da sala quando usas o ecrã?', ['Suave e sem reflexos no ecrã', 'Muito forte a bater no ecrã', 'Completamente às escuras', 'Só a luz de um candeeiro atrás do ecrã'], 0], ['O brilho do ecrã deve estar…', ['Confortável, parecido com a luz da sala', 'Sempre no máximo', 'Sempre no mínimo', 'Não importa'], 0]] },
    { t: 'setup', q: 'Usa o telemóvel e o tablet de forma saudável.', g: [['Como seguras o telemóvel?', ['Levantado, perto da altura dos olhos', 'No colo, a olhar para baixo muito tempo', 'Deitado a olhar para cima no escuro'], 0], ['De quanto em quanto tempo fazes uma pausa?', ['Cerca de uma pausa por hora', 'Nunca', 'Só quando a bateria acaba'], 0], ['Onde usas o tablet?', ['Sentado, com as costas apoiadas', 'Deitado de barriga para baixo durante horas', 'A andar na rua a olhar só para o ecrã'], 0]] },
    { t: 'pairs', q: 'Liga cada sinal do corpo ao que podes fazer.', p: [['😵 Olhos cansados', 'Olhar para longe e piscar'], ['😣 Dor nas costas', 'Rever a cadeira e fazer pausas'], ['🤕 Dor de cabeça', 'Descansar e ajustar a luz'], ['✋ Pulsos doridos', 'Fazer pausa e rever a posição do teclado']] },
    { t: 'seq', qs: [['Quanto pode pesar, no máximo, a mochila?', ['Cerca de 10% do teu peso', 'Metade do teu peso', 'O dobro do teu peso', 'Não há limite'], 0], ['Como deves levar a mochila?', ['Com duas alças, bem ajustada às costas', 'Só num ombro', 'Pendurada numa mão', 'Muito baixa, a bater nas pernas'], 0]] },
    { t: 'sort', q: 'Desafio final: postura, ecrã ou pausas?', bins: ['🪑 Postura', '🖥️ Ecrã e luz', '⏰ Pausas'], items: [['Costas apoiadas', 0], ['Pés no chão', 0], ['Ecrã à altura dos olhos', 1], ['Sem reflexos no ecrã', 1], ['Brilho confortável', 1], ['Regra 20-20-20', 2], ['Levantar e esticar', 2], ['Beber água e descansar', 2]] }
];
function gameErgo() {
    const d = ERGO[lvl - 1];
    if (d.t === 'seq') return mcqSeq(d.qs);
    if (d.t === 'pairs') { const [t, p] = dropPairs(d.p); return dropGame(d.q, t, p) }
    if (d.t === 'sort') { const [t, p] = dropSort(d.bins, d.items); return dropGame(d.q, t, p) }
    ergoSetup(d.q, d.g);
}

/* =====================================================================
   VÍRUS RUSH — plataformas de precisão (estilo Super Meat Boy)
   Salta, desliza nas paredes e foge de vírus e hackers. Morres, voltas logo!
   ===================================================================== */
const VR = { T: 32, W: 25, H: 15, PW: 22, PH: 22, G: .55, JUMP: 10.6, WJX: 5, WJY: 9.6, ACC: .55, MAXV: 3.7, MAXF: 11 };
const VR_LEVELS = [["#########################", "#.......................#", "#.......................#", "#.......................#", "#.......................#", "#.......................#", "#.......................#", "#.......................#", "#.......................#", "#.......................#", "#.......................#", "#.......................#", "#.S.....^^......^^....E.#", "#########################", "#########################"], ["#########################", "#.......................#", "#.......................#", "#.......................#", "#.......................#", "#.......................#", "#.......................#", "#.......................#", "#.......................#", "#.......................#", "#.......................#", "#.......................#", "#.S...................E.#", "####...####...####...####", "####^^^####^^^####^^^####"], ["#########################", "#.......................#", "#.......................#", "#.......................#", "#.....................E.#", "#...................#####", "#.......................#", "#...............####....#", "#.......................#", "#..........####.........#", "#.......................#", "#.....####..............#", "#.S......^^^^^^^^^^^^^..#", "#########################", "#########################"], ["#########################", "#.......................#", "#.......................#", "#.......................#", "#.......................#", "#.......................#", "#.......................#", "#.......................#", "#.......................#", "#.......###########.....#", "#.......................#", "#.......................#", "#.S..........o......^^E.#", "#########################", "#########################"], ["#########################", "##########.............##", "##########...........E.##", "##########...############", "##########...############", "##########...############", "##########...############", "##########...############", "##########...############", "##########...############", "##########...############", "#............############", "#.S..........############", "#########################", "#########################"], ["#########################", "#########..............##", "#########............E.##", "#########x...############", "#########....############", "#########....############", "#########...x############", "#########....############", "#########....############", "#########x...############", "#########....############", "#............############", "#.S..........############", "#########################", "#########################"], ["#########################", "#.......................#", "#.......................#", "#.......................#", "#.......................#", "#.......................#", "#.......................#", "#.......................#", "#.......................#", "#.......................#", "#.......................#", "#.......................#", "#.S.......h.......^....E#", "#####..#######...###..###", "#####^^#######^^^###^^###"], ["#########################", "#.......................#", "#.......................#", "#.......................#", "#.......................#", "#.......................#", "#.......................#", "#.......................#", "#.......................#", "#.......................#", "#.......................#", "#.....u.......u.....u...#", "#.S....................E#", "#####...#####...####..###", "#####^^^#####^^^####^^###"], ["#########################", "#.......................#", "#..E....................#", "#######.................#", "#.......................#", "#.........######........#", "#.......................#", "#.................#######", "#...........o...........#", "#.........######........#", "#.S.....................#", "#######.................#", "#......^^^^^^^^^^^^^^^^^#", "#########################", "#########################"], ["#########################", "#.......................#", "#.......................#", "#.......................#", "#.......................#", "#.......................#", "#.......................#", "#.......................#", "#.......................#", "#########################", "#.........vv.....vv.....#", "#.......................#", "#.S...^^......^^....^^E.#", "#########################", "#########################"], ["#########################", "#########..............##", "#########..............##", "#########x.....o.....E.##", "#########....####..######", "#########....####^^######", "#########...x############", "#########....############", "#########....############", "#########x...############", "#########....############", "#............############", "#.S..........############", "#########################", "#########################"], ["#########################", "#########..............##", "#########..............##", "#########......h......E##", "#########...x#####..#####", "#########....#####^^#####", "#########x...############", "#########....############", "#########...x############", "#########....############", "#########x...############", "#............############", "#.S..^.......############", "#########################", "#########################"]];
function vrParse(rows) {
    const T = VR.T, lv = { map: rows.map(r => r.split('')), spikes: [], movers: [], start: [0, 0], goal: null };
    lv.map.forEach((row, r) => row.forEach((ch, c) => {
        const x = c * T, y = r * T;
        if (ch === 'S') { lv.start = [x + 5, y + T - VR.PH]; row[c] = '.' }
        else if (ch === 'E') { lv.goal = { x: x + 4, y: y + 4, w: 24, h: 24 }; row[c] = '.' }
        else if (ch === '^') lv.spikes.push({ x: x + 4, y: y + 18, w: 24, h: 14, k: 'u', c, r });
        else if (ch === 'v') lv.spikes.push({ x: x + 4, y, w: 24, h: 14, k: 'd', c, r });
        else if (ch === 'x') lv.spikes.push({ x: x + 3, y: y + 3, w: 26, h: 26, k: 'x', c, r });
        else if (ch === 'o' || ch === 'h' || ch === 'u') { lv.movers.push({ k: ch, x0: x + 16, y0: y + 16, r: ch === 'h' ? 12 : 11 }); row[c] = '.' }
    }));
    return lv;
}
function vrSolid(map, tx, ty) { if (tx < 0 || tx >= VR.W) return true; if (ty < 0 || ty >= VR.H) return false; return map[ty][tx] === '#' }
function vrHit(map, x, y) {
    const T = VR.T, x1 = Math.floor(x / T), x2 = Math.floor((x + VR.PW - 1e-6) / T), y1 = Math.floor(y / T), y2 = Math.floor((y + VR.PH - 1e-6) / T);
    for (let ty = y1; ty <= y2; ty++)for (let tx = x1; tx <= x2; tx++)if (vrSolid(map, tx, ty)) return true;
    return false;
}
function vrInit(lv) { const s = { x: lv.start[0], y: lv.start[1], vx: 0, vy: 0, ground: true, wall: 0, lock: 0, coy: 6, pj: false }; return s }
function vrStep(map, s, inp) {
    const T = VR.T, n = Object.assign({}, s), c = n.lock > 0 ? .3 : 1;
    if (n.lock > 0) n.lock--;
    if (inp.l && !inp.r) n.vx -= VR.ACC * c; else if (inp.r && !inp.l) n.vx += VR.ACC * c; else n.vx *= n.ground ? .55 : .92;
    if (Math.abs(n.vx) < .05) n.vx = 0;
    if (n.lock <= 0) n.vx = Math.max(-VR.MAXV, Math.min(VR.MAXV, n.vx));
    const press = inp.j && !n.pj; n.pj = !!inp.j;
    if (press) {
        if (n.ground || n.coy > 0) { n.vy = -VR.JUMP; n.ground = false; n.coy = 0 }
        else if (n.wall !== 0) { n.vy = -VR.WJY; n.vx = -n.wall * VR.WJX; n.lock = 10; n.wall = 0 }
    }
    n.vy += (n.vy < 0 && !inp.j) ? VR.G * 2.4 : VR.G;
    if (n.wall !== 0 && !n.ground && n.vy > 2) n.vy = 2;
    if (n.vy > VR.MAXF) n.vy = VR.MAXF;
    let nx = n.x + n.vx;
    if (vrHit(map, nx, n.y)) { nx = n.vx > 0 ? Math.floor((nx + VR.PW) / T) * T - VR.PW : (Math.floor(nx / T) + 1) * T; n.vx = 0 }
    n.x = nx;
    let ny = n.y + n.vy;
    if (vrHit(map, n.x, ny)) { ny = n.vy > 0 ? Math.floor((ny + VR.PH) / T) * T - VR.PH : (Math.floor(ny / T) + 1) * T; n.vy = 0 }
    n.y = ny;
    n.ground = n.vy >= 0 && vrHit(map, n.x, n.y + 1);
    if (n.ground) n.coy = 6; else if (n.coy > 0) n.coy--;
    n.wall = 0;
    if (!n.ground) { if (vrHit(map, n.x - 1, n.y)) n.wall = -1; else if (vrHit(map, n.x + 1, n.y)) n.wall = 1 }
    return n;
}
const vrOverlap = (s, r) => s.x < r.x + r.w && s.x + VR.PW > r.x && s.y < r.y + r.h && s.y + VR.PH > r.y;
function vrDead(lv, s) { return s.y > VR.H * VR.T || lv.spikes.some(r => vrOverlap(s, r)) }
function vrMoverInit(m) { return { k: m.k, x: m.x0, y: m.y0, x0: m.x0, y0: m.y0, r: m.r, d: 1, v: m.k === 'h' ? 1.1 : 1.6 } }
function vrMoverStep(map, m) {
    const T = VR.T, A = (m.k === 'u' ? 2 : 4) * T;
    if (m.k === 'u') {
        const ny = m.y + m.d * m.v;
        if (Math.abs(ny - m.y0) > A || vrSolid(map, Math.floor(m.x / T), Math.floor((ny + m.d * m.r) / T))) m.d = -m.d; else m.y = ny;
    } else {
        const nx = m.x + m.d * m.v, ahead = nx + m.d * m.r;
        const blocked = Math.abs(nx - m.x0) > A || vrSolid(map, Math.floor(ahead / T), Math.floor(m.y / T)) || (m.k === 'h' && !vrSolid(map, Math.floor(ahead / T), Math.floor(m.y / T) + 1));
        if (blocked) m.d = -m.d; else m.x = nx;
    }
}
function vrMoverHit(m, s) {
    const cx = Math.max(s.x, Math.min(m.x, s.x + VR.PW)), cy = Math.max(s.y, Math.min(m.y, s.y + VR.PH));
    return Math.hypot(m.x - cx, m.y - cy) < m.r - 1;
}
function gameVirusRush() {
    const lv = vrParse(VR_LEVELS[lvl - 1]), T = VR.T, me = g;
    me.finished = false;
    $('game').innerHTML = `<div class="vr-hud"><span>💀 Mortes: <b id="vrDeaths">0</b></span><span>⏱️ <b id="vrTime">0.0</b> s</span></div>
    <div class="vr-stage"><canvas id="vrCanvas" width="${VR.W * T}" height="${VR.H * T}" tabindex="0" role="img" aria-label="Nível de plataformas: leva o Tiko até ao escudo, fugindo dos vírus e dos hackers"></canvas></div>
    <div class="vr-pad" aria-label="Controlos no ecrã"><button data-k="l" tabindex="-1" aria-label="Esquerda">◀</button><button data-k="r" tabindex="-1" aria-label="Direita">▶</button><button data-k="j" tabindex="-1" aria-label="Saltar">⤒ Saltar</button></div>
    <p class="pixel-note">Setas ou A/D para andar · Espaço, ↑ ou W para saltar · Encosta-te a uma parede e salta para saltar da parede! Se morreres, voltas logo ao início.</p>`;
    const cv = $('vrCanvas'), ctx = cv.getContext('2d'), inp = { l: 0, r: 0, j: 0 };
    let s = vrInit(lv), movers = lv.movers.map(vrMoverInit), parts = [];
    Object.assign(me, { deaths: 0, frames: 0, started: false, won: false, dead: 0 });
    const keyMap = { ArrowLeft: 'l', a: 'l', A: 'l', ArrowRight: 'r', d: 'r', D: 'r', ArrowUp: 'j', w: 'j', W: 'j', ' ': 'j' };
    window._dzKey = (e, down) => { const k = keyMap[e.key]; if (k) { inp[k] = down ? 1 : 0; e.preventDefault() } else if (e.key === 'ArrowDown') e.preventDefault() };
    $('game').querySelectorAll('[data-k]').forEach(b => {
        const set = v => { inp[b.dataset.k] = v };
        b.addEventListener('pointerdown', e => { e.preventDefault(); set(1) });
        ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => b.addEventListener(ev, () => set(0)));
    });
    const die = () => {
        me.deaths++; $('vrDeaths').textContent = me.deaths; me.dead = 14;
        for (let i = 0; i < 16; i++) parts.push({ x: s.x + 11, y: s.y + 11, vx: (Math.random() - .5) * 8, vy: -Math.random() * 6, life: 22 + Math.random() * 10 });
    };
    const respawn = () => { s = vrInit(lv); movers = lv.movers.map(vrMoverInit) };
    const tick = () => {
        parts.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += .4; p.life-- }); parts = parts.filter(p => p.life > 0);
        if (me.won) return;
        if (me.dead > 0) { me.dead--; if (!me.dead) respawn(); return }
        if (!me.started && (inp.l || inp.r || inp.j)) me.started = true;
        if (me.started) { me.frames++; if (me.frames % 6 === 0) $('vrTime').textContent = (me.frames / 60).toFixed(1) }
        s = vrStep(lv.map, s, inp); movers.forEach(m => vrMoverStep(lv.map, m));
        if (vrDead(lv, s) || movers.some(m => vrMoverHit(m, s))) { die(); return }
        if (lv.goal && vrOverlap(s, lv.goal)) {
            me.won = true; window._dzKey = null;
            finish('Ficheiro protegido em ' + (me.frames / 60).toFixed(1) + ' s e ' + me.deaths + (me.deaths === 1 ? ' morte' : ' mortes') + '! 🛡️');
        }
    };
    const draw = () => {
        const W = cv.width, H = cv.height; const gr = ctx.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#101a3a'); gr.addColorStop(1, '#1c2b5e'); ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = '#ffffff0d'; ctx.lineWidth = 1; for (let x = 0; x <= W; x += T) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke() } for (let y = 0; y <= H; y += T) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() }
        lv.map.forEach((row, r) => row.forEach((ch, c) => { if (ch === '#') { ctx.fillStyle = '#3a3f7a'; ctx.fillRect(c * T, r * T, T, T); ctx.fillStyle = '#5560b8'; ctx.fillRect(c * T, r * T, T, 4); ctx.strokeStyle = '#262a55'; ctx.strokeRect(c * T + .5, r * T + .5, T - 1, T - 1) } }));
        lv.spikes.forEach(k => {
            if (k.k === 'x') { ctx.font = '26px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#ff3b5c55'; ctx.fillRect(k.x, k.y, k.w, k.h); ctx.fillText('🦠', k.x + 13, k.y + 14); return }
            ctx.fillStyle = '#ff4d6d'; ctx.beginPath(); const up = k.k === 'u', y0 = up ? k.y + k.h : k.y, y1 = up ? k.y : k.y + k.h;
            for (let i = 0; i < 3; i++) { const bx = k.x + i * 8; ctx.moveTo(bx, y0); ctx.lineTo(bx + 4, y1); ctx.lineTo(bx + 8, y0) } ctx.fill();
        });
        if (lv.goal) { const t = Date.now() / 300; ctx.font = '26px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#7df9ff33'; ctx.beginPath(); ctx.arc(lv.goal.x + 12, lv.goal.y + 12, 18 + Math.sin(t) * 2, 0, 7); ctx.fill(); ctx.fillStyle = '#fff'; ctx.fillText('🛡️', lv.goal.x + 12, lv.goal.y + 13) }
        ctx.font = '24px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        movers.forEach(m => ctx.fillText(m.k === 'h' ? '🥷' : m.k === 'u' ? '👾' : '🦠', m.x, m.y + 1));
        if (me.dead === 0 || me.won) {
            ctx.fillStyle = '#1769d2'; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(s.x, s.y, VR.PW, VR.PH, 5) : ctx.rect(s.x, s.y, VR.PW, VR.PH); ctx.fill();
            ctx.fillStyle = '#9be72e'; ctx.fillRect(s.x + 8, s.y - 4, 6, 4);
            ctx.fillStyle = '#7df9ff'; const ex = s.vx < -.5 ? -2 : s.vx > .5 ? 2 : 0; ctx.fillRect(s.x + 4 + ex, s.y + 6, 4, 6); ctx.fillRect(s.x + 14 + ex, s.y + 6, 4, 6);
        }
        parts.forEach(p => { ctx.fillStyle = p.life % 2 ? '#1769d2' : '#7df9ff'; ctx.fillRect(p.x, p.y, 5, 5) });
    };
    let last = performance.now(), acc = 0;
    const loop = t => {
        if (g !== me) return;
        acc += Math.min(60, t - last); last = t;
        while (acc >= 1000 / 60) { tick(); acc -= 1000 / 60 }
        draw(); me.raf = requestAnimationFrame(loop);
    };
    me.raf = requestAnimationFrame(loop);
}
