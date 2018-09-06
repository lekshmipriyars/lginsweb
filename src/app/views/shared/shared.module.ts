import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CapitalizePipe } from './pipes/capitalize.pipe';
import { TrimPipe } from './pipes/trim.pipe';


@NgModule({
  imports: [CommonModule ],
  exports: [ CommonModule, FormsModule, CapitalizePipe, TrimPipe ],
  declarations: [ CapitalizePipe, TrimPipe ]
})
export class SharedModule { }
