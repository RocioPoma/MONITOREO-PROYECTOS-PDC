import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';
import * as L from 'leaflet';

import { ReportesService } from 'src/app/services/reportes.service';
import HC_exporting from 'highcharts/modules/exporting';
import HC_exportData from 'highcharts/modules/export-data';
import HC_accessibility from 'highcharts/modules/accessibility';
import { DateAdapter } from '@angular/material/core';
import { DatePipe } from '@angular/common';

// Inicializa los módulos
HC_exporting(Highcharts);
HC_exportData(Highcharts);
HC_accessibility(Highcharts);

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

  fechaInicio: Date;
  fechaFin: Date;
  fechaInicioAnalisis: any = '2020-01-01';
  fechaFinAnalisis: any = '2025-12-31';
  fechaInicioA: any = '01-01-2020';
  //fechaFinA: any= new Date();
  fechaFinA: any = this.datePipe.transform(new Date(), 'dd-MM-yyyy');

  constructor(private readonly reportesService: ReportesService,
    private datePipe: DatePipe,
    private dateAdapter: DateAdapter<Date>) {
    //Convierte la fecha en formato //dd/MM/yyyy
    this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
  }

  ngOnInit(): void {
    this.getDataLE(this.fechaInicioAnalisis, this.fechaFinAnalisis);
    this.getDataPDC(this.fechaInicioAnalisis, this.fechaFinAnalisis);
    this.getDataCat(this.fechaInicioAnalisis, this.fechaFinAnalisis);
    this.getDataTip(this.fechaInicioAnalisis, this.fechaFinAnalisis);
    this.getDataInversionLE(this.fechaInicioAnalisis, this.fechaFinAnalisis);
    this.getDataInversionDesagregadaLE(this.fechaInicioAnalisis, this.fechaFinAnalisis);

  }

  validarFechas() {
    if (this.fechaInicio && this.fechaFin && this.fechaInicio < this.fechaFin) {
      // Ambas fechas son correctas
      this.fechaInicioAnalisis = this.datePipe.transform(this.fechaInicio, 'yyyy-MM-dd');
      this.fechaFinAnalisis = this.datePipe.transform(this.fechaFin, 'yyyy-MM-dd');
      this.fechaInicioA = this.datePipe.transform(this.fechaInicio, 'dd-MM-yyyy');
      this.fechaFinA = this.datePipe.transform(this.fechaFin, 'dd-MM-yyyy');

      console.log("Fecha de Inicio:", this.fechaInicio);
      console.log("Fecha de Fin:", this.fechaFin);
      this.getDataLE(this.fechaInicioAnalisis, this.fechaFinAnalisis);
      this.getDataCat(this.fechaInicioAnalisis, this.fechaFinAnalisis);
      this.getDataInversionDesagregadaLE(this.fechaInicioAnalisis, this.fechaFinAnalisis);
      this.getDataInversionLE(this.fechaInicioAnalisis, this.fechaFinAnalisis);
      this.getDataPDC(this.fechaInicioAnalisis, this.fechaFinAnalisis);
      this.getDataTip(this.fechaInicioAnalisis, this.fechaFinAnalisis);
    } else if (this.fechaFin == null) {
      console.log('falta fecha fin')
    } else {
      console.error("La fecha de inicio debe ser anterior a la fecha de fin.");
      alert("La fecha de inicio debe ser anterior a la fecha de fin.")
      this.fechaInicio = null;
    }
  }

  getDataLE(fechaInicioAnalisis: any, fechaFinAnalisis: any) {
    let data = {
      fechaInicioAnalisis: fechaInicioAnalisis,
      fechaFinAnalisis: fechaFinAnalisis
    }
    this.reportesService.lineasEstrategicas(data).subscribe({
      next: (res) => {
        this.dataLE = res;
        this.createChartLE(this.dataLE);
      },
    });
  }

  getDataCat(fechaInicioAnalisis: any, fechaFinAnalisis: any) {
    this.reportesService.categorias(fechaInicioAnalisis, fechaFinAnalisis).subscribe({
      next: (res) => {
        this.dataCat = res;
        this.createChartCategoria(this.dataCat);
      },
    });
  }

  getDataTip(fechaInicioAnalisis: any, fechaFinAnalisis: any) {
    this.reportesService.tipologias(fechaInicioAnalisis, fechaFinAnalisis).subscribe({
      next: (res) => {
        this.dataTip = res;
        this.createChartTipologia(this.dataTip);
      },
    });
  }

  getDataPDC(fechaInicioAnalisis: any, fechaFinAnalisis: any) {
    this.reportesService.pdc_etapa(fechaInicioAnalisis, fechaFinAnalisis).subscribe({
      next: (res) => {
        this.dataIndicador = res;
        this.createChartPdc(this.dataIndicador);
      },
    });
  }

  getDataInversionLE(fechaInicioAnalisis: any, fechaFinAnalisis: any) {
    this.reportesService.inversion_le(fechaInicioAnalisis,fechaFinAnalisis).subscribe({
      next: (res) => {
        this.dataInversionLE = res;
        this.createChartInversion(this.dataInversionLE);
      },
    });
  }

  getDataInversionDesagregadaLE(fechaInicioAnalisis: any, fechaFinAnalisis: any) {
    this.reportesService.inversion_desagregada_le(fechaInicioAnalisis,fechaFinAnalisis).subscribe({
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
        text: 'Nro. Acciones/Proyectos por LE. Del ' + this.fechaInicioA + ' al ' + this.fechaFinA,
        align: 'left',
        style: {
          //color: '#808B96',
          fontSize: '18px',
        },
        margin: 20
      },
      exporting: {
        enabled: true
      },
      lang: {
        viewFullscreen: 'Ver en pantalla completa',
        exitFullscreen: 'Cerrar pantalla completa',
        printChart: 'Imprimir gráfico',
        downloadPNG: 'Descargar como PNG',
        downloadJPEG: 'Descargar como JPEG',
        downloadPDF: 'Descargar como PDF',
        downloadSVG: 'Descargar como SVG',
        downloadCSV: 'Descargar como CSV',
        downloadXLS: 'Descargar como XLS',
        hideData: 'Ocultar tabla de datos',
        viewData: 'Ver tabla de datos',

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
        text: 'Nro. Acciones/Proyectos del ' + this.fechaInicioA + ' al ' + this.fechaFinA,
        align: 'left',
      },
      exporting: {
        enabled: true
      },
      lang: {
        viewFullscreen: 'Ver en pantalla completa',
        exitFullscreen: 'Cerrar pantalla completa',
        printChart: 'Imprimir gráfico',
        downloadPNG: 'Descargar como PNG',
        downloadJPEG: 'Descargar como JPEG',
        downloadPDF: 'Descargar como PDF',
        downloadSVG: 'Descargar como SVG',
        downloadCSV: 'Descargar como CSV',
        downloadXLS: 'Descargar como XLS',
        hideData: 'Ocultar tabla de datos',
        viewData: 'Ver tabla de datos',

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
        text: 'Nro. Acciones/Proyectos por Tipología del ' + this.fechaInicioA + ' al ' + this.fechaFinA,
        align: 'left'
      },
      exporting: {
        enabled: true
      },
      lang: {
        viewFullscreen: 'Ver en pantalla completa',
        exitFullscreen: 'Cerrar pantalla completa',
        printChart: 'Imprimir gráfico',
        downloadPNG: 'Descargar como PNG',
        downloadJPEG: 'Descargar como JPEG',
        downloadPDF: 'Descargar como PDF',
        downloadSVG: 'Descargar como SVG',
        downloadCSV: 'Descargar como CSV',
        downloadXLS: 'Descargar como XLS',
        hideData: 'Ocultar tabla de datos',
        viewData: 'Ver tabla de datos',

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
        text: 'Nro Acciones/proyectos por indicador del ' + this.fechaInicioA + ' al ' + this.fechaFinA,
        align: 'left',
      },
      exporting: {
        enabled: true
      },
      lang: {
        viewFullscreen: 'Ver en pantalla completa',
        exitFullscreen: 'Cerrar pantalla completa',
        printChart: 'Imprimir gráfico',
        downloadPNG: 'Descargar como PNG',
        downloadJPEG: 'Descargar como JPEG',
        downloadPDF: 'Descargar como PDF',
        downloadSVG: 'Descargar como SVG',
        downloadCSV: 'Descargar como CSV',
        downloadXLS: 'Descargar como XLS',
        hideData: 'Ocultar tabla de datos',
        viewData: 'Ver tabla de datos',

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

  createChartInversion(data: any[]) {
    // Obtén la fecha actual
    const currentDate = new Date();

    // Obtiene el año actual
    const currentYear = currentDate.getFullYear();

    // Obtiene el mes actual (0 = enero, 11 = diciembre)
    const currentMonth = currentDate.getMonth();

    let yearToDisplay: any;

    // Comprueba si estamos en diciembre (mes 11)
    if (currentMonth === 11) {
      // Si estamos en diciembre, muestra el año actual (sin cambios)
      yearToDisplay = currentYear;
    } else {
      // Si no estamos en diciembre, muestra el año anterior
      yearToDisplay = currentYear - 1;
    }

    Highcharts.chart('chart-container-inversion-LE', {
      chart: {
        type: 'bar',
        height: 550,
      },
      title: {
        text: 'Comparación de inversiones por LE',
        align: 'left',
        style: {
          color: '#5D6D7E',
          padding: '10px'
        }
      },
      exporting: {
        enabled: true
      },
      lang: {
        viewFullscreen: 'Ver en pantalla completa',
        exitFullscreen: 'Cerrar pantalla completa',
        printChart: 'Imprimir gráfico',
        downloadPNG: 'Descargar como PNG',
        downloadJPEG: 'Descargar como JPEG',
        downloadPDF: 'Descargar como PDF',
        downloadSVG: 'Descargar como SVG',
        downloadCSV: 'Descargar como CSV',
        downloadXLS: 'Descargar como XLS',
        hideData: 'Ocultar tabla de datos',
        viewData: 'Ver tabla de datos',

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
          text: '(Bs.)',
          align: 'high'
        },
        labels: {
          overflow: 'justify'
        },
        gridLineWidth: 0
      },
      tooltip: {
        valueSuffix: ' Bs.'
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
        //name: 'Inversión al ' + yearToDisplay.toString(),
        name: 'Inversion del ' + this.fechaInicioA + ' al ' + this.fechaFinA,
        type: 'bar',
        data: data.map((item) => item.inversion_total),
        color: '#DAF7A6'
      }, {
        name: 'Inversión meta al 2025',
        type: 'bar',
        data: data.map((item) => item.Inversion_meta_2025),
        color: '#3cb371'
      }]
    });
  }

  createChartInversionDesagregadaLE(data: any[]) {

    Highcharts.chart('chart-container-inversion-LE-desagregada', {
      chart: {
        type: 'bar',
        height: 550,
      },
      title: {
        text: 'Inversión desagregada por Linea Estratégica del ' + this.fechaInicioA + ' al ' + this.fechaFinA,
        align: 'left',
        style: {
          color: '#5D6D7E',
          padding: '10px'
        }
      },
      exporting: {
        enabled: true
      },
      lang: {
        viewFullscreen: 'Ver en pantalla completa',
        exitFullscreen: 'Cerrar pantalla completa',
        printChart: 'Imprimir gráfico',
        downloadPNG: 'Descargar como PNG',
        downloadJPEG: 'Descargar como JPEG',
        downloadPDF: 'Descargar como PDF',
        downloadSVG: 'Descargar como SVG',
        downloadCSV: 'Descargar como CSV',
        downloadXLS: 'Descargar como XLS',
        hideData: 'Ocultar tabla de datos',
        viewData: 'Ver tabla de datos',

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
          text: '(Bs.)',
          align: 'high'
        },
        labels: {
          overflow: 'justify'
        },
        gridLineWidth: 0
      },
      tooltip: {
        valueSuffix: ' Bs.'
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
        data: data.map((item) => item.Tarija),
        color: '#D568FB'
      }, {
        name: 'San Lorenzo',
        type: 'bar',
        data: data.map((item) => item.SanLorenzo),
        color: '#127293'
      }, {
        name: 'Padcaya',
        type: 'bar',
        data: data.map((item) => item.Padcaya),
        color: '#3cb371'
      }, {
        name: 'Uriondo',
        type: 'bar',
        data: data.map((item) => item.Uriondo),
        color: '#8EEAD5'
      }]
    });
  }
}

