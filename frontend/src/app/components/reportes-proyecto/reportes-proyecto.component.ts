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
  styleUrls: ['./reportes-proyecto.component.scss'],
})
export class ReportesProyectoComponent {
  dataLE: any[] = [];
  dataCat: any[] = [];
  dataTip: any[] = [];
  dataIndi: any[] = [];

  constructor(private readonly reportesService: ReportesService) {}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getDataLE();
    this.getDataCat();
    this.getDataTip();
    this.createChartPdc();
  }
  getDataLE() {
    this.reportesService.lineasEstrategicas().subscribe({
      next: (res) => {
        console.log('Lineas', res);
        this.dataLE = res;
        this.createChartLE(this.dataLE);
      },
    });
  }
  getDataCat() {
    this.reportesService.categorias().subscribe({
      next: (res) => {
        console.log('categorias', res);
        this.dataCat = res;
        this.createChartCategoria(this.dataCat);
      },
    });
  }
  getDataTip() {
    this.reportesService.tipologias().subscribe({
      next: (res) => {
        console.log('tipologias', res);
        this.dataTip = res;
        this.createChartTipologia(this.dataTip);
      },
    });
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
      title: {
        text: 'Nro. Acciones/Proyectos por LE.',
        align:'left',
      },
      xAxis: {
        categories: data.map((item) => item.descripcion),

      },
      yAxis: {
        title: {
          text: 'Nro.',
        },
      },

      series: [
        {
          data: data.map((item) => item.total),
          type: 'column',
          name:'Nro de acciones/proyectos',
          color:'#3cb371',

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
        marginLeft:150
      },
      title: {
        text: 'Nro. Acciones/Proyectos por Categoría',
      },
      xAxis: {
        categories: data.map((item) => item.nom_categoria),
        labels: {
          style: {
            fontSize: '12px',
          },
        
        },
      },
      yAxis: {
        title: {
          text: 'Valores',
        },
        //categories:data.map((item) => item.nom_categoria),
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
    // Configuración del gráfico
    Highcharts.chart('chart-container-tipologia', {
      chart: {
        type: 'bar', // Puedes cambiar el tipo de gráfico aquí (line, bar, pie, etc.)
        marginLeft:150
      },
      title: {
        text: 'Nro. Acciones/Proyectos por Categoría',
      },
      xAxis: {
        categories: data.map((item) => item.nom_tipologia),
        labels: {
          style: {
            fontSize: '12px',
          },
        
        },
      },
      yAxis: {
        title: {
          text: 'Valores',
        },
        //categories:data.map((item) => item.nom_categoria),
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
  createChartPdc() {
    Highcharts.chart('chart-container-pdc', {
      chart: {
        type: 'bar',
      },
      title: {
        text: 'Major trophies for some English teams',
        align: 'left',
      },
      xAxis: {
        categories: ['Arsenal', 'Chelsea', 'Liverpool', 'Manchester United'],
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Count trophies',
        },
        stackLabels: {
          enabled: true,
        },
      },
      legend: {
        align: 'left',
        x: 10,
        verticalAlign: 'top',
        y: 10,
        floating: false,
        backgroundColor:
          Highcharts.defaultOptions.legend.backgroundColor || 'white',
        borderColor: '#CCC',
        borderWidth: 1,
        shadow: false,
      },
      tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true,
          },
        },
      },
      series: [{
        name: 'BPL',
        type:'column',
        data: [3, 5, 1, 13]
    }, {
        name: 'FA Cup',
        type:'column',
        data: [14, 8, 8, 12]
    }, {
        name: 'CL',
        type:'column',
        data: [0, 2, 6, 3]
    }]
    });
  }
}
