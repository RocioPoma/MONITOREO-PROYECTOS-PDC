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
  // Definir un arreglo para almacenar los archivos y sus vistas previas
  files: { file: File, preview: string }[] = [];
  selectedFiles: File[] = [];


  //limitador de archivos
  extensionesPermitidas = ['ppt','xlsx','rar','jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx','dwg','dxf','skp','rvt' ,'rfa','rte','pln','gsm','ifc','cobie','nwd','bimx','3ds','3dm','shp'];


  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private dialogRef:MatDialogRef<ArchivosComponent>,
    private proyectoService: ProyectoService,  
    private snackbarService:SnackbarService
  ) {}

  ngOnInit():void{
    //console.log(this.dialogData.data);
    this.proyectoForm = this.formBuilder.group({   
      Descripcion: [null],   
      documento: [null],
     
    });


    
  }
 
  onFileChange(event:any) {
   
    for (var i = 0; i < event.target.files.length; i++) { 
        this.myFiles.push(event.target.files[i]);
    }
  }
  
/* Submit(){
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
} */


onFileSelected(event: any): void {
  this.selectedFiles = event.target.files;
}

uploadFiles(): void {
  var formD = this.proyectoForm.value;
  if (this.selectedFiles.length > 0) {
    this.proyectoService.uploadFiles(this.selectedFiles,formD.Descripcion,this.dialogData.data,)
      .subscribe((response:any) => {
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
      });
  }
}


//-------------------subir archivos--------------------------------------
// Función para manejar la selección de archivos
/* selectFiles(event: any): void {
  if (event.target.files && event.target.files.length > 0) {
    for (let i = 0; i < event.target.files.length; i++) {
      const file = event.target.files[i];
      this.selectedFiles=event.target.files[i];
      // Crear una instancia de FileReader
      const reader = new FileReader();

      // Configurar un controlador de eventos para cuando el archivo se cargue
      reader.onload = (e) => {
        // Agregar el archivo y su vista previa al arreglo
        this.files.push({ file, preview: reader.result as string });
      };

      // Leer el contenido del archivo como una URL de datos
      reader.readAsDataURL(file);
    }
    this.proyectoService.uploadFiles(this.selectedFiles).subscribe(Response=>{
      console.log('Archivos subidos con éxito', Response);
    },error => {
      console.error('Error al subir archivos', error);
    });  
  }
} */

// Función para eliminar un archivo de la lista
removeFile(index: number): void {
  this.selectedFiles.splice(index, 1);
}

}
