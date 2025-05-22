import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';
const routes: Routes = [
  {
    path: 'dashboard',
    component: SidebarComponent, // your layout
    children: [
      { path: '', component: DashboardComponent },
      // { path: 'users', component:  },
      // add more pages here
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
