//----------------------------------------------------------------------------
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
  coordenada_x: any;
  coordenada_y: any;
  marker: any; // Variable para el marcador

  constructor(
    public dialogRef: MatDialogRef<MapModalComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {
    this.coordenada_x = this.dialogData.coordenada_x;
    this.coordenada_y = this.dialogData.coordenada_y;
  }

  ngAfterViewInit() {
    // Inicializa el mapa en el div con id 'map'
    const map = L.map('map').setView([-21.5355, -64.7293], 9.2); // Coordenadas de Tarija, Bolivia

    // Capa TileLayer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    fetch('../../../../../assets/capas/cuenca1.geojson')
      .then(response => response.json())
      .then(geojson => {
        if (geojson.features && geojson.features.length > 0) {
          const firstFeature = geojson.features[0];

          // Accede a la geometría del polígono en la propiedad "geometry"
          this.polygon = L.geoJSON(firstFeature.geometry, {
            style: {
              color: 'red',
              weight: 2,
              fillOpacity: 0.2
            }
          }).addTo(map);

          const myIcon = L.icon({
            iconUrl: '../../../../../assets/img/map_icon.png',
            iconSize: [23, 27],
          });

           // Agrega marcadores en coordenada_x y coordenada_y
           if (this.coordenada_x && this.coordenada_y) {

            const xMarker = L.marker([this.coordenada_x, this.coordenada_y], { icon: myIcon }).addTo(map);
            xMarker.bindPopup('Punto de coordenadas').openPopup();

            const polygonBounds = this.polygon.getBounds();
            const point = L.latLng(this.coordenada_x, this.coordenada_y);

            if (polygonBounds.contains(point)) {
              console.log('El punto está dentro de la cuenca.');
            } else {
              alert('El punto no está dentro de la cuenca.');
            }
          }

          map.on('click', (e) => {
            const latlng = e.latlng;
            if (this.polygon.getBounds().contains(latlng)) {
              console.log('El punto está dentro del polígono.');

              // Eliminar el marcador anterior si existe
              if (this.marker) {
                map.removeLayer(this.marker);
              }

              // Crea un nuevo marcador y Popup
              this.marker = L.marker(latlng, { icon: myIcon }).addTo(map);
              const popupContent = `
                <div>
                  <h3>Ubicación dentro de la cuenca</h3>
                  <p>¿Desea guardar la ubicación?</p>
                  <button id="btn-aceptar">Aceptar</button>
                  <button id="btn-cerrar">Cerrar</button>
                </div>
              `;
              const popup = L.popup()
                .setLatLng(latlng)
                .setContent(popupContent)
                .openOn(map);

              // Agrega eventos a los botones
              document.getElementById('btn-aceptar').addEventListener('click', () => {
                const coords = e.latlng;
                // Envía las coordenadas de regreso al componente padre
                this.dialogRef.close(coords);
                console.log('Aceptar clicado');
              });

              document.getElementById('btn-cerrar').addEventListener('click', () => {
                // Cierra el Popup al hacer clic en "Cerrar"
                map.closePopup(popup);
              });
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
