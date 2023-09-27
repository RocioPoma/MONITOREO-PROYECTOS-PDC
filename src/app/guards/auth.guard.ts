import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private userService: LoginService){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const authToken = this.userService.getAuthToken();

      if (authToken) {
        // Verificar aquí si el token es válido y tiene los permisos requeridos
        // Ejemplo: decodificar el token y verificar el rol/permisos
        const usuarioAutenticado = true;
        const usuarioTienePermiso = true;
  
        if (usuarioAutenticado && usuarioTienePermiso) {
          return true;
        } else {
          // Redirige a la página de inicio de sesión si no cumple los requisitos
          this.router.navigate(['/login']);
          return false;
        }
      } else {
        // Si no hay token, redirige a la página de inicio de sesión
        this.router.navigate(['/login']);
        return false;
      }
  }
  
}
