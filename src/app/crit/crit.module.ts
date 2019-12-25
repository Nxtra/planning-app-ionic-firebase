import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CritPageRoutingModule } from './crit-routing.module';

import { CritPage } from './crit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CritPageRoutingModule
  ],
  declarations: [CritPage]
})
export class CritPageModule {}
