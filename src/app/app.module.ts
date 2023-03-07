import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { StoreModule } from '@ngrx/store';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthInterceptor } from './auth.interceptor';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import { IndexComponent } from './index/index.component';
import { LoginComponent } from './login/login.component';
import {MatInputModule} from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatListModule} from '@angular/material/list';
import { RegisterComponent } from './register/register.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { WorkerloginComponent } from './workerlogin/workerlogin.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import { DialogOkComponent } from './dialogs/dialog-ok/dialog-ok.component';
import {MatProgressSpinnerModule, MatSpinner} from '@angular/material/progress-spinner';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import {MatMenuModule} from '@angular/material/menu';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { reducers, metaReducers } from './store/reducers';
import { MypagesComponent } from './mypages/mypages.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { MyestatesComponent } from './myestates/myestates.component';
import {MatNativeDateModule} from '@angular/material/core';
import { DialogTaskComponent } from './dialogs/dialog-task/dialog-task.component';
import {MatSelectModule} from '@angular/material/select';
import {MatSliderModule} from '@angular/material/slider';
import { DialogEstateComponent } from './dialogs/dialog-estate/dialog-estate.component';
import { DialogUpdateEstateComponent } from './dialogs/dialog-update-estate/dialog-update-estate.component';
import { EstateComponent } from './estate/estate.component';
import { DialogConfirmComponent } from './dialogs/dialog-confirm/dialog-confirm.component';
import { RegisterWorkerComponent } from './register-worker/register-worker.component';


export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    LoginComponent,
    RegisterComponent,
    WorkerloginComponent,
    DialogOkComponent,
    ConfirmationComponent,
    MypagesComponent,
    LoadingSpinnerComponent,
    MyestatesComponent,
    DialogTaskComponent,
    DialogEstateComponent,
    DialogUpdateEstateComponent,
    EstateComponent,
    DialogConfirmComponent,
    RegisterWorkerComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatNativeDateModule,
    MatIconModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatInputModule,
    MatMenuModule,
    MatSliderModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    MatListModule,
    MatDialogModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: 'en'
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000'
    }),
    StoreModule.forRoot(reducers, {metaReducers})
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
