import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { IndicadorService } from 'src/app/services/indicador.service';
import { IndicadorComponent } from '../dialog/indicador/indicador.component';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { error } from 'highcharts';
import { GlobalCostants } from 'src/app/shared/global-constants';
import { SnackbarService } from 'src/app/services/snackbar.service';


//pdf importaciones
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { image } from 'html2canvas/dist/types/css/types/image';
import { Utils } from 'src/app/services/utils';
import { DatePipe } from '@angular/common';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-manage-indicador',
  templateUrl: './manage-indicador.component.html',
  styleUrls: ['./manage-indicador.component.scss']
})
export class ManageIndicadorComponent {
  //variables
  displayedColumns: string[] = ['Numero', 'NombreIndicador', 'DescripcionIndicador', 'NombreUnidad', 'acciones'];
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
    private IndicadorService: IndicadorService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router) { }

  ngOnInit(): void{
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

  tableData(){
    this.IndicadorService.getIndicador().subscribe((response: any)=>{
      this.tabla=response;
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, (error:any)=>{
      if(error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalCostants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalCostants.error);
    })

       //llamar a logo y convertilo
       Utils.getImageDataUrlFromLocalPath1('../../../assets/img/logo_sihita.png').then(
        result => this.logoDataUrl = result
      )
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
    if (this.dataSource.paginator){
      this.dataSource.paginator.firstPage();
    }
  }
  
  handleEditAction(values: any){
    //console.log(values);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      data: values
    }

    dialogConfig.width = "700px";
    const dialogRef = this.dialog.open(IndicadorComponent, dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close;
    });

    const sub = dialogRef.componentInstance.onEditIndicador.subscribe((response)=>{
      this.tableData();
    }); 
  }

  onChange(status: any, id_indicador: any){
    var data = {
      estado: status.toString(),
      id_indicador: id_indicador
    }
    //console.log(data);
    this.IndicadorService.updateStatus(data).subscribe((response:any)=>{
      this.tableData();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBar(this.responseMessage, "succcess");
    }, (error: any) =>{
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }
      else{
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
      tableBody.push([person.nombre_indicador, person.desc_indicador,person.nom_unidad, person.estado]);
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
                      widths: ['*','*','*','*'],
                      body: [
                        ['Nombre','Descripcion','Unidad','Estado'],
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
