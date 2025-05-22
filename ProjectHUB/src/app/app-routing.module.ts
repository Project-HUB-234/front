import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { ProfileComponent } from './profile/profile.component';

 const routes:Routes=[
  {
    path:'home',
    component: HomeComponent
  },
  { 
    path: '',
    redirectTo: 'home',
    pathMatch: 'full' 
  },
    {
    path:'profile',
    component: ProfileComponent
  },
  {
    path:'security',
    loadChildren:()=> AuthModule
  },
  {
    path:'admin', 
    loadChildren:()=>AdminModule
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
