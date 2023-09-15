import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { GlobalCostants } from '../shared/global-constants';
import { LoginService } from '../services/login.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: any = FormGroup;
  responseMessage: any;
  xusuario: any;
  errorMessage: string = '';


  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private userService: LoginService,
    private dialogRef: MatDialogRef<LoginComponent>,
    private snackBar: MatSnackBar
    ) { }


  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(GlobalCostants.emailRegex)]],
      password: [null, Validators.required]
    })
  }

  handleSubmit() {
    this.dialogRef.close();
   
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;
    //console.log(email,password);

    this.userService.login(email, password).subscribe(
      (response) => {
               
          // Maneja la respuesta del servidor aquí (por ejemplo, almacena el token en el almacenamiento local)
        this.userService.setRol(response.data.rol);
        this.userService.setNombre(response.data.nombre);
        this.userService.setAp(response.data.ap_paterno);
        this.userService.setAm(response.data.ap_materno);
        this.userService.setEstado(response.data.estado);
        this.userService.setEntidad(response.data.nombre_entidad);
        this.userService.setCi(response.data.ci);
        console.log(response);
        console.log('Token:', response.token);
        this.userService.setAuthToken(response.token);
        this.router.navigate(['/layout/reportes-proyectos']);   
        
      },
      (error) => {
        // Maneja el error si falla la autenticación
        console.error('Error:', error);
        this.openSnackBar('Nombre de usuario o contraseña incorrecta', 'Cerrar');
      }
    );

  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000, // Duración en milisegundos
      horizontalPosition: 'center', // Posición horizontal ('start', 'center', 'end', 'left' o 'right')
      verticalPosition: 'bottom', // Posición vertical ('top' o 'bottom')
    });
  }


 /*  ejecutar( cro: Router, xnombre: string) {
    cro.navigate([{ outlets: { pie: ['proyecto/pie/', xnombre] } }]);
    
  }
 */
/*
  username: any;
  password: any;
  constructor(
    private router: Router,
    private dialogRef: MatDialogRef<LoginComponent>
  ) { }

  ngOnInit(): void {
  }
  // Función para cerrar el diálogo emergente
  onClose(): void {
    this.dialogRef.close();
  }
  // Función para realizar el inicio de sesión
  onLogin(username: string, password: string): void {
    // Aquí puedes implementar la lógica de autenticación con los datos ingresados
    // Por ejemplo, puedes enviar los datos al servidor para validar el inicio de sesión
    // Si la autenticación es exitosa, puedes cerrar el diálogo y realizar otras acciones necesarias
    console.log(username, password);
    this.router.navigateByUrl('/dashboard');
    this.dialogRef.close();
  }*/
}
