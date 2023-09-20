import { Component, EventEmitter, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SnackbarService } from 'src/app/services/snackbar.service';

import {  ProyectoService} from 'src/app/services/proyecto.service';
import { GlobalCostants } from 'src/app/shared/global-constants';
import { ArchivosComponent } from '../archivos/archivos.component';
import { Router } from '@angular/router';
import { ConfirmationComponent } from '../confirmation/confirmation.component';

@Component({
  selector: 'app-archivos-proyecto',
  templateUrl: './archivos-proyecto.component.html',
  styleUrls: ['./archivos-proyecto.component.scss']
})
export class ArchivosProyectoComponent {
  onAddDocProyect = new EventEmitter();
  onEditDocProyect = new EventEmitter();
  DocProyectForm: any = FormGroup;
  dialogAction: any = "Add";
  action: any = "Registrar";
  responseMessage: any;

  //varibles
  user: any = [];
  displayedColumns: string[] = ['numero', 'Nombre', 'Descripcion','Accion']; 
  dataSource: any;
  entidad: any;
 
  //variables para pdf
  usu: any;
  entidadN: any;
  ap:any;
  am:any;
  estado:any;
  tabla:any;
  logoDataUrl: string;
  infoFiltrada:any;

  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
  private formBuilder: FormBuilder,
  private users: ProyectoService,
  private dialogRef:MatDialogRef<ArchivosProyectoComponent>,
  private router: Router,
  private dialog: MatDialog,
  private snackbarService: SnackbarService
) {}

ngOnInit():void{

  this.DocProyectForm = this.formBuilder.group({
    // Define aquí tus otros campos del formulario si los tienes
    // ...
    opcionRadio: [null, [Validators.required]]
  });

  console.log(this.dialogData.data.id_proyecto);
  this.tableData();
  if (this.dialogData.action === 'Edit') {
    this.dialogAction = "Edit";
    this.action = "Actualizar";      
    this.DocProyectForm.patchValue(this.dialogData.data);
    console.log(this.dialogData.data);
    
  }

}


//---------------------------------Fitrador----------------------------------------------------
applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
  //dar valor a variables para su impresion
  console.log(this.dataSource.filteredData);   
  this.infoFiltrada=this.dataSource.filteredData;
  this.tabla=this.infoFiltrada;
  if (this.dataSource.paginator) {   
    this.dataSource.paginator.firstPage();
  }
}

    tableData() {
      this.users.getDoc(this.dialogData.data.id_proyecto).subscribe((response: any) => {
        console.log(response);    
        this.usu=response;
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
      
    }

    handleDeleteAction(values: any) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        message: ' eliminar Documento ' + values.nombre_documento
      };
      const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
      const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
        this.deleteDocumento(values.id_documento,values.nombre_documento);
        dialogRef.close();
      });
    }

    deleteDocumento(id_proyecto: any,nombre_documento:any) {
      console.log(id_proyecto,nombre_documento);
       this.users.delete2(id_proyecto,nombre_documento).subscribe((response: any) => {
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


handleAddAction(){
  const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Documentos',
      data: this.dialogData.data.id_proyecto
    }
    console.log(this.dialogData.data.id_proyecto);
    dialogConfig.width = "820px";
    const dialogRef = this.dialog.open(ArchivosComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddArchivos.subscribe((response) => {
      this.tableData();
    })
}

}
