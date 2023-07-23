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
import { ProyectoComponent } from  "../dialog/proyecto/proyecto.component";
//confirmation
import { ConfirmationComponent } from "../dialog/confirmation/confirmation.component";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';




@Component({
  selector: 'app-manage-proyecto',
  templateUrl: './manage-proyecto.component.html',
  styleUrls: ['./manage-proyecto.component.scss'],
 // standalone: true,
  //imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule],
})
export class ManageProyectoComponent  {
  displayedColumns: string[] = ['id', 'name', 'progress', 'fruit'];
  dataSource: any;
  responseMessage: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private ProyectoServices: ProyectoService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router
  ) {}
  


    ngOnInit(): void {
      this.tableData();   
     
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
    //---------------------------------Fitrador----------------------------------------------------
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
    const dialogRef = this.dialog.open(ProyectoComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddCategoria.subscribe((response) => {
      this.tableData();
    })
  }

 /*  handleEditAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',     
      data: values
    }
   
    dialogConfig.width = "700px";
    const dialogRef = this.dialog.open(MunicipioComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onEditCategoria.subscribe((response) => {
      this.tableData();
    })
  }
 
  handleDeleteAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: ' eliminar Categoria '+ values.nombre_municipio
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
      this.deleteCategoria(values.id_municipio);
      dialogRef.close();
    });
  }

  deleteCategoria(id_municipio: any) {
    this.MunicipioServices.delete(id_municipio).subscribe((response: any) => {
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

  onChange(status: any, id_municipio: any) {
    
    var data = {
      estado: status.toString(),
      id_municipio: id_municipio
    }
    
    this.MunicipioServices.updateStatus(data).subscribe((response: any) => {
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
  } */



}





