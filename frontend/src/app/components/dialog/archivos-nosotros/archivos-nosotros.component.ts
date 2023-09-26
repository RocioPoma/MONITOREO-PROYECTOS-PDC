import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoriaService } from 'src/app/services/categoria.service';
import { NosotrosService } from 'src/app/services/nosotros.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalCostants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-archivos-nosotros',
  templateUrl: './archivos-nosotros.component.html',
  styleUrls: ['./archivos-nosotros.component.scss']
})
export class ArchivosNosotrosComponent {
  onAddNosotros = new EventEmitter();
  onEditNosotros = new EventEmitter();
  NosotrosForm:any= FormGroup;
  dialogAction:any="Add";
  action:any="Registrar";
  responseMessage:any;
  selectedFile: File  ;
  selectedFile2: any = null;
  selectedFile3: any = null;
  selectedFile4: any = null;
  id_nosotros:any;

  initialFile:any;
  initialFile2:any;
  initialFile3:any;
  initialFile4:any;
  
 
  
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any,
  private formBuilder:FormBuilder,
  private categoriaService:CategoriaService,
  private nosotrosService: NosotrosService,

  private dialogRef:MatDialogRef<ArchivosNosotrosComponent>,
  private snackbarService:SnackbarService) { }


  ngOnInit(): void {
    this.NosotrosForm = this.formBuilder.group({
      descripcion: ['', [Validators.required]],
      link_video: ['', [Validators.required]],
      documentoG: ['', [Validators.required]]
    });
    if(this.dialogData.action ==='Edit') {
      this.dialogAction="Edit";
      this.action ="Actualizar";
      this.NosotrosForm.patchValue(this.dialogData.data);
      console.log(this.dialogData.data);
      //this.selectedFile=this.dialogData.data.documento_general;
       // Crear un nuevo objeto File con el nombre inicial
     this.initialFile = new File([new Blob()], this.dialogData.data.documento_general);
     this.selectedFile=this.initialFile;

     this.initialFile2 = new File([new Blob()], this.dialogData.data.manual_usuario);
     this.selectedFile2=this.initialFile2;

     this.initialFile3 = new File([new Blob()], this.dialogData.data.manual_desarrollo);
     this.selectedFile3=this.initialFile3;

     this.initialFile4 = new File([new Blob()], this.dialogData.data.ieee_830);
     this.selectedFile4=this.initialFile4;
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
    var formData = this.NosotrosForm.value;
    var data ={
      nom_categoria: formData.nom_categoria,
      desc_categoria: formData.desc_categoria,
    }
    this.categoriaService.add(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onAddNosotros.emit();
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
    var formData = this.NosotrosForm.value;
    console.log(this.dialogData.data);
    var data ={
      descripcion:this.dialogData.data.descripcion,
      nom_categoria: formData.nom_categoria,
      desc_categoria: formData.desc_categoria,
    }
    this.categoriaService.update(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onEditNosotros.emit();
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
  uploadFiles(){
        var formData2 = this.NosotrosForm.value;
        const formData = new FormData();
        formData.append('id',this.dialogData.data.id);
        formData.append('descripcion', formData2.descripcion);
        formData.append('link_video',formData2.link_video);
        formData.append('files1', this.selectedFile);
        formData.append('files2', this.selectedFile2);
        formData.append('files3', this.selectedFile3);
        formData.append('files4', this.selectedFile4);
        this.nosotrosService.upload(formData).subscribe((response:any)=>{
          this.dialogRef.close();
          this.onEditNosotros.emit();
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
        });
  }


  //subida de archivo
    onFileSelected(event: any): void {
      this.selectedFile=null;
        this.selectedFile = event.target.files[0] ?? null;
        console.log(this.selectedFile);
    }
    
    onFileSelected2(event: any): void {
        this.selectedFile2 = event.target.files[0] ?? null;
    }
  
    onFileSelected3(event: any): void {
        this.selectedFile3 = event.target.files[0] ?? null;
    }
  
    onFileSelected4(event: any): void {
        this.selectedFile4 = event.target.files[0] ?? null;
    }

}