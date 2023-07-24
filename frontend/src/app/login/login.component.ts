import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { GlobalCostants } from '../shared/global-constants';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: any = FormGroup;
  responseMessage: any;
  xusuario: any;



  constructor(private formBuilder: FormBuilder,
    private router: Router,
    //private userService: UserService,
    private dialogRef: MatDialogRef<LoginComponent>,
    ) { }


  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(GlobalCostants.emailRegex)]],
      password: [null, Validators.required]
    })
  }

  handleSubmit() {
    this.dialogRef.close();
    this.router.navigate(['/pproyecto']);
  }




  ejecutar( cro: Router, xnombre: string) {
    cro.navigate([{ outlets: { pie: ['proyecto/pie/', xnombre] } }]);
    
  }

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
