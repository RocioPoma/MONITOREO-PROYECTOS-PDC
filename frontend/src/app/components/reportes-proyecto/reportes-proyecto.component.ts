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
        labels: {
          skew3d: true,
          style: {
            fontSize: '16px',
          },
        },
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
        type: 'bar',
        marginLeft: 150,
      },
      title: {
        text: 'Most popular ideas by April 2016',
      },
      subtitle: {
        text: 'Source: <a href="https://highcharts.uservoice.com/forums/55896-highcharts-javascript-api">UserVoice</a>',
      },
      xAxis: {
        type: 'category',
        title: {
          text: null,
        },
        min: 0,
        max: 4,
        scrollbar: {
          enabled: true,
        },
        tickLength: 0,
      },
      yAxis: {
        min: 0,
        max: 1200,
        title: {
          text: 'Votes',
          align: 'high',
        },
        scrollbar: {
          enabled: true,
        },
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true,
          },
        },
      },
      legend: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          name: 'Votes',
          type: 'column',
          data: [
            ['Gantt chart', 1000],
            ['Autocalculation and plotting of trend lines', 575],
            ['Allow navigator to have multiple data series', 523],
            ['Implement dynamic font size', 427],
            ['Multiple axis alignment control', 399],
            ['Stacked area (spline etc) in irregular datetime series', 309],
            ['Adapt chart height to legend height', 278],
            ['Export charts in excel sheet', 239],
            ['Toggle legend box', 235],
            ['Venn Diagram', 203],
            ['Add ability to change Rangeselector position', 182],
            ['Draggable legend box', 157],
            ['Sankey Diagram', 149],
            ['Add Navigation bar for Y-Axis in Highcharts Stock', 144],
            ['Grouped x-axis', 143],
            ['ReactJS plugin', 137],
            ['3D surface charts', 134],
            ['Draw lines over a stock chart, for analysis purpose', 118],
            ['Data module for database tables', 118],
            ['Draggable points', 117],
          ],
        },
      ],
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
