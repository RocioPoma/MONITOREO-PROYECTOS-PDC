import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ReportesService } from 'src/app/services/reportes.service';
export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}
@Component({
  selector: 'app-reportes-proyecto',
  templateUrl: './reportes-proyecto.component.html',
  styleUrls: ['./reportes-proyecto.component.scss']
})
export class ReportesProyectoComponent {
  dataLE:any[] =[];
  dataCat:any[] =[];
  dataTip:any[]=[];
  dataIndi:any[]=[];

  constructor(private readonly reportesService:ReportesService){}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getDataLE();
    this.getDataCat();
    this.getDataTip();
  }
  getDataLE(){
    this.reportesService.lineasEstrategicas().subscribe({
      next:res=>{
        console.log('Lineas',res);
        this.dataLE=res;
        this.createChartLE(this.dataLE);
      }
    })
  }
  getDataCat(){
    this.reportesService.categorias().subscribe({
      next:res=>{
        console.log('categorias',res);
        this.dataCat=res;
        this.createChartCategoria(this.dataCat);
      }
    })
  }
  getDataTip(){
    this.reportesService.tipologias().subscribe({
      next:res=>{
        console.log('tipologias',res);
        this.dataTip=res;
        this.createChartTipologia(this.dataTip);
      }
    })
  }
  createChartLE(data: any[]) {
    // Mapea los datos para configurar las series del gráfico
    const seriesData = data.map((item) => ({
      name: item.descripcion,
      data: item.total,
    }));

    // Configuración del gráfico
    Highcharts.chart('chart-container-lineas', {
      chart: {
        type: 'colum', // Puedes cambiar el tipo de gráfico aquí (line, bar, pie, etc.)
      },
      // title: {
      //   text: 'Gráfico de Datos Emulados por columnas',
      // },
      xAxis: {
        categories: data.map((item) => item.descripcion),
      },
      yAxis: {
        title: {
          text: 'Valores',
        },
      },

      series: [
        {
          data: data.map((item) => item.total),
          type: 'column',
        },
      ],
      noData: {
        style: {
          fontWeight: 'bold',
          fontSize: '10px',
          color: '#3cb371',
        },
      },
    });
  }
  createChartCategoria(data: any[]) {
    // Mapea los datos para configurar las series del gráfico
    const seriesData = data.map((item) => ({
      name: item.name,
      data: [item.value],
    }));

    // Configuración del gráfico
    Highcharts.chart('chart-container-categoria', {
      chart: {
        type: 'bar', // Puedes cambiar el tipo de gráfico aquí (line, bar, pie, etc.)
      },
      title: {
        text: 'Gráfico de Datos por Emulados por barras',
      },
      xAxis: {
        // categories: data.map((item) => item.name),
        labels:{
          skew3d:true,
          style:{
            fontSize:'16px'
          }
        }
      },
      yAxis: {
        title: {
          text: 'Valores',
        },
        // categories:data.map((item) => item.nom_categoria),
      },
      series: [
        {
          data: data.map((item) => item.total),
          type: 'column',
        },
      ],
      noData: {
        style: {
          fontWeight: 'bold',
          fontSize: '15px',
          color: '#303030',
        },
      },
    });
  }
  createChartTipologia(data: any[]) {
    // Mapea los datos para configurar las series del gráfico
    const seriesData = data.map((item) => ({
      name: item.descripcion,
      data: item.total,
    }));

    // Configuración del gráfico
    Highcharts.chart('chart-container-tipologia', {
      chart: {
        type: 'colum', // Puedes cambiar el tipo de gráfico aquí (line, bar, pie, etc.)
      },
      // title: {
      //   text: 'Gráfico de Datos Emulados por columnas',
      // },
      xAxis: {
        categories: data.map((item) => item.nom_tipologia),
      },
      yAxis: {
        title: {
          text: 'Valores',
        },
      },

      series: [
        {
          data: data.map((item) => item.total),
          type: 'column',
        },
      ],
      noData: {
        style: {
          fontWeight: 'bold',
          fontSize: '10px',
          color: '#3cb371',
        },
      },
    });
  }
}
