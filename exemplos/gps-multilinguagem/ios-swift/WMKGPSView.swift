// SwiftUI: adicione a um projeto Xcode. HTTPS e autorização obrigatórios.
import SwiftUI
struct WMKGPSView:View{
 @State private var mensagem="Aguardando"
 var body:some View{VStack{Text("WMK GPS iOS").font(.title);Button("Consultar"){Task{await consultar()}};Text(mensagem)}.padding()}
 func consultar()async{
 guard let url=URL(string:"https://SEU-SERVIDOR/api/v1/vehicles?source=simulator")else{return}
 do{let(data,response)=try await URLSession.shared.data(from:url)
 guard let http=response as? HTTPURLResponse,http.statusCode==200 else{mensagem="HTTP inválido";return}
 let json=try JSONSerialization.jsonObject(with:data)as? [String:Any]
 mensagem="Veículos: \((json?["items"] as? [[String:Any]])?.count ?? 0)"
 }catch{mensagem="Falha: \(error.localizedDescription)"}
 }
}