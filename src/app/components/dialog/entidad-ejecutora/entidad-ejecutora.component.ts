import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoriaService } from 'src/app/services/categoria.service';
import { EntidadEjecutoraService } from 'src/app/services/entidad-ejecutora.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalCostants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-entidad-ejecutora',
  templateUrl: './entidad-ejecutora.component.html',
  styleUrls: ['./entidad-ejecutora.component.scss']
})
export class EntidadEjecutoraComponent {
  onAddEntidadEjecutora = new EventEmitter();
  onEditEntidadEjecutora = new EventEmitter();
  entidadEjeForm:any= FormGroup;
  dialogAction:any="Add";
  action:any="Registrar";
  responseMessage:any;
  
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any,
  private formBuilder:FormBuilder,
  private entidadEjecutoraServices : EntidadEjecutoraService,
  private dialogRef:MatDialogRef<EntidadEjecutoraComponent>,
  private snackbarService:SnackbarService) { }

  ngOnInit(): void {
    this.entidadEjeForm = this.formBuilder.group({
      nom_entidad_ejecutora: [null, [Validators.required]],
      desc_entidad_ejecutora: [null, [Validators.required]]
    });
    if(this.dialogData.action ==='Edit') {
      this.dialogAction="Edit";
      this.action ="Actualizar";
      this.entidadEjeForm.patchValue(this.dialogData.data);
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
    var formData = this.entidadEjeForm.value;
    var data ={
      nom_entidad_ejecutora: formData.nom_entidad_ejecutora.toUpperCase(),
      desc_entidad_ejecutora: formData.desc_entidad_ejecutora.toUpperCase(),
      estado : true
    }
    this.entidadEjecutoraServices.add(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onAddEntidadEjecutora.emit();
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
    var formData = this.entidadEjeForm.value;
    var data ={
      id_entidad_ejecutora:this.dialogData.data.id_entidad_ejecutora,
      nom_entidad_ejecutora: formData.nom_entidad_ejecutora.toUpperCase(),
      desc_entidad_ejecutora: formData.desc_entidad_ejecutora.toUpperCase(),
      estado : true
    }
    this.entidadEjecutoraServices.update(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onEditEntidadEjecutora.emit();
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
