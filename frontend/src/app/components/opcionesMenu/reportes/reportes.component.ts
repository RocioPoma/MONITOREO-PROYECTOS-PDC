import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss'],
})
export class ReportesComponent implements OnInit {
  chartData: any[] = [
    { name: 'Item 1', value: 10 },
    { name: 'Item 2', value: 25 },
    { name: 'Item 3', value: 15 },
    { name: 'Item 4', value: 30 },
    { name: 'Item 5', value: 40 },
    { name: 'Item 6', value: 28 },
    { name: 'Item 7', value: 68 },
    { name: 'Item 8', value: 78 },
    { name: 'Item 10', value: 14 },
    { name: 'Item 11', value: 48 },
    { name: 'Item 12', value: 68 },
    { name: 'Item 13', value: 78 },
    { name: 'Item 14', value: 98 },
    { name: 'Item 15', value: 140 },
    // Agrega más datos de prueba según sea necesario
  ];

  ngOnInit() {
    this.createChartBar(this.chartData);
    this.createChartColumns(this.chartData);
    this.createChartTorta(this.chartData);
  }

  createChartBar(data: any[]) {
    // Mapea los datos para configurar las series del gráfico
    const seriesData = data.map((item) => ({
      name: item.name,
      data: [item.value],
    }));

    // Configuración del gráfico
    Highcharts.chart('chart-container', {
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
      },
      series: [
        {
          data: data.map((item) => item.value),
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

  createChartColumns(data: any[]) {
    // Mapea los datos para configurar las series del gráfico
    const seriesData = data.map((item) => ({
      name: item.name,
      data: [item.value],
    }));

    // Configuración del gráfico
    Highcharts.chart('chart-container2', {
      chart: {
        type: 'colum', // Puedes cambiar el tipo de gráfico aquí (line, bar, pie, etc.)
      },
      title: {
        text: 'Gráfico de Datos Emulados por columnas',
      },
      xAxis: {
        categories: data.map((item) => item.name),
      },
      yAxis: {
        title: {
          text: 'Valores',
        },
      },

      series: [
        {
          data: data.map((item) => item.value),
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

  createChartTorta(data: any[]) {
    // Mapea los datos para configurar las series del gráfico
    const seriesData = data.map((item) => ({
      name: item.name,
      data: [item.value],
    }));

    // Configuración del gráfico
    // Highcharts.chart('container',{
    //   chart: {
    //     type: 'column'
    // },
    // title: {
    //     text: 'Major trophies for some English teams',
    //     align: 'left'
    // },
    // xAxis: {
    //   categories: ['Arsenal', 'Chelsea', 'Liverpool', 'Manchester United']
    // },
    // yAxis: {
    //     min: 0,
    //     title: {
    //         text: 'Count trophies'
    //     },
    //     stackLabels: {
    //         enabled: true
    //     }
    // },
    // legend: {
    //   align: 'left',
    //   x: 70,
    //   verticalAlign: 'top',
    //   y: 70,
    //   floating: true,
    //   backgroundColor:
    //       Highcharts.defaultOptions.legend.backgroundColor || 'white',
    //   borderColor: '#CCC',
    //   borderWidth: 1,
    //   shadow: false
    //   },
    //   tooltip: {
    //       headerFormat: '<b>{point.x}</b><br/>',
    //       pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
    //   },
    //   plotOptions: {
    //     column: {
    //         stacking: 'normal',
    //         dataLabels: {
    //             enabled: true
    //         }
    //     }
    //   },
    //   series: []
    // })
  }
  //------------------------------------------------------------------------------

  Highcharts: typeof Highcharts = Highcharts;
  updateFlag = false;

  data = [1, 2, 3, 4];

  chartOptions: Highcharts.Options = {
    chart: {
      type: 'bar', // Puedes cambiar el tipo de gráfico aquí (line, bar, pie, etc.)
    },
    series: [
      {
        type: 'line',
        data: this.data,
      },
    ],
  };
}
