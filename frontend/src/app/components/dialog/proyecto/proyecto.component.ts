import { Component, EventEmitter, Inject , ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ProyectoService} from 'src/app/services/proyecto.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalCostants } from 'src/app/shared/global-constants';

//fecha medinte pipeangular
import { DatePipe } from '@angular/common';

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
  onEditCategoria = new EventEmitter();
  proyectoForm:any= FormGroup;
  dialogAction:any="Add";
  action:any="Registrar";
  responseMessage:any;

  //arrys ejmplos
  foods: area[] = [
    {value: 'steak-0', viewValue: 'Urbana'},
    {value: 'pizza-1', viewValue: 'Periurbana'},
    {value: 'tacos-2', viewValue: 'Rural'},
    {value: 'tacos-3', viewValue: 'Rural y Urbano'},
  ];

  area: area[] = [
    {value: 'urbana', viewValue: 'Urbana'},
    {value: 'priurbana', viewValue: 'Periurbana'},
    {value: 'rural', viewValue: 'Rural'},
    {value: 'rural y urbano', viewValue: 'Rural y Urbano'},
  ];

  cat: cat[] = [    
    {value: '2', viewValue: 'Urbana'},
    {value: '3', viewValue: 'Rural'},
  
  ];

  tip: cat[] = [
    {value: '1', viewValue: 'tip-1'},
    {value: '2', viewValue: 'tip-2'},
    {value: '3', viewValue: 'tip-3'},
    {value: '4', viewValue: 'tip-4'},  
  ];

  cuenca: cat[] = [    
    {value: '1', viewValue: 'rio 1'},
    {value: '2', viewValue: 'rio 2'},
  
  ];

  municipio: cat[] = [    
    {value: '1', viewValue: 'cercado'},
    {value: '2', viewValue: 'san lorenzo'},
  
  ];

  //variables para fecha
  fechaActual: Date | undefined ;
  fechaActualString: any;
  finicio: any;
  ffin: any;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any,
  private formBuilder:FormBuilder,
  private ProyectoService: ProyectoService,
  private dialogRef:MatDialogRef<ProyectoComponent>,
  private snackbarService:SnackbarService,
  private datePipe: DatePipe
  ) {
    this.fechaActual = new Date();
    
    // Convierte la fecha a string en formato "dd-MM-yyyy" 
   this.fechaActualString = this.datePipe.transform(this.fechaActual, 'dd-MM-yyyy');

   }



  ngOnInit(): void {
    console.log(this.fechaActualString);
    this.proyectoForm = this.formBuilder.group({
      tipologia: [null, [Validators.required]],
      categorizacion: [null, [Validators.required]],
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
    if(this.dialogData.action ==='Edit') {
      this.dialogAction="Edit";
      this.action ="Actualizar";
      this.proyectoForm.patchValue(this.dialogData.data);
    }
  }

  handleSubmit(){
    if(this.dialogAction ==='Edit') {
     // this.edit();
    }
    else{
      this.add();
    }
  }


  add(){
    var formData = this.proyectoForm.value;
    this.finicio = this.datePipe.transform(formData.fecha_inicio, 'dd-MM-yyyy')
    this.ffin = this.datePipe.transform(formData.fecha_fin, 'dd-MM-yyyy')
    var data ={
      nom_proyecto: formData.nom_proyecto,
      fecha_inicio: this.finicio,
      fecha_fin: this.ffin,
      fecha_registro: this.fechaActualString,
      area: formData.area,
      coordenada_x: formData.coordenada_x,
      coordenada_y: formData.coordenada_y,
      estado: 'true',
      tipologia: formData.tipologia,   
      cantidad: formData.cantidad,  
      mujeres: formData.mujeres,  
      hombres: formData.hombres   ,
      cuenca: formData.cuenca  ,
      municipio: formData.municipio 

    }
    console.log(data);
    /* this.ProyectoService.add(data).subscribe((response:any)=>{
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
    }) */
  }


  
}
