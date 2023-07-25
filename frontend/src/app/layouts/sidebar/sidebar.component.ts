import { Component,OnDestroy,ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
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
        title: 'Proyecto 1',
        link: '/proyecto1'
      },
      {
        title: 'Proyecto 2',
        link: '/proyecto2'
      }
    ]
  },
  {
    title: 'Proyectos/acciones',
    icon: 'home',
    submenus: [
      {
        title: 'Proyecto 1',
        link: '/proyecto'
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
      },
      {
        title: 'Acción 1',
        link: '/accion1'
      },
      {
        title: 'Acción 2',
        link: '/accion2'
      }
    ]
  },  {
    title: 'reportes',
    icon: 'assessment',
    submenus: [
      {
        title: 'Proyecto 1',
        link: '/proyecto1'
      },
      {
        title: 'Proyecto 2',
        link: '/proyecto2'
      },
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
    title: 'Configuracion',
    icon: 'settings',
    submenus: [
      {
        title: 'Proyecto 1',
        link: '/proyecto1'
      },
      {
        title: 'Proyecto 2',
        link: '/proyecto2'
      },
      {
        title: 'Acción 1',
        link: '/accion1'
      },
      {
        title: 'Acción 2',
        link: '/accion2'
      }
    ]
  }

];
//array

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

 

  constructor(//private campeonatoService: CampeonatoService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    //public menuItems:MenuItems,
    //public campeonatoItems:CampeonatoItems
  ) {
    //this.tokenPayload = jwt_decode(this.token);
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }


  ngOnInit():void {
    
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
