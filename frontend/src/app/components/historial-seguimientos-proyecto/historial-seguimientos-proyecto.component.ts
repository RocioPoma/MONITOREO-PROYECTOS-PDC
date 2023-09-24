import { Component,Input } from '@angular/core';
import { SeguimientoProyectoService } from 'src/app/services/seguimiento-proyecto.service';
export interface PeriodicElement {
  nro:number;
  historial:string;
  nombre_etapa: string;
  fecha_seguimiento: string;
  avance_seguimiento_fisico: number;
  avance_seguimiento_financiero:number;
  adjunto_fisico:string;
  adjunto_financiero:string;
  monto_total:string;
  coste_final:string;
  fuente_de_informacion: string;
}
export interface PeriodicHistorialElement {
  nro:number;
  nombre_etapa: string;
  fecha_seguimiento_fisico: string;
  avance_seguimiento_fisico: number;
  adjunto_fisico:string;
  adjunto_financiero:string;
  avance_seguimiento_financiero: string;
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
  displayedColumns: string[] = ['nro','historial','nombre_etapa','coste_final','avance_seguimiento_fisico','avance_seguimiento_financiero', 'fecha_seguimiento', 'monto_total', 'fuente_de_informacion','adjunto_fisico','adjunto_financiero'];
  displayedSeguimientoColumns: string[] = ['nro','nombre_etapa', 'fecha_seguimiento', 'avance_seguimiento_fisico','avance_seguimiento_financiero','adjunto_financiero','adjunto_fisico'];
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
        // console.log(res);
        // console.log(this.proyecto);
        this.dataEtapas=res;
        this.finaciamientoEtapas();
      }
    })
  }
  finaciamientoEtapas(){
    for(let etapa of this.dataEtapas){
      this.seguimientoProyectoService.getMontosEtapas(etapa.id_etapa_proyecto).subscribe(res=>{
        etapa.coste_final=res.coste_final;
        etapa.monto_total=res.monto_total;
      })
      
    }
  }
  openHistorial(element:any){
    // console.log(element);
    this.etapa_proyecto=element;
    this.openHistorialEtapa=true;
    this.getSeguimientoEtapasEtapas()
  }
  progresoFinanciamiento(element:any){
    // console.log(element);
    if(element.monto_total){
      return ((element.monto_total*100)/element.coste_final).toFixed(2)
    } return 0
  }
  downloadFile(nombre:any){
    this.seguimientoProyectoService.downloadFileSeguimiento(nombre)
    .subscribe(blob => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = nombre;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
    });
    }
}
