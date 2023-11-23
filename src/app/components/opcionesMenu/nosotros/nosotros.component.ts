import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NosotrosService } from 'src/app/services/nosotros.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalCostants } from 'src/app/shared/global-constants';
import { environment } from 'src/environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-nosotros',
  templateUrl: './nosotros.component.html',
  styleUrls: ['./nosotros.component.scss']
})
export class NosotrosComponent {
  currentYear: number = new Date().getFullYear();
  responseMessage: any;
  nosotros: any = [];
  //----url del servidor backend
  url = environment.apiUrl;
  //----creamos la url para las imagenes
  fileURL = this.url + '/uploads/documents/';
  linkVideo: any;
  documentoGeneral: any;
  manualUsuario: any;
  manualDesarrollo: any;
  iEEE830: any;

  constructor(
    private router: Router,
    private NosotrosServise: NosotrosService,
    private snackbarService: SnackbarService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.getDataNosotros();
  }

  //------------------- OBTENEMOS MUNICIPIO
  getDataNosotros() {
    this.NosotrosServise.getNosotros().subscribe((response: any) => {
      this.nosotros = response;
      this.linkVideo = this.sanitizer.bypassSecurityTrustResourceUrl(this.nosotros[0].link_video);
      this.documentoGeneral = this.sanitizer.bypassSecurityTrustResourceUrl(this.fileURL + this.nosotros[0].documento_general);
      this.manualUsuario = this.sanitizer.bypassSecurityTrustResourceUrl(this.fileURL +this.nosotros[0].manual_usuario);
      this.manualDesarrollo = this.sanitizer.bypassSecurityTrustResourceUrl(this.fileURL +this.nosotros[0].manual_desarrollo);
      this.iEEE830 = this.sanitizer.bypassSecurityTrustResourceUrl(this.fileURL +this.nosotros[0].eee_830);
      //console.log('link video: ', this.linkVideo)
    }, (error: any) => {
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalCostants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalCostants.error);

    });
  }

}
