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
        this.db.collection(`users/${this.afAuth.auth.currentUser.uid}/crit`).snapshotChanges().subscribe(data => {
          this.items = [];
          data.forEach((item: any) => {
            this.items.push(item.payload.doc.data());
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
}
