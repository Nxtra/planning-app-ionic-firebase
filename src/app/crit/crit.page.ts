import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {AlertController} from '@ionic/angular';

@Component({
  selector: 'app-crit',
  templateUrl: './crit.page.html',
  styleUrls: ['./crit.page.scss'],
})
export class CritPage implements OnInit {

  items = [{
    text: 'test',
    created: new Date(),
    pos: 0
  }];

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private alertController: AlertController) {
  }

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.db.collection(`users/${this.afAuth.auth.currentUser.uid}/crit`, ref => ref.orderBy('pos', 'desc'))
          .snapshotChanges().subscribe(data => {
            this.items = [];
            data.forEach((item: any) => {
              let data = item.payload.doc.data();
              data.id = item.payload.doc.id;
              this.items.push(data);
            });
          });
      } else {
        return;
      }
    });

  }

  async add() {
    const alert = await this.alertController.create({
      header: 'New Task',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: (val) => {
            const now = new Date();
            const nowUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(),
              now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()));

            this.db.collection(`users/${this.afAuth.auth.currentUser.uid}/crit`).add({
              text: val.task,
              pos: this.items.length ? this.items[0].pos + 1 : 0,
              created: nowUtc,
            });
          }
        },
      ],
      inputs: [
        {
          name: 'task',
          type: 'text',
          placeholder: 'New Task',
        }
      ]
    });
    return await alert.present();
  }

  delete(item) {
    this.db.doc(`users/${this.afAuth.auth.currentUser.uid}/crit/${item.id}`).delete();
  }

  complete(item) {
    this.db.doc(`users/${this.afAuth.auth.currentUser.uid}/crit/${item.id}`).delete();
    let id: number = item.id;
    delete item.id;
    this.db.collection(`users/${this.afAuth.auth.currentUser.uid}/done`, ref => ref.orderBy('pos', 'desc').limit(1))
      .get().toPromise().then(qResponse => {
        item.pos = 0;
        qResponse.forEach(i => {
          item.pos = i.data().pos + 1;
        })
        this.db.doc(`users/${this.afAuth.auth.currentUser.uid}/done/${id}`).set(item);
    })
  }

  later(item) {
    // this.moveItem(item, 'later');
  }


  log(item: { pos: number; created: Date; text: string }) {
    console.log(item);
  }
}
