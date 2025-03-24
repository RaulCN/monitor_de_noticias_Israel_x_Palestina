# Monitor do Conflito Israel-Palestina

## 📰 Visão além das narrativas dominantes

Este projeto nasceu da necessidade de oferecer uma visão mais equilibrada e abrangente do conflito Israel-Palestina, indo além das narrativas frequentemente unilaterais apresentadas pela mídia tradicional. Através da coleta e análise automática de notícias em múltiplos idiomas, buscamos democratizar o acesso à informação e fomentar o pensamento crítico sobre este complexo conflito geopolítico.

## 🔍 Fundamentação

O conflito Israel-Palestina é frequentemente retratado de maneira simplificada e enviesada pelos grandes veículos de comunicação, que tendem a privilegiar determinadas perspectivas em detrimento de outras. Este desequilíbrio na cobertura midiática dificulta a compreensão holística da situação e limita o debate público informado.

Nossa ferramenta se fundamenta em princípios essenciais:

- **Pluralidade de vozes**: Incorporamos fontes em múltiplos idiomas (árabe, hebraico, inglês e português) para capturar diferentes perspectivas culturais e geopolíticas
- **Direitos humanos**: Reconhecemos a dignidade inerente e os direitos inalienáveis de todos os povos envolvidos no conflito
- **Transparência**: Todas as fontes utilizadas são claramente documentadas e disponibilizadas
- **Solidariedade entre os povos**: Buscamos promover a compreensão mútua e o diálogo construtivo
- **Jornalismo engajado**: Acreditamos no papel transformador da informação para construção de sociedades mais justas

## 🛠️ Como funciona

O sistema opera através de um pipeline automatizado:

1. **Coleta multilíngue**: Busca notícias recentes em árabe, hebraico, inglês e português usando termos específicos
2. **Extração de conteúdo**: Processa o texto das páginas web, removendo elementos irrelevantes
3. **Verificação de idioma**: Confirma se o conteúdo está no idioma esperado
4. **Processamento com IA**: Utiliza o modelo Gemma para resumir o conteúdo de forma equilibrada
5. **Consolidação**: Cria um resumo abrangente que integra informações de todas as fontes
6. **Publicação**: Disponibiliza diariamente um novo relatório consolidado

## 📊 Resultados

Os resultados são publicados diariamente em nosso [site](https://monitor-conflito-israel-palestina.vercel.app) e incluem:

- Um resumo consolidado dos principais acontecimentos
- A listagem completa das fontes consultadas
- Arquivos de texto com o conteúdo original extraído

Exemplo de resumo (23/03/2025):
> O conflito Israel-Palestina, que se estende por quase 18 meses desde o ataque do Hamas a Israel em 7 de outubro de 2023, continua intensamente, com Israel intensificando seus ataques no sul de Gaza, particularmente em Rafah. A escalada recente envolveu a evacuação da população de Tel al-Sultan e a morte de líderes do Hamas, incluindo Salah al-Arouri e Salah al-Bardaweel, em ataques aéreos israelenses. As estimativas de mortos e feridos em Gaza variam significativamente...

## 🚀 Tecnologias utilizadas

- **Python**: Linguagem base para desenvolvimento
- **BeautifulSoup**: Extração de conteúdo de páginas web
- **DuckDuckGo Search**: API para busca de notícias sem filtros bolha
- **LangDetect**: Verificação de idioma dos conteúdos
- **Gemma**: Modelo de IA para processamento e resumo de textos

## 💻 Como utilizar

### Pré-requisitos

- Python 3.8+
- Acesso a internet para busca de notícias


### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/monitor-conflito-israel-palestina.git
cd monitor-conflito-israel-palestina

# Instale as dependências
pip install -r requirements.txt

# Baixe o modelo Gemma (requer autenticação)
# Instruções em: https://github.com/google/gemma
```

### Configuração

Edite as configurações no arquivo `monitor_de_notícias_Israel_Palestina.py`:

```python
# Configurações
model_path = "/caminho/para/seu/modelo/gemma-3-4b-it-Q4_K_M.gguf"
num_results_per_language = 1  # Aumente para mais fontes por idioma
```

### Execução

```bash
python monitor_de_notícias_Israel_Palestina.py
```

## 🤝 Contribuindo

Contribuições são bem-vindas e podem ajudar a melhorar esta ferramenta:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Crie um Pull Request

Áreas prioritárias para contribuição:
- Inclusão de mais idiomas e fontes
- Melhorias no algoritmo de análise e resumo
- Interface web para visualização de dados
- Análise comparativa de viés nas diferentes fontes


## ⚠️ Nota importante

Esta ferramenta busca oferecer uma visão mais equilibrada do conflito, mas reconhecemos que nenhuma análise está completamente livre de vieses. Encorajamos os usuários a consultar múltiplas fontes e a formar suas próprias opiniões baseadas em fatos verificáveis e princípios de direitos humanos.

O código e os resultados deste projeto são disponibilizados para fins informativos e educacionais. Não nos responsabilizamos pelo uso indevido das informações fornecidas.

---

**Desenvolvido com ❤️ por defensores de uma cobertura justa e humanitária do conflito Israel-Palestina.**
