import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { IndexComponent } from './index/index.component';
import { LoginComponent } from './login/login.component';
import { MyestatesComponent } from './myestates/myestates.component';
import { MypagesComponent } from './mypages/mypages.component';
import { AdminGuard, UserGuard } from './logged-in.guard';
import { RegisterComponent } from './register/register.component';
import { WorkerloginComponent } from './workerlogin/workerlogin.component';
import { EstateComponent } from './estate/estate.component';
import { RegisterWorkerComponent } from './register-worker/register-worker.component';

const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'confirmation/:type', component: ConfirmationComponent},
  { path: 'workerlogin', component: WorkerloginComponent},
  { path: 'myestates', canActivate: [AdminGuard], component: MyestatesComponent},
  { path: 'mypages', canActivate: [AdminGuard], component: MypagesComponent},
  { path: 'estate/:estateuuid', canActivate: [UserGuard], component: EstateComponent},
  { path: 'registerworker', component: RegisterWorkerComponent},
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
