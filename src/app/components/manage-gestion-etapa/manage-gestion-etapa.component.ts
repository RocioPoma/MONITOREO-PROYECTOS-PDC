import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';

import { EtapaService } from 'src/app/services/etapa.service';

import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalCostants } from 'src/app/shared/global-constants';

import { GestionEtapaComponent } from '../dialog/gestion-etapa/gestion-etapa.component';

import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

//pdf importaciones
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { image } from 'html2canvas/dist/types/css/types/image';
import { Utils } from 'src/app/services/utils';
import { DatePipe } from '@angular/common';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-manage-gestion-etapa',
  templateUrl: './manage-gestion-etapa.component.html',
  styleUrls: ['./manage-gestion-etapa.component.scss']
})
export class ManageGestionEtapaComponent {
  displayedColumns: string[] = ['numero', 'nombre', 'peso','descripcion','tipologia', 'acciones']; 
  dataSource: any;
  responseMessage: any;

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

  constructor(
    private etapaService: EtapaService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router) { }
 
  ngOnInit(): void {
    this.tableData();
      //para usaurio de pdf    
      const nombreString = localStorage.getItem('nombre');
      const ApString = localStorage.getItem('ap_paterno');
      const AmString = localStorage.getItem('ap_materno');
      this.usuario = nombreString? (nombreString): null;
      this.ap = ApString ? (ApString ): null;
      this.am = AmString? (AmString): null;
      //------------------------------------
  }

  tableData() {
    this.etapaService.getEtapa().subscribe((response: any) => {
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

 /*   //--------------------------------Paginador -------------------------------------
   ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }*/
  //---------------------------------Fitrador----------------------------------------------------
  applyFilter(event: Event) {
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

  handleEditAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      data: values
    }
    dialogConfig.width = "700px";
    const dialogRef = this.dialog.open(GestionEtapaComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onEditEtapa.subscribe((response) => {
      this.tableData();
    })
  }
 

  onChange(status: any, id_etapa: any) {
    var data = {
      estado: status.toString(),
      id_etapa: id_etapa
    }
    //console.log(data);
    this.etapaService.updateStatus(data).subscribe((response: any) => {
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
      tableBody.push([person.nombre_etapa, person.peso_etapa, person.descripcion_etapa,person.nom_tipologia,person.estado]);
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
             'Datos de Entidad \n\n',              
            {
              
                    table: {
                      headerRows: 1,
                      widths: ['*','*','*','*','*'],
                      body: [
                        ['Nombre','Peso','Descripcion','Tipologia','Estado'],
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
