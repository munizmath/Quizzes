/**
 * Testes E2E do Quiz
 * Testa o fluxo completo do quiz
 */

describe('Fluxo Completo do Quiz', () => {
  beforeEach(() => {
    // Limpar sessionStorage antes de cada teste
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
    
    cy.visit('/index.html');
  });

  it('Deve permitir preencher formulário e iniciar quiz', () => {
    // Preencher formulário
    cy.get('#user-name').type('Teste Usuário');
    cy.get('#user-email').type('teste@example.com');
    cy.get('#quiz-type').select('aws');
    
    // Clicar em iniciar prova
    cy.get('#start-quiz-button').click();
    
    // Verificar redirecionamento para seleção de grupos
    cy.url().should('include', 'select-groups.html');
  });

  it('Deve permitir selecionar grupos e iniciar quiz', () => {
    // Setup: preencher dados do usuário
    cy.window().then((win) => {
      win.sessionStorage.setItem('userName', 'Teste Usuário');
      win.sessionStorage.setItem('userEmail', 'teste@example.com');
      win.sessionStorage.setItem('quizType', 'aws');
    });
    
    cy.visit('/select-groups.html');
    
    // Selecionar grupos
    cy.get('[data-group="1"]').click();
    cy.get('[data-group="2"]').click();
    cy.get('[data-group="3"]').click();
    
    // Verificar que botão está habilitado
    cy.get('#start-quiz-button').should('not.be.disabled');
    
    // Iniciar quiz
    cy.get('#start-quiz-button').click();
    
    // Verificar redirecionamento para quiz
    cy.url().should('include', 'quiz.html');
  });

  it('Deve carregar questões e permitir responder', () => {
    // Setup: dados do usuário e grupos
    cy.window().then((win) => {
      win.sessionStorage.setItem('userName', 'Teste');
      win.sessionStorage.setItem('userEmail', 'teste@example.com');
      win.sessionStorage.setItem('quizType', 'aws');
      win.sessionStorage.setItem('selectedGroups', JSON.stringify([1, 2, 3]));
    });
    
    cy.visit('/quiz.html?type=aws');
    
    // Aguardar questões carregarem
    cy.get('.question', { timeout: 10000 }).should('exist');
    
    // Responder primeira questão
    cy.get('.question').first().within(() => {
      cy.get('input[type="radio"]').first().check();
    });
    
    // Verificar contador atualizado
    cy.get('#correct-counter, #incorrect-counter').should('not.contain', '0');
  });

  it('Deve validar combinações de grupos permitidas', () => {
    cy.window().then((win) => {
      win.sessionStorage.setItem('userName', 'Teste');
      win.sessionStorage.setItem('userEmail', 'teste@example.com');
      win.sessionStorage.setItem('quizType', 'aws');
    });
    
    cy.visit('/select-groups.html');
    
    // Selecionar combinação inválida
    cy.get('[data-group="1"]').click();
    cy.get('[data-group="3"]').click();
    cy.get('[data-group="5"]').click();
    
    // Deve mostrar mensagem de erro
    cy.get('#error-message').should('be.visible');
  });

  it('Deve permitir exportar para PDF', () => {
    // Mock: criar histórico de tentativa
    cy.window().then(async (win) => {
      win.sessionStorage.setItem('userName', 'Teste');
      win.sessionStorage.setItem('userEmail', 'teste@example.com');
      
      // Simular que jsPDF está disponível
      win.jsPDF = cy.stub().returns({
        setFontSize: cy.stub(),
        setFont: cy.stub(),
        text: cy.stub(),
        line: cy.stub(),
        save: cy.stub()
      });
    });
    
    cy.visit('/history.html');
    
    // Tentar exportar (pode falhar se jsPDF não estiver carregado, mas testa o fluxo)
    cy.get('#export-stats-button').click();
  });

  it('Deve permitir revisar questões erradas', () => {
    cy.window().then(async (win) => {
      win.sessionStorage.setItem('userName', 'Teste');
      win.sessionStorage.setItem('userEmail', 'teste@example.com');
      
      // Mock: questões para revisão
      const reviewQuestions = [
        {
          questionId: 1,
          question: 'Teste?',
          options: { A: 'Opção A', B: 'Opção B' },
          correctAnswer: 'A',
          userAnswer: 'B',
          isCorrect: false
        }
      ];
      
      win.sessionStorage.setItem('reviewQuestions', JSON.stringify(reviewQuestions));
    });
    
    cy.visit('/review.html');
    
    // Verificar que questões são exibidas
    cy.get('.review-question').should('exist');
  });
});

describe('Acessibilidade', () => {
  it('Deve ter navegação por teclado funcional', () => {
    cy.visit('/index.html');
    
    // Navegar por Tab
    cy.get('body').tab();
    cy.focused().should('have.attr', 'id', 'user-name');
    
    cy.focused().tab();
    cy.focused().should('have.attr', 'id', 'user-email');
  });

  it('Deve ter atributos ARIA corretos', () => {
    cy.visit('/quiz.html?type=aws');
    
    // Verificar ARIA em elementos importantes
    cy.get('#sidebar').should('have.attr', 'role', 'complementary');
    cy.get('#quiz-container').should('have.attr', 'role', 'region');
    cy.get('button').should('have.attr', 'aria-label');
  });
});

