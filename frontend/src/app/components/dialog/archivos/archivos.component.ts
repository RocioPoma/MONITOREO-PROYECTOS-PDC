import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProyectoService } from 'src/app/services/proyecto.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalCostants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-archivos',
  templateUrl: './archivos.component.html',
  styleUrls: ['./archivos.component.scss']
})
export class ArchivosComponent {
  onAddArchivos = new EventEmitter();
  myFiles:string [] = [];
  proyectoForm: any = FormGroup;
  responseMessage:any;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private dialogRef:MatDialogRef<ArchivosComponent>,
    private proyectoService: ProyectoService,  
    private snackbarService:SnackbarService
  ) {}

  ngOnInit():void{
    console.log(this.dialogData.data);
    this.proyectoForm = this.formBuilder.group({   
      Descripcion: [null, [Validators.required]],   
      documento: [null],
     
    });


    
  }
 
  onFileChange(event:any) {
   
    for (var i = 0; i < event.target.files.length; i++) { 
        this.myFiles.push(event.target.files[i]);
    }
  }
  
Submit(){
var formD = this.proyectoForm.value;
const formData = new FormData();
for (var i = 0; i < this.myFiles.length; i++) { 
  formData.append("files[]", this.myFiles[i]);
}
 // Agregar otros datos al FormData
  console.log(this.dialogData.data,formD.Descripcion);
formData.append("id_proyecto", this.dialogData.data);
formData.append("descripcion", formD.Descripcion); 
 

this.proyectoService.addA(formData).subscribe((response:any)=>{
  this.dialogRef.close();
  this.onAddArchivos.emit();
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
