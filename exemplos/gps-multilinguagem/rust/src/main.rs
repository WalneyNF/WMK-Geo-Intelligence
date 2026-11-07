// WMK GPS Rust: requer cargo e dependências externas.
fn main()->Result<(),Box<dyn std::error::Error>>{
let key=std::env::var("WMK_BRIDGE_WRITE_KEY")?;
let base=std::env::var("WMK_GPS_URL").unwrap_or("http://127.0.0.1:8770".into());
let url=format!("{}/api/v1/external/positions",base.trim_end_matches('/'));
let payload=serde_json::json!({"id":"WMK-RUST-001","latitude":-22.281,"longitude":-42.532,"simulated":true});
let resp=ureq::post(&url).set("X-WMK-API-Key",&key).send_json(payload)?;
println!("HTTP {}",resp.status());if resp.status()!=202{std::process::exit(1);}Ok(())}