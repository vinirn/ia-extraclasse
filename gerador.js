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
  entrada.required = true;
  if (campo.control === "textarea") entrada.rows = 3;
  else entrada.type = "text";
  if (campo.placeholder) entrada.placeholder = campo.placeholder;

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
    linhas[indice] = `${campo.label}: ${valor}`;
  }

  return linhas.join("\n").trimEnd();
}

async function iniciar() {
  try {
    configuracao = JSON.parse(await carregarTexto(pagina.dataset.promptConfig));
    modelo = await carregarTexto(configuracao.template);
    montarFormulario(configuracao.groups);
    botaoGerar.disabled = false;
    mensagem.textContent = "Preencha os campos para gerar o prompt.";
  } catch (erro) {
    mensagem.textContent = erro.message;
  }
}

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  // Os dados existem apenas em variáveis desta página; não são enviados nem salvos.
  const valores = Object.fromEntries(
    configuracao.groups.flatMap((group) => group.fields).map((campo) => [
      campo.id, document.getElementById(campo.id).value.trim(),
    ])
  );

  try {
    promptGerado = gerarTexto(valores);
    textoPrompt.textContent = promptGerado;
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
  promptGerado = "";
  textoPrompt.textContent = "";
  resultado.hidden = true;
  mensagem.textContent = "Campos limpos.";
});

copiarPrompt.addEventListener("click", async () => {
  if (!promptGerado) return;
  try {
    await navigator.clipboard.writeText(promptGerado);
    mensagem.textContent = "Prompt copiado.";
  } catch {
    mensagem.textContent = "Não foi possível copiar automaticamente. Selecione o texto acima para copiá-lo.";
    textoPrompt.focus();
  }
});

iniciar();
