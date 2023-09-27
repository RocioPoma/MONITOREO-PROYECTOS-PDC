import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EntidadFinancieraService } from 'src/app/services/entidad-financiera.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalCostants } from 'src/app/shared/global-constants';


@Component({
  selector: 'app-entidad-financiera',
  templateUrl: './entidad-financiera.component.html',
  styleUrls: ['./entidad-financiera.component.scss']
})
export class EntidadFinancieraComponent {

  onAddEntidadFinan = new EventEmitter();
  onEditEntidadFinan = new EventEmitter();
  entidadFinanForm:any= FormGroup;
  dialogAction:any="Add";
  action:any="Registrar";
  responseMessage:any;
  
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any,
  private formBuilder:FormBuilder,
  private entidadFinancieraServices : EntidadFinancieraService,
  private dialogRef:MatDialogRef<EntidadFinancieraComponent>,
  private snackbarService:SnackbarService) { }

  ngOnInit(): void {
    this.entidadFinanForm = this.formBuilder.group({
      nom_entidad_financiera: [null, [Validators.required]],
      desc_entidad_financiera: [null, [Validators.required]]
    });
    if(this.dialogData.action ==='Edit') {
      this.dialogAction="Edit";
      this.action ="Actualizar";
      this.entidadFinanForm.patchValue(this.dialogData.data);
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
    var formData = this.entidadFinanForm.value;
    var data ={
      nom_entidad_financiera: formData.nom_entidad_financiera,
      desc_entidad_financiera: formData.desc_entidad_financiera,
      estado : true
    }
    this.entidadFinancieraServices.add(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onAddEntidadFinan.emit();
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
    var formData = this.entidadFinanForm.value;
    var data ={
      id_entidad_financiera:this.dialogData.data.id_entidad_financiera,
      nom_entidad_financiera: formData.nom_entidad_financiera,
      desc_entidad_financiera: formData.desc_entidad_financiera,
      estado : true
    }
    this.entidadFinancieraServices.update(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onEditEntidadFinan.emit();
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
