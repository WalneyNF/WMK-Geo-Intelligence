// Exemplo didático WMK: consumir uma API GPS sem frameworks.
// Walney Moreira Klein — walneyk@hotmail.com
'use strict';
const el = id => document.getElementById(id);
let consultando = false;
function status(texto, erro = false) {
  el('estado').textContent = texto;
  el('estado').className = erro ? 'erro' : 'sucesso';
}
function celula(linha, valor) {
  const td = document.createElement('td');
  td.textContent = valor == null ? '—' : String(valor); // Evita injeção HTML.
  linha.append(td);
}
function exibir(items) {
  const corpo = el('linhas');
  corpo.replaceChildren();
  el('quantidade').textContent = '(' + items.length + ')';
  for (const v of items) {
    const p = v.position ?? null;
    const tr = document.createElement('tr');
    for (const valor of [v.name ?? v.id, p?.latitude, p?.longitude,
      p?.speedKmh == null ? '—' : p.speedKmh + ' km/h',
      p?.timestamp, v.simulated === true ? 'Simulado' : v.source ?? 'Não informada']) {
      celula(tr, valor);
    }
    corpo.append(tr);
  }
  if (!items.length) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 6; td.textContent = 'Nenhum veículo retornado.';
    tr.append(td); corpo.append(tr);
  }
}
async function consultar() {
  if (consultando) return;
  consultando = true;
  el('consultar').disabled = true;
  try {
    const url = new URL('/api/v1/vehicles', el('url').value.trim());
    status('Consultando ' + url.origin + ' ...');
    const resposta = await fetch(url.toString(), {cache:'no-store'});
    if (!resposta.ok) throw new Error('HTTP ' + resposta.status);
    const dados = await resposta.json();
    if (dados.schemaVersion !== '1.0' || !Array.isArray(dados.items))
      throw new Error('JSON inválido: esperado schemaVersion 1.0 e items[]');
    exibir(dados.items);
    status('Consulta concluída: ' + dados.items.length + ' veículo(s), fonte ' +
      (dados.source ?? 'desconhecida') + ', às ' + new Date().toLocaleTimeString('pt-BR'));
  } catch (e) {
    status('Falha: ' + e.message +
      '. Confira API, porta e CORS. HTTP 503 na porta 8768 pode indicar credenciais ausentes.', true);
  } finally {
    consultando = false;
    el('consultar').disabled = false;
  }
}
el('consultar').addEventListener('click', consultar);
setInterval(() => { if (el('automatico').checked) consultar(); }, 10000);
