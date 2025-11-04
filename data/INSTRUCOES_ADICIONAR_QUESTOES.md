# Instruções para Adicionar Questões Oficiais

## ⚠️ Importante sobre Direitos Autorais

Este projeto inclui arquivos JSON de exemplo para ITIL 4 Foundations e AZ-900. **Você precisa adicionar questões oficiais** dos bancos de questões oficiais para usar em produção.

## 📋 Arquivos de Questões

- `data/Questions_ITIL4.json` - Questões ITIL 4 Foundations
- `data/Questions_AZ900.json` - Questões AZ-900 Azure Fundamentals

## 📝 Formato das Questões

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

## 🔍 Onde Obter Questões Oficiais

### ITIL 4 Foundations

- **Axelos**: Fornecedor oficial do ITIL
- **Bancos de questões oficiais**: Disponíveis através de provedores de treinamento certificados
- **Practice Exams**: Oferecidos por provedores de treinamento autorizados

### AZ-900 Microsoft Azure Fundamentals

- **Microsoft Learn**: Recursos oficiais de aprendizado
- **Microsoft Official Practice Tests**: Disponíveis no Microsoft Learn
- **Exam AZ-900**: Informações oficiais no site da Microsoft

## ⚖️ Considerações Legais

1. **Direitos Autorais**: Questões oficiais são protegidas por direitos autorais
2. **Licenças**: Certifique-se de ter licença ou permissão para usar questões oficiais
3. **Uso Pessoal**: Para uso pessoal/educacional, verifique os termos de uso
4. **Uso Comercial**: Para uso comercial, obtenha as licenças necessárias

## 📚 Recursos Recomendados

### ITIL 4 Foundations
- Axelos - Site oficial: https://www.axelos.com/
- ITIL 4 Foundation Study Guide
- Practice exams de provedores autorizados

### AZ-900 Azure Fundamentals
- Microsoft Learn: https://learn.microsoft.com/
- Microsoft Azure Fundamentals (AZ-900) Exam Page
- Microsoft Official Practice Tests

## 🚀 Como Adicionar Questões

1. Abra o arquivo JSON correspondente (`Questions_ITIL4.json` ou `Questions_AZ900.json`)
2. Adicione questões no formato mostrado acima
3. Salve o arquivo
4. Teste o quiz para garantir que as questões funcionam corretamente

## 📝 Nota

Os arquivos atuais contêm apenas questões de exemplo para demonstrar o formato. Substitua essas questões por questões oficiais quando disponíveis.

