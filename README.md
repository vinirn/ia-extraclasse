# IA Extraclasse

Site estático de recursos para professores.

## Geradores de prompts

Cada prompt tem sua própria página e configuração. O formulário, a geração do texto e o botão de cópia usam o código comum em `gerador.js`.

O gerador básico usa:

- `planos-de-aula/gerador-de-prompt.html`: página específica e caminho da configuração;
- `planos-de-aula/prompts/basico.json`: grupos e campos do formulário;
- `planos-de-aula/prompts/basico.txt`: modelo do prompt.

Para criar outro gerador, crie um `.txt` com o prompt, um `.json` com os campos correspondentes e uma página que carregue `gerador.js` e aponte para o `.json` com `data-prompt-config`.

Os campos com `sharedKey` na configuração são salvos em `sessionStorage` conforme o usuário digita. Outro gerador aberto na mesma aba recupera o valor se usar a mesma chave. Esses dados não são enviados ao servidor e são apagados ao fechar a aba. O botão “Limpar campos” remove os valores compartilhados dos campos do formulário atual.
