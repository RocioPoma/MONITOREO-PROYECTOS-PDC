import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsuarioService } from 'src/app/services/usuario.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalCostants } from 'src/app/shared/global-constants';
import { DatePipe } from '@angular/common';
import { EntidadService } from 'src/app/services/entidad.service';

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
  private entidadServices: EntidadService
  ) { 
    this.fechaActual = new Date();
    // Convierte la fecha a string en formato "dd-MM-yyyy" 
    this.fechaActualString = this.datePipe.transform(this.fechaActual, 'yyyy-MM-dd');
  }

  ngOnInit(): void {
    this.entidades();  
    this.usuarioForm = this.formBuilder.group({
      nombre: [null, [Validators.required]],
      ap_paterno: [null, [Validators.required]],
      ap_materno: [null, [Validators.required]],
      fecha_nacimiento: [null, [Validators.required]],
      fecha_registro: [null, [Validators.required]],
      password: [null, [Validators.required]],
      email: [null, [Validators.required]],
      telefono: [null, [Validators.required]],
      genero: [null, [Validators.required]],
      rol: [null, [Validators.required]],
      estado: [null, [Validators.required]],
      entidad: [null, [Validators.required]],
      ci: [null, [Validators.required]]
      
    });
    if(this.dialogData.action ==='Edit') {
      this.dialogAction="Edit";
      this.action ="Actualizar";
      this.usuarioForm.patchValue(this.dialogData.data);
    }
  }

  //llama a la entidades existentes
  entidades() {
    this.entidadServices.GetEntidades().subscribe((response: any) => {
      console.log(response);
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
      fecha_nacimiento: this.fnac,
      fecha_registro: this.fechaActualString,
      password: formData.password,
      email: formData.email,
      telefono: formData.telefono,
      genero: formData.genero,
      rol: formData.rol,
      estado: 1,
      id_entidad: formData.entidad,
      ci: formData.ci
    }
    console.log(data);
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
    var data ={
   nombre: formData.nombre,
      ap_paterno: formData.ap_paterno,
      ap_materno: formData.ap_materno,
      fecha_nacimiento: formData.fecha_nacimiento,
      fecha_registro: formData.fecha_registro,
      password: formData.password,
      email: formData.email,
      telefono: formData.telefono,
      genero: formData.genero,
      rol: formData.rol,
      estado: formData.estado,
      id_entidad: formData.entidad,
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
