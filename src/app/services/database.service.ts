import { Injectable } from '@angular/core';
import { collection, getDocs } from 'firebase/firestore';
import { db } from 'src/firebase';
import Station, { stationConverter } from '../models/station';
import Measurement, { measurementConverter } from '../models/measurement';

@Injectable({
	providedIn: 'root'
})
export class DatabaseService {
	constructor() { }

	async getStations() : Promise<Station[]> {
		const coll = collection(db, "stations").withConverter(stationConverter);
		const docs = await getDocs(coll);
		const data = docs.docs.map(doc => doc.data());

		return data;
	}

	async getMeasurements(station: Station) : Promise<Measurement[]> {
		const coll = collection(db, `stations/${station.id}/measurements`).withConverter(measurementConverter);
		const docs = await getDocs(coll);
		const data = docs.docs.map(doc => doc.data());

		return data;
	}
}
