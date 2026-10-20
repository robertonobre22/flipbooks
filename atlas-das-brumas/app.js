
(() => {
  'use strict';

  const D = window.ATLAS_DOMINIOS;
  const $ = s => document.querySelector(s);
  const stage = $('#bookStage');
  const characters = [
    'Lloyd', 'Aunilan', 'Kaelion', 'Ireena', 'Valerius'
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
    const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
    if (saved && typeof saved === 'object') {
      f = { ...f, ...saved };
    }
  } catch (e) {}

  if (!Array.isArray(f.domains)) f.domains = [];

  const domainStart = 3;
  const druskenvaldIndex = D.findIndex(x => x.id === 'druskenvald');
  const druskenvaldPage = domainStart + druskenvaldIndex;

  const pages = [
    'Capa',
    'Carta aos viajantes',
    'Os sete domínios',
    ...D.map(d => d.nome),
    'Druskenvald — O domínio',
    'Druskenvald — Lendas e desafios',
    'Suas escolhas nas Brumas',
    'O Livro dos Destinos',
    'Sua carta ao Mestre'
  ];

  const choicesPage = pages.length - 3;
  const destinyPage = pages.length - 2;
  const letterPage = pages.length - 1;

  let page = 0;

  const escapeHTML = value =>
    String(value ?? '').replace(/[&<>"']/g, c => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[c]));

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

  function menu() {
    const m = $('#menu');

    m.innerHTML = pages.map((name, i) => `
      <button type="button"
        data-page="${i}"
        ${i === page ? 'aria-current="page"' : ''}>
        ${String(i + 1).padStart(2, '0')} · ${escapeHTML(name)}
      </button>
    `).join('');

    m.querySelectorAll('[data-page]').forEach(button => {
      button.onclick = () => {
        goto(Number(button.dataset.page));
        $('#sumario').classList.remove('show');
        $('#tocToggle').setAttribute('aria-expanded', 'false');
      };
    });
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

  function ordinaryDomain(x, index) {
    return `
      <div class="spread">
        <div class="illustration">
          <img src="assets/${x.id}.webp"
            alt="Paisagem de ${escapeHTML(x.nome)}">
        </div>
        <article class="paper">
          <div class="eyebrow">
            DOMÍNIO ${String(index + 1).padStart(2, '0')}
            · ${escapeHTML(x.genero)}
          </div>
          <h1>${escapeHTML(x.nome)}</h1>
          <p>
            <strong>${escapeHTML(x.subtitulo)}.</strong>
            ${escapeHTML(x.descricao)}
          </p>
          <h2>Atmosfera e temas</h2>
          <ul>${x.temas.map(t =>
            `<li>${escapeHTML(t)}</li>`
          ).join('')}</ul>
          <h2>Tipos de aventura</h2>
          <ul>${x.aventuras.map(t =>
            `<li>${escapeHTML(t)}</li>`
          ).join('')}</ul>
          <div class="quote">
            <strong>Uma pergunta para seu personagem</strong>
            <p>${escapeHTML(x.pergunta)}</p>
          </div>
        </article>
      </div>
    `;
  }

  function druskenvaldOpening() {
    return `
      <div class="fullpage druskenvald-opening"
        style="padding:clamp(20px,4vw,42px);text-align:center">
        <div class="eyebrow">
          ATLAS DAS BRUMAS · DOMÍNIO 07
        </div>
        <h1>Druskenvald</h1>
        <h2>As cantigas que não terminam</h2>
        <p style="margin:12px auto">
          <em>
            Horror folclórico brasileiro · Causos ·
            Promessas · Assombrações
          </em>
        </p>

        <img
          src="assets/druskenvald-abertura.webp"
          alt="Abertura ilustrada de Druskenvald"
          style="display:block;width:100%;height:auto;
          max-width:800px;margin:22px auto;
          border:1px solid #977049">

        <div style="max-width:740px;margin:0 auto;text-align:left">
          <p>
            Existem lugares onde as histórias sobrevivem
            àqueles que as contam.
          </p>
          <p>
            Em Druskenvald, as estradas atravessam matas
            antigas, aldeias celebram festas cujas origens
            ninguém recorda inteiramente, e cantigas
            infantis guardam palavras que os adultos
            aprenderam a não repetir.
          </p>
          <p>
            Ao cair da noite, o som de um assobio pode fazer
            uma casa inteira fechar suas janelas. Há quem
            deixe uma vela acesa para os viajantes.
            Outros deixam a porta entreaberta para alguém
            que jamais deveria voltar.
          </p>
          <p>
            Sob a Lua Torta, toda promessa encontra um
            caminho de volta.
          </p>
          <div class="quote">
            Há histórias que se contam para lembrar.
            Outras, para impedir que alguma coisa
            seja esquecida.
          </div>
        </div>
      </div>
    `;
  }

  function druskenvaldDomain() {
    return shell(
      'Druskenvald',
      `
        <h2>Uma terra de promessas antigas</h2>
        <p>
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

        <h2>Atmosfera e temas</h2>
        <ul>
          <li>Lendas brasileiras e assombrações nas estradas.</li>
          <li>Parlendas, presságios e segredos familiares.</li>
          <li>Festas populares, promessas e tradições antigas.</li>
          <li>Culpa, pertencimento e coragem de romper o silêncio.</li>
        </ul>

        <h2>Tipos de aventura</h2>
        <ul>
          <li>Investigar causos e desaparecimentos nas aldeias.</li>
          <li>Atravessar matas e caminhos que mudam durante a noite.</li>
          <li>Descobrir os segredos por trás de festas e promessas.</li>
          <li>Proteger pessoas e decidir quais tradições merecem sobreviver.</li>
        </ul>

        <div class="quote">
          <strong>Uma pergunta para seu personagem</strong>
          <p>
            Você quebraria uma tradição que mantém sua
            comunidade viva se descobrisse quem paga por ela?
          </p>
        </div>
      `,
      'DOMÍNIO 07 · HORROR FOLCLÓRICO'
    );
  }

  function druskenvaldLegends() {
    const legends = [
      [
        'O Corpo-Seco',
        `Dizem que existem mortos que a própria terra se
        recusa a receber. Ninguém concorda inteiramente
        sobre o motivo. Quando as árvores secam sem razão
        e o chão parece endurecer sob os pés, certos
        moradores preferem mudar de caminho.`
      ],
      [
        'As Três Comadres',
        `Três mulheres, três maneiras de conhecer o mundo
        e inúmeras histórias sobre favores concedidos,
        caminhos revelados e segredos preservados.
        Alguns viajantes lhes devem a vida. Outros
        aprenderam que nem toda dívida pode ser paga
        com dinheiro.`
      ],
      [
        'A Mula sem Cabeça',
        `Nas noites em que o silêncio parece mais profundo,
        o galope de uma criatura envolta em fogo atravessa
        as estradas. Onde deveria haver uma cabeça, há
        somente chamas. Muitos conhecem a lenda; poucos
        se perguntam quem está condenado a vivê-la.`
      ],
      [
        'O Bode Preto',
        `Nas encruzilhadas, fala-se de um bode que aparece
        quando alguém precisa desesperadamente de alguma
        coisa. Há quem jure ter recebido sua ajuda.
        Essas mesmas pessoas raramente explicam
        o que aconteceu depois.`
      ],
      [
        'O Auto do Boi das Sombras',
        `Uma antiga celebração reúne música, máscaras,
        dança e a memória de um boi extraordinário.
        Para alguns, é a festa mais importante do ano.
        Para outros, os preparativos começam cedo demais,
        e a alegria parece depender de coisas sobre as
        quais ninguém deseja conversar.`
      ]
    ];

    return shell(
      'Lendas e desafios das veredas',
      `
        <h2>Cinco histórias que ainda são contadas</h2>
        <p>
          Em Druskenvald, cada aldeia conhece sua própria
          versão dos acontecimentos. Algumas histórias
          são transmitidas como advertências; outras,
          como cantigas, orações ou simples causos
          contados à beira do fogo. Nem sempre duas
          pessoas concordam sobre aquilo que viram.
        </p>

        <div class="druskenvald-legends"
          style="max-width:800px;margin:25px auto">

          ${legends.map(([name, description]) => `
            <section style="border-top:1px solid #ae8b67;
              padding:18px 0">
              <h2 style="color:#702732;
                margin:0 0 9px">${name}</h2>
              <p style="margin:0">${description}</p>
            </section>
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

  function choicesForm() {
    return `
      <div class="formshell">
        <div class="eyebrow">O LIVRO DOS DESTINOS · I</div>
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
              ${characters.map(name => `
                <option value="${name}"
                  ${f.character === name ? 'selected' : ''}>
                  ${name}
                </option>
              `).join('')}
            </select>
          </div>
          <div class="field">
            <label for="player">Nome do jogador (opcional)</label>
            <input id="player"
              value="${escapeHTML(f.player)}"
              placeholder="Seu nome">
          </div>
        </div>

        <div class="form-section">
          <h2>Quais domínios mais despertam sua curiosidade?</h2>
          <div class="options">
            ${D.map(x => `
              <label class="option">
                <input type="checkbox" data-domain="${x.id}"
                  ${f.domains.includes(x.id) ? 'checked' : ''}
                  ${f.domains.length >= 3 &&
                    !f.domains.includes(x.id) ? 'disabled' : ''}>
                ${escapeHTML(x.nome)}
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
            ].map(([value, label]) => `
              <label class="option">
                <input type="radio" name="style"
                  value="${value}"
                  ${f.style === value ? 'checked' : ''}>
                ${label}
              </label>
            `).join('')}
          </div>
          <div class="field">
            <label for="expectation">
              O que você mais gostaria de viver na próxima fase?
              (opcional)
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

  function destinyForm() {
    const questions = [
      ['desired', 'O que seu personagem ainda deseja conquistar?'],
      ['relationship', 'Existe alguém que gostaria de reencontrar, salvar, perdoar ou confrontar?'],
      ['mystery', 'Qual mistério de seu passado gostaria de compreender?'],
      ['fears', 'Que tipo de pessoa teme se tornar ao adquirir tanto poder?'],
      ['after', 'Se sobrevivesse a tudo isso, como gostaria de viver depois?'],
      ['themes', 'Que cenas, relações ou transformações gostaria de explorar?'],
      ['boundaries', 'Há assuntos que prefere evitar ou tratar com cuidado? (opcional e confidencial ao Mestre)']
    ];

    return `
      <div class="formshell">
        <div class="eyebrow">O LIVRO DOS DESTINOS · II</div>
        <h1>O que ainda resta viver?</h1>
        <p class="form-intro">
          Responda apenas ao que fizer sentido.
          Você pode compartilhar detalhes em particular
          com o Mestre. O destino do personagem ainda
          será construído durante o jogo.
        </p>

        ${questions.map(([id, question]) => `
          <div class="field">
            <label for="${id}">${question}</label>
            <textarea id="${id}"
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

  function letterForm() {
    return `
      <div class="formshell">
        <div class="eyebrow">SEU REGISTRO PESSOAL</div>
        <h1>A Carta ao Mestre</h1>
        <p class="form-intro">
          Suas respostas ficam apenas neste dispositivo.
          Para enviá-las, baixe o arquivo ou copie o texto
          e compartilhe diretamente com o Mestre.
        </p>

        <div class="form-section">
          <h2>Prévia das respostas</h2>
          <pre id="preview" style="
            white-space:pre-wrap;line-height:1.55;
            font:1rem Georgia;background:#fff8e8;
            border:1px solid #b99871;padding:20px;
            max-height:480px;overflow:auto"></pre>
        </div>

        <div class="action-row">
          <button class="action" id="downloadTxt" type="button">
            ↓ Baixar TXT
          </button>
          <button class="action secondary" id="copyText"
            type="button">
            Copiar para WhatsApp
          </button>
          <button class="action secondary" id="printPdf"
            type="button">
            Imprimir / Salvar PDF
          </button>
        </div>

        <p id="confirmation" class="confirmation"
          role="status"></p>
        <p class="hint">
          O arquivo TXT pode ser anexado a uma conversa.
          Nenhuma resposta é enviada automaticamente.
        </p>
      </div>
    `;
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
          <button class="cta" id="start" type="button">
            Abrir o atlas →
          </button>
        </div>
      `;
    } else if (page === 1) {
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
    } else if (page === 2) {
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
                style="text-decoration:none;color:inherit;cursor:pointer"
                aria-label="Conhecer ${escapeHTML(x.nome)}">
                <img src="assets/${x.id}.webp"
                  loading="lazy"
                  alt="Ilustração de ${escapeHTML(x.nome)}">
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
    } else if (page === druskenvaldPage) {
      html = druskenvaldOpening();
    } else if (page === druskenvaldPage + 1) {
      html = druskenvaldDomain();
    } else if (page === druskenvaldPage + 2) {
      html = druskenvaldLegends();
    } else if (page >= domainStart &&
               page < domainStart + D.length) {
      html = ordinaryDomain(D[page - domainStart],
        page - domainStart);
    } else if (page === choicesPage) {
      html = choicesForm();
    } else if (page === destinyPage) {
      html = destinyForm();
    } else if (page === letterPage) {
      html = letterForm();
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

    stage.querySelectorAll('[data-domain-page]').forEach(card => {
      card.onclick = e => {
        e.preventDefault();
        goto(Number(card.dataset.domainPage));
      };
    });

    const start = $('#start');
    if (start) start.onclick = () => goto(page + 1);

    const next = $('#nextForm');
    if (next) next.onclick = () => goto(page + 1);

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
      [
        'desired', 'relationship', 'mystery', 'fears',
        'after', 'themes', 'boundaries'
      ].forEach(id => {
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
            'Não foi possível copiar. Use Baixar TXT.';
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
          '<!doctype html><html lang="pt-BR">' +
          '<meta charset="utf-8">' +
          '<title>Carta ao Mestre</title>' +
          '<style>body{font:16px Georgia;padding:30px;' +
          'line-height:1.5}pre{font:16px Georgia;' +
          'white-space:pre-wrap}</style>' +
          '<h1>Carta ao Mestre — Atlas das Brumas</h1>' +
          '<pre>' + escapeHTML(exportText()) + '</pre></html>'
        );
        win.document.close();
        win.focus();
        win.print();
      };
    }
  }

  function exportText() {
    const val = s => String(s ?? '').trim() || '(não informado)';

    return [
      'PODERES SOMBRIOS — ATLAS DAS BRUMAS',
      'LIVRO DOS DESTINOS — RESPOSTAS DO JOGADOR',
      '========================================',
      'Personagem: ' + val(f.character),
      'Jogador: ' + val(f.player),
      'Domínios escolhidos: ' +
        (f.domains.map(id =>
          D.find(d => d.id === id)?.nome
        ).filter(Boolean).join(' > ') || '(nenhum selecionado)'),
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
    const blob = new Blob(
      ['\ufeff', exportText()],
      { type: 'text/plain;charset=utf-8' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = 'Poderes_Sombrios_Destino_' +
      (f.character || 'Jogador')
        .replace(/[^a-zA-Z0-9_-]/g, '_') + '.txt';

    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    $('#confirmation').textContent =
      'Arquivo TXT criado. Envie-o ao Mestre pelo WhatsApp.';
  }

  ['prevBtn', 'prevBottom'].forEach(id => {
    $('#' + id).onclick = () => goto(page - 1);
  });
  ['nextBtn', 'nextBottom'].forEach(id => {
    $('#' + id).onclick = () => goto(page + 1);
  });

  $('#tocToggle').onclick = () => {
    const on = $('#sumario').classList.toggle('show');
    $('#tocToggle').setAttribute('aria-expanded', String(on));
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
    page = Math.max(0, Math.min(
      pages.length - 1, Number(match[1]) - 1
    ));
  }

  render();
})();
