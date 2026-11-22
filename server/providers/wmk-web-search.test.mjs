import test from 'node:test';
import assert from 'node:assert/strict';
import { parseSearchRss, searchWeb } from './wmk-web-search.js';

test('interpreta RSS e preserva links de fontes', () => {
  const xml = '<rss><channel><item><title>Paris &amp; França</title><link>https://example.org/paris</link><description><![CDATA[<p>História de Paris</p>]]></description></item></channel></rss>';
  const results = parseSearchRss(xml, 'fonte-teste');
  assert.equal(results.length,1);
  assert.equal(results[0].title,'Paris & França');
  assert.equal(results[0].content,'História de Paris');
  assert.equal(results[0].url,'https://example.org/paris');
});
test('SearXNG responde prioritariamente com formato JSON', async () => {
  let requested='';
  const fetchImpl=async url=>{requested=String(url);return {ok:true,json:async()=>({results:[{title:'Paris',url:'https://example.org',content:'França'}]})};};
  const result=await searchWeb('Paris',{searxngUrl:'http://127.0.0.1:8888',fetchImpl});
  assert.equal(result.provider,'SearXNG');
  assert.match(requested,/format=json/);
  assert.equal(result.results.length,1);
});
test('retorna RSS quando SearXNG estiver indisponível',async()=>{
  const xml='<rss><channel><item><title>Torre Eiffel</title><link>https://example.org/eiffel</link><description>Paris</description></item></channel></rss>';
  const result=await searchWeb('Torre Eiffel',{searxngUrl:'http://127.0.0.1:8888',fetchImpl:async url=>{
    if(String(url).includes('127.0.0.1'))throw new Error('ECONNREFUSED');
    return {ok:true,text:async()=>xml};
  }});
  assert.equal(result.provider,'Bing RSS');
  assert.ok(result.warnings.some(w=>w.includes('SearXNG')));
});
test('rejeita links não web',()=>{
  const xml='<rss><channel><item><title>Inseguro</title><link>javascript:alert(1)</link></item></channel></rss>';
  assert.equal(parseSearchRss(xml,'teste').length,0);
});
