const url = "https://raw.githubusercontent.com/RaulCN/monitor_de_noticias_Israel_x_Palestina/main/resumos/Israel_x_Palestina_24-03-2025_Resumo.txt";

fetch(url)
  .then(response => response.text())
  .then(data => {
    const relatorioElement = document.getElementById("relatorio");
    
    // Usando a formatação completa que criamos anteriormente
    let html = formatarRelatorio(data);
    relatorioElement.innerHTML = html;
    relatorioElement.classList.remove("relatorio-carregando");
  })
  .catch(error => {
    console.error("Erro ao carregar o relatório:", error);
    document.getElementById("relatorio").innerHTML = 
      '<div class="alert alert-danger">Erro ao carregar o relatório. Por favor, tente novamente mais tarde.</div>';
  });

// Função de formatação (mantém a mesma do exemplo anterior)
function formatarRelatorio(texto) {
  const linhas = texto.split('\n');
  let html = '<div class="relatorio-formatado">';
  
  linhas.forEach(linha => {
    if (linha.trim() === '') return;
    
    if (linha.includes('ISRAEL X PALESTINA') || 
        linha.includes('RESUMO DOS ACONTECIMENTOS') || 
        linha.includes('FONTES CONSULTADAS')) {
      html += `<h3 class="cabecalho-relatorio">${linha}</h3>`;
    }
    else if (linha.match(/^\d+\.\shttp/)) {
      html += `<div class="fonte-relatorio">${linha}</div>`;
    }
    else {
      let linhaFormatada = linha
        .replace(/(\d+[\.,]?\d*)/g, '<span class="destaque-numero">$1</span>')
        .replace(/(Israel|Palestina|Gaza|Rafah|Faixa de Gaza)/gi, '<span class="destaque-local">$1</span>')
        .replace(/(Hamas|Salah al-Arouri|Salah al-Bardaweel)/gi, '<span class="destaque-pessoa">$1</span>');
      
      html += `<p>${linhaFormatada}</p>`;
    }
  });
  
  html += '</div>';
  return html;
}
