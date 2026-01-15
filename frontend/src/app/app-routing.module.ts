import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { LoginComponent } from '@components/login/login.component';
import { RegisterComponent } from '@components/register/register.component';
import { HomeComponent } from '@components/home/home.component';
import { BooksComponent } from '@components/books/books.component';
import { ProfileComponent } from '@components/profile/profile.component';
import { MyLoansComponent } from '@components/my-loans/my-loans.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'books', component: BooksComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'my-loans', component: MyLoansComponent },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
