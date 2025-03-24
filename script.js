const url = "https://raw.githubusercontent.com/seu-usuario/monitor-israel-palestina/main/relatorio.txt";

fetch(url)
  .then(response => response.text())
  .then(data => {
    document.getElementById("relatorio").textContent = data;
  })
  .catch(error => {
    console.error("Erro ao carregar o relatório:", error);
  });
