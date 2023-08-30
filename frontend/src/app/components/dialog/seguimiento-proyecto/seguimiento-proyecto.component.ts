import { Component, EventEmitter, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ProyectoComponent } from '../proyecto/proyecto.component';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { EntidadEjecutoraService } from 'src/app/services/entidad-ejecutora.service';
import { GlobalCostants } from 'src/app/shared/global-constants';
import { EntidadFinancieraService } from 'src/app/services/entidad-financiera.service';
import { SeguimientoProyectoService } from 'src/app/services/seguimiento-proyecto.service';
import { FuenteInformacionService } from 'src/app/services/fuente-informacion.service';
import { DatePipe } from '@angular/common';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-seguimiento-proyecto',
  templateUrl: './seguimiento-proyecto.component.html',
  styleUrls: ['./seguimiento-proyecto.component.scss']
})
export class SeguimientoProyectoComponent {
  onAddSeguimiento = new EventEmitter();
  onEditSeguimiento = new EventEmitter();
  dialogAction: any = "Add";
  id_proyecto: number;
  id_etapa_proyecto: number;
  action: any = "Registrar";
  nombreProyecto: any;
  responseMessage: any;

  //-------Para cargar archivo
  file!: File;
  fileSelected!: ArrayBuffer | string | null;

  //-------Para almacenar los datos de servicios
  EntidadEjecutora: any[] = [];
  fuenteInformacion: any[] = [];
  Etapa: any[] = [];
  EntidadFinanciera: any[] = [];

  //-------Para agregar y quitar campos de Input
  Financiamiento: { entidad_financiera: any; monto_inicial: any; monto_final: any }[] = [];


  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private _sanitizer: DomSanitizer,
    private EntidadEjecutoraService: EntidadEjecutoraService,
    private EntidadFinancieraService: EntidadFinancieraService,
    private SeguimientoProyectoService: SeguimientoProyectoService,
    private fuenteInfService: FuenteInformacionService,
    private dialogRef: MatDialogRef<ProyectoComponent>,
    private snackbarService: SnackbarService,
    //private datePipe: DatePipe
    private datePipe: DatePipe,
    private dateAdapter: DateAdapter<Date>
  ) {
    //this.fechaActual = new Date();
    this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
    // Convierte la fecha a string en formato "dd-MM-yyyy" 
    // this.fechaActualString = this.datePipe.transform(this.fechaActual, 'yyyy-MM-dd');
  }

  seguimientoForm1: FormGroup = this.formBuilder.group({
    id_etapa:                           [                          , [Validators.required]],
    id_entidad_ejecutora:               [{value:null,disabled:true}, [Validators.required]],
    fuente_de_informacion:              [{value:null,disabled:true}, [Validators.required]],
    id_proyecto:                        [                          , [Validators.required]],
    fecha_seguimiento:                  [{value:null,disabled:true}, [Validators.required]],
    avance_seguimiento_fisico:          [{value:null,disabled:true}, [Validators.required]],
    comentario_seguimiento_fisico:      [{value:null,disabled:true}, [Validators.required]],
    comentario_seguimiento_financiero:  [{value:null,disabled:true}, [Validators.required]],
    // auxmonto_inicial: [null],
    financiamiento: this.formBuilder.array([
      this.formBuilder.group({
        id_entidad_financiera: [{value:null, disabled:true}, [Validators.required, Validators.min(1)]],
        monto_inicial:         [{value:null, disabled:true}, [Validators.required, Validators.min(1)]],
        monto_final:           [{value:null, disabled:true}, [Validators.required, Validators.min(1)]],
      })
    ], [Validators.required]),
    seguimiento_financiamiento: this.formBuilder.array([]), 
  },{

  });
  ngOnInit(): void {

    // console.log(this.fechaActualString);
    // this.seguimientoForm1.disable();
    this.getEntidadEjecutora();
    this.getEntidadFinanciera();

    // console.log(this.dialogData.action);
    if (this.dialogData.action === 'seguimiento') {
      console.log('seguimiento');
      console.log(this.dialogData.data);
      // this.dialogAction = "Edit";
      this.action = this.dialogData.data.nom_tipologia;
      this.nombreProyecto = this.dialogData.data.nom_proyecto;
      this.id_proyecto = this.dialogData.data.id_proyecto;
      this.seguimientoForm1.get('id_proyecto')?.setValue(this.id_proyecto)
      //this.seguimientoForm1.patchValue(this.dialogData.data);
      this.getEtapaByIdTipologia(this.dialogData.data.id_tipologia);
    }
    // console.log(this.financiamientoArray.controls);
  }
  get financiamientoArray() {
    return this.seguimientoForm1.controls['financiamiento'] as FormArray;
  }
  get seguimientoFinanciamientoArray() {
    return this.seguimientoForm1.controls['seguimiento_financiamiento'] as FormArray;
  }
  addFinancimiento() {
    console.log(this.seguimientoForm1.get('id_etapa'));
    if(this.seguimientoForm1.get('id_etapa')?.invalid) return;
    const finItem = this.formBuilder.group({
      id_entidad_financiera: [, [Validators.required, Validators.min(1)]],
      monto_inicial: [, [Validators.required, Validators.min(1)]],
      monto_final: [, [Validators.required, Validators.min(1)]],
    })
    this.financiamientoArray.push(finItem);
  }
  deleteFinanciamiento(index: number) {
    this.financiamientoArray.removeAt(index);
    this.seguimientoFinanciamientoArray.removeAt(index);
  }

  //------------- PARA LLAMAR A LA FUNCION (GREGAR O EDITAR) ---------------------
  handleSubmit() {
    // console.log(this.seguimientoForm1);
    console.log(this.dialogAction);
    if (this.dialogAction === 'Edit') {
      this.update();
    }
    else if(this.dialogAction ==='Add') {
      this.add();
    }
  }
  montoFinalTotal(){
    const values=this.financiamientoArray.value as Array<any>
    let total:number=0;
    values.forEach(val=>{
      total = total+val.monto_final
    });
    return total;
  }
  montoInicial(i:number){
    // console.log(i);
    if(this.montoFinalTotal()===0) return '';
    const monto=this.financiamientoArray.at(i).get('monto_inicial')?.value;
    return ((monto*100)/this.montoFinalTotal()).toFixed(2);
  }
  montoFinal(i:number){
    // console.log(i);
    if(this.montoFinalTotal()===0) return '';
    const monto=this.financiamientoArray.at(i).get('monto_final')?.value;
    return ((monto*100)/this.montoFinalTotal()).toFixed(2);
  }
  montoSeg(i:number){
    if(this.montoFinalTotal()===0) return '';
    const montoFinal =this.financiamientoArray.at(i).get('monto_inicial')?.value;
    const montoSeguimiento = this.seguimientoFinanciamientoArray.at(i).get('monto')?.value;
    return ((montoSeguimiento*100)/montoFinal).toFixed(2)
  }
  
  add() {
    
    this.seguimientoForm1.markAllAsTouched();
    console.log('add');
    console.log(this.seguimientoForm1);
    console.log(this.seguimientoForm1.value);
    // return;
    if (this.seguimientoForm1.invalid) return;

    this.SeguimientoProyectoService.createSeguimientoProyecto(this.seguimientoForm1.value).subscribe({
      next: res => {
        console.log(res);
        this.dialogRef.close();
        this.responseMessage = "Se registro correctamente el seguimiento";
        this.snackbarService.openSnackBar(this.responseMessage, "success");
      },
      error: err => {
        console.log(err);
      }
    })
  }
  update(){
    this.seguimientoForm1.markAllAsTouched();
    console.log('edit');
    console.log(this.seguimientoForm1);
    console.log(this.seguimientoForm1.value);
    if(this.seguimientoForm1.invalid) return;
    const {avance_seguimiento_fisico,
      comentario_seguimiento_financiero,
      comentario_seguimiento_fisico,
      fecha_seguimiento,
      seguimiento_financiamiento} = this.seguimientoForm1.value;
    this.SeguimientoProyectoService.registerSeguimientoEtapa({id_etapa_proyecto:this.id_etapa_proyecto,
                                                              avance_seguimiento_fisico,
                                                              comentario_seguimiento_financiero,
                                                              comentario_seguimiento_fisico,
                                                              fecha_seguimiento,
                                                              seguimiento_financiamiento}).subscribe({
      next:res=>{
        console.log(res);

        this.responseMessage = "Se registro correctamente el seguimiento de etapa";
        this.snackbarService.openSnackBar(this.responseMessage, "success");
        this.seguimientoForm1.get('fecha_seguimiento').reset();
        this.seguimientoForm1.get('avance_seguimiento_fisico').reset();
        this.seguimientoForm1.get('comentario_seguimiento_fisico').reset();
        this.seguimientoForm1.get('comentario_seguimiento_financiero').reset();
        this.seguimientoFinanciamientoArray.reset();
      },
      error:err=>{
        console.log(err);
      }
    })
  }
  dateFormateado($event:any) {
    // console.log('fecha:D');
    console.log($event.value);
    console.log(this.datePipe);
    this.seguimientoForm1.get('fecha_seguimiento')?.setValue(this.datePipe.transform($event.value, 'yyyy-MM-dd'));
    console.log(this.seguimientoForm1.value);
  }
 get dateDisabled(){
    // console.log('format date',this.seguimientoForm1);
    // console.log(this.inputData.getAttribute('ng-reflect-mat-datepicker').);
    return this.seguimientoForm1.get('fecha_seguimiento').disabled;
  }
  get inputData(){
    return document.getElementById('id_fecha_seguimiento')
  }
  entidades(index: number) {
    return this.EntidadFinanciera.find(item => item.id_entidad_financiera === this.financiamientoArray.at(index).get('id_entidad_financiera')?.value)
  }
  //--------------- SELECCIONAR ARCHIVO ------------------
  selectFile(event: any): any {
    this._sanitizer.bypassSecurityTrustStyle(event.target.files);
    if (event.target.files && event.target.files[0]) {
      this.file = (<File>event.target.files[0]);
      //File preview
      const reader = new FileReader();
      reader.onload = e => this.fileSelected = reader.result;

      reader.readAsDataURL(this.file);
    }
  }
  //------------- FIN SELECCIONAR ARCHIVO ---------------------


  //----------- PARA QUITAR CAMPOS INPUT(CANTIDAD Y UNIDAD)
  removeInput() {
    if (this.financiamientoArray.length > 1) {
      this.financiamientoArray.removeAt(this.financiamientoArray.length - 1);
    }
  }
  mostrarDatos() {
    console.log(this.Financiamiento);
  }

  /*---------------------INICIO SERVICIOS EXTRAS --------------*/
  //------------------- OBTENEMOS ENTIDAD EJECUTORA
  getEntidadEjecutora() {
    this.EntidadEjecutoraService.get().subscribe((response: any) => {
      this.EntidadEjecutora = response;
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

  addListFinanciamiento(id_etapa_proyecto: number) {
    this.SeguimientoProyectoService.getFinanciamientoByIdEtapaProyecto(id_etapa_proyecto)
      .subscribe({
        next: res => {
          // console.log(res);
          if (res.length > 0) {
            for (let item of res) {
              // console.log('iteeeem',item);
              const finItem = this.formBuilder.group({
                id_entidad_financiera: [item.id_entidad_financiera, [Validators.required, Validators.min(1)]],
                monto_inicial: [item.monto_inicial, [Validators.required, Validators.min(1)]],
                monto_final: [item.monto_final, [Validators.required, Validators.min(1)]],
              })
              this.financiamientoArray.push(finItem);
              // this.addEntidadFinanciera(item);
            }
          }
        },
        error: err => {
          console.log(err);
        }
      })
  }
  //------------------- OBTENEMOS ENTIDAD FINANCIERA
  getEntidadFinanciera() {
    this.EntidadFinancieraService.get().subscribe((response: any) => {
      this.EntidadFinanciera = response;
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

  //------------------- OBTENEMOS ETAPA POR ID TIPOLOGIA
  getEtapaByIdTipologia(id_tipologia: any) {
    this.SeguimientoProyectoService.getEtapaByIdTipologia(id_tipologia).subscribe((response: any) => {
      this.Etapa = response;
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
  changeEtapa(etapaValue: number) {
    this.SeguimientoProyectoService.getEtapaProyectoByIdEtapa(this.dialogData.data.id_proyecto, etapaValue).subscribe({
      next: res => {
        this.seguimientoFinanciamientoArray.clear();
        this.financiamientoArray.clear();
        this.seguimientoForm1.reset({ 'id_etapa': etapaValue, 'id_proyecto': this.id_proyecto });
        this.seguimientoForm1.enable();
        if (res) {
          console.log(res);
          this.dialogAction = "Edit";
          this.id_etapa_proyecto = res.id_etapa_proyecto;
          this.addListFinanciamiento(this.id_etapa_proyecto);
          this.seguimientoForm1.get('id_entidad_ejecutora')?.setValue(res.id_entidad_ejecutora);
          // this.seguimientoForm1.get('fecha_seguimiento')?.setValue(res.fecha_seguimiento);
          this.seguimientoForm1.get('fuente_de_informacion')?.setValue(res.fuente_de_informacion);
          this.seguimientoForm1.get('id_entidad_ejecutora')?.setValue(res.id_entidad_ejecutora);
          console.log(this.seguimientoForm1.value);
          // this.seguimientoForm1.get('id_proyecto')?.setValue(res.id_proyecto);
        } else {
          this.dialogAction = "Add";
          this.financiamientoArray.setControl(0,
            this.formBuilder.group({
              id_entidad_financiera: [, [Validators.required, Validators.min(1)]],
              monto_inicial: [, [Validators.required, Validators.min(1)]],
              monto_final: [, [Validators.required, Validators.min(1)]],
            }))
          // this.seguimientoForm1.reset({ 'id_etapa': etapa.id_etapa, 'id_proyecto': this.id_proyecto });
        }
      },
      error: err => {
        console.log(err);
      }
    })
  }
  clearControls(){

  }
  addEntidadFinanciera(item: any) {
    // console.log(item.id_entidad_financiera);
    const segFinItem = this.formBuilder.group({
      monto: [, [Validators.required, Validators.min(1)]],
    })
    this.seguimientoFinanciamientoArray.push(segFinItem);
  }

}
