# Instalação, uso e testes — WMK Geo Intelligence

**Regra WMK:** documentação para usuários, desenvolvedores e administradores, exemplos testados, funcionamento independente, API documentada e créditos Walney Moreira Klein — walneyk@hotmail.com. Respeitar licenças upstream.

## 1. Como baixar e instalar

Baixe https://github.com/WalneyNF/WMK-Geo-Intelligence pelo botão Code > Download ZIP ou `git clone`. Instale uma versão do Node.js compatível com `package.json` (Node >=24.14 <25 ou >=26 <27), entre na pasta do projeto e execute `npm install`, depois `npm run dev`. Abra o endereço informado pelo Vite. Algumas camadas requerem APIs e chaves específicas.

## 2. Como verificar se funciona

Execute `npm test` e `npm run build`. A interface local respondeu HTTP 200 na porta 4173 em 06/11/2026. HTTP 200 não comprova funcionamento de todas as camadas ou integração GPS. Registre logs e falhas antes de publicar.

## 3. APIs e integração independente

O Geo Intelligence funciona sem os outros projetos WMK para suas funções próprias, sujeito às fontes de dados configuradas. Integração com Bridge e Tracker é opcional e ainda requer validação ponta a ponta.

## 4. Segurança e manutenção

Não publique tokens, credenciais, IMEI nem coordenadas pessoais. Faça backup de dados e configurações antes de atualizar. Verifique `git status` e preserve alterações locais. Utilize HTTPS e autorização para serviços expostos à internet.

## 5. Créditos e redistribuição

Contribuições WMK: **Walney Moreira Klein — walneyk@hotmail.com**. Preserve avisos de copyright, licenças e arquivos NOTICE aplicáveis dos autores originais. Atribuições adicionais devem respeitar a licença efetiva de cada componente.
