import { Routes } from '@angular/router';

import { AppComponent } from './app.component'
import { HomeComponent } from './components/home/home.component'
import { LoginComponent } from './components/login/login.component'
import { RegisterComponent } from './components/register/register.component';
import { DetailsComponent } from './components/details/details.component';


export const appRoutes: Routes = [
    { 
      path: '',
      redirectTo: '/home',
      pathMatch: 'full'
    },  
    { 
      path: 'home', 
      component: HomeComponent 
    },
    { 
      path: 'login', 
      component: LoginComponent 
    },
    { 
      path: 'register', 
      component: RegisterComponent 
    },
    { 
      path: 'details', 
      component: DetailsComponent
    }
  ];
