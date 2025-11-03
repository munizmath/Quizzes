# QUIZ TECH

Sistema interativo de quiz para preparação de certificações técnicas, com suporte para questões AWS e COBIT.

## 📋 Características

- ✅ Quiz interativo com feedback imediato
- ✅ Suporte para múltiplas questões (AWS e COBIT)
- ✅ Sistema de grupos/partes (seleção de 3 grupos de 25 questões)
- ✅ Timer com funcionalidade de pausa/retomada
- ✅ Contadores de acertos e erros em tempo real
- ✅ Modais informativos em vez de alerts
- ✅ Design responsivo para dispositivos móveis
- ✅ Feedback visual com cores (verde = correto, vermelho = incorreto)
- ✅ Explicações para questões respondidas

## 🚀 Como Usar

### Iniciando o Quiz

1. Abra o arquivo `index.html` no seu navegador
2. Selecione o tipo de quiz desejado:
   - **Quiz AWS**: Para certificações Amazon Web Services
   - **Quiz COBIT**: Para questões de Governança e Gerenciamento de TI

### Durante o Quiz

1. **Selecionar Grupos**: Clique nos botões "Grupo 1" até "Grupo 6" para selecionar até 3 grupos
   - Cada grupo contém 25 questões
   - Apenas combinações permitidas serão aceitas
   - Total máximo: 75 questões (3 grupos)

2. **Responder Questões**: 
   - Clique nas opções para selecionar sua resposta
   - Questões de escolha única: 1 tentativa
   - Questões de múltipla escolha: 2 tentativas

3. **Controles**:
   - **Pausar/Retomar**: Pausa o timer do quiz
   - **Enviar Respostas**: Verifica respostas e mostra resultado
   - **Reiniciar Quiz**: Limpa todas as respostas e reinicia
   - **Finalizar Quiz**: Finaliza o quiz e mostra resultados
   - **Voltar à Página Inicial**: Retorna à seleção de quiz

4. **Timer**: 
   - 30 minutos para cada conjunto de questões selecionadas
   - Timer automático quando grupos são selecionados

## 📁 Estrutura do Projeto

```
Quizzes/
├── index.html                    # Página inicial de seleção
├── quiz.html                     # Página do quiz
├── README.md                     # Este arquivo
├── MELHORIAS_ITEM_9_E_10.md      # Explicações detalhadas
├── css/
│   └── styles.css                # Estilos CSS
├── js/
│   ├── script.js                 # Lógica JavaScript principal
│   └── access-control.js         # Controle de acesso
├── tests/
│   ├── quiz.test.js              # Testes unitários
│   └── README.md                 # Documentação de testes
└── data/
    ├── Questions_AWS.json         # Banco de questões AWS
    └── Questions_COBIT.json      # Banco de questões COBIT
```

## 📝 Formato dos Dados JSON

Cada arquivo JSON deve seguir este formato:

```json
{
  "questions": [
    {
      "id": 1,
      "question": "Texto da pergunta?",
      "options": {
        "A": "Opção A",
        "B": "Opção B",
        "C": "Opção C",
        "D": "Opção D"
      },
      "correctAnswer": "A",
      "explanation": "Explicação opcional da resposta"
    }
  ]
}
```

### Tipos de Questões

- **Escolha Única**: `correctAnswer` é uma string (ex: `"A"`)
- **Múltipla Escolha**: `correctAnswer` é um array (ex: `["A", "B"]`)

## 🎯 Funcionalidades

### Sistema de Grupos

- Permite seleção de até 3 grupos de questões
- Cada grupo contém 25 questões
- Combinações permitidas são validadas
- Questões são embaralhadas automaticamente

### Sistema de Pontuação

- Contador de acertos em tempo real
- Contador de erros em tempo real
- Percentual mínimo configurável (padrão: 80%)
- Feedback visual imediato

### Timer

- 30 minutos por conjunto de questões
- Pausa/retomada funcional
- Finalização automática ao término do tempo

## 🔧 Tecnologias Utilizadas

- HTML5
- CSS3 (com Flexbox e Media Queries)
- JavaScript (ES6+)
- JSON para armazenamento de dados

## 📱 Compatibilidade

- ✅ Chrome/Edge (recomendado)
- ✅ Firefox
- ✅ Safari
- ✅ Dispositivos móveis (responsive)
- ✅ Leitores de tela (NVDA, JAWS, VoiceOver)
- ✅ Navegação por teclado completa

## 🐛 Correções de Bugs Implementadas

1. ✅ Tag `<h1>` não fechada corrigida
2. ✅ Referências case-sensitive corrigidas (`quiz.js` → `script.js`)
3. ✅ Valores CSS inválidos corrigidos (`margin-left: 2` → removido)
4. ✅ CSS duplicado consolidado
5. ✅ Código JavaScript modernizado (ES6)
6. ✅ Tratamento de erros em fetch()
7. ✅ Prevenção de XSS com escapeHtml()
8. ✅ Modais em vez de alerts()
9. ✅ Proteção de acesso ao quiz.html
10. ✅ Atributos ARIA atualizados dinamicamente
11. ✅ Navegação por teclado implementada

## ✅ Melhorias Implementadas

### Acessibilidade (Item 10) ✅
- ✅ Atributos ARIA em todos os elementos interativos
- ✅ Navegação completa por teclado (Tab, Enter, Esc, Espaço)
- ✅ Contraste de cores melhorado (WCAG AA)
- ✅ Tamanho mínimo de toque (44x44px) para acessibilidade
- ✅ Foco visível em todos os elementos
- ✅ Regiões ao vivo para leitores de tela
- ✅ Estrutura semântica HTML5
- ✅ Skip links para navegação rápida
- ✅ Notificações para leitores de tela
- ✅ Labels e descrições adequadas

### Testes (Item 9) ✅
- ✅ Testes unitários básicos implementados
- ✅ Testes de validação de combinações
- ✅ Testes de cálculo de pontuação
- ✅ Testes de formatação de timer
- ✅ Testes de escape HTML (prevenção XSS)
- ✅ Testes de estrutura JSON
- ✅ Sistema de testes executável no navegador
- ✅ Documentação de testes em `tests/README.md`

### Segurança ✅
- ✅ Proteção de acesso: quiz.html só acessível via index.html
- ✅ Prevenção de XSS com escapeHtml()
- ✅ Validação de entrada do usuário

## 🚧 Melhorias Futuras Sugeridas

- [ ] Sistema de histórico de tentativas
- [ ] Exportação de resultados para PDF
- [ ] Modo de revisão de questões
- [ ] Estatísticas detalhadas por tópico
- [ ] Sistema de login/usuários
- [ ] Banco de dados para armazenar resultados
- [ ] PWA (Progressive Web App) para instalação
- [ ] Testes E2E com Cypress ou Playwright
- [ ] Testes de acessibilidade automatizados (axe-core)

## 📄 Licença

Este projeto é de uso livre para fins educacionais.

## 👤 Autor

Desenvolvido para preparação de certificações técnicas.

## ⌨️ Atalhos de Teclado

- **Tab**: Navegar entre elementos
- **Enter**: Ativar botão/links focados
- **Espaço**: Pausar/Retomar timer (quando focado no botão)
- **Esc**: Fechar modais
- **Skip Link**: Pressione Tab na página do quiz para pular para o conteúdo principal

## 🧪 Executando os Testes

### No Navegador
1. Abra o quiz no navegador
2. Abra o Console do Desenvolvedor (F12)
3. Clique no botão "Executar Testes" no canto inferior direito
4. Veja os resultados no console

### Com Jest/Vitest
```bash
cd tests
npm install
npm test
```

Veja mais detalhes em `tests/README.md`.

## 🌐 Hospedagem no GitHub Pages

Este projeto pode ser hospedado gratuitamente no **GitHub Pages** usando uma conta gratuita!

### Como Configurar GitHub Pages

1. **No seu repositório GitHub**, vá em **Settings** (Configurações)
2. Role até a seção **Pages** (no menu lateral esquerdo)
3. Em **Source**, selecione:
   - **Branch**: `main`
   - **Folder**: `/ (root)`
4. Clique em **Save**
5. Aguarde alguns minutos para o GitHub processar
6. Seu site estará disponível em: `https://[seu-usuario].github.io/Quizzes/`

### Importante para GitHub Pages

- ✅ **Repositório público**: GitHub Pages gratuito só funciona com repositórios públicos
- ✅ **Site estático**: Este quiz é 100% estático (HTML/CSS/JS), perfeito para GitHub Pages
- ✅ **Sem backend necessário**: Todas as funcionalidades funcionam apenas no navegador
- ✅ **Arquivos JSON**: Funcionam normalmente via fetch() no GitHub Pages

### Limitações do GitHub Pages Gratuito

- **Tamanho do repositório**: Até 1 GB
- **Largura de banda**: 100 GB por mês
- **Builds**: 10 builds por hora
- **Repositório público necessário**: Para usar o plano gratuito

### Acessando o Site

Após configurar, seu quiz estará disponível em:
```
https://munizmath.github.io/Quizzes/
```

**Nota**: Certifique-se de que os arquivos JSON estão na pasta `data/` e que o servidor web permite acesso CORS se necessário. O quiz.html só pode ser acessado através do index.html por motivos de segurança.

