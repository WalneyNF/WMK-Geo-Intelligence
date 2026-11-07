# WMK GPS Layer 0.1 — Manual do usuário e desenvolvedor

**Créditos: Walney Moreira Klein — walneyk@hotmail.com**

## Objetivo
Visualizar os quatro veículos do simulador WMK no mapa Cesium do Geo Intelligence, com painel móvel, seleção, câmera e atualização periódica. **Esta versão não exibe GPS real.**

## Pré-requisitos
- WMK Geo Intelligence executando normalmente (ex.: http://127.0.0.1:4173).
- Ponte de simulação do WMK GPS Tracker ativa na porta 8766.
- Teste a API: http://127.0.0.1:8766/api/v1/vehicles?source=simulator
- A resposta precisa ter `schemaVersion: "1.0"` e `items` com `position.latitude` e `position.longitude`.

## Manual do usuário
1. Abra o mapa principal do WMK Geo Intelligence.
2. Aguarde o mapa terminar de carregar.
3. Localize o painel **WMK GPS · LAB** no canto superior direito.
4. Marque **Exibir veículos simulados**.
5. Clique em **Centralizar frota** para enquadrar os quatro veículos.
6. Clique em um veículo da lista ou no marcador verde para consultar dados.
7. Clique em **Seguir / aproximar** para aproximar a câmera.
8. Arraste a barra de título para reposicionar o painel. Clique em **—** para recolhê-lo.
9. Desmarque a opção para ocultar a camada e suspender as consultas.

Atualização padrão: 10 segundos. Marcadores alaranjados indicam posições antigas (mais de 60 segundos) ou com horário inválido. Se a API cair, o painel apresenta a falha; os últimos marcadores permanecem visíveis até a próxima atualização bem-sucedida.

## Manual do desenvolvedor
- `src/wmk/gps/gpsStore.js`: valida e normaliza os dados, verifica idade da posição.
- `src/wmk/gps/gpsLayer.js`: Cesium CustomDataSource, entidades, painel, polling, seleção e descarte.
- `src/wmk/gps/gpsStore.test.mjs`: testes unitários.
- `src/main.js`: monta a camada após a inicialização da cena, sem alterar os sistemas de outras camadas.

### Contrato de leitura
```http
GET http://127.0.0.1:8766/api/v1/vehicles?source=simulator
```
A implementação utiliza `fetch` do navegador. A ponte deve permitir CORS para a origem do Geo Intelligence (4173). Não adicione chaves privadas à URL, ao HTML ou ao JavaScript.

### Testes
```powershell
node --test src/wmk/gps/gpsStore.test.mjs
npm run build
```

### Segurança e limitações
A camada é **opt-in**, desativada inicialmente e acessa somente a fonte simulada local. Não utiliza a chave administrativa do Security Center. Para GPS real, implemente um endpoint de backend autenticado no Geo Intelligence e utilize o Bridge protegido sem expor segredos. O estado e a posição do painel ainda não são persistidos. A camada usa pontos e etiquetas Cesium, não modelos 3D de caminhões; isso pode evoluir depois de testes visuais.

### Próximas versões
0.2: backend autenticado e configuração da fonte; 0.3: dispositivos reais Traccar; 0.4: histórico, rotas e geofencing.
