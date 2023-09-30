import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
//import { CampeonatoService } from 'src/app/servicios/campeonato.service';
//import { UserService } from 'src/app/servicios/user.service';


@Component({
  selector: 'app-layouts',
  templateUrl: './layouts.component.html',
  styleUrls: ['./layouts.component.scss']
})
export class LayoutsComponent {
  //---------usaurio
  

  mobileQuery: MediaQueryList;
  usuario: any;
  ap:any;
  am:any;
  rol: any;
  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private activeR: ActivatedRoute,
    private userService: LoginService,
   // private userService: UserService,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
/*      const rol = localStorage.getItem('rol');
    const nombre = localStorage.getItem('nombre'); */
  }


  ngOnInit() {
 
    const nombreString = localStorage.getItem('nombre');
    const ApString = localStorage.getItem('ap_paterno');
    const AmString = localStorage.getItem('ap_materno');
    const rolString = localStorage.getItem('rol');

    this.usuario = nombreString? (nombreString): null;
    this.ap = ApString ? (ApString ): null;
    this.am = AmString? (AmString): null;
    this.rol = rolString? (rolString): null;
    //this.usuario = this.activeR.snapshot.paramMap.get('xnom');
    //console.log('Usuario: ' + localStorage.getItem('nombre'))
    
    //recuperacion de nombre y usaurio del servicio usuario
    // Obtener los datos del servicio compartido
  
    //recuperacion de nombre y usaurio del servicio usuario

    this.activeR.params.subscribe(para => {
      //this.usuario = para['xnom'];
      ////console.log('Usuario: ' + this.usuario)
    });

    //this.usuario='Rocio Poma Silvestre'
   // this.usuario='Usuario'
    
    /*
    this.usuario='Rocio Poma Silve'
    this.userService.disparadorDeUser.subscribe(data=>{
      //console.log('Usuario: ' + data);
      this.usuario=data;
    })*/

  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  ngAfterViewInit() { }

}
