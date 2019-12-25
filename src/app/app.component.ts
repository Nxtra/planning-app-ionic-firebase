import {Component} from '@angular/core';

import {ModalController, Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {

    loginModal: HTMLIonModalElement;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private afAuth: AngularFireAuth,
        private modalController: ModalController,
        private router: Router,
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();

            this.afAuth.authState.subscribe(user => {
                if (!user) {
                    this.router.navigateByUrl('/login');
                } else {
                    if (user.emailVerified) {
                        console.log('Email verified');
                    } else if (!user.emailVerified) {
                        console.log('Email not verified');
                    }
                    this.router.navigateByUrl(('/tabs'));
                }
            });
        });
    }
}
