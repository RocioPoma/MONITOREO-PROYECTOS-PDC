import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';



@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})

export class ReportesComponent implements OnInit {

  chartData: any[] = [
    { name: 'Item 1', value: 10 },
    { name: 'Item 2', value: 25 },
    { name: 'Item 3', value: 15 },
    { name: 'Item 4', value: 30 },
    // Agrega más datos de prueba según sea necesario
  ];

  ngOnInit() {
    this.createChart(this.chartData);
    this.createChart2(this.chartData);
    this.createChart3(this.chartData);
  }

  createChart(data: any[]) {
     // Mapea los datos para configurar las series del gráfico
     const seriesData = data.map(item => ({
      name: item.name,
      data: [item.value]
    }));

    // Configuración del gráfico
    Highcharts.chart('chart-container', {
      chart: {
        type: 'bar' // Puedes cambiar el tipo de gráfico aquí (line, bar, pie, etc.)
      },
      title: {
        text: 'Nro. Acciones/Proyectos por Categoria.'
      },
      xAxis: {
        categories: data.map(item => item.name),
      },
      yAxis: {
        title: {
          text: 'Valores'
        }
      },

      series: [{
        data: data.map(item => item.value),
        type: 'column' 
      }],
      noData: {
        style: {
            fontWeight: 'bold',
            fontSize: '15px',
            color: '#303030'
        }
    }
    });
  }


  createChart2(data: any[]) {
    // Mapea los datos para configurar las series del gráfico
    const seriesData = data.map(item => ({
     name: item.name,
     data: [item.value]
   }));

   // Configuración del gráfico
   Highcharts.chart('chart-container2', {
     chart: {
       type: 'colum' // Puedes cambiar el tipo de gráfico aquí (line, bar, pie, etc.)
     },
     title: {
       text: 'Gráfico de Datos Emulados'
     },
     xAxis: {
       categories: data.map(item => item.name),
     },
     yAxis: {
       title: {
         text: 'Valores'
       }
     },

     series: [{
       data: data.map(item => item.value),
       type: 'column' 
     }],
     noData: {
       style: {
           fontWeight: 'bold',
           fontSize: '15px',
           color: '#303030'
       }
   }
   });
 }

 createChart3(data: any[]) {
  // Mapea los datos para configurar las series del gráfico
  const seriesData = data.map(item => ({
   name: item.name,
   data: [item.value]
 }));

 // Configuración del gráfico
 Highcharts.chart('chart-container3', {
   chart: {
     type: 'pie' // Puedes cambiar el tipo de gráfico aquí (line, bar, pie, etc.)
   },
   title: {
     text: 'Gráfico de Datos Emulados'
   },
   xAxis: {
     categories: data.map(item => item.name),
   },
   yAxis: {
     title: {
       text: 'Valores'
     }
   },

   series: [{
     data: data.map(item => item.value),
     type: 'pie'
   }],
   noData: {
     style: {
         fontWeight: 'bold',
         fontSize: '15px',
         color: '#303030'
     }
 }
 });
}
  //------------------------------------------------------------------------------

}