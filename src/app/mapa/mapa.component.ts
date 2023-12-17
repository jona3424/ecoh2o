
import { Component, ViewEncapsulation, QueryList, ViewChildren, ViewChild, ElementRef, NgZone } from '@angular/core';

import {GoogleMap, MapInfoWindow, MapMarker} from '@angular/google-maps'
import Station from '../models/station';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class MapaComponent {

private open : number = -1;
private lat : number = 44.7811458;
private lng : number = 20.3697531;
private map: google.maps.Map | undefined;



@ViewChild('googleMapSearch', { static: true }) searchElementRef!: ElementRef;
@ViewChild(GoogleMap) googleMap!: GoogleMap;

  mapOptions: google.maps.MapOptions = {
    center: { lat: this.lat, lng: this.lng},
    zoom : 12,
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
    
    if(windowIndex == this.open){

        this.infoWindowsView.get(this.open)?.close();
        this.open = -1;
    }else{
        if(this.open != -1){
            this.infoWindowsView.get(this.open)?.close();
        }
        this.open = windowIndex;
        this.infoWindowsView.get(windowIndex)?.open(marker);
    }
 }

 stations : Station[] | undefined;

 constructor(
    private readonly db: DatabaseService,
    private ngZone: NgZone
  ) {
  }

  ngOnInit(): void {
    this.db.getStations().then(stations => {
      this.stations = stations;
    });
  
    this.initAutocomplete();
  }

    
    private autocomplete: google.maps.places.Autocomplete | null = null;

    private initAutocomplete(): void {
        if (this.autocomplete) {
          google.maps.event.clearInstanceListeners(this.autocomplete);
        }
      
        this.autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
        this.autocomplete.addListener('place_changed', () => {
            this.ngZone.run(() => {
              if (!this.autocomplete) return;
              const place = this.autocomplete.getPlace();
              if (place.geometry?.viewport) {
                // If the place has a viewport, use it to set the map bounds
                this.googleMap.fitBounds(place.geometry.viewport);
              } else if (place.geometry?.location) {
                // If no viewport, just set the center and zoom in
                this.googleMap.panTo(place.geometry.location);
                this.googleMap.zoom = 15; // You can adjust the zoom level
              }
            });
          });
      }
      

}
