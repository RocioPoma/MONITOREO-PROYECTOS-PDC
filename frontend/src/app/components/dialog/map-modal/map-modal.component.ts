import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss']
})
export class MapModalComponent {
 
  constructor(
    public dialogRef: MatDialogRef<MapModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
) {}


  ngAfterViewInit() {
    // Inicializa el mapa en el div con id 'map'
    const map = L.map('map').setView([-16.5000, -64.0000], 6);

    // Agrega una capa TileLayer (por ejemplo, OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Agrega un evento de clic para obtener coordenadas
    map.on('click', (e) => {
        const coords = e.latlng;
        // Envía las coordenadas de regreso al componente padre
        this.dialogRef.close(coords);
    });
}


}
