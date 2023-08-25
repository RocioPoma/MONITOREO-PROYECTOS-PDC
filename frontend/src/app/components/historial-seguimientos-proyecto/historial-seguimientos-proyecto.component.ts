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
export interface PeriodicHistorialElement {
  nro:number;
  nombre_etapa: string;
  fecha_seguimiento_fisico: string;
  avance_seguimiento_fisico: number;
}
@Component({
  selector: 'app-historial-seguimientos-proyecto',
  templateUrl: './historial-seguimientos-proyecto.component.html',
  styleUrls: ['./historial-seguimientos-proyecto.component.scss']
})
export class HistorialSeguimientosProyectoComponent {

  dataEtapas=[];
  dataSeguimientosEtapa=[];
  @Input()
  proyecto:any;
  etapa_proyecto:any;
  openHistorialEtapa=false;
  displayedColumns: string[] = ['nro','historial','nombre_etapa', 'fecha_seguimiento', 'avance_seguimiento_fisico', 'fuente_de_informacion'];
  displayedSeguimientoColumns: string[] = ['nro','nombre_etapa', 'fecha_seguimiento', 'avance_seguimiento_fisico'];
  clickedRows = new Set<PeriodicElement>();
  clickedSeguimientosRows = new Set<PeriodicHistorialElement>();
  constructor(private readonly seguimientoProyectoService:SeguimientoProyectoService){}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getEtapas();
  }

  getSeguimientoEtapasEtapas(){
    this.seguimientoProyectoService.getHistorialSeguimientoEtapa(this.etapa_proyecto.id_etapa_proyecto).subscribe({
      next:res=>{
        this.dataSeguimientosEtapa=res;
      }
    })
  }
  getEtapas(){
    this.seguimientoProyectoService.getEtapasProyecto(this.proyecto.id_proyecto).subscribe({
      next:res=>{
        this.dataEtapas=res;
      }
    })
  }
  openHistorial(element:any){
    console.log(element);
    this.etapa_proyecto=element;
    this.openHistorialEtapa=true;
    this.getSeguimientoEtapasEtapas()
  }
}
