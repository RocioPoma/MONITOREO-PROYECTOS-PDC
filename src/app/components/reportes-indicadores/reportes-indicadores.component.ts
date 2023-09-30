import { Component } from '@angular/core';
import { ReportesService } from 'src/app/services/reportes.service';

@Component({
  selector: 'app-reportes-indicadores',
  templateUrl: './reportes-indicadores.component.html',
  styleUrls: ['./reportes-indicadores.component.scss'],
})
export class ReportesIndicadoresComponent {

  dataSource:any[]=[];
  displayedColumns: string[] = ['COD','nombre_indicador','uni_ind','LB_2020','Meta_2025','%_ind_efectivo', '#Acciones', 'NDC', 'PDES','PPRH'];
 constructor(private readonly reportesService:ReportesService){}
 ngOnInit(): void {
  //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  //Add 'implements OnInit' to the class.
  this.getIndicadores();
  }

  getIndicadores(){
    this.reportesService.report_indicadores().subscribe({
      next:res=>{
        this.dataSource=res;
        //console.log(this.dataSource);
      }
    })
  }
  efectividad(indice:number){
    //console.log(Number.isNaN(indice));
    if(Number.isNaN(indice)) return 'icon-color';
    return indice<30?'icon-color': indice<60 ? 'icon-color-30':'icon-color-60'
  }
}
