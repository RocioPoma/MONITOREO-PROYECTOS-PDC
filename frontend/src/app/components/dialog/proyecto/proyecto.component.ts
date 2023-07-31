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


//importamos para searc selected
import { MatSelect } from '@angular/material/select';
import { Observable, ReplaySubject, Subject, map, startWith, take, takeUntil } from 'rxjs';
import { LineasEstrategicasService } from 'src/app/services/lineas-estrategicas.service';


//interface para area
interface area {
  value: string;
  viewValue: string;
}

interface LineaEstrategica {
  id_linea_estrategica: number;
  descripcion: string;
}

@Component({
  selector: 'app-proyecto',
  templateUrl: './proyecto.component.html',
  styleUrls: ['./proyecto.component.scss']
})
export class ProyectoComponent implements OnInit {
  onAddCategoria = new EventEmitter();
  onEditProyecto = new EventEmitter();
  proyectoForm: any = FormGroup;
  dialogAction: any = "Add";
  action: any = "Registrar";
  responseMessage: any;




  /*
    area: area[] = [
      { value: 'urbana', viewValue: 'Urbana' },
      { value: 'periurbana', viewValue: 'Periurbana' },
      { value: 'rural', viewValue: 'Rural' },
      { value: 'rural y urbano', viewValue: 'Rural y Urbano' },
    ];*/

  area = ['Urbana', 'Periurbana', 'Rural', 'Rural y Urbano'];

  //Pra almacenar los datos de servicios
  tipologia: any = [];
  categoria: any = [];
  cuenca: any = [];
  municipio: any = [];
  comunidad: any = [];
  unidad: any = [];
  LineaEstrategica: LineaEstrategica[] = [];

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

  /* protected lineaEstrategica: LineaEstrategica[] = [];
  public filteredLineasEstrategicas: ReplaySubject<LineaEstrategica[]> = new ReplaySubject<LineaEstrategica[]>(1);
   @ViewChild('singleSelect') singleSelect!: MatSelect; 
  private _onDestroy = new Subject<void>(); 
  */
  //---------------------------------------------------------------------------variables para select especial

  //filteredOptions!: Observable<string[]>;
  filteredOptions!: Observable<LineaEstrategica[]>;
  myControl = new FormControl('');


  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private ProyectoService: ProyectoService,
    private CategoriaServise: CategoriaService,
    private CuencaServise: CuencaService,
    private MunicipioServise: MunicipioService,
    private LineasEstrategicasService: LineasEstrategicasService,
    private ComunidadServise: ComunidadService,
    private UnidadServise: UnidadMedicionService,
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
      lineaEstrategica: ['', [Validators.required]],
      lineaEstrategicaSearch: ['', [Validators.required]]
    });
    if (this.dialogData.action === 'Edit') {
      this.dialogAction = "Edit";
      this.action = "Actualizar";
      this.proyectoForm.patchValue(this.dialogData.data);
      console.log(this.dialogData.data);
    }

    this.getTipologia();
    this.getCategoria();
    this.getCuenca();
    this.getMunicipio();
    this.getUnidad();
    this.getComunidad(1);
    this.getLineaEstrategicas();

    //------select especial
    // Escuchar los cambios en el filtro para el select
    /* this.proyectoForm.controls.lineaEstrategica.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterLineasEstrategicas();
      }); */
    //------select especial

      //---------------------------------------aqui el filtro
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),        
        map(value => this._filter(value || ''))
      );
      
      //---------------------------------------aqui el filtro


    
  }
  //----------------------------select especial
  /* ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected setInitialValue() {
    this.filteredLineasEstrategicas
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: LineaEstrategica, b: LineaEstrategica) => a && b && a.id_linea_estrategia === b.id_linea_estrategia;
      });
  }

  protected filterLineasEstrategicas() {
    const search = this.proyectoForm.controls.lineaEstrategica.value;
    if (!search) {
      this.filteredLineasEstrategicas.next(this.lineaEstrategica.slice());
      return;
    }

    this.filteredLineasEstrategicas.next(
      this.lineaEstrategica.filter((linea) => linea.descripcion.toLowerCase().indexOf(search.toLowerCase()) > -1)
    );
  } */
  //----------------------------select especial



  //------------------------------Forma 2

  //------------------------------Forma 2





  handleSubmit() {
    if (this.dialogAction === 'Edit') {
      this.edit();
    }
    else {
      this.add();
    }
  }

  /*------Servicios Extras-------*/
  //------------------- OBTENEMOS TIPOLOGIA
  getTipologia() {
    this.ProyectoService.getTipologia().subscribe((response: any) => {
      this.tipologia = response;
      this.LineaEstrategica = response;
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
    this.CategoriaServise.getCategoria().subscribe((response: any) => {
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
    this.CuencaServise.getCuenca().subscribe((response: any) => {
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
    this.MunicipioServise.getMunicipio().subscribe((response: any) => {
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
    this.UnidadServise.getUnidad().subscribe((response: any) => {
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
    this.ComunidadServise.getComunidad(id_municipio).subscribe((response: any) => {
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
  /*------Fin Servicios Extras--*/

  /*------Obtenemos Comunidades de un municipio */
  changeMunicipio(id_municipio: any) {
    console.log("Id del municipio", id_municipio);
  }

  //--------------------------nuevo get para los selects
  //----------------------obtenerLineasEstrategicas
  getLineaEstrategicas() {

    this.LineasEstrategicasService.getLineasEstrategicas().subscribe((response: any) => {
      this.LineaEstrategica = response;
      console.log(response);
      //this.filteredLineasEstrategicas.next(response.slice());
     
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
  //----------------------obtenerLineasEstrategicas
  //------------------- OBTENEMOS COMUNIDAD
  getLineaDeAccion(id_LineaEstrategia: any) {
    console.log(id_LineaEstrategia);
    
    /* this.ComunidadServise.getComunidad(id_municipio).subscribe((response: any) => {
      this.comunidad = response;
    }, (error: any) => {
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalCostants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalCostants.error);

    }); */
  }
  /*------Fin Servicios Extras--*/
  //--------------------------nuevo get 


  add() {
    var formData = this.proyectoForm.value;
    this.finicio = this.datePipe.transform(formData.fecha_inicio, 'yyyy-MM-dd')
    this.ffin = this.datePipe.transform(formData.fecha_fin, 'yyyy-MM-dd')
    /*  console.log(this.finicio.toISOString());
     console.log(this.ffin.toISOString()); */
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
      id_indicador: null,
      id_cuenca: formData.id_cuenca,
      id_accion_estrategica: null,
      estado: 'true',
      id_ciudad_comunidad: formData.id_ciudad_comunidad
      //municipio: formData.municipio
    }
    console.log(data);
    this.ProyectoService.add(data).subscribe((response: any) => {
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
      id_ciudad_comunidad: formData.id_ciudad_comunidad
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


  //forma2 de busqeuda
  
  private _filter(value: string): LineaEstrategica[]{
    console.log(value);
    const filterValue = value.toLowerCase();    
    return this.LineaEstrategica
    .filter(option => option.descripcion.toLowerCase().includes(filterValue))
  
  }



}
