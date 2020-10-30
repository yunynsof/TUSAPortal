import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequirerechargeComponent } from './components/requirerecharge/requirerecharge.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { GenerateotpComponent } from './components/generateotp/generateotp.component';
import { ValidateotpComponent } from './components/validateotp/validateotp.component';
import { MatSelectFilterModule } from 'mat-select-filter';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

@NgModule({
  declarations: [
    RequirerechargeComponent,
    GenerateotpComponent,
    ValidateotpComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectFilterModule,
    MatAutocompleteModule
  ]
})
export class SharedModule { }
