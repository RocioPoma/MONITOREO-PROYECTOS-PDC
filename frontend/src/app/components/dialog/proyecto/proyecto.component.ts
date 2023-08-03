import { AfterViewInit, Component, EventEmitter, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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


//importamos para search selected
import { MatSelect } from '@angular/material/select';
import { Observable, ReplaySubject, Subject, map, startWith, take, takeUntil } from 'rxjs';
import { LineasEstrategicasService } from 'src/app/services/lineas-estrategicas.service';

import { Bank, BANKS } from './data';
import { IndicadorService } from 'src/app/services/indicador.service';

import { DomSanitizer } from '@angular/platform-browser';
//interface para area
interface area {
  value: string;
  viewValue: string;
}

interface LineasEstrategica {
  id_linea_estrategica: number;
  descripcion: string;
}

@Component({
  selector: 'app-proyecto',
  templateUrl: './proyecto.component.html',
  styleUrls: ['./proyecto.component.scss']
})
export class ProyectoComponent implements OnInit, AfterViewInit, OnDestroy {
  onAddCategoria = new EventEmitter();
  onEditProyecto = new EventEmitter();
  proyectoForm: any = FormGroup;
  dialogAction: any = "Add";
  action: any = "Registrar";
  responseMessage: any;
 

  //Pra cargar archivo
  file!: File;
  photoSelected!: ArrayBuffer | string | null;

  fileSelected!: ArrayBuffer | string | null;
  image = '';
  //opcion 2
  selectedFile!: File;
  selectedFileName!: string;

  area = ['Urbana', 'Periurbana', 'Rural', 'Rural y Urbano'];

  //Pra almacenar los datos de servicios
  tipologia: any = [];
  categoria: any = [];
  cuenca: any = [];
  municipio: any = [];
  comunidad: any[] = [];
  unidad: any = [];
  LineaEstrategica: any[] = [];
  LineaDeAccion: any[] = [];
  AccionEstrategica: any[] = [];
  indicador: any[] = [];
  comunidades: any[] = [];

  //-----Para filtrar LineaEstrategica
  filterLineaEstrategica: any[] = [];
  //selectedOptionControl = new FormControl();
  searchLineaEstrategica = new FormControl();

  //-----Para filtrar LineaDeAccion
  filterLineaDeAccion: any[] = [];
  searchLineaDeAccion = new FormControl();

  //-----Para filtrar AccionEstrategica
  filterAccionEstrategica: any[] = [];
  searchAccionEstrategica = new FormControl();

  //-----Para filtrar Indicador
  filterIndicador: any[] = [];
  searchIndicador = new FormControl();


  //-----Para filtrar municipio
  filterComunidad: any[] = [];
  searchComunidad = new FormControl();
  /** control for the selected bank for multi-selection */
  public ComunidadMultiCtrl: FormControl = new FormControl();




  //Fin prueba

  //variables para fecha
  fechaActual: Date | undefined;
  fechaActualString: any;
  finicio: any;
  ffin: any;

  //--------------------selectiones
  showAdditionalSelects = false;
  showSelector1 = false;
  showSelector2 = false;
  showSelector3 = false;
  //---------------------------------------------------------------------------variables para select especial



  @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();




  //---------------------------------------------------------------------------variables para select especial

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private _sanitizer: DomSanitizer,
    private ProyectoService: ProyectoService,
    private CategoriaService: CategoriaService,
    private CuencaService: CuencaService,
    private MunicipioService: MunicipioService,
    private LineasEstrategicasService: LineasEstrategicasService,
    private ComunidadService: ComunidadService,
    private UnidadService: UnidadMedicionService,
    private IndicadorService: IndicadorService,
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
    this.getTipologia();
    this.getCategoria();
    this.getCuenca();
    this.getMunicipio();
    this.getUnidad();
    this.getComunidad(1);
    this.getLineaEstrategicas();
    this.getIndicador();

    this.proyectoForm = this.formBuilder.group({
      id_tipologia: [null, [Validators.required]],
      id_categoria: [null, [Validators.required]],
      nom_proyecto: [null, [Validators.required]],
      fecha_inicio: [null, [Validators.required]],
      fecha_fin: [null, [Validators.required]],
      fecha_registro: [null, [Validators.required]],
      area: [null, [Validators.required]],
      id_cuenca: [null, [Validators.required]],
      coordenada_x: [null, [Validators.required]],
      coordenada_y: [null, [Validators.required]],
      estado: [null, [Validators.required]],
      mujeres: [null, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      hombres: [null, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      cantidad: [null, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      id_ciudad_comunidad: [null, [Validators.required]],
      id_municipio: [null, [Validators.required]],
      //nuevos casillas  
      id_unidad_medicion: [null, [Validators.required]],
      id_accion_estrategica: [null, [Validators.required]],
      id_indicador: [null, [Validators.required]],
      documento: [null]

    });
    if (this.dialogData.action === 'Edit') {
      this.dialogAction = "Edit";
      this.action = "Actualizar";
      this.proyectoForm.patchValue(this.dialogData.data);
      this.getComunidad(this.dialogData.data.id_municipio);
    }


    //---------- Filtrar Select -------------------------
    this.searchLineaEstrategica.valueChanges.subscribe(searchTerm => {
      this.filterOptions(searchTerm);
    });

    this.searchLineaDeAccion.valueChanges.subscribe(searchTerm => {
      this.filterOptionsLineaDeAccion(searchTerm);
    });

    this.searchAccionEstrategica.valueChanges.subscribe(searchTerm => {
      this.filterOptionsAccionEstrategica(searchTerm);
    });

    this.searchIndicador.valueChanges.subscribe(searchTerm => {
      this.filterOptionsIndicador(searchTerm);
    });

    this.searchComunidad.valueChanges.subscribe(searchTerm => {
      this.filterOptionsComunidad(searchTerm);
    });
    //---------- Fin Filtrar Select--------------------
  }


  //---------- Filtrar Select -------------------------
  filterOptions(searchTerm: string): void {
    this.filterLineaEstrategica = this.LineaEstrategica.filter(option =>
      option.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  filterOptionsLineaDeAccion(searchTerm: string): void {
    this.filterLineaDeAccion = this.LineaDeAccion.filter(option =>
      option.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  filterOptionsAccionEstrategica(searchTerm: string): void {
    this.filterAccionEstrategica = this.AccionEstrategica.filter(option =>
      option.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  filterOptionsIndicador(searchTerm: string): void {
    this.filterIndicador = this.indicador.filter(option =>
      option.nombre_indicador.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  filterOptionsComunidad(searchTerm: string): void {
    this.filterComunidad = this.comunidad.filter(option =>
      option.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  //---------- Fin Filtrar Select--------------------

  //--------------- SELECCIONAR ARCHIVO ------------------
  selectFile(event: any): any {
    this._sanitizer.bypassSecurityTrustStyle(event.target.files);
    if (event.target.files && event.target.files[0]) {
      this.file = (<File>event.target.files[0]);
      //image preview
      const reader = new FileReader();
      reader.onload = e => this.fileSelected = reader.result;

      reader.readAsDataURL(this.file);
    }
  }

  //opcion2
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.selectedFileName = this.selectedFile?.name || '';
  }

  //fin opcion 2
  //------------- FIN SELECCIONAR ARCHIVO ---------------------

  handleSubmit() {
    if (this.dialogAction === 'Edit') {
      this.edit();
    }
    else {
      this.add1();
    }
  }


  /*---------------------INICIO SERVICIOS ESTRAS --------------*/
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
    this.CategoriaService.getCategoria().subscribe((response: any) => {
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
    this.CuencaService.getCuenca().subscribe((response: any) => {
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
    this.MunicipioService.getMunicipio().subscribe((response: any) => {
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
    this.UnidadService.getUnidad().subscribe((response: any) => {
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
  getComunidad(id_municipio: any) {
    this.ComunidadService.getComunidad(id_municipio).subscribe((response: any) => {
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

  /*------Obtenemos Comunidades de un municipio */
  changeMunicipio(id_municipio: any) {
    console.log("Id del municipio", id_municipio);
  }

  //------------------- OBTENEMOS LINEA ESTRATEGICA
  getLineaEstrategicas() {
    this.LineasEstrategicasService.getLineasEstrategicas().subscribe((response: any) => {
      this.LineaEstrategica = response;
      this.filterLineaEstrategica = response;
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

  //------------------- OBTENEMOS LINEA DE ACCION segun id_linea_estrategica
  getLineaDeAccion(id_linea_estrategica: any) {
    console.log("Id Linea Estrategica " + id_linea_estrategica);
    this.LineasEstrategicasService.getLineaDeAccion(id_linea_estrategica).subscribe((response: any) => {
      this.LineaDeAccion = response;
      this.filterLineaDeAccion = response;
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

  //------------------- OBTENEMOS ACCION ESTRATEGICA segun id_linea_accion
  getAccionEstrategica(id_linea_accion: any) {
    console.log("Id Linea de accion " + id_linea_accion);
    this.LineasEstrategicasService.getAccionEstrategica(id_linea_accion).subscribe((response: any) => {
      this.AccionEstrategica = response;
      this.filterAccionEstrategica = response;
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

  //------------------- OBTENEMOS INDICADOR
  getIndicador() {
    this.IndicadorService.getIndicador().subscribe((response: any) => {
      this.indicador = response;
      this.filterIndicador = response;
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

  getcomunidades(data: any) {
    console.log(data);
    this.comunidades = data;

  }

  /*------Fin Servicios Extras--*/


  add() {
    const fd = new FormData();
    var formData = this.proyectoForm.value;
    this.finicio = this.datePipe.transform(formData.fecha_inicio, 'yyyy-MM-dd')
    this.ffin = this.datePipe.transform(formData.fecha_fin, 'yyyy-MM-dd')

    fd.append('nom_proyecto',formData.nom_proyecto),
    fd.append('fecha_inicio',this.finicio),
    fd.append('fecha_fin',this.ffin),
    fd.append('fecha_registro',formData.fecha_registro),
    fd.append('area',formData.area),
    fd.append('coordenada_x',formData.coordenada_x),
    fd.append('coordenada_y',formData.coordenada_y),
    fd.append('cantidad',formData.cantidad),
    fd.append('hombres',formData.hombres),
    fd.append('mujeres',formData.mujeres),
    fd.append('id_categoria',formData.id_categoria),
    fd.append('id_tipologia',formData.id_tipologia),
    fd.append('id_unidad_medicion',formData.id_unidad_medicion),
    fd.append('id_indicador',formData.id_indicador),
    fd.append('id_cuenca',formData.id_cuenca),
    fd.append('id_accion_estrategica',formData.id_accion_estrategica),
    fd.append('estado',formData.estado),
    fd.append('id_ciudad_comunidad',JSON.stringify(this.comunidades)),
    fd.append("file",this.selectedFile, this.selectedFile.name);
   // console.log(this.fechaActualString);

   console.log("FD: "+fd);

    this.ProyectoService.add(fd).subscribe((response: any) => {
      this.dialogRef.close();
      this.onAddCategoria.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackBar(this.responseMessage, "success");
    }, (error: any) => {
      this.dialogRef.close();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalCostants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalCostants.error);
    })
    /*  this.ProyectoService.add(data).subscribe((response: any) => {
       this.dialogRef.close();
       this.onAddCategoria.emit();
       this.responseMessage = response.message;
       this.snackbarService.openSnackBar(this.responseMessage, "success");
     }, (error: any) => {
       this.dialogRef.close();
       if (error.error?.message) {
         this.responseMessage = error.error?.message;
       }
       else {
         this.responseMessage = GlobalCostants.genericError;
       }
       this.snackbarService.openSnackBar(this.responseMessage, GlobalCostants.error);
     }) */
  }

  add1() {
    var formData = this.proyectoForm.value;
    this.finicio = this.datePipe.transform(formData.fecha_inicio, 'yyyy-MM-dd')
    this.ffin = this.datePipe.transform(formData.fecha_fin, 'yyyy-MM-dd')
    /*console.log(this.finicio.toISOString());
     console.log(this.ffin.toISOString()); D */
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
      id_categoria: formData.id_categoria,
      id_tipologia: formData.id_tipologia,
      id_unidad_medicion: formData.id_unidad_medicion,
      id_indicador: formData.id_indicador,
      id_cuenca: formData.id_cuenca,
      id_accion_estrategica: formData.id_accion_estrategica,
      estado: 'true',
      id_ciudad_comunidad: JSON.stringify(this.comunidades),
    }
    console.log(data);

    this.ProyectoService.add1(data, this.file).subscribe((response: any) => {
      this.dialogRef.close();
      this.onAddCategoria.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackBar(this.responseMessage, "success");
    }, (error: any) => {
      this.dialogRef.close();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalCostants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalCostants.error);
    })
    /*  this.ProyectoService.add(data).subscribe((response: any) => {
       this.dialogRef.close();
       this.onAddCategoria.emit();
       this.responseMessage = response.message;
       this.snackbarService.openSnackBar(this.responseMessage, "success");
     }, (error: any) => {
       this.dialogRef.close();
       if (error.error?.message) {
         this.responseMessage = error.error?.message;
       }
       else {
         this.responseMessage = GlobalCostants.genericError;
       }
       this.snackbarService.openSnackBar(this.responseMessage, GlobalCostants.error);
     }) */
  }

  edit() {
    var formData = this.proyectoForm.value;
    console.log(this.proyectoForm.value);
    var data = {
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
      id_categoria: formData.id_categoria,
      id_tipologia: formData.id_tipologia,
      id_indicador: null,
      id_cuenca: formData.id_cuenca,
      id_accion_estrategica: null,
      estado: 'true',
      id_ciudad_comunidad: this.comunidades //Enviamos un objeto de comunidades
    }
    this.ProyectoService.update(data).subscribe((response: any) => {
      this.dialogRef.close();
      this.onEditProyecto.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackBar(this.responseMessage, "success");
    }, (error: any) => {
      this.dialogRef.close();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalCostants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalCostants.error);
    })
  }
  //selectores
  onCuencaSelected(event: any) {
    console.log(event.value);
    const selectedValue = event.value;
    // Aquí puedes poner la lógica para determinar cuándo mostrar los selectores adicionales.
    // Por ejemplo, si el valor seleccionado es "opcion1", muestras los tres selectores adicionales.
    if (selectedValue === 1) {
      this.showAdditionalSelects = true;
      this.showSelector1 = true;
      this.showSelector2 = true;
      this.showSelector3 = true;
    } else {
      // Si el valor seleccionado es diferente, ocultas los selectores adicionales.
      this.showAdditionalSelects = false;
      this.showSelector1 = false;
      this.showSelector2 = false;
      this.showSelector3 = false;
    }
  }

  //----------------------------------------------------busqueda 1
  ngAfterViewInit() {
    //this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }


}
