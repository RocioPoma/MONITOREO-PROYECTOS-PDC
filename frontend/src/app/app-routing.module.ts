import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LayoutsComponent } from './layouts/layouts.component';
import { RouteGuardService } from './services/route-guard.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageProyectoComponent } from './components/manage-proyecto/manage-proyecto.component';
import { ManageCategoriaComponent } from './components/manage-categoria/manage-categoria.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  //{ path: 'proyecto', component: DashboardComponent},
   /**Para pruebas**/
 { path:'pproyecto',component:ManageProyectoComponent},
 { path:'categoria',component:ManageCategoriaComponent},

   /**Fin Pruebas**/


  {
    path: 'proyecto', component: LayoutsComponent,

    //component: LayoutsComponent,
   
    children: [
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
          expectedRole: ['admin', 'user']
        }
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [RouteGuardService],
        data: {
          expectedRole: ['admin', 'user']
        }
      }
    ]
  },
  { path: '**', component: HomeComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
