import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
//servicio
import { ProyectoService } from 'src/app/services/proyecto.service';

import { SnackbarService } from 'src/app/services/snackbar.service';
//globales constants
import { GlobalCostants } from 'src/app/shared/global-constants';
//dialogProyecto
import { ProyectoComponent } from "../dialog/proyecto/proyecto.component";
//confirmation
import { ConfirmationComponent } from "../dialog/confirmation/confirmation.component";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MunicipioService } from 'src/app/services/municipio.service';
import { SeguimientoProyectoComponent } from '../dialog/seguimiento-proyecto/seguimiento-proyecto.component';
import { ArchivosProyectoComponent } from '../dialog/archivos-proyecto/archivos-proyecto.component';
//dialogCambio user
import { CambioUsuarioProyectoComponent } from "../dialog/cambio-usuario-proyecto/cambio-usuario-proyecto.component";


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
import { CategoriaComponent } from '../dialog/categoria/categoria.component';
import { CategoriaService } from 'src/app/services/categoria.service';
import { MatSelect } from '@angular/material/select';
import { ComunidadService } from 'src/app/services/comunidad.service';
import { UnidadMedicionService } from 'src/app/services/unidad-medicion.service';

@Component({
  selector: 'app-manage-proyecto',
  templateUrl: './manage-proyecto.component.html',
  styleUrls: ['./manage-proyecto.component.scss'],
  // standalone: true,
  //imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule],
})
export class ManageProyectoComponent {
  displayedColumns: string[] = ['Nro', 'NombreProyecto', 'FechaInicio', 'FechaFin', 'NombreMunicipio', 'UltimaEtapa', 'NombreCategoria', 'NombreTipologia', 'documento', 'seguimiento', 'Acciones'];
  dataSource: any;
  responseMessage: any;
  proyecto: any;
  municipios: any = [];
  categoria: any = [];
  openSeguimientosProyecto = false; //ABRIR LOS SEGUIMIENTOS DE ETAPAS DE PROYECTO
  apiResponse: any = []; //para filtrar con el select
  estadoP: any;
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
  ci: any;
  tabla: any;
  logoDataUrl: string;
  infoFiltrada: any;
  pipe = new DatePipe('en-US');
  /*
    @ViewChild('input') input: HTMLInputElement;
    @ViewChild('municipioSelect') municipioSelect: MatSelect;
    @ViewChild('categoriaSelect') categoriaSelect: MatSelect;
    */
  searchFilter: string = '';
  municipioFilter: string = '';
  categoriaFilter: string = '';
  fechaInicio:Date;
  fechaFin:Date;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;

  constructor(
    private ProyectoServices: ProyectoService,
    private MunicipioService: MunicipioService,
    private CategoriaService: CategoriaService,
    private comunidadService: ComunidadService,
    private unidadesMedService:UnidadMedicionService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router
  ) { }



  ngOnInit(): void {
    const ciString = localStorage.getItem('ci');
    this.ci = ciString ? (ciString) : null;
    ////console.log(this.ci);
    /*  this.tableData();
     this.getMunicipio(); */

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
    // //console.log(this.rol);
    //------------------------------------
    this.getComunidades();
    this.getUnidades();

    ////console.log("url: " + this.fileURL);
    if (this.rol === 'Operador') {
      this.tableData2(this.ci);
      this.getMunicipio();
      this.getCategoria();
    } else {
      ////console.log(this.rol);
      this.tableData();
      this.getMunicipio();
      this.getCategoria();
    }

  }


  tableData() {
    this.ProyectoServices.getProyecto().subscribe((response: any) => {
      this.tabla = response;
      ////console.log(response);
      this.estadoP = response[0].estado;
      ////console.log(this.estadoP);
      this.dataSource = new MatTableDataSource(response);
      // this.dataSource =response;
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

  //tabla2 para usuario
  tableData2(ci: string) {
    this.ProyectoServices.getProyecto2(ci).subscribe((response: any) => {
      this.tabla = response;
      //console.log(response);
      this.estadoP = response[0].estado;
      //console.log(this.estadoP);
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
    //console.log(this.dataSource.filteredData);
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
    //console.log(this.dataSource.filteredData);
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
    //console.log(this.dataSource.filteredData);
    this.infoFiltrada = this.dataSource.filteredData;
    this.tabla = this.infoFiltrada;
    //pdf
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  validarFechas() {
    if(this.fechaInicio && this.fechaFin){
      // this.dataSource.filter={fechaInicioTime:this.fechaInicio.getTime(),fechaFinTime:this.fechaFin.getTime()}
      // this.dataSource.filterPredicate = (data: any, filter: any) =>
      // data.fecha_inicio.getTime()>=filter.fechaInicioTime && data.fecha_inicio.getTime()<=filter.fechaFinTime;
      // if (this.municipioFilter.length>0) {
      //   this.applyMunicipioFilter(this.municipioFilter);
      // } else if (this.categoriaFilter.length>0) {
      //   this.applyCategoriaFilter(this.categoriaFilter);
      // }
      // this.infoFiltrada = this.dataSource.filteredData;
      // this.tabla = this.infoFiltrada;
      // //pdf
      // if (this.dataSource.paginator) {
      //   this.dataSource.paginator.firstPage();
      // }
    }
  }

  /*applyFilter(event: any) {
    const filterValue = (event.target.value as string).trim().toLowerCase();
    this.searchFilter = filterValue;
    this.applyCombinedFilters();
  }

  applyMunicipioFilter(filterValue: string) {
    this.municipioFilter = filterValue;
    this.applyCombinedFilters();
  }

  applyCategoriaFilter(filterValue: string) {
    this.categoriaFilter = filterValue;
    this.applyCombinedFilters();
  }

  applyCombinedFilters() {
    // Aplica los filtros de manera acumulativa
    this.dataSource.filterPredicate = (data: any) => {
      const searchMatch = !this.searchFilter || data.nombre.includes(this.searchFilter);
      const municipioMatch = !this.municipioFilter || data.nombre_municipio.includes(this.municipioFilter);
      const categoriaMatch = !this.categoriaFilter || data.nom_categoria.includes(this.categoriaFilter);

      return searchMatch && municipioMatch && categoriaMatch;
    };

    this.dataSource.filter = 'triggerFilter'; // Cambia esto para forzar la recarga del filtro
  }

  clearFilters() {
    this.searchFilter = '';
    this.municipioFilter = '';
    this.categoriaFilter = '';
    this.input.value = '';
    this.municipioSelect.value = '';
    this.categoriaSelect.value = '';
    this.applyCombinedFilters();
  }*/

  /*applyFilter(event: Event) {
     const filterValue = (event.target as HTMLInputElement).value;
     this.dataSource.filter = filterValue.trim().toLowerCase();
     this.applyCombinedFilters();
 }
 
 applyMunicipioFilter(filterValue: String) {
     filterValue = filterValue.trim().toLowerCase();
     this.filterData('nombre_municipio', filterValue);
     this.applyCombinedFilters();
 }
 
 applyCategoriaFilter(filterValue: String) {
     filterValue = filterValue.trim().toLowerCase();
     this.filterData('nom_categoria', filterValue);
     this.applyCombinedFilters();
 }
 
 filterData(column: string, value: String) {
     this.dataSource.filterPredicate = (data: any, filter: string) =>
         data[column].trim().toLowerCase().includes(filter);
     this.dataSource.filter = value;
 }
 
 applyCombinedFilters() {
     // Aquí puedes agregar lógica adicional para combinar los filtros si es necesario.
     // Por ejemplo, si deseas que los filtros de municipio y categoría se apliquen en conjunto.
 }
 
 */

  /*applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyMunicipioFilter(filterValue: String) {
    filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: any, filter: string) => data.nombre_municipio.trim().toLowerCase() === filter;
    this.dataSource.filter = filterValue;
  }

  applyCategoriaFilter(filterValue: String) {
    filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: any, filter: string) => data.nom_categoria.trim().toLowerCase() === filter;
    this.dataSource.filter = filterValue;
  }*/



  handleAddAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Add'
    }
    dialogConfig.width = "700px";
    const dialogRef = this.dialog.open(ProyectoComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddProyecto.subscribe((response) => {
      this.tableData();
    })
  }

  //------------ LLAMA AL MODAL PARA EDITAR
  handleEditAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      data: values
    }
    //console.log(values);
    dialogConfig.width = "700px";
    const dialogRef = this.dialog.open(ProyectoComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onEditProyecto.subscribe((response) => {
      this.tableData();
    })
  }

  //------------ LLAMA AL MODAL PARA EL SEGUIMIENTO DE PROYECTO
  handleSeguimientoAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'seguimiento',
      data: values
    }
    //console.log(values);
    dialogConfig.width = "820px";
    const dialogRef = this.dialog.open(SeguimientoProyectoComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddSeguimiento.subscribe((response) => {
      this.tableData();
    })
  }

  handleDeleteAction(values: any) {
    //console.log(values);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: ' eliminar proyecto ' + values.nom_proyecto
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
      this.deleteProyecto(values.id_proyecto);
      dialogRef.close();
    });
  }

  deleteProyecto(id_proyecto: any) {
    this.ProyectoServices.delete(id_proyecto).subscribe((response: any) => {
      this.tableData();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBar(this.responseMessage, "success");
    }, (error: any) => {
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalCostants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalCostants.error);
    })
  }

  onChange(status: any, id_proyecto: any) {

    var data = {
      estado: status.toString(),
      id_proyecto: id_proyecto
    }

    this.ProyectoServices.updateStatus(data).subscribe((response: any) => {
      this.tableData();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBar(this.responseMessage, "success");
    }, (error: any) => {
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalCostants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalCostants.error);
    })
  }

  openEtapasProyecto(proyecto: any) {
    this.proyecto = proyecto;
    //console.log(proyecto);
    // //console.log(this.openSeguimientosProyecto);
    if (this.openSeguimientosProyecto) {
      this.openSeguimientosProyecto = false;
      // this.openSeguimientosProyecto=true;
    } else {
      this.openSeguimientosProyecto = true;
    }
  }
  //excel
  generateExcel() {
    //zona
    // Definir proyecciones
    proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs");
    proj4.defs("EPSG:32720", "+proj=utm +zone=20 +south +datum=WGS84 +units=m +no_defs");// Puedes cambiar el número de zona según tu ubicación


    const fechaActual = new Date();
    const añoActual = fechaActual.getFullYear();
    //array para los datos que imprime  
    const tableBody = [];

    for (let i = 0; i < this.tabla.length; i++) {
      const person = this.tabla[i];
      // Coordenadas geográficas (latitud y longitud)
      const latitud = parseFloat(person.coordenada_y); // Por ejemplo, París
      const longitud = parseFloat(person.coordenada_x);

      const coordenadasUTM = proj4("EPSG:4326", "EPSG:32720", [latitud, longitud]);

      // coordenadasUTM es un array con [Este, Norte]
      const este = coordenadasUTM[0];
      const norte = coordenadasUTM[1];
      ////console.log(este,norte);
      tableBody.push([i + 1, person.linea_estrategica, i + 1, person.linea_de_accion, person.nom_proyecto, 'Tarija', person.nombre_municipio, '20S', este, norte, añoActual, person.ultima_etapa, person.fuentes_financiamiento]);
    }

    // Crear una hoja de cálculo de Excel
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([]);

    // Establecer estilos para aparentar centrado
    ws['A1'] = { t: 's', v: 'Título de la tabla', s: { font: { bold: true }, alignment: { horizontal: 'center' } } };
    // Combinar las celdas para el título
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 12 } }];
    const headers = ['Nº', 'Lineamientos Estrategicos', 'Nº', 'Linea de accion', 'Accion Especifica', 'Departamento', 'Municipio', 'Zona', 'Este', 'Norte', 'Gestion', 'Estado', 'Fuente de financiamiento'];
    // Agregar los encabezados de columna en la segunda fila      
    XLSX.utils.sheet_add_aoa(ws, [headers], { origin: 'A2' });
    // Agregar los datos de tableBody a la hoja de cálculo
    XLSX.utils.sheet_add_aoa(ws, tableBody, { origin: 'A3' });

    // Crear un libro de Excel
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Datos'); // Asignar la hoja de cálculo al libro
    XLSX.writeFile(wb, 'information.xlsx');

  }
//------------------- OBTENEMOS COMUNIDAD
  private _comunidades:any[] =[];
  private _unidades:any[]= [];
  getComunidades() {
    this.comunidadService.getComunidades().subscribe((response: any) => {
      this._comunidades = response;

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
  
  //------------------- OBTENEMOS UNIDAD
  getUnidades() {
    this.unidadesMedService.getUnidad().subscribe((response: any) => {
      this._unidades = response;
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

  exportToExcel() {
    const fechaActual = new Date();
    const añoActual = fechaActual.getFullYear();

    const dataForExcel = this.dataSource.filteredData.map(item => {
      // Definir proyecciones
      proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs");
      proj4.defs("EPSG:32720", "+proj=utm +zone=20 +south +datum=WGS84 +units=m +no_defs");
      // Coordenadas geográficas (latitud y longitud)
      const latitud = parseFloat(item.coordenada_y);
      const longitud = parseFloat(item.coordenada_x);

      const coordenadasUTM = proj4("EPSG:4326", "EPSG:32720", [latitud, longitud]);

      const comunidadesProyecto = this._comunidades.filter(comu=>item['comunidades'].includes(comu.id));
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
        "CIUDAD/COMUNIDAD": comunidadesProyecto.map(com=>com.nombre).toString(),
        "ÁREA": item["area"],
        "COORDENADA X DEC.": item["coordenada_x"],
        "COORDENADA Y DEC.": item["coordenada_y"],
        "ZONA": '20S',
        "ESTE - UTM": este,
        "NORTE - UTM": norte,
        "FUENTES FINANCIAMIENTO": item["fuentes_financiamiento"],
        "TOTAL HAB.": item["alcances"][0].cantidad,
        "MUJERES": item["alcances"][0].mujeres,
        "HOMBRES": item["alcances"][0].hombres,
        "LÍNEA DE ACCIÓN": item["linea_de_accion"],
        "LÍNEA ESTRATÉGICA": item["linea_estrategica"],
        "ACCIÓN ESTRATÉGICA": item["accion_estrategica"],
        "INDICADOR": item["nombre_indicador"],
        "ALCANCE PROYECTO": item["alcances"].length>1?item['alcances'][1].cantidad:item["alcances"][0].cantidad,
        "UNIDAD MEDICION": item['alcances'].length>1?this._unidades.find(und=>und.id_unidad_medicion===item["alcances"][1].id_unidad_medicion).nom_unidad:this._unidades.find(und=>und.id_unidad_medicion===item["alcances"][0].id_unidad_medicion).nom_unidad,
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
    // ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 23 } }];
    // ws['A1'] = { t: 's', v: 'TABLA DE DATOS DE PROYECTOS', s: titleCellStyle };

    // Agregar los datos a la hoja de cálculo
    XLSX.utils.sheet_add_json(ws, dataForExcel, { origin: 'A1' });

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
      { wch: 50 }, // Linea de accion
      { wch: 50 }, // linea estrategica
      { wch: 50 }, // accion estrategica
      { wch: 50 }, // Indicador
      { wch: 20 }, // Alcance de proyecto
      { wch: 20 }, // Unidad de medicion
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
              /*  image: this.logoDataUrl, width: 40,
               height: 40, margin: [5, 5] */
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
        'Datos de Proyectos\n\n',
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







  //cambio de usuario proyecto

  //------------ LLAMA AL MODAL PARA EDITAR
  handleEditActionUserProyecto(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Change',
      data: values
    }
    //console.log(values);
    dialogConfig.width = "700px";
    const dialogRef = this.dialog.open(CambioUsuarioProyectoComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();

    });
    const sub = dialogRef.componentInstance.onEditUserProyect.subscribe((response) => {
      this.tableData();
    })
  }




  //------------ LLAMA AL MODAL PARA ELañadirdocumentos
  handleAddDoc(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Documentos',
      data: values
    }
    //console.log(values);
    dialogConfig.width = "820px";
    const dialogRef = this.dialog.open(ArchivosProyectoComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddDocProyect.subscribe((response) => {
      this.tableData();
    })
  }
 

}





