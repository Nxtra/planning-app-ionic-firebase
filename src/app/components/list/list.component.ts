import {Component, Input, OnInit} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import {AngularFirestore} from "@angular/fire/firestore";
import {AlertController} from "@ionic/angular";

const MAX_LIST_SIZE = 100;

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
        this.db.collection(`users/${this.afAuth.auth.currentUser.uid}/${this.list}`, ref => {
          let query = ref.orderBy('pos', 'desc').limit(MAX_LIST_SIZE);
          return query;
        })
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

  async add(){
    this.addOrEdit('Add Item', val => { this.handleAddItemOk(val.task)})
  }

  async edit(item){
    this.addOrEdit('Edit Item', val => {this.handleEditItemOk(val.task, item)}, item)
  }

  async addOrEdit(header: string, okHandler, item?) {
    const alert = await this.alertController.create({
      header: header,
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
          handler: okHandler
        },
      ],
      inputs: [
        {
          name: 'task',
          type: 'text',
          value: item? item.text: '',
          placeholder: 'Task to do',
        }
      ]
    });

    await alert.present().then(()=>{
      let input: any = document.querySelector('ion-alert input');
      input.focus();
      return;
    });

    alert.addEventListener('keydown', val => {
      if(val.keyCode === 13){
        this.handleAddItemOk(val.srcElement['value'])
        alert.dismiss();
      }
    })
  }

  handleAddItemOk(text: string) {
    if (!text.trim().length){
      return;
    }

    let now = new Date();
    let nowUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(),
      now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()));

    this.db.collection(`users/${this.afAuth.auth.currentUser.uid}/${this.list}`).add({
      text,
      pos: this.items.length ? this.items[0].pos + 1 : 0,
      created: nowUtc,
    });

    if (this.items.length >= MAX_LIST_SIZE)
      this.alertController.create({
        header: 'Critical Oveload',
        subHeader: 'Too many important items!',
        message: `You have over ${MAX_LIST_SIZE} items in this list, only showing the top ${MAX_LIST_SIZE}.`,
        buttons: ['Okay'],
      }).then(warning => {
        warning.present();
      });
  }

  handleEditItemOk(text: string, item){
    this.db.doc(`users/${this.afAuth.auth.currentUser.uid}/${this.list}/${item.id}`).set({text: text}, {merge: true});
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


  moveItem(item, list) {
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
