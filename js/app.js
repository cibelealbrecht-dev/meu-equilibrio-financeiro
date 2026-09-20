const STORAGE = {
  transactions: "meuEquilibrio_transactions",
  goals: "meuEquilibrio_goals",
  messages: "meuEquilibrio_messages"
};

const demoTransactions = [
  { id: 1, type: "income", amount: 2500, description: "Salário", category: "Salário", date: today() },
  { id: 2, type: "expense", amount: 80, description: "Mercado", category: "Alimentação", date: today() },
  { id: 3, type: "expense", amount: 120, description: "Transporte", category: "Transporte", date: today() },
  { id: 4, type: "expense", amount: 75, description: "Farmácia", category: "Saúde", date: today() },
  { id: 5, type: "expense", amount: 100, description: "Lazer", category: "Lazer", date: today() }
];

function today() {
  return new Date().toISOString().slice(0, 10);
}
function money(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function getTransactions() { return load(STORAGE.transactions, demoTransactions); }
function getGoals() { return load(STORAGE.goals, []); }

function seedData() {
  if (!localStorage.getItem(STORAGE.transactions)) save(STORAGE.transactions, demoTransactions);
  if (!localStorage.getItem(STORAGE.goals)) save(STORAGE.goals, []);
  if (!localStorage.getItem(STORAGE.messages)) {
    save(STORAGE.messages, [
      { role: "agent", text: "Olá! Eu sou o Agente Financeiro. Posso ajudar você a registrar movimentações, consultar seu resumo e criar metas. 🌿" }
    ]);
  }
}

function totals() {
  const tx = getTransactions();
  const income = tx.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = tx.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  return { income, expense, balance: income - expense };
}

function updateHomeAndSummary() {
  const { income, expense, balance } = totals();
  document.querySelector("#homeReceitas").textContent = money(income);
  document.querySelector("#homeDespesas").textContent = money(expense);
  document.querySelector("#homeSaldo").textContent = money(balance);
  document.querySelector("#summaryReceitas").textContent = money(income);
  document.querySelector("#summaryDespesas").textContent = money(expense);
  document.querySelector("#summarySaldo").textContent = money(balance);
}

function renderHistory() {
  const box = document.querySelector("#historyList");
  const tx = getTransactions().slice().reverse();
  if (!tx.length) { box.innerHTML = '<div class="empty">Nenhuma movimentação registrada.</div>'; return; }
  box.innerHTML = tx.map(t => `
    <div class="history-item">
      <div class="history-main">
        <strong>${escapeHtml(t.description)}</strong>
        <span>${escapeHtml(t.category)} • ${formatDate(t.date)}</span>
      </div>
      <div class="${t.type === "income" ? "income" : "expense"}">${t.type === "income" ? "+" : "-"} ${money(t.amount)}</div>
    </div>
  `).join("");
}

function renderCategories() {
  const box = document.querySelector("#categoryList");
  const expenses = getTransactions().filter(t => t.type === "expense");
  const total = expenses.reduce((s,t) => s+t.amount, 0);
  if (!expenses.length) { box.innerHTML = '<div class="empty">Sem despesas para analisar.</div>'; return; }
  const byCat = {};
  expenses.forEach(t => byCat[t.category] = (byCat[t.category] || 0) + t.amount);
  box.innerHTML = Object.entries(byCat).sort((a,b)=>b[1]-a[1]).map(([cat, val]) => {
    const pct = total ? (val/total)*100 : 0;
    return `<div class="category-row">
      <div class="category-top"><span>${escapeHtml(cat)}</span><strong>${money(val)}</strong></div>
      <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
    </div>`;
  }).join("");
}

function renderGoals() {
  const box = document.querySelector("#goalsList");
  const goals = getGoals();
  if (!goals.length) { box.innerHTML = '<div class="empty">Você ainda não criou uma meta.</div>'; return; }
  box.innerHTML = goals.map(g => {
    const pct = Math.min(100, g.target ? (g.saved/g.target)*100 : 0);
    return `<div class="goal-card">
      <div class="goal-top"><h4>${escapeHtml(g.name)}</h4><strong>${Math.round(pct)}%</strong></div>
      <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
      <div class="goal-values"><span>${money(g.saved)} guardados</span><span>Meta: ${money(g.target)}</span></div>
      ${g.date ? `<div class="muted">Prazo: ${formatDate(g.date)}</div>` : ""}
      <button class="btn btn-outline add-goal-value" data-id="${g.id}">Adicionar R$ 50</button>
      <button class="btn btn-danger delete-goal" data-id="${g.id}">Excluir</button>
    </div>`;
  }).join("");

  box.querySelectorAll(".add-goal-value").forEach(btn => btn.addEventListener("click", () => {
    const goals = getGoals();
    const g = goals.find(x => String(x.id) === String(btn.dataset.id));
    if (g) { g.saved += 50; save(STORAGE.goals, goals); renderGoals(); }
  }));
  box.querySelectorAll(".delete-goal").forEach(btn => btn.addEventListener("click", () => {
    const goals = getGoals().filter(x => String(x.id) !== String(btn.dataset.id));
    save(STORAGE.goals, goals); renderGoals();
  }));
}

function renderSuggestions() {
  const box = document.querySelector("#suggestionsList");
  const tx = getTransactions().filter(t => t.type === "expense");
  const byCat = {};
  tx.forEach(t => byCat[t.category] = (byCat[t.category] || 0) + t.amount);
  const sorted = Object.entries(byCat).sort((a,b)=>b[1]-a[1]);
  const suggestions = [
    { icon:"🌱", title:"Comece pelo que mais pesa", text: sorted[0] ? `Sua maior categoria registrada é ${sorted[0][0]} (${money(sorted[0][1])}). Observe esse gasto antes de fazer cortes maiores.` : "Registre algumas despesas para receber sugestões personalizadas." },
    { icon:"🎯", title:"Transforme economia em meta", text:"Definir um objetivo concreto pode ajudar a acompanhar seu progresso de forma simples e visual." },
    { icon:"📅", title:"Faça uma revisão periódica", text:"Reserve alguns minutos para observar receitas, despesas e categorias. Pequenos ajustes podem fazer diferença." }
  ];
  box.innerHTML = suggestions.map(s => `<div class="card suggestion"><div class="feature-icon">${s.icon}</div><h3>${s.title}</h3><p>${s.text}</p></div>`).join("");
}

function formatDate(value) {
  if (!value) return "";
  const [y,m,d] = value.split("-");
  return `${d}/${m}/${y}`;
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[c]));
}

function classify(description) {
  const d = description.toLowerCase();
  const rules = [
    ["Alimentação", ["mercado","supermercado","comida","restaurante","padaria","lanche","ifood"]],
    ["Transporte", ["uber","ônibus","onibus","gasolina","combustível","combustivel","transporte"]],
    ["Saúde", ["farmácia","farmacia","médico","medico","remédio","remedio","consulta"]],
    ["Moradia", ["aluguel","luz","água","agua","energia","condomínio","condominio"]],
    ["Educação", ["curso","livro","escola","faculdade"]],
    ["Lazer", ["cinema","passeio","lazer","viagem"]],
    ["Compras", ["roupa","presente","loja","compra"]]
  ];
  for (const [cat, words] of rules) if (words.some(w => d.includes(w))) return cat;
  return "Outros";
}

function parseTransaction(text) {
  const normalized = text.replace(/\./g, "").replace(",", ".");
  const amountMatch = normalized.match(/(?:r\$|\$)?\s*(\d+(?:\.\d{1,2})?)/i);
  if (!amountMatch) return null;
  const amount = Number(amountMatch[1]);
  if (!amount || !isFinite(amount)) return null;
  const lower = text.toLowerCase();
  const incomeWords = ["recebi", "salário", "salario", "ganhei", "renda", "entrada"];
  const isIncome = incomeWords.some(w => lower.includes(w));
  const type = isIncome ? "income" : "expense";
  let description = text
    .replace(/(?:gastei|paguei|recebi|ganhei|renda|entrada|salário|salario)/gi, "")
    .replace(/r\$\s*\d+(?:[.,]\d{1,2})?/gi, "")
    .replace(/\d+(?:[.,]\d{1,2})?/g, "")
    .replace(/\s+/g, " ").trim();
  if (!description) description = isIncome ? "Receita" : "Despesa";
  const category = isIncome ? "Salário" : classify(description);
  return { id: Date.now(), type, amount, description: capitalize(description), category, date: today() };
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

function getAgentResponse(text) {
  const lower = text.toLowerCase();
  if (lower.includes("como estão") || lower.includes("como estao") || lower.includes("resumo") || lower.includes("saldo")) {
    const {income, expense, balance} = totals();
    return `Até agora, você registrou ${money(income)} em receitas e ${money(expense)} em despesas. Seu saldo no protótipo é ${money(balance)}. Você pode abrir “Resumo Financeiro” para ver os detalhes.`;
  }
  if (lower.includes("meta")) return "Claro! Vá até a área “Metas” para criar um objetivo com nome, valor e prazo opcional. Depois você poderá acompanhar o progresso.";
  if (lower.includes("sugest") || lower.includes("econom")) return "Posso analisar suas categorias registradas e apresentar sugestões educativas. Acesse “Economia” para ver algumas ideias.";
  if (lower.includes("histórico") || lower.includes("historico")) return "Seu histórico fica disponível em “Resumo Financeiro”, com data, categoria, descrição e valor.";
  return "Entendi. Posso registrar uma receita ou despesa, consultar seu resumo, ajudar com metas ou mostrar sugestões de economia. Por exemplo: “Gastei R$ 80 no mercado.”";
}

function addMessage(role, text) {
  const messages = load(STORAGE.messages, []);
  messages.push({role, text});
  save(STORAGE.messages, messages);
  renderMessages();
}
function renderMessages() {
  const box = document.querySelector("#chatMessages");
  const messages = load(STORAGE.messages, []);
  box.innerHTML = messages.map(m => `<div class="message ${m.role === "user" ? "user" : "agent"}">${escapeHtml(m.text)}</div>`).join("");
  box.scrollTop = box.scrollHeight;
}

function handleChat(text) {
  const clean = text.trim();
  if (!clean) return;
  addMessage("user", clean);
  const transaction = parseTransaction(clean);
  if (transaction) {
    const tx = getTransactions();
    tx.push(transaction);
    save(STORAGE.transactions, tx);
    const verb = transaction.type === "income" ? "Registrei uma receita" : "Registrei";
    addMessage("agent", `${verb} de ${money(transaction.amount)} em ${transaction.category}. Está correto? (Protótipo: você pode revisar no Resumo Financeiro.)`);
    refresh();
  } else {
    addMessage("agent", getAgentResponse(clean));
  }
}

function setupNavigation() {
  document.querySelectorAll(".nav-btn").forEach(btn => btn.addEventListener("click", () => showSection(btn.dataset.section)));
  document.querySelectorAll(".quick-nav").forEach(btn => btn.addEventListener("click", () => showSection(btn.dataset.target)));
}
function showSection(id) {
  document.querySelectorAll(".page-section").forEach(s => s.classList.remove("active-section"));
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.toggle("active", b.dataset.section === id));
  document.getElementById(id).classList.add("active-section");
  window.scrollTo({top:0, behavior:"smooth"});
}

function setupChat() {
  document.querySelector("#chatForm").addEventListener("submit", e => {
    e.preventDefault();
    const input = document.querySelector("#chatInput");
    handleChat(input.value);
    input.value = "";
    input.focus();
  });
  document.querySelectorAll(".chip").forEach(chip => chip.addEventListener("click", () => handleChat(chip.dataset.message)));
  renderMessages();
}

function setupGoals() {
  document.querySelector("#goalForm").addEventListener("submit", e => {
    e.preventDefault();
    const goal = {
      id: Date.now(),
      name: document.querySelector("#goalName").value.trim(),
      target: Number(document.querySelector("#goalTarget").value),
      saved: Number(document.querySelector("#goalSaved").value || 0),
      date: document.querySelector("#goalDate").value
    };
    if (!goal.name || goal.target <= 0) return;
    const goals = getGoals(); goals.push(goal); save(STORAGE.goals, goals);
    e.target.reset(); document.querySelector("#goalSaved").value = 0; renderGoals();
    addMessage("agent", `Criei a meta “${goal.name}” com objetivo de ${money(goal.target)}.`);
  });
}

function refresh() {
  updateHomeAndSummary();
  renderHistory();
  renderCategories();
  renderGoals();
  renderSuggestions();
}

document.querySelector("#resetDataBtn").addEventListener("click", () => {
  const ok = confirm("Isso vai restaurar os dados demonstrativos. Deseja continuar?");
  if (!ok) return;
  localStorage.removeItem(STORAGE.transactions);
  localStorage.removeItem(STORAGE.goals);
  localStorage.removeItem(STORAGE.messages);
  seedData(); renderMessages(); refresh();
});

seedData();
setupNavigation();
setupChat();
setupGoals();
refresh();
