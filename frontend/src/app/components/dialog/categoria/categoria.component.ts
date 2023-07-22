import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoriaService } from 'src/app/services/categoria.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalCostants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.scss']
})
export class CategoriaComponent {
  onAddCategoria = new EventEmitter();
  onEditCategoria = new EventEmitter();
  categoriaForm:any= FormGroup;
  dialogAction:any="Add";
  action:any="Registrar";
  responseMessage:any;
  
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any,
  private formBuilder:FormBuilder,
  private categoriaService:CategoriaService,
  private dialogRef:MatDialogRef<CategoriaComponent>,
  private snackbarService:SnackbarService) { }

  ngOnInit(): void {
    this.categoriaForm = this.formBuilder.group({
      nombre: [null, [Validators.required]],
      comunidad: [null, [Validators.required]]
    });
    if(this.dialogData.action ==='Edit') {
      this.dialogAction="Edit";
      this.action ="Actualizar";
      this.categoriaForm.patchValue(this.dialogData.data);
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
    var formData = this.categoriaForm.value;
    var data ={
      nom_categoria: formData.nom_categoria,
      desc_categoria: formData.desc_categoria,
    }
    this.categoriaService.add(data).subscribe((response:any)=>{
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
    var formData = this.categoriaForm.value;
    var data ={
      id_categoria:this.dialogData.data.id_categoria,
      nom_categoria: formData.nom_categoria,
      desc_categoria: formData.desc_categoria,
    }
    this.categoriaService.update(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onEditCategoria.emit();
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
