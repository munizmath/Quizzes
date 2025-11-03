/**
 * Exportação de Resultados para PDF
 * Usa jsPDF para gerar PDFs dos resultados do quiz
 */

const PDFExporter = {
    // Gerar PDF dos resultados
    async generatePDF(resultData) {
        // Carregar jsPDF dinamicamente
        if (typeof window.jsPDF === 'undefined') {
            await this.loadjsPDF();
        }
        
        const { jsPDF } = window;
        const doc = new jsPDF();
        
        // Configurações
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        let yPos = margin;
        
        // Título
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('QUIZ TECH - Resultados do Quiz', pageWidth / 2, yPos, { align: 'center' });
        yPos += 15;
        
        // Informações do usuário
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Nome: ${resultData.userName}`, margin, yPos);
        yPos += 7;
        doc.text(`E-mail: ${resultData.userEmail}`, margin, yPos);
        yPos += 7;
        doc.text(`Tipo de Quiz: ${resultData.quizType === 'aws' ? 'AWS' : 'COBIT'}`, margin, yPos);
        yPos += 7;
        doc.text(`Data: ${new Date(resultData.date).toLocaleDateString('pt-BR')}`, margin, yPos);
        yPos += 10;
        
        // Linha separadora
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 10;
        
        // Estatísticas
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Estatísticas', margin, yPos);
        yPos += 10;
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text(`Total de Questões: ${resultData.totalQuestions}`, margin, yPos);
        yPos += 7;
        doc.text(`Corretas: ${resultData.correctCount}`, margin, yPos);
        yPos += 7;
        doc.text(`Erradas: ${resultData.incorrectCount}`, margin, yPos);
        yPos += 7;
        doc.text(`Percentual de Acerto: ${resultData.percentage}%`, margin, yPos);
        yPos += 10;
        
        // Status
        doc.setFont('helvetica', 'bold');
        const status = resultData.percentage >= 80 ? 'APROVADO' : 'REPROVADO';
        const statusColor = resultData.percentage >= 80 ? [46, 125, 50] : [211, 47, 47];
        doc.setTextColor(...statusColor);
        doc.text(`Status: ${status}`, margin, yPos);
        doc.setTextColor(0, 0, 0);
        yPos += 10;
        
        // Linha separadora
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 10;
        
        // Questões detalhadas (se houver)
        if (resultData.questions && resultData.questions.length > 0) {
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('Detalhamento das Questões', margin, yPos);
            yPos += 10;
            
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            
            resultData.questions.forEach((q, index) => {
                // Verificar se precisa de nova página
                if (yPos > 250) {
                    doc.addPage();
                    yPos = margin;
                }
                
                const questionColor = q.isCorrect ? [46, 125, 50] : [211, 47, 47];
                doc.setTextColor(...questionColor);
                doc.text(`${index + 1}. ${q.isCorrect ? '✓' : '✗'}`, margin, yPos);
                doc.setTextColor(0, 0, 0);
                
                // Quebrar texto longo
                const questionLines = doc.splitTextToSize(q.question || `Questão ${index + 1}`, pageWidth - margin * 2);
                doc.text(questionLines, margin + 10, yPos);
                yPos += questionLines.length * 5 + 2;
            });
        }
        
        // Rodapé
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.text(
                `Página ${i} de ${totalPages} - QUIZ TECH`,
                pageWidth / 2,
                doc.internal.pageSize.getHeight() - 10,
                { align: 'center' }
            );
        }
        
        // Salvar PDF
        const fileName = `QuizTech_${resultData.quizType}_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
    },
    
    // Carregar biblioteca jsPDF
    async loadjsPDF() {
        return new Promise((resolve, reject) => {
            if (typeof window.jsPDF !== 'undefined') {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Falha ao carregar jsPDF'));
            document.head.appendChild(script);
        });
    }
};

