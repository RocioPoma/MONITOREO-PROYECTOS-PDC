import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
//import { CampeonatoService } from 'src/app/servicios/campeonato.service';
//import { UserService } from 'src/app/servicios/user.service';


@Component({
  selector: 'app-layouts',
  templateUrl: './layouts.component.html',
  styleUrls: ['./layouts.component.scss']
})
export class LayoutsComponent {

  mobileQuery: MediaQueryList;
  usuario: any;
  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private activeR: ActivatedRoute,
   // private userService: UserService,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    
    //this.usuario = this.activeR.snapshot.paramMap.get('xnom');
    console.log('Usuario: ' + this.usuario)
    
    this.activeR.params.subscribe(para => {
      this.usuario = para['xnom'];
      console.log('Usuario: ' + this.usuario)
    });

    this.usuario='Rocio Poma Silvestre'
   // this.usuario='Usuario'
    
    /*
    this.usuario='Rocio Poma Silve'
    this.userService.disparadorDeUser.subscribe(data=>{
      console.log('Usuario: ' + data);
      this.usuario=data;
    })*/

  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  ngAfterViewInit() { }

}
