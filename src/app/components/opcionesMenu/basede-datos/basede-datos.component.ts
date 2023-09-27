import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
//servicio
import { ProyectoService } from 'src/app/services/proyecto.service';

import { SnackbarService } from 'src/app/services/snackbar.service';
//globales constants
import { GlobalCostants } from 'src/app/shared/global-constants';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MunicipioService } from 'src/app/services/municipio.service';


import { ArchivosProyectoComponent } from '../../dialog/archivos-proyecto/archivos-proyecto.component';



//pdf importaciones
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { image } from 'html2canvas/dist/types/css/types/image';
import { Utils } from 'src/app/services/utils';
import { DatePipe } from '@angular/common';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
//excel imports
import * as XLSX from 'xlsx';
import { environment } from 'src/environments/environment';


//convertir los coordenadas
import proj4 from 'proj4';
import { CategoriaService } from 'src/app/services/categoria.service';


@Component({
  selector: 'app-basede-datos',
  templateUrl: './basede-datos.component.html',
  styleUrls: ['./basede-datos.component.scss']
})
export class BasedeDatosComponent {
  displayedColumns: string[] = ['Nro', 'NombreProyecto', 'FechaInicio', 'FechaFin', 'NombreMunicipio', 'UltimaEtapa', 'NombreCategoria', 'NombreTipologia', 'documento'];
  dataSource: any;
  responseMessage: any;
  proyecto: any;
  municipios: any = [];
  categoria: any = [];
  openSeguimientosProyecto = false; //ABRIR LOS SEGUIMIENTOS DE ETAPAS DE PROYECTO
  apiResponse: any = []; //para filtrar con el select

  //----url del servidor backend
  url = environment.apiUrl;
  //----creamos la url para las imagenes
  fileURL = this.url + '/uploads/documents/';


  //variables para pdf
  usuario: any;
  entidadN: any;
  ap: any;
  am: any;
  estado: any;
  rol: any;
  tabla: any;
  logoDataUrl: string;
  infoFiltrada: any;
  pipe = new DatePipe('en-US');
  searchFilter: string = '';
  municipioFilter: string = '';
  categoriaFilter: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;

  constructor(
    private ProyectoServices: ProyectoService,
    private MunicipioService: MunicipioService,
    private CategoriaService:CategoriaService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router
  ) { }



  ngOnInit(): void {


    this.tableData();
    this.getMunicipio();
    this.getCategoria();

    console.log("url: " + this.fileURL);
    //para usaurio de pdf    
    const nombreString = localStorage.getItem('nombre');
    const entidadString = localStorage.getItem('entidad');
    const ApString = localStorage.getItem('ap_paterno');
    const AmString = localStorage.getItem('ap_materno');
    const estadoString = localStorage.getItem('estado');
    const rolString = localStorage.getItem('rol');
    this.usuario = nombreString ? (nombreString) : null;
    this.entidadN = entidadString ? (entidadString) : null;
    this.ap = ApString ? (ApString) : null;
    this.am = AmString ? (AmString) : null;
    this.estado = estadoString ? (estadoString) : null;
    this.rol = rolString ? (rolString) : null;
    console.log(this.rol);
    //------------------------------------
  }


  tableData() {
    this.ProyectoServices.getProyecto().subscribe((response: any) => {
      this.tabla = response;
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, (error: any) => {
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalCostants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalCostants.error);
    })

    //llamar a logo y convertilo
    Utils.getImageDataUrlFromLocalPath1('../../../assets/img/logo_sihita.png').then(
      result => this.logoDataUrl = result
    )
  }

  //------------------- OBTENEMOS MUNICIPIO
  getMunicipio() {
    this.MunicipioService.getMunicipio().subscribe((response: any) => {
      this.municipios = response;
    }, (error: any) => {
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalCostants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalCostants.error);

    });
  }

    //------------------- OBTENEMOS CATEGORIA
    getCategoria() {
      this.CategoriaService.getCategoria().subscribe((response: any) => {
        this.categoria = response;
      }, (error: any) => {
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        }
        else {
          this.responseMessage = GlobalCostants.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage, GlobalCostants.error);
  
      });
    }

  //---------------------------------Fitrador----------------------------------------------------


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    //pdf
    //dar valor a variables para su impresion
    console.log(this.dataSource.filteredData);
    this.infoFiltrada = this.dataSource.filteredData;
    this.tabla = this.infoFiltrada;
    //pdf
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  applyMunicipioFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: any, filter: string) =>
      data.nombre_municipio.trim().toLowerCase().includes(filter);

    // Aplicar el filtro de municipio
    this.dataSource.filter = filterValue;

    // Si también hay un filtro de categoría activo, aplicar el filtro de categoría
    if (this.categoriaFilter) {
      this.applyCategoriaFilter(this.categoriaFilter);
    }
    //pdf
    //dar valor a variables para su impresion
    console.log(this.dataSource.filteredData);
    this.infoFiltrada = this.dataSource.filteredData;
    this.tabla = this.infoFiltrada;
    //pdf
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyCategoriaFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase();
    this.categoriaFilter = filterValue; // Almacenar el valor del filtro de categoría

    // Si hay un filtro de municipio activo, aplicar el filtro de municipio primero
    if (this.municipioFilter) {
      this.applyMunicipioFilter(this.municipioFilter);
    } else {
      // Si no hay filtro de municipio activo, aplicar solo el filtro de categoría
      this.dataSource.filterPredicate = (data: any, filter: string) =>
        data.nom_categoria.trim().toLowerCase().includes(filter);
      this.dataSource.filter = filterValue;
    }

    //pdf
    //dar valor a variables para su impresion
    console.log(this.dataSource.filteredData);
    this.infoFiltrada = this.dataSource.filteredData;
    this.tabla = this.infoFiltrada;
    //pdf
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



  openEtapasProyecto(proyecto: any) {
    this.proyecto = proyecto;
    console.log(proyecto);
    // console.log(this.openSeguimientosProyecto);
    if (this.openSeguimientosProyecto) {
      this.openSeguimientosProyecto = false;
      // this.openSeguimientosProyecto=true;
    } else {
      this.openSeguimientosProyecto = true;
    }
  }
  //excel
  exportToExcel() {
    const fechaActual = new Date();
    const añoActual = fechaActual.getFullYear();

    console.log(this.dataSource.data);

    const dataForExcel = this.dataSource.filteredData.map(item => {
      // Definir proyecciones
      proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs");
      proj4.defs("EPSG:32720", "+proj=utm +zone=20 +south +datum=WGS84 +units=m +no_defs");
      // Coordenadas geográficas (latitud y longitud)
      const latitud = parseFloat(item.coordenada_y);
      const longitud = parseFloat(item.coordenada_x);

      const coordenadasUTM = proj4("EPSG:4326", "EPSG:32720", [latitud, longitud]);

      // coordenadasUTM es un array con [Este, Norte]
      const este = coordenadasUTM[0];
      const norte = coordenadasUTM[1];
      return {
        "ENTIDAD EJECUTORA": item["entidad_ejecutora"],
        "PROYECTO/ACCIÓN": item["nom_proyecto"],
        "TIPOLOGÍA": item["nom_tipologia"],
        "CATEGORÍA": item["nom_categoria"],
        "ETAPA": item["ultima_etapa"],
        "FECHA INICIO": item["fecha_inicio_convert"],
        "FECHA FINAL": item["fecha_fin_convert"],
        "AÑO DE EV.": añoActual,
        "DEPARTAMENTO": 'TARIJA',
        "MUNICIPIO": item["nombre_municipio"],
        "CIUDAD/COMUNIDAD": item["nombre_comunidades"],
        "ÁREA": item["area"],
        "COORDENADA X DEC.": item["coordenada_x"],
        "COORDENADA Y DEC.": item["coordenada_y"],
        "ZONA": '20S',
        "ESTE - UTM": este,
        "NORTE - UTM": norte,
        "FUENTES FINANCIAMIENTO": item["fuentes_financiamiento"],
        "TOTAL HAB.": item["cantidad"],
        "MUJERES": item["mujeres"],
        "HOMBRES": item["hombres"],
        "LÍNEA DE ACCIÓN": item["linea_de_accion"],
        "LÍNEA ESTRATÉGICA": item["linea_estrategica"],
        "ACCIÓN ESTRATÉGICA": item["accion_estrategica"],
        "INDICADOR": item["nombre_indicador"],
      };
    });

    // Crea un objeto de hoja de cálculo
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    const currentDate = this.pipe.transform(Date.now(), 'M/d/yy, h:mm a');

    // Establecer estilos para aparentar centrado y negrita para el título
    const titleCellStyle = {
      font: { bold: true },
      alignment: { horizontal: 'center' }
    };

    // Combinar las celdas para el título
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 23 } }];
    ws['A1'] = { t: 's', v: 'TABLA DE DATOS DE PROYECTOS', s: titleCellStyle };

    // Agregar los datos a la hoja de cálculo
    XLSX.utils.sheet_add_json(ws, dataForExcel, { origin: 'A2' });

    // Aplicar el estilo de negrita a las celdas de encabezado y ajustar el ancho de las columnas
    const headerCellStyle = {
      font: { bold: true },
      alignment: { horizontal: 'center', vertical: 'center' },
      border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } }
    };

    const columnWidths = [
      { wch: 18 }, // Ajusta el ancho de la primera columna
      { wch: 55 }, // Ajusta el ancho de la segunda columna
      { wch: 15 }, //tipologia
      { wch: 20 }, //categoria
      { wch: 20 }, //etapa
      { wch: 12 }, //fecha inicio
      { wch: 12 }, //fecha fin
      { wch: 12 }, //anio de evaluacion
      { wch: 15 }, // departamento
      { wch: 15 }, // municipio
      { wch: 40 }, // ciudad comunidad
      { wch: 15 }, // area
      { wch: 20 }, // coordenada x
      { wch: 20 }, // coordenada y
      { wch: 10 }, // zona
      { wch: 15 }, // este utm
      { wch: 15 }, // norte utm
      { wch: 27 }, // Fuente de financiamiento
      { wch: 15 }, // total hab
      { wch: 12 }, //mujeres 
      { wch: 12 }, // hombres
      { wch: 40 }, // Linea de accion
      { wch: 40 }, // linea estrategica
      { wch: 40 }, // accion estrategica
      { wch: 40 }, // Indicador
      // Agregar más ancho de columna según sea necesario
    ];

    // Aplicar el estilo de encabezado y ajustar el ancho de las columnas
    const headerKeys = Object.keys(ws).filter(key => key.startsWith('A1:'));
    headerKeys.forEach(key => {
      ws[key].s = headerCellStyle;
    });

    // Aplicar el ancho de las columnas
    ws['!cols'] = columnWidths;

    // Crear un libro de trabajo y agregar la hoja de cálculo
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1'); // 'Sheet1' es el nombre de la hoja de cálculo

    // Guardar el archivo Excel
    XLSX.writeFile(wb, 'reporte' + currentDate + '.xlsx');

    // Opcional: Puedes volver a renderizar la MatTable para actualizar la vista
    this.table.renderRows();
  }



  //pdf

  generateReport() {
    const currentDate = this.pipe.transform(Date.now(), 'M/d/yy, h:mm a');
    const usuario = this.usuario;
    const ap = this.ap;
    const am = this.am;
    //array para los datos que imprime  
    const tableBody = [];
    for (let i = 0; i < this.tabla.length; i++) {
      const person = this.tabla[i];
      tableBody.push([person.nom_proyecto, person.fecha_inicio_convert, person.fecha_fin_convert, person.nombre_municipio, person.nom_cuenca, person.nom_categoria, person.nom_tipologia]);
    }

    //inicio de la documentacion
    const documentDefinition = {
      pageSize: 'A4',
      //nuevo footer y header
      footer: function (currentPage, pageCount) {
        return {

          columns: [
            {
              text: `Impreso por: ${usuario + ' ' + ap + ' ' + am}`,
              alignment: 'left', margin: [40, 10],
              fontSize: 8, italics: true
            },
            {
              text: `pagina ` + currentPage.toString() + ' / ' + pageCount,
              alignment: 'right',
              margin: [20, 5],
              fontSize: 8
            },

          ]
        };
      },
      header: () => (
        {
          columns: [
            {
              image: this.logoDataUrl, width: 40,
              height: 40, margin: [5, 5]
            },
            {
              text: `Fecha: ${currentDate}`, alignment: 'right', margin: [0, 20, 10, 10],  //0 , Y
              fontSize: 8, italics: true
            }
          ]
        }

      ),

      //nuevo footer y header



      //margenes
      pageMargins: [40, 60, 40, 60],
      Times: {
        normal: 'Times-Roman',
      },
      //contenido tablas e informacion
      content: [
        'Datos de Indicadores\n\n',
        {

          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*', '*', '*', '*'],
            body: [
              ['Nombre_Proyecto', 'Fecha_inicio', 'Fecha_Fin', 'Municipio', 'Cuenca', 'Categoria', 'Topologia'],
              ...tableBody
            ]
          },
          fontSize: 8,
          italics: true

        },


      ]
      //margenes



      //footer pie de pagina
      /*  footer: function(currentPage, pageCount) {
         return {                
           text: currentPage.toString() + '/' + pageCount,
           alignment: 'right', // Align the pagination to the center
           margin: [10, 0] // Adjust margin as needed                
         };
       }, */
      /*  footer: () => ({
         columns: [
           { text: `Impreso por: ${this.usuario+' '+this.ap+' '+this.am}`, alignment: 'left', margin: [5, 5],  fontSize: 8,italics: true },
             
         ],
        
        
       }) */



    };

    pdfMake.createPdf(documentDefinition).open();
  }



  //--------------------parte de documentos menu---------------------------------
  handleAddDoc(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'principal',
      tipo: 'publico',
      data: values
    }
    console.log(values);
    dialogConfig.width = "820px";
    const dialogRef = this.dialog.open(ArchivosProyectoComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddDocProyect.subscribe((response) => {
      this.tableData();
    })
  }

  //--------------------parte de documentos menu---------------------------------


}

