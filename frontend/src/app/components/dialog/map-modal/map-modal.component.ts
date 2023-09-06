import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss']
})
export class MapModalComponent {

  polygon: any; // Variable para el polígono

  constructor(
    public dialogRef: MatDialogRef<MapModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngAfterViewInit() {
    // Inicializa el mapa en el div con id 'map'
    const map = L.map('map').setView([-16.5000, -64.0000], 6);

    // Capa TileLayer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Capa TileLayer (Google Maps)
    /*L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      maxZoom: 19,
      attribution: '© <a href="https://developers.google.com/maps/terms">Google Maps</a> contributors'
    }).addTo(map);*/

    // Capa TileLayer (Stamen)
    /*L.tileLayer('http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>'
    }).addTo(map);*/

    fetch('../../../../../assets/capas/cuenca1.geojson')
      .then(response => response.json())
      .then(geojson => {
        console.log('entro a fetch del mapa');

        if (geojson.features && geojson.features.length > 0) {
          const firstFeature = geojson.features[0];

          // Accede a la geometría del polígono en la propiedad "geometry"
          this.polygon = L.geoJSON(firstFeature.geometry, {
            style: {
              color: 'red',       // Color del borde del polígono
              weight: 2,           // Grosor del borde del polígono
              fillOpacity: 0.2     // Opacidad del relleno del polígono
            }
          }).addTo(map);

          // Agrega un evento de clic para verificar si el punto está dentro del polígono
          map.on('click', (e) => {
            const latlng = e.latlng;
            if (this.polygon.getBounds().contains(latlng)) {
              console.log('El punto está dentro del polígono.');
              const coords = e.latlng;
              // Envía las coordenadas de regreso al componente padre
              this.dialogRef.close(coords);
            } else {
              alert('El punto no está dentro de la cuenca.');
            }
          });
        } else {
          console.error('El GeoJSON no contiene un polígono válido.');
        }
      })
      .catch(error => {
        console.error('Error al cargar el GeoJSON:', error);
      });
  }

}
