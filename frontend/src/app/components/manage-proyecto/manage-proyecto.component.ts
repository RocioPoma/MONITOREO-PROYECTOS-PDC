import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
//servicio
import { ProyectoService } from 'src/app/services/proyecto.service';

import { SnackbarService } from 'src/app/services/snackbar.service';
//globales constants
import { GlobalCostants } from 'src/app/shared/global-constants';
//dialogMunicipio
import { ProyectoComponent } from "../dialog/proyecto/proyecto.component";
//confirmation
import { ConfirmationComponent } from "../dialog/confirmation/confirmation.component";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MunicipioService } from 'src/app/services/municipio.service';
import { SeguimientoProyectoComponent } from '../dialog/seguimiento-proyecto/seguimiento-proyecto.component';




@Component({
  selector: 'app-manage-proyecto',
  templateUrl: './manage-proyecto.component.html',
  styleUrls: ['./manage-proyecto.component.scss'],
  // standalone: true,
  //imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule],
})
export class ManageProyectoComponent {
  displayedColumns: string[] = ['Nro', 'NombreProyecto', 'FechaInicio', 'FechaFin', 'NombreMunicipio', 'NombreCuenca', 'NombreCategoria', 'NombreTipologia', 'documento', 'seguimiento', 'Acciones'];
  dataSource: any;
  responseMessage: any;
  proyecto:any;
  municipios: any = [];
  openSeguimientosProyecto=false; //ABRIR LOS SEGUIMIENTOS DE ETAPAS DE PROYECTO
  apiResponse: any = []; //para filtrar con el select

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private ProyectoServices: ProyectoService,
    private MunicipioService: MunicipioService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router
  ) { }



  ngOnInit(): void {
    this.tableData();
    this.getMunicipio();

  }


  tableData() {
    this.ProyectoServices.getProyecto().subscribe((response: any) => {
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, (error: any) => {
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalCostants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalCostants.error);
    })
  }

  //------------------- OBTENEMOS MUNICIPIO
  getMunicipio() {
    this.MunicipioService.getMunicipio().subscribe((response: any) => {
      this.municipios = response;
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

  //---------------------------------Fitrador----------------------------------------------------
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyMunicipioFilter(filterValue: String) {
    filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: any, filter: string) => data.nombre_municipio.trim().toLowerCase() === filter;
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  /*
  filterSelection($event: any) {
    let filterData = _.filtar(this.apiResponse, (item) => {
      return item.NombreMunicipio.toLowerCase() == $event.value.toLowerCase();
    })
    if ($event.value == 'Todos') {
      this.tableData();
    } else {
      this.dataSource = new MatTableDataSource(filterData);
    }
  }*/


  handleAddAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Add'
    }
    dialogConfig.width = "700px";
    const dialogRef = this.dialog.open(ProyectoComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddProyecto.subscribe((response) => {
      this.tableData();
    })
  }

  //------------ LLAMA AL MODAL PARA EDITAR
  handleEditAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      data: values
    }
    console.log(values);
    dialogConfig.width = "700px";
    const dialogRef = this.dialog.open(ProyectoComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onEditProyecto.subscribe((response) => {
      this.tableData();
    })
  }

   //------------ LLAMA AL MODAL PARA EL SEGUIMIENTO DE PROYECTO
   handleSeguimientoAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'seguimiento',
      data: values
    }
    console.log(values);
    dialogConfig.width = "820px";
    const dialogRef = this.dialog.open(SeguimientoProyectoComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddSeguimiento.subscribe((response) => {
      this.tableData();
    })
  }

  handleDeleteAction(values: any) {
    console.log(values);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: ' eliminar proyecto ' + values.nom_proyecto
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
      this.deleteProyecto(values.id_proyecto);
      dialogRef.close();
    });
  }

  deleteProyecto(id_proyecto: any) {
    this.ProyectoServices.delete(id_proyecto).subscribe((response: any) => {
      this.tableData();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBar(this.responseMessage, "success");
    }, (error: any) => {
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalCostants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalCostants.error);
    })
  }

  onChange(status: any, id_proyecto: any) {

    var data = {
      estado: status.toString(),
      id_proyecto: id_proyecto
    }

    this.ProyectoServices.updateStatus(data).subscribe((response: any) => {
      this.tableData();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBar(this.responseMessage, "success");
    }, (error: any) => {
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalCostants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalCostants.error);
    })
  }
  openEtapasProyecto(proyecto:any){
    this.proyecto=proyecto;
    // console.log(proyecto);
    this.openSeguimientosProyecto= !this.openSeguimientosProyecto;
    // console.log(this.openSeguimientosProyecto);
  }
}





