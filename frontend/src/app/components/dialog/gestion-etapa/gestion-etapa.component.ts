import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EtapaService } from 'src/app/services/etapa.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { TipologiaService } from 'src/app/services/tipologia.service';
import { GlobalCostants } from 'src/app/shared/global-constants';


@Component({
  selector: 'app-gestion-etapa',
  templateUrl: './gestion-etapa.component.html',
  styleUrls: ['./gestion-etapa.component.scss']
})
export class GestionEtapaComponent {
  onAddEtapa = new EventEmitter();
  onEditEtapa = new EventEmitter();
  etapaForm:any= FormGroup;
  dialogAction:any="Add";
  action:any="Registrar";
  responseMessage:any;
  tipologia:any;
  
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any,
  private formBuilder:FormBuilder,
  private etapaService: EtapaService,
  private tipoService: TipologiaService,
  private dialogRef:MatDialogRef<GestionEtapaComponent>,
  private snackbarService:SnackbarService) { }

  ngOnInit(): void {
    this.llamarTipologia();
    this.etapaForm = this.formBuilder.group({
      nom_etapa: [null, [Validators.required]],
      peso_etapa: [null, [Validators.required]],
      desc_etapa: [null, [Validators.required]],
      id_tipologia:[null, [Validators.required]]
    });
    if(this.dialogData.action ==='Edit') {
      this.dialogAction="Edit";
      this.action ="Actualizar";
      this.etapaForm.patchValue(this.dialogData.data);
    }
  }

  handleSubmit(){
    if(this.dialogAction ==='Edit') {
      this.edit();
    }
    else{
      //this.add();
    }
  }

  /* add(){
    var formData = this.etapaForm.value;
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
 */
  edit(){
    var formData = this.etapaForm.value;
    var data ={
      id_etapa:this.dialogData.data.id_etapa,
      nom_etapa: formData.nom_etapa,
      peso_etapa: formData.peso_etapa,
      desc_etapa: formData.desc_etapa,
      id_tipologia:formData.id_tipologia,
      estado: this.dialogData.data.estado     
    }
    console.log(data);
     this.etapaService.update(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onEditEtapa.emit();
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

        llamarTipologia(){
          this.tipoService.geTipologia().subscribe((response:any)=>{
            console.log(response);
           this.tipologia=response;
          }) 
        }
}
