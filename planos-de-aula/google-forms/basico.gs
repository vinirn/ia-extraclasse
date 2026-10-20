/**
 * Execute criarFormularioAvaliacaoCritica em script.google.com.
 * O formulário e a planilha serão criados na conta Google que autorizar o script.
 */
function criarFormularioAvaliacaoCritica() {
  const titulo = 'Avaliação crítica do plano de aula — prompt básico';
  // Cole o link da pasta (https://drive.google.com/drive/folders/...) ou seu ID.
  // Com o campo vazio, os arquivos ficam na raiz do Meu Drive.
  const pastaDrive = 'https://drive.google.com/drive/folders/1VIN3XAvxTJL1FDYt02Bg6k3Cgesxnxdm';
  const idPasta = pastaDrive.trim().match(/\/folders\/([^/?#]+)/);
  const pastaDestino = pastaDrive.trim()
    ? DriveApp.getFolderById(idPasta ? idPasta[1] : pastaDrive.trim())
    : null;
  if (pastaDestino) {
    Logger.log('Pasta de destino: ' + pastaDestino.getName() + ' (' + pastaDestino.getId() + ')');
  }

  const propriedades = PropertiesService.getScriptProperties();
  const idExistente = propriedades.getProperty('FORMULARIO_AVALIACAO_CRITICA_ID');
  if (idExistente) {
    const formularioExistente = FormApp.openById(idExistente);
    configurarFormulario(formularioExistente, titulo);
    atualizarPerguntas(formularioExistente);
    const idPlanilhaExistente = formularioExistente.getDestinationId();
    if (!idPlanilhaExistente) {
      throw new Error('O formulário existente não possui planilha vinculada. Abra o link de edição e confira a aba Respostas.');
    }
    limparColunasAntigas_basico(formularioExistente, idPlanilhaExistente);
    if (pastaDestino) {
      moverEConferir(formularioExistente.getId(), pastaDestino, 'Formulário');
      moverEConferir(idPlanilhaExistente, pastaDestino, 'Planilha');
    }
    Logger.log('Formulário já criado: ' + formularioExistente.getEditUrl());
    Logger.log('Link para respostas: ' + formularioExistente.getPublishedUrl());
    Logger.log('Planilha: ' + SpreadsheetApp.openById(idPlanilhaExistente).getUrl());
    return;
  }

  const formulario = FormApp.create(titulo, false);
  configurarFormulario(formulario, titulo);
  atualizarPerguntas(formulario);

  const planilha = SpreadsheetApp.create('Respostas — satisfação com planos de aula');
  formulario.setDestination(FormApp.DestinationType.SPREADSHEET, planilha.getId());
  formulario.setPublished(true);
  // Registre os IDs antes de mover: uma falha na movimentação não criará duplicatas.
  propriedades.setProperty('FORMULARIO_AVALIACAO_CRITICA_ID', formulario.getId());
  if (pastaDestino) {
    moverEConferir(formulario.getId(), pastaDestino, 'Formulário');
    moverEConferir(planilha.getId(), pastaDestino, 'Planilha');
  }

  Logger.log('Edição: ' + formulario.getEditUrl());
  Logger.log('Link para respostas: ' + formulario.getPublishedUrl());
  Logger.log('Planilha: ' + planilha.getUrl());
}

function configurarFormulario(formulario, titulo) {
  formulario.setTitle(titulo);
  formulario.setDescription(
    'O prompt básico é inadequado para uso direto no planejamento docente e é apresentado apenas para fins didáticos. ' +
    'O objetivo da atividade é identificar suas limitações e discutir como melhorá-lo; o plano gerado não deve ser aplicado sem revisão pedagógica. ' +
    'Avalie apenas o plano de aula gerado pelo prompt básico. ' +
    'Considere o quanto ele é específico, útil e adequado para sua turma. ' +
    'A análise da BNCC será feita em outra etapa.'
  );
  formulario.setCollectEmail(false);
  formulario.setLimitOneResponsePerUser(false);
  formulario.setPublishingSummary(false);
  formulario.setShowLinkToRespondAgain(false);
  formulario.setConfirmationMessage('Resposta registrada. Use sua avaliação para decidir o que melhorar no plano.');
}

function atualizarPerguntas(formulario) {
  const perguntaIAsTestadas = 'Quais IAs você testou?';
  const opcoesIAs = ['Gemini', 'ChatGPT', 'Claude', 'Kimi', 'Deepseek', 'Maritaca', 'Mistral'];
  const perguntas = [
    ['Qual IA você escolheu para gerar o plano de aula?',
      opcoesIAs],
    ['Qual é seu grau geral de satisfação com o plano gerado?',
      ['Muito insatisfeito(a)', 'Insatisfeito(a)', 'Nem satisfeito(a), nem insatisfeito(a)', 'Satisfeito(a)', 'Muito satisfeito(a)']],
    ['O plano gerado ficou específico o suficiente para a aula que você pediu?',
      ['Muito genérico', 'Um pouco genérico', 'Na medida certa', 'Detalhado demais']],
    ['O plano gerado parece útil para preparar sua aula?',
      ['Nada útil', 'Pouco útil', 'Razoavelmente útil', 'Muito útil']],
    ['O plano gerado combina com a realidade da sua turma?',
      ['Não combina', 'Combina pouco', 'Combina em parte', 'Combina muito']],
    ['Quanto você precisaria modificar o plano antes de usá-lo?',
      ['Quase nada', 'Poucas partes', 'Muitas partes', 'Precisaria refazer o plano']],
    ['Qual é o principal problema do plano gerado?',
      ['Muito genérico', 'Atividades pouco úteis', 'Pouco adequado à turma', 'Tempo ou recursos pouco realistas', 'Avaliação pouco útil', 'Não identifiquei problema importante']]
  ];
  const perguntaAberta = 'O que você mudaria primeiro no plano gerado?';
  const titulosEsperados = [perguntaIAsTestadas].concat(
    perguntas.map(function (pergunta) { return pergunta[0]; }), perguntaAberta
  );
  const itens = formulario.getItems();
  const titulosAtuais = itens.map(function (item) { return item.getTitle(); });
  if (JSON.stringify(titulosAtuais) === JSON.stringify(titulosEsperados)) {
    Logger.log('Perguntas de satisfação já estão atualizadas.');
    return;
  }
  const totalRespostas = formulario.getResponses().length;
  if (totalRespostas > 0) {
    throw new Error(
      'O formulário tem ' + totalRespostas + ' resposta(s). As perguntas não foram alteradas para evitar misturar ' +
      'resultados antigos e novos. Confira as respostas existentes antes de atualizar.'
    );
  }
  for (let indice = itens.length - 1; indice >= 0; indice--) {
    formulario.deleteItem(indice);
  }
  formulario.addCheckboxItem()
    .setTitle(perguntaIAsTestadas)
    .setHelpText('Marque todas as IAs que você testou. Você pode selecionar mais de uma opção.')
    .setChoiceValues(opcoesIAs)
    .setRequired(true);
  perguntas.forEach(function (pergunta) {
    formulario.addMultipleChoiceItem()
      .setTitle(pergunta[0])
      .setChoiceValues(pergunta[1])
      .setRequired(true);
  });
  formulario.addParagraphTextItem()
    .setTitle(perguntaAberta)
    .setRequired(false);
  Logger.log('Perguntas de satisfação atualizadas no mesmo formulário.');
}

function moverEConferir(idArquivo, pastaDestino, tipo) {
  const arquivo = DriveApp.getFileById(idArquivo);
  arquivo.moveTo(pastaDestino);
  const pais = arquivo.getParents();
  const nomes = [];
  let encontrado = false;
  while (pais.hasNext()) {
    const pai = pais.next();
    nomes.push(pai.getName() + ' (' + pai.getId() + ')');
    encontrado = encontrado || pai.getId() === pastaDestino.getId();
  }
  Logger.log(tipo + ' agora está em: ' + (nomes.join(', ') || '[sem pasta]'));
  if (!encontrado) {
    throw new Error(tipo + ' não aparece na pasta de destino após a movimentação. ID do arquivo: ' + idArquivo);
  }
}

// Remove da aba de respostas somente cabeçalhos sem pergunta atual no formulário.
// Uma cópia integral da aba é guardada antes da primeira exclusão.
function limparColunasAntigas_basico(formulario, idPlanilha) {
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
