import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Money } from 'src/app/money.model';


@Injectable({
  providedIn: 'root'
})
export class MoneyService {

  constructor(private firestore: AngularFirestore) { }

  getMoney(){
    return this.firestore.collection('saving').snapshotChanges();
  }

  createMoney(money: Money){
    return this.firestore.collection('saving').add(money);
  }

  updateMoney(money: Money){
    delete money.id;
    this.firestore.doc('saving/' + money.id).update(money);
  }

  deleteMoney(moneyId: string){
    this.firestore.doc('saving/' + moneyId).delete();
  }


}
