import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';
import { MangeUserComponent } from './mange-user/mange-user.component';
import { MangeCatgoriesComponent } from './mange-catgories/mange-catgories.component';
import { MangeContactComponent } from './mange-contact/mange-contact.component';

const routes: Routes = [
  {
    path: '',
    component: SidebarComponent, 
    children: [
      { path: 'dashboard', component: DashboardComponent },
       { path: 'users', component: MangeUserComponent },
       { path: 'categories', component: MangeCatgoriesComponent },
       { path: 'contact', component: MangeContactComponent },
       { path: 'profile', component: AdminProfileComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
