// WMK Pesquisa IA: painel flutuante aditivo; preserva camadas e controles Cesium existentes.
export function mountWmkResearch() {
  if (document.getElementById('wmk-research-panel')) return () => {};
  const root = document.createElement('section');
  root.id = 'wmk-research-panel';
  root.setAttribute('aria-label', 'WMK Investigador IA');
  root.innerHTML = `
    <div class="wmkr-title"><strong>🔎 WMK Investigador IA <small>v0.1 • Groq</small></strong><button type="button" data-toggle aria-label="Minimizar painel">−</button></div>
    <div class="wmkr-body">
      <form data-form>
        <label for="wmkr-question">Pesquise e investigue qualquer lugar do mundo</label>
        <textarea id="wmkr-question" rows="3" maxlength="1200" placeholder="Ex.: Investigue a história do Coliseu em Roma e cite fontes."></textarea>
        <div class="wmkr-actions"><button type="button" data-test>Verificar serviços</button><button data-submit type="submit">Investigar</button></div>
      </form>
      <p data-status role="status">Motor web: SearXNG • Investigador: Groq</p>
      <div data-answer class="wmkr-answer" aria-live="polite"></div>
      <div data-sources class="wmkr-sources"></div>
      <p class="wmkr-credit">Walney Moreira Klein — walneyk@hotmail.com</p>
    </div>`;
  const style = document.createElement('style');
  style.id = 'wmk-research-style';
  style.textContent = `
  #wmk-research-panel{position:fixed;right:18px;top:80px;width:390px;max-width:calc(100vw - 24px);max-height:75vh;z-index:30000;color:#e7f6fc;background:#0c1821f2;border:1px solid #39758e;border-radius:10px;box-shadow:0 12px 32px #0009;font:13px system-ui,sans-serif;overflow:hidden}
  #wmk-research-panel *{box-sizing:border-box}#wmk-research-panel .wmkr-title{cursor:move;user-select:none;background:#183441;padding:10px 12px;display:flex;justify-content:space-between;align-items:center}#wmk-research-panel small{font-size:10px;color:#a3d0dd}
  #wmk-research-panel button{background:#116d88;border:0;border-radius:5px;color:white;padding:8px 11px;cursor:pointer}#wmk-research-panel button:disabled{opacity:.5;cursor:wait}
  #wmk-research-panel .wmkr-title button{background:#31515e;padding:4px 10px}#wmk-research-panel .wmkr-body{padding:12px;overflow-y:auto;max-height:calc(75vh - 42px)}
  #wmk-research-panel textarea{resize:vertical;min-height:66px;width:100%;background:#10242f;color:white;border:1px solid #487a8b;border-radius:6px;padding:8px;margin:8px 0}
  #wmk-research-panel .wmkr-actions{display:flex;gap:8px;justify-content:flex-end}#wmk-research-panel [data-status],#wmk-research-panel .wmkr-credit{font-size:11px;color:#a1bdc9}
  #wmk-research-panel .wmkr-answer{white-space:pre-wrap;line-height:1.5;overflow-wrap:anywhere}#wmk-research-panel .wmkr-sources a{display:block;color:#83e4fc;padding:5px 0;overflow-wrap:anywhere}
  #wmk-research-panel.wmkr-min .wmkr-body{display:none}
  @media(max-width:600px){#wmk-research-panel{right:12px;top:54px;width:calc(100vw - 24px)}}
  `;
  document.head.append(style);
  document.body.append(root);
  const one = (selector) => root.querySelector(selector);
  const status = one('[data-status]');
  const answer = one('[data-answer]');
  const sourcesElement = one('[data-sources]');
  const submit = one('[data-submit]');
  let alive = true;
  one('[data-toggle]').addEventListener('click', () => root.classList.toggle('wmkr-min'));
  const title = one('.wmkr-title');
  let start;
  title.addEventListener('pointerdown', (event) => {
    if (event.target.closest('button')) return;
    start = { x:event.clientX, y:event.clientY, left:root.getBoundingClientRect().left, top:root.getBoundingClientRect().top };
    title.setPointerCapture(event.pointerId);
  });
  title.addEventListener('pointermove', (event) => {
    if (!start) return;
    const maxX = Math.max(0, window.innerWidth - root.offsetWidth);
    const maxY = Math.max(0, window.innerHeight - 38);
    root.style.left = Math.min(maxX, Math.max(0, start.left + event.clientX - start.x)) + 'px';
    root.style.top = Math.min(maxY, Math.max(0, start.top + event.clientY - start.y)) + 'px';
    root.style.right = 'auto';
  });
  for (const type of ['pointerup','pointercancel']) title.addEventListener(type, () => { start = null; });
  one('[data-test]').addEventListener('click', async () => {
    status.textContent = 'Verificando serviços...';
    try {
      const res = await fetch('/wmk-research/status');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      status.textContent = 'Groq: ' + (data.groq ? 'chave configurada' : 'sem chave') + ' • SearXNG: ' + data.searxng;
    } catch (error) { status.textContent = 'Falha: ' + error.message; }
  });
  one('[data-form]').addEventListener('submit', async (event) => {
    event.preventDefault();
    const question = one('textarea').value.trim();
    if (!question) return;
    submit.disabled = true;
    status.textContent = 'Buscando fontes...';
    answer.textContent = '';
    sourcesElement.replaceChildren();
    try {
      const searchResponse = await fetch('/wmk-research/search?q=' + encodeURIComponent(question));
      const search = await searchResponse.json();
      if (!searchResponse.ok) throw new Error(search.error || 'Falha na pesquisa.');
      status.textContent = 'Consultando Groq com ' + search.results.length + ' fontes...';
      const response = await fetch('/wmk-research/ask', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, sources:search.results }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Falha no Groq.');
      if (!alive) return;
      answer.textContent = result.answer || 'O modelo não retornou texto.';
      for (const source of result.sources) {
        try {
          const target = new URL(source.url);
          if (!['https:','http:'].includes(target.protocol)) continue;
          const link = document.createElement('a');
          link.href = target.href;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.textContent = '[' + source.id + '] ' + (source.title || target.hostname);
          sourcesElement.append(link);
        } catch { /* ignore malformed result URL */ }
      }
      status.textContent = 'Pesquisa concluída • modelo: ' + (result.model || 'Groq');
    } catch (error) {
      if (alive) status.textContent = 'Erro: ' + error.message;
    } finally { if (alive) submit.disabled = false; }
  });
  return () => { alive = false; root.remove(); style.remove(); };
}
