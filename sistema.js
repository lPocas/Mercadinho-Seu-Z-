let db_estoque = JSON.parse(localStorage.getItem('m_estoque')) || [];
let db_dividas = JSON.parse(localStorage.getItem('m_dividas')) || [];
let db_logs = JSON.parse(localStorage.getItem('m_logs')) || [];
let db_vendas = JSON.parse(localStorage.getItem('m_vendas')) || [];

let usuarioLogado = localStorage.getItem('m_usuario_ativo') || "";
let cargoLogado = localStorage.getItem('m_cargo_ativo') || "";


// =======================
// 🔐 SISTEMA BASE
// =======================

window.addEventListener('DOMContentLoaded', () => {

    if (!usuarioLogado && !window.location.href.includes('index.html')) {
        window.location.href = 'index.html';
        return;
    }

    // 🎨 tema por cargo
    if (cargoLogado === "Administrador") {
        document.body.className = 'mode-adm';
    } else if (cargoLogado === "Funcionário") {
        document.body.className = 'mode-funci';

        const restritas = ['dividas.html', 'lucros.html'];

        if (restritas.some(p => window.location.href.includes(p))) {
            alert("Acesso restrito a administradores!");
            window.location.href = 'dashboard.html';
            return;
        }
    }

    // 👤 nome na tela
    if (document.getElementById('userName'))
        document.getElementById('userName').innerText = cargoLogado;

    if (document.getElementById('welcomeName'))
        document.getElementById('welcomeName').innerText = cargoLogado;

    // 📊 página ativa
    if (typeof atualizarTabelasPagina === "function") {
        atualizarTabelasPagina();
    }
});


// =======================
// 🔑 LOGIN
// =======================

function logar() {
    const u = document.getElementById('user').value;
    const s = document.getElementById('pass').value;

    if (u === 'adm' && s === 'corinthians') {
        localStorage.setItem('m_usuario_ativo', 'adm');
        localStorage.setItem('m_cargo_ativo', 'Administrador');
        window.location.href = 'dashboard.html';

    } else if (u === 'usuario' && s === '01091910') {
        localStorage.setItem('m_usuario_ativo', 'usuario');
        localStorage.setItem('m_cargo_ativo', 'Funcionário');
        window.location.href = 'dashboard.html';

    } else {
        alert('Usuário ou senha incorretos!');
    }
}


// =======================
// 🚪 LOGOUT
// =======================

function deslogar() {
    localStorage.removeItem('m_usuario_ativo');
    localStorage.removeItem('m_cargo_ativo');
    window.location.href = 'index.html';
}


// =======================
// 🧾 LOGS
// =======================

function addLog(txt) {
    db_logs.unshift({
        data: new Date().toISOString(),
        user: usuarioLogado,
        cargo: cargoLogado,
        acao: txt
    });

    localStorage.setItem('m_logs', JSON.stringify(db_logs));
}


// =======================
// 💰 PRECIFICAÇÃO
// =======================

function calcularPrecoVenda() {

    const nome = document.getElementById('nomeProduto').value;
    const custo = parseFloat(document.getElementById('precoCusto').value);
    const porcentagem = parseFloat(document.getElementById('porcentagemLucro').value);

    if (!nome || isNaN(custo) || isNaN(porcentagem)) {
        alert('Preencha todos os campos corretamente.');
        return;
    }

    const lucroUnitario = custo * (porcentagem / 100);
    const precoFinal = custo + lucroUnitario;

    document.getElementById('resultadoPreco').innerHTML = `
        <strong>Preço de venda:</strong> R$ ${precoFinal.toFixed(2)} <br>
        <strong>Lucro por unidade:</strong> R$ ${lucroUnitario.toFixed(2)}
    `;

    db_estoque.push({
        nome,
        custo,
        porcentagem,
        precoFinal,
        lucroUnitario,
        quantidade: 1,
        data: new Date().toISOString()
    });

    localStorage.setItem('m_estoque', JSON.stringify(db_estoque));

    addLog(`Cadastrou produto ${nome} com precificação`);
}


// =======================
// 📊 RESUMO GERAL
// =======================

function calcularResumoLucros() {

    const lucroTotal = db_estoque.reduce((total, item) => {
        return total + (item.lucroUnitario * (item.quantidade || 1));
    }, 0);

    return {
        lucroTotal,
        totalProdutos: db_estoque.length
    };
}


// =======================
// 📅 LUCRO POR DIA
// =======================

function lucroPorDia() {

    const hoje = new Date().toISOString().split('T')[0];

    return db_estoque
        .filter(item => item.data.split('T')[0] === hoje)
        .reduce((total, item) => {
            return total + (item.lucroUnitario * (item.quantidade || 1));
        }, 0);
}


// =======================
// 📆 LUCRO POR MÊS
// =======================

function lucroPorMes() {

    const mesAtual = new Date().toISOString().slice(0, 7);

    return db_estoque
        .filter(item => item.data.slice(0, 7) === mesAtual)
        .reduce((total, item) => {
            return total + (item.lucroUnitario * (item.quantidade || 1));
        }, 0);
}


// =======================
// 📈 ATUALIZAR TELA LUCROS
// =======================

function atualizarLucrosPeriodo() {

    const dia = lucroPorDia();
    const mes = lucroPorMes();
    const total = calcularResumoLucros().lucroTotal;

    if (document.getElementById('lucroDia'))
        document.getElementById('lucroDia').innerText = `R$ ${dia.toFixed(2)}`;

    if (document.getElementById('lucroMes'))
        document.getElementById('lucroMes').innerText = `R$ ${mes.toFixed(2)}`;

    if (document.getElementById('lucroTotal'))
        document.getElementById('lucroTotal').innerText = `R$ ${total.toFixed(2)}`;
}


// =======================
// 🧭 MENU
// =======================

const menuLateralTemplate = `
    <div class="brand">
        <img src="logo.jpg" alt="Logo">
        <h2>Mercadinho do Zé</h2>
    </div>
    <div class="menu">
        <a href="dashboard.html"><i class="fa-solid fa-house-chimney"></i> Dashboard</a>
        <a href="estoque.html"><i class="fa-solid fa-boxes-stacked"></i> Estoque</a>
        ${cargoLogado === 'Administrador' ? '<a href="dividas.html"><i class="fa-solid fa-hand-holding-dollar"></i> Dívidas</a>' : ''}
        ${cargoLogado === 'Administrador' ? '<a href="lucros.html"><i class="fa-solid fa-chart-line"></i> Lucros</a>' : ''}
        <a href="historico.html"><i class="fa-solid fa-clock-rotate-left"></i> Histórico</a>
    </div>
`;
