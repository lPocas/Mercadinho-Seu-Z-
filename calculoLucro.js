// ===== SISTEMA DE LUCRO AUTOMÁTICO =====

function calcularPrecoVenda(precoCusto, porcentagemLucro) {

  precoCusto = Number(precoCusto);

  porcentagemLucro = Number(porcentagemLucro);

  if (isNaN(precoCusto) || precoCusto <= 0) {
    return 0;
  }

  if (isNaN(porcentagemLucro) || porcentagemLucro < 0) {
    return precoCusto;
  }

  const valorLucro = precoCusto * (porcentagemLucro / 100);

  const precoVenda = precoCusto + valorLucro;

  return Number(precoVenda.toFixed(2));

}

// Atualiza automaticamente os campos da tela
function ativarCalculoAutomatico() {

  const custo = document.getElementById("precoCusto");

  const lucro = document.getElementById("porcentagemLucro");

  const venda = document.getElementById("precoVenda");

  if (!custo || !lucro || !venda) {
    return;
  }

  function atualizar() {

    venda.value = calcularPrecoVenda(
      custo.value,
      lucro.value
    );

  }

  custo.addEventListener("input", atualizar);

  lucro.addEventListener("input", atualizar);

}

document.addEventListener(
  "DOMContentLoaded",
  ativarCalculoAutomatico
);
