# WMK GPS: PowerShell 5.1+; somente teste local
$base=if($env:WMK_GPS_URL){$env:WMK_GPS_URL.TrimEnd('/')}else{'http://127.0.0.1:8770'}
if(!$env:WMK_BRIDGE_WRITE_KEY){throw 'Configure WMK_BRIDGE_WRITE_KEY.'}
$dados=@{id='WMK-POWERSHELL-001';latitude=-22.2808;longitude=-42.5323;simulated=$true}|ConvertTo-Json -Compress
try{
 $r=Invoke-WebRequest -Uri "$base/api/v1/external/positions" -Method Post -UseBasicParsing -TimeoutSec 8 -ContentType 'application/json' -Headers @{'X-WMK-API-Key'=$env:WMK_BRIDGE_WRITE_KEY} -Body $dados
 "HTTP $($r.StatusCode) $($r.Content)"
 if($r.StatusCode -ne 202){exit 1}
}catch{Write-Error $_;exit 1}
