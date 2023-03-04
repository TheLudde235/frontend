import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminconfirmationComponent } from './adminconfirmation/adminconfirmation.component';
import { IndexComponent } from './index/index.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { WorkerloginComponent } from './workerlogin/workerlogin.component';

const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'adminconfirmation', component: AdminconfirmationComponent},
  { path: 'workerlogin', component: WorkerloginComponent},
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
