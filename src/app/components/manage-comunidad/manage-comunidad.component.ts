import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { error } from 'highcharts';
import { ComunidadService } from 'src/app/services/comunidad.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalCostants } from 'src/app/shared/global-constants';
import { ComunidadComponent } from '../dialog/comunidad/comunidad.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';

//pdf importaciones
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { image } from 'html2canvas/dist/types/css/types/image';
import { Utils } from 'src/app/services/utils';
import { DatePipe } from '@angular/common';
import { MunicipioService } from 'src/app/services/municipio.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-manage-comunidad',
  templateUrl: './manage-comunidad.component.html',
  styleUrls: ['./manage-comunidad.component.scss']
})
export class ManageComunidadComponent {
  dataSource: any;
  displayedColumns: string[] = ['numero', 'nombre', 'municipio', 'acciones'];
  responseMessage: any;
  municipio: any;
  dialogData: any;


   //variables para pdf
   usuario: any;
   ap:any;
   am:any;
   tabla:any;
   logoDataUrl: string;
   infoFiltrada:any;
   pipe = new DatePipe('en-US');


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  
  

  constructor(private comunidadService: ComunidadService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router){}

ngOnInit(): void {
  this.tableData();
  //para usuario de pdf    
  const nombreString = localStorage.getItem('nombre');
  const ApString = localStorage.getItem('ap_paterno');
  const AmString = localStorage.getItem('ap_materno');
  this.usuario = nombreString? (nombreString): null;
  this.ap = ApString ? (ApString ): null;
  this.am = AmString? (AmString): null;
  //------------------------------------
}
  tableData() {
    this.comunidadService.GetComunidades().subscribe((response:any) =>{
      this.tabla=response;
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, (error: any) => {
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalCostants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalCostants.error);
    })
     //llamar a logo y convertilo
   /* Utils.getImageDataUrlFromLocalPath1('../../../assets/img/logo_sihita.png').then(
    result => this.logoDataUrl = result
    )*/
  }


  //---------------------------------Fitrador----------------------------------------------------
  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    //pdf
    //dar valor a variables para su impresion
    //console.log(this.dataSource.filteredData);   
    this.infoFiltrada=this.dataSource.filteredData;
    this.tabla=this.infoFiltrada;
    //pdf
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
  onChange(status: any, id_comunidad: any) {
    var data = {
      estado: status.toString(),
      id_comunidad: id_comunidad
    }
    this.comunidadService.updateStatus(data).subscribe((response: any) => {
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
  
  handleEditAction(values: any) {
    //console.log(values);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      data: values
    }
    dialogConfig.width = "700px";
    const dialogRef = this.dialog.open(ComunidadComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onEditComunidad.subscribe((response) => {
      this.tableData();
    })
  }

  handleDeleteAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: ' eliminar Comunidad '+ values.nombre
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
      this.deleteComunidad(values.id);
      dialogRef.close();
    });
  }

  deleteComunidad(id: any) {
    this.comunidadService.delete(id).subscribe((response: any) => {
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
  
  handleAddAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Add'
    }
    dialogConfig.width = "700px";
    const dialogRef = this.dialog.open(ComunidadComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddComunidad.subscribe((response) => {
      this.tableData();
    })
  }

generateReport() {
  const currentDate = this.pipe.transform(Date.now(), 'M/d/yy, h:mm a');
  const usuario = this.usuario; 
  const ap = this.ap; 
  const am = this.am; 
  //array para los datos que imprime  
  const tableBody = [];
  for (let i = 0; i < this.tabla.length; i++) {
    const person = this.tabla[i];
    tableBody.push([person.nombre, person.nombre_municipio, person.estado]);
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
          {
            image: this.logoDataUrl,  width: 40,
            height: 40 ,   margin: [5, 5] },
          { 
            text: `Fecha: ${currentDate}`, alignment: 'right', margin: [0, 20, 10, 10],  //0 , Y
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
           'Datos de Comunidad\n\n',              
          {
            table: {
            headerRows: 1,
            widths: ['*','*','*'],
            body: [
            ['Nombre', 'Municipio' ,'Estado'],
            ...tableBody
          ]
        },
        fontSize: 8,
        italics: true
      },          
    ]
  };
  pdfMake.createPdf(documentDefinition).open();
}

}
