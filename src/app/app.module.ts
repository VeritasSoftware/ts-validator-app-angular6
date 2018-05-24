import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component'
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DetailsComponent } from './components/details/details.component';

import { appRoutes } from './routerConfig';

import { ValidationService } from './services/validation-service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    DetailsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    NgbModule.forRoot(),    
  ],
  providers: [ValidationService],
  bootstrap: [AppComponent, HomeComponent, LoginComponent, RegisterComponent, DetailsComponent]
})
export class AppModule { }
