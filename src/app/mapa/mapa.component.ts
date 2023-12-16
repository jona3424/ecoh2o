
import { Component, ViewEncapsulation, QueryList, ViewChildren } from '@angular/core';

import {MapInfoWindow, MapMarker} from '@angular/google-maps'
import Station from '../models/station';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class MapaComponent {

    // stationMarkerOptions: google.maps.MarkerOptions = {
    //     icon: 'assets/images/green_pulsing_dot.svg',
    // };

    getMarkerIcon(color: 'green' | 'red' | 'yellow'): google.maps.Icon {
        // Construct the path to the SVG asset
        const svgPath = `assets/images/${color}_pulsing_dot.svg`;
        
        return {
          url: svgPath,
          anchor: new google.maps.Point(16, 16),
        };
      }

  mapOptions: google.maps.MapOptions = {
    center: { lat: 44.7811458, lng: 20.3697531},
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
  ],
  streetViewControl: false,
    fullscreenControl: false,
    rotateControl: false,
    mapTypeControl: false,
    zoomControl: false, 
    scaleControl: false,
    panControl: false,

 }
 @ViewChildren(MapInfoWindow) infoWindowsView !: QueryList<MapInfoWindow>;

 openInfoWindow(marker: MapMarker, windowIndex: number) {
   console.log(windowIndex);
   this.infoWindowsView.get(windowIndex)?.open(marker);

 }

 stations : Station[] | undefined;

	constructor(private readonly db: DatabaseService) {

	}

	ngOnInit(): void {
		this.db.getStations().then(stations => {
			console.log(stations);
			this.stations = stations;
		});
	}
}
