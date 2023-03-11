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
import { InvitesComponent } from './invites/invites.component';
import { CommentsComponent } from './comments/comments.component';

const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'confirmation/:type', component: ConfirmationComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'registerworker', component: RegisterWorkerComponent },
  { path: 'login', component: LoginComponent },
  { path: 'workerlogin', component: WorkerloginComponent },
  { path: 'myinvites', component: InvitesComponent },
  { path: 'myestates', canActivate: [UserGuard], component: MyestatesComponent },
  { path: 'estate/:estateuuid', canActivate: [UserGuard], component: EstateComponent },
  { path: 'comments/:taskuuid', canActivate: [UserGuard], component: CommentsComponent },
  { path: 'mypages', canActivate: [AdminGuard], component: MypagesComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
