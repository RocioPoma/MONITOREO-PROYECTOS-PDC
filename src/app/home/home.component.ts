import { Component } from '@angular/core';

//para login
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(private router: Router,
    private dialog: MatDialog) { }

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginComponent);

    // Opcional: Puedes suscribirte al evento afterClosed para realizar acciones después de cerrar el diálogo
    dialogRef.afterClosed().subscribe(result => {
      // Aquí puedes realizar acciones adicionales después de cerrar el diálogo
    });
  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }

  click(page: string){
   // console.log(page);
  };
}
