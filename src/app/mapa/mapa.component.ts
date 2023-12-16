import { Component, QueryList, ViewChildren } from '@angular/core';

import {MapInfoWindow, MapMarker} from '@angular/google-maps'

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent {

  markeri = {
    position: { lat: 44.7988288, lng: 20.3674271},
 }
 markeriA = {
   position: { lat: 44.7918288, lng: 20.3674271},
}

  mapOptions: google.maps.MapOptions = {
    center: { lat: 44.7988288, lng: 20.3674271 },
    zoom : 14,
    styles: [
      {
          "featureType": "administrative",
          "elementType": "labels.text.fill",
          "stylers": [
              {
                  "color": "#444444"
              }
          ]
      },
      {
          "featureType": "landscape",
          "elementType": "all",
          "stylers": [
              {
                  "color": "#f2f2f2"
              }
          ]
      },
      {
          "featureType": "poi",
          "elementType": "all",
          "stylers": [
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "road",
          "elementType": "all",
          "stylers": [
              {
                  "saturation": -100
              },
              {
                  "lightness": 45
              }
          ]
      },
      {
          "featureType": "road.highway",
          "elementType": "all",
          "stylers": [
              {
                  "visibility": "simplified"
              }
          ]
      },
      {
          "featureType": "road.arterial",
          "elementType": "labels.icon",
          "stylers": [
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "transit",
          "elementType": "all",
          "stylers": [
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "water",
          "elementType": "all",
          "stylers": [
              {
                  "color": "#46bcec"
              },
              {
                  "visibility": "on"
              }
          ]
      }
  ]

  
 }
 @ViewChildren(MapInfoWindow) infoWindowsView !: QueryList<MapInfoWindow>;

 a = [0,1];

 openInfoWindow(marker: MapMarker, windowIndex: number) {
   console.log(windowIndex);
   this.infoWindowsView.get(windowIndex)?.open(marker);

 }

}
