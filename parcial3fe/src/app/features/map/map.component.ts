import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { PruebaService } from '../../services/prueba.service';
import { Gasto } from '../../interfaces/gasto';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit{
  gastos: any;
  location = {latitude: 36.7213, longitude: -4.4213};
  marker1 = {latitude: 36.7213, longitude: -4.4213};
  marker2 = {latitude: 36.7213, longitude: -4.0};
  private map!: L.Map;

  constructor(private http: HttpClient, private route: ActivatedRoute, private pruebaService: PruebaService){}
  
  ngOnInit(): void {
    this.pruebaService.getAllPruebas().subscribe((data) => {
      this.gastos = data
      this.initMap(this.location); 
      this.updateMarkers();
      console.log(this.gastos);
    });
  }

  /**Inicia un mapa con la localización enviada por atributo.*/
  private initMap(location: { latitude: number; longitude: number }): void {

    this.map = L.map('map').setView([this.location.latitude, this.location.longitude], 200);
    
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 15,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'  
    }).addTo(this.map);

    //POSIBLES MARCADORES QUE PODEIS PROBAR:
  
    /*L.marker([location.latitude, location.longitude])
      .addTo(map)
      .openPopup();*/

    /*L.circle([location.latitude, location.longitude], {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 500
    }).addTo(map);*/
  }
  /**Crea un marker en cada posición enviada como array*/
  updateMarkers(): void {
    for (const gasto of this.gastos) {
      const { lat, lon, concepto, lugar , importe} = gasto;
      if (lat !== undefined && lon !== undefined) {
        L.marker([lat, lon])
          .addTo(this.map)
          .bindPopup(`Concepto: ${concepto}<br>Lugar: ${lugar}<br>Importe: ${importe}`)
          .openPopup();
      }
    }
  }
  
}




