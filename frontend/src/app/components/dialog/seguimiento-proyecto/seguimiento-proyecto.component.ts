import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ProyectoComponent } from '../proyecto/proyecto.component';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { EntidadEjecutoraService } from 'src/app/services/entidad-ejecutora.service';
import { GlobalCostants } from 'src/app/shared/global-constants';
import { EntidadFinancieraService } from 'src/app/services/entidad-financiera.service';
import { SeguimientoProyectoService } from 'src/app/services/seguimiento-proyecto.service';

@Component({
  selector: 'app-seguimiento-proyecto',
  templateUrl: './seguimiento-proyecto.component.html',
  styleUrls: ['./seguimiento-proyecto.component.scss']
})
export class SeguimientoProyectoComponent {
  onAddSeguimiento = new EventEmitter();
  onEditSeguimiento = new EventEmitter();
  seguimientoForm1: any = FormGroup;
  dialogAction: any = "Add";
  action: any = "Registrar";
  nombreProyecto:any;
  responseMessage: any;

  //-------Para cargar archivo
  file!: File;
  fileSelected!: ArrayBuffer | string | null;

  //-------Para almacenar los datos de servicios
  EntidadEjecutora: any = [];
  Etapa: any = [];
  EntidadFinanciera: any = [];

  //-------Para agregar y quitar campos de Input
  Financiamiento: { entidad_financiera: any; monto_inicial: any; monto_final: any }[] = [];


  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private _sanitizer: DomSanitizer,
    private EntidadEjecutoraService: EntidadEjecutoraService,
    private EntidadFinancieraService: EntidadFinancieraService,
    private SeguimientoProyectoService: SeguimientoProyectoService,
    private dialogRef: MatDialogRef<ProyectoComponent>,
    private snackbarService: SnackbarService,
    //private datePipe: DatePipe
  ) {
    //this.fechaActual = new Date();

    // Convierte la fecha a string en formato "dd-MM-yyyy" 
    // this.fechaActualString = this.datePipe.transform(this.fechaActual, 'yyyy-MM-dd');
  }

  ngOnInit(): void {

    // console.log(this.fechaActualString);
    this.getEntidadEjecutora();
    this.getEntidadFinanciera();

    this.seguimientoForm1 = this.formBuilder.group({
      id_entidad_ejecutora: [null, [Validators.required]],
      fuente_informacion: [null, [Validators.required]],
      fecha_registro: [null, [Validators.required]],
      id_etapa: [null, [Validators.required]],
      id_entidad_financiera: [null, [Validators.required]],
      monto_inicial: [null],
      monto_final: [null],
      financiamiento: [null],
      auxmonto_inicial: [null],

    });
    if (this.dialogData.action === 'seguimiento') {
      console.log(this.dialogData.data);
      this.dialogAction = "Edit";
      this.action = this.dialogData.data.NombreTipologia;
      this.nombreProyecto=this.dialogData.data.nom_proyecto;
      //this.seguimientoForm1.patchValue(this.dialogData.data);
      this.getEtapaByIdTipologia(this.dialogData.data.id_tipologia);
    }
  }

    //------------- PARA LLAMAR A LA FUNCION (GREGAR O EDITAR) ---------------------
    handleSubmit() {
      if (this.dialogAction === 'Edit') {
        //this.edit();
      }
      else {
        //this.add();
      }
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
  
  
    //----------- PARA AGREGAR CAMPOS INPUT (CANTIDAD Y UNIDAD)
    addInput() {
      this.Financiamiento.push({ entidad_financiera: '', monto_inicial: '', monto_final:'' });
    }
  
    //----------- PARA QUITAR CAMPOS INPUT(CANTIDAD Y UNIDAD)
    removeInput() {
      if (this.Financiamiento.length > 0) {
        this.Financiamiento.pop();
      }
    }
    mostrarDatos() {
      console.log(this.Financiamiento);
    }
  
    /*---------------------INICIO SERVICIOS ESTRAS --------------*/
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
    getEtapaByIdTipologia(id_tipologia:any) {
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


}
