import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LaterPageRoutingModule } from './later-routing.module';

import { LaterPage } from './later.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LaterPageRoutingModule
  ],
  declarations: [LaterPage]
})
export class LaterPageModule {}
