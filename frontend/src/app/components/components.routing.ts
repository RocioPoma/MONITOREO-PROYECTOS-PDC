import { Routes } from '@angular/router';
import { DashboardComponent } from "../dashboard/dashboard.component";
import { RouteGuardService } from "../services/route-guard.service";


export const CompontsRoutes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [RouteGuardService],
        data: {
            expectedRole: ['admin']
        }
    }
];
