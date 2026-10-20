# Scripts individuais do Google Forms

Cada arquivo `.gs` é independente e cria ou reutiliza somente uma avaliação e sua planilha. São 15 arquivos: o básico e 14 prompts avançados.

1. No Google Apps Script, copie o conteúdo do arquivo da avaliação desejada para um arquivo `.gs`.
2. Execute a função indicada na tabela e autorize os acessos solicitados pelo Google.
3. Consulte os links de edição, resposta e planilha no registro de execução. Teste antes da aula.

## Atualizar um projeto já utilizado

Use o mesmo projeto do Apps Script para preservar os IDs guardados nas propriedades. Substitua o script agregado antigo pelos arquivos individuais desejados; não mantenha as funções antigas e as novas com o mesmo nome. Os arquivos individuais podem coexistir no mesmo projeto, pois as funções públicas têm nomes distintos e os avançados não compartilham variáveis globais.

Não existe mais a função `criarTodosFormulariosAvancados`: execute apenas a função da avaliação desejada. Um projeto novo não recupera as propriedades do antigo e criará novos formulários.

Os scripts avançados preservam as perguntas e respostas existentes no formulário. O básico mantém sua lógica anterior: se houver respostas, não troca perguntas com títulos diferentes. Em todos os scripts, a execução também limpa da aba de respostas as colunas cujos cabeçalhos não correspondem mais às perguntas atuais do formulário. Antes de excluir qualquer coluna, o script cria uma aba oculta `Backup respostas ...` na mesma planilha, com a aba original completa. A coluna de data/hora e as colunas de e-mail são preservadas. Colunas manuais adicionadas diretamente à aba de respostas também serão tratadas como antigas; mantenha análises manuais em outra aba. A pasta de destino continua configurada. Os formulários e as planilhas online só mudam após executar o script na conta Google.

| Avaliação | Arquivo | Função a executar |
| --- | --- | --- |
| Prompt básico | [basico.gs](basico.gs) | `criarFormularioAvaliacaoCritica` |
| Planejamento detalhado pelo docente | [detalhado.gs](detalhado.gs) | `criarFormulario_detalhado` |
| Relacionar o plano à BNCC | [bncc.gs](bncc.gs) | `criarFormulario_bncc` |
| Integrar temas transversais ao plano | [temas_transversais.gs](temas_transversais.gs) | `criarFormulario_temas_transversais` |
| Transformar ideias soltas em plano | [ideias_soltas.gs](ideias_soltas.gs) | `criarFormulario_ideias_soltas` |
| Adaptar um plano existente | [adaptar_plano.gs](adaptar_plano.gs) | `criarFormulario_adaptar_plano` |
| Criar um plano enxuto | [plano_enxuto.gs](plano_enxuto.gs) | `criarFormulario_plano_enxuto` |
| Planejar com poucos recursos | [poucos_recursos.gs](poucos_recursos.gs) | `criarFormulario_poucos_recursos` |
| Organizar em texto simples | [texto_simples.gs](texto_simples.gs) | `criarFormulario_texto_simples` |
| Organizar em tabela | [tabela.gs](tabela.gs) | `criarFormulario_tabela` |
| Organizar para DOCX | [docx.gs](docx.gs) | `criarFormulario_docx` |
| Gerar arquivo DOCX diretamente | [docx_direto.gs](docx_direto.gs) | `criarFormulario_docx_direto` |
| Preencher o modelo da escola | [modelo_escola.gs](modelo_escola.gs) | `criarFormulario_modelo_escola` |
| Revisar um plano | [revisao.gs](revisao.gs) | `criarFormulario_revisao` |
| Criar variações do plano | [variacoes.gs](variacoes.gs) | `criarFormulario_variacoes` |
