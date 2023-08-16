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
import { DateAdapter } from '@angular/material/core';
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
export class ProyectoComponent implements OnInit {
  onAddProyecto = new EventEmitter();
  onEditProyecto = new EventEmitter();
  proyectoForm: any = FormGroup;
  dialogAction: any = "Add";
  action: any = "Registrar";
  responseMessage: any;


  //-------Para cargar archivo
  file!: File;
  fileSelected!: ArrayBuffer | string | null;

  area = ['Urbana', 'Periurbana', 'Rural', 'Rural y Urbano'];

  //-------Para almacenar los datos de servicios
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

  //-------Para filtrar LineaEstrategica
  filterLineaEstrategica: any[] = [];
  //-------selectedOptionControl = new FormControl();
  searchLineaEstrategica = new FormControl();

  //-------Para filtrar LineaDeAccion
  filterLineaDeAccion: any[] = [];
  searchLineaDeAccion = new FormControl();

  //-------Para filtrar AccionEstrategica
  filterAccionEstrategica: any[] = [];
  searchAccionEstrategica = new FormControl();

  //-------Para filtrar Indicadormuni
  filterIndicador: any[] = [];
  searchIndicador = new FormControl();


  //-------Para filtrar municipio
  filterComunidad: any[] = [];
  searchComunidad = new FormControl();
  selectedComunidadesControl = new FormControl();
  isDropdownOpen = false;


  ComunidadMultiCtrl = new FormControl();
  //prueba
  

  //-------Para agregar y quitar campos de Input
  alcances: { cantidad: any; unidad: any }[] = [];

  //-------variables para fecha
  fechaActual: Date | undefined;
  fechaActualString: any;
  finicio: any;
  ffin: any;

  //--------------------selections
  showAdditionalSelects = false;
  showSelector1 = false;
  showSelector2 = false;
  showSelector3 = false;
  //---------------------------------------------------------------------------variables para select especial
  @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();


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
    private datePipe: DatePipe,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.fechaActual = new Date();
    //Convierte la fecha en formato //dd/MM/yyyy
    this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
    // Convierte la fecha actual a string en formato "dd-MM-yyyy" 
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
      id_linea_estrategica: [null],
      id_linea_accion:[null],
      id_accion_estrategica: [null, [Validators.required]],
      id_indicador: [null, [Validators.required]],
      documento: [null],
      //para alcance
      alcance_cantidad: [null, [Validators.required]],
      alcance_id_unidad_medicion: [null, [Validators.required]],
    });
    if (this.dialogData.action === 'Edit') {
      this.dialogAction = "Edit";
      this.action = "Actualizar";
      this.showSelectors(true);
      this.proyectoForm.patchValue(this.dialogData.data);
      //
      // this.proyectoForm.id_ciudad_comunidad=this.dialogData.comunidades;
      // this.proyectoForm.id_accion_estrategica=this.dialogData.accion_estrategica;
      // this.proyectoForm.id_indicador=this.dialogData.a
      //
      console.log(this.dialogData.data)
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

  //------------- PARA LLAMAR A LA FUNCION (GREGAR O EDITAR) ---------------------
  handleSubmit() {
    if (this.dialogAction === 'Edit') {
      this.edit();
    }
    else {
      this.add();
    }
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
  //--------------- Fin Filtrar Select--------------------

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
    this.alcances.push({ cantidad: '', unidad: '' });
  }

  //----------- PARA QUITAR CAMPOS INPUT(CANTIDAD Y UNIDAD)
  removeInput() {
    if (this.alcances.length > 0) {
      this.alcances.pop();
    }
  }
  mostrarDatos() {
    console.log(this.alcances);
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

  onComunidadesSelectionChange(data: any) {
    console.log(data);
    this.comunidades = data;
    // Actualizar el filtro
    this.searchComunidad.setValue('');

  }
  /*------ Fin Servicios Extras ------*/

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }


  //------------------- AGREGAR PROYECTO
  add() {
    var formData = this.proyectoForm.value;
    this.finicio = this.datePipe.transform(formData.fecha_inicio, 'yyyy-MM-dd')
    this.ffin = this.datePipe.transform(formData.fecha_fin, 'yyyy-MM-dd')
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
      id_ciudad_comunidad: JSON.stringify(this.comunidades), //Enviamos un objeto de comunidades
      alcance: JSON.stringify(this.alcances) //Enviamos un objeto de alcances
    }

    console.log(data);

    this.ProyectoService.add1(data, this.file).subscribe((response: any) => {
      this.dialogRef.close();
      this.onAddProyecto.emit();
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

  //------------------- EDITAR
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
    console.log('Event')
    console.log(event.value);
    const selectedValue = event.value;
    // Aquí puedes poner la lógica para determinar cuándo mostrar los selectores adicionales.
    // Por ejemplo, si el valor seleccionado es "opcion1", muestras los tres selectores adicionales.
    if (selectedValue === 1) {
      this.showSelectors(true);
    } else {
      // Si el valor seleccionado es diferente, ocultas los selectores adicionales.
      this.showSelectors(false);
    }
  }
  showSelectors(status: boolean) {
    this.showAdditionalSelects = status;
    this.showSelector1 = status;
    this.showSelector2 = status;
    this.showSelector3 = status;

  }
}
