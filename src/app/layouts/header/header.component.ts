import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationComponent } from 'src/app/components/dialog/confirmation/confirmation.component';
//import { ConfirmationComponent } from 'src/app/component/dialog/confirmation/confirmation.component';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  role: any;
  constructor(private router: Router,
    private dialog: MatDialog) {
  }
  logout(){ 
    const dialogConfig= new MatDialogConfig();
    dialogConfig.data = {
      message: 'cerrar sesión'
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe(() => {
      dialogRef.close()
      localStorage.clear();
      this.router.navigate(['/']);
    })
  }
/*
  changePassword(){
    const dialogConfig= new MatDialogConfig();
    dialogConfig.width="550px";
    this.dialog.open(ChangePasswordComponent, dialogConfig);
  }
*/
}
