import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
//servicio
import { ProyectoService } from 'src/app/services/proyecto.service';

import { SnackbarService } from 'src/app/services/snackbar.service';
//globales constants
import { GlobalCostants } from 'src/app/shared/global-constants';
//dialogMunicipio
import { ProyectoComponent } from "../dialog/proyecto/proyecto.component";
//confirmation
import { ConfirmationComponent } from "../dialog/confirmation/confirmation.component";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MunicipioService } from 'src/app/services/municipio.service';
import { SeguimientoProyectoComponent } from '../dialog/seguimiento-proyecto/seguimiento-proyecto.component';



//pdf importaciones
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { image } from 'html2canvas/dist/types/css/types/image';
import { Utils } from 'src/app/services/utils';
import { DatePipe } from '@angular/common';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
//excel imports
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-manage-proyecto',
  templateUrl: './manage-proyecto.component.html',
  styleUrls: ['./manage-proyecto.component.scss'],
  // standalone: true,
  //imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule],
})
export class ManageProyectoComponent {
  displayedColumns: string[] = ['Nro', 'NombreProyecto', 'FechaInicio', 'FechaFin', 'NombreMunicipio', 'NombreCuenca', 'NombreCategoria', 'NombreTipologia', 'documento', 'seguimiento', 'Acciones'];
  dataSource: any;
  responseMessage: any;
  proyecto:any;
  municipios: any = [];
  openSeguimientosProyecto=false; //ABRIR LOS SEGUIMIENTOS DE ETAPAS DE PROYECTO
  apiResponse: any = []; //para filtrar con el select


    //variables para pdf
    usuario: any;
    entidadN: any;
    ap:any;
    am:any;
    estado:any;
    tabla:any;
    logoDataUrl: string;
    infoFiltrada:any;
    pipe = new DatePipe('en-US');

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private ProyectoServices: ProyectoService,
    private MunicipioService: MunicipioService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router
  ) { }



  ngOnInit(): void {
    this.tableData();
    this.getMunicipio();


     //para usaurio de pdf    
     const nombreString = localStorage.getItem('nombre');
     const entidadString = localStorage.getItem('entidad');
     const ApString = localStorage.getItem('ap_paterno');
     const AmString = localStorage.getItem('ap_materno');
     const estadoString = localStorage.getItem('estado');
     this.usuario = nombreString? (nombreString): null;
     this.entidadN = entidadString? (entidadString): null;
     this.ap = ApString ? (ApString ): null;
     this.am = AmString? (AmString): null;
     this.estado = estadoString? (estadoString): null;
     //------------------------------------
  }


  tableData() {
    this.ProyectoServices.getProyecto().subscribe((response: any) => {
      this.tabla=response;
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

  //---------------------------------Fitrador----------------------------------------------------
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    //pdf
    //dar valor a variables para su impresion
    console.log(this.dataSource.filteredData);   
    this.infoFiltrada=this.dataSource.filteredData;
    this.tabla=this.infoFiltrada;
    //pdf
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyMunicipioFilter(filterValue: String) {
    filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: any, filter: string) => data.nombre_municipio.trim().toLowerCase() === filter;
    this.dataSource.filter = filterValue;
     //pdf
    //dar valor a variables para su impresion
    console.log(this.dataSource.filteredData);   
    this.infoFiltrada=this.dataSource.filteredData;
    this.tabla=this.infoFiltrada;
    //pdf
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  /*
  filterSelection($event: any) {
    let filterData = _.filtar(this.apiResponse, (item) => {
      return item.NombreMunicipio.toLowerCase() == $event.value.toLowerCase();
    })
    if ($event.value == 'Todos') {
      this.tableData();
    } else {
      this.dataSource = new MatTableDataSource(filterData);
    }
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
    console.log(values);
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
    console.log(values);
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
    console.log(values);
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

  openEtapasProyecto(proyecto:any){
    this.proyecto=proyecto;
    console.log(proyecto);
    // console.log(this.openSeguimientosProyecto);
    if(this.openSeguimientosProyecto){
      this.openSeguimientosProyecto=false;
      // this.openSeguimientosProyecto=true;
    }else{
      this.openSeguimientosProyecto= true;
    }
  }
  //excel
    generateExcel(){
       //array para los datos que imprime  
    const tableBody = [];
    for (let i = 0; i < this.tabla.length; i++) {
      const person = this.tabla[i];
      tableBody.push([person.nom_proyecto, person.fecha_inicio_convert,person.fecha_fin_convert, person.nombre_municipio, person.nom_cuenca,person.nom_categoria,person.nom_tipologia]);
    }
    

    // Crear una hoja de cálculo de Excel
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(tableBody);

    // Combinar las celdas para el título
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 12 } }];

  // Establecer estilos para aparentar centrado
  ws['A1'].s = { font: { sz: 18, bold: true }, alignment: { horizontal: 'center', vertical: 'center' } };


    // Crear un libro de Excel
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Datos'); // Asignar la hoja de cálculo al libro



      XLSX.writeFile(wb,'information.xlsx')
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
      tableBody.push([person.nom_proyecto, person.fecha_inicio_convert,person.fecha_fin_convert, person.nombre_municipio, person.nom_cuenca,person.nom_categoria,person.nom_tipologia]);
    }

  //inicio de la documentacion
    const documentDefinition = {
      pageSize: 'A4',
      //nuevo footer y header
      footer: function(currentPage, pageCount) {
        return {
          
          columns: [
            { 
                text: `Impreso por: ${usuario+' '+ap+' '+am}`, 
                alignment: 'left', margin: [40, 10],  
                fontSize: 8,italics: true }, 
            {
                text:`pagina `+ currentPage.toString() + ' / ' + pageCount,
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
            {  image: this.logoDataUrl,  width: 40,
              height: 40 ,   margin: [5, 5] },
            { text: `Fecha: ${currentDate}`, alignment: 'right', margin: [0, 20, 10, 10],  //0 , Y
            fontSize: 8, italics: true }
          ]  
        }         
        
        ),
     
      //nuevo footer y header

 

     //margenes
        pageMargins: [ 40, 60, 40, 60 ],
        Times: {
          normal: 'Times-Roman',           
        },
        //contenido tablas e informacion
          content: [              
             'Datos de Indicadores\n\n',              
            {
              
                    table: {
                      headerRows: 1,
                      widths: ['*','*','*','*','*','*','*'],
                      body: [
                        ['Nombre_Proyecto','Fecha_inicio','Fecha_Fin','Municipio','Cuenca','Categoria','Topologia'],
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

}





