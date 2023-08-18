import { Component,OnDestroy,ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
//import jwt_decode from "jwt-decode";
//import { MenuItems } from 'src/app/shared/menu-items';

interface MenuItem {
  title: string;
  icon?: string;
  link?: string;
  submenus?: MenuItem[];
}


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent  implements OnDestroy{
  rol: any;
//array
menuItems: MenuItem[] = [
  {
    title: 'Home',
    icon: 'home',
    submenus: [      
      {
        title: 'Acción 1',
        link: '/accion1'
      },
      {
        title: 'Acción 2',
        link: '/accion2'
      }
    ]
  },
  {
    title: 'Usuarios',
    icon: 'group',
    submenus: [
      {
        title: 'Gestion Usuario',
        link: '/gestionusuario'
      },
      {
        title: 'Gestion Roles',
        link: '/p'
      },
      {
        title: 'Gestion Procesos',
        link: '/p'
      }
    ]
  },
  {
    title: 'Proyectos/acciones',
    icon: 'home',
    submenus: [
      {
        title: 'Proyecto/acción',
        link: '/pproyecto'
      }
    ]
   
  },
  {
    title: 'Seguimiento/proy',
    icon: 'article',
    submenus: [
      {
        title: 'Proyecto 1',
        link: '/proyecto1'
      },
      {
        title: 'Proyecto 2',
        link: '/proyecto2'
      }
    ]
  },  {
    title: 'Reportes',
    icon: 'assessment',
    submenus: [
      {
        title: 'Indicadores',
        link: '/proyecto1'
      },
      {
        title: 'Lineas Estr.',
        link: '/proyecto2'
      },
      {
        title: 'Proyecto ...',
        link: '/accion1'
      },
    ]
  },
  {
    title: 'Configuracion',
    icon: 'settings',
    submenus: [
      {
        title: 'Gestión municipio',
        link: '/municipio'
      },
      {
        title: 'Gestión categoria',
        link: '/categoria'
      },
      {
        title: 'Entidad Ejecutora',
        link: '/entidad-ejecutora'
      },
      {
        title: 'Entidad/organizacion',
        link: '/entidad-organizacion'
      },
      {
        title: 'Entidad/Financiera',
        link: '/entidad-financiera'
      },
      {
        title: 'ADM Indicador',
        link: '/indicador'
      }
    ]
  }

];
//array


//array
menuItems2: MenuItem[] = [
  {
    title: 'Home',
    icon: 'home',
    submenus: [      
      {
        title: 'Acción 1',
        link: '/accion1'
      },
      {
        title: 'Acción 2',
        link: '/accion2'
      }
    ]
  }, 
  {
    title: 'Proyectos/acciones',
    icon: 'home',
    submenus: [
      {
        title: 'Proyecto/acción',
        link: '/pproyecto'
      }
    ]
   
  },
   {
    title: 'Reportes',
    icon: 'assessment',
    submenus: [
      {
        title: 'Indicadores',
        link: '/proyecto1'
      },
      {
        title: 'Lineas Estr.',
        link: '/proyecto2'
      },
      {
        title: 'Proyecto ...',
        link: '/accion1'
      }
    ]
  },
  

];

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

 

  constructor(//private campeonatoService: CampeonatoService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private router: Router,
    //public menuItems:MenuItems,
    //public campeonatoItems:CampeonatoItems
   
  ) {
    //this.tokenPayload = jwt_decode(this.token);
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

  }


  ngOnInit():void {
    const rolString = localStorage.getItem('rol');

    this.rol = rolString? (rolString): null;

        // Determinar el rol actual del usuario (puedes obtenerlo desde el servicio de autenticación)
        const userRole = this.rol; // Por ejemplo, asumimos que el rol es 'admin'
       // Asignar el menú según el rol del usuario
    if (userRole === 'Administrador') {
      this.menuItems = this.menuItems;
    } else {
      this.menuItems = this.menuItems2;
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }


  navigateTo(route: string) {
    //console.log(route);
    this.router.navigate([`/${route}`]);
  }

}
