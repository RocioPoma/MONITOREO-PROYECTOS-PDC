import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsuarioService } from 'src/app/services/usuario.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalCostants } from 'src/app/shared/global-constants';
import { DatePipe } from '@angular/common';
import { EntidadEjecutoraService } from 'src/app/services/entidad-ejecutora.service';

@Component({
  selector: 'app-gestionusuario',
  templateUrl: './gestionusuario.component.html',
  styleUrls: ['./gestionusuario.component.scss']
})
export class GestionusuarioComponent {
  onAddUser = new EventEmitter();
  onEditUser = new EventEmitter();
  usuarioForm:any= FormGroup;
  dialogAction:any="Add";
  action:any="Registrar";
  responseMessage:any;
  fechaActual: Date | undefined;
  fechaActualString: any;
  fnac:any;
  entidad: any;



  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any,
  private formBuilder:FormBuilder,
  private usuarioService:UsuarioService,
  private dialogRef:MatDialogRef<GestionusuarioComponent>,
  private snackbarService:SnackbarService,
  private datePipe: DatePipe,
  private entidadServices: EntidadEjecutoraService
  ) { 
    this.fechaActual = new Date();
    // Convierte la fecha a string en formato "dd-MM-yyyy" 
    this.fechaActualString = this.datePipe.transform(this.fechaActual, 'yyyy-MM-dd');
  }

  ngOnInit(): void {
    this.entidades();  
    this.usuarioForm = this.formBuilder.group({
    nombre: [null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/), Validators.maxLength(50)]],
    ap_paterno: [null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]],
    ap_materno: [null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]],
    ci: [null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]],
      
      fecha_registro: [null, [Validators.required]],
      password: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      
      telefono: [null, [Validators.required, Validators.pattern(/^\d{6}$/)]],
      celular: [null, [Validators.required, Validators.pattern(/^\d{8}$/)]],
      genero: [null, [Validators.required]],
      rol: [null, [Validators.required]],
      estado: [null, [Validators.required]],
      id_entidad_ejecutora: [null, [Validators.required]]
    
      
    });
    if(this.dialogData.action ==='Edit') {
      this.dialogAction="Edit";
      this.action ="Actualizar";
      this.usuarioForm.patchValue(this.dialogData.data);
      
    }
  }

  //llama a la entidades existentes
  entidades() {
    this.entidadServices.get().subscribe((response: any) => {
     
      this.entidad=response;    
    })
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
    
    var formData = this.usuarioForm.value;
    this.fnac = this.datePipe.transform(formData.fecha_nacimiento, 'yyyy-MM-dd')
    var data ={            
      nombre: formData.nombre,
      ap_paterno: formData.ap_paterno,
      ap_materno: formData.ap_materno,
      celular: formData.celular,
      fecha_registro: this.fechaActualString,
      password: formData.password,
      email: formData.email,
      telefono: formData.telefono,
      genero: formData.genero,
      rol: formData.rol,
      estado: true,
      id_entidad_ejecutora: formData.id_entidad_ejecutora,
      ci: formData.ci
    }
    
    this.usuarioService.add(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onAddUser.emit();
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
    var formData = this.usuarioForm.value;
    this.fnac = this.datePipe.transform(formData.fecha_nacimiento, 'yyyy-MM-dd');
    this.fechaActualString = this.datePipe.transform(formData.fecha_registro, 'yyyy-MM-dd');
    var data ={
      nombre: formData.nombre,
      ap_paterno: formData.ap_paterno,
      ap_materno: formData.ap_materno,
      celular: formData.celular,
      fecha_registro:  this.fechaActualString,
      password: formData.password,
      email: formData.email,
      telefono: formData.telefono,
      genero: formData.genero,
      rol: formData.rol,
      estado: formData.estado,
      id_entidad_ejecutora: formData.id_entidad_ejecutora,
      ci: formData.ci
    }
     this.usuarioService.update(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onEditUser.emit();
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
