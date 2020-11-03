import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UserMainComponent} from './user-main/user-main.component';
import {CustomerComponent} from './customer/customer.component';


const routes: Routes = [
  { path: 'viewer', component:  CustomerComponent},
  { path: '', component: UserMainComponent }
  // { path: '', redirectTo: 'home', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
