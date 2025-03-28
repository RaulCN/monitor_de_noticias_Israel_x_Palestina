// Configurações globais
const REPOSITORIO_URL = "https://github.com/RaulCN/monitor_de_noticias_Israel_x_Palestina/tree/main/resumos";
const BASE_RAW_URL = "https://raw.githubusercontent.com/RaulCN/monitor_de_noticias_Israel_x_Palestina/main/resumos";

// Lista de relatórios disponíveis (pode ser obtida dinamicamente no futuro)
const RELATORIOS_DISPONIVEIS = [
  "27-03-2025",
  "26-03-2025",
  "25-03-2025",
  "24-03-2025",
  "23-03-2025"
];

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  // Página inicial - carrega o relatório mais recente
  if (document.getElementById("relatorio")) {
    carregarRelatorioMaisRecente();
  }

  // Página de relatórios - carrega a lista
  if (document.getElementById("lista-relatorios")) {
    carregarListaRelatorios();
  }
});

// Carrega o relatório mais recente
async function carregarRelatorioMaisRecente() {
  const relatorioElement = document.getElementById("relatorio");
  
  // Mostra estado de carregamento
  relatorioElement.innerHTML = `
    <div class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
      <p class="mt-2">Buscando o relatório mais recente...</p>
    </div>
  `;

  try {
    // Tenta primeiro o dia atual
    const hoje = new Date();
    const dataFormatada = formatarData(hoje);
    await carregarERenderizarRelatorio(dataFormatada, "relatorio");
    
  } catch (error) {
    console.error("Erro ao carregar relatório atual:", error);
    
    // Se falhar, tenta o relatório mais recente disponível
    try {
      const dataRecente = RELATORIOS_DISPONIVEIS[0];
      await carregarERenderizarRelatorio(dataRecente, "relatorio");
      
    } catch (error) {
      console.error("Erro ao carregar relatório recente:", error);
      mostrarErro("relatorio", "Não foi possível carregar nenhum relatório recente.");
    }
  }
}

// Carrega a lista de relatórios disponíveis
function carregarListaRelatorios() {
  const listaElement = document.getElementById("lista-relatorios");
  
  listaElement.innerHTML = RELATORIOS_DISPONIVEIS.map(data => `
    <div class="card mb-2 relatorio-item" data-date="${data}">
      <div class="card-body py-2">
        <h6 class="card-title mb-1">Relatório ${data.replace(/-/g, '/')}</h6>
        <button class="btn btn-sm btn-outline-primary" 
                onclick="carregarRelatorioDetalhe('${data}')">
          Visualizar
        </button>
      </div>
    </div>
  `).join('');
}

// Carrega um relatório específico para a página de detalhes
async function carregarRelatorioDetalhe(dataString) {
  try {
    await carregarERenderizarRelatorio(dataString, "relatorio-detalhe");
    
    // Destaca o item selecionado na lista
    document.querySelectorAll('.relatorio-item').forEach(item => {
      item.classList.remove('border-primary');
      if (item.dataset.date === dataString) {
        item.classList.add('border-primary');
      }
    });
    
  } catch (error) {
    console.error(`Erro ao carregar relatório de ${dataString}:`, error);
    mostrarErro("relatorio-detalhe", `Não foi possível carregar o relatório de ${dataString}.`);
  }
}

// Função principal para carregar e renderizar um relatório
async function carregarERenderizarRelatorio(dataString, elementoId) {
  const elemento = document.getElementById(elementoId);
  
  // Mostra estado de carregamento
  elemento.innerHTML = `
    <div class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
      <p>Carregando relatório de ${dataString}...</p>
    </div>
  `;

  try {
    const url = `${BASE_RAW_URL}/Israel_x_Palestina_${dataString}_Resumo.txt`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    const texto = await response.text();
    elemento.innerHTML = formatarRelatorio(texto);
    
    // Atualiza a data exibida
    const elementosData = document.querySelectorAll(".data-relatorio");
    elementosData.forEach(el => {
      if (el.closest('#relatorio-detalhe, #relatorio')) {
        el.textContent = `Atualizado em ${dataString}`;
      }
    });
    
  } catch (error) {
    console.error(`Erro ao carregar relatório de ${dataString}:`, error);
    throw error;
  }
}

// Formatação do conteúdo do relatório
function formatarRelatorio(texto) {
  // Processamento das quebras de linha e formatação
  const linhas = texto.split('\n');
  let html = '<div class="relatorio-conteudo">';
  
  for (let i = 0; i < linhas.length; i++) {
    const linha = linhas[i].trim();
    if (!linha) continue;

    // Cabeçalhos principais
    if (linha.includes('ISRAEL X PALESTINA')) {
      html += `<h3 class="cabecalho-relatorio">${linha}</h3>`;
    } 
    // Subtítulos
    else if (linha.includes('RESUMO DOS ACONTECIMENTOS') || linha.includes('FONTES CONSULTADAS')) {
      html += `<h4 class="subcabecalho-relatorio">${linha}</h4>`;
    } 
    // Fontes
    else if (linha.match(/^\d+\.\shttps?:\/\//)) {
      html += `<div class="fonte-relatorio">${linha}</div>`;
    } 
    // Texto normal
    else {
      let linhaFormatada = linha
        .replace(/(\d+[\.,]?\d*)/g, '<span class="destaque-numero">$1</span>')
        .replace(/(Israel|Palestina|Gaza|Rafah|Faixa de Gaza)/gi, '<span class="destaque-local">$1</span>')
        .replace(/(Hamas|Salah al-Arouri|Salah al-Bardaweel)/gi, '<span class="destaque-pessoa">$1</span>');
      
      html += `<p class="paragrafo-relatorio">${linhaFormatada}</p>`;
    }
  }
  
  html += '</div>';
  return html;
}

// Formatação de data (dd-mm-yyyy)
function formatarData(data) {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}-${mes}-${ano}`;
}

// Mostra mensagens de erro
function mostrarErro(elementoId, mensagem) {
  const elemento = document.getElementById(elementoId);
  elemento.innerHTML = `
    <div class="alert alert-danger">
      <h4>Erro ao carregar relatório</h4>
      <p>${mensagem}</p>
      <p>Por favor, verifique:
        <ul>
          <li>Se o arquivo existe no <a href="${REPOSITORIO_URL}" target="_blank">GitHub</a></li>
          <li>Se o nome do arquivo está correto</li>
          <li>Sua conexão com a internet</li>
        </ul>
      </p>
    </div>
  `;
}
