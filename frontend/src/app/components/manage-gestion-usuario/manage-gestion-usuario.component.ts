import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { GlobalCostants } from 'src/app/shared/global-constants';
import { GestionusuarioComponent} from 'src/app/components/dialog/gestionusuario/gestionusuario.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { EntidadService } from 'src/app/services/entidad.service';
import  {jsPDF} from 'jspdf';
import html2canvas, {Options} from 'html2canvas';


@Component({
  selector: 'app-manage-gestion-usuario',
  templateUrl: './manage-gestion-usuario.component.html',
  styleUrls: ['./manage-gestion-usuario.component.scss']
})
export class ManageGestionUsuarioComponent {
  displayedColumns: string[] = ['numero', 'Ci', 'Nombre', 'Rol', 'Entidad', 'Fecha', 'Accion']; 
  dataSource: any;
  entidad: any;
  responseMessage: any;
  usuario: any;
  ap:any;
  am:any;
  

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private usuarioService: UsuarioService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router,
    private entidadServices: EntidadService
    ) { }
 
  ngOnInit(): void {
    this.tableData();
    this.entidades();  

    //para imprimier el usuario q hace reporte
    const nombreString = localStorage.getItem('nombre');
    const ApString = localStorage.getItem('ap_paterno');
    const AmString = localStorage.getItem('ap_materno');
   

    this.usuario = nombreString? (nombreString): null;
    this.ap = ApString ? (ApString ): null;
    this.am = AmString? (AmString): null;
  
    
  }

  tableData() {
    this.usuarioService.getusuario().subscribe((response: any) => {
      console.log(response);
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

  entidades() {
    this.entidadServices.GetEntidades().subscribe((response: any) => {
      console.log(response);
      this.entidad=response;    
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
  const dialogRef = this.dialog.open(GestionusuarioComponent, dialogConfig);
  this.router.events.subscribe(() => {
    dialogRef.close();
  });
  const sub = dialogRef.componentInstance.onAddUser.subscribe((response) => {
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
  const dialogRef = this.dialog.open(GestionusuarioComponent, dialogConfig);
  this.router.events.subscribe(() => {
    dialogRef.close();
  });
  const sub = dialogRef.componentInstance.onEditUser.subscribe((response) => {
    this.tableData();
  })
}

handleDeleteAction(values: any) {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.data = {
    message: ' eliminar Usuario '+ values.nombre
  };
  const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
  const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
    this.deleteUser(values.ci);
    dialogRef.close();
  });
}

deleteUser(id_User: any) {
  this.usuarioService.delete(id_User).subscribe((response: any) => {
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

onChange(status: any, ci: any) {
  var data = {
    estado: status.toString(),
    ci: ci
  }
 //console.log(data);
  this.usuarioService.updateStatus(data).subscribe((response: any) => {
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

    //pdf
    
    generateReport() {    

      const pdf = new jsPDF();  
       //const content = document.getElementById('report-content');   
     
        /* html2canvas(content).then(canvas => {
          const imgData = canvas.toDataURL('assets/img/image.png'); 
          pdf.addImage(imgData, 'PNG', 20, 50, 150, 100);//lugar en el espacio 5 , 5 tamaño de la imagen 30 , 15
    
          const currentDate = new Date();
          const footerText = `Generado el ${currentDate.toLocaleDateString()} a las ${currentDate.toLocaleTimeString()} por `+ this.usuario + ' '+ this.ap + ' '+this.am ;   
          pdf.setFontSize(10);
          pdf.text(footerText,10,280);
          const pdfBlob = pdf.output('blob');
          const pdfUrl = URL.createObjectURL(pdfBlob);
    
          window.open(pdfUrl, '_blank'); // Abre el PDF en una nueva ventana
        }); */

        const content: HTMLElement = document.getElementById('report-content')!;
  
              html2canvas(content).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                console.log(pdfHeight );

                const currentDate = new Date();
                const footerText = `Generado el ${currentDate.toLocaleDateString()} a las ${currentDate.toLocaleTimeString()} por `+ this.usuario + ' '+ this.ap + ' '+this.am ;
                pdf.setFontSize(10);
                pdf.text(footerText,10,280);


                  // Agregar imagen
                const logo = new Image();
                logo.src = 'assets/img/logo_sihita.png';
                pdf.addImage(logo, 'PNG', 10, 10, 25, 25);
                

                pdf.addImage(imgData, 'PNG', 0, 50, 265, 50);
                //pdf.save('report.pdf');
                const pdfBlob = pdf.output('blob');
                const pdfUrl = URL.createObjectURL(pdfBlob);
                window.open(pdfUrl, '_blank'); // Abre el PDF en una nueva ventana

              });
      
    } 
}
