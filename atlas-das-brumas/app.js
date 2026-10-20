
(() => {
  'use strict';

  const D = window.ATLAS_DOMINIOS;
  const $ = s => document.querySelector(s);
  const stage = $('#bookStage');
  const KEY = 'atlasBrumas_v1';

  const characters = [
    'Lloyd', 'Aunilan', 'Kaelion', 'Ireena', 'Valerius'
  ];

  const base = {
    character: '', player: '', domains: [],
    style: '', expectation: '', desired: '',
    relationship: '', mystery: '', fears: '',
    after: '', themes: '', boundaries: ''
  };

  let f = { ...base };

  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
    if (saved && typeof saved === 'object') {
      f = { ...base, ...saved };
    }
  } catch (e) {}

  if (!Array.isArray(f.domains)) f.domains = [];

  const pages = [
    'Capa',
    'Carta aos viajantes',
    'Os sete domínios',
    ...D.map(d => d.nome),
    'Druskenvald — Lendas e desafios',
    'Suas escolhas nas Brumas',
    'O Livro dos Destinos',
    'Sua carta ao Mestre'
  ];

  const legendsPage = 3 + D.length;
  const choicesPage = legendsPage + 1;
  const destinyPage = choicesPage + 1;
  const letterPage = destinyPage + 1;

  let page = 0;

  const esc = s => String(s ?? '').replace(
    /[&<>"']/g,
    c => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[c])
  );

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(f));
    } catch (e) {}
  }

  function goto(n) {
    page = Math.max(0, Math.min(pages.length - 1, n));
    location.hash = 'pagina-' + (page + 1);
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function shell(title, body, eyebrow = 'ATLAS DAS BRUMAS') {
    return `
      <div class="fullpage">
        <div class="eyebrow">${eyebrow}</div>
        <h1>${title}</h1>
        ${body}
      </div>
    `;
  }

  function menu() {
    const m = $('#menu');

    m.innerHTML = pages.map((name, i) => `
      <button type="button" data-page="${i}"
        ${i === page ? 'aria-current="page"' : ''}>
        ${String(i + 1).padStart(2, '0')} · ${esc(name)}
      </button>
    `).join('');

    m.querySelectorAll('[data-page]').forEach(b => {
      b.onclick = () => {
        goto(Number(b.dataset.page));
        $('#sumario').classList.remove('show');
        $('#tocToggle').setAttribute('aria-expanded', 'false');
      };
    });
  }

  function domainPage(x, i) {
    const dr = x.id === 'druskenvald';

    const image = dr
      ? 'assets/druskenvald-abertura.webp'
      : `assets/${x.id}.webp`;

    const introduction = dr
      ? `
        <p>
          <strong>As cantigas que não terminam.</strong>
          Druskenvald é uma terra de contrastes. Matas
          antigas cercam povoados onde as festas atravessam
          gerações, enquanto caminhos de terra se estendem
          por serras, rios e plantações. A hospitalidade é
          uma virtude cultivada há séculos, embora algumas
          casas recebam melhor os desconhecidos do que
          seus próprios vizinhos.
        </p>
        <p>
          Em suas aldeias, as pessoas conhecem histórias
          que preferem não explicar. Crianças aprendem
          parlendas antes de compreender o significado
          das palavras. Famílias preservam costumes cuja
          origem se perdeu, e certas promessas continuam
          sendo cumpridas muito depois da morte de quem
          as fez.
        </p>
        <p>
          A vida segue entre colheitas, celebrações,
          pequenas disputas e antigos compromissos.
          Entretanto, quando os sinos anunciam a noite,
          há estradas que deixam de ser percorridas e
          perguntas que ninguém se dispõe a responder.
        </p>
      `
      : `
        <p>
          <strong>${esc(x.subtitulo)}.</strong>
          ${esc(x.descricao)}
        </p>
      `;

    return `
      <div class="spread">
        <div class="illustration">
          <img src="${image}"
            alt="Ilustração de ${esc(x.nome)}">
        </div>

        <article class="paper">
          <div class="eyebrow">
            DOMÍNIO ${String(i + 1).padStart(2, '0')}
            · ${esc(x.genero)}
          </div>

          <h1>${esc(x.nome)}</h1>

          ${introduction}

          <h2>Atmosfera e temas</h2>
          <ul>
            ${x.temas.map(t => `
              <li>${esc(t)}</li>
            `).join('')}
          </ul>

          <h2>Tipos de aventura</h2>
          <ul>
            ${x.aventuras.map(t => `
              <li>${esc(t)}</li>
            `).join('')}
          </ul>

          <div class="quote">
            <strong>Uma pergunta para seu personagem</strong>
            <p>${esc(x.pergunta)}</p>
          </div>
        </article>
      </div>
    `;
  }

  const legends = [
    [
      'O Corpo-Seco',
      'corpo-seco.png',
      `Dizem que existem mortos que a própria terra se
      recusa a receber. Ninguém concorda inteiramente
      sobre o motivo. Quando as árvores secam sem razão
      e o chão parece endurecer sob os pés, certos
      moradores preferem mudar de caminho.`
    ],
    [
      'As Três Comadres',
      'tres-comadres.png',
      `Três mulheres, três maneiras de conhecer o mundo
      e inúmeras histórias sobre favores concedidos,
      caminhos revelados e segredos preservados.
      Alguns viajantes lhes devem a vida. Outros
      aprenderam que nem toda dívida pode ser paga
      com dinheiro.`
    ],
    [
      'A Mula sem Cabeça',
      'mula-sem-cabeca.png',
      `Nas noites em que o silêncio parece mais profundo,
      o galope de uma criatura envolta em fogo atravessa
      as estradas. Onde deveria haver uma cabeça,
      há somente chamas. Muitos conhecem a lenda;
      poucos se perguntam quem está condenado a vivê-la.`
    ],
    [
      'O Bode Preto',
      'bode-preto.png',
      `Nas encruzilhadas, fala-se de um bode que aparece
      quando alguém precisa desesperadamente de alguma
      coisa. Há quem jure ter recebido sua ajuda.
      Essas mesmas pessoas raramente explicam
      o que aconteceu depois.`
    ],
    [
      'O Auto do Boi das Sombras',
      'auto-do-boi.png',
      `Uma antiga celebração reúne música, máscaras,
      dança e a memória de um boi extraordinário.
      Para alguns, é a festa mais importante do ano.
      Para outros, os preparativos começam cedo demais,
      e a alegria parece depender de coisas sobre
      as quais ninguém deseja conversar.`
    ]
  ];

  function legendsHTML() {
    return shell(
      'Lendas e desafios das veredas',
      `
        <p>
          Em Druskenvald, cada aldeia conhece sua própria
          versão dos acontecimentos. Algumas histórias são
          transmitidas como advertências; outras, como
          cantigas, orações ou simples causos contados
          à beira do fogo. Nem sempre duas pessoas
          concordam sobre aquilo que viram.
        </p>

        <div class="druskenvald-vinhetas">
          ${legends.map(([name, image, desc]) => `
            <article class="druskenvald-vinheta">
              <a href="assets/${image}"
                target="_blank"
                rel="noopener"
                aria-label="Ampliar ilustração de ${esc(name)}">
                <img src="assets/${image}"
                  loading="lazy"
                  alt="${esc(name)}">
              </a>
              <div>
                <h2>${esc(name)}</h2>
                <p>${esc(desc)}</p>
              </div>
            </article>
          `).join('')}
        </div>

        <div class="quote">
          As histórias mudam conforme a voz que as conta.
          O que permanece é aquilo que seus ouvintes
          escolhem fazer depois.
        </div>
      `,
      'DRUSKENVALD · HISTÓRIAS DAS VEREDAS'
    );
  }

  function choicesHTML() {
    return `
      <div class="formshell">
        <div class="eyebrow">
          O LIVRO DOS DESTINOS · I
        </div>

        <h1>Suas escolhas nas Brumas</h1>

        <p class="form-intro">
          Escolha até <strong>três domínios</strong>.
          Estas preferências ajudam a planejar a jornada,
          mas não determinam sozinhas o que acontecerá.
          Suas respostas ficam salvas neste navegador
          e podem ser baixadas no final.
        </p>

        <div class="form-section">
          <h2>Qual personagem você interpreta?</h2>

          <div class="field">
            <label for="character">Personagem</label>
            <select id="character">
              <option value="">Selecione...</option>
              ${characters.map(s => `
                <option value="${esc(s)}"
                  ${f.character === s ? 'selected' : ''}>
                  ${esc(s)}
                </option>
              `).join('')}
            </select>
          </div>

          <div class="field">
            <label for="player">
              Nome do jogador (opcional)
            </label>
            <input id="player"
              value="${esc(f.player)}"
              placeholder="Seu nome">
          </div>
        </div>

        <div class="form-section">
          <h2>
            Quais domínios mais despertam sua curiosidade?
          </h2>

          <div class="options">
            ${D.map(x => `
              <label class="option">
                <input type="checkbox"
                  data-domain="${x.id}"
                  ${f.domains.includes(x.id) ? 'checked' : ''}
                  ${f.domains.length >= 3 &&
                    !f.domains.includes(x.id) ? 'disabled' : ''}>
                ${esc(x.nome)}
              </label>
            `).join('')}
          </div>

          <p class="hint">
            ${f.domains.length} de 3 selecionados.
          </p>
        </div>

        <div class="form-section">
          <h2>Que tipo de história você prefere?</h2>

          <div class="options">
            ${[
              ['investigação', 'Mistérios e investigação'],
              ['interpretação', 'Interpretação e relações'],
              ['combate', 'Combates e estratégia'],
              ['dilemas', 'Dilemas morais'],
              ['equilíbrio', 'Um pouco de tudo']
            ].map(([v, label]) => `
              <label class="option">
                <input type="radio" name="style"
                  value="${v}"
                  ${f.style === v ? 'checked' : ''}>
                ${label}
              </label>
            `).join('')}
          </div>

          <div class="field">
            <label for="expectation">
              O que você mais gostaria de viver
              na próxima fase? (opcional)
            </label>
            <textarea id="expectation">${esc(f.expectation)}</textarea>
          </div>
        </div>

        <button class="cta" id="nextForm" type="button">
          Continuar para o Livro dos Destinos →
        </button>
      </div>
    `;
  }

  const questions = [
    [
      'desired',
      'O que seu personagem ainda deseja conquistar?'
    ],
    [
      'relationship',
      'Existe alguém que gostaria de reencontrar, salvar, perdoar ou confrontar?'
    ],
    [
      'mystery',
      'Qual mistério de seu passado gostaria de compreender?'
    ],
    [
      'fears',
      'Que tipo de pessoa teme se tornar ao adquirir tanto poder?'
    ],
    [
      'after',
      'Se sobrevivesse a tudo isso, como gostaria de viver depois?'
    ],
    [
      'themes',
      'Que cenas, relações ou transformações gostaria de explorar?'
    ],
    [
      'boundaries',
      'Há assuntos que prefere evitar ou tratar com cuidado? (opcional e confidencial ao Mestre)'
    ]
  ];

  function destinyHTML() {
    return `
      <div class="formshell">
        <div class="eyebrow">
          O LIVRO DOS DESTINOS · II
        </div>

        <h1>O que ainda resta viver?</h1>

        <p class="form-intro">
          Responda apenas ao que fizer sentido.
          Você pode compartilhar detalhes em particular
          com o Mestre. O destino do personagem ainda
          será construído durante o jogo.
        </p>

        ${questions.map(([id, q]) => `
          <div class="field">
            <label for="${id}">${esc(q)}</label>
            <textarea id="${id}"
              placeholder="Escreva aqui, se desejar"
            >${esc(f[id])}</textarea>
          </div>
        `).join('')}

        <button class="cta" id="nextForm" type="button">
          Preparar minha carta ao Mestre →
        </button>
      </div>
    `;
  }

  function letterHTML() {
    return `
      <div class="formshell">
        <div class="eyebrow">
          SEU REGISTRO PESSOAL
        </div>

        <h1>A Carta ao Mestre</h1>

        <p class="form-intro">
          Suas respostas ficam apenas neste dispositivo.
          Para enviá-las, baixe o arquivo ou copie o texto
          e compartilhe diretamente com o Mestre.
        </p>

        <div class="form-section">
          <h2>Prévia das respostas</h2>
          <pre id="preview" style="
            white-space:pre-wrap;
            line-height:1.55;
            font:1rem Georgia;
            background:#fff8e8;
            border:1px solid #b99871;
            padding:20px;
            max-height:480px;
            overflow:auto"></pre>
        </div>

        <div class="action-row">
          <button class="action"
            id="downloadTxt"
            type="button">↓ Baixar TXT</button>

          <button class="action secondary"
            id="copyText"
            type="button">Copiar para WhatsApp</button>

          <button class="action secondary"
            id="printPdf"
            type="button">Imprimir / Salvar PDF</button>
        </div>

        <p id="confirmation"
          class="confirmation"
          role="status"></p>

        <p class="hint">
          O arquivo TXT pode ser anexado a uma conversa.
          Nenhuma resposta é enviada automaticamente.
        </p>
      </div>
    `;
  }

  function exportText() {
    const val = s =>
      String(s ?? '').trim() || '(não informado)';

    return [
      'PODERES SOMBRIOS — ATLAS DAS BRUMAS',
      'LIVRO DOS DESTINOS — RESPOSTAS DO JOGADOR',
      '========================================',
      'Personagem: ' + val(f.character),
      'Jogador: ' + val(f.player),
      'Domínios escolhidos: ' +
        (
          f.domains.map(id =>
            D.find(d => d.id === id)?.nome
          ).filter(Boolean).join(' > ') ||
          '(nenhum selecionado)'
        ),
      'Tipo de aventura: ' + val(f.style),
      'O que deseja viver: ' + val(f.expectation),
      '',
      'O QUE AINDA RESTA VIVER?',
      'Desejo: ' + val(f.desired),
      'Relações: ' + val(f.relationship),
      'Mistérios: ' + val(f.mystery),
      'Medos e limites morais: ' + val(f.fears),
      'Vida após a jornada: ' + val(f.after),
      'Experiências desejadas: ' + val(f.themes),
      'Temas a evitar ou tratar com cuidado: ' +
        val(f.boundaries),
      '',
      'Respostas fornecidas voluntariamente para ' +
      'o planejamento da campanha veterana.'
    ].join('\n');
  }

  function download() {
    const b = new Blob(
      ['\ufeff', exportText()],
      { type: 'text/plain;charset=utf-8' }
    );

    const url = URL.createObjectURL(b);
    const a = document.createElement('a');

    a.href = url;
    a.download =
      'Poderes_Sombrios_Destino_' +
      (f.character || 'Jogador')
        .replace(/[^a-zA-Z0-9_-]/g, '_') +
      '.txt';

    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);

    $('#confirmation').textContent =
      'Arquivo TXT criado. Envie-o ao Mestre pelo WhatsApp.';
  }

  function render() {
    let html = '';

    if (page === 0) {
      html = `
        <div class="fullpage coverpage">
          <div class="eyebrow">
            PODERES SOMBRIOS · NÍVEIS 13–20
          </div>
          <h1>Atlas das Brumas</h1>
          <h2>Os Caminhos do Pavor</h2>
          <p>
            Sete domínios. Inúmeras histórias.
            O próximo caminho também depende de vocês.
          </p>
          <button class="cta"
            id="start"
            type="button">
            Abrir o atlas →
          </button>
        </div>
      `;
    }

    else if (page === 1) {
      html = shell(
        'Uma carta além das Brumas',
        `
          <p>
            Para <strong>Lloyd, Aunilan, Kaelion,
            Ireena e Valerius</strong>.
          </p>

          <p>
            Vocês caminharam por Baróvia, conheceram seus
            horrores e fizeram escolhas cujas consequências
            ainda pertencem à história. Se houver um amanhã
            além da campanha que agora se aproxima do fim,
            outros caminhos poderão se abrir nas Brumas.
          </p>

          <p>
            Este atlas apresenta possibilidades para a
            próxima etapa, entre os níveis 13 e 20.
            Não contém respostas aos mistérios que cada
            território guarda. Apresenta apenas os tipos
            de horror e as histórias que vocês poderão
            encontrar.
          </p>

          <p>
            <strong>Vocês não precisam ler tudo.</strong>
            Explorem as imagens, escolham até três domínios
            que despertem interesse e contem ao Mestre
            o que desejam viver com seus personagens.
          </p>

          <p>
            As respostas serão convites à criação,
            jamais garantias sobre o destino de alguém.
          </p>

          <button class="cta"
            id="start"
            type="button">
            Conhecer os domínios →
          </button>
        `
      );
    }

    else if (page === 2) {
      html = shell(
        'As faces do pavor',
        `
          <p>
            Cada domínio tem sua própria identidade.
            Escolham pelo que mais desperta curiosidade —
            e não pelo que parece mais fácil de vencer.
          </p>

          <div class="domain-grid">
            ${D.map((x, i) => `
              <a class="domain-mini"
                href="#pagina-${i + 4}"
                data-domain-page="${i + 3}"
                style="
                  text-decoration:none;
                  color:inherit;
                  cursor:pointer"
                aria-label="Conhecer ${esc(x.nome)}">

                <img src="assets/${x.id}.webp"
                  loading="lazy"
                  alt="Ilustração de ${esc(x.nome)}">

                <div>
                  <strong>${esc(x.nome)}</strong>
                  <span>${esc(x.genero)}</span>
                </div>
              </a>
            `).join('')}
          </div>

          <p>
            As aventuras podem conter investigação,
            interpretação, exploração e confrontos
            épicos em proporções diferentes.
          </p>
        `
      );
    }

    else if (page >= 3 && page < 3 + D.length) {
      html = domainPage(D[page - 3], page - 3);
    }

    else if (page === legendsPage) {
      html = legendsHTML();
    }

    else if (page === choicesPage) {
      html = choicesHTML();
    }

    else if (page === destinyPage) {
      html = destinyHTML();
    }

    else if (page === letterPage) {
      html = letterHTML();
    }

    stage.innerHTML = html;

    stage.style.animation = 'none';
    void stage.offsetWidth;
    stage.style.animation = 'turn .22s ease';

    $('#pageCount').textContent =
      `${page + 1} / ${pages.length}`;

    ['prevBtn', 'prevBottom'].forEach(id => {
      $('#' + id).disabled = page === 0;
    });

    ['nextBtn', 'nextBottom'].forEach(id => {
      $('#' + id).disabled = page === pages.length - 1;
    });

    menu();

    stage.querySelectorAll('[data-domain-page]').forEach(a => {
      a.onclick = e => {
        e.preventDefault();
        goto(Number(a.dataset.domainPage));
      };
    });

    if ($('#start')) {
      $('#start').onclick = () => goto(page + 1);
    }

    if ($('#nextForm')) {
      $('#nextForm').onclick = () => goto(page + 1);
    }

    if (page === choicesPage) {
      $('#character').onchange = e => {
        f.character = e.target.value;
        save();
      };

      $('#player').oninput = e => {
        f.player = e.target.value;
        save();
      };

      $('#expectation').oninput = e => {
        f.expectation = e.target.value;
        save();
      };

      stage.querySelectorAll('[data-domain]').forEach(box => {
        box.onchange = e => {
          const id = e.target.dataset.domain;

          f.domains = e.target.checked
            ? [...f.domains, id].slice(0, 3)
            : f.domains.filter(x => x !== id);

          save();
          render();
        };
      });

      stage.querySelectorAll('[name="style"]').forEach(box => {
        box.onchange = e => {
          f.style = e.target.value;
          save();
        };
      });
    }

    if (page === destinyPage) {
      questions.forEach(([id]) => {
        $('#' + id).oninput = e => {
          f[id] = e.target.value;
          save();
        };
      });
    }

    if (page === letterPage) {
      $('#preview').textContent = exportText();
      $('#downloadTxt').onclick = download;

      $('#copyText').onclick = async () => {
        try {
          await navigator.clipboard.writeText(exportText());

          $('#confirmation').textContent =
            'Respostas copiadas! Agora cole na conversa com o Mestre.';
        } catch (e) {
          $('#confirmation').textContent =
            'Não foi possível copiar automaticamente. Use Baixar TXT.';
        }
      };

      $('#printPdf').onclick = () => {
        const w = window.open('', '_blank');

        if (!w) {
          $('#confirmation').textContent =
            'Permita a abertura de janelas para imprimir.';
          return;
        }

        w.document.write(
          '<!doctype html><html lang="pt-BR">' +
          '<meta charset="utf-8">' +
          '<title>Carta ao Mestre</title>' +
          '<style>body{font:16px Georgia;padding:30px;' +
          'line-height:1.5}pre{font:16px Georgia;' +
          'white-space:pre-wrap}</style>' +
          '<h1>Carta ao Mestre — Atlas das Brumas</h1>' +
          '<pre>' + esc(exportText()) + '</pre></html>'
        );

        w.document.close();
        w.focus();
        w.print();
      };
    }
  }

  ['prevBtn', 'prevBottom'].forEach(id => {
    $('#' + id).onclick = () => goto(page - 1);
  });

  ['nextBtn', 'nextBottom'].forEach(id => {
    $('#' + id).onclick = () => goto(page + 1);
  });

  $('#tocToggle').onclick = () => {
    const on = $('#sumario').classList.toggle('show');

    $('#tocToggle').setAttribute(
      'aria-expanded', String(on)
    );
  };

  window.addEventListener('keydown', e => {
    if (/INPUT|TEXTAREA|SELECT/.test(
      document.activeElement?.tagName || ''
    )) return;

    if (e.key === 'ArrowRight') goto(page + 1);
    if (e.key === 'ArrowLeft') goto(page - 1);
  });

  const match = location.hash.match(/pagina-(\d+)/);

  if (match) {
    page = Math.max(
      0,
      Math.min(pages.length - 1, Number(match[1]) - 1)
    );
  }

  render();
})();

// Aparência das cinco ilustrações de Druskenvald
(() => {
  const style = document.createElement('style');

  style.textContent = `
    .druskenvald-vinhetas {
      display:grid;
      grid-template-columns:1fr;
      gap:14px;
      margin:26px 0;
    }

    .druskenvald-vinheta {
      display:grid;
      grid-template-columns:minmax(130px,28%) 1fr;
      gap:20px;
      align-items:center;
      padding:14px;
      background:#f2dfb9;
      border:1px solid #b68c5e;
      box-shadow:0 2px 8px #52371916;
    }

    .druskenvald-vinheta img {
      display:block;
      width:100%;
      height:auto;
      aspect-ratio:1/1;
      object-fit:contain;
      object-position:center;
      background:#241c1a;
      border:2px solid #78523c;
    }

    .druskenvald-vinheta h2 {
      color:#702732;
      font-size:clamp(1.15rem,2.2vw,1.6rem);
      margin:0 0 8px;
    }

    .druskenvald-vinheta p {
      font-size:clamp(1rem,1.3vw,1.1rem);
      line-height:1.55;
      margin:0;
    }

    @media (max-width:600px) {
      .druskenvald-vinheta {
        grid-template-columns:1fr;
        gap:10px;
      }

      .druskenvald-vinheta img {
        max-height:300px;
      }

      .druskenvald-vinheta h2 {
        margin:5px 0;
      }
    }
  `;

  document.head.appendChild(style);
})();
