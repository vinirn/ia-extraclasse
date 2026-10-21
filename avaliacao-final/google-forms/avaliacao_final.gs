/**
 * Avaliação final — IA no trabalho docente.
 * Cole no Google Apps Script e execute criarFormularioAvaliacaoFinalCurso.
 * Reexecute no mesmo projeto para reutilizar formulário e planilha.
 */
function criarFormularioAvaliacaoFinalCurso() {
  const titulo = 'Avaliação final do curso — IA no trabalho docente';
  // Pasta usada pelas avaliações do curso. Deixe vazio para usar Meu Drive.
  const pastaId = '1VIN3XAvxTJL1FDYt02Bg6k3Cgesxnxdm';
  const chave = 'AVALIACAO_FINAL_CURSO_IA_ID';
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const props = PropertiesService.getScriptProperties();
    const id = props.getProperty(chave);
    const form = id ? FormApp.openById(id) : FormApp.create(titulo, false);
    if (!id) props.setProperty(chave, form.getId());

    if (form.getItems().length === 0) {
      const perguntas = [
        ['Qual é seu grau geral de satisfação com o curso?',
          ['Muito insatisfeito(a)', 'Insatisfeito(a)', 'Nem satisfeito(a), nem insatisfeito(a)', 'Satisfeito(a)', 'Muito satisfeito(a)']],
        ['Como você avalia a clareza das explicações?',
          ['Muito ruim', 'Ruim', 'Regular', 'Boa', 'Muito boa']],
        ['Quanto os conteúdos e as atividades são úteis para seu trabalho docente?',
          ['Nada úteis', 'Pouco úteis', 'Razoavelmente úteis', 'Muito úteis', 'Extremamente úteis']],
        ['Como foi o tempo disponível para as atividades práticas?',
          ['Muito insuficiente', 'Insuficiente', 'Adequado', 'Mais do que o necessário', 'Não participei das atividades práticas']],
        ['Como você avalia os materiais de apoio e os geradores de prompts?',
          ['Muito ruins', 'Ruins', 'Regulares', 'Bons', 'Muito bons', 'Não utilizei']],
        ['Após o curso, quão confiante você se sente para usar IA no trabalho docente, revisando os resultados?',
          ['Nada confiante', 'Pouco confiante', 'Moderadamente confiante', 'Muito confiante', 'Extremamente confiante']]
      ];
      perguntas.forEach(function (p) {
        form.addMultipleChoiceItem().setTitle(p[0]).setChoiceValues(p[1]).setRequired(true);
      });
      form.addParagraphTextItem()
        .setTitle('O que foi mais útil no curso?')
        .setHelpText('Pode citar um conteúdo, uma atividade ou um material.')
        .setRequired(false);
      form.addParagraphTextItem()
        .setTitle('Que sugestões você tem para melhorar o curso?')
        .setHelpText('Comente sobre conteúdos, explicações, organização, duração, atividades práticas ou materiais.')
        .setRequired(false);
      form.addParagraphTextItem()
        .setTitle('Que atividades extraclasse do trabalho docente você gostaria de aprender a realizar com apoio de IA?')
        .setHelpText('Exemplos: elaborar avaliações e questões, preparar gabaritos e rubricas, adaptar materiais, planejar atividades de recuperação ou organizar relatórios. Descreva sua necessidade e, se possível, indique sua prioridade.')
        .setRequired(false);
    }
    // Preserva perguntas, personalizações e respostas de formulários existentes.
    if (form.getItems().length !== 9) {
      throw new Error('Confira o formulário antes de continuar; eram esperadas 9 perguntas. Nenhum item foi apagado. Edição: ' + form.getEditUrl());
    }
    form.setDescription('Conte como foi sua experiência e ajude a planejar as próximas formações. ' +
      'Tempo estimado: 3 a 5 minutos. O formulário não solicita nome nem coleta e-mail. ' +
      'Os campos abertos são opcionais; não inclua dados pessoais de estudantes.');
    form.setCollectEmail(false);
    form.setLimitOneResponsePerUser(false);
    form.setPublishingSummary(false);
    form.setShowLinkToRespondAgain(false);
    form.setConfirmationMessage('Obrigado pelo feedback! Suas sugestões ajudarão a melhorar o curso e a escolher as próximas atividades.');

    let planilhaId = form.getDestinationId();
    if (!planilhaId) {
      const chavePlanilha = chave + '_PLANILHA';
      planilhaId = props.getProperty(chavePlanilha);
      if (!planilhaId) {
        planilhaId = SpreadsheetApp.create('Respostas — ' + titulo).getId();
        props.setProperty(chavePlanilha, planilhaId);
      }
      form.setDestination(FormApp.DestinationType.SPREADSHEET, planilhaId);
    }
    if (pastaId) {
      const pasta = DriveApp.getFolderById(pastaId);
      DriveApp.getFileById(form.getId()).moveTo(pasta);
      DriveApp.getFileById(planilhaId).moveTo(pasta);
    }
    form.setPublished(true);
    const links = {
      edicao: form.getEditUrl(),
      respostas: form.getPublishedUrl(),
      planilha: SpreadsheetApp.openById(planilhaId).getUrl()
    };
    Logger.log('Edição: ' + links.edicao + '\nResponder: ' + links.respostas + '\nPlanilha: ' + links.planilha);
    return links;
  } finally {
    lock.releaseLock();
  }
}
