import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ReportesService } from 'src/app/services/reportes.service';
import * as L from 'leaflet';
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
  dataIndicador: any[] = [];
  dataMap: any[] = [];
  map: any;

  constructor(private readonly reportesService: ReportesService) { }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getDataLE();
    this.getDataCat();
    this.getDataTip();
    this.getDataPDC();
   // this.createChartInversion();
    // this.getDataMapa();
    // this.createChartPdc();
    // Crea el mapa y establece la vista inicial
    this.map = L.map('map').setView([-16.5000, -64.0000], 6);


    // Agrega una capa de mapa base (por ejemplo, OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
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

  getDataPDC() {
    this.reportesService.pdc_etapa().subscribe({
      next: (res) => {
        console.log('pdc_etapa', res);
        this.dataIndicador = res;
        this.createChartPdc(this.dataIndicador);
      },
    });
  }

  /*
    getDataMapa() {
      this.reportesService.mapa_proyecto().subscribe({
        next: (res) => {
          console.log('pdc_etapa', res);
          this.dataMap = res;
          this.createChartPdc(this.dataMap);
    
          // Itera sobre los datos y coloca marcadores en el mapa
          res.forEach((item) => {
            const latlng = { lat: item.latitud, lng: item.longitud }; // Reemplaza con los campos reales de latitud y longitud en tus datos
            const stage = item.ultima_etapa; // Reemplaza con el campo real que indica la etapa
    
            // Define un icono personalizado basado en la etapa
            const icon = L.icon({
              iconUrl: '../../../../../assets/img/map_icon.png', // Ruta relativa al ícono
              iconSize: [25, 41], // Tamaño del ícono
              iconAnchor: [12, 41], // Anclaje del ícono
              popupAnchor: [1, -34], // Anclaje del globo emergente
            });
    
            // Crea el marcador con el icono personalizado
            const marker = L.marker(latlng,{icon}).addTo(this.map);
            //const marker = L.marker(latlng,{icon:myIcon}).addTo(map);
    
            // Agrega un popup con información adicional si lo deseas
            marker.bindPopup(`<b>Proyecto:</b> ${item.nombre_proyecto}<br><b>Etapa:</b> ${stage}`);
    
            // Resto del código...
          });
        },
      });
    }*/

  getIconUrlByStage(stage: string): string {
    // Implementa esta función para asignar una URL de icono según la etapa
    // Puedes definir un mapeo de etapa a URL de icono aquí
    // Por ejemplo, si tienes íconos en tu proyecto, puedes almacenarlos en una carpeta y construir la URL en función de la etapa.
    // De lo contrario, puedes usar íconos predeterminados de Leaflet.
    // Ejemplo de implementación:
    // if (stage === 'EDTP') {
    //   return 'assets/icons/edtp-icon.png'; // Reemplaza con la ruta real de tu icono
    // } else if (stage === 'Gestion Financiamiento') {
    //   return 'assets/icons/financiamiento-icon.png'; // Reemplaza con la ruta real de tu icono
    // }
    // // Resto de las etapas...

    // Por defecto, usa el ícono de Leaflet
    return 'node_modules/leaflet/dist/images/marker-icon.png';
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
        align: 'left',
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
          name: 'Nro de acciones/proyectos',
          color: '#3cb371',

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
        height: 500,
        marginLeft: 150
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
          color: '#3cb371',
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
        marginLeft: 150
      },
      title: {
        text: 'Nro. Acciones/Proyectos por Tipología',
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
  createChartPdc(data: any[]) {
    Highcharts.chart('chart-container-pdc', {
      chart: {
        type: 'bar',
        height: 1000, // Establece la altura del gráfico a 800px
      },
      title: {
        text: 'Nro Acciones/proyectos por indicador',
        align: 'left',
      },
      xAxis: {
        // categories: ['Arsenal', 'Chelsea', 'Liverpool', 'Manchester United'],
        categories: data.map((item) => item.id_indicador + '.- ' + item.nombre_indicador),
        labels: {
          style: {
            fontSize: '12px',
          },

        },
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Nro',
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
        name: 'EDTP',
        type: 'column',
        data: data.map((item) => item.EDTP)
      }, {
        name: 'Gestion Financiamiento',
        type: 'column',
        data: data.map((item) => item.Gestion_Financiamiento)
      }, {
        name: 'Ejecución',
        type: 'column',
        data: data.map((item) => item.Ejecucion)
      },
      {
        name: 'Propuesta',
        type: 'column',
        data: data.map((item) => item.Propuesta)
      },
      {
        name: 'Validación',
        type: 'column',
        data: data.map((item) => item.Validacion)
      },
      {
        name: 'Promulgación',
        type: 'column',
        data: data.map((item) => item.Promulgacion)
      },
      {
        name: 'Aprobación',
        type: 'column',
        data: data.map((item) => item.Aprobacion)
      },
      {
        name: 'Organización',
        type: 'column',
        data: data.map((item) => item.Organizacion)
      }]
    });
  }

  /*
  createChartInversion() {
    
    Highcharts.chart('container-inversion', {
      chart: {
        type: 'bar'
      },
      title: {
        text: 'Historic World Population by Region',
        align: 'left'
      },
      subtitle: {
        text: 'Source: <a ' +
          'href="https://en.wikipedia.org/wiki/List_of_continents_and_continental_subregions_by_population"' +
          'target="_blank">Wikipedia.org</a>',
        align: 'left'
      },
      xAxis: {
        categories: ['Africa', 'America', 'Asia', 'Europe', 'Oceania'],
        title: {
          text: null
        },
        gridLineWidth: 1,
        lineWidth: 0
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Population (millions)',
          align: 'high'
        },
        labels: {
          overflow: 'justify'
        },
        gridLineWidth: 0
      },
      tooltip: {
        valueSuffix: ' millions'
      },
      plotOptions: {
        bar: {
          borderRadius: '50%',
          dataLabels: {
            enabled: true
          },
          groupPadding: 0.1
        }
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: -40,
        y: 80,
        floating: true,
        borderWidth: 1,
        backgroundColor:
          Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
        shadow: true
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Year 1990',
        data: [631, 727, 3202, 721, 26]
      }, {
        name: 'Year 2000',
        data: [814, 841, 3714, 726, 31]
      }, {
        name: 'Year 2010',
        data: [1044, 944, 4170, 735, 40]
      }, {
        name: 'Year 2018',
        data: [1276, 1007, 4561, 746, 42]
      }]
    });
  }*/
}
