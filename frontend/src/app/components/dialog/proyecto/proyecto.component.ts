import { Component, EventEmitter, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ProyectoService } from 'src/app/services/proyecto.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalCostants } from 'src/app/shared/global-constants';

//fecha medinte pipeangular
import { DatePipe } from '@angular/common';
import { CategoriaService } from 'src/app/services/categoria.service';
import { CuencaService } from 'src/app/services/cuenca.service';
import { MunicipioService } from 'src/app/services/municipio.service';
import { ComunidadService } from 'src/app/services/comunidad.service';
import { UnidadMedicionService } from 'src/app/services/unidad-medicion.service';

//interfaces para ejemplo luego se cambiara a servicios
interface area {
  value: string;
  viewValue: string;
}
interface cat {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-proyecto',
  templateUrl: './proyecto.component.html',
  styleUrls: ['./proyecto.component.scss']
})
export class ProyectoComponent {
  onAddCategoria = new EventEmitter();
  onEditProyecto = new EventEmitter();
  proyectoForm: any = FormGroup;
  dialogAction: any = "Add";
  action: any = "Registrar";
  responseMessage: any;


  area: area[] = [
    { value: 'urbana', viewValue: 'Urbana' },
    { value: 'periurbana', viewValue: 'Periurbana' },
    { value: 'rural', viewValue: 'Rural' },
    { value: 'rural y urbano', viewValue: 'Rural y Urbano' },
  ];

  //Pra almacenar los datos de servicios
  tipologia: any = [];
  categoria: any = [];
  cuenca: any = [];
  municipio: any = [];
  comunidad: any = [];
  unidad: any = [];

  //variables para fecha
  fechaActual: Date | undefined;
  fechaActualString: any;
  finicio: any;
  ffin: any;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private ProyectoService: ProyectoService,
    private CategoriaServise: CategoriaService,
    private CuencaServise: CuencaService,
    private MunicipioServise: MunicipioService,
    private ComunidadServise: ComunidadService,
    private UnidadServise: UnidadMedicionService,
    private dialogRef: MatDialogRef<ProyectoComponent>,
    private snackbarService: SnackbarService,
    private datePipe: DatePipe
  ) {
    this.fechaActual = new Date();

    // Convierte la fecha a string en formato "dd-MM-yyyy" 
    this.fechaActualString = this.datePipe.transform(this.fechaActual, 'yyyy-MM-dd');

  }

  ngOnInit(): void {
   // console.log(this.fechaActualString);
    this.proyectoForm = this.formBuilder.group({
      tipologia: [null, [Validators.required]],
      categoria: [null, [Validators.required]],
      nom_proyecto: [null, [Validators.required]],
      fecha_inicio: [null, [Validators.required]],
      fecha_fin: [null, [Validators.required]],
      fecha_registro: [null, [Validators.required]],
      area: [null, [Validators.required]],
      cuenca: [null, [Validators.required]],
      coordenada_x: [null, [Validators.required]],
      coordenada_y: [null, [Validators.required]],
      estado: [null, [Validators.required]],
      mujeres: [null, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      hombres: [null, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      cantidad: [null, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      comunidad_ciudad: [null, [Validators.required]],
      municipio: [null, [Validators.required]]

    });
    if (this.dialogData.action === 'Edit') {
      this.dialogAction = "Edit";
      this.action = "Actualizar";
      this.proyectoForm.patchValue(this.dialogData.data);
    }
    this.getTipologia();
    this.getCategoria();
    this.getCuenca();
    this.getMunicipio();
    this.getUnidad();
    this.getComunidad(1);
  }

  handleSubmit() {
    if (this.dialogAction === 'Edit') {
      this.edit();
    }
    else {
      this.add();
    }
  }

  /*------Servicios Extras-------*/
  //------------------- OBTENEMOS TIPOLOGIA
  getTipologia() {
    this.ProyectoService.getTipologia().subscribe((response: any) => {
      this.tipologia = response;
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

  //------------------- OBTENEMOS CATEGORIA
  getCategoria() {
    this.CategoriaServise.getCategoria().subscribe((response: any) => {
      this.categoria = response;
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

  //------------------- OBTENEMOS CUENCA
  getCuenca() {
    this.CuencaServise.getCuenca().subscribe((response: any) => {
      this.cuenca = response;
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

  //------------------- OBTENEMOS MUNICIPIO
  getMunicipio() {
    this.MunicipioServise.getMunicipio().subscribe((response: any) => {
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

  //------------------- OBTENEMOS UNIDAD
  getUnidad() {
    this.UnidadServise.getUnidad().subscribe((response: any) => {
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

    //------------------- OBTENEMOS COMUNIDAD
    getComunidad(id_municipio:any) {
      this.ComunidadServise.getComunidad(id_municipio).subscribe((response: any) => {
        this.comunidad = response;
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
  /*------Fin Servicios Extras--*/

  /*------Obtenemos Comunidades de un municipio */
  changeMunicipio(id_municipio: any) {
    console.log("Id del municipio", id_municipio);
  }

  add() {
    var formData = this.proyectoForm.value;
    this.finicio = this.datePipe.transform(formData.fecha_inicio, 'yyyy-MM-dd')
    this.ffin = this.datePipe.transform(formData.fecha_fin, 'yyyy-MM-dd')
   /*  console.log(this.finicio.toISOString());
    console.log(this.ffin.toISOString()); */
    console.log(this.fechaActualString);

    var data = {
      nom_proyecto: formData.nom_proyecto,
      fecha_inicio: this.finicio,
      fecha_fin: this.ffin,
      fecha_registro: this.fechaActualString,
      area: formData.area,
      coordenada_x: formData.coordenada_x,
      coordenada_y: formData.coordenada_y,
      cantidad: formData.cantidad,
      hombres: formData.hombres,
      mujeres: formData.mujeres,
      id_categoria: formData.categoria,
      id_tipologia: formData.tipologia,
      id_indicador: null,
      id_cuenca: formData.cuenca,
      id_accion_estrategica: null,
      estado: 'true',
      id_comunidad:formData.comunidad_ciudad
      //municipio: formData.municipio
    }
    console.log(data);
    this.ProyectoService.add(data).subscribe((response:any)=>{
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
    var formData = this.proyectoForm.value;
    console.log(this.proyectoForm.value);
    var data ={
      nom_proyecto: formData.NombreProyecto,
      fecha_inicio: this.finicio,
      fecha_fin: this.ffin,
      fecha_registro: this.fechaActualString,
      area: formData.area,
      coordenada_x: formData.coordenada_x,
      coordenada_y: formData.coordenada_y,
      cantidad: formData.cantidad,
      hombres: formData.hombres,
      mujeres: formData.mujeres,
      id_categoria: formData.categoria,
      id_tipologia: formData.tipologia,
      id_indicador: null,
      id_cuenca: formData.cuenca,
      id_accion_estrategica: null,
      estado: 'true',
      id_comunidad:formData.comunidad_ciudad
    }
    this.ProyectoService.update(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onEditProyecto.emit();
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
