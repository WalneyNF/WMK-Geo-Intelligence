// Exemplo para Android Studio, requer permissão INTERNET e endpoint HTTPS.
package com.example.wmkgps
import android.os.Bundle
import android.widget.TextView
import androidx.activity.ComponentActivity
import java.net.URL
import java.net.HttpURLConnection
import org.json.JSONObject
import kotlin.concurrent.thread
class MainActivity:ComponentActivity(){
 override fun onCreate(savedInstanceState:Bundle?){super.onCreate(savedInstanceState)
 val view=TextView(this).apply{text="Consultando WMK GPS..."};setContentView(view)
 thread{try{val conn=URL("https://SEU-SERVIDOR/api/v1/vehicles?source=simulator").openConnection() as HttpURLConnection
 conn.connectTimeout=8000;conn.readTimeout=8000;val status=conn.responseCode
 val count=if(status==200)JSONObject(conn.inputStream.bufferedReader().use{it.readText()}).getJSONArray("items").length() else -1
 conn.disconnect();runOnUiThread{view.text=if(count>=0)"Veículos: $count" else "HTTP $status"}
 }catch(e:Exception){runOnUiThread{view.text="Falha: "+e.message}}}
 }
}