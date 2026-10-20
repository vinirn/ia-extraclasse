/** Execute criarFormulario_variacoes no Google Apps Script.
 * Arquivo independente; preserva a chave do formulário no mesmo projeto.
 */
function criarFormulario_variacoes() {
  const config = {
  "id": "variacoes",
  "titulo": "Criar variações do plano",
  "criterio": "As três variações preservaram o objetivo central do plano?"
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
  if (PASTA_AVALIACOES_AVANCADAS) {
    const pasta = DriveApp.getFolderById(PASTA_AVALIACOES_AVANCADAS);
    DriveApp.getFileById(formulario.getId()).moveTo(pasta);
    DriveApp.getFileById(idPlanilha).moveTo(pasta);
  }
  formulario.setPublished(true);
  Logger.log(config.titulo + '\nEdição: ' + formulario.getEditUrl() +
    '\nRespostas: ' + formulario.getPublishedUrl() + '\nPlanilha: ' + SpreadsheetApp.openById(idPlanilha).getUrl());
}
