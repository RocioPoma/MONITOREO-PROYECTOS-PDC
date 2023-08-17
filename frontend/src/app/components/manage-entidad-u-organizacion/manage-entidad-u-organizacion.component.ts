import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { CategoriaService } from 'src/app/services/categoria.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalCostants } from 'src/app/shared/global-constants';

import { EntidadOrganizacionComponent } from "../dialog/entidad-organizacion/entidad-organizacion.component";
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EntidadService } from 'src/app/services/entidad.service';


@Component({
  selector: 'app-manage-entidad-u-organizacion',
  templateUrl: './manage-entidad-u-organizacion.component.html',
  styleUrls: ['./manage-entidad-u-organizacion.component.scss']
})
export class ManageEntidadUOrganizacionComponent {
  displayedColumns: string[] = ['numero', 'nombre', 'comentario', 'acciones']; 
  dataSource: any;
  responseMessage: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private entidadServices: EntidadService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router) { }
 
  ngOnInit(): void {
    this.tableData();
  }

  tableData() {
    this.entidadServices.GetEntidades().subscribe((response: any) => {
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  } 

 

  handleAddAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Add'
    }
    dialogConfig.width = "700px";
    const dialogRef = this.dialog.open(EntidadOrganizacionComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddEntidad.subscribe((response) => {
      this.tableData();
    })
  }

  handleEditAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      data: values
    }
    dialogConfig.width = "700px";
    const dialogRef = this.dialog.open(EntidadOrganizacionComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onEditEntidad.subscribe((response) => {
      this.tableData();
    })
  }
 
  handleDeleteAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: ' eliminar Entidad  '+ values.nombre_entidad
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
      this.deleteEntidad(values.id_entidad);
      dialogRef.close();
    });
  }

  deleteEntidad(id_entidad: any) {
    this.entidadServices.delete(id_entidad).subscribe((response: any) => {
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

  onChange(status: any, id_entidad: any) {
    var data = {
      estado: status.toString(),
      id_entidad: id_entidad
    }
    this.entidadServices.updateStatus(data).subscribe((response: any) => {
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




  
}
