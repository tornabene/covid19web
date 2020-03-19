import { Injectable } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AngularFirestore } from "@angular/fire/firestore";

@Injectable({
  providedIn: "root"
})
export class OrdersService {
  constructor(private firestore: AngularFirestore) {}
  
  public form = new FormGroup({
    nome: new FormControl("",Validators.required),
    citta: new FormControl(""),
    via: new FormControl("" ),
    
    fattoTampone: new FormControl(false) ,
    tamponePositivo: new FormControl(false) ,
    famigliareInfetto: new FormControl(false) ,
    isolamentoDomiciliare: new FormControl(false) ,
    riceverato: new FormControl(false) ,
    guarito: new FormControl(false)  
    
  });
  
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
  
  getCoffeeOrders() {
    return this.firestore.collection("tamponi").snapshotChanges();
  }
  
  deleteCoffeeOrder(data) {
    return this.firestore
    .collection("tamponi")
    .doc(data.payload.doc.id)
    .delete();
  }
}