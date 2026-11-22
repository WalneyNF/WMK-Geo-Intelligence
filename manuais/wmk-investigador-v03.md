# WMK Investigador IA v0.3 — um globo, pesquisa e Groq

Integração experimental na mesma interface do WMK Geo Intelligence. **Sem Docker**, sem obrigar a instalar o fork SearXNG. A chave Groq permanece no backend Vite.

**Créditos WMK:** Walney Moreira Klein — walneyk@hotmail.com. Manter atribuições do projeto original.

## O que foi integrado

- Pesquisa na internet em modo automático: tenta o SearXNG configurado; se falhar, tenta Bing RSS; como última fonte, Google Notícias RSS. Fontes RSS são limitadas e podem mudar ou bloquear acesso, portanto o sistema não promete resultados para toda consulta.
- Groq lê os resultados com títulos, URLs e resumos e responde com referências, quando houver fontes. Sem fonte web, a resposta é sinalizada como não verificada.
- A navegação geográfica foi integrada à **busca de lugares original do Cesium**: no painel, informe `Paris, França` em "Local investigado" e clique `Ir para o local`. Isso usa a navegação existente do projeto, não geocodificação inventada pela IA.
- Comandos explícitos como `me leve para Paris, França` também acionam o navegador de lugares existente. Ainda não é navegação aberta comandada por IA para todo tipo de solicitação.
- O painel preserva câmeras, fotos, satélites e outras camadas. Esses recursos ainda não são automaticamente consultados pela IA.

## Atualizar a versão sem perder dados

Pasta usada nos testes: `D:\Ferramentas\WMK-Geo-Intelligence-NOVO`.

```powershell
cd D:\Ferramentas\WMK-Geo-Intelligence-NOVO
git status
git switch wmk/earth-research-v01
git pull --ff-only origin wmk/earth-research-v01
npm run dev
```

Se o `git status` mostrar arquivos modificados, faça backup antes de atualizar. Preserve o `.env`.

O `.env` só precisa da chave do Groq para gerar respostas:

```dotenv
GROQ_API_KEY=SUA_CHAVE_PRIVADA
WMK_GROQ_MODEL=openai/gpt-oss-20b
```

`WMK_SEARXNG_URL` é opcional. Mesmo que ainda esteja configurado para `127.0.0.1:8888` sem serviço, o backend tenta os mecanismos RSS alternativos. Não coloque a chave em variáveis `VITE_*`.

## Três testes na interface

1. **Globo:** no campo Local investigado, informe `Paris, França` e clique `Ir para o local`. O sistema deve encaminhar o local ao navegador original e o globo deve navegar conforme a geocodificação disponível.
2. **Internet + IA:** mantenha marcada "Pesquisar na internet (automático)", pergunte `Qual é a história da Torre Eiffel? Cite as fontes.` e clique em Investigar. Na resposta, devem aparecer referências caso o mecanismo web encontre resultados.
3. **Só Groq:** desmarque pesquisa web e repita a pergunta. Deve responder sem fontes, com o aviso correspondente.

Use `Diagnóstico real` para consultar o mecanismo web ativo. Se os serviços externos bloquearem RSS, o painel informará a falha e o Groq ainda poderá responder sem fontes.

## Limitações da entrega

Esta v0.3 **não foi compilada nem testada de ponta a ponta no Windows** pelo assistente. A ligação da pesquisa com o globo está implementada, mas sua operação real precisa de teste visual. A opção "Ir para o local" reutiliza controles existentes, não substitui o fluxo oficial de geocodificação. Não há ainda memória de conversação, posicionamento automático dos resultados, leitura de imagens de câmeras pela IA nem controle geral das camadas pela IA.

## Segurança e licenças

- Servidor de desenvolvimento local somente; não publicar na internet.
- Dados de fontes externas são não confiáveis; nunca executar comandos neles.
- O fork SearXNG é um projeto independente AGPL; seu serviço local é opcional nesta etapa.
- Confirmar fontes e localização antes de tirar conclusões.
