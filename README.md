# WMK Geo Intelligence — Earth Research AI

![Logotipo WMK Geo Intelligence](public/wmk-logo.png)

**Explore o planeta em 3D, pesquise informações na internet e converse com o Investigador IA usando Groq.**

**Edição WMK:** Walney Moreira Klein — walneyk@hotmail.com.  
**Base original:** [God's Eye View](https://github.com/bilawalsidhu/gods-eye-view), com créditos e licenças preservados.

> **Versão experimental v0.3:** código disponível na branch `wmk/earth-research-v01`. Ainda não há instalador EXE, versão portátil homologada ou release final. O código da branch `main` pode não conter as funcionalidades mais recentes do Investigador IA.

## 📦 Baixar a versão com Investigador IA

**Opção A — ZIP (não precisa de Git):** [Baixar código-fonte da versão experimental](https://github.com/WalneyNF/WMK-Geo-Intelligence/archive/refs/heads/wmk/earth-research-v01.zip). Descompacte em uma pasta nova. O ZIP contém o código, **não um aplicativo executável**, e ainda exige Node.js e configuração.

**Opção B — Git (facilita futuras atualizações):**

```powershell
git clone -b wmk/earth-research-v01 https://github.com/WalneyNF/WMK-Geo-Intelligence.git WMK-Geo-Intelligence
cd WMK-Geo-Intelligence
```

**Instalação e primeiros testes:** [Manual do Investigador IA v0.3](manuais/wmk-investigador-v03.md) · [Guia de instalação para usuários e desenvolvedores](manuais/instalacao-investigador-windows.md).

### Instalação rápida no Windows — sem Docker

Requer **Node.js compatível** (conforme `package.json`: 24.14+ dentro da série 24 ou a série 26), npm e conexão à internet para dependências e Groq.

```powershell
Copy-Item .env.example .env
npm install
npm run dev
```

No `.env`, configure **`GROQ_API_KEY`** com sua chave privada e opcionalmente `WMK_GROQ_MODEL=openai/gpt-oss-20b`. Nunca publique esse arquivo ou sua chave. Abra o endereço local que o Vite mostrar no terminal.

O mecanismo de busca tenta SearXNG local, quando configurado, e depois fontes RSS externas. **RSS não substitui uma busca web completa**: notícias, bloqueios ou indisponibilidade podem limitar resultados. A aplicação continua capaz de conversar pelo Groq sem fontes web, deixando essa limitação explícita.

### Funcionalidades desta versão experimental

- Globo Cesium e camadas geoespaciais existentes preservadas.
- Painel flutuante WMK Investigador IA e respostas em português.
- Pesquisa externa com links das fontes quando serviços responderem.
- Local investigado, captura do centro do globo e botão **Ir para o local**.
- Comandos simples de navegação, como `Me leve para Paris, França`, reutilizando a busca de lugares existente.
- Diagnóstico de Groq (chave presente) e dos mecanismos web (consulta real).

**Ainda não implementado:** conversa persistente, investigação autônoma profunda, identificação automática de câmeras/fotos pela IA, navegação livre gerada pelo modelo e instalador Windows final. A integração v0.3 não foi homologada por testes completos em Windows.

### Atualizar instalações feitas com Git

```powershell
git status
git switch wmk/earth-research-v01
git pull --ff-only origin wmk/earth-research-v01
npm install
npm run dev
```

Proteja alterações locais antes de atualizar; preserve o `.env`. Quem baixou por ZIP deve baixar novamente uma versão atualizada e transferir suas configurações com cuidado.

### Documentação e suporte

- [Instalação Windows, download, erros e testes](manuais/instalacao-investigador-windows.md)
- [Investigador v0.3: recursos, limites e exemplos](manuais/wmk-investigador-v03.md)
- [Histórico da integração Groq/SearXNG](manuais/wmk-earth-research-ai-v01.md)
- [Comparar e revisar as modificações antes de unir à main](https://github.com/WalneyNF/WMK-Geo-Intelligence/pull/1)

---

## Documentação do Geo Intelligence original e demais módulos

![Logotipo WMK Geo Intelligence](public/wmk-logo.png)

**WMK Geo Intelligence** — plataforma de inteligência geoespacial com interface 3D e fontes de dados configuráveis.

**Créditos da edição WMK:** Walney Moreira Klein — walneyk@hotmail.com.

Baseado no projeto original [God's Eye View](https://github.com/bilawalsidhu/gods-eye-view), com preservação das licenças e atribuições aplicáveis.


Este é o meu fork do projeto original [God's Eye View](https://github.com/bilawalsidhu/gods-eye-view), um simulador de satélite espião que roda no navegador com dados reais e open-source.

## O que eu mudei/adicionei neste fork:
- **Tradução completa para Português (pt-BR):** Criei os arquivos de tradução e configurei o sistema de internacionalização (i18n) para aceitar o português.
- **Documentação Mastigada:** Este Readme explica passo a passo como configurar as chaves de API, que foi a parte mais difícil do processo.

---

## 🛠️ Pré-requisitos
Antes de começar, você vai precisar ter instalado no seu computador:
1. **[Node.js](https://nodejs.org/)** (Recomendo a versão **24.x** ou superior).
2. **Git** (para clonar o repositório).
3. Um editor de código (recomendo o **[VS Code](https://code.visualstudio.com/)**).

---

## 🚀 Passo a Passo para Rodar o Projeto

### 1. Clonar e Instalar
Abra o seu terminal (CMD ou terminal do VS Code) e rode os comandos:
    git clone https://github.com/WalneyNF/WMK-Geo-Intelligence.git
    cd WMK-Geo-Intelligence
    npm install

### 2. Configurar o arquivo .env (A PARTE MAIS IMPORTANTE)
O projeto precisa de chaves de API para puxar os dados reais. O arquivo onde essas chaves ficam guardadas é o **.env** (que não vai para o GitHub por segurança).

1. Na raiz do projeto, procure o arquivo chamado **.env.example**.
2. Faça uma cópia dele e renomeie a cópia para **.env** (sem o .example).
3. Abra o arquivo .env no VS Code e preencha as chaves conforme o tutorial abaixo.

#### 🔑 Onde conseguir cada chave:

**1. Cesium ion (Para o mapa 3D fotorrealista)**
- **Onde pegar:** Acesse [cesium.com/ion](https://cesium.com/ion/), crie uma conta gratuita e vá em "Access Tokens".
- **No .env:** Cole o token na linha `CESIUM_ION_TOKEN=`.
- *Nota: O plano gratuito é para uso pessoal e não comercial.*

**2. TomTom (Para o trânsito real)**
- **Onde pegar:** Acesse [my.tomtom.com/keys](https://my.tomtom.com/keys), crie uma conta gratuita e gere uma API Key.
- **No .env:** Cole na linha `TOMTOM_API_KEY=`.
- *Importante: O plano gratuito tem um limite de 200.000 requisições por mês.*

**3. OpenSky Network (Para os aviões)**
- **Onde pegar:** Acesse [opensky-network.org](https://opensky-network.org/), crie uma conta e, no painel, crie um "API Client". Ele vai te dar um **Client ID** e um **Client Secret** (ou baixar um credentials.json).
- **No .env:** Configure assim:
  `OPENSKY_AUTH_MODE=oauth`
  `OPENSKY_CLIENT_ID=seu_client_id_aqui`
  `OPENSKY_CLIENT_SECRET=seu_client_secret_aqui`
- *Aviso: Sem o OAuth, o app usa a cota anônima (400 créditos/dia), que esgota em minutos.*

**4. Gemini (Para a IA de voz - Opcional)**
- **Onde pegar:** Acesse o [Google AI Studio](https://aistudio.google.com/), faça login com sua conta Google e clique em "Get API key".
- **No .env:** Cole na linha `GEMINI_API_KEY=`.
- *Nota: O Gemini tem um plano gratuito para testes.*

**5. Outras chaves (Opcionais)**
- **AISStream:** Para ver os navios (grátis em [aisstream.io](https://aisstream.io)).
- **NASA FIRMS:** Para ver focos de incêndio (grátis em [firms.modaps.eosdis.nasa.gov](https://firms.modaps.eosdis.nasa.gov/api/map_key/)).
- **OpenAI:** Para usar o ChatGPT como voz (Pago, em [platform.openai.com](https://platform.openai.com)).

*(Após preencher o .env, salve o arquivo).*

### 3. Rodar o Servidor
No terminal, rode:
    npm run dev

Abra o navegador no endereço mostrado (geralmente http://localhost:4173).

---

## 🕹️ Como usar a Interface (Tradutor de Comandos)

- **POWER UP:** Botão no canto inferior direito onde você cola as chaves de API (se preferir colar pelo app em vez de editar o .env).
- **DATA LAYERS (Camadas de Dados):** Onde você liga os Aviões, Trânsito, Satélites e Câmeras.
- **Teclado:**
  - **1 a 7:** Muda o filtro visual (Normal, CRT, NVG, FLIR, Anime, Noir, Snow).
  - **M:** Liga/Desliga o Modo Matrix.
  - **C:** Entra no Cockpit do avião selecionado.
  - **Esc:** Sai do Cockpit ou fecha menus.

---

## 🤝 Créditos
- Projeto original criado por **[Bilawal Sidhu](https://github.com/bilawalsidhu)** e **[Sameh Khamis](https://github.com/samehkhamis)**.
- Tradução e documentação deste fork feita por **[Walney Moreira Klein](https://github.com/WalneyNF)**.
## Documentacao WMK em portugues
- [Padrao de documentacao](manuais/PADRAO-DOCUMENTACAO-WMK.md)
- [Instalacao e testes](manuais/INSTALACAO-E-TESTES.md)
Contribuicoes WMK: Walney Moreira Klein - walneyk@hotmail.com. Preservadas licencas originais.


## Funcionamento independente e integrado — suíte WMK

**Este projeto funciona de maneira independente:** não é obrigatório instalar os outros dois projetos WMK para usar suas funções principais.

**Modo independente — WMK Geo Intelligence:** Abre o mapa e consome suas próprias fontes, conforme configurações e chaves de API, sem os demais.

**Modo integrado (opcional):** Pode futuramente visualizar posições do Tracker por meio do Bridge. O fluxo completo ainda não foi validado.

**Projetos relacionados:** [WMK GPS Tracker](https://github.com/WalneyNF/WMK-GPS-Tracker) · [WMK Geo Bridge](https://github.com/WalneyNF/WMK-Geo-Bridge) · [WMK Geo Intelligence](https://github.com/WalneyNF/WMK-Geo-Intelligence).

**Situação dos testes:** os serviços responderam individualmente no laboratório, mas a integração ponta a ponta ainda não está aprovada. Consulte os manuais e os testes antes de disponibilizar dados privados.

**Documentação:** [padrão WMK](manuais/PADRAO-DOCUMENTACAO-WMK.md). Créditos das contribuições WMK: **Walney Moreira Klein — walneyk@hotmail.com**. Preserve também as licenças e os avisos dos autores originais.

## Laboratorio de integracao GPS (desenvolvimento)
Com o Vite iniciado, abra [Laboratorio WMK GPS](http://127.0.0.1:4173/geo-bridge-lab.html) para testar health, configuracao e consulta de veiculos do Geo Bridge sem depender do mapa 3D. A porta do Vite pode variar; ajuste o endereco conforme a instancia. O Bridge precisa de credenciais do Traccar para retornar dispositivos. Este laboratorio e uma pagina de desenvolvimento, ainda nao validada em build de producao.

**Manual didatico do laboratorio GPS:** [abrir manual HTML](manuais/laboratorio-gps.html) - diagnostico HTTP 503, autenticacao, testes e exercicios.

**Manual completo do Laboratorio GPS (usuario e desenvolvedor):** [abrir manual HTML](manuais/manual-completo-laboratorio-gps.html). Explica a tela, arquitetura Python/HTTP/JSON/JavaScript, polling, testes, erros e exercicios.

## Curso pratico: testar e consumir a API GPS
[Manual completo de testes e desenvolvimento HTML/CSS/JavaScript](manuais/manual-testes-e-cliente-gps.html) · [Exemplo pronto com 3 arquivos](exemplos/cliente-gps/index.html). Inclui configuracao, JSON, fetch, polling, diagnostico, seguranca e exercicios.

**Manual de fontes GPS:** [Como alimentar o GPS com Python, celulares, rastreadores, Node.js, PHP e outras fontes](manuais/fontes-de-dados-gps.html). Inclui contratos, exemplos, testes e limitações atuais.

**Roteiro de testes de fontes GPS:** [testes HTTP, resultados observados e como reproduzir](manuais/roteiro-testes-fontes-gps.html).

**Curso GPS multilinguagem:** [manual de testes e mapa Leaflet](manuais/curso-gps-multilinguagem.html) | [codigo-fonte Node, Python, PHP, PowerShell e mapa HTML/JS](exemplos/gps-multilinguagem/). Quatro envios HTTP 202 verificados; renderizacao visual do mapa ainda pendente.

**Biblioteca GPS web/mobile:** [manual de TypeScript, React, Rust, React Native, Kotlin e Swift](manuais/integracao-gps-mobile-e-linguagens.html) | [fontes dos projetos](exemplos/gps-multilinguagem/README.md). Exemplos novos ainda nao validados em dispositivos.
