import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AngularFireModule} from '@angular/fire';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireAuthModule} from '@angular/fire/auth';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {environment} from '../environments/environment';
import {LoginPageModule} from './login/login.module';
import {TabsPageModule} from './tabs/tabs.module';
import {ComponentsModule} from "./components/components.module";


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    LoginPageModule,
    TabsPageModule,
    ComponentsModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
