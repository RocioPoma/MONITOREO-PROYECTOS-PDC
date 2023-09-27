import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
//servicio

import { NosotrosService } from 'src/app/services/nosotros.service';

import { SnackbarService } from 'src/app/services/snackbar.service';
//globales constants
import { GlobalCostants } from 'src/app/shared/global-constants';
//dialogMunicipio
//import { MunicipioComponent } from "../dialog/municipio/municipio.component";
import { ArchivosNosotrosComponent } from "../dialog/archivos-nosotros/archivos-nosotros.component";
//confirmation
import { ConfirmationComponent } from "../dialog/confirmation/confirmation.component";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

//pdf importaciones
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { image } from 'html2canvas/dist/types/css/types/image';
import { Utils } from 'src/app/services/utils';
import { DatePipe } from '@angular/common';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-manage-nosotros',
  templateUrl: './manage-nosotros.component.html',
  styleUrls: ['./manage-nosotros.component.scss']
})
export class ManageNosotrosComponent {
  //variables 
  displayedColumns: string[] = ['numero', 'descripcion', 'link_video', 'documentos_general', 'manual_usuario', 'manual_desarrollo', 'iee_830'];
  dataSource: any;
  responseMessage: any;

  //variables para pdf
  usuario: any;
  ap: any;
  am: any;
  tabla: any;
  logoDataUrl: string;
  infoFiltrada: any;
  pipe = new DatePipe('en-US');
  archivo: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private nosotros: NosotrosService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router) { }

  ngOnInit(): void {
    this.tableData();
    //para usaurio de pdf    
    const nombreString = localStorage.getItem('nombre');
    const ApString = localStorage.getItem('ap_paterno');
    const AmString = localStorage.getItem('ap_materno');
    this.usuario = nombreString ? (nombreString) : null;
    this.ap = ApString ? (ApString) : null;
    this.am = AmString ? (AmString) : null;
    //------------------------------------
  }


  tableData() {
    this.nosotros.getNosotros().subscribe((response: any) => {
      this.dataSource = new MatTableDataSource(response);
      this.tabla = response[0];
      console.log(response[0]);
      this.archivo = response[0];
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
    //pdf
    //dar valor a variables para su impresion
    console.log(this.dataSource.filteredData);
    this.infoFiltrada = this.dataSource.filteredData;
    this.tabla = this.infoFiltrada;
    //pdf
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
    const dialogRef = this.dialog.open(ArchivosNosotrosComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddNosotros.subscribe((response) => {
      this.tableData();
    })
  }

  handleEditAction() {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      data: this.archivo
    }

    dialogConfig.width = "700px";
    const dialogRef = this.dialog.open(ArchivosNosotrosComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onEditNosotros.subscribe((response) => {
      this.tableData();
    })
  }

}
