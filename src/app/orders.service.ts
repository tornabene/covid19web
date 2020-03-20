import { Injectable } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AngularFirestore } from "@angular/fire/firestore";

@Injectable({
  providedIn: "root"
})
export class OrdersService {
  constructor(private firestore: AngularFirestore) {}
  
  
  
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