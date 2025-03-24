import os
import requests
from bs4 import BeautifulSoup
from duckduckgo_search import DDGS
import time
import datetime
from llama_cpp import Llama
import gc  # Para liberar memória explicitamente
import logging
from langdetect import detect, LangDetectException  # Para detecção de idioma

# Configurações
data_hoje = datetime.datetime.now().strftime("%d-%m-%Y")
output_folder = "noticias_israel_palestina"  # Pasta para salvar os arquivos
model_path = "/home/rauto/gemma-3-4b-it-Q4_K_M.gguf"  # Caminho do modelo LLaMA
num_results_per_language = 1  # Uma fonte por idioma
max_tokens_por_chunk = 500  # Limite de tokens por chunk
max_context_tokens = 2016  # Limite de tokens do modelo (n_ctx)

# Configuração do logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler()]
)

# Cria a pasta de saída, se não existir
if not os.path.exists(output_folder):
    os.makedirs(output_folder)

# Configuração para pesquisas multilíngues
LANGUAGE_QUERIES = {
    "en": f"Israel Palestine Gaza conflict news {data_hoje}",  # Inglês
    "ar": f"أخبار الصراع الإسرائيلي الفلسطيني غزة {data_hoje}",  # Árabe
    "he": f"חדשות סכסוך ישראל פלסטין עזה {data_hoje}",  # Hebraico
    "pt": f"Israel Palestina Gaza conflito notícias {data_hoje}"  # Português
}

# Função para extrair o domínio de uma URL
def extrair_dominio(url):
    try:
        from urllib.parse import urlparse
        return urlparse(url).netloc
    except Exception as e:
        logging.error(f"Erro ao extrair domínio da URL {url}: {e}")
        return url

# Função para extrair o texto de uma página
def extrair_texto(url):
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        response.encoding = response.apparent_encoding
        soup = BeautifulSoup(response.text, "html.parser")
        for tag in soup(['script', 'style', 'footer', 'nav', 'header', 'aside', 'iframe', 'noscript']):
            tag.decompose()
        texto = soup.get_text(separator="\n", strip=True)
        dominio = extrair_dominio(url)
        return texto, dominio
    except Exception as e:
        logging.error(f"Erro ao acessar {url}: {e}")
        return f"Erro ao acessar {url}: {e}", extrair_dominio(url)

# Função para buscar notícias usando DuckDuckGo
def buscar_noticias(query, num_results):
    try:
        logging.info(f"Buscando no DuckDuckGo: {query}")
        ddgs = DDGS()
        resultados = ddgs.text(query, max_results=num_results)
        return [resultado['href'] for resultado in resultados]
    except Exception as e:
        logging.error(f"Erro ao buscar no DuckDuckGo: {e}")
        return []

# Função para limpar o texto (remover "sujeira")
def limpar_texto(texto):
    # Remove linhas muito curtas (provavelmente lixo)
    linhas = [linha.strip() for linha in texto.split('\n') if len(linha.strip()) > 20]
    return '\n'.join(linhas)

# Função para dividir o texto em chunks menores
def dividir_em_chunks(texto, max_tokens=max_tokens_por_chunk):
    # Estimativa grosseira de tokens (4 caracteres ~ 1 token)
    chunks = []
    chunk_atual = ""
    token_count_estimado = 0

    for paragrafo in texto.split('\n\n'):
        tokens_estimados = len(paragrafo) // 4
        if token_count_estimado + tokens_estimados > max_tokens:
            if chunk_atual:
                chunks.append(chunk_atual)
            chunk_atual = paragrafo
            token_count_estimado = tokens_estimados
        else:
            if chunk_atual:
                chunk_atual += '\n\n' + paragrafo
            else:
                chunk_atual = paragrafo
            token_count_estimado += tokens_estimados

    if chunk_atual:
        chunks.append(chunk_atual)

    return chunks

# Função para resumir o conteúdo dos textos usando o LLaMA
def resumir_textos(llm, texto_completo):
    # Divide o texto em chunks menores
    chunks = dividir_em_chunks(texto_completo, max_tokens=max_context_tokens - 500)  # Reserva espaço para o prompt
    logging.info(f"Texto dividido em {len(chunks)} chunks para processamento.")

    resumos_chunks = []
    for i, chunk in enumerate(chunks):
        logging.info(f"Processando chunk {i+1}/{len(chunks)}...")
        
        # Prompt simplificado
        prompt = f"""Resuma o seguinte trecho sobre o conflito Israel-Palestina:
---
{chunk}
---
Resumo:"""
        
        try:
            resultado = llm(prompt, max_tokens=200, temperature=0.2, stop=["</resposta>"])
            resumos_chunks.append(resultado["choices"][0]["text"].strip())
        except Exception as e:
            logging.error(f"Erro ao processar chunk {i+1}: {e}")
            continue
        
        # Libera memória após cada chunk
        del resultado
        gc.collect()
        time.sleep(1)  # Pausa para evitar sobrecarga

    # Combina os resumos dos chunks em um único resumo
    resumo_completo = "\n\n".join(resumos_chunks)

    # Gera um resumo final consolidado
    logging.info("Gerando resumo consolidado final...")
    prompt_final = f"""Combine e refine os seguintes resumos sobre o conflito Israel-Palestina:
---
{resumo_completo}
---
Resumo Consolidado:"""
    try:
        resumo_consolidado = llm(prompt_final, max_tokens=500, temperature=0.2, stop=["</resposta>"])
        return resumo_consolidado["choices"][0]["text"].strip()
    except Exception as e:
        logging.error(f"Erro ao gerar resumo consolidado: {e}")
        return "Erro ao gerar resumo consolidado."

# Função principal
def main():
    try:
        logging.info(f"Iniciando monitoramento do conflito Israel-Palestina para o dia {data_hoje}...")
        all_urls = []

        # Realiza pesquisas em cada idioma
        for idioma, query in LANGUAGE_QUERIES.items():
            logging.info(f"Realizando pesquisa em {idioma}: '{query}'...")
            results = buscar_noticias(query, num_results_per_language)
            if results:
                url = results[0]  # Usa apenas a primeira URL
                all_urls.append((url, idioma))
                logging.info(f"Selecionada URL para {idioma}: {url}")
            else:
                logging.warning(f"Nenhuma URL encontrada para {idioma}.")
            time.sleep(2)

        arquivos_resultado = []
        textos_para_resumo = []

        for i, (url, idioma) in enumerate(all_urls, start=1):
            logging.info(f"\nProcessando link {i}: {url} (Idioma: {idioma})")
            texto, dominio = extrair_texto(url)

            # Detecta o idioma do texto extraído
            try:
                idioma_detectado = detect(texto)
                if idioma_detectado != idioma:
                    logging.warning(f"Idioma detectado ({idioma_detectado}) difere do esperado ({idioma}). Ignorando.")
                    continue
            except LangDetectException as e:
                logging.error(f"Erro ao detectar idioma do texto de {url}: {e}")
                continue

            output_file = os.path.join(output_folder, f"resultado_{i}.txt")
            with open(output_file, "w", encoding="utf-8") as arquivo:
                arquivo.write(f"URL: {url}\n")
                arquivo.write(f"Idioma: {idioma_detectado}\n\n")
                arquivo.write(texto)
            logging.info(f"Texto salvo em: {output_file}")
            arquivos_resultado.append(output_file)
            textos_para_resumo.append(texto)
            time.sleep(2)

        if textos_para_resumo:
            logging.info("\nGerando resumo consolidado...")
            llm = Llama(model_path=model_path, n_ctx=max_context_tokens, n_threads=4)  # Limite de contexto ajustado
            
            # Combina todos os textos em um único bloco
            texto_completo = "\n\n".join(textos_para_resumo)
            resumo_consolidado = resumir_textos(llm, texto_completo)

            # Salva o relatório final
            data_formatada = datetime.datetime.now().strftime("%d-%m-%Y")
            arquivo_relatorio = os.path.join(output_folder, f"Israel_x_Palestina_{data_formatada}_Resumo.txt")
            with open(arquivo_relatorio, "w", encoding="utf-8") as f:
                f.write(f"ISRAEL X PALESTINA\n")
                f.write(f"Relatório de Notícias - {data_formatada}\n\n")
                f.write(f"RESUMO DOS ACONTECIMENTOS:\n\n")
                f.write(resumo_consolidado)
                f.write("\n\n")
                f.write("FONTES CONSULTADAS:\n")
                for i, (url, idioma) in enumerate(all_urls, start=1):
                    f.write(f"{i}. {url} ({idioma.upper()})\n")
            logging.info(f"\nRelatório final salvo em: {arquivo_relatorio}")
        else:
            logging.warning("Nenhum texto foi processado para gerar o resumo.")

    except Exception as e:
        logging.error(f"Erro durante o processamento: {e}")

if __name__ == "__main__":
    main()
