import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/material.module';
import { HomeComponent } from './home/home.component';
import { LayoutsComponent } from './layouts/layouts.component';
import { HeaderComponent } from './layouts/header/header.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
//import { HomeComponent } from './home/home/home.component';
//importamos pipe para fecha
import { DatePipe } from '@angular/common';
//interceptores
import { TokenInterceptor } from './interceptores/token.interceptor'; // Asegúrate de ajustar la ruta


//para los diagramas
import { HighchartsChartModule } from "highcharts-angular";


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LayoutsComponent,
    HeaderComponent,
    SidebarComponent,
    LoginComponent,
    DashboardComponent
  ],
  imports: [
   
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    SharedModule,
    HttpClientModule
  ],
  providers: [
    DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
