import { Injectable } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AngularFirestore } from "@angular/fire/firestore";
import { KeyLabel } from './map';

@Injectable({
  providedIn: "root"
})
export class OrdersService {
  constructor(private firestore: AngularFirestore) {}
  
  
  public dizionarioSintomi :KeyLabel[]= [
    {key: "febbre" ,label:"Febbre" },
    {key: "tosseSecca" ,label:"Tosse secca" },
    {key: "difficoltaRespirazione" ,label:"Difficolta respirazione" },
    {key: "caloVoce" ,label:"Calo della voce" },
    {key: "vomito" ,label:"Vomito" },
    {key: "diarrea" ,label:"Diarrea" },
  ];
  
  
  public dizionarioInformazioni :KeyLabel[]= [
    {key: "fattoTampone" ,label:"Fatto Tampone" },
    {key: "tamponePositivo" ,label:"Tampone Positivo" },
    {key: "famigliareInfetto" ,label:"Famigliare infetto" },
    {key: "isolamentoDomiciliare" ,label:"Isolamento Domiciliare" },
    {key: "riceverato" ,label:"Riceverato" },
    {key: "guarito" ,label:"Guarito" },
  ];
  
  //Firestore CRUD actions example
  createCoffeeOrder(data) {
    return new Promise<any>((resolve, reject) => {
      this.firestore
      .collection("tamponi")
      .add(data)
      .then(res => {}, err => reject(err));
    });
  }
  
  updateCoffeeOrder(data) {
    return this.firestore
    .collection("tamponi")
    .doc(data.payload.doc.id)
    .set({ completed: true }, { merge: true });
  }
  
  snapshotChanges() {
    return this.firestore.collection("tamponi").snapshotChanges();
  }

  valueChanges() {
    return this.firestore.collection("tamponi").valueChanges();
  }

  
  deleteCoffeeOrder(data) {
    return this.firestore
    .collection("tamponi")
    .doc(data.payload.doc.id)
    .delete();
  }
}