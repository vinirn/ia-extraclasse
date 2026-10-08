const formulario = document.querySelector("#formulario-prompt");
const resultado = document.querySelector("#resultado");
const textoPrompt = document.querySelector("#texto-prompt");
const copiarPrompt = document.querySelector("#copiar-prompt");
const mensagem = document.querySelector("#mensagem");

const campos = [
  ["disciplina", "Disciplina"],
  ["ano-serie", "Ano/série"],
  ["duracao", "Duração"],
  ["tema", "Tema"],
  ["conteudo", "Conteúdo"],
  ["objetivo", "Objetivo principal"],
  ["perfil-turma", "Perfil da turma"],
  ["recursos", "Recursos disponíveis"],
  ["avaliacao", "Forma de avaliação"],
];

let modeloBasico;
let promptGerado = "";

async function carregarModelo() {
  if (modeloBasico !== undefined) return modeloBasico;

  const resposta = await fetch("prompts/basico.txt");
  if (!resposta.ok) throw new Error("Não foi possível carregar o prompt básico.");

  modeloBasico = await resposta.text();
  return modeloBasico;
}

function gerarTexto(modelo, valores) {
  const linhas = modelo.replace(/\r\n/g, "\n").split("\n");

  for (const [id, rotulo] of campos) {
    const indice = linhas.indexOf(`${rotulo}:`);
    if (indice === -1) throw new Error(`O campo “${rotulo}” não foi encontrado no modelo.`);

    // Cada valor permanece em uma linha do prompt, mesmo se veio de um textarea.
    const valor = valores[id].replace(/\s*\n\s*/g, " ").trim();
    linhas[indice] = `${rotulo}: ${valor}`;
  }

  return linhas.join("\n").trimEnd();
}

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  mensagem.textContent = "Gerando prompt…";

  // Os dados são guardados apenas em variáveis desta página.
  const valores = Object.fromEntries(
    campos.map(([id]) => [id, document.getElementById(id).value.trim()])
  );

  try {
    promptGerado = gerarTexto(await carregarModelo(), valores);
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
