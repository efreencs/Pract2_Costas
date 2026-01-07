import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AuthService } from './services/AuthService';
import { BookService } from './services/BookService';
import { LibraryService } from './services/LibraryService';
import { LoanService } from './services/LoanService';
import { UserService } from './services/UserService';

@NgModule({
  declarations: [
    AppComponent
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
