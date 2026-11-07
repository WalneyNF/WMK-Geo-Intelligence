# WMK GPS — Biblioteca multilinguagem

Créditos: Walney Moreira Klein — walneyk@hotmail.com.

## Projetos e validação

| Linguagem | Fonte | Estado |
|---|---|---|
| Node.js | enviar-node.mjs | POST HTTP 202 confirmado |
| Python | enviar-python.py | POST HTTP 202 confirmado |
| PHP | enviar-php.php | POST HTTP 202 confirmado |
| PowerShell | enviar-powershell.ps1 | POST HTTP 202 confirmado |
| TypeScript | typescript/ | Fonte criada, execução pendente |
| React + Leaflet | react-web/ | Fonte criada, teste visual pendente |
| Rust | rust/ | Fonte criada, compilação pendente |
| React Native | react-native/App.tsx | Trecho para Expo, não testado em celular |
| Kotlin Android | android-kotlin/MainActivity.kt | Trecho para Android Studio, não testado |
| SwiftUI iOS | ios-swift/WMKGPSView.swift | Trecho para Xcode, não testado |

## Preparação do receptor
Inicie a ponte em porta 8770 com `WMK_BRIDGE_PORT=8770` e uma chave privada `WMK_BRIDGE_WRITE_KEY`. Configure a mesma chave e `WMK_GPS_URL=http://127.0.0.1:8770` nos clientes de envio.

## Comandos
- Node: `node enviar-node.mjs`
- Python: `python enviar-python.py`
- PHP: `php enviar-php.php`
- PowerShell: `.\enviar-powershell.ps1`
- TypeScript: `cd typescript && npm install && npm run build && npm start`
- React web: `cd react-web && npm install && npm run dev`
- Rust: `cd rust && cargo run`

A instalação de pacotes pode usar espaço em disco. Não execute npm/cargo sem verificar a localização de cache/instalação. Os exemplos móveis são trechos para projetos criados nas ferramentas oficiais; não são APK/IPA completos.

## Segurança e integração
A escrita externa exige `X-WMK-API-Key` e aceita JSON com id, latitude, longitude e simulated. HTTP 202 indica evento aceito, não visualização no mapa 3D. Não coloque chaves em React web, React Native, Android ou iOS. Não exponha a ponte de laboratório na internet. Use HTTPS e backend autenticado em produção. Em celular, 127.0.0.1 significa o próprio aparelho.

Documentação: [curso completo](../../manuais/curso-gps-multilinguagem.html).
