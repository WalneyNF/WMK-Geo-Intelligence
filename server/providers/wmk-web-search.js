// Busca web sem Docker: SearXNG opcional, Bing RSS com fallback Google Notícias.
const decode = (s='') => String(s)
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1')
  .replace(/<[^>]*>/g,' ')
  .replace(/&#(x[0-9a-f]+|\d+);/gi,(_,n)=>{const cp=n[0].toLowerCase()==='x'?parseInt(n.slice(1),16):Number(n);return cp>0&&cp<=0x10ffff?String.fromCodePoint(cp):'';})
  .replace(/&(amp|lt|gt|quot|apos|nbsp);/g,(_,k)=>({amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:' '}[k]))
  .replace(/\s+/g,' ').trim();
const field = (xml, name) => decode((xml.match(new RegExp('<'+name+'(?:\\s[^>]*)?>([\\s\\S]*?)<\\/'+name+'>','i'))||[])[1]||'');
export function parseSearchRss(xml, engine) {
  if (!/<rss\b|<feed\b/i.test(xml)) throw new Error('A fonte não retornou RSS válido.');
  const items = [...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)].slice(0,12);
  return items.map(([,content])=>({
    title:field(content,'title').slice(0,250),
    url:field(content,'link').slice(0,900),
    content:field(content,'description').slice(0,900),
    engine,
  })).filter(item=>{try{const u=new URL(item.url);return ['http:','https:'].includes(u.protocol)&&!!item.title;}catch{return false;}});
}
async function rssSearch(url, engine, fetchImpl, timeout) {
  const response=await fetchImpl(url,{signal:AbortSignal.timeout(timeout),headers:{'Accept':'application/rss+xml, application/xml;q=0.9, text/xml;q=0.8','User-Agent':'Mozilla/5.0 WMKResearch/0.3'}});
  if(!response.ok) throw new Error(engine+' HTTP '+response.status);
  const xml=await response.text();
  if(xml.length>1500000) throw new Error('Resposta RSS excessivamente grande.');
  const results=parseSearchRss(xml,engine);
  if(!results.length) throw new Error(engine+' sem resultados RSS.');
  return results;
}
export async function searchWeb(query,{searxngUrl,fetchImpl=fetch,timeout=9000}={}) {
  const q=String(query||'').trim().slice(0,500);
  if(!q) throw new Error('Pesquisa vazia.');
  const errors=[];
  if(searxngUrl) {
    try {
      const url=new URL(searxngUrl);
      if(url.protocol!=='http:'||!['127.0.0.1','localhost','[::1]'].includes(url.hostname)) throw new Error('SearXNG deve ser local.');
      url.pathname='/search';
      url.search=new URLSearchParams({q,format:'json',language:'pt-BR'}).toString();
      const res=await fetchImpl(url,{signal:AbortSignal.timeout(timeout)});
      if(!res.ok) throw new Error('HTTP '+res.status);
      const data=await res.json();
      if(!Array.isArray(data.results)) throw new Error('JSON sem results');
      const results=data.results.slice(0,10).map(r=>({
        title:String(r.title||'').slice(0,250),url:String(r.url||'').slice(0,900),
        content:String(r.content||'').slice(0,900),engine:String(r.engine||'SearXNG'),
      })).filter(r=>{try{return ['http:','https:'].includes(new URL(r.url).protocol);}catch{return false;}});
      if(results.length)return {results,provider:'SearXNG',warnings:errors};
      errors.push('SearXNG não encontrou resultados');
    } catch(e) {errors.push('SearXNG: '+e.message);}
  }
  const providers=[
    ['Bing RSS','https://www.bing.com/search?format=rss&'+new URLSearchParams({q})],
    ['Google Notícias RSS','https://news.google.com/rss/search?'+new URLSearchParams({q,hl:'pt-BR',gl:'BR',ceid:'BR:pt-419'})],
  ];
  for(const [name,url] of providers) {
    try {
      const results=await rssSearch(url,name,fetchImpl,timeout);
      return {results:results.slice(0,10),provider:name,warnings:errors};
    } catch(e) {errors.push(name+': '+e.message);}
  }
  throw new Error('Nenhum mecanismo respondeu. '+errors.join(' | ').slice(0,400));
}
