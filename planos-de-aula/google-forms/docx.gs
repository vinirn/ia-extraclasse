/** Execute criarFormulario_docx no Google Apps Script.
 * Arquivo independente; preserva a chave do formulário no mesmo projeto.
 */
function criarFormulario_docx() {
  const config = {
  "id": "docx",
  "titulo": "Organizar para DOCX",
  "criterio": "A estrutura ficou fácil de copiar e editar no editor de texto?"
};
  const PASTA_AVALIACOES_AVANCADAS = "1VIN3XAvxTJL1FDYt02Bg6k3Cgesxnxdm";
  const propriedades = PropertiesService.getScriptProperties();
  const chave = 'AVALIACAO_PROMPT_' + config.id.toUpperCase() + '_ID';
  const existente = propriedades.getProperty(chave);
  const formulario = existente ? FormApp.openById(existente)
    : FormApp.create('Avaliação crítica — ' + config.titulo, false);
  // Registra imediatamente para permitir retomar uma execução interrompida.
  if (!existente) propriedades.setProperty(chave, formulario.getId());
  if (formulario.getItems().length === 0) {
    const ias = ['Gemini', 'ChatGPT', 'Claude', 'Kimi', 'Deepseek', 'Maritaca', 'Mistral'];
    formulario.addCheckboxItem().setTitle('Quais IAs você testou?')
      .setHelpText('Marque todas as IAs testadas nesta atividade. Você pode selecionar mais de uma opção.')
      .setChoiceValues(ias).setRequired(true);
    const perguntas = [
      ['Qual IA produziu a resposta que você está avaliando?', ias],
      ['Qual é seu grau geral de satisfação com a resposta?',
        ['Muito insatisfeito(a)', 'Insatisfeito(a)', 'Nem satisfeito(a), nem insatisfeito(a)', 'Satisfeito(a)', 'Muito satisfeito(a)']],
      [config.criterio, ['Não', 'Em parte', 'Sim', 'Não consegui verificar']],
      ['A resposta parece útil para preparar sua aula?', ['Nada útil', 'Pouco útil', 'Razoavelmente útil', 'Muito útil']],
      ['A resposta combina com a realidade da sua turma?', ['Não combina', 'Combina pouco', 'Combina em parte', 'Combina muito']],
      ['Quanto você precisaria modificar antes de usar?', ['Quase nada', 'Poucas partes', 'Muitas partes', 'Precisaria refazer']],
      ['Qual é o principal problema da resposta?', ['Não seguiu as instruções', 'Muito genérica', 'Pouco adequada à turma', 'Informações incorretas ou não verificadas', 'Formato pouco útil', 'Não identifiquei problema importante']]
    ];
    perguntas.forEach(function (p) {
      formulario.addMultipleChoiceItem().setTitle(p[0]).setChoiceValues(p[1]).setRequired(true);
    });
    formulario.addParagraphTextItem().setTitle('O que você mudaria primeiro na resposta?').setRequired(false);
  }
  // Nunca apaga ou reconstrói perguntas de um formulário que já tenha itens.
  if (formulario.getItems().length !== 9) {
    throw new Error('Formulário incompleto; confira os itens antes de continuar: ' + formulario.getEditUrl());
  }
  formulario.setDescription('Avalie a resposta obtida com o prompt “' + config.titulo + '”. ' +
    'Confira o resultado antes de responder e registre o que precisaria melhorar. ' +
    (config.id === 'bncc' ? 'Compare códigos e descrições com a BNCC oficial e com o currículo da rede; uma resposta convincente não comprova correção curricular.' : 'As decisões pedagógicas e a revisão final continuam sendo do professor.'));
  formulario.setCollectEmail(false);
  formulario.setLimitOneResponsePerUser(false);
  formulario.setPublishingSummary(false);
  formulario.setShowLinkToRespondAgain(false);
  formulario.setConfirmationMessage('Resposta registrada. Use sua avaliação para melhorar o plano.');
  let idPlanilha = formulario.getDestinationId();
  if (!idPlanilha) {
    const chavePlanilha = chave + '_PLANILHA';
    idPlanilha = propriedades.getProperty(chavePlanilha);
    if (!idPlanilha) {
      idPlanilha = SpreadsheetApp.create('Respostas — ' + config.titulo).getId();
      propriedades.setProperty(chavePlanilha, idPlanilha);
    }
    formulario.setDestination(FormApp.DestinationType.SPREADSHEET, idPlanilha);
  }
  if (existente) limparColunasAntigas_docx(formulario, idPlanilha);
  if (PASTA_AVALIACOES_AVANCADAS) {
    const pasta = DriveApp.getFolderById(PASTA_AVALIACOES_AVANCADAS);
    DriveApp.getFileById(formulario.getId()).moveTo(pasta);
    DriveApp.getFileById(idPlanilha).moveTo(pasta);
  }
  formulario.setPublished(true);
  Logger.log(config.titulo + '\nEdição: ' + formulario.getEditUrl() +
    '\nRespostas: ' + formulario.getPublishedUrl() + '\nPlanilha: ' + SpreadsheetApp.openById(idPlanilha).getUrl());
}

// Remove da aba de respostas somente cabeçalhos sem pergunta atual no formulário.
// Uma cópia integral da aba é guardada antes da primeira exclusão.
function limparColunasAntigas_docx(formulario, idPlanilha) {
  const planilha = SpreadsheetApp.openById(idPlanilha);
  const abas = planilha.getSheets().filter(function (aba) {
    const url = aba.getFormUrl();
    return !aba.getName().startsWith('Backup respostas ') &&
      url && url.indexOf(formulario.getId()) !== -1;
  });
  if (abas.length !== 1) {
    throw new Error('Não foi possível identificar uma única aba de respostas vinculada ao formulário. Confira a planilha: ' + planilha.getUrl());
  }
  const aba = abas[0];
  const ultimaColuna = aba.getLastColumn();
  if (ultimaColuna < 2) return;

  function normalizar(texto) {
    return String(texto || '').replace(/\s+/g, ' ').trim().toLocaleLowerCase('pt-BR');
  }
  const titulosAtuais = new Set(formulario.getItems().map(function (item) {
    return normalizar(item.getTitle());
  }));
  const colunasSistema = new Set([
    'carimbo de data/hora', 'timestamp', 'endereço de e-mail',
    'email address', 'e-mail', 'email'
  ]);
  const cabecalhos = aba.getRange(1, 1, 1, ultimaColuna).getDisplayValues()[0];
  const encontrados = new Set();
  const antigas = [];
  // Percorre da direita para a esquerda: perguntas recriadas ficam na coluna mais recente.
  for (let coluna = ultimaColuna; coluna >= 2; coluna--) {
    const titulo = normalizar(cabecalhos[coluna - 1]);
    if (!titulo || colunasSistema.has(titulo)) continue;
    if (titulosAtuais.has(titulo) && !encontrados.has(titulo)) {
      encontrados.add(titulo);
    } else {
      antigas.push(coluna);
    }
  }
  if (antigas.length === 0) {
    Logger.log('Nenhuma coluna de pergunta antiga na aba ' + aba.getName() + '.');
    return;
  }

  const copia = aba.copyTo(planilha);
  copia.setName('Backup respostas ' + Date.now());
  copia.hideSheet();
  antigas.forEach(function (coluna) { aba.deleteColumn(coluna); });
  Logger.log('Colunas antigas removidas de ' + aba.getName() + ': ' + antigas.length +
    '. Cópia anterior preservada na aba ' + copia.getName() + '.');
}
