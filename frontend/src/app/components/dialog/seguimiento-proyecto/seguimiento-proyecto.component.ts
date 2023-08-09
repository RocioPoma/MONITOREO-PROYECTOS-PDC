import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ProyectoComponent } from '../proyecto/proyecto.component';
import { SnackbarService } from 'src/app/services/snackbar.service';

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
    
  

    this.seguimientoForm1 = this.formBuilder.group({
      id_entidad_ejecutora: [null, [Validators.required]],
      fuente_informacion: [null, [Validators.required]],
      fecha_registro: [null, [Validators.required]],
      id_etapa: [null, [Validators.required]],
      id_entidad_financiera: [null, [Validators.required]],
      monto_inicial:[null],
      monto_final:[null],
      financiamiento:[null],
      auxmonto_inicial:[null],

    });
    if (this.dialogData.action === 'Edit') {
      this.dialogAction = "Edit";
      this.action = "Actualizar";
      this.seguimientoForm1.patchValue(this.dialogData.data);
    }



  }


}
