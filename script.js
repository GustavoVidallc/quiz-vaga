/* ============================
   QUIZ VAGA — Main Script
   Aggressive Marketing Quiz Engine
   ============================ */

// ===== STATE =====
let currentStep = 0;
let userData = {};
const container = document.getElementById('quiz-container');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const floatingScarcity = document.getElementById('floating-scarcity');

// ===== LINK DO TELEGRAM (ALTERE AQUI) =====
const TELEGRAM_LINK = 'https://t.me/frellabet_bot';

// ===== VIEWERS COUNTER (fake social proof) =====
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

// ===== VAGAS COUNTER (decreasing scarcity) =====
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
const totalSteps = 13; // 9 questions + info screens + loading + result

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

    // Show floating scarcity after step 3
    if (step >= 3) {
        floatingScarcity.classList.add('visible');
    }
}

function nextStep() { goToStep(currentStep + 1); }

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
                title: 'Você foi selecionado para uma oportunidade EXCLUSIVA',
                text: `Antes de continuar, <strong>responda 9 perguntas rápidas</strong> para verificarmos se você se qualifica.<br><br>
                ⚠️ <strong>Atenção:</strong> Essa vaga é limitada. Se você sair dessa página, <strong>perderá seu lugar na fila</strong>.`,
                btnText: 'QUERO PARTICIPAR'
            });
        }
    },

    // ===== STEP 1: QUESTION 1 =====
    {
        render(el) {
            renderQuestion(el, {
                stepNum: 1, totalQ: 9, stepIcon: '🔥',
                questionText: 'Quer ganhar de R$5 a R$100 HOJE usando apenas seu celular?',
                subText: `Não é emprego fixo. É um <strong>modelo novo no mercado digital</strong>, 100% online, por indicação e performance. Basta fazer um cadastro simples.`,
                callout: {
                    icon: '💸',
                    text: '<strong>547 pessoas</strong> já faturaram hoje com esse modelo. A cada minuto que você espera, alguém está pegando a sua vaga.'
                },
                key: 'q1',
                options: [
                    { label: 'Quero ganhar dinheiro HOJE ✅', value: 'sim', emoji: '🤑' },
                    { label: 'Não quero ganhar dinheiro...', value: 'nao', negative: true, emoji: '❌' }
                ],
                socialProof: '<strong>92%</strong> das pessoas escolheram a primeira opção'
            });
        }
    },

    // ===== STEP 2: MARKETING PUSH 1 =====
    {
        render(el) {
            renderInfoScreen(el, {
                icon: '🚀',
                title: 'EXCELENTE ESCOLHA!',
                text: `Você acabou de dar o primeiro passo que <strong>separa os que reclamam</strong> dos que <strong>faturam</strong>.<br><br>
                Enquanto você está aqui, <strong>milhares de pessoas</strong> já estão lucrando com o celular.<br><br>
                🔥 A pergunta é: <strong>VOCÊ vai ficar de fora?</strong>`,
                btnText: 'CONTINUAR QUALIFICAÇÃO'
            });
        }
    },

    // ===== STEP 3: QUESTION 2 =====
    {
        render(el) {
            renderQuestion(el, {
                stepNum: 2, totalQ: 9, stepIcon: '⚡',
                questionText: 'Você se incomoda com Jogos, Bets e Casas de Aposta?',
                subText: `<strong>ATENÇÃO:</strong> Se você se incomoda com esse mercado, essa oportunidade <strong>NÃO é para você</strong>. Mas se não se importa de faturar R$50, R$100, R$500 por dia...`,
                callout: {
                    icon: '📊',
                    text: 'O mercado de apostas movimenta <strong>R$ 150 BILHÕES por ano</strong> no Brasil. Pessoas comuns estão faturando com isso <strong>TODOS OS DIAS</strong>.'
                },
                key: 'q2',
                options: [
                    { label: 'Não me importo, QUERO GANHAR DINHEIRO 💰', value: 'sim', emoji: '✅' },
                    { label: 'Prefiro continuar sem dinheiro...', value: 'nao', negative: true, emoji: '❌' }
                ],
                socialProof: '<strong>89%</strong> querem aproveitar essa oportunidade'
            });
        }
    },

    // ===== STEP 4: QUESTION 3 =====
    {
        render(el) {
            renderQuestion(el, {
                stepNum: 3, totalQ: 9, stepIcon: '💎',
                questionText: 'Está disposto a começar AGORA e faturar entre R$10 e R$100+ por dia?',
                subText: `Você vai fazer o cadastro em uma <strong>casa de apostas legalizada</strong>. Sua comissão por fazer o cadastro será de <strong>R$50,00</strong>. Indicando outras pessoas você pode faturar <strong>mais de R$100,00/dia</strong>.`,
                callout: {
                    icon: '⏰',
                    text: 'Quem começou <strong>ontem</strong> já está faturando. Cada hora que você espera é dinheiro que você <strong>PERDE</strong>.'
                },
                key: 'q3',
                options: [
                    { label: 'SIM, quero iniciar AGORA! 🚀', value: 'sim', emoji: '✅' },
                    { label: 'Vou deixar passar essa oportunidade...', value: 'nao', negative: true, emoji: '😔' }
                ]
            });
        }
    },

    // ===== STEP 5: QUESTION 4 — PAIN POINT =====
    {
        render(el) {
            renderQuestion(el, {
                stepNum: 4, totalQ: 9, stepIcon: '😤',
                questionText: 'Qual a maior dificuldade que você enfrenta HOJE?',
                subText: `Seja honesto. <strong>Essa resposta vai definir o seu plano de ação personalizado</strong> para começar a faturar imediatamente.`,
                key: 'q4',
                options: [
                    { label: 'Estou DESEMPREGADO(A) e precisando urgente', value: 'desempregado', emoji: '😰' },
                    { label: 'Minhas contas estão ATRASADAS', value: 'contas_atrasadas', emoji: '💳' },
                    { label: 'Preciso de uma RENDA EXTRA agora', value: 'renda_extra', emoji: '💵' },
                    { label: 'TODAS as opções acima — situação crítica!', value: 'todas', emoji: '🆘' }
                ],
                socialProof: '<strong>67%</strong> das pessoas que responderam "todas" já estão faturando'
            });
        }
    },

    // ===== STEP 6: MARKETING PUSH 2 — AGGRESSION =====
    {
        render(el) {
            renderInfoScreen(el, {
                icon: '💀',
                title: 'CHEGA DE SOFRER!',
                text: `Olha só a real: <strong>ninguém vai bater na sua porta com dinheiro</strong>.<br><br>
                Enquanto você hesita, outras pessoas <strong>menos qualificadas que você</strong> estão fazendo R$100, R$200, R$500 por dia com o celular.<br><br>
                A diferença entre quem lucra e quem reclama? <strong>AÇÃO IMEDIATA.</strong><br><br>
                🔥 <strong>Não tenha dó de si mesmo. Tenha AMBIÇÃO.</strong>`,
                btnText: 'EU QUERO AGIR AGORA'
            });
        }
    },

    // ===== STEP 7: QUESTION 5 =====
    {
        render(el) {
            renderQuestion(el, {
                stepNum: 5, totalQ: 9, stepIcon: '⏱️',
                questionText: 'Quando você pretende MUDAR sua situação financeira?',
                subText: `A janela de oportunidade está <strong>fechando</strong>. As vagas para hoje estão quase esgotadas.`,
                callout: {
                    icon: '🔴',
                    text: '<strong>URGENTE:</strong> 83% das vagas de hoje já foram preenchidas. Quem responde "Agora" tem <strong>prioridade na fila</strong>.'
                },
                key: 'q5',
                options: [
                    { label: 'AGORA — não posso esperar mais! ⚡', value: 'agora', emoji: '🏃' },
                    { label: 'Em até 30 dias', value: '30dias', emoji: '📅' },
                    { label: 'Mais pra frente (talvez nunca...)', value: 'depois', negative: true, emoji: '🐢' }
                ]
            });
        }
    },

    // ===== STEP 8: QUESTION 6 =====
    {
        render(el) {
            renderQuestion(el, {
                stepNum: 6, totalQ: 9, stepIcon: '💪',
                questionText: 'Você está DISPOSTO a investir seu tempo para resolver isso?',
                subText: `Não é sobre trabalhar 8 horas. É sobre dedicar <strong>30 minutos por dia</strong> no celular e ver o dinheiro entrando.`,
                key: 'q6',
                options: [
                    { label: 'SIM, estou 100% decidido! 💪', value: 'sim', emoji: '✅' },
                    { label: 'Talvez...', value: 'talvez', emoji: '🤔' },
                    { label: 'Não (prefiro continuar reclamando)', value: 'nao', negative: true, emoji: '❌' }
                ],
                socialProof: '<strong>94%</strong> responderam SIM e já estão na operação'
            });
        }
    },

    // ===== STEP 9: QUESTION 7 =====
    {
        render(el) {
            renderQuestion(el, {
                stepNum: 7, totalQ: 9, stepIcon: '🎯',
                questionText: 'Você quer MESMO fazer cadastros em casas de aposta legalizadas e começar a lucrar?',
                subText: `Todas as casas são <strong>100% legalizadas no Brasil</strong>. Você não precisa apostar. Você <strong>LUCRA com indicações</strong>.`,
                callout: {
                    icon: '🏛️',
                    text: '<strong>Regulamentado pelo governo federal.</strong> Mais de 40 mil pessoas já estão operando. Sem risco, sem investimento.'
                },
                key: 'q7',
                options: [
                    { label: 'SIM, quero começar a lucrar! 🎯', value: 'sim', emoji: '✅' },
                    { label: 'Não gosto desse mercado, estou fora', value: 'nao', negative: true, emoji: '❌' }
                ]
            });
        }
    },

    // ===== STEP 10: QUESTION 8 =====
    {
        render(el) {
            renderQuestion(el, {
                stepNum: 8, totalQ: 9, stepIcon: '📱',
                questionText: 'Para começar, você vai entrar no nosso grupo EXCLUSIVO no Telegram.',
                subText: `Lá dentro você vai receber <strong>o passo a passo completo</strong>, suporte em tempo real e o direcionamento para fazer seu primeiro dinheiro <strong>HOJE</strong>.`,
                callout: {
                    icon: '🔒',
                    text: 'O grupo é <strong>PRIVADO</strong> e só aceita quem passa pela qualificação. Uma vez fechado, <strong>não reabre</strong>.'
                },
                key: 'q8',
                options: [
                    { label: 'SIM, quero entrar no grupo AGORA! 🚀', value: 'sim', emoji: '✅' },
                    { label: 'Vou deixar para depois (arriscar perder a vaga)', value: 'depois', negative: true, emoji: '⏳' }
                ]
            });
        }
    },

    // ===== STEP 11: QUESTION 9 (LAST) =====
    {
        render(el) {
            renderQuestion(el, {
                stepNum: 9, totalQ: 9, stepIcon: '🏆',
                questionText: 'ÚLTIMA PERGUNTA: Faz sentido entrar no grupo do Telegram AGORA e iniciar o passo a passo?',
                subText: `Depois de clicar, um <strong>especialista</strong> vai te direcionar pessoalmente. Sem enrolação, sem espera longa. <strong>O dinheiro não espera.</strong>`,
                callout: {
                    icon: '⚡',
                    text: '<strong>AVISO FINAL:</strong> Após essa pergunta, seu perfil será analisado. Se sua vaga expirar, <strong>você NÃO poderá refazer o quiz</strong>.'
                },
                key: 'q9',
                options: [
                    { label: 'SIM, quero falar com o especialista! 🏆', value: 'sim', emoji: '✅' },
                    { label: 'Prefiro depois (e perder a oportunidade)', value: 'depois', negative: true, emoji: '❌' }
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
                    <h2 class="loading-title">Analisando seu perfil...</h2>
                    <p class="loading-subtitle">Aguarde enquanto verificamos sua qualificação</p>
                    <div class="loading-steps">
                        <div class="loading-step" id="ls1">
                            <span class="step-check">⏳</span>
                            <span>Verificando respostas...</span>
                        </div>
                        <div class="loading-step" id="ls2">
                            <span class="step-check">⏳</span>
                            <span>Calculando potencial de ganhos...</span>
                        </div>
                        <div class="loading-step" id="ls3">
                            <span class="step-check">⏳</span>
                            <span>Reservando sua vaga exclusiva...</span>
                        </div>
                        <div class="loading-step" id="ls4">
                            <span class="step-check">⏳</span>
                            <span>Conectando com especialista...</span>
                        </div>
                    </div>
                </div>
            `;

            // Animate steps
            const timings = [600, 1500, 2500, 3500];
            const ids = ['ls1', 'ls2', 'ls3', 'ls4'];

            ids.forEach((id, i) => {
                setTimeout(() => {
                    const step = document.getElementById(id);
                    if (step) {
                        step.classList.add('active');
                        step.querySelector('.step-check').textContent = '⏳';
                    }
                    // Mark previous as done
                    if (i > 0) {
                        const prev = document.getElementById(ids[i - 1]);
                        if (prev) {
                            prev.classList.add('done');
                            prev.querySelector('.step-check').textContent = '✅';
                        }
                    }
                }, timings[i]);
            });

            // Go to result
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
            // Determine pain point label
            const painLabels = {
                'desempregado': 'Desempregado(a) — Urgência Máxima',
                'contas_atrasadas': 'Contas Atrasadas — Situação Crítica',
                'renda_extra': 'Precisa de Renda Extra — Alta Prioridade',
                'todas': 'Situação Crítica Total — Prioridade MÁXIMA'
            };
            const painLabel = painLabels[userData.q4] || 'Alta Prioridade';

            el.innerHTML = `
                <div class="result-page">
                    
                    <!-- HEADER -->
                    <div class="result-header">
                        <div class="result-badge">✅ PERFIL APROVADO</div>
                        <h1 class="result-title">Parabéns! Você foi QUALIFICADO para a operação.</h1>
                        <p class="result-subtitle">
                            Com base nas suas respostas, identificamos que você tem <strong>potencial imediato de ganhos</strong>. 
                            Sua vaga está <strong>reservada por tempo limitado</strong>.
                        </p>
                    </div>

                    <!-- PROFILE CARD -->
                    <div class="profile-card">
                        <div class="profile-card-header">
                            <span class="icon">📊</span>
                            Seu Perfil de Ganhos
                        </div>
                        <div class="profile-stat">
                            <span class="profile-stat-label">Situação Atual</span>
                            <span class="profile-stat-value urgent">${painLabel}</span>
                        </div>
                        <div class="profile-stat">
                            <span class="profile-stat-label">Nível de Urgência</span>
                            <span class="profile-stat-value urgent">🔴 MÁXIMO</span>
                        </div>
                        <div class="profile-stat">
                            <span class="profile-stat-label">Perfil de Ação</span>
                            <span class="profile-stat-value">${userData.q6 === 'sim' ? '✅ Decidido' : '⚠️ Indeciso'}</span>
                        </div>
                        <div class="profile-stat">
                            <span class="profile-stat-label">Potencial de Ganho</span>
                            <span class="profile-stat-value high">💰 ALTO</span>
                        </div>
                    </div>

                    <!-- EARNINGS PROJECTION -->
                    <div class="earnings-card">
                        <div class="earnings-label">Projeção de Ganhos Diários</div>
                        <div class="earnings-value">R$ 100+</div>
                        <div class="earnings-period">por dia, começando HOJE</div>
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
                        <h3 class="how-title">🎯 Como Funciona (3 Passos Simples)</h3>
                        <div class="how-step">
                            <div class="how-step-num">1</div>
                            <div class="how-step-content">
                                <h4>Entre no Grupo do Telegram</h4>
                                <p>Receba o passo a passo completo e suporte em tempo real</p>
                            </div>
                        </div>
                        <div class="how-step">
                            <div class="how-step-num">2</div>
                            <div class="how-step-content">
                                <h4>Faça os Cadastros</h4>
                                <p>Siga as instruções simples e comece a ganhar comissões</p>
                            </div>
                        </div>
                        <div class="how-step">
                            <div class="how-step-num">3</div>
                            <div class="how-step-content">
                                <h4>Indique e Multiplique</h4>
                                <p>Convide mais pessoas e multiplique seus ganhos diariamente</p>
                            </div>
                        </div>
                    </div>

                    <!-- TESTIMONIALS -->
                    <div class="testimonials-section">
                        <div class="testimonials-title">💬 Quem já começou fala:</div>
                        
                        <div class="testimonial-card">
                            <div class="testimonial-header">
                                <div class="testimonial-avatar">👨</div>
                                <div>
                                    <div class="testimonial-name">Carlos M.</div>
                                    <div class="testimonial-verified">✅ Verificado</div>
                                </div>
                            </div>
                            <p class="testimonial-text">"Comecei ontem e já fiz R$47 só com os cadastros. Hoje indiquei 3 amigos e fiz mais R$150. Isso é real!"</p>
                            <span class="testimonial-earning">💰 Faturou R$ 197 em 2 dias</span>
                        </div>

                        <div class="testimonial-card">
                            <div class="testimonial-header">
                                <div class="testimonial-avatar">👩</div>
                                <div>
                                    <div class="testimonial-name">Ana Paula S.</div>
                                    <div class="testimonial-verified">✅ Verificado</div>
                                </div>
                            </div>
                            <p class="testimonial-text">"Estava desempregada há 6 meses. Em 1 semana já fiz mais de R$800 só com o celular. Mudou minha vida."</p>
                            <span class="testimonial-earning">💰 Faturou R$ 800+ na 1ª semana</span>
                        </div>

                        <div class="testimonial-card">
                            <div class="testimonial-header">
                                <div class="testimonial-avatar">👨</div>
                                <div>
                                    <div class="testimonial-name">Rafael T.</div>
                                    <div class="testimonial-verified">✅ Verificado</div>
                                </div>
                            </div>
                            <p class="testimonial-text">"Achei que era mentira. Entrei no grupo, segui o passo a passo e em 3 horas já tinha R$35 na conta. Simples demais."</p>
                            <span class="testimonial-earning">💰 R$ 35 em 3 horas</span>
                        </div>
                    </div>

                    <!-- URGENCY CARD -->
                    <div class="urgency-card">
                        <div class="urgency-card-title">⚠️ ATENÇÃO: SUA VAGA EXPIRA EM</div>
                        <div class="urgency-timer" id="countdown-timer">
                            <span>⏰</span>
                            <span id="timer-display">14:59</span>
                        </div>
                        <p class="urgency-card-text">
                            Após esse tempo, sua qualificação será <strong>cancelada</strong> e a vaga será liberada para outra pessoa da fila.
                        </p>
                    </div>

                    <!-- GUARANTEE -->
                    <div class="guarantee-section">
                        <div class="guarantee-icon">🛡️</div>
                        <div class="guarantee-title">100% GRATUITO — SEM RISCO</div>
                        <p class="guarantee-text">
                            Você não paga NADA para entrar. Não precisa investir NADA para começar. 
                            Apenas siga as instruções do grupo e comece a ganhar.
                        </p>
                    </div>

                    <!-- CTA -->
                    <div class="cta-container">
                        <a href="${TELEGRAM_LINK}" target="_blank" rel="noopener noreferrer" class="btn-cta" id="main-cta">
                            <span>📱</span>
                            ENTRAR NO GRUPO DO TELEGRAM
                        </a>
                        <p class="btn-cta-sub">
                            🔒 Acesso imediato • <strong>Vagas limitadas</strong> • 100% Gratuito
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

            // Start countdown timer
            startCountdown();
        }
    }
];

// ===== COUNTDOWN TIMER =====
function startCountdown() {
    let timeLeft = 15 * 60; // 15 minutes
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
