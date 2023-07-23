import { Component, EventEmitter, Inject , ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { MunicipioService} from 'src/app/services/municipio.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalCostants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-municipio',
  templateUrl: './municipio.component.html',
  styleUrls: ['./municipio.component.scss']
})
export class MunicipioComponent {
  onAddCategoria = new EventEmitter();
  onEditCategoria = new EventEmitter();
  municipioForm:any= FormGroup;
  dialogAction:any="Add";
  action:any="Registrar";
  responseMessage:any;

  



  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any,
  private formBuilder:FormBuilder,
  private municipioService:MunicipioService,
  private dialogRef:MatDialogRef<MunicipioComponent>,
  private snackbarService:SnackbarService) { }



  ngOnInit(): void {
    this.municipioForm = this.formBuilder.group({
      nombre_municipio: [null, [Validators.required]]
      
    });
    if(this.dialogData.action ==='Edit') {
      this.dialogAction="Edit";
      this.action ="Actualizar";
      this.municipioForm.patchValue(this.dialogData.data);
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
    var formData = this.municipioForm.value;
    var data ={
      nombre_municipio: formData.nombre_municipio
     
    }
    this.municipioService.add(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onAddCategoria.emit();
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
    var formData = this.municipioForm.value;
    var data ={
      id_municipio:this.dialogData.data.id_municipio,
      nombre_municipio: formData.nombre_municipio
      
    }
    this.municipioService.update(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onEditCategoria.emit();
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
