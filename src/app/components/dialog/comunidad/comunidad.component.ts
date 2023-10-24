import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ComunidadService } from 'src/app/services/comunidad.service';
import { MunicipioService } from 'src/app/services/municipio.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalCostants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-comunidad',
  templateUrl: './comunidad.component.html',
  styleUrls: ['./comunidad.component.scss']
})
export class ComunidadComponent {
  onEditComunidad = new EventEmitter();
  onAddComunidad = new EventEmitter();
  action: any="Registrar";
  comunidadForm: any = FormGroup;
  municipio: any;
  dialogAction: string;
  responseMessage: any;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
  private formBuilder: FormBuilder,
  private comunidadService: ComunidadService,
  private municipioService: MunicipioService,
  private dialogRef: MatDialogRef<ComunidadComponent>,
  private snackbarService: SnackbarService){ }

  ngOnInit(): void{
    this.getMunicipio();
    this.comunidadForm = this.formBuilder.group({
      nombre: [null, [Validators.required]],
      id_municipio:[null, [Validators.required]]
    });
    if(this.dialogData.action ==='Edit') {
      this.dialogAction="Edit";
      this.action ="Actualizar";
      this.comunidadForm.patchValue(this.dialogData.data);
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

  add() {
    var formData = this.comunidadForm.value;
    var data ={
      nombre: formData.nombre.toUpperCase(),
      id_municipio: formData.id_municipio
    }
    this.comunidadService.add(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onAddComunidad.emit();
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

  edit() {
    var formData = this.comunidadForm.value;
    var data ={
      id:this.dialogData.data.id,
      nombre: formData.nombre.toUpperCase(),
      id_municipio: formData.id_municipio,
    }
    this.comunidadService.update(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onEditComunidad.emit();
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

  //------------------- OBTENEMOS MUNICIPIO
  getMunicipio() {
    this.municipioService.getMunicipio().subscribe((response: any) => {
      this.municipio = response;
    }, (error: any) => {
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalCostants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalCostants.error);

    });
  }
}
