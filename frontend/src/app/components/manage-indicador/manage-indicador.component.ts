import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { IndicadorService } from 'src/app/services/indicador.service';
import { IndicadorComponent } from '../dialog/indicador/indicador.component';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { error } from 'highcharts';
import { GlobalCostants } from 'src/app/shared/global-constants';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-manage-indicador',
  templateUrl: './manage-indicador.component.html',
  styleUrls: ['./manage-indicador.component.scss']
})
export class ManageIndicadorComponent {
  //variables
  displayedColumns: string[] = ['Numero', 'NombreIndicador', 'DescripcionIndicador', 'NombreUnidad', 'acciones'];
  dataSource: any;
  responseMessage: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  

  constructor(
    private IndicadorService: IndicadorService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router) { }

  ngOnInit(): void{
    this.tableData();
  }

  tableData(){
    this.IndicadorService.getIndicador().subscribe((response: any)=>{
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, (error:any)=>{
      if(error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalCostants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalCostants.error);
    })
  }

  //---------------------------------Fitrador----------------------------------------------------
  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator){
      this.dataSource.paginator.firstPage();
    }
  }
  
  handleEditAction(values: any){
    console.log(values);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      data: values
    }

    dialogConfig.width = "700px";
    const dialogRef = this.dialog.open(IndicadorComponent, dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close;
    });

    const sub = dialogRef.componentInstance.onEditIndicador.subscribe((response)=>{
      this.tableData;
    }); 
  }

  onChange(status: any, id_indicador: any){
    var data = {
      estado: status.toString(),
      id_indicador: id_indicador
    }
    console.log(data);
    this.IndicadorService.updateStatus(data).subscribe((response:any)=>{
      this.tableData();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBar(this.responseMessage, "succcess");
    }, (error: any) =>{
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalCostants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalCostants.error);
    })
  }
}
