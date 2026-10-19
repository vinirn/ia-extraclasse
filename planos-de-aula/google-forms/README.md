# Avaliações dos prompts avançados no Google Forms

O script `avaliacoes-avancadas.gs` cria 11 formulários independentes, um para cada prompt além do básico, incluindo BNCC. Cada formulário tem oito perguntas fechadas e uma aberta: IAs testadas (seleção múltipla), IA avaliada, satisfação, critério específico do prompt, utilidade, adequação à turma, revisão necessária, principal problema e comentário.

1. Crie um projeto em https://script.google.com/ e cole o conteúdo do script.
2. Execute `criarTodosFormulariosAvancados` para criar todos, ou uma função `criarFormulario_*` para criar apenas o desejado. Autorize os acessos solicitados pelo Google.
3. Confira os links de edição, resposta e planilha no registro de execução.
4. Teste os links e confira as respostas na planilha antes da aula.

A pasta do Drive já está configurada. Cada formulário recebe sua própria planilha; não há coleta de nomes ou e-mails. Execute novamente no mesmo projeto para reutilizar os formulários, sem duplicá-los ou apagar respostas. Se a execução parar pelo limite de tempo, execute novamente. Se um formulário ficar com uma criação parcial de perguntas, o script informa seu link de edição para conferência, sem excluir itens.

Os formulários online só serão criados após a execução na conta Google. O formulário do prompt básico permanece independente.
