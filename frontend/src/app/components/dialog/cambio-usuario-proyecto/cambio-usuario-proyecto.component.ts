import { Component, EventEmitter, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { GlobalCostants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-cambio-usuario-proyecto',
  templateUrl: './cambio-usuario-proyecto.component.html',
  styleUrls: ['./cambio-usuario-proyecto.component.scss']
})
export class CambioUsuarioProyectoComponent {
  onAddUserProyect = new EventEmitter();
  onEditUserProyect = new EventEmitter();
  UserProyectForm: any = FormGroup;
  dialogAction: any = "Add";
  action: any = "Registrar";
  responseMessage: any;

  //varibles
  user: any = [];
  displayedColumns: string[] = ['numero', 'Ci', 'Nombre', 'Rol', 'Entidad','Accion']; 
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
  private users: UsuarioService,
  private dialogRef:MatDialogRef<CambioUsuarioProyectoComponent>,
  private snackbarService: SnackbarService
) {}

  ngOnInit():void{

    this.UserProyectForm = this.formBuilder.group({
      // Define aquí tus otros campos del formulario si los tienes
      // ...
      opcionRadio: [null, [Validators.required]]
    });
  

    this.tableData();
    if (this.dialogData.action === 'Edit') {
      this.dialogAction = "Edit";
      this.action = "Actualizar";      
      this.UserProyectForm.patchValue(this.dialogData.data);
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
      this.users.getusuario().subscribe((response: any) => {
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



handleSubmit(){
  
  //console.log(this.UserProyectForm.value.opcionRadio.ci);
  //console.log(this.dialogData.data);

  var data ={
    id_proyecto:this.dialogData.data.id_proyecto,
    ci: this.UserProyectForm.value.opcionRadio.ci    
  }
  console.log(data);
  //aqui el servicio
  
  this.users.updateUser(data).subscribe((response:any)=>{
    this.dialogRef.close();
    //this.onEditUserProyect.emit();
    this.responseMessage = response.message;
    this.snackbarService.openSnackBar(this.responseMessage,"success");
  },(error:any)=>{
    this.dialogRef.close();
    if(error.error?.message){
      this.responseMessage = error.error?.message;
    }
    else{
      this.responseMessage = GlobalCostants.genericError;
    }
    this.snackbarService.openSnackBar(this.responseMessage,GlobalCostants.error);
  })
  
}

}


