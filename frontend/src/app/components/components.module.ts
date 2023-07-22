import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationComponent } from './dialog/confirmation/confirmation.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../shared/material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CdkTableModule } from '@angular/cdk/table';

import { CompontsRoutes } from './components.routing';
import { ManageProyectoComponent } from './manage-proyecto/manage-proyecto.component';
import { ManageCategoriaComponent } from './manage-categoria/manage-categoria.component';
import { CategoriaComponent } from './dialog/categoria/categoria.component';

//import { MaterialModule } from '../shared/material-module';

//import { ComponentsRoutingModule } from './components-routing.module';


@NgModule({
  declarations: [
    ConfirmationComponent,
    ManageProyectoComponent,
    ManageCategoriaComponent,
    CategoriaComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(CompontsRoutes),
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CdkTableModule
  ]
})
export class ComponentsModule { }
