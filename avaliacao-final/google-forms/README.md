# Avaliação final do curso

O arquivo `avaliacao_final.gs` cria um Google Forms com nove perguntas: seis de múltipla escolha sobre satisfação, clareza, utilidade, tempo de prática, materiais e confiança para usar IA; e três campos abertos sobre o que foi mais útil, sugestões para o curso e atividades extraclasse a trabalhar com IA (por exemplo, avaliações, questões e rubricas).

## Como usar

1. Abra https://script.google.com/ e crie um projeto (ou use o projeto das avaliações do curso).
2. Copie o conteúdo de `avaliacao_final.gs` para um arquivo `.gs`.
3. Execute `criarFormularioAvaliacaoFinalCurso` e autorize os acessos solicitados pelo Google.
4. Consulte os links de edição, resposta e planilha no registro de execução.
5. Abra o link de resposta e teste antes de compartilhar. Confira as configurações de acesso da sua conta ou organização.

O script não solicita nome nem coleta e-mail. Os campos abertos são opcionais. As respostas ficam em uma planilha, sem resumo público.

O formulário e a planilha são movidos para a mesma pasta das demais avaliações do curso. Para usar outra pasta, altere `pastaId`; para usar Meu Drive, deixe essa variável vazia.

Ao executar novamente no mesmo projeto, os IDs salvos são reutilizados e as perguntas e respostas são preservadas. Se uma execução for interrompida durante a criação das perguntas, o script informa o link para conferência manual, sem apagar itens. Um projeto novo cria outro formulário. Para outra turma ou edição, use um projeto novo ou altere `chave` antes da primeira execução.

Fonte canônica no projeto do curso: `avaliacao_final/google_forms/avaliacao_final.gs`. Cópia para o repositório: `git/ia-extraclasse/avaliacao-final/google-forms/avaliacao_final.gs`.

Referência da API: https://developers.google.com/apps-script/reference/forms/form
