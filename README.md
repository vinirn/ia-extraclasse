# IA Extraclasse

Site estático de recursos para professores.

## Geradores de prompts

Cada prompt tem sua própria página e configuração. O formulário, a geração do texto e o botão de cópia usam o código comum em `gerador.js`.

O gerador básico usa:

- `planos-de-aula/gerador-de-prompt.html`: página específica e caminho da configuração;
- `planos-de-aula/prompts/basico.json`: grupos e campos do formulário;
- `planos-de-aula/prompts/basico.txt`: modelo do prompt.

Para criar outro gerador, crie um `.txt` com o prompt, um `.json` com os campos correspondentes e uma página que carregue `gerador.js` e aponte para o `.json` com `data-prompt-config`.

Os valores preenchidos ficam apenas na memória da página aberta. Ainda não há compartilhamento de dados entre geradores.
