# Monkey D. Luck — Cadastro acessível

Protótipo em Next.js (App Router), JavaScript, Tailwind CSS, componentes shadcn/ui com Radix e GSAP. Interface em português, com duas etapas e onze recursos de acessibilidade.

## Executar

Requer Node.js 20.9 ou superior e npm.

```powershell
npm install
npm run dev
```

Abra http://127.0.0.1:3000. O cadastro exige nome, e-mail, senha de pelo menos oito caracteres, data de nascimento, país e cidade. Estado/região é opcional. A idade é calculada automaticamente.

## Verificação

```powershell
npm test
npm run lint
npm run build
npx playwright install chromium
npm run test:e2e
```

Os testes unitários verificam datas e idade. Os testes Playwright verificam cadastro, erros, foco, retorno entre etapas, preferências, países por teclado, responsividade e acessibilidade com axe. Para uma avaliação completa, conferir também leitores de tela e zoom de 400% manualmente.

## Estrutura

- `src/app/`: página, layout e estilos globais.
- `src/components/`: experiência, mascote e componentes de interface.
- `src/lib/`: datas, países locais e utilitários.
- `public/mascote/`: cópia da folha de sprites utilizada pela página.
- `tests/`: testes unitários e de navegador.
- `mascote/`: materiais originais, preservados.

## Acessibilidade e privacidade

Teclado completo, foco visível, campos descritos para leitores de tela, contraste adequado, modo de alto contraste, movimento reduzido/pausa, texto ampliado/zoom, alvos de toque amplos, instruções sem limite de tempo, suporte a gerenciadores de senha e resumo de erros com preservação dos campos.

Nenhuma conta real é criada. O envio é simulado por 900 ms. Não há banco de dados, API, analytics ou persistência de dados pessoais. O conteúdo do formulário é mantido apenas na memória da página, a senha é limpa na conclusão e recarregar descarta os dados.

Os componentes de `src/components/ui/` seguem a composição shadcn/ui e permanecem editáveis no projeto. Os ajustes de aparência estão centralizados em `src/app/globals.css`.

As fontes Fredoka e Nunito são empacotadas localmente via Fontsource; a página não consulta um CDN de fontes.

Use `npm run format` para formatar e `npm run format:check` para conferir o estilo. `AGENTS.md` e os materiais originais do mascote são excluídos da formatação.

## Layout e novos ajustes

O layout padrão cabe sem rolagem nas duas etapas em 1366×768, 1440×900, 1024×768, 375×812, 390×844 e 375×667. O painel Acessibilidade abre como janela modal, com retorno de foco ao fechar e suporte a Escape.

Além dos onze recursos iniciais, há quatro ajustes: **Modo foco**, **Fonte simples**, **Mais espaçamento** e **Dicas de preenchimento**. Texto ampliado, espaçamento e dicas podem aumentar a altura da página para preservar todo o conteúdo. Em zoom alto ou janelas muito baixas, a página permite rolagem em vez de cortar controles.

Para usar o Chrome já instalado nos testes, defina `PLAYWRIGHT_EXECUTABLE_PATH` com o caminho do navegador antes de executar `npm run test:e2e`.
