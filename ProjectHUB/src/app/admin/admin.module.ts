import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MangeUserComponent } from './mange-user/mange-user.component';
import { MangeCatgoriesComponent } from './mange-catgories/mange-catgories.component';
import { MangeContactComponent } from './mange-contact/mange-contact.component';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';


@NgModule({
  declarations: [
    DashboardComponent,
    SidebarComponent,
    MangeUserComponent,
    MangeCatgoriesComponent,
    MangeContactComponent,
    AdminProfileComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ],
   schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminModule { }
