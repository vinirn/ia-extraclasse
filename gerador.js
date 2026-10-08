const pagina = document.querySelector("[data-prompt-config]");
const formulario = document.querySelector("#formulario-prompt");
const gruposCampos = document.querySelector("#grupos-campos");
const botaoGerar = document.querySelector("#gerar-prompt");
const resultado = document.querySelector("#resultado");
const textoPrompt = document.querySelector("#texto-prompt");
const copiarPrompt = document.querySelector("#copiar-prompt");
const mensagem = document.querySelector("#mensagem");

let configuracao;
let modelo;
let promptGerado = "";
let compartilhamentoDisponivel = true;
const prefixoSessao = "ia-extraclasse:campo:";

function chaveCompartilhada(campo) {
  return campo.sharedKey ? `${prefixoSessao}${campo.sharedKey}` : null;
}

function lerCompartilhado(campo) {
  const chave = chaveCompartilhada(campo);
  if (!chave) return null;
  try {
    return sessionStorage.getItem(chave);
  } catch {
    compartilhamentoDisponivel = false;
    return null;
  }
}

function salvarCompartilhado(campo, valor) {
  const chave = chaveCompartilhada(campo);
  if (!chave) return;
  try {
    if (valor) sessionStorage.setItem(chave, valor);
    else sessionStorage.removeItem(chave);
  } catch {
    compartilhamentoDisponivel = false;
  }
}

function limparChavesAntigas(chaves) {
  for (const chave of chaves ?? []) {
    try {
      sessionStorage.removeItem(`${prefixoSessao}${chave}`);
    } catch {
      compartilhamentoDisponivel = false;
    }
  }
}

async function carregarTexto(caminho) {
  const resposta = await fetch(caminho);
  if (!resposta.ok) throw new Error(`Não foi possível carregar ${caminho}.`);
  return resposta.text();
}

function criarCampo(campo) {
  const caixa = document.createElement("div");
  caixa.className = `field${campo.control === "textarea" ? " field-wide" : ""}`;

  const rotulo = document.createElement("label");
  rotulo.htmlFor = campo.id;
  rotulo.textContent = campo.label;

  const entrada = document.createElement(campo.control === "textarea" ? "textarea" : "input");
  entrada.id = campo.id;
  entrada.name = campo.id;
  entrada.required = campo.required !== false;
  if (campo.control === "textarea") entrada.rows = 3;
  else entrada.type = "text";
  if (campo.placeholder) entrada.placeholder = campo.placeholder;
  entrada.autocomplete = "off";
  entrada.value = lerCompartilhado(campo) ?? "";
  entrada.addEventListener("input", () => salvarCompartilhado(campo, entrada.value));

  caixa.append(rotulo, entrada);
  return caixa;
}

function montarFormulario(groups) {
  for (const group of groups) {
    const secao = document.createElement("fieldset");
    secao.className = "form-section";

    const titulo = document.createElement("legend");
    titulo.textContent = group.title;

    const grade = document.createElement("div");
    grade.className = "form-grid";
    for (const campo of group.fields) grade.append(criarCampo(campo));

    secao.append(titulo, grade);
    gruposCampos.append(secao);
  }
}

function gerarTexto(valores) {
  const linhas = modelo.replace(/\r\n/g, "\n").split("\n");

  for (const campo of configuracao.groups.flatMap((group) => group.fields)) {
    const indice = linhas.indexOf(`${campo.label}:`);
    if (indice === -1) throw new Error(`O campo “${campo.label}” não foi encontrado no modelo.`);

    const valor = valores[campo.id].replace(/\s*\n\s*/g, " ").trim();
    if (!valor && campo.required === false) {
      linhas.splice(indice, 1);
      continue;
    }
    linhas[indice] = `${campo.label}: ${valor}`;
  }

  return linhas.join("\n").trimEnd();
}

async function iniciar() {
  try {
    configuracao = JSON.parse(await carregarTexto(pagina.dataset.promptConfig));
    modelo = await carregarTexto(configuracao.template);
    limparChavesAntigas(configuracao.legacySharedKeys);
    montarFormulario(configuracao.groups);
    botaoGerar.disabled = false;
    mensagem.textContent = compartilhamentoDisponivel
      ? "Preencha os campos para gerar o prompt. A identificação da aula pode ser usada em outros geradores nesta aba."
      : "Preencha os campos para gerar o prompt. O navegador não permitiu compartilhar a identificação nesta aba.";
  } catch (erro) {
    mensagem.textContent = erro.message;
  }
}

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  // Os dados são locais ao navegador; os campos compartilhados usam sessionStorage.
  const valores = Object.fromEntries(
    configuracao.groups.flatMap((group) => group.fields).map((campo) => [
      campo.id, document.getElementById(campo.id).value.trim(),
    ])
  );

  try {
    promptGerado = gerarTexto(valores);
    textoPrompt.value = promptGerado;
    resultado.hidden = false;
    mensagem.textContent = "Prompt gerado. Confira o resultado antes de copiar.";
    resultado.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (erro) {
    resultado.hidden = true;
    promptGerado = "";
    mensagem.textContent = erro.message;
  }
});

formulario.addEventListener("reset", () => {
  if (configuracao) {
    for (const campo of configuracao.groups.flatMap((group) => group.fields)) {
      salvarCompartilhado(campo, "");
    }
  }
  promptGerado = "";
  textoPrompt.value = "";
  resultado.hidden = true;
  mensagem.textContent = "Campos e dados compartilhados de identificação limpos.";
});

copiarPrompt.addEventListener("click", async () => {
  if (!promptGerado) return;
  try {
    await navigator.clipboard.writeText(promptGerado);
    mensagem.textContent = "Prompt copiado.";
  } catch {
    mensagem.textContent = "Não foi possível copiar automaticamente. Selecione o texto acima para copiá-lo.";
    textoPrompt.focus();
    textoPrompt.select();
  }
});

iniciar();
