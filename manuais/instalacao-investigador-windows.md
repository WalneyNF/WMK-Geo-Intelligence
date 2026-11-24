# Manual de instalação e download — WMK Geo Intelligence com Investigador IA

**Guia para iniciantes e desenvolvedores (Windows, sem Docker).**  
Créditos das adaptações: **Walney Moreira Klein — walneyk@hotmail.com**.  
Origem: God's Eye View, com créditos e licenças originais preservados.

## 1. O que você está baixando

A branch `wmk/earth-research-v01` contém o Geo Intelligence e o módulo experimental **WMK Investigador IA v0.3**. A aplicação reúne um globo Cesium, camadas existentes e painel de pesquisa que conecta serviços externos ao Groq.

Não existe nesta etapa um instalador `.exe` nem uma versão portátil validada. **Baixar o ZIP não é o mesmo que instalar o programa.** A branch `main` não inclui necessariamente a atualização experimental.

## 2. Download sem Git

1. Abra https://github.com/WalneyNF/WMK-Geo-Intelligence/tree/wmk/earth-research-v01
2. Clique no botão **Code** e escolha **Download ZIP**.
3. Extraia em uma pasta própria, por exemplo `D:\Ferramentas\WMK-Geo-Intelligence`.
4. Abra o PowerShell nessa pasta (onde se encontra `package.json`).
5. Instale as dependências e configure a chave Groq conforme as instruções abaixo.

Link direto para ZIP: https://github.com/WalneyNF/WMK-Geo-Intelligence/archive/refs/heads/wmk/earth-research-v01.zip

## 3. Download para desenvolvedores com Git

```powershell
cd D:\Ferramentas
git clone -b wmk/earth-research-v01 https://github.com/WalneyNF/WMK-Geo-Intelligence.git WMK-Geo-Intelligence
cd WMK-Geo-Intelligence
```

Se já existir uma pasta com esse nome, escolha outra pasta. Não sobrescreva projetos com dados locais.

## 4. Preparar Node.js e variáveis

O `package.json` especifica Node.js `>=24.14.0 <25 || >=26 <27`. Verifique:

```powershell
node --version
npm --version
```

Copie a configuração de exemplo caso não exista `.env`:

```powershell
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
```

Abra `.env` e acrescente as linhas abaixo, substituindo o valor fictício da chave:

```dotenv
GROQ_API_KEY=COLOQUE_SUA_CHAVE_PRIVADA
WMK_GROQ_MODEL=openai/gpt-oss-20b
```

Não prefixe a chave Groq com `VITE_`, não envie a chave para terceiros e não versione o arquivo `.env`. Para o uso do globo, outras APIs e mapas podem requerer configuração individual conforme o README original.

**SearXNG é opcional nesta versão.** Se houver uma instância local com JSON habilitado, acrescente `WMK_SEARXNG_URL=http://127.0.0.1:8888`. Caso contrário, não é obrigatório instalar SearXNG: a aplicação tenta fontes RSS de Bing e Google Notícias. Elas podem falhar ou fornecer apenas informações limitadas.

## 5. Iniciar

```powershell
npm install
npm run dev
```

Abra no navegador a URL local exibida pelo Vite. Geralmente é `http://127.0.0.1:4173/`, mas a porta pode variar. A primeira instalação do `npm` precisa de internet.

### Como fechar

No terminal em que o Vite está em execução pressione `Ctrl+C`.

## 6. Roteiro de testes

1. Abra o globo e confirme que os controles e camadas existentes continuam disponíveis.
2. Localize o painel flutuante **WMK Investigador IA v0.3**.
3. Desmarque `Pesquisar na internet (automático)`, pergunte `O que é a Torre Eiffel?` e clique `Investigar`. Isso testa o Groq sem pesquisa web.
4. Marque novamente a pesquisa web, clique `Diagnóstico real` e observe qual mecanismo respondeu.
5. Pergunte `Pesquise a história da Torre Eiffel e cite fontes`. Confira os links. Se não houver resultados, o painel deve informar que a resposta não foi verificada na internet.
6. Em `Local investigado`, informe `Paris, França` e clique `Ir para o local`. A navegação usa a busca de lugares existente no globo; seu sucesso dependerá da geocodificação disponível.
7. Teste o botão `Usar centro do globo` em um ponto da Terra.

Os testes são instruções para validação manual. Não significam homologação nem certificação de que todos os provedores estão disponíveis.

## 7. Erros comuns

| Sintoma | Causa provável | Verificação |
| --- | --- | --- |
| `npm` não reconhecido | Node.js/npm indisponível no PATH | `node --version`, `npm --version` |
| `Groq HTTP 401` | Chave inválida ou não autorizada | Verifique `GROQ_API_KEY`; não compartilhe seu valor |
| `Groq HTTP 400` | Modelo ou corpo da requisição incompatível | Leia o erro do painel e confira o ID do modelo |
| `fetch failed` na pesquisa | Serviço web indisponível | Use Diagnóstico real e verifique internet; RSS é dependência externa |
| Nenhum resultado com fontes | Provedor retornou vazio ou falhou | Confirme links e não trate resposta sem fontes como pesquisa verificada |
| Mapa sem 3D ou imagens | APIs/tiles ausentes, incompatíveis ou com limites | Leia as configurações de Cesium/Google no README original |
| `fatal: not a git repository` | Instalação feita por ZIP, sem `.git` | Baixe novo ZIP ou clone uma pasta separada |
| Porta já em uso | Outro servidor ocupa a porta | Consulte a URL efetiva indicada no terminal |

## 8. Como atualizar

### Instalação feita com Git

```powershell
git status
git switch wmk/earth-research-v01
git pull --ff-only origin wmk/earth-research-v01
npm install
npm run dev
```

Se `git status` indicar modificações locais, faça backup ou commit antes de mudar de branch. Nunca execute `git reset --hard` para uma atualização comum.

### Instalação feita por ZIP

Baixe o ZIP novamente, extraia em uma pasta **nova** e copie com cuidado apenas os arquivos pessoais necessários (como `.env`). Não copie a pasta `node_modules` da instalação antiga. Instale as dependências na nova pasta com `npm install`.

## 9. Uso e limites

- O globo e as camadas existentes pertencem ao Geo Intelligence; o novo painel é uma integração adicional.
- Groq produz a resposta; as informações externas provêm dos mecanismos de pesquisa quando disponíveis.
- O modo RSS não substitui a cobertura ampla do SearXNG e não garante resultados.
- Não há ainda histórico conversacional, investigação autônoma completa, câmera controlada livremente por IA ou identificação automática de fotos/câmeras.
- O servidor Vite é voltado a desenvolvimento local, **não** deve ser exposto publicamente sem proteção.
- Algumas fontes de mapas e APIs podem ter termos, limites e custos próprios.

## 10. Para disponibilizar ao público

A branch experimental pode ser baixada como ZIP ou clonada agora. O passo recomendado para lançamento público será validar `npm run build`, executar testes end-to-end, corrigir problemas em Windows e publicar um **GitHub Release** com versão, notas e artefatos realmente testados. Não se deve anunciar arquivo executável antes de construí-lo.

**Contatos e créditos:** Walney Moreira Klein — walneyk@hotmail.com. Preserve atribuições de terceiros e licenças aplicáveis ao redistribuir.
