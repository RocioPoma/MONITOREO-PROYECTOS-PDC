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



import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { image } from 'html2canvas/dist/types/css/types/image';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
  tabla:any;
  

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
      this.tabla=response;
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
      const currentDate = new Date().toLocaleDateString();
      //const tableBody = this.tabla.map(person => [person.nombre, person.ci, person.rol]);      
      const tableBody = [];
      for (let i = 0; i < this.tabla.length; i++) {
        const person = this.tabla[i];
        tableBody.push([person.ci, person.nombre +' '+ person.ap_paterno +' '+ person.ap_materno, person.telefono, person.celular, person.rol, person.nombre_entidad]);
      }

      const logo = new Image();
      logo.src = '../../../assets/img/logo_sihita.png';
      console.log(tableBody);
      const documentDefinition = {
        
        //carguemos imagen
        images: {
          building: 'data:image/png;base64,../../../assets/img/logo_sihita.png'},
         // encabezado  
   
        header: () => (
          { text: 'Encabezado del PDF', 
          alignment: 'center', margin: [0, 10], 
          image: logo, width: 50, height: 50 }
      
          ),

       //margenes
          pageMargins: [ 40, 60, 40, 60 ],
          Times: {
            normal: 'Times-Roman',           
          },
          //contenido tablas e informacion
            content: [              
               'Datos de Personas\n\n',
              {
                
                      table: {
                        headerRows: 1,
                        widths: ['*', '*' , '*', '*', '*', '*'],
                        body: [
                          ['Ci', 'nombre completo','telefono','celular','rol','entidad'],
                         ...tableBody
                        ]
                      },	
                      fontSize: 8,
                      italics: true

              },             
            ],


            //footer pie de pagina
            footer: () => ({
              columns: [
                { text: `Usuario: ${this.usuario+' '+this.ap+' '+this.am}`, alignment: 'left', margin: [10, 0] },
                { text: `Fecha: ${currentDate}`, alignment: 'right', margin: [0, 0] }
              ],
              margin: [40, 0]
            })
            
          };
          
          pdfMake.createPdf(documentDefinition).open();
        }
    
        
    



    
}
