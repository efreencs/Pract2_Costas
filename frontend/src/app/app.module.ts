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
import { LibraryService } from '@services/LibraryService';
import { LoanService } from '@services/LoanService';
import { UserService } from '@services/UserService';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    BooksComponent,
    ProfileComponent,
    MyLoansComponent
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
    LibraryService,
    LoanService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
