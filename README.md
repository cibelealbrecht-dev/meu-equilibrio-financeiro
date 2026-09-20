# Meu Equilíbrio Financeiro

Protótipo de MVP desenvolvido para o desafio **Vibe Coding App Finanças — DIO**.

## Proposta

O Meu Equilíbrio Financeiro transforma o controle financeiro em uma conversa natural com um Agente Financeiro de IA, reduzindo a complexidade de aplicativos financeiros tradicionais e tornando a educação financeira mais acessível.

## Público-alvo

Adultos, especialmente iniciantes em organização financeira, que têm dificuldade para registrar despesas, interpretar relatórios ou utilizar aplicativos financeiros tradicionais.

## Funcionalidades do protótipo

- Registro conversacional de receitas e despesas
- Classificação automática por categoria
- Histórico financeiro
- Resumo de receitas, despesas e saldo
- Metas financeiras com progresso
- Sugestões educativas de economia
- Chat com Agente Financeiro simulado
- Persistência dos dados com `localStorage`
- Dados demonstrativos na primeira abertura
- Layout responsivo para computador e celular

## Tecnologias

- HTML5
- CSS3
- JavaScript puro
- LocalStorage

Não há backend, banco de dados externo ou API de IA. O agente é simulado por regras JavaScript para demonstrar a experiência do MVP.

## Como executar

1. Baixe ou clone este repositório.
2. Abra o arquivo `index.html` em um navegador.
3. Use a navegação para acessar as áreas do protótipo.
4. Experimente mensagens como:
   - `Gastei R$ 80 no mercado.`
   - `Recebi R$ 2.500 de salário.`
   - `Como estão minhas finanças?`
5. Crie uma meta na área **Metas**.
6. Consulte o **Resumo Financeiro** e as **Sugestões de Economia**.

## Dados

Os dados são armazenados somente no navegador por meio de `localStorage`. O botão **Limpar dados** restaura os dados demonstrativos.

## Vibe Coding e uso de IA

O projeto foi desenvolvido a partir de um PRD elaborado e refinado com apoio de IA. Durante o processo foram utilizados Copilot e Lovable para explorar, estruturar e prototipar a solução.

O Lovable chegou a gerar a estrutura visual e as principais telas, mas a construção foi interrompida quando os créditos gratuitos acabaram antes da conclusão do fluxo e dos testes. Por isso, foi criada uma versão estática em HTML, CSS e JavaScript para concluir a prototipação sem depender de serviços pagos.

## O que funcionou

- Refinamento do problema e da proposta de valor com IA
- Definição e priorização do MVP
- Geração de uma direção visual e estrutura de telas
- Criação de um protótipo navegável sem backend
- Uso de `localStorage` para demonstrar persistência

## Limitações

- O Agente Financeiro é simulado e não utiliza uma API de IA real.
- Não existem integrações bancárias ou Open Finance.
- Não há OCR de comprovantes.
- Não há previsões financeiras ou recomendações de investimento.
- Os dados são locais ao navegador.

## Próximos passos

Em uma versão futura poderiam ser considerados autenticação, banco de dados, integração com uma API de IA, sincronização entre dispositivos e integrações financeiras, sempre respeitando segurança e privacidade.

## Aprendizados

O projeto mostrou a importância de escrever prompts claros, limitar o escopo do MVP, validar cada etapa e considerar as limitações das ferramentas de IA utilizadas. Também mostrou que um protótipo estático pode ser suficiente para demonstrar a experiência principal antes de uma implementação completa.
