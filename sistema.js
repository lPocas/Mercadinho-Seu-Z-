
let db_estoque = JSON.parse(localStorage.getItem('m_estoque')) || [];
let db_dividas = JSON.parse(localStorage.getItem('m_dividas')) || [];
let db_logs = JSON.parse(localStorage.getItem('m_logs')) || [];
let db_vendas = JSON.parse(localStorage.getItem('m_vendas')) || [];


let usuarioLogado = localStorage.getItem('m_usuario_ativo') || "";
let cargoLogado = localStorage.getItem('m_cargo_ativo') || "";


window.addEventListener('DOMContentLoaded', () => {

    if (!usuarioLogado && !window.location.href.includes('index.html')) {
        window.location.href = 'index.html';
        return;
    }

    // Temas 
    if (cargoLogado === "Administrador") {
        document.body.className = 'mode-adm';
    } else if (cargoLogado === "Funcionário") {
        document.body.className = 'mode-funci';
        
       
        if (window.location.href.includes('dividas.html') || window.location.href.includes('lucros.html')) {
            alert("Acesso restrito a administradores!");
            window.location.href = 'dashboard.html';
        }
    }

    if (document.getElementById('userName')) document.getElementById('userName').innerText = cargoLogado;
    if (document.getElementById('welcomeName')) document.getElementById('welcomeName').innerText = cargoLogado;


    if (typeof atualizarTabelasPagina === "function") {
        atualizarTabelasPagina();
    }
});

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

function deslogar() {
    localStorage.removeItem('m_usuario_ativo');
    localStorage.removeItem('m_cargo_ativo');
    window.location.href = 'index.html';
}

function addLog(txt) {
    db_logs.unshift({ data: new Date().toLocaleString(), user: cargoLogado, acao: txt });
    localStorage.setItem('m_logs', JSON.stringify(db_logs));
}


const menuLateralTemplate = `
    <div class="brand">
        <img src="logo.jpg" alt="Logo">
        <h2>Mercadinho do Zé</h2>
    </div>
    <div class="menu">
        <a href="dashboard.html" id="m-dash"><i class="fa-solid fa-house-chimney"></i> <span>Dashboard</span></a>
        <a href="estoque.html" id="m-estoque"><i class="fa-solid fa-boxes-stacked"></i> <span>Estoque</span></a>
        ${cargoLogado === 'Administrador' ? '<a href="dividas.html" id="m-dividas"><i class="fa-solid fa-hand-holding-dollar"></i> <span>Dívidas</span></a>' : ''}
        ${cargoLogado === 'Administrador' ? '<a href="lucros.html" id="m-lucros"><i class="fa-solid fa-chart-line"></i> <span>Lucros</span></a>' : ''}
        <a href="historico.html" id="m-logs"><i class="fa-solid fa-clock-rotate-left"></i> <span>Histórico</span></a>
    </div>
`;