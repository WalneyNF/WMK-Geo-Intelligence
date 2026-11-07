// WMK GPS TypeScript: Node.js 18+; dados fictícios
declare const process: {env:Record<string,string|undefined>;exitCode:number};
const key=process.env.WMK_BRIDGE_WRITE_KEY;
if(!key)throw Error("Configure WMK_BRIDGE_WRITE_KEY");
const base=process.env.WMK_GPS_URL??"http://127.0.0.1:8770";
type Posicao={id:string;latitude:number;longitude:number;simulated:true};
const posicao:Posicao={id:"WMK-TS-001",latitude:-22.281,longitude:-42.532,simulated:true};
const r=await fetch(new URL("/api/v1/external/positions",base),{method:"POST",headers:{"Content-Type":"application/json","X-WMK-API-Key":key},body:JSON.stringify(posicao)});
console.log("HTTP",r.status,await r.text());if(r.status!==202)process.exitCode=1;