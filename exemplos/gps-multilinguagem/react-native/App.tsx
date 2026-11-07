// Exemplo Expo React Native. Não inserir chaves secretas no app.
import React,{useState} from "react";
import{View,Text,Button,FlatList}from"react-native";
const API="https://SEU-SERVIDOR/api/v1/vehicles?source=simulator";
type Veiculo={id:string;name?:string;position?:{latitude:number;longitude:number}|null};
export default function App(){const[items,setItems]=useState<Veiculo[]>([]);const[erro,setErro]=useState("");
async function atualizar(){try{const r=await fetch(API);if(!r.ok)throw Error("HTTP "+r.status);const d=await r.json();if(!Array.isArray(d.items))throw Error("JSON inválido");setItems(d.items);setErro("")}catch(e){setErro(String(e))}}
return <View style={{padding:32,flex:1}}><Text>WMK GPS Mobile</Text><Button title="Consultar veículos" onPress={atualizar}/><Text>{erro}</Text><FlatList data={items} keyExtractor={x=>x.id} renderItem={({item})=><Text>{item.name??item.id}: {item.position?.latitude??"sem posição"}, {item.position?.longitude??"sem posição"}</Text>}/></View>}