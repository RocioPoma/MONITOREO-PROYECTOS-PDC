import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LayoutsComponent } from './layouts/layouts.component';
import { RouteGuardService } from './services/route-guard.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageProyectoComponent } from './components/manage-proyecto/manage-proyecto.component';
import { ManageCategoriaComponent } from './components/manage-categoria/manage-categoria.component';
import { ManageMunicipioComponent } from './components/manage-municipio/manage-municipio.component';
import { NosotrosComponent } from "./components/opcionesMenu/nosotros/nosotros.component";
import { ReportesComponent } from "./components/opcionesMenu/reportes/reportes.component";
import { BasedeDatosComponent } from "./components/opcionesMenu/basede-datos/basede-datos.component";
import { AuthGuard } from './guards/auth.guard';
import { ManageGestionUsuarioComponent } from "./components/manage-gestion-usuario/manage-gestion-usuario.component";
import { ManageEntidadEjecutoraComponent} from "./components/manage-entidad-ejecutora/manage-entidad-ejecutora.component";
import { ManageEntidadFinancieraComponent} from "./components/manage-entidad-financiera/manage-entidad-financiera.component";
import { ManageEntidadUOrganizacionComponent } from "./components/manage-entidad-u-organizacion/manage-entidad-u-organizacion.component";
import { ManageIndicadorComponent } from './components/manage-indicador/manage-indicador.component';
import { ManageGestionEtapaComponent } from './components/manage-gestion-etapa/manage-gestion-etapa.component';
import { ReportesProyectoComponent } from './components/reportes-proyecto/reportes-proyecto.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  {
    path: '', // Ruta para el HomeComponent
    component: HomeComponent,
    children: [
      { path: 'nosotros', component: NosotrosComponent }, // Rutas secundarias para Nosotros, Reportes, Base de Datos y Otros
      { path: 'reportes', component: ReportesComponent },
      { path: 'bd', component: BasedeDatosComponent }
    ]
  },  

  { path: 'dashboard', component: DashboardComponent },
  /**Fin Pruebas**/



  { path: 'layout', component: LayoutsComponent,
  children:[
    { path: 'pproyecto', component: ManageProyectoComponent },
    { path: 'categoria', component: ManageCategoriaComponent },
    { path: 'gestionusuario', component: ManageGestionUsuarioComponent },
    { path: 'municipio', component: ManageMunicipioComponent },
    { path: 'entidad-ejecutora', component: ManageEntidadEjecutoraComponent },
    { path: 'entidad-financiera', component: ManageEntidadFinancieraComponent },
    { path: 'entidad-organizacion', component: ManageEntidadUOrganizacionComponent },
    { path: 'etapa', component: ManageGestionEtapaComponent },
    { path: 'indicador', component: ManageIndicadorComponent },
   //{ path: 'indicador', component: ManageIndicadorComponent }
    { path: 'reportes-proyectos',component:ReportesProyectoComponent}
    ] 
  },
/* 
   {
    path: 'layout1', component: LayoutsComponent,
    children: [

      
      /*
      {
        path: '',
        redirectTo: '/proyecto/dashboard',
        pathMatch: 'full',
      },
      {
        path: '',
        loadChildren:
          () => import('./components/components.module').then(m => m.ComponentsModule),
        canActivate: [RouteGuardService],
        data: {
          expectedRole: ['']
        }
      },

      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [RouteGuardService],
        data: {
          expectedRole: ['']
        }
      },

      ]
    },  */


    {
      path: '',
      loadChildren:
        () => import('./components/components.module').then(m => m.ComponentsModule),
      canActivate: [RouteGuardService],
      data: {
        expectedRole: ['']
      }
    },
    {
      path: '',
      loadChildren: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
      canActivate: [RouteGuardService],
      data: {
        expectedRole: ['']
      }
    },
    {
      path: '',
      loadChildren: () => import('./shared/material.module').then(m => m.MaterialModule),
      canActivate: [RouteGuardService],
      data: {
        expectedRole: ['']
      }
    },

  
  { path: '**', component: HomeComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
