<?php
// WMK GPS: PHP 8+, cURL, sem bibliotecas externas.
$base = rtrim(getenv('WMK_GPS_URL') ?: 'http://127.0.0.1:8770','/');
$key = getenv('WMK_BRIDGE_WRITE_KEY');
if (!$key) { fwrite(STDERR, "Configure WMK_BRIDGE_WRITE_KEY.\n"); exit(2); }
$data = json_encode(['id'=>'WMK-PHP-001','latitude'=>-22.2807,'longitude'=>-42.5322,'simulated'=>true],JSON_THROW_ON_ERROR);
$ch=curl_init($base.'/api/v1/external/positions');
curl_setopt_array($ch,[CURLOPT_POST=>true,CURLOPT_POSTFIELDS=>$data,
 CURLOPT_HTTPHEADER=>['Content-Type: application/json','X-WMK-API-Key: '.$key],
 CURLOPT_RETURNTRANSFER=>true,CURLOPT_TIMEOUT=>8]);
$body=curl_exec($ch);$status=curl_getinfo($ch,CURLINFO_HTTP_CODE);
if($body===false){fwrite(STDERR,curl_error($ch)."\n");curl_close($ch);exit(1);}
curl_close($ch);
echo "HTTP $status $body\n";exit($status===202?0:1);
