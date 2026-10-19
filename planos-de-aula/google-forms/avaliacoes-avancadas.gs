/** Cole este arquivo em um projeto do Google Apps Script.
 * Execute criarTodosFormulariosAvancados ou uma função criarFormulario_*.
 * Não substitui o formulário de avaliação do prompt básico.
 */
const AVALIACOES_AVANCADAS = [
  {
    "id": "detalhado",
    "titulo": "Planejamento detalhado pelo docente",
    "criterio": "A resposta respeitou as atividades e decisões especificadas pelo docente, sinalizando sugestões de mudança?"
  },
  {
    "id": "bncc",
    "titulo": "Relacionar o plano à BNCC",
    "criterio": "A relação entre habilidades, objetivos, atividades e avaliação ficou coerente?"
  },
  {
    "id": "temas_transversais",
    "titulo": "Integrar temas transversais ao plano",
    "criterio": "O tema transversal foi integrado às atividades e à avaliação, além de aparecer no título ou em uma mensagem final?"
  },
  {
    "id": "ideias_soltas",
    "titulo": "Transformar ideias soltas em plano",
    "criterio": "O plano preservou suas ideias e as organizou em uma sequência viável?"
  },
  {
    "id": "adaptar_plano",
    "titulo": "Adaptar um plano existente",
    "criterio": "A adaptação atendeu às necessidades da nova turma?"
  },
  {
    "id": "plano_enxuto",
    "titulo": "Criar um plano enxuto",
    "criterio": "O checklist ficou conciso sem omitir etapas essenciais?"
  },
  {
    "id": "poucos_recursos",
    "titulo": "Planejar com poucos recursos",
    "criterio": "A aula é viável sem internet, projetor ou materiais impressos?"
  },
  {
    "id": "texto_simples",
    "titulo": "Organizar em texto simples",
    "criterio": "O resultado ficou fácil de copiar e usar, sem tabelas?"
  },
  {
    "id": "tabela",
    "titulo": "Organizar em tabela",
    "criterio": "A tabela contém as duas colunas e todos os campos solicitados?"
  },
  {
    "id": "docx",
    "titulo": "Organizar para DOCX",
    "criterio": "A estrutura ficou fácil de copiar e editar no editor de texto?"
  },
  {
    "id": "modelo_escola",
    "titulo": "Preencher o modelo da escola",
    "criterio": "A resposta preservou a estrutura e os campos do modelo institucional?"
  },
  {
    "id": "revisao",
    "titulo": "Revisar um plano",
    "criterio": "A revisão identificou problemas e melhorou a coerência do plano?"
  },
  {
    "id": "variacoes",
    "titulo": "Criar variações do plano",
    "criterio": "As três variações preservaram o objetivo central do plano?"
  }
];
const PASTA_AVALIACOES_AVANCADAS = '1VIN3XAvxTJL1FDYt02Bg6k3Cgesxnxdm';

function criarTodosFormulariosAvancados() {
  AVALIACOES_AVANCADAS.forEach(criarAvaliacaoAvancada);
}

function criarFormulario_detalhado() { criarAvaliacaoAvancada(AVALIACOES_AVANCADAS.find(function (c) { return c.id === "detalhado"; })); }

function criarFormulario_temas_transversais() { criarAvaliacaoAvancada(AVALIACOES_AVANCADAS.find(function (c) { return c.id === "temas_transversais"; })); }

function criarFormulario_bncc() { criarAvaliacaoAvancada(AVALIACOES_AVANCADAS.find(function (c) { return c.id === "bncc"; })); }

function criarFormulario_ideias_soltas() { criarAvaliacaoAvancada(AVALIACOES_AVANCADAS.find(function (c) { return c.id === "ideias_soltas"; })); }

function criarFormulario_adaptar_plano() { criarAvaliacaoAvancada(AVALIACOES_AVANCADAS.find(function (c) { return c.id === "adaptar_plano"; })); }

function criarFormulario_plano_enxuto() { criarAvaliacaoAvancada(AVALIACOES_AVANCADAS.find(function (c) { return c.id === "plano_enxuto"; })); }

function criarFormulario_poucos_recursos() { criarAvaliacaoAvancada(AVALIACOES_AVANCADAS.find(function (c) { return c.id === "poucos_recursos"; })); }

function criarFormulario_texto_simples() { criarAvaliacaoAvancada(AVALIACOES_AVANCADAS.find(function (c) { return c.id === "texto_simples"; })); }

function criarFormulario_tabela() { criarAvaliacaoAvancada(AVALIACOES_AVANCADAS.find(function (c) { return c.id === "tabela"; })); }

function criarFormulario_docx() { criarAvaliacaoAvancada(AVALIACOES_AVANCADAS.find(function (c) { return c.id === "docx"; })); }

function criarFormulario_modelo_escola() { criarAvaliacaoAvancada(AVALIACOES_AVANCADAS.find(function (c) { return c.id === "modelo_escola"; })); }

function criarFormulario_revisao() { criarAvaliacaoAvancada(AVALIACOES_AVANCADAS.find(function (c) { return c.id === "revisao"; })); }

function criarFormulario_variacoes() { criarAvaliacaoAvancada(AVALIACOES_AVANCADAS.find(function (c) { return c.id === "variacoes"; })); }

function criarAvaliacaoAvancada(config) {
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
