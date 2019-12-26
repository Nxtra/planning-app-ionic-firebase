import {Component, Input, OnInit} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import {AngularFirestore} from "@angular/fire/firestore";
import {AlertController} from "@ionic/angular";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

  @Input('title')
  title: string;
  @Input('list')
  list: string;
  @Input()
  allowComplete: boolean;
  @Input()
  allowLater: boolean;
  @Input()
  allowCrit: boolean;

  loading = true;
  items = [];

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private alertController: AlertController) {
  }

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.db.collection(`users/${this.afAuth.auth.currentUser.uid}/${this.list}`, ref => ref.orderBy('pos', 'desc'))
          .snapshotChanges().subscribe(data => {
          this.items = [];
          data.forEach((item: any) => {
            let data = item.payload.doc.data();
            // console.log(`Data: ${JSON.stringify(data)}`)
            data.id = item.payload.doc.id;
            this.items.push(data);
          });
          this.loading = false;
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

            this.db.collection(`users/${this.afAuth.auth.currentUser.uid}/${this.list}`).add({
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
    this.db.doc(`users/${this.afAuth.auth.currentUser.uid}/${this.list}/${item.id}`).delete();
  }

  complete(item) {
    console.log('moving to complete')
    this.moveItem(item, 'complete');
  }

  later(item) {
    console.log('moving to later')
    this.moveItem(item, 'later');
  }

  crit(item) {
    console.log('moving to critical')
    this.moveItem(item, 'crit')
  }


  moveItem(item, list){
    this.db.doc(`users/${this.afAuth.auth.currentUser.uid}/${this.list}/${item.id}`).delete();
    let id: number = item.id;
    delete item.id;
    this.db.collection(`users/${this.afAuth.auth.currentUser.uid}/${list}`, ref => ref.orderBy('pos', 'desc').limit(1))
      .get().toPromise().then(qResponse => {
      item.pos = 0;
      qResponse.forEach(i => {
        item.pos = i.data().pos + 1;
      })
      this.db.doc(`users/${this.afAuth.auth.currentUser.uid}/${list}/${id}`).set(item);
    })
  }


  log(item) {
    console.log(item);
  }
}
