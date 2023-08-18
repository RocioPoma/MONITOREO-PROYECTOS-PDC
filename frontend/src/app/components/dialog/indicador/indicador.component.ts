import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { InjectSetupWrapper, inject } from '@angular/core/testing';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { error } from 'highcharts';
import { IndicadorService } from 'src/app/services/indicador.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UnidadMedicionService } from 'src/app/services/unidad-medicion.service';
import { GlobalCostants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-indicador',
  templateUrl: './indicador.component.html',
  styleUrls: ['./indicador.component.scss']
})
export class IndicadorComponent implements OnInit {
  onEditIndicador = new EventEmitter;
  action: any = 'Registrar';
  indicadorForm: any = FormGroup;
  dialogAction: any = "Add";
  responseMessage: any;

  unidad: any = [];

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
  private indicadorService : IndicadorService,
  private unidadService : UnidadMedicionService, 
  private formBuilder : FormBuilder,
  private snackbarService : SnackbarService,
  private dialogRef : MatDialogRef<IndicadorComponent>
  ){}

  ngOnInit(): void {

    this.getUnidad();

    this.indicadorForm = this.formBuilder.group({
      nom_indicador : [null, [Validators.required]],
      desc_indicador : [null, [Validators.required]],
      id_unidad_medicion : [null, [Validators.required]]
    });
    if(this.dialogData.action ==='Edit') {
      this.dialogAction="Edit";
      this.action ="Actualizar";
      this.indicadorForm.patchValue(this.dialogData.data);
    }
  }

  handleSubmit(){
    if(this.dialogAction ==='Edit') {
      this.edit();
    }
  }

  edit() {
    var formData = this. indicadorForm.value;
    var data = {
      id_indicador : this.dialogData.data.id_indicador,
      nom_indicador : formData.nom_indicador,
      desc_indicador : formData.desc_indicador,
      id_unidad_medicion : formData.id_unidad_medicion,
      estado: true
    }

    this.indicadorService.updateIndicador(data).subscribe((response: any)=>{
      this.dialogRef.close();
      this.onEditIndicador.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackBar(this.responseMessage, "success");
    }, (error:any)=>{
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
  
  getUnidad(){
    this.unidadService.getUnidad().subscribe((response: any) => {
      this.unidad = response;
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
