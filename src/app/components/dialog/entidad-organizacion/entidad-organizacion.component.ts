import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoriaService } from 'src/app/services/categoria.service';
import { EntidadService } from 'src/app/services/entidad.service';


import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalCostants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-entidad-organizacion',
  templateUrl: './entidad-organizacion.component.html',
  styleUrls: ['./entidad-organizacion.component.scss']
})
export class EntidadOrganizacionComponent {
  onAddEntidad = new EventEmitter();
  onEditEntidad = new EventEmitter();
  entidadForm:any= FormGroup;
  dialogAction:any="Add";
  action:any="Registrar";
  responseMessage:any;
  
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any,
  private formBuilder:FormBuilder,
  private EntidadServices : EntidadService,
  private dialogRef:MatDialogRef<EntidadOrganizacionComponent>,
  private snackbarService:SnackbarService) { }

  ngOnInit(): void {
    this.entidadForm = this.formBuilder.group({
      nombre_entidad: [null, [Validators.required]],
      comentario: [null, [Validators.required]]
    });
    if(this.dialogData.action ==='Edit') {
      this.dialogAction="Edit";
      this.action ="Actualizar";
      this.entidadForm.patchValue(this.dialogData.data);
    }
  }

  handleSubmit(){
    if(this.dialogAction ==='Edit') {
      this.edit();
    }
    else{
      this.add();
    }
  }

  add(){
    var formData = this.entidadForm.value;
    var data ={
      nombre_entidad: formData.nombre_entidad.toUpperCase(),
      comentario: formData.comentario.toUpperCase(),
      estado : true
    }
    this.EntidadServices.add(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onAddEntidad.emit();
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

  edit(){
    var formData = this.entidadForm.value;
    var data ={
      id_entidad:this.dialogData.data.id_entidad,
      nombre_entidad: formData.nombre_entidad.toUpperCase(),
      comentario: formData.comentario.toUpperCase(),
      estado : true
    }
    this.EntidadServices.update(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onEditEntidad.emit();
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
