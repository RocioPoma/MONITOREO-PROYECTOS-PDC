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
  
                const myIcon = L.icon({
                  iconUrl: '../../../../../assets/img/map_icon.png', // Debe coincidir con la ruta registrada
                  iconSize: [30, 30], // Tamaño del ícono
                });
            
                
  
                const marker = L.marker(latlng,{icon:myIcon}).addTo(map);
                const popup = marker.bindPopup('Ubicación dentro de la cuenca').openPopup();
            
                // Cierra el globo después de 1 segundo (1000 milisegundos)
                setTimeout(() => {
                  popup.closePopup();
                }, 5000);
            
                
                const coords = e.latlng;
                // Envía las coordenadas de regreso al componente padre
                //this.dialogRef.close(coords);
              } else {
                alert('El punto no está dentro de la cuenca.');
              }
            });
        /*  map.on('click', (e) => {
            const latlng = e.latlng;
            if (this.polygon.getBounds().contains(latlng)) {
              console.log('El punto está dentro del polígono.');
              const myIcon = L.icon({
                iconUrl: '../../../../../assets/img/map_icon.png', // Debe coincidir con la ruta registrada
                iconSize: [30, 30], // Tamaño del ícono
              });

              // Crea un Popup personalizado con botones
              const popupContent = `
                <div>
                  <h3>Ubicación dentro de la cuenca</h3>
                  <p>¿Desea guardar la ubicación?</p>
                  <button id="btn-aceptar">Aceptar</button>
                  <button id="btn-cerrar">Cerrar</button>
                </div>
              `;

              const marker = L.marker(latlng, { icon: myIcon }).addTo(map);
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
          });*/

        } else {
          console.error('El GeoJSON no contiene un polígono válido.');
        }
      })
      .catch(error => {
        console.error('Error al cargar el GeoJSON:', error);
      });
  }

}
