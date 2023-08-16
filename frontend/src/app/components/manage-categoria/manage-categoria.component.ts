import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { CategoriaService } from 'src/app/services/categoria.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalCostants } from 'src/app/shared/global-constants';
import { CategoriaComponent } from '../dialog/categoria/categoria.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-manage-categoria',
  templateUrl: './manage-categoria.component.html',
  styleUrls: ['./manage-categoria.component.scss'],
  //imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule],
})
export class ManageCategoriaComponent {
  displayedColumns: string[] = ['numero', 'nombre', 'descripcion', 'acciones']; 
  dataSource: any;
  responseMessage: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private categoriaService: CategoriaService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router) { }
 
  ngOnInit(): void {
    this.tableData();
  }

  tableData() {
    this.categoriaService.getCategoria().subscribe((response: any) => {
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

 /*   //--------------------------------Paginador -------------------------------------
   ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }*/
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
    const dialogRef = this.dialog.open(CategoriaComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddCategoria.subscribe((response) => {
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
    const dialogRef = this.dialog.open(CategoriaComponent, dialogConfig);
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
      message: ' eliminar Categoria '+ values.nom_categoria
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
      this.deleteCategoria(values.id_categoria);
      dialogRef.close();
    });
  }

  deleteCategoria(id_categoria: any) {
    this.categoriaService.delete(id_categoria).subscribe((response: any) => {
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

  onChange(status: any, id_categoria: any) {
    var data = {
      estado: status.toString(),
      id_categoria: id_categoria
    }
    this.categoriaService.updateStatus(data).subscribe((response: any) => {
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
