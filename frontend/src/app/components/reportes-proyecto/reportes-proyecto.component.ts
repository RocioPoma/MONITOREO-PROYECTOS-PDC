import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ReportesService } from 'src/app/services/reportes.service';
import * as L from 'leaflet';

import 'highcharts/modules/exporting';
import 'highcharts/modules/export-data';
import 'highcharts/modules/accessibility';


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
  dataInversionLE: any[] = [];
  dataInversionDesagregadaLE: any[] = [];
  dataMap: any[] = [];
  map: any;

  constructor(private readonly reportesService: ReportesService) { }

  ngOnInit(): void {
    this.getDataLE();
    this.getDataPDC();
    this.getDataCat();
    this.getDataTip();
    this.getDataInversionLE();
    this.getDataInversionDesagregadaLE();

    this.map = L.map('map').setView([-16.5000, -64.0000], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }

  getDataLE() {
    this.reportesService.lineasEstrategicas().subscribe({
      next: (res) => {
        this.dataLE = res;
        this.createChartLE(this.dataLE);
      },
    });
  }

  getDataCat() {
    this.reportesService.categorias().subscribe({
      next: (res) => {
        this.dataCat = res;
        this.createChartCategoria(this.dataCat);
      },
    });
  }

  getDataTip() {
    this.reportesService.tipologias().subscribe({
      next: (res) => {
        this.dataTip = res;
        this.createChartTipologia(this.dataTip);
      },
    });
  }

  getDataPDC() {
    this.reportesService.pdc_etapa().subscribe({
      next: (res) => {
        this.dataIndicador = res;
        this.createChartPdc(this.dataIndicador);
      },
    });
  }

  getDataInversionLE() {
    this.reportesService.inversion_le().subscribe({
      next: (res) => {
        this.dataInversionLE = res;
         this.createChartInversion(this.dataInversionLE);
      },
    });
  }

  getDataInversionDesagregadaLE() {
    this.reportesService.inversion_desagregada_le().subscribe({
      next: (res) => {
        this.dataInversionDesagregadaLE = res;
        this.createChartInversionDesagregadaLE(this.dataInversionDesagregadaLE);
      },
    });
  }

  createChartLE(data: any[]) {
    const seriesData = data.map((item) => ({
      name: item.descripcion,
      data: item.total,
    }));

    Highcharts.chart('chart-container-lineas', {
      chart: {
        type: 'column',
      },
      title: {
        text: 'Nro. Acciones/Proyectos por LE.',
        align: 'left',
      },
      xAxis: {
        categories: data.map((item) => item.id_linea_estrategica + ' .- ' + item.descripcion),
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
    const seriesData = data.map((item) => ({
      name: item.name,
      data: [item.value],
    }));

    Highcharts.chart('chart-container-categoria', {
      chart: {
        type: 'bar',
        height: 500,
        marginLeft: 150,
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
      },
      series: [
        {
          name: 'Cantidad',
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
    const seriesData = data.map((item) => ({
      name: item.descripcion,
      data: item.total,
    }));

    Highcharts.chart('chart-container-tipologia', {
      chart: {
        type: 'bar',
        marginLeft: 150,
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
      },
      series: [
        {
          name: 'Cantidad',
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
        height: 1000,
      },
      title: {
        text: 'Nro Acciones/proyectos por indicador',
        align: 'left',
      },
      xAxis: {
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
  createChartInversion(data: any[]) {
    Highcharts.chart('container', {
      chart: {
        type: 'bar',
        height: 1000,
      },
      title: {
        text: 'Inversión desagregada por Linea Estratégica',
        align: 'left',
      },
      xAxis: {
        categories: ['Africa', 'America', 'Asia', 'Europe', 'Oceania'],
        labels: {
          style: {
            fontSize: '12px',
          },
        },
        title: {
          text: null
        },
        gridLineWidth: 1,
        lineWidth: 0
      },
      yAxis: {
        min: 0,
        title: {
          text: '(Millones)',
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
        backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
        shadow: true
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'EDTP',
        type: 'bar',
        data: [631, 727, 3202, 721, 26]
      }, {
        name: 'Gestion Financiamiento',
        type: 'bar',
        data: [814, 841, 3714, 726, 31]
      }, {
        name: 'Ejecución',
        type: 'bar',
        data: [1044, 944, 4170, 735, 40]
      }]
    });
  }*/

  
  createChartInversion(data: any[]) {
 
    Highcharts.chart('chart-container-inversion-LE', {
      chart: {
        type: 'bar'
      },
      title: {
        text: 'Inversión por Linea Estratégica',
        align: 'left'
      },
      xAxis: {
        categories: data.map((item) => item.id_linea_estrategica + ' .- ' + item.linea_estrategica),
        title: {
          text: null
        },
        gridLineWidth: 1,
        lineWidth: 0
      },
      yAxis: {
        min: 0,
        title: {
          text: '(Millones)',
          align: 'high'
        },
        labels: {
          overflow: 'justify'
        },
        gridLineWidth: 0
      },
      tooltip: {
        valueSuffix: ' millones'
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
      
      credits: {
        enabled: false
      },
      series: [{
        name: 'Inversión',
        type: 'bar',
        data: data.map((item) => item.inversion_total)
      }]
    });
  }

  createChartInversionDesagregadaLE(data: any[]) {
 
    Highcharts.chart('chart-container-inversion-LE-desagregada', {
      chart: {
        type: 'bar'
      },
      title: {
        text: 'Inversión desagregada por Linea Estratégica',
        align: 'left'
      },
      xAxis: {
        categories: ['LE1', 'LE2', 'LE3', 'LE4','LE5'],
        title: {
          text: null
        },
        gridLineWidth: 1,
        lineWidth: 0
      },
      yAxis: {
        min: 0,
        title: {
          text: '(Millions)',
          align: 'high'
        },
        labels: {
          overflow: 'justify'
        },
        gridLineWidth: 0
      },
      tooltip: {
        valueSuffix: ' millones'
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
        backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
        shadow: true
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Tarija',
        type: 'bar',
        data: [814, 841, 3714, 726]
      }, {
        name: 'San Lorenzo',
        type: 'bar',
        data: [814, 841, 3714, 726]
      }, {
        name: 'Padcaya',
        type: 'bar',
        data: [1044, 944, 4170, 735]
      }, {
        name: 'Uriondo',
        type: 'bar',
        data: [1276, 1007, 4561, 746]
      }]
    });
  }
}

