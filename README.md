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

## Outros prompts e avaliações

O módulo inclui geradores de planejamento detalhado pelo docente, BNCC, temas transversais, ideias soltas, adaptação, plano enxuto, poucos recursos, texto simples, tabela, DOCX para copiar, arquivo DOCX direto, modelo escolar, revisão e variações, na sequência da apostila. Os `.txt` são cópias dos arquivos canônicos de `modulos/planos_de_aula/prompts/`; atualize a cópia ao modificar a fonte.

Campos com `marker` substituem o marcador indicado no texto; campos com `append` acrescentam o plano ou os dados da aula ao final do prompt. As quebras de linha dos textos fornecidos são preservadas. Apenas os campos com `sharedKey` são compartilhados na aba.

Os scripts individuais em `planos-de-aula/google-forms/` são cópias de `modulos/planos_de_aula/google_forms/`, um arquivo independente por avaliação. As instruções estão em `planos-de-aula/google-forms/README.md`. Os formulários online são criados quando o professor executa o script em sua conta Google.

A prática de temas transversais se inspira no guia do MEC (2019), *Temas Contemporâneos Transversais na BNCC: Propostas de Práticas de Implementação*, pp. 8–9 e 12. O gerador parte de um plano existente, um tema e um problema local; os demais campos são opcionais.

## Slides em PPTX

O módulo `slides/` oferece três geradores: aula completa, aula visual e aula com notas do professor. O docente cola o plano do módulo Planos de aula; os demais campos são opcionais. O site gera o prompt e a IA escolhida cria o PPTX, quando dispõe de criação de arquivos.

As fontes dos prompts estão em `modulos/slides/prompts/` no projeto do curso, junto da apostila e apresentação. Mantenha as cópias `.txt` do site sincronizadas e os rótulos JSON correspondentes às linhas do modelo.
