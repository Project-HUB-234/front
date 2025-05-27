import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { ProfileComponent } from './profile/profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { OtherProfileComponent } from './other-profile/other-profile.component';
 const routes:Routes=[
  {
    path:'home',
    component: HomeComponent
  },
  { 
    path: '',
    redirectTo: 'security/login',
    pathMatch: 'full' 
  },
    {
    path:'profile',
    component: ProfileComponent
  },
     {
    path:'updateprofile',
    component: EditProfileComponent
  },
  {
    path:'otherProfile/:id',
    component: OtherProfileComponent
  },
  {
    path:'contact',
    component: ContactComponent
  },{
    path:'about',
    component: AboutComponent
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
