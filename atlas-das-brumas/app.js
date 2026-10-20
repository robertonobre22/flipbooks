
(() => {
  'use strict';

  const D = window.ATLAS_DOMINIOS;
  const $ = s => document.querySelector(s);
  const stage = $('#bookStage');

  let page = 0;

  const characters = [
    'Lloyd',
    'Aunilan',
    'Kaelion',
    'Ireena',
    'Valerius'
  ];

  const KEY = 'atlasBrumas_v1';

  let f = {
    character: '',
    player: '',
    domains: [],
    style: '',
    expectation: '',
    desired: '',
    relationship: '',
    mystery: '',
    fears: '',
    after: '',
    themes: '',
    boundaries: ''
  };

  try {
    f = {
      ...f,
      ...JSON.parse(localStorage.getItem(KEY) || '{}')
    };
  } catch (e) {}

  const pages = [
    'Capa',
    'Carta aos viajantes',
    'Os sete domínios',
    ...D.map(d => d.nome),
    'Suas escolhas nas Brumas',
    'O Livro dos Destinos',
    'Sua carta ao Mestre'
  ];

  const escapeHTML = s =>
    String(s ?? '').replace(
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
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  function menu() {
    const m = $('#menu');

    m.innerHTML = pages.map((p, i) => `
      <button
        type="button"
        data-page="${i}"
        ${i === page ? 'aria-current="page"' : ''}
      >
        ${String(i + 1).padStart(2, '0')} · ${escapeHTML(p)}
      </button>
    `).join('');

    m.querySelectorAll('button').forEach(x =>
      x.addEventListener('click', () => {
        goto(+x.dataset.page);
        $('#sumario').classList.remove('show');
        $('#tocToggle').setAttribute('aria-expanded', 'false');
      })
    );
  }

  function shell(title, content, eyebrow = 'ATLAS DAS BRUMAS') {
    return `
      <div class="fullpage">
        <div class="eyebrow">${eyebrow}</div>
        <h1>${title}</h1>
        ${content}
      </div>
    `;
  }

  function render() {
    const d = page - 3;
    let html = '';

    // CAPA

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

          <button class="cta" id="start" type="button">
            Abrir o atlas →
          </button>
        </div>
      `;
    }

    // CARTA AOS VIAJANTES

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

          <button class="cta" id="start" type="button">
            Conhecer os domínios →
          </button>
        `
      );
    }

    // ÍNDICE DOS SETE DOMÍNIOS
    // CORREÇÃO: CARTÕES CLICÁVEIS

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
              <a
                class="domain-mini"
                href="#pagina-${i + 4}"
                data-domain-page="${i + 3}"
                style="
                  text-decoration:none;
                  color:inherit;
                  cursor:pointer;
                "
                aria-label="Conhecer o domínio de ${escapeHTML(x.nome)}"
              >
                <img
                  src="assets/${x.id}.webp"
                  loading="lazy"
                  alt="Ilustração de ${escapeHTML(x.nome)}"
                >

                <div>
                  <strong>${escapeHTML(x.nome)}</strong>
                  <span>${escapeHTML(x.genero)}</span>
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

    // PÁGINAS INDIVIDUAIS DOS DOMÍNIOS

    else if (d >= 0 && d < D.length) {
      const x = D[d];

      html = `
        <div class="spread">

          <div class="illustration">
            <img
              src="assets/${x.id}.webp"
              alt="Paisagem fantástica de ${escapeHTML(x.nome)}"
            >
          </div>

          <article class="paper">

            <div class="eyebrow">
              DOMÍNIO ${String(d + 1).padStart(2, '0')}
              · ${escapeHTML(x.genero)}
            </div>

            <h1>${escapeHTML(x.nome)}</h1>

            <p>
              <strong>${escapeHTML(x.subtitulo)}.</strong>
              ${escapeHTML(x.descricao)}
            </p>

            <h2>Atmosfera e temas</h2>

            <ul>
              ${x.temas.map(t => `
                <li>${escapeHTML(t)}</li>
              `).join('')}
            </ul>

            <h2>Tipos de aventura</h2>

            <ul>
              ${x.aventuras.map(t => `
                <li>${escapeHTML(t)}</li>
              `).join('')}
            </ul>

            <div class="quote">
              <strong>Uma pergunta para seu personagem</strong>
              <p>${escapeHTML(x.pergunta)}</p>
            </div>

          </article>

        </div>
      `;
    }

    // ESCOLHAS DOS DOMÍNIOS

    else if (page === 10) {
      html = `
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
                  <option
                    value="${s}"
                    ${f.character === s ? 'selected' : ''}
                  >
                    ${s}
                  </option>
                `).join('')}
              </select>
            </div>

            <div class="field">
              <label for="player">
                Nome do jogador (opcional)
              </label>

              <input
                id="player"
                value="${escapeHTML(f.player)}"
                placeholder="Seu nome"
              >
            </div>

          </div>

          <div class="form-section">

            <h2>
              Quais domínios mais despertam sua curiosidade?
            </h2>

            <div class="options">
              ${D.map(x => `
                <label class="option">
                  <input
                    type="checkbox"
                    data-domain="${x.id}"
                    ${f.domains.includes(x.id) ? 'checked' : ''}
                    ${
                      f.domains.length >= 3 &&
                      !f.domains.includes(x.id)
                        ? 'disabled'
                        : ''
                    }
                  >
                  ${escapeHTML(x.nome)}
                </label>
              `).join('')}
            </div>

            <p class="hint" id="domainCount">
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
              ].map(v => `
                <label class="option">
                  <input
                    type="radio"
                    name="style"
                    value="${v[0]}"
                    ${f.style === v[0] ? 'checked' : ''}
                  >
                  ${v[1]}
                </label>
              `).join('')}
            </div>

            <div class="field">
              <label for="expectation">
                O que você mais gostaria de viver
                na próxima fase? (opcional)
              </label>

              <textarea id="expectation">${escapeHTML(f.expectation)}</textarea>
            </div>

          </div>

          <button class="cta" id="nextForm" type="button">
            Continuar para o Livro dos Destinos →
          </button>

        </div>
      `;
    }

    // PERGUNTAS SOBRE OS PERSONAGENS

    else if (page === 11) {
      html = `
        <div class="formshell">

          <div class="eyebrow">
            O LIVRO DOS DESTINOS · II
          </div>

          <h1>O que ainda resta viver?</h1>

          <p class="form-intro">
            Responda apenas ao que fizer sentido.
            Você pode compartilhar detalhes em particular
            com o Mestre. O destino do personagem ainda será
            construído durante o jogo.
          </p>

          ${[
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
          ].map(([id, q]) => `
            <div class="field">

              <label for="${id}">
                ${q}
              </label>

              <textarea
                id="${id}"
                placeholder="Escreva aqui, se desejar"
              >${escapeHTML(f[id])}</textarea>

            </div>
          `).join('')}

          <button class="cta" id="nextForm" type="button">
            Preparar minha carta ao Mestre →
          </button>

        </div>
      `;
    }

    // CARTA FINAL AO MESTRE

    else {
      html = `
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

            <pre
              id="preview"
              style="
                white-space:pre-wrap;
                line-height:1.55;
                font:1rem Georgia;
                background:#fff8e8;
                border:1px solid #b99871;
                padding:20px;
                max-height:480px;
                overflow:auto;
              "
            ></pre>

          </div>

          <div class="action-row">

            <button
              class="action"
              id="downloadTxt"
              type="button"
            >
              ↓ Baixar TXT
            </button>

            <button
              class="action secondary"
              id="copyText"
              type="button"
            >
              Copiar para WhatsApp
            </button>

            <button
              class="action secondary"
              id="printPdf"
              type="button"
            >
              Imprimir / Salvar PDF
            </button>

          </div>

          <p
            id="confirmation"
            class="confirmation"
            role="status"
          ></p>

          <p class="hint">
            O arquivo TXT pode ser anexado a uma conversa.
            Nenhuma resposta é enviada automaticamente.
          </p>

        </div>
      `;
    }

    // EXIBIR PÁGINA

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

    // NAVEGAÇÃO DOS CARTÕES DOS DOMÍNIOS

    if (page === 2) {
      stage.querySelectorAll('[data-domain-page]').forEach(card => {
        card.addEventListener('click', e => {
          e.preventDefault();
          goto(Number(card.dataset.domainPage));
        });
      });
    }

    // NAVEGAÇÃO DOS BOTÕES INTERNOS

    const start = $('#start');

    if (start) {
      start.onclick = () => goto(page + 1);
    }

    const next = $('#nextForm');

    if (next) {
      next.onclick = () => goto(page + 1);
    }

    // SALVAR ESCOLHAS

    if (page === 10) {

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

      document.querySelectorAll('[data-domain]').forEach(c => {
        c.onchange = e => {
          const id = e.target.dataset.domain;

          f.domains = e.target.checked
            ? [...f.domains, id].slice(0, 3)
            : f.domains.filter(x => x !== id);

          save();
          render();
        };
      });

      document.querySelectorAll('[name="style"]').forEach(c => {
        c.onchange = e => {
          f.style = e.target.value;
          save();
        };
      });
    }

    // SALVAR RESPOSTAS DO LIVRO DOS DESTINOS

    if (page === 11) {
      [
        'desired',
        'relationship',
        'mystery',
        'fears',
        'after',
        'themes',
        'boundaries'
      ].forEach(id => {
        $('#' + id).oninput = e => {
          f[id] = e.target.value;
          save();
        };
      });
    }

    // EXPORTAÇÃO DA CARTA AO MESTRE

    if (page === 12) {

      $('#preview').textContent = exportText();

      $('#downloadTxt').onclick = download;

      $('#copyText').onclick = async () => {
        try {
          await navigator.clipboard.writeText(exportText());

          $('#confirmation').textContent =
            'Respostas copiadas! Agora cole na conversa com o Mestre.';
        } catch (e) {
          $('#confirmation').textContent =
            'Não foi possível copiar automaticamente neste navegador. Use Baixar TXT.';
        }
      };

      $('#printPdf').onclick = () => {
        const win = window.open('', '_blank');

        if (!win) {
          $('#confirmation').textContent =
            'Permita a abertura de janelas para imprimir.';
          return;
        }

        win.document.write(
          '<!doctype html>' +
          '<html lang="pt-BR">' +
          '<meta charset="utf-8">' +
          '<title>Carta ao Mestre</title>' +
          '<style>' +
          'body{font:16px Georgia;padding:30px;line-height:1.5}' +
          'pre{font:16px Georgia;white-space:pre-wrap}' +
          '</style>' +
          '<h1>Carta ao Mestre — Atlas das Brumas</h1>' +
          '<pre>' +
          escapeHTML(exportText()) +
          '</pre>' +
          '</html>'
        );

        win.document.close();
        win.focus();
        win.print();
      };
    }
  }

  // CONSTRUIR TEXTO DAS RESPOSTAS

  function exportText() {
    const val = s => s?.trim() || '(não informado)';

    return [
      'PODERES SOMBRIOS — ATLAS DAS BRUMAS',
      'LIVRO DOS DESTINOS — RESPOSTAS DO JOGADOR',
      '========================================',

      'Personagem: ' + val(f.character),

      'Jogador: ' + val(f.player),

      'Domínios escolhidos: ' +
        (
          f.domains
            .map(x => D.find(d => d.id === x)?.nome)
            .filter(Boolean)
            .join(' > ') ||
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

      'Respostas fornecidas voluntariamente para o planejamento da campanha veterana.'

    ].join('\n');
  }

  // BAIXAR ARQUIVO TXT

  function download() {
    const txt = exportText();

    const blob = new Blob(
      ['\ufeff', txt],
      { type: 'text/plain;charset=utf-8' }
    );

    const url = URL.createObjectURL(blob);
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

  // CONTROLES DE PÁGINA

  ['prevBtn', 'prevBottom'].forEach(id => {
    $('#' + id).onclick = () => goto(page - 1);
  });

  ['nextBtn', 'nextBottom'].forEach(id => {
    $('#' + id).onclick = () => goto(page + 1);
  });

  // MENU LATERAL

  $('#tocToggle').onclick = () => {
    const on = $('#sumario').classList.toggle('show');

    $('#tocToggle').setAttribute(
      'aria-expanded',
      String(on)
    );
  };

  // NAVEGAÇÃO PELO TECLADO

  window.addEventListener('keydown', e => {
    if (
      /INPUT|TEXTAREA|SELECT/.test(
        document.activeElement?.tagName || ''
      )
    ) {
      return;
    }

    if (e.key === 'ArrowRight') {
      goto(page + 1);
    }

    if (e.key === 'ArrowLeft') {
      goto(page - 1);
    }
  });

  // ABRIR PÁGINA INFORMADA NO ENDEREÇO

  const match = location.hash.match(/pagina-(\d+)/);

  if (match) {
    page = Math.max(
      0,
      Math.min(
        pages.length - 1,
        Number(match[1]) - 1
      )
    );
  }

  // INICIAR ATLAS

  render();

})();

