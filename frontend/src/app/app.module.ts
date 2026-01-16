import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from '@components/login/login.component';
import { RegisterComponent } from '@components/register/register.component';
import { HomeComponent } from '@components/home/home.component';
import { BooksComponent } from '@components/books/books.component';
import { ProfileComponent } from '@components/profile/profile.component';
import { MyLoansComponent } from '@components/my-loans/my-loans.component';

import { AuthService } from '@services/AuthService';
import { BookService } from '@services/BookService';
import { LoanService } from '@services/LoanService';
import { UserService } from '@services/UserService';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AdminBooksComponent } from './components/admin/admin-books/admin-books.component';
import { AdminUsersComponent } from './components/admin/admin-users/admin-users.component';
import { AdminLoansComponent } from './components/admin/admin-loans/admin-loans.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    BooksComponent,
    ProfileComponent,
    MyLoansComponent,
    AdminBooksComponent,
    AdminUsersComponent,
    AdminLoansComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    AuthService,
    BookService,
    LoanService,
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
