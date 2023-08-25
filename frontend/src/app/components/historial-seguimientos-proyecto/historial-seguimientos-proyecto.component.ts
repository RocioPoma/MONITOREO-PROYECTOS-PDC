import { Component,Input } from '@angular/core';
import { SeguimientoProyectoService } from 'src/app/services/seguimiento-proyecto.service';
export interface PeriodicElement {
  nro:number;
  historial:string;
  nombre_etapa: string;
  fecha_seguimiento: string;
  avance_seguimiento_fisico: number;
  fuente_de_informacion: string;
}

@Component({
  selector: 'app-historial-seguimientos-proyecto',
  templateUrl: './historial-seguimientos-proyecto.component.html',
  styleUrls: ['./historial-seguimientos-proyecto.component.scss']
})
export class HistorialSeguimientosProyectoComponent {

  dataEtapas=[];
  @Input()
  proyecto:any;
  displayedColumns: string[] = ['nro','historial','nombre_etapa', 'fecha_seguimiento', 'avance_seguimiento_fisico', 'fuente_de_informacion'];
  clickedRows = new Set<PeriodicElement>();
  constructor(private readonly seguimientoProyectoService:SeguimientoProyectoService){}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getEtapas();
  }
  getEtapas(){
    this.seguimientoProyectoService.getEtapasProyecto(this.proyecto.id_proyecto).subscribe({
      next:res=>{
        this.dataEtapas=res;
      },
      complete:()=>{
        console.log(this.dataEtapas);
      }
    })
  }
  openHistorial(element:any){
    console.log(element);
  }
}
