/* ============================
   QUIZ VAGA — Main Script
   ============================ */

// ===== STATE =====
let currentStep = 0;
let userData = {};
const container = document.getElementById('quiz-container');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const floatingScarcity = document.getElementById('floating-scarcity');

// ===== LINK DO WHATSAPP (ALTERE AQUI) =====
const WHATSAPP_LINK = 'https://chat.whatsapp.com/CodXC6Ve9tMLNejBEX0tUm';

// ===== VIEWERS COUNTER =====
function updateViewers() {
    const el = document.getElementById('viewers-count');
    const base = 280 + Math.floor(Math.random() * 120);
    el.textContent = base;
    setInterval(() => {
        const change = Math.floor(Math.random() * 15) - 5;
        const current = parseInt(el.textContent);
        el.textContent = Math.max(200, current + change);
    }, 3000 + Math.random() * 2000);
}

// ===== VAGAS COUNTER =====
let vagasBase = 14;
function decrementVagas() {
    const el = document.getElementById('vagas-count');
    setInterval(() => {
        if (vagasBase > 3) {
            vagasBase -= 1;
            el.textContent = vagasBase;
        }
    }, 15000 + Math.random() * 10000);
}

// ===== PROGRESS UPDATE =====
const totalSteps = 16;

function updateProgress() {
    const pct = Math.min(Math.round((currentStep / totalSteps) * 100), 100);
    progressBar.style.width = pct + '%';
    progressText.textContent = pct + '%';
}

// ===== STEP NAVIGATION =====
function goToStep(step) {
    currentStep = step;
    updateProgress();
    container.innerHTML = '';

    const div = document.createElement('div');
    div.className = 'step-content';
    container.appendChild(div);

    steps[step].render(div);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (step >= 5) {
        floatingScarcity.classList.add('visible');
    }
}

function nextStep() { goToStep(currentStep + 1); }

// ===== NOME SUBMIT =====
function submitNome() {
    const input = document.getElementById('input-nome');
    const val = input.value.trim();
    if (val.length >= 2) {
        userData.nome = val;
        nextStep();
    }
}

// ===== IDADE SUBMIT =====
function submitIdade() {
    const input = document.getElementById('input-idade');
    const val = parseInt(input.value);
    if (val >= 1 && val <= 99) {
        userData.idade = val;
        if (val < 18) {
            // Menor de idade → vai pro aviso (step 3)
            goToStep(3);
        } else {
            // Maior de idade → pula o aviso e vai pro step 4
            goToStep(4);
        }
    }
}

// ===== OPTION CLICK HANDLER =====
function handleOptionClick(el, key, value, isNegative) {
    const parent = el.closest('.options-list');
    parent.querySelectorAll('.option-card').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
    userData[key] = value;
    
    setTimeout(() => nextStep(), 350);
}

// ===== RENDER HELPERS =====
function renderQuestion(el, config) {
    const {
        stepNum, stepIcon, totalQ, questionText, subText, callout, options, key, socialProof
    } = config;

    el.innerHTML = `
        <div class="question-card">
            <div class="step-number">
                <span class="step-icon">${stepIcon || '📋'}</span>
                Pergunta ${stepNum} de ${totalQ}
            </div>
            <h2 class="question-text">${questionText}</h2>
            ${subText ? `<p class="question-subtext">${subText}</p>` : ''}
            ${callout ? `
                <div class="marketing-callout">
                    <span class="callout-icon">${callout.icon}</span>
                    <span>${callout.text}</span>
                </div>
            ` : ''}
            <div class="options-list">
                ${options.map(opt => `
                    <div class="option-card ${opt.negative ? 'negative' : ''}"
                         onclick="handleOptionClick(this, '${key}', '${opt.value}', ${!!opt.negative})">
                        <div class="option-radio"></div>
                        ${opt.emoji ? `<span class="option-emoji">${opt.emoji}</span>` : ''}
                        <span class="option-label">${opt.label}</span>
                    </div>
                `).join('')}
            </div>
            ${socialProof ? `
                <div class="social-proof-inline">
                    <div class="avatars-stack">
                        <div class="avatar-circle">J</div>
                        <div class="avatar-circle">M</div>
                        <div class="avatar-circle">A</div>
                        <div class="avatar-circle">+</div>
                    </div>
                    <span class="social-proof-text">${socialProof}</span>
                </div>
            ` : ''}
        </div>
    `;
}

function renderInfoScreen(el, config) {
    el.innerHTML = `
        <div class="info-screen">
            <div class="info-icon">${config.icon}</div>
            <h2 class="info-title">${config.title}</h2>
            <p class="info-text">${config.text}</p>
            <button class="btn-continue" onclick="nextStep()">
                ${config.btnText || 'CONTINUAR'} →
            </button>
        </div>
    `;
}

// ===== STEPS DEFINITION =====
const steps = [

    // ===== STEP 0: INTRO / HOOK =====
    {
        render(el) {
            renderInfoScreen(el, {
                icon: '💰',
                title: 'Calma aí — isso aqui não é pra todo mundo.',
                text: `Responde <strong>9 perguntas rápidas</strong> pra gente ver se você se encaixa no perfil.<br><br>
                ⚠️ <strong>Aviso:</strong> Se fechar essa página, perde a vez. Tem muita gente na fila e a gente <strong>não guarda vaga</strong>.`,
                btnText: 'QUERO FAZER O TESTE'
            });
        }
    },

    // ===== STEP 1: NOME =====
    {
        render(el) {
            el.innerHTML = `
                <div class="question-card">
                    <div class="step-number">
                        <span class="step-icon">👤</span>
                        IDENTIFICAÇÃO
                    </div>
                    <h2 class="question-text">Primeiro, como posso te chamar?</h2>
                    <p class="question-subtext">Coloca seu nome ou apelido aí embaixo.</p>
                    <div class="input-group">
                        <input type="text" id="input-nome" class="quiz-input" style="width:100%;display:block;padding:18px 22px;background:rgba(255,255,255,0.05);border:2px solid rgba(255,255,255,0.15);border-radius:14px;color:#fff;font-family:Inter,sans-serif;font-size:18px;font-weight:600;outline:none;box-sizing:border-box;-webkit-appearance:none" placeholder="Ex: João, Maria, Dudu..." autocomplete="off" />
                    </div>
                    <button class="btn-continue" id="btn-nome" disabled onclick="submitNome()">
                        CONTINUAR →
                    </button>
                </div>
            `;
            const input = document.getElementById('input-nome');
            const btn = document.getElementById('btn-nome');
            input.addEventListener('input', () => {
                btn.disabled = input.value.trim().length < 2;
            });
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && input.value.trim().length >= 2) submitNome();
            });
            input.focus();
        }
    },

    // ===== STEP 2: IDADE =====
    {
        render(el) {
            const nome = userData.nome || 'você';
            el.innerHTML = `
                <div class="question-card">
                    <div class="step-number">
                        <span class="step-icon">📅</span>
                        IDENTIFICAÇÃO
                    </div>
                    <h2 class="question-text">Beleza, ${nome}! Qual sua idade?</h2>
                    <p class="question-subtext">Precisamos confirmar sua idade pra continuar.</p>
                    <div class="input-group">
                        <input type="tel" inputmode="numeric" pattern="[0-9]*" id="input-idade" class="quiz-input" style="width:100%;display:block;padding:18px 22px;background:rgba(255,255,255,0.05);border:2px solid rgba(255,255,255,0.15);border-radius:14px;color:#fff;font-family:Inter,sans-serif;font-size:18px;font-weight:600;outline:none;box-sizing:border-box;-webkit-appearance:none" placeholder="Digite sua idade" maxlength="2" autocomplete="off" />
                    </div>
                    <button class="btn-continue" id="btn-idade" disabled onclick="submitIdade()">
                        CONTINUAR →
                    </button>
                </div>
            `;
            const input = document.getElementById('input-idade');
            const btn = document.getElementById('btn-idade');
            input.addEventListener('input', () => {
                const val = parseInt(input.value);
                btn.disabled = !(val >= 1 && val <= 99);
            });
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !btn.disabled) submitIdade();
            });
            input.focus();
        }
    },

    // ===== STEP 3: AVISO MENOR DE IDADE (condicional — pulado se >= 18) =====
    {
        render(el) {
            el.innerHTML = `
                <div class="info-screen underage-screen">
                    <div class="info-icon">🔞</div>
                    <h2 class="info-title">Poxa, ainda não dá.</h2>
                    <p class="info-text">
                        Essa oportunidade é <strong>apenas para maiores de 18 anos</strong>.<br><br>
                        As casas de aposta são regulamentadas e exigem maioridade pra qualquer operação.<br><br>
                        Quando você fizer 18, volta aqui que a gente te encaixa. 💪
                    </p>
                </div>
            `;
        }
    },

    // ===== STEP 1: QUESTION 1 =====
    {
        render(el) {
            renderQuestion(el, {
                stepNum: 1, totalQ: 9, stepIcon: '🔥',
                questionText: 'Quer botar de R$5 a R$100 no bolso HOJE usando só o celular?',
                subText: `Esquece carteira assinada. Isso aqui é diferente — é por indicação e performance, 100% pelo celular. Sem chefe, sem horário, sem frescura.`,
                callout: {
                    icon: '💸',
                    text: '<strong>547 pessoas</strong> já sacaram hoje. Enquanto você tá lendo isso, tem gente garantindo a vaga que podia ser sua.'
                },
                key: 'q1',
                options: [
                    { label: 'Quero essa grana, bora! 💰', value: 'sim', emoji: '🤑' },
                    { label: 'Não, tô de boa sem dinheiro...', value: 'nao', negative: true, emoji: '❌' }
                ],
                socialProof: '<strong>92%</strong> não perderam tempo — clicaram na primeira'
            });
        }
    },

    // ===== STEP 2: MARKETING PUSH 1 =====
    {
        render(el) {
            renderInfoScreen(el, {
                icon: '🚀',
                title: 'Boa. Você já tá na frente de muita gente.',
                text: `A maioria das pessoas pega o celular, rola o feed, reclama da vida e dorme sem fazer nada.<br><br>
                Você pelo menos teve a coragem de clicar. Isso já te coloca <strong>no grupo dos 10%</strong> que realmente fazem dinheiro.<br><br>
                🔥 Agora é só <strong>não parar no meio do caminho</strong>.`,
                btnText: 'CONTINUAR'
            });
        }
    },

    // ===== STEP 3: QUESTION 2 =====
    {
        render(el) {
            renderQuestion(el, {
                stepNum: 2, totalQ: 9, stepIcon: '⚡',
                questionText: 'Você tem algum problema com Bets, Jogos ou Casas de Aposta?',
                subText: `Vou ser direto: se você torce o nariz pra esse mercado, fecha a página agora. Mas se você <strong>não tem problema</strong> em faturar R$50, R$100, R$500 por dia com isso...`,
                callout: {
                    icon: '📊',
                    text: 'Esse mercado movimenta <strong>R$ 150 BILHÕES por ano</strong> só no Brasil. Gente comum tá tirando dinheiro disso <strong>todo santo dia</strong>. A pergunta é: por que você ainda não?'
                },
                key: 'q2',
                options: [
                    { label: 'Sem problema nenhum — quero faturar 💰', value: 'sim', emoji: '✅' },
                    { label: 'Tenho problema, prefiro ficar sem...', value: 'nao', negative: true, emoji: '❌' }
                ],
                socialProof: '<strong>89%</strong> responderam que querem essa oportunidade'
            });
        }
    },

    // ===== STEP 4: QUESTION 3 =====
    {
        render(el) {
            renderQuestion(el, {
                stepNum: 3, totalQ: 9, stepIcon: '💎',
                questionText: 'Tá disposto a começar AGORA e botar de R$10 a R$100+ no bolso por dia?',
                subText: `O lance é simples: você faz um cadastro numa <strong>casa de aposta legalizada</strong>, ganha <strong>R$50 de comissão</strong>. Indica mais gente? Ganha mais. Tem afiliado tirando <strong>R$100, R$200 por dia</strong> só com o celular.`,
                callout: {
                    icon: '⏰',
                    text: 'Quem fez isso <strong>ontem</strong> já tá com dinheiro na conta. Cada hora que você demora é grana que <strong>fica na mesa</strong>.'
                },
                key: 'q3',
                options: [
                    { label: 'Quero começar AGORA! 🚀', value: 'sim', emoji: '✅' },
                    { label: 'Vou deixar pra depois...', value: 'nao', negative: true, emoji: '😔' }
                ]
            });
        }
    },

    // ===== STEP 5: QUESTION 4 — PAIN POINT =====
    {
        render(el) {
            renderQuestion(el, {
                stepNum: 4, totalQ: 9, stepIcon: '😤',
                questionText: 'Qual desses perrengues é o SEU agora?',
                subText: `Pode ser sincero. Dependendo da sua resposta, <strong>a gente te encaixa no plano certo</strong> pra você sair do vermelho o mais rápido possível.`,
                key: 'q4',
                options: [
                    { label: 'Tô DESEMPREGADO(A) — coisa tá feia', value: 'desempregado', emoji: '😰' },
                    { label: 'Contas ATRASADAS, nome sujo', value: 'contas_atrasadas', emoji: '💳' },
                    { label: 'Preciso de uma grana EXTRA urgente', value: 'renda_extra', emoji: '💵' },
                    { label: 'TUDO ISSO junto — tô no limite', value: 'todas', emoji: '🆘' }
                ],
                socialProof: '<strong>67%</strong> marcaram "tudo junto" e já tão faturando'
            });
        }
    },

    // ===== STEP 6: MARKETING PUSH 2 =====
    {
        render(el) {
            renderInfoScreen(el, {
                icon: '💀',
                title: 'Vou te falar a real, sem enrolação.',
                text: `Ninguém vai bater na sua porta com um envelope de dinheiro. Não vai cair do céu. Não vai aparecer do nada.<br><br>
                Enquanto você tá aí pensando "será que funciona?", tem gente <strong>menos preparada que você</strong> tirando R$100, R$200 por dia pelo celular. Sabe qual a diferença?<br><br>
                <strong>Eles pararam de pensar e foram fazer.</strong><br><br>
                🔥 A oportunidade tá aqui. Mas <strong>ela não te espera</strong>.`,
                btnText: 'EU VOU FAZER'
            });
        }
    },

    // ===== STEP 7: QUESTION 5 =====
    {
        render(el) {
            renderQuestion(el, {
                stepNum: 5, totalQ: 9, stepIcon: '⏱️',
                questionText: 'Quando você vai sair dessa situação?',
                subText: `Sem julgamento. Mas a resposta pra essa pergunta <strong>diz muito sobre você</strong>.`,
                callout: {
                    icon: '🔴',
                    text: '<strong>83% das vagas de hoje</strong> já foram preenchidas. Quem responde "Agora" entra na <strong>frente da fila</strong>.'
                },
                key: 'q5',
                options: [
                    { label: 'AGORA — chega de enrolar ⚡', value: 'agora', emoji: '🏃' },
                    { label: 'Nos próximos 30 dias', value: '30dias', emoji: '📅' },
                    { label: 'Sei lá, um dia quem sabe...', value: 'depois', negative: true, emoji: '🐢' }
                ]
            });
        }
    },

    // ===== STEP 8: QUESTION 6 =====
    {
        render(el) {
            renderQuestion(el, {
                stepNum: 6, totalQ: 9, stepIcon: '💪',
                questionText: 'Você consegue dedicar 30 minutos por dia no celular?',
                subText: `Não é trabalho de 8 horas. É <strong>meia hora por dia</strong>. Menos que o tempo que você gasta rolando Instagram. Só que ao invés de perder tempo, você <strong>ganha dinheiro</strong>.`,
                key: 'q6',
                options: [
                    { label: '30 minutos? Consigo fácil! 💪', value: 'sim', emoji: '✅' },
                    { label: 'Talvez, não sei...', value: 'talvez', emoji: '🤔' },
                    { label: 'Não tenho tempo pra nada', value: 'nao', negative: true, emoji: '❌' }
                ],
                socialProof: '<strong>94%</strong> falaram que conseguem — e já tão operando'
            });
        }
    },

    // ===== STEP 9: QUESTION 7 =====
    {
        render(el) {
            renderQuestion(el, {
                stepNum: 7, totalQ: 9, stepIcon: '🎯',
                questionText: 'Você topa se cadastrar em casas de aposta legalizadas pra começar a lucrar?',
                subText: `Todas são <strong>regulamentadas pelo governo</strong>. Você <strong>não precisa apostar</strong>. Você lucra com cada pessoa que indica. É comissão, não aposta.`,
                callout: {
                    icon: '🏛️',
                    text: 'Mercado <strong>100% legalizado</strong>. Mais de 40 mil pessoas já fazem isso. Sem risco, sem investimento, sem pegadinha.'
                },
                key: 'q7',
                options: [
                    { label: 'Topo sim, quero lucrar! 🎯', value: 'sim', emoji: '✅' },
                    { label: 'Não curto esse mercado, valeu', value: 'nao', negative: true, emoji: '❌' }
                ]
            });
        }
    },

    // ===== STEP 10: QUESTION 8 =====
    {
        render(el) {
            renderQuestion(el, {
                stepNum: 8, totalQ: 9, stepIcon: '📱',
                questionText: 'Pra começar, você precisa entrar no nosso grupo no WhatsApp. Topa?',
                subText: `É lá que rola tudo: <strong>passo a passo</strong>, suporte ao vivo, e o direcionamento pra você fazer seu primeiro dinheiro <strong>ainda hoje</strong>.`,
                callout: {
                    icon: '🔒',
                    text: 'O grupo é <strong>fechado</strong>. Só entra quem passa pela qualificação. Quando lotou, <strong>a gente fecha e não abre mais</strong>.'
                },
                key: 'q8',
                options: [
                    { label: 'Quero entrar no grupo AGORA! 🚀', value: 'sim', emoji: '✅' },
                    { label: 'Deixa pra depois... (se ainda tiver vaga)', value: 'depois', negative: true, emoji: '⏳' }
                ]
            });
        }
    },

    // ===== STEP 11: QUESTION 9 (ÚLTIMA) =====
    {
        render(el) {
            renderQuestion(el, {
                stepNum: 9, totalQ: 9, stepIcon: '🏆',
                questionText: 'Última: Faz sentido entrar no grupo agora e seguir o passo a passo?',
                subText: `Quando você clicar, alguém da equipe vai te receber pessoalmente. Sem robô, sem demora. <strong>O dinheiro não espera quem fica em cima do muro.</strong>`,
                callout: {
                    icon: '⚡',
                    text: '<strong>Último aviso:</strong> Depois dessa pergunta a gente analisa seu perfil. Se demorar demais, <strong>a vaga vai pra próxima pessoa da fila</strong>.'
                },
                key: 'q9',
                options: [
                    { label: 'SIM, me coloca no grupo! 🏆', value: 'sim', emoji: '✅' },
                    { label: 'Vou pensar... (e perder a vez)', value: 'depois', negative: true, emoji: '❌' }
                ]
            });
        }
    },

    // ===== STEP 12: LOADING / ANALYZING =====
    {
        render(el) {
            el.innerHTML = `
                <div class="loading-screen">
                    <div class="loading-spinner"></div>
                    <h2 class="loading-title">Analisando suas respostas...</h2>
                    <p class="loading-subtitle">Espera só um segundo</p>
                    <div class="loading-steps">
                        <div class="loading-step" id="ls1">
                            <span class="step-check">⏳</span>
                            <span>Conferindo respostas...</span>
                        </div>
                        <div class="loading-step" id="ls2">
                            <span class="step-check">⏳</span>
                            <span>Calculando seu potencial...</span>
                        </div>
                        <div class="loading-step" id="ls3">
                            <span class="step-check">⏳</span>
                            <span>Separando sua vaga...</span>
                        </div>
                        <div class="loading-step" id="ls4">
                            <span class="step-check">⏳</span>
                            <span>Preparando acesso ao grupo...</span>
                        </div>
                    </div>
                </div>
            `;

            const timings = [600, 1500, 2500, 3500];
            const ids = ['ls1', 'ls2', 'ls3', 'ls4'];

            ids.forEach((id, i) => {
                setTimeout(() => {
                    const step = document.getElementById(id);
                    if (step) {
                        step.classList.add('active');
                        step.querySelector('.step-check').textContent = '⏳';
                    }
                    if (i > 0) {
                        const prev = document.getElementById(ids[i - 1]);
                        if (prev) {
                            prev.classList.add('done');
                            prev.querySelector('.step-check').textContent = '✅';
                        }
                    }
                }, timings[i]);
            });

            setTimeout(() => {
                const last = document.getElementById(ids[ids.length - 1]);
                if (last) {
                    last.classList.add('done');
                    last.querySelector('.step-check').textContent = '✅';
                }
                setTimeout(() => nextStep(), 500);
            }, 4500);
        }
    },

    // ===== STEP 13: RESULT PAGE =====
    {
        render(el) {
            const painLabels = {
                'desempregado': 'Desempregado(a) — Precisa urgente',
                'contas_atrasadas': 'Contas no vermelho — Situação crítica',
                'renda_extra': 'Precisando de grana extra — Prioridade',
                'todas': 'Tudo junto — Prioridade MÁXIMA'
            };
            const painLabel = painLabels[userData.q4] || 'Prioridade Alta';

            el.innerHTML = `
                <div class="result-page">
                    
                    <!-- HEADER -->
                    <div class="result-header">
                        <div class="result-badge">✅ PERFIL APROVADO</div>
                        <h1 class="result-title">Deu bom. Você passou na qualificação.</h1>
                        <p class="result-subtitle">
                            Pelas suas respostas, você tem <strong>perfil pra começar a faturar hoje</strong>. 
                            Sua vaga tá <strong>reservada, mas por pouco tempo</strong>.
                        </p>
                    </div>

                    <!-- PROFILE CARD -->
                    <div class="profile-card">
                        <div class="profile-card-header">
                            <span class="icon">📊</span>
                            Seu Perfil
                        </div>
                        <div class="profile-stat">
                            <span class="profile-stat-label">Situação</span>
                            <span class="profile-stat-value urgent">${painLabel}</span>
                        </div>
                        <div class="profile-stat">
                            <span class="profile-stat-label">Nível de Urgência</span>
                            <span class="profile-stat-value urgent">🔴 MÁXIMO</span>
                        </div>
                        <div class="profile-stat">
                            <span class="profile-stat-label">Disposição</span>
                            <span class="profile-stat-value">${userData.q6 === 'sim' ? '✅ Decidido' : '⚠️ Indeciso'}</span>
                        </div>
                        <div class="profile-stat">
                            <span class="profile-stat-label">Potencial de Ganho</span>
                            <span class="profile-stat-value high">💰 ALTO</span>
                        </div>
                    </div>

                    <!-- EARNINGS PROJECTION -->
                    <div class="earnings-card">
                        <div class="earnings-label">Quanto você pode tirar por dia</div>
                        <div class="earnings-value">R$ 100+</div>
                        <div class="earnings-period">por dia, começando hoje</div>
                        <div class="earnings-breakdown">
                            <div class="earnings-item">
                                <div class="earnings-item-value">R$50</div>
                                <div class="earnings-item-label">1 Cadastro</div>
                            </div>
                            <div class="earnings-item">
                                <div class="earnings-item-value">R$100+</div>
                                <div class="earnings-item-label">c/ Indicações</div>
                            </div>
                        </div>
                    </div>

                    <!-- HOW IT WORKS -->
                    <div class="how-it-works">
                        <h3 class="how-title">🎯 É simples. 3 passos.</h3>
                        <div class="how-step">
                            <div class="how-step-num">1</div>
                            <div class="how-step-content">
                                <h4>Entra no grupo do WhatsApp</h4>
                                <p>Lá tem o passo a passo e a galera te ajuda ao vivo</p>
                            </div>
                        </div>
                        <div class="how-step">
                            <div class="how-step-num">2</div>
                            <div class="how-step-content">
                                <h4>Faz os cadastros</h4>
                                <p>Segue as instruções, demora uns 5 minutos cada</p>
                            </div>
                        </div>
                        <div class="how-step">
                            <div class="how-step-num">3</div>
                            <div class="how-step-content">
                                <h4>Indica e multiplica</h4>
                                <p>Chama mais gente e sua comissão só cresce</p>
                            </div>
                        </div>
                    </div>

                    <!-- TESTIMONIALS -->
                    <div class="testimonials-section">
                        <div class="testimonials-title">💬 Gente que já tá fazendo:</div>
                        
                        <div class="testimonial-card">
                            <div class="testimonial-header">
                                <div class="testimonial-avatar">👨</div>
                                <div>
                                    <div class="testimonial-name">Carlos M.</div>
                                    <div class="testimonial-verified">✅ Verificado</div>
                                </div>
                            </div>
                            <p class="testimonial-text">"Entrei no grupo tipo meia-noite, fiz os cadastro no outro dia de manhã e já tinha R$47 na conta. Indiquei uns 3 amigos meu e fiz mais R$150. Paguei a conta de água que tava atrasada kkk"</p>
                            <span class="testimonial-earning">💰 R$ 197 em 2 dias</span>
                        </div>

                        <div class="testimonial-card">
                            <div class="testimonial-header">
                                <div class="testimonial-avatar">👩</div>
                                <div>
                                    <div class="testimonial-name">Ana Paula S.</div>
                                    <div class="testimonial-verified">✅ Verificado</div>
                                </div>
                            </div>
                            <p class="testimonial-text">"6 meses desempregada, já tava sem esperança nenhuma. Minha vizinha me mandou esse link, entrei no grupo e em 1 semana tirei mais de R$800. Nem acredito ainda."</p>
                            <span class="testimonial-earning">💰 R$ 800+ na 1ª semana</span>
                        </div>

                        <div class="testimonial-card">
                            <div class="testimonial-header">
                                <div class="testimonial-avatar">👨</div>
                                <div>
                                    <div class="testimonial-name">Rafael T.</div>
                                    <div class="testimonial-verified">✅ Verificado</div>
                                </div>
                            </div>
                            <p class="testimonial-text">"Confesso que achei que era golpe kkkk mas entrei de curioso, fiz o passo a passo e em 3 horas já tinha caído R$35. Comprei o almoço com o dinheiro do mesmo dia."</p>
                            <span class="testimonial-earning">💰 R$ 35 em 3 horas</span>
                        </div>
                    </div>

                    <!-- URGENCY CARD -->
                    <div class="urgency-card">
                        <div class="urgency-card-title">⚠️ SUA VAGA EXPIRA EM</div>
                        <div class="urgency-timer" id="countdown-timer">
                            <span>⏰</span>
                            <span id="timer-display">14:59</span>
                        </div>
                        <p class="urgency-card-text">
                            Se o tempo acabar, <strong>sua qualificação cai</strong> e a vaga vai pra próxima pessoa da fila. Não tem como refazer.
                        </p>
                    </div>

                    <!-- GUARANTEE -->
                    <div class="guarantee-section">
                        <div class="guarantee-icon">🛡️</div>
                        <div class="guarantee-title">GRATUITO — ZERO RISCO</div>
                        <p class="guarantee-text">
                            Você não paga nada pra entrar. Não precisa investir nada pra começar. 
                            Só entra no grupo, segue o passo a passo e pronto. Simples assim.
                        </p>
                    </div>

                    <!-- CTA -->
                    <div class="cta-container">
                        <a href="${WHATSAPP_LINK}" target="_blank" rel="noopener noreferrer" class="btn-cta" id="main-cta">
                            <span>📱</span>
                            ENTRAR NO GRUPO DO WHATSAPP
                        </a>
                        <p class="btn-cta-sub">
                            🔒 Acesso imediato • <strong>Poucas vagas</strong> • 100% Gratuito
                        </p>
                    </div>

                    <!-- EXTRA SOCIAL PROOF -->
                    <div class="social-proof-inline" style="margin-top: 20px;">
                        <div class="avatars-stack">
                            <div class="avatar-circle">R</div>
                            <div class="avatar-circle">L</div>
                            <div class="avatar-circle">P</div>
                            <div class="avatar-circle">+</div>
                        </div>
                        <span class="social-proof-text">
                            <strong>1.247 pessoas</strong> entraram no grupo nas últimas 24h
                        </span>
                    </div>
                </div>
            `;

            startCountdown();
        }
    }
];

// ===== COUNTDOWN TIMER =====
function startCountdown() {
    let timeLeft = 15 * 60;
    const display = document.getElementById('timer-display');

    const interval = setInterval(() => {
        timeLeft--;
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        if (display) {
            display.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        if (timeLeft <= 0) {
            clearInterval(interval);
            if (display) display.textContent = 'EXPIRADO';
        }
    }, 1000);
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    updateViewers();
    decrementVagas();
    goToStep(0);
});
