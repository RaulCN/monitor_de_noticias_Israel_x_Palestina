const url = "https://raw.githubusercontent.com/RaulCN/monitor_de_noticias_Israel_x_Palestina/main/resumos/Israel_x_Palestina_23-03-2025_Resumo.txt";
fetch(url)
  .then(response => response.text())
  .then(data => {
    // Substituir quebras de linha por tags <br> ou manter em um elemento pre
    const relatorioElement = document.getElementById("relatorio");
    
    // Opção 1: Usando white-space: pre-wrap no CSS
    relatorioElement.textContent = data;
    relatorioElement.style.whiteSpace = "pre-wrap";
    
    // Opção 2 (alternativa): Converter quebras de linha em <br>
    // relatorioElement.innerHTML = data.replace(/\n/g, '<br>');
  })
  .catch(error => {
    console.error("Erro ao carregar o relatório:", error);
  });
