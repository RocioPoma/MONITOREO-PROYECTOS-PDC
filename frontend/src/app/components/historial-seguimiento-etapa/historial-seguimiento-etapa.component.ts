import { Component, Input } from '@angular/core';
import { SeguimientoProyectoService } from '../../services/seguimiento-proyecto.service';
export interface PeriodicHistorialElement {
  nro:number;
  historial:string;
  nombre_etapa: string;
  fecha_seguimiento: string;
  avance_seguimiento_fisico: number;
}
@Component({
  selector: 'app-historial-seguimiento-etapa',
  templateUrl: './historial-seguimiento-etapa.component.html',
  styleUrls: ['./historial-seguimiento-etapa.component.scss']
})
export class HistorialSeguimientoEtapaComponent {
  dataSeguimientosEtapa=[];
  @Input()
  id_etapa_proyecto:number;
  displayedColumns: string[] = ['nro','nombre_etapa', 'fecha_seguimiento', 'avance_seguimiento_fisico'];
  clickedRows = new Set<PeriodicHistorialElement>();
  constructor(private readonly seguimientoProyectoService:SeguimientoProyectoService){}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getEtapas();
  }
  getEtapas(){
    this.seguimientoProyectoService.getHistorialSeguimientoEtapa(this.id_etapa_proyecto).subscribe({
      next:res=>{
        this.dataSeguimientosEtapa=res;
      },
      complete:()=>{
        console.log(this.dataSeguimientosEtapa);
      }
    })
  }
}
