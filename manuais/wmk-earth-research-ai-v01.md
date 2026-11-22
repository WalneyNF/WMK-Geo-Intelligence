# WMK Earth Research AI — Investigador geográfico v0.1 (Groq)

Esta integração é **aditiva** ao WMK Geo Intelligence: preserva o globo Cesium, câmeras públicas, camadas, fotos e mecanismos de busca de lugares existentes.

Créditos da integração: **Walney Moreira Klein — walneyk@hotmail.com**. Preservar atribuições e licenças dos projetos de origem.

## Recursos implementados nesta versão experimental
- Painel flutuante e arrastável "WMK Investigador IA", aberto junto com o globo.
- Campo "Local investigado", por exemplo "Paris, França", para contextualizar uma investigação.
- Botão "Usar centro do globo" captura coordenadas do ponto central da visão Cesium, sem alterar as camadas nem adicionar pontos fictícios.
- SearXNG local para pesquisa de fontes com URLs e trechos, usando API JSON.
- Análise dos resultados pela API Groq, com o modelo `openai/gpt-oss-20b` como padrão configurável.
- Apresentação de resposta e links de fontes, com avisos de erro e teste de configuração.
- Chave Groq permanece exclusivamente no servidor Vite (não coloque a chave em variáveis `VITE_*`).

## Requisitos
Node.js compatível com o projeto Geo Intelligence e npm. SearXNG deve ser executado separadamente sem Docker; habilitar `format=json` em suas configurações. A API Groq depende de internet, chave válida e de um modelo disponível.

## Preparar o Windows
Na raiz do checkout desta branch, copie `.env.example` para `.env`, mantenha suas chaves geográficas e acrescente:

```dotenv
GROQ_API_KEY=sua_chave_privada
WMK_GROQ_MODEL=openai/gpt-oss-20b
WMK_SEARXNG_URL=http://127.0.0.1:8888
```

Não versione o arquivo `.env`. Certifique-se de que o SearXNG responde em `http://127.0.0.1:8888/search?q=Paris&format=json`.

Execute:

```powershell
npm install
npm run dev
```

Abra o endereço local exibido pelo Vite (normalmente `http://127.0.0.1:4173/`). O painel "WMK Investigador IA" aparece na interface principal quando a aplicação inicia.

## Exemplo de uso
1. Use a busca de lugares **já existente** no globo para navegar até "Paris, França".
2. No painel do investigador, informe "Paris, França" em Local investigado, ou selecione "Usar centro do globo" após centralizar a cidade.
3. Escreva "Quais são os principais acontecimentos históricos e monumentos deste lugar?".
4. Clique "Investigar". As fontes virão de SearXNG e a interpretação da Groq.
5. Clique nos links para conferir as informações.

O campo do local não executa sozinho um voo de câmera; a navegação segue sob controle da busca de lugares original do Geo Intelligence. A IA ainda **não executa movimentos do globo**, não posiciona fontes automaticamente, nem mantém um histórico conversacional de várias perguntas. São etapas posteriores.

## Diagnóstico e limites
- `GET /wmk-research/status`: confirma presença da chave e a URL configurada, não a validade efetiva das credenciais.
- `GET /wmk-research/search?q=Paris`: usa SearXNG e deve devolver uma lista `results`.
- `POST /wmk-research/ask`: usa Groq para responder a partir de pergunta e fontes (somente acessível via host local).
- O painel é uma integração **do servidor de desenvolvimento Vite**, não uma versão de produção e não está homologada com build ou testes Windows.
- Se o SearXNG não estiver disponível, a pesquisa informa erro em vez de inventar fontes.
- Não exponha o servidor de desenvolvimento à internet. Adote autenticação, limites e controles de custo antes de publicação.
- Localizações em coordenadas podem gerar pesquisa imprecisa; informe cidade/país no campo quando possível.
- Resultados SearXNG são metadados e trechos de páginas, não verificação independente. A resposta deve ser conferida nas fontes.
- Câmeras públicas existentes permanecem no Geo Intelligence, mas **ainda não são inspecionadas automaticamente pela IA**.

## Critérios de aceite pendentes
- `npm run build` e testes automatizados em ambiente compatível.
- Abertura do globo sem regressões em suas camadas de CCTV, imagens e navegação.
- Testes de busca JSON contra um SearXNG real e geração Groq com chave válida.
- Teste de seleção de coordenadas no globo, fontes, erros e comportamento mobile.

## Próximas entregas
- Assistente conversacional com histórico por lugar e comandos de navegação validados.
- Identificação de local por geocodificação reversa e seleção de um marcador.
- Filtros para câmeras e imagens públicas da região, com data e procedência.
- Painéis redimensionáveis, layouts salvos em JSON e dossiês de investigação.
