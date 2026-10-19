# IA Extraclasse

Site estático de recursos para professores.

## Geradores de prompts

Cada prompt tem sua própria página e configuração. O formulário, a geração do texto e o botão de cópia usam o código comum em `gerador.js`.

O gerador básico usa:

- `planos-de-aula/gerador-de-prompt.html`: página específica e caminho da configuração;
- `planos-de-aula/prompts/basico.json`: grupos e campos do formulário;
- `planos-de-aula/prompts/basico.txt`: modelo do prompt.

Para criar outro gerador, crie um `.txt` com o prompt, um `.json` com os campos correspondentes e uma página que carregue `gerador.js` e aponte para o `.json` com `data-prompt-config`.

Os campos com `sharedKey` na configuração são salvos em `sessionStorage` conforme o usuário digita. No prompt básico, apenas disciplina, ano/série, duração e tema têm essas chaves; os outros campos não são gravados. Outro gerador aberto na mesma aba recupera o valor se usar a mesma chave. Esses dados não são enviados ao servidor e são apagados ao fechar a aba. O botão “Limpar campos” remove os valores compartilhados dos campos do formulário atual.

Um campo com `"required": false` é opcional. Se ficar vazio, sua linha é omitida do prompt gerado. O campo de referências do prompt básico usa essa opção.

## Códigos da BNCC

O módulo `planos-de-aula/index.html` contém um link para a subpágina `planos-de-aula/bncc/index.html`, que disponibiliza os arquivos em `planos-de-aula/bncc/`, copiados de `referências/bncc_codigos_extraidos` do projeto do curso. A consulta está organizada por ano e componente do Ensino Fundamental e por área do Ensino Médio, com um índice das páginas de origem.
