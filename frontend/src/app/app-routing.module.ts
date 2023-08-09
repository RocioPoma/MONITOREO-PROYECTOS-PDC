import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LayoutsComponent } from './layouts/layouts.component';
import { RouteGuardService } from './services/route-guard.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageProyectoComponent } from './components/manage-proyecto/manage-proyecto.component';
import { ManageCategoriaComponent } from './components/manage-categoria/manage-categoria.component';
import { ManageMunicipioComponent} from './components/manage-municipio/manage-municipio.component';
import { NosotrosComponent } from "./components/opcionesMenu/nosotros/nosotros.component";
import { ReportesComponent } from "./components/opcionesMenu/reportes/reportes.component";
import { BasedeDatosComponent} from "./components/opcionesMenu/basede-datos/basede-datos.component";
import { AuthGuard } from './guards/auth.guard';


const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: '', // Ruta para el HomeComponent
    component: HomeComponent,
    children: [
        { path: 'nosotros', component: NosotrosComponent }, // Rutas secundarias para Nosotros, Reportes, Base de Datos y Otros
        { path: 'reportes', component: ReportesComponent },
        { path: 'bd', component: BasedeDatosComponent }
    ]
  },
  //{ path: 'proyecto', component: DashboardComponent},
   /**Para pruebas**/
 { path:'pproyecto',component:ManageProyectoComponent, canActivate: [AuthGuard] },
 { path:'categoria',component:ManageCategoriaComponent},
 { path:'municipio',component:ManageMunicipioComponent},
 { path:'layout', component:LayoutsComponent},
 { path:'dashboard',component: DashboardComponent},


   /**Fin Pruebas**/




  {
    path: 'layout1', component: LayoutsComponent,
    children: [
      /*
      {
        path: '',
        redirectTo: '/proyecto/dashboard',
        pathMatch: 'full',
      },*/
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
  },
  { path: '**', component: HomeComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
