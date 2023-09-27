import { Routes } from '@angular/router';
import { DashboardComponent } from "../dashboard/dashboard.component";
import { RouteGuardService } from "../services/route-guard.service";
import { ProyectoComponent } from './dialog/proyecto/proyecto.component';
import { CategoriaComponent } from './dialog/categoria/categoria.component';


export const CompontsRoutes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [RouteGuardService],
        data: {
            expectedRole: ['admin']
        }
    },
    {
        path: 'proyecto',
        component: ProyectoComponent,
        canActivate: [RouteGuardService],
        data: {
            expectedRole: ['']
        }
    },
    {
        path: 'categoria',
        component: CategoriaComponent,
        canActivate: [RouteGuardService],
        data: {
            expectedRole: ['']
        }
    }



    
];
