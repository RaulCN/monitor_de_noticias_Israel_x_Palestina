mconst url = "https://raw.githubusercontent.com/RaulCN/monitor_de_not-cias_Israel_x_Palestina/main/resumos/Israel_x_Palestina_23-03-2025_Resumo.txt";
fetch(url)
  .then(response => response.text())
  .then(data => {
    document.getElementById("relatorio").textContent = data;
  })
  .catch(error => {
    console.error("Erro ao carregar o relatório:", error);
  });
