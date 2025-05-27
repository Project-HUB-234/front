import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import {HttpClientModule} from '@angular/common/http'
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { TimeagoModule } from 'ngx-timeago';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    NavbarComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule, 
     MatCardModule,
    MatIconModule,
    MatTabsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatSelectModule,
    FormsModule,
    MatCheckboxModule,
    TimeagoModule.forRoot(),
    MatMenuModule,
       ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    MatDialogModule,
    MatAutocompleteModule,
    RouterModule,
    NgbModule,
  ],
  exports: [
    MatCardModule,
    MatIconModule,
    MatTabsModule,
    MatButtonModule,
    NavbarComponent,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatSelectModule,
    FormsModule,
    MatMenuModule,
    TimeagoModule,
    MatDialogModule,
    MatAutocompleteModule,
    RouterModule,
    NgbModule,
  ]
})
export class SharedModule { }
