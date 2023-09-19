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
import { ManageMunicipioComponent } from './manage-municipio/manage-municipio.component';
import { ProyectoComponent } from './dialog/proyecto/proyecto.component';
import { MunicipioComponent } from './dialog/municipio/municipio.component';
import { NosotrosComponent } from './opcionesMenu/nosotros/nosotros.component';
import { ReportesComponent } from './opcionesMenu/reportes/reportes.component';
import { BasedeDatosComponent } from './opcionesMenu/basede-datos/basede-datos.component';
import { SeguimientoProyectoComponent } from './dialog/seguimiento-proyecto/seguimiento-proyecto.component';
import { GestionusuarioComponent } from './dialog/gestionusuario/gestionusuario.component';
import { ManageGestionUsuarioComponent } from './manage-gestion-usuario/manage-gestion-usuario.component';
import { ManageEntidadEjecutoraComponent } from './manage-entidad-ejecutora/manage-entidad-ejecutora.component';
import { ManageEntidadUOrganizacionComponent } from './manage-entidad-u-organizacion/manage-entidad-u-organizacion.component';
import { EntidadEjecutoraComponent } from './dialog/entidad-ejecutora/entidad-ejecutora.component';
import { EntidadOrganizacionComponent } from './dialog/entidad-organizacion/entidad-organizacion.component';
import { AppComponent } from '../app.component';
import { ManageEntidadFinancieraComponent } from './manage-entidad-financiera/manage-entidad-financiera.component';
import { EntidadFinancieraComponent } from './dialog/entidad-financiera/entidad-financiera.component';
import { ManageIndicadorComponent } from './manage-indicador/manage-indicador.component';
import { IndicadorComponent } from './dialog/indicador/indicador.component';
import { ManageGestionEtapaComponent } from './manage-gestion-etapa/manage-gestion-etapa.component';
import { GestionEtapaComponent } from './dialog/gestion-etapa/gestion-etapa.component';
import { MapModalComponent } from './dialog/map-modal/map-modal.component';
import { HistorialSeguimientosProyectoComponent } from './historial-seguimientos-proyecto/historial-seguimientos-proyecto.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { ReportesProyectoComponent } from './reportes-proyecto/reportes-proyecto.component';
import {MatGridListModule} from '@angular/material/grid-list';
//import { MaterialModule } from '../shared/material-module';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { CambioUsuarioProyectoComponent } from './dialog/cambio-usuario-proyecto/cambio-usuario-proyecto.component';
import { ReportesIndicadoresComponent } from './reportes-indicadores/reportes-indicadores.component';
import { ArchivosProyectoComponent } from './dialog/archivos-proyecto/archivos-proyecto.component';
import { ArchivosComponent } from './dialog/archivos/archivos.component';
import { ManageComunidadComponent } from './manage-comunidad/manage-comunidad.component';
//import { ComponentsRoutingModule } from './components-routing.module';


@NgModule({
  declarations: [
    ConfirmationComponent,
    ManageProyectoComponent,
    ManageCategoriaComponent,
    CategoriaComponent,
    ManageMunicipioComponent,
    ProyectoComponent,
    MunicipioComponent,
    NosotrosComponent,
    ReportesComponent,
    BasedeDatosComponent,
    SeguimientoProyectoComponent,
    GestionusuarioComponent,
    ManageGestionUsuarioComponent,
    ManageEntidadEjecutoraComponent,
    ManageEntidadUOrganizacionComponent,
    EntidadEjecutoraComponent,
    EntidadOrganizacionComponent,
    ManageEntidadFinancieraComponent,
    EntidadFinancieraComponent,
    ManageIndicadorComponent,
    IndicadorComponent,
    ManageGestionEtapaComponent,
    GestionEtapaComponent,
    MapModalComponent,
    HistorialSeguimientosProyectoComponent,
    ReportesProyectoComponent,
    CambioUsuarioProyectoComponent,
    ReportesIndicadoresComponent,
    ArchivosProyectoComponent,
    ArchivosComponent,
    ManageComunidadComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(CompontsRoutes),
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CdkTableModule,
    HighchartsChartModule,
    MatGridListModule,
    ScrollingModule
  ]
 // bootstrap: [AppComponent]
})
export class ComponentsModule { }
