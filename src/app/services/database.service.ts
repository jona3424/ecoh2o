import { Injectable } from '@angular/core';
import { collection, getDocs, limit, orderBy, query, doc, getDoc } from 'firebase/firestore';
import { db } from 'src/firebase';
import Station, { stationConverter } from '../models/station';
import Measurement, { Status, measurementConverter, validateMeasurement } from '../models/measurement';

@Injectable({
	providedIn: 'root'
})
export class DatabaseService {
	constructor() { }

	async getStation(id: string) : Promise<Station | undefined> {
		const ref = doc(db, "stations", id).withConverter(stationConverter);
		const document = await getDoc(ref);
		if (!document.exists())
			return undefined;

		const station = document.data();
		station.latest_measurement = await this.getLatestMeasurement(station);

		return station;
	}

	async getStations() : Promise<Station[]> {
		const coll = collection(db, "stations").withConverter(stationConverter);
		const { docs } = await getDocs(coll);
		const stations = docs.map(doc => doc.data());

		for (const station of stations){
			station.latest_measurement = await this.getLatestMeasurement(station);
			
        	var color = "green";
			if(station.latest_measurement){
				switch(station.latest_measurement.status){
					case Status.Critical : color = "red";break;
					case Status.Warning : color = "yellow";break;
				}
			}
			 // Construct the path to the SVG asset
			 const svgPath = `assets/images/${color}_pulsing_dot.svg`;
        
			 station.icon =  {
				 url: svgPath,
				 anchor: new google.maps.Point(16, 16),
			   };
		}

		return stations;
	}

	async getLatestMeasurement(station: Station) : Promise<Measurement | undefined> {
		const coll = collection(db, `stations/${station.id}/measurements`).withConverter(measurementConverter);
		const {docs, empty} = await getDocs(query(coll, orderBy("created_at", "desc"), limit(1)));
		if (empty)
			return undefined;

		const measurement = docs[0].data();
		validateMeasurement(measurement);

		return measurement;
	}

	async getMeasurements(station: Station) : Promise<Measurement[]> {
		const coll = collection(db, `stations/${station.id}/measurements`).withConverter(measurementConverter);
		const { docs } = await getDocs(coll);

		const measurements = docs.map(doc => doc.data());
		measurements.forEach(validateMeasurement);
		
		return measurements;
	}
}
